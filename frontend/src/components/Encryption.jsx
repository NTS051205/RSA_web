import React, { useState } from 'react';
import { ApiService } from '../services/api';

function Encryption({ currentKey, addLog, addPerformanceData, addHistory }) {
  const [message, setMessage] = useState('Hello ATBM NEU!');
  const [encryptLoading, setEncryptLoading] = useState(false);
  const [decryptLoading, setDecryptLoading] = useState(false);
  const [ciphertext, setCiphertext] = useState(null);
  const [decryptedText, setDecryptedText] = useState(null);
  const [mode, setMode] = useState('text'); // 'text' or 'packed'
  const [showFullCiphertext, setShowFullCiphertext] = useState(false);

  const handleEncrypt = async () => {
    if (!currentKey) {
      addLog('Vui lòng sinh khóa trước', 'error');
      return;
    }
    
    setEncryptLoading(true);
    const startTime = performance.now();
    
    try {
      addLog(`Đang mã hóa (RSA ${mode} mode)...`, 'info');
      const result = await ApiService.encrypt(currentKey.key_id, message, mode);
      
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(3);
      
      if (result.success) {
        setCiphertext(result);
        setShowFullCiphertext(false); // Reset về chế độ thu gọn
        addLog(`Mã hóa (${mode}) thành công! ${result.block_count} block`, 'success');
        addLog(`Thời gian: ${duration}s`, 'success');
        
        if (addPerformanceData) {
          addPerformanceData('Encrypt', duration, currentKey.key_id);
        }
        
        // Add to history
        if (addHistory) {
          addHistory({ type: 'encrypt', keyId: currentKey.key_id, message: message, duration: parseFloat(duration), blockCount: result.block_count });
        }
      } else {
        addLog('Lỗi mã hóa: ' + result.error, 'error');
      }
    } catch (error) {
      addLog('Lỗi API mã hóa: ' + error.message, 'error');
    } finally {
      setEncryptLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!currentKey) {
      addLog('Vui lòng sinh khóa trước', 'error');
      return;
    }
    
    if (!ciphertext) {
      addLog('Chưa có ciphertext để giải mã', 'error');
      return;
    }
    
    setDecryptLoading(true);
    const startTime = performance.now();
    
    try {
      addLog(`Đang giải mã (RSA ${mode} mode)...`, 'info');
      let result;
      
      if (mode === 'text') {
        result = await ApiService.decryptText(currentKey.key_id, ciphertext.ciphertext_blocks_b64);
      } else {
        result = await ApiService.decryptPacked(currentKey.key_id, ciphertext.ciphertext);
      }
      
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(3);
      
      if (result.success) {
        setDecryptedText(result.plaintext);
        addLog('Giải mã thành công!', 'success');
        addLog(`Thời gian: ${duration}s`, 'success');
        
        if (addPerformanceData) {
          addPerformanceData('Decrypt', duration, currentKey.key_id);
        }
        
        // Add to history
        addHistory && addHistory({ type: 'decrypt', keyId: currentKey.key_id, message: result.plaintext, duration: parseFloat(duration) });
      } else {
        addLog('Lỗi giải mã: ' + result.error, 'error');
      }
    } catch (error) {
      addLog('Lỗi API giải mã: ' + error.message, 'error');
    } finally {
      setDecryptLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>🔒 2. Trình bày giải thuật RSA (cơ bản)</h2>
      <div className="card-content">
        <div className="form-group">
          <label>Chế độ mã hóa</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem',
              backgroundColor: 'white'
            }}
          >
            <option value="text">Text Mode (mã hóa từng byte)</option>
            <option value="packed">Packed Mode (mã hóa theo block)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Thông điệp cần mã hóa</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập thông điệp..."
          />
        </div>

        <div className="button-group">
          <button 
            className="btn btn-primary" 
            onClick={handleEncrypt}
            disabled={encryptLoading || !currentKey}
          >
            {encryptLoading && <span className="loading"></span>}
            🔒 Mã hóa
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={handleDecrypt}
            disabled={decryptLoading || !currentKey || !ciphertext}
          >
            {decryptLoading && <span className="loading"></span>}
            🔓 Giải mã
          </button>
        </div>

        {ciphertext && (
          <div className="result-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <strong>Ciphertext ({mode} mode):</strong>
              {mode === 'text' && ciphertext.ciphertext_blocks_b64?.length > 3 && (
                <button
                  onClick={() => setShowFullCiphertext(!showFullCiphertext)}
                  style={{
                    padding: '6px 12px',
                    background: showFullCiphertext ? '#f44336' : '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {showFullCiphertext ? '🔽 Thu gọn' : '🔍 Xem tất cả'}
                </button>
              )}
            </div>
            
            {mode === 'text' ? (
              <div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px' }}>
                  Tổng cộng: {ciphertext.ciphertext_blocks_b64?.length || 0} blocks
                </div>
                
                {showFullCiphertext ? (
                  <div>
                    <pre style={{ 
                      background: '#f8f9fa', 
                      padding: '12px', 
                      borderRadius: '6px',
                      border: '1px solid #e9ecef',
                      fontSize: '0.75rem',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      maxWidth: '100%'
                    }}>
                      {JSON.stringify(ciphertext.ciphertext_blocks_b64, null, 2)}
                    </pre>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: '#666', 
                      marginTop: '8px',
                      textAlign: 'center',
                      background: '#e3f2fd',
                      padding: '6px',
                      borderRadius: '4px'
                    }}>
                      📋 Đầy đủ {ciphertext.ciphertext_blocks_b64?.length} blocks - Copy để test với thuật toán khác
                    </div>
                  </div>
                ) : (
                  <div>
                    <pre style={{ 
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      maxWidth: '100%',
                      fontSize: '0.8rem',
                      background: '#f8f9fa',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #e9ecef'
                    }}>{JSON.stringify(ciphertext.ciphertext_blocks_b64?.slice(0, 3), null, 2)}</pre>
                    {ciphertext.ciphertext_blocks_b64?.length > 3 && (
                      <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '8px' }}>
                        ... và {ciphertext.ciphertext_blocks_b64.length - 3} blocks khác
                        <span style={{ color: '#4caf50', fontWeight: 600, marginLeft: '8px' }}>
                          (Click "Xem tất cả" để hiển thị đầy đủ)
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px' }}>
                  Tổng cộng: {ciphertext.block_count} blocks
                </div>
                <pre>{JSON.stringify(ciphertext.ciphertext, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {decryptedText && (
          <div className="result-box success">
            <strong>Plaintext đã giải mã:</strong>
            <div style={{ marginTop: '8px', fontSize: '1.1rem', color: '#333' }}>
              {decryptedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Encryption;
