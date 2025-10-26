import React, { useRef, useEffect } from 'react';

function Logs({ logs }) {
  const logsEndRef = useRef(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const getLogColor = (type) => {
    switch (type) {
      case 'success':
        return '#4caf50';
      case 'error':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      default:
        return '#2196f3';
    }
  };

  return (
    <div className="card" style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <h2>📝 Logs</h2>
      <div className="logs-container" style={{ flex: 1, overflowY: 'auto', fontSize: '0.85rem', fontFamily: 'monospace' }}>
        {logs.length === 0 ? (
          <div style={{ color: '#999', textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📝</div>
            <div>Chưa có log nào</div>
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className="log-entry"
              style={{
                borderLeft: `4px solid ${getLogColor(log.type)}`,
              }}
            >
              <span style={{ color: '#666', fontSize: '0.8rem' }}>[{log.timestamp}]</span>{' '}
              <span style={{ 
                color: getLogColor(log.type), 
                fontWeight: 'bold',
                fontSize: '0.85rem',
                padding: '2px 8px',
                background: `${getLogColor(log.type)}15`,
                borderRadius: '4px'
              }}>
                [{log.type.toUpperCase()}]
              </span>
              <div style={{ marginTop: '4px', color: '#2d3748', lineHeight: '1.5' }}>
                {log.message}
              </div>
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}

export default Logs;
