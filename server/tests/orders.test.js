const request = require("supertest");
const app = require("../app");
const Order = require("../models/Order");
const { DateTime } = require("luxon");

describe("Orders API", () => {
  beforeAll(async () => {
    // Seed test data
    await Order.deleteMany();

    const now = new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

    await Order.insertMany([
      {
        orderId: "APAC-20230701-1234",
        region: "APAC",
        amount: 1500000,
        currency: "SGD",
        orderDate: oneMonthAgo,
        status: "delivered",
      },
      {
        orderId: "UK-20230715-5678",
        region: "UK",
        amount: 1200000,
        currency: "GBP",
        orderDate: new Date(),
        status: "processing",
      },
      {
        orderId: "US-20230720-9012",
        region: "US",
        amount: 2500000,
        currency: "USD",
        orderDate: new Date(),
        status: "pending",
      },
    ]);
  });

  it("should get all orders", async () => {
    const res = await request(app).get("/api/orders").expect(200);

    expect(res.body.data.length).toBe(3);
    expect(res.body.data[0]).toHaveProperty("amountInMillions");
  });

  it("should filter by region", async () => {
    const res = await request(app)
      .get("/api/orders?regions=APAC,UK")
      .expect(200);

    expect(res.body.data.length).toBe(2);
    expect(res.body.data.every((o) => ["APAC", "UK"].includes(o.region))).toBe(
      true
    );
  });

  it("should filter by date range", async () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));

    const res = await request(app)
      .get(`/api/orders?startDate=${oneWeekAgo.toISOString()}`)
      .expect(200);

    expect(res.body.data.length).toBe(2); // UK and US orders
  });

  it("should return summary statistics", async () => {
    const res = await request(app).get("/api/orders").expect(200);

    expect(res.body.summary).toHaveProperty("APAC");
    expect(res.body.summary.APAC.totalAmount).toBe(1.5);
  });
});
