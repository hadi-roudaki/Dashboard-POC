const express = require("express");
const { param } = require("express-validator"); // Add this import
const Order = require("../models/Order"); // Add this import
const router = express.Router();
const { getOrderDetails } = require("../controllers/order");

router.get(
  "/:orderId",
  [
    param("orderId")
      .trim()
      .notEmpty()
      .withMessage("Order ID is required")
      .isString()
      .withMessage("Order ID must be a string")
      .custom(async (value) => {
        const order = await Order.findOne({ orderId: value });
        if (!order) {
          throw new Error("Order not found");
        }
        return true;
      }),
  ],
  getOrderDetails
);

module.exports = router;
