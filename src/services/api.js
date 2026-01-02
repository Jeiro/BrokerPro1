// Central API service file for managing all external API calls

import { getCryptoPrices, getCryptoChartData } from './cryptoService';
import { getForexRates, getForexChartData } from './forexService';

// Export all services
export const ApiService = {
  crypto: {
    getPrices: getCryptoPrices,
    getChartData: getCryptoChartData
  },
  forex: {
    getRates: getForexRates,
    getChartData: getForexChartData
  }
};

// Utility function to handle API errors
export const handleApiError = (error) => {
  console.error('API Error:', error);
  return {
    success: false,
    message: error.message || 'An error occurred',
    error
  };
};

// Utility function for retrying failed requests
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};