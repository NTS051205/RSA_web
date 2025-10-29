// App.jsx - Refactored main App component
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import KeyGeneration from './components/KeyGeneration';
import Encryption from './components/Encryption';
import ToastNotification from './components/ToastNotification';
import Chart from './components/Chart';
import History from './components/History';
import RSAChat from './components/RSAChat';

// Import custom hooks
import { useNotifications } from './hooks/useNotifications';
import { useHistory } from './hooks/useHistory';
import { usePerformance } from './hooks/usePerformance';
import { useApiHealth } from './hooks/useApiHealth';

// Import constants
import { TABS, TAB_LABELS } from './constants';

function App() {
  const [currentKey, setCurrentKey] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS.OPERATIONS);
  const [chartViewMode, setChartViewMode] = useState('overview'); // 'overview' | 'algorithm' | 'chat'
  
  // Memoize setViewMode function to prevent unnecessary re-renders
  const handleSetChartViewMode = useCallback((mode) => {
    console.log('Setting chart view mode to:', mode);
    setChartViewMode(mode);
  }, []);

  // Custom hooks
  const { notifications, addNotification, clearAllNotifications } = useNotifications();
  const { history, addHistory, clearHistory } = useHistory();
  const { performanceData, addPerformanceData } = usePerformance();
  const { apiHealth, checkHealth } = useApiHealth();

  // Clear notifications when switching tabs (but not when switching to chart)
  useEffect(() => {
    console.log('Tab changed to:', activeTab, 'Clearing notifications');
    if (activeTab !== TABS.CHART) {
      clearAllNotifications();
    }
  }, [activeTab, clearAllNotifications]);

  // Clear all notifications on app start
  useEffect(() => {
    console.log('App started, clearing all notifications');
    clearAllNotifications();
  }, [clearAllNotifications]);

  // Enhanced addLog function with API health check
  const addLog = async (message, type = 'info', targetTab = null) => {
    addNotification(message, type, targetTab, activeTab);
    
    // If it's a success message and API is offline, try to reconnect
    if (type === 'success' && !apiHealth) {
      await checkHealth();
    }
  };

  // Enhanced clearHistory function
  const handleClearHistory = async () => {
    const success = await clearHistory();
    if (success) {
      addLog('Đã xóa lịch sử hiển thị thành công', 'success');
    } else {
      addLog('Lỗi khi xóa lịch sử', 'error');
    }
  };

  return (
    <div className="App">
      {/* Toast Notifications - Disabled */}

      <header className="app-header">
        <h1>🔐 RSA Demo - An toàn và Bảo mật thông tin</h1>
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
        {Object.entries(TAB_LABELS).map(([key, label]) => (
          <button 
            key={key}
            className={`tab-button ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="app-container">
        {activeTab === TABS.CHART && (
          <div className="main-content">
            <Chart 
              performanceData={performanceData} 
              viewMode={chartViewMode}
              setViewMode={handleSetChartViewMode}
            />
          </div>
        )}

        {activeTab === TABS.OPERATIONS && (
          <div className="main-content">
            <KeyGeneration 
              currentKey={currentKey} 
              setCurrentKey={setCurrentKey} 
              addLog={(message, type) => addLog(message, type, TABS.OPERATIONS)}
              addPerformanceData={addPerformanceData}
              addHistory={addHistory}
            />
            
            <Encryption 
              currentKey={currentKey} 
              addLog={(message, type) => addLog(message, type, TABS.OPERATIONS)}
              addPerformanceData={addPerformanceData}
              addHistory={addHistory}
            />
          </div>
        )}

        {activeTab === TABS.CHAT && (
          <div className="main-content">
            <RSAChat
              addLog={(message, type) => addLog(message, type, TABS.CHAT)}
              addPerformanceData={addPerformanceData}
              addHistory={addHistory}
            />
          </div>
        )}

        {activeTab === TABS.HISTORY && (
          <div className="main-content">
            <History history={history} onClearHistory={handleClearHistory} />
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
