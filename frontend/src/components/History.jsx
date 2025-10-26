import React from 'react';

function History({ history }) {
  const keyHistory = history.filter(h => h.type === 'generate_key');
  const encryptHistory = history.filter(h => h.type === 'encrypt' || h.type === 'decrypt');
  const signingHistory = history.filter(h => h.type === 'sign' || h.type === 'verify');

  return (
    <div className="card">
      <h2>📜 Lịch sử thao tác</h2>
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
                        {item.bitLength} bits
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
                        {item.n.substring(0, 30)}...
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

        {/* Lịch sử Ký số/Xác minh */}
        <div>
          <h3 style={{ 
            color: '#9c27b0', 
            fontSize: '1.1rem', 
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '2px solid #9c27b0'
          }}>
            ✍️ Lịch sử Ký số/Xác minh ({signingHistory.length})
          </h3>
          
          {signingHistory.length === 0 ? (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              color: '#999',
              background: '#f8f9fa',
              borderRadius: '8px'
            }}>
              Chưa có lịch sử ký số
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {signingHistory.map((item, index) => (
                <div 
                  key={item.id}
                  style={{
                    background: item.type === 'sign' 
                      ? 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)'
                      : 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                    padding: '16px',
                    borderRadius: '12px',
                    borderLeft: `4px solid ${item.type === 'sign' ? '#9c27b0' : '#4caf50'}`,
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
                    <div style={{ fontWeight: 700, color: item.type === 'sign' ? '#7b1fa2' : '#2e7d32' }}>
                      {item.type === 'sign' ? '✍️ Ký số' : '🧪 Xác minh'} #{index + 1}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {item.timestamp}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>
                      {item.type === 'sign' ? 'Thông điệp đã ký:' : 'Thông điệp đã xác minh:'}
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
                    {item.type === 'sign' && item.signatureLength && (
                      <div>
                        <span style={{ color: '#666', fontWeight: 600 }}>Signature Length:</span>
                        <span style={{ marginLeft: '8px', color: '#4caf50', fontWeight: 700 }}>
                          {item.signatureLength} chars
                        </span>
                      </div>
                    )}
                    {item.type === 'verify' && (
                      <div>
                        <span style={{ color: '#666', fontWeight: 600 }}>Kết quả:</span>
                        <span style={{ marginLeft: '8px', color: item.isValid ? '#4caf50' : '#f44336', fontWeight: 700 }}>
                          {item.isValid ? '✅ HỢP LỆ' : '❌ KHÔNG HỢP LỆ'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;

