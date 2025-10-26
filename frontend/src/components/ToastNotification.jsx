import React, { useEffect } from 'react';

function ToastNotification({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success': return 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
      case 'error': return 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
      case 'warning': return 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
      default: return 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)';
    }
  };

  return (
    <div 
      style={{
        background: getColor(),
        color: 'white',
        padding: '18px 22px',
        borderRadius: '20px',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.25), 0 6px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        minWidth: '320px',
        maxWidth: '400px',
        animation: 'slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: 10000,
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div style={{ 
        fontSize: '1.8rem',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
      }}>
        {getIcon()}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontWeight: 700, 
          fontSize: '0.75rem', 
          marginBottom: '6px',
          letterSpacing: '1.2px',
          opacity: 0.9,
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          {type.toUpperCase()}
        </div>
        <div style={{ 
          fontSize: '0.9rem', 
          lineHeight: '1.4',
          fontWeight: 500,
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          {message}
        </div>
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          border: 'none',
          color: 'white',
          fontSize: '1.4rem',
          cursor: 'pointer',
          padding: '6px 10px',
          borderRadius: '50%',
          transition: 'all 0.2s',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
          fontWeight: 300,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
        onMouseOver={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.4)';
          e.target.style.transform = 'rotate(90deg) scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.25)';
          e.target.style.transform = 'rotate(0deg) scale(1)';
        }}
      >
        ×
      </button>
    </div>
  );
}

export default ToastNotification;
