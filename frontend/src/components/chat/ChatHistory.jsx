// components/chat/ChatHistory.jsx - Chat history component
import React from 'react';

const ChatHistory = ({ chat, showCiphertext, setShowCiphertext, compactMode, setCompactMode, loading, onDecrypt }) => {
  if (chat.length === 0) {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%)',
        borderRadius: '12px',
        border: '2px solid #d8b4fe',
        padding: '16px',
        minHeight: '200px',
        overflow: 'hidden',
        wordWrap: 'break-word'
      }}>
        <strong style={{ 
          color: '#7c3aed',
          fontSize: '1rem',
          marginBottom: '12px',
          display: 'block'
        }}>💬 Tin nhắn gần nhất</strong>
        <div style={{ 
          marginTop: '8px', 
          color: '#a78bfa',
          textAlign: 'center',
          padding: '20px',
          fontSize: '0.9rem'
        }}>Chưa có tin nhắn</div>
      </div>
    );
  }

  const latestMessage = chat[0];

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%)',
      borderRadius: '12px',
      border: '2px solid #d8b4fe',
      padding: '16px',
      minHeight: '200px',
      overflow: 'hidden',
      wordWrap: 'break-word'
    }}>
      <strong style={{ 
        color: '#7c3aed',
        fontSize: '1rem',
        marginBottom: '12px',
        display: 'block'
      }}>💬 Tin nhắn gần nhất</strong>
      
      <div style={{ 
        marginTop: '8px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        maxHeight: '160px',
        overflowY: 'auto'
      }}>
        {/* Sender bubble */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ 
            maxWidth: '75%', 
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', 
            color: '#1e40af', 
            padding: '10px 12px', 
            borderRadius: '12px', 
            borderTopRightRadius: 4,
            fontSize: '0.9rem'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginBottom: 4 }}>{latestMessage.from}</div>
            <div>{latestMessage.plaintext}</div>
          </div>
        </div>
        
        {/* Cipher preview */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: 600 }}>
            Cipher payload ({latestMessage.ciphertextBlocks.length} blocks):
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {showCiphertext && latestMessage.ciphertextBlocks.length > 0 && (
              <button
                onClick={() => setCompactMode(!compactMode)}
                style={{
                  padding: '4px 8px',
                  background: compactMode ? '#ff9800' : '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {compactMode ? '📄 Dạng đầy đủ' : '📋 Dạng compact'}
              </button>
            )}
            <button
              onClick={() => setShowCiphertext(!showCiphertext)}
              style={{
                padding: '4px 8px',
                background: showCiphertext ? '#f44336' : '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {showCiphertext ? '🔽 Ẩn' : '🔍 Xem'}
            </button>
          </div>
        </div>
        
        {showCiphertext ? (
          <div>
            {compactMode ? (
              <div>
                <pre style={{ 
                  whiteSpace: 'pre-wrap', 
                  wordBreak: 'break-all',
                  background: '#f8f9fa', 
                  color: '#212529', 
                  padding: '12px', 
                  borderRadius: '8px',
                  fontSize: '0.65rem',
                  overflow: 'auto',
                  maxHeight: '200px',
                  border: '1px solid #dee2e6',
                  fontFamily: 'monospace',
                  lineHeight: '1.2',
                  maxWidth: '100%'
                }}>{JSON.stringify(latestMessage.ciphertextBlocks, null, 0)}</pre>
                <div style={{ 
                  fontSize: '0.7rem', 
                  color: '#ff9800', 
                  marginTop: '4px',
                  textAlign: 'center',
                  background: 'rgba(255, 152, 0, 0.1)',
                  padding: '4px',
                  borderRadius: '4px'
                }}>
                  📋 Dạng compact - Phù hợp cho khóa lớn (4096 bits)
                </div>
              </div>
            ) : (
              <div>
                <pre style={{ 
                  whiteSpace: 'pre-wrap', 
                  wordBreak: 'break-all',
                  background: '#f8f9fa', 
                  color: '#212529', 
                  padding: '12px', 
                  borderRadius: '8px',
                  fontSize: '0.7rem',
                  overflow: 'auto',
                  maxHeight: '300px',
                  border: '1px solid #dee2e6',
                  fontFamily: 'monospace',
                  lineHeight: '1.3',
                  maxWidth: '100%'
                }}>{JSON.stringify(latestMessage.ciphertextBlocks, null, 2)}</pre>
                <div style={{ 
                  fontSize: '0.7rem', 
                  color: '#a78bfa', 
                  marginTop: '4px',
                  textAlign: 'center',
                  background: 'rgba(167, 139, 250, 0.1)',
                  padding: '4px',
                  borderRadius: '4px'
                }}>
                  📋 Đầy đủ {latestMessage.ciphertextBlocks.length} blocks - Copy để test với thuật toán khác
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            fontSize: '0.7rem', 
            color: '#666', 
            textAlign: 'center',
            background: 'rgba(0,0,0,0.05)',
            padding: '8px',
            borderRadius: '4px',
            fontStyle: 'italic'
          }}>
            Click "🔍 Xem" để hiển thị ciphertext đầy đủ
          </div>
        )}
        
        {/* Receiver bubble */}
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{ 
            maxWidth: '75%', 
            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', 
            color: '#166534', 
            padding: '10px 12px', 
            borderRadius: '12px', 
            borderTopLeftRadius: 4,
            fontSize: '0.9rem'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', marginBottom: 4 }}>{latestMessage.to}</div>
            {latestMessage.decrypted ? (
              <div>{latestMessage.decrypted}</div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontStyle: 'italic', color: '#666' }}>Tin nhắn đã mã hóa</span>
                <button
                  onClick={() => onDecrypt(latestMessage)}
                  disabled={loading.decrypt}
                  style={{
                    padding: '4px 8px',
                    background: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    cursor: loading.decrypt ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    opacity: loading.decrypt ? 0.6 : 1
                  }}
                >
                  {loading.decrypt ? '⏳' : '🔓'} Giải mã
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
