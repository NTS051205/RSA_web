import React, { useState } from 'react';
import { ApiService } from '../services/api';

function KeyGeneration({ currentKey, setCurrentKey, addLog, addPerformanceData, addHistory }) {
  const [bits, setBits] = useState(1024);
  const [loading, setLoading] = useState(false);
  
  // Quick presets by key bit length
  const handleSetTinyKey = () => {
    setBits(64);
    addLog('Đã set giá trị cho key 64 bits (rất nhanh)', 'info');
  };
  
  const handleSetSmallKey = () => {
    setBits(128);
    addLog('Đã set giá trị cho key 128 bits (nhanh)', 'info');
  };
  
  const handleSetMediumKey = () => {
    setBits(256);
    addLog('Đã set giá trị cho key 256 bits', 'info');
  };
  
  const handleSetLargeKey = () => {
    setBits(512);
    addLog('Đã set giá trị cho key 512 bits', 'info');
  };
  
  const handleSetVeryLargeKey = () => {
    setBits(1024);
    addLog('Đã set giá trị cho key 1024 bits (sẽ mất vài giây)', 'warning');
  };
  
  const handleSetExtremeKey = () => {
    setBits(2048);
    addLog('Đã set giá trị cho key 2048 bits (sẽ mất vài chục giây)', 'warning');
  };
  
  const handleSetUltimateKey = () => {
    setBits(4096);
    addLog('Đã set giá trị cho key 4096 bits (sẽ mất vài phút)', 'warning');
  };

  const handleGenerateKey = async () => {
    setLoading(true);
    const startTime = performance.now();
    
    try {
      addLog('Đang sinh khóa RSA...', 'info');
      const result = await ApiService.generateKey(bits);
      
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(3);
      
      if (result.success) {
        setCurrentKey(result);
        addLog(`Khóa đã được sinh thành công! Key ID: ${result.key_id}`, 'success');
        addLog(`Độ dài khóa: ${result.bit_length}`, 'info');
        addLog(`Thời gian: ${duration}s`, 'success');
        
        // Add performance data
        if (addPerformanceData) {
          addPerformanceData('Generate Key', duration, result.key_id);
        }
        
        // Add to history
        if (addHistory) {
          addHistory({
            type: 'generate_key',
            keyId: result.key_id,
            bitLength: result.bit_length,
            duration: parseFloat(duration),
            modulus: result.public_key.n,
            e: result.public_key.e,
            p: result.private_key.p,
            q: result.private_key.q
          });
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
          <label>Độ dài khóa (bits)</label>
          <input
            type="number"
            value={bits}
            onChange={(e) => setBits(parseInt(e.target.value) || 1024)}
            placeholder="1024"
            min="32"
            max="4096"
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
            ⚡ Quick set theo độ dài khóa:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button 
              onClick={handleSetTinyKey}
              style={{
                padding: '6px 10px',
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              ⚡ 64 bits
            </button>
            <button 
              onClick={handleSetSmallKey}
              style={{
                padding: '6px 10px',
                background: '#8bc34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              🚀 128 bits
            </button>
            <button 
              onClick={handleSetMediumKey}
              style={{
                padding: '6px 10px',
                background: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              🔑 256 bits
            </button>
            <button 
              onClick={handleSetLargeKey}
              style={{
                padding: '6px 10px',
                background: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              🔑 512 bits
            </button>
            <button 
              onClick={handleSetVeryLargeKey}
              style={{
                padding: '6px 10px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              🔑 1024 bits
            </button>
            <button 
              onClick={handleSetExtremeKey}
              style={{
                padding: '6px 10px',
                background: '#9c27b0',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              🔑 2048 bits
            </button>
            <button 
              onClick={handleSetUltimateKey}
              style={{
                padding: '6px 10px',
                background: '#e91e63',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              🔑 4096 bits
            </button>
          </div>
          {/* Warning removed as requested */}
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
                  <div className="key-value" style={{ wordBreak: 'break-all', fontSize: '0.9rem' }}>
                    {String(currentKey.public_key.n)}
                  </div>
                </div>
                <div className="key-field">
                  <span className="key-label">Public Exponent e:</span>
                  <div className="key-value">{String(currentKey.public_key.e)}</div>
                </div>
                <div className="key-field">
                  <span className="key-label">Bit Length:</span>
                  <div className="key-value">{currentKey.bit_length || 'N/A'}</div>
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
                  <div className="key-value" style={{ wordBreak: 'break-all', fontSize: '0.9rem' }}>
                    {String(currentKey.private_key.p)}
                  </div>
                </div>
                <div className="key-field">
                  <span className="key-label">Prime q:</span>
                  <div className="key-value" style={{ wordBreak: 'break-all', fontSize: '0.9rem' }}>
                    {String(currentKey.private_key.q)}
                  </div>
                </div>
                <div className="key-field">
                  <span className="key-label">Private Exponent d:</span>
                  <div className="key-value" style={{ wordBreak: 'break-all', fontSize: '0.9rem' }}>
                    {String(currentKey.private_key.d)}
                  </div>
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
