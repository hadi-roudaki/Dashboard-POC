require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 4000,
  MONGODB_URI: process.env.MONGODB_URI || "update me with your MongoDB URI",
  NODE_ENV: process.env.NODE_ENV || "development",
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 200,
};
