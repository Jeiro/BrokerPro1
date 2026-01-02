import { useState, useEffect } from 'react';
import { getCryptoPrices } from '../services/cryptoService';
import { ForexService } from '../services/forexService';

// Custom hook to fetch and manage real-time prices
export const usePrices = () => {
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [forexRates, setForexRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const [crypto, forexResponse] = await Promise.all([
        getCryptoPrices(),
        ForexService.getRates()
      ]);

      setCryptoPrices(crypto);
      setForexRates(forexResponse?.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching prices:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();

    // Refresh prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    cryptoPrices,
    forexRates,
    loading,
    error,
    refresh: fetchPrices
  };
};