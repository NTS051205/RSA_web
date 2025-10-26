import React, { useState } from 'react';
import { ApiService } from '../services/api';

function KeyGeneration({ currentKey, setCurrentKey, addLog, addPerformanceData }) {
  // Values for ~100 bits key (fast for demo)
  const [pLow, setPLow] = useState('999999999999999');
  const [pHigh, setPHigh] = useState('9999999999999999');
  const [loading, setLoading] = useState(false);
  
  // Add helper text for larger keys
  const handleSetLargeKey = () => {
    // For ~500 bits key
    setPLow('1000000000000000000000000000');
    setPHigh('10000000000000000000000000000');
    addLog('Đã set giá trị cho key ~500 bits', 'info');
  };
  
  const handleSetVeryLargeKey = () => {
    // For ~1000 bits key
    setPLow('10000000000000000000000000000000000000000000');
    setPHigh('100000000000000000000000000000000000000000000');
    addLog('Đã set giá trị cho key ~1000 bits (sẽ mất 5-10 phút)', 'warning');
  };
  
  const handleSetExtremeKey = () => {
    // For ~2000 bits key  
    setPLow('1000000000000000000000000000000000000000000000000000000000000000000000000000000000');
    setPHigh('10000000000000000000000000000000000000000000000000000000000000000000000000000000000');
    addLog('Đã set giá trị cho key ~2000 bits (sẽ mất 30-60 phút!)', 'warning');
  };

  const handleGenerateKey = async () => {
    setLoading(true);
    const startTime = performance.now();
    
    try {
      addLog('Đang sinh khóa RSA...', 'info');
      const result = await ApiService.generateKey(parseInt(pLow), parseInt(pHigh));
      
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(3);
      
      if (result.success) {
        setCurrentKey(result);
        addLog(`Khóa đã được sinh thành công! Key ID: ${result.key_id}`, 'success');
        addLog(`Độ dài khóa: ${result.public_key.bit_length} bits`, 'info');
        addLog(`Thời gian: ${duration}s`, 'success');
        
        // Add performance data
        if (addPerformanceData) {
          addPerformanceData('Generate Key', duration, result.key_id);
        }
      } else {
        addLog('Lỗi sinh khóa: ' + result.error, 'error');
      }
    } catch (error) {
      addLog('Lỗi API: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>🔑 1. Sinh khóa RSA</h2>
      <div className="card-content">
        <div className="form-group">
          <label>Giới hạn dưới (p_low)</label>
          <input
            type="text"
            value={pLow}
            onChange={(e) => setPLow(e.target.value)}
            placeholder="999999999999999"
          />
        </div>
        
        <div className="form-group">
          <label>Giới hạn trên (p_high)</label>
          <input
            type="text"
            value={pHigh}
            onChange={(e) => setPHigh(e.target.value)}
            placeholder="9999999999999999"
          />
        </div>

        <div className="button-group">
          <button 
            className="btn btn-primary" 
            onClick={handleGenerateKey}
            disabled={loading}
          >
            {loading && <span className="loading"></span>}
            🔁 Sinh khóa mới
          </button>
        </div>

        <div style={{ 
          marginTop: '12px', 
          padding: '12px',
          background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
          borderRadius: '8px',
          borderLeft: '4px solid #667eea'
        }}>
          <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>
            ⚡ Quick set cho key lớn hơn:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button 
              onClick={handleSetLargeKey}
              style={{
                padding: '6px 12px',
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              🔑 ~500 bits
            </button>
            <button 
              onClick={handleSetVeryLargeKey}
              style={{
                padding: '6px 12px',
                background: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              🔑 ~1000 bits
            </button>
            <button 
              onClick={handleSetExtremeKey}
              style={{
                padding: '6px 12px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              🔑 ~2000+ bits
            </button>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '8px' }}>
            ⚠️ Cảnh báo: Key lớn hơn sẽ mất rất nhiều thời gian (10 phút - vài giờ)
          </div>
        </div>

        {currentKey && (
          <div className="key-info">
            <h3>📋 Thông tin khóa RSA</h3>
            
            {/* Public Key Section */}
            <div className="key-section">
              <h4 style={{ color: '#667eea', marginBottom: '12px', fontSize: '1.1rem' }}>
                🔓 Public Key (n, e)
              </h4>
              <div className="key-detail">
                <div className="key-field">
                  <span className="key-label">Modulus n:</span>
                  <div className="key-value">{currentKey.public_key.n}</div>
                </div>
                <div className="key-field">
                  <span className="key-label">Public Exponent e:</span>
                  <div className="key-value">{currentKey.public_key.e}</div>
                </div>
                <div className="key-field">
                  <span className="key-label">Bit Length:</span>
                  <div className="key-value">{currentKey.public_key.bit_length} bits</div>
                </div>
              </div>
            </div>

            {/* Private Key Section */}
            <div className="key-section" style={{ marginTop: '24px' }}>
              <h4 style={{ color: '#f44336', marginBottom: '12px', fontSize: '1.1rem' }}>
                🔒 Private Key (p, q, d)
              </h4>
              <div className="key-detail">
                <div className="key-field">
                  <span className="key-label">Prime p:</span>
                  <div className="key-value">{currentKey.private_key.p}</div>
                </div>
                <div className="key-field">
                  <span className="key-label">Prime q:</span>
                  <div className="key-value">{currentKey.private_key.q}</div>
                </div>
                <div className="key-field">
                  <span className="key-label">Private Exponent d:</span>
                  <div className="key-value">{currentKey.private_key.d}</div>
                </div>
                <div className="key-field">
                  <span className="key-label">Key ID:</span>
                  <div className="key-value">{currentKey.key_id}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default KeyGeneration;
