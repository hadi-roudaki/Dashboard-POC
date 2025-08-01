const Order = require("../models/Order");
const { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require("../config");
const { DateTime } = require("luxon");

const getOrders = async (req, res) => {
  try {
    const {
      regions,
      status,
      categories,
      search,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = "orderDate",
      sortOrder = "desc",
      page = 1,
      limit = DEFAULT_PAGE_SIZE,
    } = req.query;

    // Handle regions parameter - can be string, array, or undefined
    let validatedRegions = ["APAC", "UK", "US"]; // default to all regions
    if (regions) {
      if (Array.isArray(regions)) {
        validatedRegions = regions.filter((r) =>
          ["APAC", "UK", "US"].includes(r)
        );
      } else if (typeof regions === "string") {
        // Single region or comma-separated regions
        validatedRegions = regions
          .split(",")
          .filter((r) => ["APAC", "UK", "US"].includes(r.trim()));
      }
    }

    const validatedPage = Math.max(parseInt(page), 1);
    const validatedLimit = Math.min(
      parseInt(limit) || DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE
    );

    const query = { region: { $in: validatedRegions } };

    if (status) query.status = status;
    if (categories) query["items.category"] = { $in: categories.split(",") };

    if (startDate || endDate) {
      query.orderDate = {};
      if (startDate) {
        query.orderDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.orderDate.$lte = new Date(endDate);
      }
    }

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = parseFloat(minAmount) * 1000000;
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount) * 1000000;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
        .skip((validatedPage - 1) * validatedLimit)
        .limit(validatedLimit)
        .lean(),

      Order.countDocuments(query),
    ]);

    const summary = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$region",
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
          avgOrderValue: { $avg: "$amount" },
          categories: { $addToSet: "$items.category" },
        },
      },
      {
        $project: {
          _id: 0,
          region: "$_id",
          totalOrders: 1,
          totalRevenue: 1,
          avgOrderValue: 1,
          topCategories: { $slice: ["$categories", 5] },
        },
      },
    ]);

    const response = {
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: validatedLimit,
        totalPages:
          validatedLimit > 0 ? Math.ceil(total / validatedLimit) : null,
      },
      summary: summary.reduce((acc, curr) => {
        acc[curr.region] = {
          totalOrders: curr.totalOrders,
          totalRevenue: parseFloat((curr.totalRevenue / 1000000).toFixed(2)),
          avgOrderValue: parseFloat((curr.avgOrderValue / 1000).toFixed(2)),
          topCategories: curr.topCategories,
        };
        return acc;
      }, {}),
      lastUpdated: DateTime.now().toISO(),
    };

    res.json(response);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

module.exports = {
  getOrders,
};
