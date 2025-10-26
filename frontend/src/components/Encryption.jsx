import React, { useState } from 'react';
import { ApiService } from '../services/api';

function Encryption({ currentKey, addLog, addPerformanceData, addHistory }) {
  const [message, setMessage] = useState('Hello ATBM NEU!');
  const [encryptLoading, setEncryptLoading] = useState(false);
  const [decryptLoading, setDecryptLoading] = useState(false);
  const [ciphertext, setCiphertext] = useState(null);
  const [decryptedText, setDecryptedText] = useState(null);

  const handleEncrypt = async () => {
    if (!currentKey) {
      addLog('Vui lòng sinh khóa trước', 'error');
      return;
    }
    
    setEncryptLoading(true);
    const startTime = performance.now();
    
    try {
      addLog('Đang mã hóa với RSA-OAEP...', 'info');
      const result = await ApiService.encrypt(currentKey.key_id, message);
      
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(3);
      
      if (result.success) {
        setCiphertext(result.ciphertext_blocks);
        addLog(`Mã hóa thành công! ${result.block_count} block được tạo`, 'success');
        addLog(`Thời gian: ${duration}s`, 'success');
        
        if (addPerformanceData) {
          addPerformanceData('Encrypt', duration, currentKey.key_id);
        }
        
        // Add to history
        if (addHistory) {
          addHistory({
            type: 'encrypt',
            keyId: currentKey.key_id,
            message: message,
            duration: parseFloat(duration),
            blockCount: result.block_count
          });
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
      addLog('Đang giải mã với RSA-CRT...', 'info');
      const result = await ApiService.decrypt(currentKey.key_id, ciphertext);
      
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
        if (addHistory) {
          addHistory({
            type: 'decrypt',
            keyId: currentKey.key_id,
            message: result.plaintext,
            duration: parseFloat(duration)
          });
        }
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
      <h2>🔒 2. Mã hóa / Giải mã (RSA-OAEP)</h2>
      <div className="card-content">
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
            <strong>Ciphertext (first 3 blocks):</strong>
            <pre>{JSON.stringify(ciphertext.slice(0, 3), null, 2)}</pre>
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '8px' }}>
              Tổng cộng: {ciphertext.length} blocks
            </div>
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
