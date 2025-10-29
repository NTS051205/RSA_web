import React, { useState } from 'react';

function History({ history, onClearHistory }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const filteredHistory = history.filter(h => h.type !== 'sign' && h.type !== 'verify');
  const keyHistory = filteredHistory.filter(h => h.type === 'generate_key');
  const encryptHistory = filteredHistory.filter(h => h.type === 'encrypt' || h.type === 'decrypt');
  const chatHistory = filteredHistory.filter(h => h.type === 'chat_message');

  const handleClearHistory = () => {
    setShowConfirmModal(true);
  };

  const confirmClear = () => {
    onClearHistory && onClearHistory();
    setShowConfirmModal(false);
  };

  const cancelClear = () => {
    setShowConfirmModal(false);
  };

  const handleChatClick = (chatItem) => {
    setSelectedChat(chatItem);
    setShowChatModal(true);
  };

  const closeChatModal = () => {
    setShowChatModal(false);
    setSelectedChat(null);
  };


  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>📜 Lịch sử thao tác</h2>
        <button
          onClick={handleClearHistory}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(244, 67, 54, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 12px rgba(244, 67, 54, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(244, 67, 54, 0.3)';
          }}
        >
          🗑️ Xóa lịch sử hiển thị
        </button>
      </div>
      <div className="card-content">
        {/* Lịch sử sinh khóa */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ 
            color: '#667eea', 
            fontSize: '1.1rem', 
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '2px solid #667eea'
          }}>
            🔑 Lịch sử sinh khóa ({keyHistory.length})
          </h3>
          
          {keyHistory.length === 0 ? (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              color: '#999',
              background: '#f8f9fa',
              borderRadius: '8px'
            }}>
              Chưa có lịch sử sinh khóa
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {keyHistory.map((item, index) => (
                <div 
                  key={item.id}
                  style={{
                    background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
                    padding: '16px',
                    borderRadius: '12px',
                    borderLeft: '4px solid #667eea',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <div style={{ fontWeight: 700, color: '#333' }}>
                      Khóa #{index + 1}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {item.timestamp}
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9rem' }}>
                    <div>
                      <span style={{ color: '#666', fontWeight: 600 }}>Key ID:</span>
                      <span style={{ marginLeft: '8px', color: '#667eea', fontFamily: 'monospace' }}>
                        {item.keyId}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#666', fontWeight: 600 }}>Bit Length:</span>
                      <span style={{ marginLeft: '8px', color: '#4caf50', fontWeight: 700 }}>
                        {item.bitLength || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#666', fontWeight: 600 }}>Thời gian:</span>
                      <span style={{ marginLeft: '8px', color: '#333' }}>
                        {item.duration}s
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#666', fontWeight: 600 }}>Modulus:</span>
                      <span style={{ marginLeft: '8px', color: '#333', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {item.modulus ? item.modulus.substring(0, 30) + '...' : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lịch sử mã hóa */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ 
            color: '#f44336', 
            fontSize: '1.1rem', 
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '2px solid #f44336'
          }}>
            🔒 Lịch sử mã hóa ({encryptHistory.length})
          </h3>
          
          {encryptHistory.length === 0 ? (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              color: '#999',
              background: '#f8f9fa',
              borderRadius: '8px'
            }}>
              Chưa có lịch sử mã hóa
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {encryptHistory.map((item, index) => (
                <div 
                  key={item.id}
                  style={{
                    background: item.type === 'encrypt' 
                      ? 'linear-gradient(135deg, #fef5f5 0%, #fce4e4 100%)'
                      : 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)',
                    padding: '16px',
                    borderRadius: '12px',
                    borderLeft: `4px solid ${item.type === 'encrypt' ? '#f44336' : '#2196f3'}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 700, color: item.type === 'encrypt' ? '#c62828' : '#1565c0' }}>
                      {item.type === 'encrypt' ? '🔒 Mã hóa' : '🔓 Giải mã'} #{index + 1}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {item.timestamp}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>
                      Thông điệp:
                    </div>
                    <div style={{ 
                      background: 'rgba(255,255,255,0.7)', 
                      padding: '8px 12px', 
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace',
                      color: '#333',
                      maxHeight: '80px',
                      overflow: 'auto',
                      wordBreak: 'break-word'
                    }}>
                      {item.message.length > 100 ? `${item.message.substring(0, 100)}...` : item.message}
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9rem' }}>
                    <div>
                      <span style={{ color: '#666', fontWeight: 600 }}>Key ID:</span>
                      <span style={{ marginLeft: '8px', color: '#667eea', fontFamily: 'monospace' }}>
                        {item.keyId}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#666', fontWeight: 600 }}>Thời gian:</span>
                      <span style={{ marginLeft: '8px', color: '#333' }}>
                        {item.duration}s
                      </span>
                    </div>
                    {item.blockCount && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <span style={{ color: '#666', fontWeight: 600 }}>Số blocks:</span>
                        <span style={{ marginLeft: '8px', color: '#4caf50', fontWeight: 700 }}>
                          {item.blockCount} blocks
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lịch sử chat */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ 
            color: '#9c27b0', 
            fontSize: '1.1rem', 
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '2px solid #9c27b0'
          }}>
            💬 Lịch sử chat ({chatHistory.length})
          </h3>
          
          {chatHistory.length === 0 ? (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              color: '#999',
              background: '#f8f9fa',
              borderRadius: '8px'
            }}>
              Chưa có lịch sử chat
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {chatHistory.map((item, index) => (
                <div 
                  key={item.id}
                  onClick={() => handleChatClick(item)}
                  style={{
                    background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                    padding: '16px',
                    borderRadius: '12px',
                    borderLeft: '4px solid #9c27b0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <div style={{ fontWeight: 700, color: '#333' }}>
                      💬 Tin nhắn #{index + 1}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {item.timestamp}
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9rem' }}>
                    <div>
                      <span style={{ color: '#666', fontWeight: 600 }}>Từ:</span>
                      <span style={{ marginLeft: '8px', color: '#9c27b0', fontWeight: 600 }}>
                        {item.from} → {item.to}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#666', fontWeight: 600 }}>Key ID:</span>
                      <span style={{ marginLeft: '8px', color: '#9c27b0', fontFamily: 'monospace' }}>
                        {item.keyId}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#666', fontWeight: 600 }}>Thời gian:</span>
                      <span style={{ marginLeft: '8px', color: '#333' }}>
                        {item.duration}s
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#666', fontWeight: 600 }}>Trạng thái:</span>
                      <span style={{ marginLeft: '8px', color: item.decrypted ? '#4caf50' : '#ff9800', fontWeight: 600 }}>
                        {item.decrypted ? 'Đã giải mã' : 'Chưa giải mã'}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ 
                    marginTop: '8px', 
                    padding: '8px 12px', 
                    background: 'rgba(255,255,255,0.7)', 
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    color: '#666',
                    fontStyle: 'italic'
                  }}>
                    "{item.message.length > 50 ? `${item.message.substring(0, 50)}...` : item.message}"
                  </div>
                  
                  <div style={{ 
                    marginTop: '8px', 
                    fontSize: '0.75rem', 
                    color: '#9c27b0', 
                    textAlign: 'center',
                    fontWeight: 600
                  }}>
                    👆 Click để xem chi tiết
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Đã loại bỏ phần ký số/xác minh khỏi lịch sử */}
      </div>

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '480px',
            width: '90%',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'modalSlideIn 0.3s ease-out'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginRight: '16px',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
              }}>
                ⚠️
              </div>
              <div>
                <h3 style={{
                  color: '#f8fafc',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  margin: 0
                }}>
                  Xác nhận xóa lịch sử
                </h3>
                <p style={{
                  color: '#94a3b8',
                  fontSize: '0.9rem',
                  margin: '4px 0 0 0'
                }}>
                  Thao tác này sẽ ảnh hưởng đến giao diện
                </p>
              </div>
            </div>

            {/* Message */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <p style={{
                color: '#e2e8f0',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0,
                textAlign: 'center'
              }}>
                Bạn có chắc chắn muốn xóa lịch sử hiển thị?
              </p>
            </div>

            {/* Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={cancelClear}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Hủy
              </button>
              <button
                onClick={confirmClear}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                }}
              >
                🗑️ Xóa lịch sử
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Detail Modal */}
      {showChatModal && selectedChat && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'modalSlideIn 0.3s ease-out'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginRight: '16px',
                boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)'
              }}>
                💬
              </div>
              <div>
                <h3 style={{
                  color: '#f8fafc',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  margin: 0
                }}>
                  Chi tiết tin nhắn
                </h3>
                <p style={{
                  color: '#94a3b8',
                  fontSize: '0.9rem',
                  margin: '4px 0 0 0'
                }}>
                  {selectedChat.from} → {selectedChat.to}
                </p>
              </div>
            </div>

            {/* Message Content */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontWeight: 600, marginBottom: '12px', color: '#e2e8f0' }}>
                📝 Nội dung tin nhắn:
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '1rem',
                lineHeight: '1.6',
                color: '#f8fafc',
                wordBreak: 'break-word'
              }}>
                "{selectedChat.message}"
              </div>
            </div>

            {/* Technical Details */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontWeight: 600, marginBottom: '12px', color: '#e2e8f0' }}>
                🔧 Thông tin kỹ thuật:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: '#94a3b8' }}>Key ID:</span>
                  <span style={{ marginLeft: '8px', color: '#9c27b0', fontFamily: 'monospace' }}>
                    {selectedChat.keyId}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Thời gian mã hóa:</span>
                  <span style={{ marginLeft: '8px', color: '#f8fafc' }}>
                    {selectedChat.duration}s
                  </span>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Trạng thái:</span>
                  <span style={{ marginLeft: '8px', color: selectedChat.decrypted ? '#4caf50' : '#ff9800', fontWeight: 600 }}>
                    {selectedChat.decrypted ? 'Đã giải mã' : 'Chưa giải mã'}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Timestamp:</span>
                  <span style={{ marginLeft: '8px', color: '#f8fafc' }}>
                    {selectedChat.timestamp}
                  </span>
                </div>
              </div>
            </div>

            {/* Decrypted Message (if available) */}
            {selectedChat.decrypted && (
              <div style={{
                background: 'rgba(76, 175, 80, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(76, 175, 80, 0.2)'
              }}>
                <div style={{ fontWeight: 600, marginBottom: '12px', color: '#4caf50' }}>
                  🔓 Tin nhắn đã giải mã:
                </div>
                <div style={{
                  background: 'rgba(76, 175, 80, 0.1)',
                  padding: '16px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  color: '#4caf50',
                  wordBreak: 'break-word',
                  fontWeight: 600
                }}>
                  "{selectedChat.decrypted}"
                </div>
              </div>
            )}

            {/* Close Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={closeChatModal}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(107, 114, 128, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.3)';
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;

