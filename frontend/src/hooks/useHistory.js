// hooks/useHistory.js - Custom hook for history management
import { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

export const useHistory = () => {
  const [history, setHistory] = useState([]);

  const addHistory = (entry) => {
    const historyEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString('vi-VN'),
      ...entry
    };
    
    const newHistory = [historyEntry, ...history];
    setHistory(newHistory);
    
    // Save to localStorage
    localStorage.setItem('rsa_history', JSON.stringify(newHistory));
    
    // Save to MongoDB
    try {
      ApiService.saveLog({
        type: entry.type || 'info',
        message: entry.message || `${entry.type || 'Operation'} performed`,
        operation: entry.type,
        keyId: entry.keyId,
        duration: entry.duration,
        blockCount: entry.blockCount,
        isValid: entry.isValid,
        bitLength: entry.bitLength,
        signatureLength: entry.signatureLength
      }).catch(err => console.error('Failed to save log to MongoDB:', err));
    } catch (err) {
      console.error('Error saving log:', err);
    }
  };

  const clearHistory = async () => {
    try {
      setHistory([]);
      localStorage.removeItem('rsa_history');
      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      return false;
    }
  };

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('rsa_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        const cleaned = Array.isArray(parsed)
          ? parsed.filter(h => h.type !== 'sign' && h.type !== 'verify')
          : [];
        setHistory(cleaned);
        localStorage.setItem('rsa_history', JSON.stringify(cleaned));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
  }, []);

  return {
    history,
    addHistory,
    clearHistory
  };
};
