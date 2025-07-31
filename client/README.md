# 🧪 King Living – Orders Dashboard Frontend

This is the frontend portion of the King Living Orders Dashboard POC. It displays real-time order data fetched from a Node.js + MongoDB backend. The app supports pagination, auto-refresh, and regional insights.

---

## 🚀 Setup and Run Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/king-living-orders-dashboard.git
cd king-living-orders-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
touch .env
```

Add the following:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Adjust the URL to match your backend port if different.

### 4. Run the App

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` by default.

---

## 🧠 AI Prompts Used to Build This POC

All prompts used with ChatGPT (GPT-4o) to assist development:

1. _“Build me a React dashboard that shows live-updating order values from three commerce regions, each using a different currency and timezone.”_
2. _“Generate TypeScript types for an order system with customer, shipping address, and item details.”_
3. _“How can I auto-refresh a paginated table in React using Tailwind?”_
4. _“Fix: WebSocket connection to ‘ws://localhost/’ failed: WebSocket is closed before the connection is established.”_
5. _“React table shows no data even though fetch call returns results — how do I fix it?”_
6. _“Generate a README.md for a React + Node.js orders dashboard app with AI prompt history, setup instructions, and technical decisions.”_

---

## 💡 Technical Design Decisions & Reasoning

- **Vite + React + TypeScript**: Chosen for fast builds and strong typing in a modern React environment.
- **Tailwind CSS**: Simplifies responsive UI development without custom CSS overhead.
- **Luxon**: Provides better date handling with timezone support for regional orders.
- **Signals (optional)**: Designed for state handling that scales cleanly across multiple auto-refreshing components.
- **REST API structure**: Used instead of GraphQL due to simplicity and time constraints.

---

## 🔍 Assumptions Made

- Orders are grouped and returned per region with consistent structure.
- Each order contains `orderId`, `region`, `amount`, `status`, etc., matching the provided interface.
- Auto-refreshing every 10 seconds is acceptable for near real-time data.
- Pagination is required and backend provides page/limit/total info.
- Each region is expected to use one unique currency: APAC (AUD), UK (GBP), US (USD).

---

## 🤖 Reflection on AI in the Development Process

AI greatly **accelerated** the initial scoping and code generation process. It helped with:

- Generating boilerplate UI layouts and Tailwind classes.
- Quickly resolving bugs like blank tables and CORS issues.
- Creating types/interfaces from backend JSON structures.

However, AI also **hindered** slightly when:

- Suggestions assumed use of outdated or incompatible libraries.
- Provided optimistic "it should work" answers that lacked concrete debugging steps.

Despite that, it was overall a net positive and made rapid prototyping possible.

---

© 2025 – King Living Orders Dashboard POC
