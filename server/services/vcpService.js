const yahooFinance = require('yahoo-finance2').default;
const { SMA, RSI } = require('technicalindicators');

class VCPService {
  constructor() {
    this.cache = new Map();
  }

  async getHistoricalData(symbol, period = '1y', interval = '1d') {
    try {
      const queryOptions = {
        period1: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        interval: interval,
      };

      const result = await yahooFinance.historical(symbol, queryOptions);
      return result;
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      throw error;
    }
  }

  calculateVolatility(prices, period = 20) {
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }

    const volatility = [];
    for (let i = period; i < returns.length; i++) {
      const periodReturns = returns.slice(i - period, i);
      const mean = periodReturns.reduce((a, b) => a + b, 0) / period;
      const variance = periodReturns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
      volatility.push(Math.sqrt(variance));
    }

    return volatility;
  }

  calculateVolumeProfile(volumes, period = 20) {
    const volumeProfile = [];
    for (let i = period; i < volumes.length; i++) {
      const periodVolumes = volumes.slice(i - period, i);
      const avgVolume = periodVolumes.reduce((a, b) => a + b, 0) / period;
      volumeProfile.push(avgVolume);
    }
    return volumeProfile;
  }

  isVCPPattern(historicalData, parameters) {
    const { minVolume, minPrice, maxPrice, contractionPeriod, volumeThreshold } = parameters;
    
    if (historicalData.length < contractionPeriod) {
      return false;
    }

    const prices = historicalData.map(d => d.close);
    const volumes = historicalData.map(d => d.volume);
    const currentPrice = prices[prices.length - 1];

    // Check price range
    if (currentPrice < minPrice || currentPrice > maxPrice) {
      return false;
    }

    // Calculate volatility
    const volatility = this.calculateVolatility(prices, contractionPeriod);
    const recentVolatility = volatility.slice(-contractionPeriod);
    
    // Check for decreasing volatility
    const isDecreasingVolatility = recentVolatility.every((v, i) => 
      i === 0 || v <= recentVolatility[i - 1]
    );

    // Calculate volume profile
    const volumeProfile = this.calculateVolumeProfile(volumes, contractionPeriod);
    const recentVolumes = volumeProfile.slice(-contractionPeriod);
    
    // Check for decreasing volume
    const isDecreasingVolume = recentVolumes.every((v, i) => 
      i === 0 || v <= recentVolumes[i - 1] * (1 + volumeThreshold)
    );

    // Calculate RSI
    const rsi = RSI.calculate({
      values: prices,
      period: 14
    });

    const currentRSI = rsi[rsi.length - 1];
    const isRSIReasonable = currentRSI > 30 && currentRSI < 70;

    return isDecreasingVolatility && isDecreasingVolume && isRSIReasonable;
  }

  async scanStocks(symbols, parameters) {
    const results = [];
    
    for (const symbol of symbols) {
      try {
        const historicalData = await this.getHistoricalData(symbol);
        
        if (this.isVCPPattern(historicalData, parameters)) {
          const currentPrice = historicalData[historicalData.length - 1].close;
          const currentVolume = historicalData[historicalData.length - 1].volume;
          
          results.push({
            symbol,
            price: currentPrice,
            volume: currentVolume,
            contraction: parameters.contractionPeriod,
            pattern: 'VCP',
            score: this.calculatePatternScore(historicalData, parameters)
          });
        }
      } catch (error) {
        console.error(`Error scanning ${symbol}:`, error);
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  calculatePatternScore(historicalData, parameters) {
    const prices = historicalData.map(d => d.close);
    const volumes = historicalData.map(d => d.volume);
    
    // Calculate various metrics
    const volatility = this.calculateVolatility(prices, parameters.contractionPeriod);
    const volumeProfile = this.calculateVolumeProfile(volumes, parameters.contractionPeriod);
    
    // Calculate trend strength
    const sma20 = SMA.calculate({
      values: prices,
      period: 20
    });
    
    const sma50 = SMA.calculate({
      values: prices,
      period: 50
    });
    
    const currentPrice = prices[prices.length - 1];
    const currentSMA20 = sma20[sma20.length - 1];
    const currentSMA50 = sma50[sma50.length - 1];
    
    // Calculate score components
    const trendScore = currentPrice > currentSMA20 && currentSMA20 > currentSMA50 ? 1 : 0.5;
    const volatilityScore = 1 - (volatility[volatility.length - 1] / Math.max(...volatility));
    const volumeScore = volumeProfile[volumeProfile.length - 1] > parameters.minVolume ? 1 : 0.5;
    
    // Combine scores
    return (trendScore + volatilityScore + volumeScore) / 3;
  }
}

module.exports = new VCPService(); 