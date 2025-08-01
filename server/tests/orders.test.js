const request = require("supertest");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const { DateTime } = require("luxon");

// Create app instance for testing without starting the server
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const ordersRoutes = require("../routes/orders");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

// Routes
app.use("/api", ordersRoutes);

// Test database connection
const connectTestDB = async () => {
  const mongoUri = process.env.MONGODB_URI_TEST || "mongodb://localhost:27017/kingliving-orders-test";
  await mongoose.connect(mongoUri);
};

describe("Orders API", () => {
  let testOrders = [];

  beforeAll(async () => {
    // Connect to test database
    await connectTestDB();

    // Clear existing test data
    await Order.deleteMany();

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Create comprehensive test data
    testOrders = [
      {
        orderId: "APAC-20240101-1001",
        region: "APAC",
        amount: 1500000, // $15,000 AUD
        currency: "AUD",
        orderDate: oneMonthAgo,
        deliveryDate: new Date(oneMonthAgo.getTime() + 14 * 24 * 60 * 60 * 1000),
        status: "delivered",
        paymentMethod: "credit_card",
        items: [
          {
            productId: "SOFA-001",
            name: "Modular Sofa",
            category: "Sofas",
            quantity: 1,
            unitPrice: 1500000,
            imageUrl: "https://example.com/sofa.jpg"
          }
        ],
        customer: {
          id: "CUST-001",
          name: "John Smith",
          email: "john.smith@example.com",
          isTrade: false
        },
        shippingAddress: {
          street: "123 Collins Street",
          city: "Melbourne",
          state: "VIC",
          postalCode: "3000",
          country: "Australia"
        }
      },
      {
        orderId: "UK-20240115-2002",
        region: "UK",
        amount: 1200000, // £12,000 GBP
        currency: "GBP",
        orderDate: oneWeekAgo,
        deliveryDate: new Date(oneWeekAgo.getTime() + 10 * 24 * 60 * 60 * 1000),
        status: "processing",
        paymentMethod: "bank_transfer",
        items: [
          {
            productId: "TABLE-001",
            name: "Dining Table",
            category: "Dining Tables",
            quantity: 1,
            unitPrice: 800000,
            imageUrl: "https://example.com/table.jpg"
          },
          {
            productId: "CHAIR-001",
            name: "Dining Chair",
            category: "Dining Chairs",
            quantity: 4,
            unitPrice: 100000,
            imageUrl: "https://example.com/chair.jpg"
          }
        ],
        customer: {
          id: "CUST-002",
          name: "Sarah Johnson",
          email: "sarah.johnson@example.co.uk",
          isTrade: true
        },
        shippingAddress: {
          street: "456 Oxford Street",
          city: "London",
          state: "England",
          postalCode: "W1C 1AP",
          country: "United Kingdom"
        }
      },
      {
        orderId: "US-20240120-3003",
        region: "US",
        amount: 2500000, // $25,000 USD
        currency: "USD",
        orderDate: now,
        deliveryDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
        status: "pending",
        paymentMethod: "paypal",
        items: [
          {
            productId: "BED-001",
            name: "King Size Bed",
            category: "Beds",
            quantity: 1,
            unitPrice: 2500000,
            imageUrl: "https://example.com/bed.jpg"
          }
        ],
        customer: {
          id: "CUST-003",
          name: "Michael Brown",
          email: "michael.brown@example.com",
          isTrade: false
        },
        shippingAddress: {
          street: "789 Fifth Avenue",
          city: "New York",
          state: "NY",
          postalCode: "10022",
          country: "United States"
        }
      },
      {
        orderId: "APAC-20240125-1004",
        region: "APAC",
        amount: 800000, // $8,000 AUD
        currency: "AUD",
        orderDate: now,
        status: "confirmed",
        paymentMethod: "afterpay",
        items: [
          {
            productId: "COFFEE-001",
            name: "Coffee Table",
            category: "Coffee Tables",
            quantity: 1,
            unitPrice: 800000,
            imageUrl: "https://example.com/coffee-table.jpg"
          }
        ],
        customer: {
          id: "CUST-004",
          name: "Emma Wilson",
          email: "emma.wilson@example.com.au",
          isTrade: false
        },
        shippingAddress: {
          street: "321 George Street",
          city: "Sydney",
          state: "NSW",
          postalCode: "2000",
          country: "Australia"
        }
      },
      {
        orderId: "UK-20240130-2005",
        region: "UK",
        amount: 500000, // £5,000 GBP
        currency: "GBP",
        orderDate: now,
        status: "cancelled",
        paymentMethod: "credit_card",
        items: [
          {
            productId: "CHAIR-002",
            name: "Armchair",
            category: "Armchairs",
            quantity: 2,
            unitPrice: 250000,
            imageUrl: "https://example.com/armchair.jpg"
          }
        ],
        customer: {
          id: "CUST-005",
          name: "David Lee",
          email: "david.lee@example.co.uk",
          isTrade: true
        },
        shippingAddress: {
          street: "654 King's Road",
          city: "London",
          state: "England",
          postalCode: "SW3 4LY",
          country: "United Kingdom"
        }
      }
    ];

    await Order.insertMany(testOrders);
  });

  afterAll(async () => {
    // Clean up test data
    await Order.deleteMany();

    // Close database connection
    await mongoose.connection.close();
  });

  describe("GET /api/orders", () => {
    it("should get all orders with default pagination", async () => {
      const res = await request(app).get("/api/orders").expect(200);

      expect(res.body).toHaveProperty("data");
      expect(res.body).toHaveProperty("pagination");
      expect(res.body).toHaveProperty("summary");
      expect(res.body).toHaveProperty("lastUpdated");

      expect(res.body.data.length).toBe(5);
      expect(res.body.pagination.total).toBe(5);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.totalPages).toBe(1);

      // Check data structure
      const order = res.body.data[0];
      expect(order).toHaveProperty("orderId");
      expect(order).toHaveProperty("region");
      expect(order).toHaveProperty("amount");
      expect(order).toHaveProperty("currency");
      expect(order).toHaveProperty("status");
      expect(order).toHaveProperty("orderDate");
      expect(order).toHaveProperty("customer");
      expect(order).toHaveProperty("items");
      expect(order).toHaveProperty("shippingAddress");
    });

    it("should handle pagination correctly", async () => {
      const res = await request(app)
        .get("/api/orders?page=1&limit=2")
        .expect(200);

      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(2);
      expect(res.body.pagination.totalPages).toBe(3);
    });

    it("should filter by single region", async () => {
      const res = await request(app)
        .get("/api/orders?regions=APAC")
        .expect(200);

      expect(res.body.data.length).toBe(2);
      expect(res.body.data.every(order => order.region === "APAC")).toBe(true);
    });

    it("should filter by multiple regions", async () => {
      const res = await request(app)
        .get("/api/orders?regions=APAC&regions=UK")
        .expect(200);

      expect(res.body.data.length).toBe(4);
      expect(res.body.data.every(order => ["APAC", "UK"].includes(order.region))).toBe(true);
    });

    it("should filter by comma-separated regions", async () => {
      const res = await request(app)
        .get("/api/orders?regions=APAC,UK")
        .expect(200);

      expect(res.body.data.length).toBe(4);
      expect(res.body.data.every(order => ["APAC", "UK"].includes(order.region))).toBe(true);
    });

    it("should filter by status", async () => {
      const res = await request(app)
        .get("/api/orders?status=pending")
        .expect(200);

      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].status).toBe("pending");
      expect(res.body.data[0].region).toBe("US");
    });

    it("should filter by date range", async () => {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const res = await request(app)
        .get(`/api/orders?startDate=${oneWeekAgo.toISOString()}`)
        .expect(200);

      expect(res.body.data.length).toBe(4); // Orders from last week and today
      expect(res.body.data.every(order =>
        new Date(order.orderDate) >= oneWeekAgo
      )).toBe(true);
    });

    it("should search orders by customer name", async () => {
      const res = await request(app)
        .get("/api/orders?search=John")
        .expect(200);

      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].customer.name).toContain("John");
    });

    it("should search orders by order ID", async () => {
      const res = await request(app)
        .get("/api/orders?search=APAC-20240101-1001")
        .expect(200);

      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].orderId).toBe("APAC-20240101-1001");
    });

    it("should sort orders by amount ascending", async () => {
      const res = await request(app)
        .get("/api/orders?sortBy=amount&sortOrder=asc")
        .expect(200);

      const amounts = res.body.data.map(order => order.amount);
      for (let i = 1; i < amounts.length; i++) {
        expect(amounts[i]).toBeGreaterThanOrEqual(amounts[i - 1]);
      }
    });

    it("should sort orders by date descending (default)", async () => {
      const res = await request(app)
        .get("/api/orders?sortBy=orderDate&sortOrder=desc")
        .expect(200);

      const dates = res.body.data.map(order => new Date(order.orderDate));
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i]).toBeLessThanOrEqual(dates[i - 1]);
      }
    });

    it("should return summary statistics for all regions", async () => {
      const res = await request(app).get("/api/orders").expect(200);

      expect(res.body.summary).toHaveProperty("APAC");
      expect(res.body.summary).toHaveProperty("UK");
      expect(res.body.summary).toHaveProperty("US");

      // Check APAC summary
      expect(res.body.summary.APAC.totalOrders).toBe(2);
      expect(res.body.summary.APAC.totalRevenue).toBe(2.3); // (1.5 + 0.8) million
      expect(res.body.summary.APAC.avgOrderValue).toBe(1.15); // Average in thousands

      // Check UK summary
      expect(res.body.summary.UK.totalOrders).toBe(2);
      expect(res.body.summary.UK.totalRevenue).toBe(1.7); // (1.2 + 0.5) million

      // Check US summary
      expect(res.body.summary.US.totalOrders).toBe(1);
      expect(res.body.summary.US.totalRevenue).toBe(2.5); // 2.5 million
    });

    it("should handle invalid region filter gracefully", async () => {
      const res = await request(app)
        .get("/api/orders?regions=INVALID")
        .expect(200);

      // Should return all orders when invalid region is provided
      expect(res.body.data.length).toBe(5);
    });

    it("should handle invalid status filter", async () => {
      const res = await request(app)
        .get("/api/orders?status=invalid_status")
        .expect(400); // Should return validation error
    });

    it("should handle invalid pagination parameters", async () => {
      const res = await request(app)
        .get("/api/orders?page=0&limit=-1")
        .expect(200);

      // Should use default values
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBeGreaterThan(0);
    });

    it("should respect maximum page size limit", async () => {
      const res = await request(app)
        .get("/api/orders?limit=1000")
        .expect(200);

      expect(res.body.pagination.limit).toBeLessThanOrEqual(200); // MAX_PAGE_SIZE
    });

    it("should combine multiple filters", async () => {
      const res = await request(app)
        .get("/api/orders?regions=APAC&status=confirmed")
        .expect(200);

      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].region).toBe("APAC");
      expect(res.body.data[0].status).toBe("confirmed");
    });
  });

  describe("GET /api/order/:id", () => {
    it("should get a specific order by ID", async () => {
      const res = await request(app)
        .get("/api/order/APAC-20240101-1001")
        .expect(200);

      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("data");

      const order = res.body.data;
      expect(order.orderId).toBe("APAC-20240101-1001");
      expect(order.region).toBe("APAC");
      expect(order.amount).toBe(1500000);
      expect(order.currency).toBe("AUD");
      expect(order.status).toBe("delivered");
      expect(order.customer.name).toBe("John Smith");
      expect(order.items).toHaveLength(1);
      expect(order.items[0].name).toBe("Modular Sofa");
    });

    it("should return 404 for non-existent order", async () => {
      const res = await request(app)
        .get("/api/order/NON-EXISTENT-ORDER")
        .expect(404);

      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("message", "Order not found");
    });

    it("should return complete order data structure", async () => {
      const res = await request(app)
        .get("/api/order/UK-20240115-2002")
        .expect(200);

      const order = res.body.data;

      // Check all required fields
      expect(order).toHaveProperty("orderId");
      expect(order).toHaveProperty("region");
      expect(order).toHaveProperty("amount");
      expect(order).toHaveProperty("currency");
      expect(order).toHaveProperty("orderDate");
      expect(order).toHaveProperty("status");
      expect(order).toHaveProperty("paymentMethod");

      // Check customer object
      expect(order.customer).toHaveProperty("id");
      expect(order.customer).toHaveProperty("name");
      expect(order.customer).toHaveProperty("email");
      expect(order.customer).toHaveProperty("isTrade");

      // Check items array
      expect(Array.isArray(order.items)).toBe(true);
      expect(order.items.length).toBeGreaterThan(0);

      const item = order.items[0];
      expect(item).toHaveProperty("productId");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("category");
      expect(item).toHaveProperty("quantity");
      expect(item).toHaveProperty("unitPrice");

      // Check shipping address
      expect(order.shippingAddress).toHaveProperty("street");
      expect(order.shippingAddress).toHaveProperty("city");
      expect(order.shippingAddress).toHaveProperty("state");
      expect(order.shippingAddress).toHaveProperty("postalCode");
      expect(order.shippingAddress).toHaveProperty("country");
    });
  });

  describe("Error Handling & Edge Cases", () => {
    it("should handle invalid query parameters gracefully", async () => {
      const res = await request(app)
        .get("/api/orders?page=invalid&limit=invalid")
        .expect(200); // Should use defaults

      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBeGreaterThan(0);
    });

    it("should handle empty search results", async () => {
      const res = await request(app)
        .get("/api/orders?search=NONEXISTENT_CUSTOMER")
        .expect(200);

      expect(res.body.data).toHaveLength(0);
      expect(res.body.pagination.total).toBe(0);
    });

    it("should return consistent data types", async () => {
      const res = await request(app).get("/api/orders").expect(200);

      const order = res.body.data[0];
      expect(typeof order.orderId).toBe("string");
      expect(typeof order.region).toBe("string");
      expect(typeof order.amount).toBe("number");
      expect(typeof order.currency).toBe("string");
      expect(typeof order.status).toBe("string");
      expect(typeof order.customer.isTrade).toBe("boolean");
      expect(Array.isArray(order.items)).toBe(true);
    });

    it("should return valid currency amounts", async () => {
      const res = await request(app).get("/api/orders").expect(200);

      res.body.data.forEach(order => {
        expect(order.amount).toBeGreaterThan(0);
        expect(typeof order.amount).toBe("number");
        expect(["AUD", "GBP", "USD"].includes(order.currency)).toBe(true);
      });
    });
  });
});
