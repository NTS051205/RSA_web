import React, { useState, useEffect } from 'react';
import './App.css';
import KeyGeneration from './components/KeyGeneration';
import Encryption from './components/Encryption';
import ToastNotification from './components/ToastNotification';
import Chart from './components/Chart';
import History from './components/History';
import { ApiService } from './services/api';
import RSAChat from './components/RSAChat';

function App() {
  const [currentKey, setCurrentKey] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [apiHealth, setApiHealth] = useState(false);
  const [activeTab, setActiveTab] = useState('operations'); // 'operations' (RSA cơ bản) | 'chat' (Nâng cao) | 'chart' | 'history'
  const [performanceData, setPerformanceData] = useState([]);
  const [history, setHistory] = useState([]);

  // Log function with toast notifications
  const addLog = (message, type = 'info', targetTab = null) => {
    const timestamp = new Date().toLocaleTimeString('vi-VN');
    
    // Add notification with target tab info
    const newNotification = { 
      id: Date.now(), 
      message, 
      type, 
      timestamp,
      targetTab: targetTab || activeTab // Default to current tab if not specified
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

  // Clear notifications when switching tabs
  useEffect(() => {
    console.log('Tab changed to:', activeTab, 'Clearing notifications');
    clearAllNotifications();
  }, [activeTab]);

  // Clear all notifications on app start
  useEffect(() => {
    console.log('App started, clearing all notifications');
    clearAllNotifications();
  }, []);

  // Add performance data for chart
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

  // Add history entry
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

  // Clear all history (local only, keep MongoDB logs for admin)
  const clearHistory = async () => {
    try {
      // Clear local state only
      setHistory([]);
      
      // Clear localStorage only
      localStorage.removeItem('rsa_history');
      
      // Note: MongoDB logs are kept for admin review
      
      addLog('Đã xóa lịch sử hiển thị thành công', 'success');
    } catch (error) {
      console.error('Error clearing history:', error);
      addLog('Lỗi khi xóa lịch sử: ' + error.message, 'error');
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
        // persist cleaned history
        localStorage.setItem('rsa_history', JSON.stringify(cleaned));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
  }, []);

  // Check API health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await ApiService.health();
        setApiHealth(true);
        addLog('Kết nối API thành công', 'success');
      } catch (error) {
        setApiHealth(false);
        addLog('Không thể kết nối API: ' + error.message, 'error');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      {/* Toast Notifications - Disabled */}

      <header className="app-header">
        <h1>🔐 RSA Demo - An toàn và Bảo mật Thông tin</h1>
        <div className="header-status">
          <span className={`status-indicator ${apiHealth ? 'online' : 'offline'}`}>
            {apiHealth ? '● API Online' : '○ API Offline'}
          </span>
        </div>
      </header>

      {!apiHealth && (
        <div style={{
          background: 'rgba(244, 67, 54, 0.95)',
          color: 'white',
          padding: '16px',
          textAlign: 'center',
          margin: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(244, 67, 54, 0.4)',
          backdropFilter: 'blur(10px)',
        }}>
          <strong>⚠️ Backend chưa chạy!</strong> 
          <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>
            Vui lòng mở Terminal và chạy: <code style={{ background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '4px' }}>cd backend && python app.py</code>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'operations' ? 'active' : ''}`}
          onClick={() => setActiveTab('operations')}
        >
          📘 RSA cơ bản (Giải thuật)
        </button>
        <button 
          className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          🚀 Nâng cao (Hybrid Chat)
        </button>
        <button 
          className={`tab-button ${activeTab === 'chart' ? 'active' : ''}`}
          onClick={() => setActiveTab('chart')}
        >
          📊 Biểu đồ Thời gian
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📜 Lịch sử
        </button>
      </div>

      <div className="app-container">
        {activeTab === 'operations' && (
          <div className="main-content">
            <KeyGeneration 
              currentKey={currentKey} 
              setCurrentKey={setCurrentKey} 
              addLog={(message, type) => addLog(message, type, 'operations')}
              addPerformanceData={addPerformanceData}
              addHistory={addHistory}
            />
            
            <Encryption 
              currentKey={currentKey} 
              addLog={(message, type) => addLog(message, type, 'operations')}
              addPerformanceData={addPerformanceData}
              addHistory={addHistory}
            />

            {/* Factorization demo removed in new version */}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="main-content">
            <RSAChat
              addLog={(message, type) => addLog(message, type, 'chat')}
              addPerformanceData={addPerformanceData}
              addHistory={addHistory}
            />
          </div>
        )}

        {activeTab === 'chart' && (
          <div className="main-content">
            <Chart performanceData={performanceData} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="main-content">
            <History history={history} onClearHistory={clearHistory} />
          </div>
        )}
      </div>

      <footer className="app-footer">
        <p>Demo học thuật - Không dùng cho mục đích sản xuất</p>
      </footer>
    </div>
  );
}

export default App;
