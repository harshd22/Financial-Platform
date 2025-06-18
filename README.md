# Financial Market Platform

A comprehensive financial market platform that provides real-time market data, VCP (Volatility Contraction Pattern) strategy implementation, and stock recommendations.

## Features

- Real-time stock market data
- Interactive charts and technical analysis
- VCP strategy scanner
- Stock screener
- Market overview dashboard
- News section
- Portfolio tracking
- User authentication

## Tech Stack

- Frontend: React.js with Material-UI
- Backend: Node.js with Express
- Database: MongoDB
- Real-time data: Socket.io
- Market Data: Yahoo Finance API
- Charts: TradingView Lightweight Charts

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install express cors dotenv mongoose socket.io technicalindicators yahoo-finance2 jsonwebtoken bcryptjs
   npx create-react-app client
   cd client
   npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
   npm install react-router-dom axios socket.io-client chart.js react-chartjs-2 lightweight-charts
   ```

3. Create a .env file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the development server:
   ```bash
   npm run dev:full
   ```

## Project Structure

```
├── client/                 # React frontend
├── server/                 # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── utils/            # Utility functions
└── server.js             # Main server file
```

## API Documentation

The API documentation will be available at `/api-docs` when running the server.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 