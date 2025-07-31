const { validationResult } = require("express-validator");
const Order = require("../models/Order");
const { DateTime } = require("luxon");

exports.getOrderDetails = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .lean()
      .exec();


    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Timezone conversion
    const regionTimezones = {
      APAC: "Australia/Sydney",
      UK: "Europe/London",
      US: "America/New_York",
    };

    const response = {
      success: true,
      data: {
        ...order,
        formattedAmount: (order.amount / 100).toLocaleString(
          order.region === "APAC"
            ? "en-AU"
            : order.region === "UK"
            ? "en-GB"
            : "en-US",
          {
            style: "currency",
            currency: order.currency,
          }
        ),
        localOrderDate: DateTime.fromJSDate(order.orderDate)
          .setZone(regionTimezones[order.region])
          .toLocaleString(DateTime.DATETIME_FULL),
        localDeliveryDate: order.deliveryDate
          ? DateTime.fromJSDate(order.deliveryDate)
              .setZone(regionTimezones[order.region])
              .toLocaleString(DateTime.DATETIME_FULL)
          : null,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
