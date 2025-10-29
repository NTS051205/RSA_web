// components/chat/KeyGenerationSection.jsx - Key generation section for chat
import React from 'react';
import { KEY_SIZES } from '../../constants';

const KeyGenerationSection = ({ 
  alice, 
  bob, 
  keyBits, 
  setKeyBits, 
  showKeyDetails, 
  setShowKeyDetails,
  loading,
  onGenerateAlice,
  onGenerateBob 
}) => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '20px',
      marginBottom: '24px'
    }}>
      {/* Bit Size Selection */}
      <div style={{ 
        gridColumn: '1 / -1',
        padding: '16px', 
        borderRadius: '12px', 
        background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
        border: '2px solid #ffc107',
        marginBottom: '16px'
      }}>
        <div style={{ 
          fontWeight: 700, 
          marginBottom: '12px', 
          color: '#856404',
          fontSize: '1.1rem'
        }}>🔧 Cấu hình khóa RSA</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <label style={{ fontWeight: 600, color: '#856404' }}>Độ dài khóa:</label>
          <select
            value={keyBits}
            onChange={(e) => setKeyBits(parseInt(e.target.value))}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '2px solid #ffc107',
              background: 'white',
              fontWeight: 600,
              color: '#856404'
            }}
          >
            {KEY_SIZES.map(size => (
              <option key={size.value} value={size.value}>{size.label}</option>
            ))}
          </select>
          <div style={{ 
            fontSize: '0.8rem', 
            color: '#856404',
            background: 'rgba(255,255,255,0.7)',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            💡 Khuyến nghị: 4096 bits cho môi trường sản xuất
          </div>
        </div>
      </div>

      {/* Alice Key Generation */}
      <div style={{ 
        padding: '20px', 
        borderRadius: '12px', 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        border: '2px solid #0ea5e9',
        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.1)'
      }}>
        <div style={{ 
          fontWeight: 700, 
          marginBottom: '12px', 
          color: '#0369a1',
          fontSize: '1.1rem'
        }}>👩‍💻 Alice</div>
        <button 
          className="btn btn-primary"
          onClick={onGenerateAlice}
          disabled={loading.alice}
          style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)'
          }}
        >
          {loading.alice && <span className="loading"></span>}🔑 Sinh khóa Alice
        </button>
        {alice && (
          <div style={{ 
            marginTop: '12px', 
            fontSize: '0.85rem',
            background: 'rgba(255,255,255,0.7)',
            padding: '8px',
            borderRadius: '6px'
          }}>
            <div><strong>Key ID:</strong> <span style={{ fontFamily: 'monospace', color: '#0369a1' }}>{alice.key_id}</span></div>
            <div><strong>n:</strong> <span style={{ color: '#059669', fontWeight: 600 }}>{alice.bit_length}</span></div>
            <button
              onClick={() => setShowKeyDetails(prev => ({ ...prev, alice: !prev.alice }))}
              style={{
                marginTop: '8px',
                padding: '4px 8px',
                background: showKeyDetails.alice ? '#f44336' : '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {showKeyDetails.alice ? '🔽 Ẩn chi tiết' : '🔍 Xem chi tiết'}
            </button>
            {showKeyDetails.alice && (
              <div style={{ 
                marginTop: '8px', 
                padding: '8px',
                background: 'rgba(255,255,255,0.9)',
                borderRadius: '4px',
                fontSize: '0.75rem'
              }}>
                <div style={{ fontWeight: 600, color: '#0369a1', marginBottom: '6px' }}>🔓 Khóa công khai KU = {'{e, N}'}:</div>
                <div><strong>Public Exponent (e):</strong> <span style={{ fontFamily: 'monospace' }}>{String(alice.public_key.e)}</span></div>
                <div><strong>Modulus (N):</strong> <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{String(alice.public_key.n)}</span></div>
                
                <div style={{ fontWeight: 600, color: '#dc2626', marginTop: '8px', marginBottom: '6px' }}>🔒 Khóa riêng bí mật KR = {'{d, p, q}'}:</div>
                <div><strong>Private Exponent (d):</strong> <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{String(alice.private_key.d)}</span></div>
                <div><strong>Prime p:</strong> <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{String(alice.private_key.p)}</span></div>
                <div><strong>Prime q:</strong> <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{String(alice.private_key.q)}</span></div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Bob Key Generation */}
      <div style={{ 
        padding: '20px', 
        borderRadius: '12px', 
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        border: '2px solid #22c55e',
        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.1)'
      }}>
        <div style={{ 
          fontWeight: 700, 
          marginBottom: '12px', 
          color: '#15803d',
          fontSize: '1.1rem'
        }}>👨‍💻 Bob</div>
        <button 
          className="btn btn-primary"
          onClick={onGenerateBob}
          disabled={loading.bob}
          style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)'
          }}
        >
          {loading.bob && <span className="loading"></span>}🔑 Sinh khóa Bob
        </button>
        {bob && (
          <div style={{ 
            marginTop: '12px', 
            fontSize: '0.85rem',
            background: 'rgba(255,255,255,0.7)',
            padding: '8px',
            borderRadius: '6px'
          }}>
            <div><strong>Key ID:</strong> <span style={{ fontFamily: 'monospace', color: '#15803d' }}>{bob.key_id}</span></div>
            <div><strong>n:</strong> <span style={{ color: '#059669', fontWeight: 600 }}>{bob.bit_length}</span></div>
            <button
              onClick={() => setShowKeyDetails(prev => ({ ...prev, bob: !prev.bob }))}
              style={{
                marginTop: '8px',
                padding: '4px 8px',
                background: showKeyDetails.bob ? '#f44336' : '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {showKeyDetails.bob ? '🔽 Ẩn chi tiết' : '🔍 Xem chi tiết'}
            </button>
            {showKeyDetails.bob && (
              <div style={{ 
                marginTop: '8px', 
                padding: '8px',
                background: 'rgba(255,255,255,0.9)',
                borderRadius: '4px',
                fontSize: '0.75rem'
              }}>
                <div style={{ fontWeight: 600, color: '#15803d', marginBottom: '6px' }}>🔓 Khóa công khai KU = {'{e, N}'}:</div>
                <div><strong>Public Exponent (e):</strong> <span style={{ fontFamily: 'monospace' }}>{String(bob.public_key.e)}</span></div>
                <div><strong>Modulus (N):</strong> <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{String(bob.public_key.n)}</span></div>
                
                <div style={{ fontWeight: 600, color: '#dc2626', marginTop: '8px', marginBottom: '6px' }}>🔒 Khóa riêng bí mật KR = {'{d, p, q}'}:</div>
                <div><strong>Private Exponent (d):</strong> <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{String(bob.private_key.d)}</span></div>
                <div><strong>Prime p:</strong> <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{String(bob.private_key.p)}</span></div>
                <div><strong>Prime q:</strong> <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{String(bob.private_key.q)}</span></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KeyGenerationSection;
