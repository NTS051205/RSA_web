// hooks/usePerformance.js - Custom hook for performance data management
import { useState } from 'react';

export const usePerformance = () => {
  const [performanceData, setPerformanceData] = useState([]);

  const addPerformanceData = (operation, duration, keyId) => {
    const newData = {
      id: Date.now(),
      operation,
      duration,
      keyId,
      timestamp: new Date().toLocaleTimeString('vi-VN')
    };
    setPerformanceData(prev => [...prev, newData]);
  };

  const clearPerformanceData = () => {
    setPerformanceData([]);
  };

  return {
    performanceData,
    addPerformanceData,
    clearPerformanceData
  };
};
