const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const productCategories = [
  'Sofas', 'Modular Sofas', 'Armchairs', 'Dining Tables', 
  'Dining Chairs', 'Coffee Tables', 'Side Tables', 'Beds',
  'Outdoor Furniture', 'Home Accessories'
];

const orderSchema = new mongoose.Schema({
  orderId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  region: { 
    type: String, 
    required: true, 
    enum: ['APAC', 'UK', 'US'],
    index: true 
  },
  amount: { 
    type: Number, 
    required: true,
    index: true 
  },
  currency: { 
    type: String, 
    required: true,
    enum: ['SGD', 'GBP', 'USD', 'AUD'],
    default: function() {
      const regionCurrencies = { 
        'APAC': 'AUD', 
        'UK': 'GBP', 
        'US': 'USD' 
      };
      return regionCurrencies[this.region];
    }
  },
  items: [{
    productId: { type: String, index: true },
    name: String,
    category: { 
      type: String, 
      enum: productCategories,
      index: true 
    },
    quantity: Number,
    unitPrice: Number,
    imageUrl: String
  }],
  customer: {
    id: { type: String, index: true },
    name: String,
    email: { type: String, index: true },
    isTrade: { type: Boolean, default: false }
  },
  orderDate: { 
    type: Date, 
    required: true,
    index: true 
  },
  deliveryDate: Date,
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
    index: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'bank_transfer', 'paypal', 'afterpay', 'klarna'],
    required: true
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.amountInMillions = parseFloat((ret.amount / 1000000).toFixed(2));
      const regionTimezones = { 
        'APAC': 'Australia/Sydney', 
        'UK': 'Europe/London', 
        'US': 'America/New_York' 
      };
      ret.localOrderDate = DateTime.fromJSDate(ret.orderDate)
        .setZone(regionTimezones[ret.region])
        .toISO();
      return ret;
    }
  }
});

// Compound indexes for common query patterns
orderSchema.index({ region: 1, status: 1 });
orderSchema.index({ region: 1, orderDate: -1 });
orderSchema.index({ 'items.category': 1, region: 1 });
orderSchema.index({ 'customer.email': 1, region: 1 });

// Add text index for search functionality
orderSchema.index({
  'customer.name': 'text',
  'customer.email': 'text',
  'items.name': 'text',
  orderId: 'text'
});

module.exports = mongoose.model('Order', orderSchema);