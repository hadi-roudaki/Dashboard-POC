# 🏢 King Living Orders Dashboard - Frontend

A modern React TypeScript dashboard for displaying orders from King Living's three commerce instances (APAC, UK, US). Built with Vite, React 19, and Tailwind CSS for optimal performance and office display use.

## 🎯 Overview

This frontend application provides a comprehensive dashboard for King Living employees to monitor orders across all regions in real-time. Designed specifically for office display with auto-refresh functionality, responsive design, and professional UI.

## ✨ Key Features

### 📊 Dashboard Overview
- **Real-time Auto-refresh**: Updates every 30 seconds for live data
- **Regional Summary Cards**: APAC 🇦🇺, UK 🇬🇧, US 🇺🇸 with key metrics
- **Overall Performance**: Total orders, revenue, and cross-region statistics
- **Recent Orders Preview**: Quick view of latest orders with navigation

### 📋 Advanced Orders Management
- **Multi-region Filtering**: Filter by APAC, UK, US individually or combined
- **Status Filtering**: Filter by pending, confirmed, processing, shipped, delivered, cancelled
- **Real-time Search**: Find orders by ID, customer name, or email
- **Sortable Columns**: Click headers to sort by date, amount, status, region
- **Smart Pagination**: Navigate through large datasets efficiently

### 📱 Order Details
- **Mobile-friendly Design**: Responsive layout optimized for all devices
- **Complete Information**: Customer details, items, shipping, payment info
- **Visual Timeline**: Order status progression with icons
- **Quick Actions**: Email customer, track shipment, print invoice buttons
- **Back Navigation**: Easy return to orders list

## 🛠 Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling with custom configuration
- **@preact/signals** - Reactive state management
- **React Router** - Client-side routing

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ (required for Vite)
- Backend server running on port 4000

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration
Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_USE_MOCK_DATA=false
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

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
