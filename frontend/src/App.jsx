import React, { useState, useEffect } from 'react';
import './App.css';
import KeyGeneration from './components/KeyGeneration';
import Encryption from './components/Encryption';
import Signing from './components/Signing';
import Factorization from './components/Factorization';
import ToastNotification from './components/ToastNotification';
import Chart from './components/Chart';
import History from './components/History';
import SecurityCheck from './components/SecurityCheck';
import { ApiService } from './services/api';

function App() {
  const [currentKey, setCurrentKey] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [apiHealth, setApiHealth] = useState(false);
  const [activeTab, setActiveTab] = useState('operations'); // 'operations' or 'chart' or 'history'
  const [performanceData, setPerformanceData] = useState([]);
  const [history, setHistory] = useState([]);

  // Log function with toast notifications
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString('vi-VN');
    
    // Add notification
    const newNotification = { id: Date.now(), message, type, timestamp };
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
    setHistory(prev => [historyEntry, ...prev]);
  };

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
      {/* Toast Notifications - Max 3 at once */}
      <div style={{
        position: 'fixed',
        top: '70px',
        right: '20px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxWidth: '320px',
      }}>
        {notifications.slice(0, 3).map(notification => (
          <ToastNotification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

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
          ⚡ Thao tác RSA
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
              addLog={addLog}
              addPerformanceData={addPerformanceData}
              addHistory={addHistory}
            />
            
            <SecurityCheck currentKey={currentKey} />
            
            <Encryption 
              currentKey={currentKey} 
              addLog={addLog}
              addPerformanceData={addPerformanceData}
              addHistory={addHistory}
            />
            
            <Signing 
              currentKey={currentKey} 
              addLog={addLog}
              addPerformanceData={addPerformanceData}
              addHistory={addHistory}
            />
            
            <Factorization 
              currentKey={currentKey} 
              addLog={addLog}
              addPerformanceData={addPerformanceData}
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
            <History history={history} />
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
