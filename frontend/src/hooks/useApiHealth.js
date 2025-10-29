// hooks/useApiHealth.js - Custom hook for API health monitoring
import { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

export const useApiHealth = () => {
  const [apiHealth, setApiHealth] = useState(false);

  const checkHealth = async () => {
    try {
      await ApiService.health();
      setApiHealth(true);
      return true;
    } catch (error) {
      setApiHealth(false);
      return false;
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return {
    apiHealth,
    checkHealth
  };
};
