// hooks/useNotifications.js - Custom hook for notification management
import { useState, useEffect } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info', targetTab = null, activeTab = 'operations') => {
    const timestamp = new Date().toLocaleTimeString('vi-VN');
    
    const newNotification = { 
      id: Date.now(), 
      message, 
      type, 
      timestamp,
      targetTab: targetTab || activeTab
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove after 4s
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 4000);
    
    console.log(`[${type.toUpperCase()}] ${timestamp}: ${message}`);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  };
};
