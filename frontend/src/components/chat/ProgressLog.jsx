// components/chat/ProgressLog.jsx - Progress log component
import React from 'react';

const ProgressLog = ({ progress, setProgress }) => {
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      borderRadius: '12px',
      border: '2px solid #e2e8f0',
      padding: '16px',
      minHeight: '200px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <strong style={{ 
          color: '#475569',
          fontSize: '1rem'
        }}>📜 Nhật ký tiến trình</strong>
        <button
          onClick={() => setProgress([])}
          style={{
            padding: '4px 8px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.7rem',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          🗑️ Xóa
        </button>
      </div>
      <div style={{ 
        marginTop: '8px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px',
        maxHeight: '160px',
        overflowY: 'auto'
      }}>
        {progress.slice(-8).map(step => (
          <div key={step.id} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '6px 8px',
            background: 'rgba(255,255,255,0.7)',
            borderRadius: '6px',
            fontSize: '0.85rem'
          }}>
            <div style={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              background: step.type === 'error' ? '#ef4444' : step.type === 'success' ? '#10b981' : '#3b82f6' 
            }}></div>
            <div style={{ 
              color: step.type === 'error' ? '#dc2626' : step.type === 'success' ? '#059669' : '#1e40af' 
            }}>{step.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressLog;
