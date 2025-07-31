# King Living Orders Dashboard - Backend

## Overview

This is the backend service for the King Living Orders Dashboard, providing a RESTful API to manage and display orders from APAC, UK, and US regions. The backend is built with Node.js, Express, and MongoDB.

## Features

- Multi-region order management (APAC, UK, US)
- Currency support (AUD, GBP, USD)
- Timezone-aware operations
- Scalable architecture for thousands of orders
- Real-time data with auto-refresh
- Comprehensive filtering capabilities
- Full TypeScript support

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Validation**: Joi
- **Logging**: Morgan
- **Security**: Helmet, CORS

## Installation

```bash
git clone https://github.com/your-repo/kingliving-dashboard.git
cd server
npm install
Create .env file:

env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/kingliving-orders
NODE_ENV=development
Running the App
bash
# Development
npm run dev

# Production
npm start

# Generate test data
node scripts/generateOrders.js
API Endpoints
Endpoint	Method	Description
/orders	GET	Get all orders with filters
/orders/:id	GET	Get single order
/orders/:id/status	PATCH	Update order status
Project Structure
text
server/
├── config/         # Configuration
├── controllers/    # Route controllers
├── models/         # MongoDB models
├── routes/         # Express routes
├── scripts/        # Data generation
├── services/       # Business logic
├── tests/          # Test files
└── app.js          # Main application
Testing
bash
npm test
Deployment
bash
# Docker
docker build -t kingliving-backend .
docker run -p 4000:4000 kingliving-backend
Environment Variables
Variable	Required	Default
PORT	No	4000
MONGODB_URI	Yes	-
NODE_ENV	No	development
License
MIT
```

King Living Orders Dashboard - Backend System
AI Prompts Used for Development
Initial Setup:

text
"I need to implement a scalable backend for a furniture order dashboard with regions (APAC, UK, US) that handles different currencies and timezones. The data should be filterable and return values in millions. Only implement the backend using Node.js/Express."
Technical Deep Dive:

text
"Walk me through step-by-step to implement this with proper database schema design, considering we need to handle thousands of orders per region with different product categories based on kingliving.com.au. Focus on MongoDB optimizations."
Error Resolution:

text
"I'm getting 'MongoParseError: option usecreateindex is not supported' when running the app. Help me fix this while maintaining backward compatibility."
Frontend Integration:

text
"Now expand the frontend to be more scalable using React+Vite with Signals for state management. Implement a real-time updating table with row click navigation using Tailwind CSS."
Technical Design Decisions

1. Database Schema Design
   Decision: Used embedded documents for order items instead of separate collection
   Reasoning:

Orders are read-heavy with frequent full document access

Avoids expensive joins during order retrieval

Matches the 1:Many relationship where items don't exist outside orders

2. Currency Handling
   Decision: Store amounts in base currency units (cents/pence)
   Why:

Prevents floating-point rounding errors

Enables precise calculations

Conversion to millions happens in presentation layer

3. Timezone Approach
   Decision: Store dates in UTC with region metadata
   Rationale:

Single source of truth in database

Timezone conversion happens in API response

Enables accurate timezone-aware queries

4. Pagination Strategy
   Decision: Offset-based pagination with page/count
   Justification:

Most compatible with frontend table components

Predictable performance with proper indexing

Easier to implement complex filters

Setup Instructions

1. Prerequisites
   Node.js v18+

MongoDB 6.0+ (local or Atlas)

Redis (for caching - optional)

2. Installation
   bash
   git clone https://github.com/your-repo/kingliving-dashboard.git
   cd server
   npm install
   cp .env.example .env
3. Configuration
   Edit .env:

env
MONGODB_URI=mongodb://localhost:27017/kingliving-orders
PORT=4000
MONGO_MAX_POOL_SIZE=50
DEFAULT_PAGE_SIZE=50 4. Running the System
bash

# Development (auto-restart)

npm run dev

# Production

npm start

# Generate test data (3000 orders per region)

node scripts/generateOrders.js

# Run tests

npm test
Key Assumptions
Data Scale:

Assumed 3,000-5,000 orders per region

Average 3-5 items per order

Usage Patterns:

80% read operations (dashboard views)

20% write operations (status updates)

Performance:

Sub-200ms response time for order queries

99% of requests under 1s at peak load

Security:

API will sit behind company firewall

Authentication handled at gateway level

AI Development Reflection
Helpful Aspects:
Rapid Prototyping:

Generated initial schema structure in 1/4 the manual time

Produced working MongoDB queries with proper indexing hints

Error Resolution:

Quickly diagnosed the Mongoose connection issue

Provided multiple solutions with pros/cons

Best Practices:

Suggested proper signal handling for React state

Recommended Tailwind configuration optimizations

Challenges:
Context Limitations:

Required repeating technical details across prompts

Sometimes suggested deprecated APIs (like Faker.js v7 syntax)

Over-Engineering:

Initially proposed complex solutions for simple problems

Needed guidance to simplify architecture

Testing Gaps:

Generated basic test cases but missed edge scenarios

Required manual test plan augmentation

Overall Impact: Reduced initial development time by ~40% while increasing code quality through instant access to modern patterns and quick error resolution.
