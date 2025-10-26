import React, { useState } from 'react';
import { ApiService } from '../services/api';

function Signing({ currentKey, addLog, addHistory, addPerformanceData }) {
  const [message, setMessage] = useState('Đây là chữ ký demo PSS-like.');
  const [verifyMessage, setVerifyMessage] = useState('Đây là chữ ký demo PSS-like.');
  const [signLoading, setSignLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [signature, setSignature] = useState(null);
  const [salt, setSalt] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);

  const handleSign = async () => {
    if (!currentKey) {
      addLog('Vui lòng sinh khóa trước', 'error');
      return;
    }
    
    setSignLoading(true);
    const startTime = performance.now();
    
    try {
      addLog('Đang ký số với RSA-PSS...', 'info');
      const result = await ApiService.sign(currentKey.key_id, message);
      
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(3);
      
      if (result.success) {
        setSignature(result.signature);
        setSalt(result.salt);
        addLog('Ký số thành công!', 'success');
        addLog(`Thời gian: ${duration}s`, 'success');
        
        if (addPerformanceData) {
          addPerformanceData('Sign', duration, currentKey.key_id);
        }
        
        if (addHistory) {
          addHistory({
            type: 'sign',
            keyId: currentKey.key_id,
            message: message,
            duration: parseFloat(duration),
            signatureLength: result.signature.length
          });
        }
      } else {
        addLog('Lỗi ký số: ' + result.error, 'error');
      }
    } catch (error) {
      addLog('Lỗi API ký số: ' + error.message, 'error');
    } finally {
      setSignLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!currentKey) {
      addLog('Vui lòng sinh khóa trước', 'error');
      return;
    }
    
    if (!signature || !salt) {
      addLog('Chưa có chữ ký', 'error');
      return;
    }
    
    setVerifyLoading(true);
    const startTime = performance.now();
    
    try {
      addLog('Đang xác minh chữ ký...', 'info');
      const result = await ApiService.verify(currentKey.key_id, verifyMessage, signature, salt);
      
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(3);
      
      if (result.success) {
        setVerifyResult(result.is_valid);
        addLog(`Xác minh: ${result.is_valid ? 'HỢP LỆ ✅' : 'KHÔNG HỢP LỆ ❌'}`, 
          result.is_valid ? 'success' : 'error');
        addLog(`Thời gian: ${duration}s`, 'info');
        
        if (addPerformanceData) {
          addPerformanceData('Verify', duration, currentKey.key_id);
        }
        
        if (addHistory) {
          addHistory({
            type: 'verify',
            keyId: currentKey.key_id,
            message: verifyMessage,
            duration: parseFloat(duration),
            isValid: result.is_valid
          });
        }
      } else {
        addLog('Lỗi xác minh: ' + result.error, 'error');
      }
    } catch (error) {
      addLog('Lỗi API xác minh: ' + error.message, 'error');
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>✍️ 3. Ký số / Xác minh (RSA-PSS)</h2>
      <div className="card-content">
        <div className="form-group">
          <label>Chuỗi cần ký</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập chuỗi cần ký..."
          />
        </div>

        <div className="button-group">
          <button 
            className="btn btn-primary" 
            onClick={handleSign}
            disabled={signLoading || !currentKey}
          >
            {signLoading && <span className="loading"></span>}
            ✍️ Ký số
          </button>
        </div>

        {signature && (
          <div className="result-box">
            <strong>Chữ ký (first 100 chars):</strong>
            <pre>{signature.substring(0, 100)}...</pre>
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '8px' }}>
              Salt: {salt.substring(0, 32)}...
            </div>
          </div>
        )}

        <div className="form-group" style={{ marginTop: '24px' }}>
          <label>Nhập lại chuỗi để xác minh</label>
          <textarea
            value={verifyMessage}
            onChange={(e) => setVerifyMessage(e.target.value)}
            placeholder="Nhập chuỗi để verify..."
          />
        </div>

        <div className="button-group">
          <button 
            className="btn btn-success" 
            onClick={handleVerify}
            disabled={verifyLoading || !currentKey || !signature}
          >
            {verifyLoading && <span className="loading"></span>}
            🧪 Xác minh
          </button>
        </div>

        {verifyResult !== null && (
          <div className={`result-box ${verifyResult ? 'success' : 'error'}`}>
            <strong>Kết quả xác minh:</strong>
            <div style={{ marginTop: '8px', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {verifyResult ? '✅ HỢP LỆ' : '❌ KHÔNG HỢP LỆ'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signing;
