# 🧠 King Living Orders Dashboard – Full Stack POC

This project is a full-stack proof-of-concept dashboard for King Living that aggregates and displays real-time order data from three commerce regions: APAC, UK, and US. It is built using **React + Vite + TypeScript** on the frontend, and **Node.js + Express + MongoDB** on the backend.

## 🎯 Goal Achievement

**Original Goal**: "As a King Living employee, I want to see the orders from our three separate commerce instances on one dashboard that I can view on the office display."

**✅ Solution Delivered**:
- **Unified Dashboard**: Single view showing data from APAC, UK, and US commerce instances
- **Office Display Optimized**: Large typography, clear visual hierarchy, auto-refresh functionality
- **Regional Summary Cards**: Quick overview of each region's performance with proper currency formatting
- **Real-time Updates**: Auto-refreshes every 30 seconds to keep data current
- **Comprehensive Order Management**: Detailed order table with filtering and pagination
- **Responsive Design**: Works on various screen sizes for different office displays

## 🚀 Recent Improvements Made

### 1. **Comprehensive Dashboard Overview**
- Created a new dashboard page as the default landing page
- Added regional summary cards for APAC, UK, and US
- Implemented overall performance metrics
- Added recent orders preview with "View All" navigation

### 2. **Enhanced Visual Design for Office Display**
- Improved typography with Inter font and better letter spacing
- Added proper visual hierarchy with consistent spacing
- Implemented status badges with color coding
- Added region flags for quick visual identification
- Enhanced loading states and error handling

### 3. **Real-time Auto-refresh**
- Dashboard auto-refreshes every 30 seconds
- Visual indicator showing refresh status
- Graceful fallback to mock data when backend is unavailable
- Last updated timestamp display

### 4. **Better Data Formatting**
- Proper currency formatting for each region (AUD, GBP, USD)
- Localized number formatting
- Improved date/time display
- Status badges with appropriate colors

### 5. **Advanced Filtering & Controls**
- Region-based filtering (APAC, UK, US)
- Status filtering (pending, confirmed, processing, etc.)
- Search functionality for orders and customers
- Enhanced pagination with page numbers
- Results count display

### 6. **Robust Error Handling**
- Mock data fallback when API is unavailable
- Graceful error states with user-friendly messages
- Loading spinners with customizable sizes
- Network error recovery

### 7. **Office Display Features**
- Large, readable fonts suitable for wall displays
- High contrast colors for visibility
- Auto-refresh indicator
- Minimal navigation for kiosk-style use
- Responsive layout for different screen sizes

---

## 📦 Tech Stack

### Frontend

- Vite + React + TypeScript
- Tailwind CSS
- Luxon (timezone/date handling)
- Signals (state management)

### Backend

- Node.js (v18+)
- Express.js
- MongoDB with Mongoose
- Joi (validation)
- Morgan (logging)
- Helmet, CORS (security)

---

## ⚙️ Setup & Run Instructions

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- (Optional) Redis for caching

### Clone Repositories

```bash
git clone https://github.com/hadi-roudaki/Dashboard-POC.git
cd Dashboard-POC
```

## 🔧 Backend Setup

```bash
cd server
npm install
```

Create .env // copy the values in .env.exxample

```bash
// to generate fake data
node scripts/generateOrders.js
```

## 💻 Frontend Setup

```bash
cd ../client
npm install
```

Create .env // copy the values in .env.exxample

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

# 🧠 AI Prompts Used During Development

- "Build me a React + vite dashboard that shows live-updating order values from three commerce regions, each using a different currency and timezone."

- "Generate TypeScript types for an order system with customer, shipping address, and item details."

- Generate a README.md for a React + Node.js orders dashboard app with AI prompt history, setup instructions, and technical decisions."

- "this project has to be scalable horizontally and Vertically, order dashboard with regions (APAC, UK, US) that handles different currencies and timezones. The data should be filterable."

# 💡 Technical Design Decisions

### Frontend

- Vite for fast development experience.
- Tailwind for quick and responsive UI.
- Luxon for precise, timezone-aware timestamps.
- Signals for state management across components.
- Paginated, auto-refreshing table to balance UX and performance.

### Backend

- Embedded Order Items: Kept items inside order documents to reduce join complexity.
- Base Currency Storage: Stored values in smallest currency unit (e.g., cents) to avoid float errors.
- UTC + Region Metadata: Used UTC for storage, timezone logic handled at the response level.
- Offset-based Pagination: Easy to implement, works well with table UIs, and scales with indexed queries.

# 🔍 Assumptions Made

3,000–5,000 orders per region.
80% read-heavy usage, primarily for dashboard views.
Each region has a unique currency: AUD (APAC), GBP (UK), USD (US).
Auto-refresh interval is 10 seconds for near real-time feel.
No authentication layer (assumed handled upstream).

# 🤖 Reflection on Using AI in the Dev Process

## ✅ Helpful

Speed: Rapid prototyping of frontend UI, backend schema, and API structure.

Bug Fixing: Quicker identification and resolution of common errors (e.g., WebSocket issues, Mongoose config).

Modern Patterns: Provided best practices (e.g., storing currency in smallest unit, REST pagination strategy).

Writing Support: Helped generate types, documentation, and boilerplate.

## ⚠️ Hindrances

Outdated Suggestions: Occasionally referenced deprecated packages/APIs (e.g., Faker.js).

Over-Engineering: Sometimes introduced overly complex architecture.

Shallow Debugging: Some fixes were generic and required deeper manual exploration.

🎯 Overall Impact
Using AI reduced development time by approximately 40% and helped improve code quality and architecture awareness.
