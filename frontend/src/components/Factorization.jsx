import React, { useState } from 'react';
import { ApiService } from '../services/api';

function Factorization({ currentKey, addLog }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFactor = async () => {
    if (!currentKey) {
      addLog('Vui lòng sinh khóa trước', 'error');
      return;
    }
    
    setLoading(true);
    setResult(null);
    try {
      addLog('Đang thử factor modulus n...', 'info');
      const result_data = await ApiService.factor(currentKey.key_id);
      
      if (result_data.success) {
        setResult(result_data);
        if (result_data.found) {
          addLog(`Tìm thấy thừa số bằng ${result_data.method} trong ${result_data.time_seconds.toFixed(3)}s!`, 'success');
        } else {
          addLog(`Chưa factor được sau ${result_data.time_seconds.toFixed(3)}s`, 'info');
        }
      } else {
        addLog('Lỗi factor: ' + result_data.error, 'error');
      }
    } catch (error) {
      addLog('Lỗi API factor: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>🔍 4. Demo tấn công: Phân tích modulus n</h2>
      <div className="card-content">
        <p style={{ color: '#666', marginBottom: '16px' }}>
          Thử factor modulus n để chứng minh khóa RSA nhỏ không an toàn.
          Sử dụng trial division và Pollard's Rho.
        </p>

        <div className="button-group">
          <button 
            className="btn btn-danger" 
            onClick={handleFactor}
            disabled={loading || !currentKey}
          >
            {loading && <span className="loading"></span>}
            🔍 Thử factor n
          </button>
        </div>

        {result && (
          <div className={`result-box ${result.found ? 'success' : ''}`}>
            <strong>Kết quả tấn công:</strong>
            <div style={{ marginTop: '12px' }}>
              <div><strong>Phương pháp:</strong> {result.method}</div>
              <div><strong>Thời gian:</strong> {result.time_seconds.toFixed(3)}s</div>
              {result.found ? (
                <>
                  <div style={{ marginTop: '8px', color: '#4caf50', fontWeight: 'bold' }}>
                    ✅ Tìm thấy thừa số: {result.factor}
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '0.9rem', color: '#666' }}>
                    Khóa RSA không an toàn vì modulus quá nhỏ!
                  </div>
                </>
              ) : (
                <div style={{ marginTop: '8px', color: '#666' }}>
                  Chưa factor được trong thời gian demo
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Factorization;
