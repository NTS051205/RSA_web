import React, { useState } from 'react';

function Factorization({ currentKey, addLog }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFactor = async () => {
    addLog('Tính năng factor đã được loại bỏ trong phiên bản mới.', 'info');
    setResult({ removed: true });
  };

  return (
    <div className="card">
      <h2>🔍 3. Demo tấn công (đã loại bỏ)</h2>
      <div className="card-content">
        <p style={{ color: '#666', marginBottom: '16px' }}>
          Phần factor hóa n đã được loại bỏ để tập trung vào 2 chế độ RSA.
        </p>

        <div className="button-group">
          <button 
            className="btn btn-danger" 
            onClick={handleFactor}
            disabled={loading || !currentKey}
          >
            {loading && <span className="loading"></span>}
            🔍 Factor n (không còn hỗ trợ)
          </button>
        </div>

        {result && (
          <div className={`result-box ${result.found ? 'success' : ''}`}>
            <strong>Thông tin:</strong>
            <div style={{ marginTop: '12px' }}>
              Tính năng factor đã bị tắt.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Factorization;
