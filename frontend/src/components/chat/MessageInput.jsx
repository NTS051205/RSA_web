// components/chat/MessageInput.jsx - Message input section for chat
import React from 'react';
import { DEFAULT_MESSAGE } from '../../constants';

const MessageInput = ({ message, setMessage, onSend, loading }) => {
  return (
    <div style={{ 
      marginBottom: '20px',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      border: 'none',
      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '200px',
        height: '200px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        opacity: 0.3
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-10%',
        width: '150px',
        height: '150px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '50%',
        opacity: 0.4
      }}></div>
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            backdropFilter: 'blur(10px)'
          }}>
            💬
          </div>
          <div>
            <div style={{ 
              fontWeight: 700, 
              color: 'white',
              fontSize: '1.2rem',
              marginBottom: '4px'
            }}>Thông điệp bí mật</div>
            <div style={{ 
              fontSize: '0.85rem', 
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 500
            }}>Nhập tin nhắn cần mã hóa</div>
          </div>
        </div>
        
        <textarea 
          value={message} 
          onChange={e => setMessage(e.target.value)} 
          placeholder="Nhập tin nhắn bí mật..."
          style={{ 
            width: '100%',
            minHeight: '100px',
            borderRadius: '12px',
            border: '2px solid rgba(255,255,255,0.3)',
            padding: '16px',
            fontSize: '1rem',
            resize: 'vertical',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            color: '#333',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
          onFocus={(e) => {
            e.target.style.border = '2px solid rgba(255,255,255,0.8)';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
          }}
          onBlur={(e) => {
            e.target.style.border = '2px solid rgba(255,255,255,0.3)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
          }}
        />
        
        <div style={{
          marginTop: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.8)'
        }}>
          <span>📝</span>
          <span>{message.length} ký tự</span>
          <span style={{ marginLeft: 'auto', fontWeight: 600 }}>
            🔐 Sẽ được mã hóa bằng RSA
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
