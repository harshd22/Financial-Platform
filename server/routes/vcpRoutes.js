const express = require('express');
const router = express.Router();
const vcpService = require('../services/vcpService');

// Get list of stocks to scan (you might want to store this in a database)
const defaultStockList = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 'V', 'WMT',
  'JNJ', 'PG', 'MA', 'UNH', 'HD', 'BAC', 'XOM', 'DIS', 'NFLX', 'PYPL'
];

// Scan for VCP patterns
router.post('/scan', async (req, res) => {
  try {
    const {
      minVolume = 100000,
      minPrice = 5,
      maxPrice = 1000,
      contractionPeriod = 20,
      volumeThreshold = 0.5,
      symbols = defaultStockList
    } = req.body;

    const parameters = {
      minVolume,
      minPrice,
      maxPrice,
      contractionPeriod,
      volumeThreshold
    };

    const results = await vcpService.scanStocks(symbols, parameters);
    res.json(results);
  } catch (error) {
    console.error('Error in VCP scan:', error);
    res.status(500).json({ error: 'Failed to scan for VCP patterns' });
  }
});

// Get historical data for a specific stock
router.get('/historical/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1y', interval = '1d' } = req.query;

    const historicalData = await vcpService.getHistoricalData(symbol, period, interval);
    res.json(historicalData);
  } catch (error) {
    console.error(`Error fetching historical data for ${req.params.symbol}:`, error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

// Get VCP analysis for a specific stock
router.get('/analyze/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const {
      minVolume = 100000,
      minPrice = 5,
      maxPrice = 1000,
      contractionPeriod = 20,
      volumeThreshold = 0.5
    } = req.query;

    const parameters = {
      minVolume: Number(minVolume),
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      contractionPeriod: Number(contractionPeriod),
      volumeThreshold: Number(volumeThreshold)
    };

    const historicalData = await vcpService.getHistoricalData(symbol);
    const isVCP = vcpService.isVCPPattern(historicalData, parameters);
    const score = vcpService.calculatePatternScore(historicalData, parameters);

    res.json({
      symbol,
      isVCP,
      score,
      currentPrice: historicalData[historicalData.length - 1].close,
      currentVolume: historicalData[historicalData.length - 1].volume
    });
  } catch (error) {
    console.error(`Error analyzing ${req.params.symbol}:`, error);
    res.status(500).json({ error: 'Failed to analyze stock' });
  }
});

module.exports = router; 