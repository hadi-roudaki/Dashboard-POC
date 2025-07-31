const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Order = require('../models/Order');
const { MONGODB_URI } = require('../config');
const { DateTime } = require('luxon');

const REGION_CONFIG = {
  APAC: {
    currency: 'AUD',
    timezone: 'Australia/Sydney',
    minAmount: 1000, // $1,000 AUD
    maxAmount: 20000 // $20,000 AUD
  },
  UK: {
    currency: 'GBP',
    timezone: 'Europe/London',
    minAmount: 500, // £500 GBP
    maxAmount: 15000 // £15,000 GBP
  },
  US: {
    currency: 'USD',
    timezone: 'America/New_York',
    minAmount: 800, // $800 USD
    maxAmount: 18000 // $18,000 USD
  }
};

const PRODUCT_CATEGORIES = [
  'Sofas', 'Modular Sofas', 'Armchairs', 'Dining Tables',
  'Dining Chairs', 'Coffee Tables', 'Side Tables', 'Beds',
  'Outdoor Furniture', 'Home Accessories'
];

const generateOrder = (region, orderDate) => {
  const config = REGION_CONFIG[region];
  const itemCount = faker.number.int({ min: 1, max: 5 }); // Updated
  const items = Array.from({ length: itemCount }, () => ({
    productId: faker.string.uuid(), // Updated
    name: faker.commerce.productName(),
    category: faker.helpers.arrayElement(PRODUCT_CATEGORIES),
    quantity: faker.number.int({ min: 1, max: 3 }), // Updated
    unitPrice: faker.number.int({ 
      min: config.minAmount / 5, 
      max: config.maxAmount / 3 
    }), // Updated
    imageUrl: faker.image.urlLoremFlickr({ category: 'furniture' }) // Updated
  }));

  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const amount = subtotal * (1 + faker.number.float({ min: 0.05, max: 0.15 })); // Updated

  return {
    orderId: `${region}-${orderDate.toISOString().split('T')[0].replace(/-/g, '')}-${faker.number.int({ min: 1000, max: 9999 })}`, // Updated
    region,
    amount: Math.round(amount),
    currency: config.currency,
    items,
    customer: {
      id: faker.string.uuid(), // Updated
      name: faker.person.fullName(), // Updated
      email: faker.internet.email(),
      isTrade: faker.datatype.boolean({ probability: 0.2 }) // Updated
    },
    orderDate,
    deliveryDate: faker.date.between({
      from: orderDate,
      to: DateTime.fromJSDate(orderDate).plus({ days: 14 }).toJSDate()
    }),
    status: faker.helpers.arrayElement([
      'pending', 'confirmed', 'processing', 'shipped', 'delivered'
    ]),
    paymentMethod: faker.helpers.arrayElement([
      'credit_card', 'bank_transfer', 'paypal', 'afterpay', 'klarna'
    ]),
    shippingAddress: {
      street: faker.location.streetAddress(), // Updated
      city: faker.location.city(), // Updated
      state: faker.location.state(), // Updated
      postalCode: faker.location.zipCode(), // Updated
      country: region === 'APAC' ? 'Australia' : 
               region === 'UK' ? 'United Kingdom' : 'United States'
    }
  };
};

const generateOrders = async (ordersPerRegion = 5000) => {
  try {
    await mongoose.connect(MONGODB_URI);
    await Order.deleteMany({});

    const orders = [];
    const startDate = new Date(2023, 0, 1);
    const endDate = new Date();

    for (const region of Object.keys(REGION_CONFIG)) {
      for (let i = 0; i < ordersPerRegion; i++) {
        const orderDate = faker.date.between({
          from: startDate,
          to: endDate
        });
        orders.push(generateOrder(region, orderDate));
      }
    }

    // Batch insert for better performance
    const batchSize = 500;
    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, i + batchSize);
      await Order.insertMany(batch);
      console.log(`Inserted ${Math.min(i + batchSize, orders.length)}/${orders.length} orders`);
    }

    console.log(`Successfully generated ${orders.length} orders across ${Object.keys(REGION_CONFIG).length} regions`);
  } catch (err) {
    console.error('Error generating orders:', err);
  } finally {
    await mongoose.disconnect();
  }
};

// Start with a smaller number for testing (e.g., 10 per region)
generateOrders(3000).catch(console.error);