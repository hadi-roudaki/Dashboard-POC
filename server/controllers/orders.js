// controllers/orderController.js
const Order = require("../models/Order");
const { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require("../config");
const { DateTime } = require("luxon");

const regionTimezones = {
  APAC: "Australia/Sydney",
  UK: "Europe/London",
  US: "America/New_York",
};

const getOrders = async (req, res) => {
  try {
    const {
      regions = ["APAC", "UK", "US"],
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

    const validatedPage = Math.max(parseInt(page), 1);
    const parsedLimit = parseInt(limit);
    const validatedLimit = Math.min(
      parseInt(limit) || DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE
    );

    console.log(validatedPage, parsedLimit, validatedLimit);

    const query = { region: { $in: regions } };

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
      if (minAmount) query.amount.$gte = parseFloat(minAmount) * 1_000_000;
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount) * 1_000_000;
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

    console.log(`Fetched ${orders.length} orders for page ${total}`);

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
          totalRevenue: parseFloat((curr.totalRevenue / 1_000_000).toFixed(2)),
          avgOrderValue: parseFloat((curr.avgOrderValue / 1_000).toFixed(2)),
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
