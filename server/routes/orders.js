const express = require("express");
const router = express.Router();
const { getOrders } = require("../controllers/orders");
const { query } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");

router.get(
  "/",
  [
    query("regions").optional().isArray(),
    query("status")
      .optional()
      .isIn([
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ]),
    query("categories").optional().isString(),
    query("search").optional().isString(),
    query("startDate").optional().isISO8601(),
    query("endDate").optional().isISO8601(),
    query("minAmount").optional().isNumeric(),
    query("maxAmount").optional().isNumeric(),
    query("sortBy")
      .optional()
      .isIn(["orderDate", "amount", "status", "region"]),
    query("sortOrder").optional().isIn(["asc", "desc"]),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 200 }),
  ],
  validateRequest,
  getOrders
);


module.exports = router;
