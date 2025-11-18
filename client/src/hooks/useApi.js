import { useState } from 'react';
import axios from 'axios';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (method, url, data = null, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios[method](url, data || config);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Network error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, request };
};