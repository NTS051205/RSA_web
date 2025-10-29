// components/chat/ActionSection.jsx - Action section for chat
import React from 'react';
import { CHAT_DIRECTIONS, CHAT_DIRECTION_LABELS } from '../../constants';

const ActionSection = ({ direction, setDirection, onSend, loading }) => {
  return (
    <div style={{
      display: 'flex', 
      gap: '16px', 
      alignItems: 'center', 
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '16px',
      border: '2px solid #cbd5e1',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem',
          color: 'white',
          fontWeight: 700
        }}>
          📤
        </div>
        <select 
          value={direction} 
          onChange={e => setDirection(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '12px',
            border: '2px solid #667eea',
            background: 'white',
            fontWeight: 600,
            color: '#667eea',
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
          }}
        >
          <option value={CHAT_DIRECTIONS.A2B}>{CHAT_DIRECTION_LABELS[CHAT_DIRECTIONS.A2B]}</option>
          <option value={CHAT_DIRECTIONS.B2A}>{CHAT_DIRECTION_LABELS[CHAT_DIRECTIONS.B2A]}</option>
        </select>
      </div>
      
      <div style={{ 
        fontSize: '0.9rem', 
        color: '#475569',
        fontWeight: 600,
        background: 'rgba(102, 126, 234, 0.1)',
        padding: '8px 16px',
        borderRadius: '20px',
        border: '1px solid rgba(102, 126, 234, 0.2)'
      }}>
        🔐 Chế độ: Packed
      </div>
      
      <button 
        className="btn btn-success" 
        onClick={onSend}
        disabled={loading.send}
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          border: 'none',
          borderRadius: '12px',
          padding: '14px 24px',
          fontWeight: 700,
          fontSize: '1rem',
          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
          color: 'white',
          cursor: loading.send ? 'not-allowed' : 'pointer',
          opacity: loading.send ? 0.7 : 1,
          transition: 'all 0.3s ease',
          transform: loading.send ? 'scale(0.98)' : 'scale(1)'
        }}
        onMouseEnter={(e) => {
          if (!loading.send) {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading.send) {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.3)';
          }
        }}
      >
        {loading.send && <span className="loading"></span>}
        📨 Gửi tin nhắn mã hóa
      </button>
    </div>
  );
};

export default ActionSection;
