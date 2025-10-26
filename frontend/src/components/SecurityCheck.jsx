/* eslint-env es2015 */
import React, { useState, useEffect } from 'react';

function SecurityCheck({ currentKey }) {
  const [securityAnalysis, setSecurityAnalysis] = useState(null);

  useEffect(() => {
    const analyzeSecurity = () => {
    if (!currentKey) {
      return;
    }

    const bitLength = currentKey.public_key.bit_length;
    const analysis = {
      bitLength,
      level: '',
      recommendations: [],
      warnings: [],
      score: 0,
      levelColor: '',
      levelIcon: ''
    };

    // Analyze based on bit length
    if (bitLength < 256) {
      analysis.level = '🔴 KHÔNG AN TOÀN';
      analysis.levelColor = '#f44336';
      analysis.levelIcon = '🚨';
      analysis.score = 10;
      analysis.warnings.push('Key size quá nhỏ! Dễ bị factor attack.');
      analysis.recommendations.push('Nên sử dụng key ≥ 1024 bits cho mục đích học thuật');
      analysis.recommendations.push('Sử dụng key ≥ 2048 bits cho production');
    } else if (bitLength < 512) {
      analysis.level = '🟡 YẾU';
      analysis.levelColor = '#ff9800';
      analysis.levelIcon = '⚠️';
      analysis.score = 30;
      analysis.warnings.push('Key size nhỏ, chỉ phù hợp cho mục đích demo');
      analysis.recommendations.push('Để an toàn, nên dùng key ≥ 1024 bits');
    } else if (bitLength < 1024) {
      analysis.level = '🟠 TRUNG BÌNH';
      analysis.levelColor = '#ff9800';
      analysis.levelIcon = '⚡';
      analysis.score = 50;
      analysis.warnings.push('Key size có thể bị factor nếu attacker có đủ tài nguyên');
      analysis.recommendations.push('Nên nâng cấp lên ≥ 1024 bits cho bảo mật tốt hơn');
      analysis.recommendations.push('Sử dụng key 2048 bits cho production');
    } else if (bitLength < 2048) {
      analysis.level = '🟢 KHÁ TỐT';
      analysis.levelColor = '#4caf50';
      analysis.levelIcon = '✅';
      analysis.score = 75;
      analysis.recommendations.push('Key size tốt cho mục đích học thuật và demo');
      analysis.recommendations.push('Cho production, nên dùng ≥ 2048 bits');
    } else if (bitLength < 4096) {
      analysis.level = '🟢 TỐT';
      analysis.levelColor = '#4caf50';
      analysis.levelIcon = '✅';
      analysis.score = 90;
      analysis.recommendations.push('Key size an toàn cho production');
      analysis.recommendations.push('Đáp ứng các tiêu chuẩn bảo mật hiện tại');
    } else {
      analysis.level = '🟢 RẤT TỐT';
      analysis.levelColor = '#4caf50';
      analysis.levelIcon = '🛡️';
      analysis.score = 100;
      analysis.recommendations.push('Key size rất an toàn');
      analysis.recommendations.push('Phù hợp cho các ứng dụng bảo mật cao');
    }

    // Check if p and q are close (security concern)
    // eslint-disable-next-line no-undef
    const p = BigInt(currentKey.private_key.p);
    // eslint-disable-next-line no-undef
    const q = BigInt(currentKey.private_key.q);
    const diff = p > q ? p - q : q - p;
    // eslint-disable-next-line no-undef
    const avg = (p + q) / BigInt(2);
    // eslint-disable-next-line no-undef
    const percentDiff = Number(diff * BigInt(100) / avg);

    if (percentDiff < 5 && bitLength < 1024) {
      analysis.warnings.push('Prime p và q quá gần nhau, dễ bị factor bằng phương pháp Fermat');
    }

    // Check if e is standard
    // eslint-disable-next-line no-undef
    const e = BigInt(currentKey.public_key.e);
    // eslint-disable-next-line no-undef
    if (e !== BigInt(65537) && e !== BigInt(3)) {
      // eslint-disable-next-line no-undef
      analysis.warnings.push('Public exponent e không phải giá trị chuẩn (65537 hoặc 3)');
    }

      setSecurityAnalysis(analysis);
    };

    if (currentKey) {
      analyzeSecurity();
    }
  }, [currentKey]);

  if (!currentKey) {
    return null;
  }

  if (!securityAnalysis) {
    return (
      <div className="card">
        <h2>🔒 Phân tích An toàn</h2>
        <div className="card-content">
          <p>Chưa có key để phân tích.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>🔒 Phân tích An toàn RSA</h2>
      <div className="card-content">
        {/* Security Level Badge */}
        <div style={{
          background: `linear-gradient(135deg, ${securityAnalysis.levelColor} 0%, ${securityAnalysis.levelColor}dd 100%)`,
          padding: '24px',
          borderRadius: '16px',
          textAlign: 'center',
          marginBottom: '24px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          border: '2px solid rgba(255,255,255,0.3)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>
            {securityAnalysis.levelIcon}
          </div>
          <div style={{ 
            fontSize: '1.8rem', 
            fontWeight: 700, 
            color: 'white',
            marginBottom: '8px'
          }}>
            {securityAnalysis.level}
          </div>
          <div style={{ 
            fontSize: '0.9rem', 
            color: 'rgba(255,255,255,0.95)',
            fontWeight: 600
          }}>
            Độ an toàn: {securityAnalysis.score}/100
          </div>
        </div>

        {/* Score Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, color: '#4a5568' }}>Chỉ số An toàn</span>
            <span style={{ fontWeight: 700, color: securityAnalysis.levelColor }}>
              {securityAnalysis.score}/100
            </span>
          </div>
          <div style={{
            height: '12px',
            background: '#e2e8f0',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${securityAnalysis.score}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${securityAnalysis.levelColor}, ${securityAnalysis.levelColor}dd)`,
              transition: 'width 0.5s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }} />
          </div>
        </div>

        {/* Key Info */}
        <div style={{
          background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ fontWeight: 600, marginBottom: '12px', color: '#2d3748' }}>
            📋 Thông tin Key
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: '#718096' }}>Bit Length:</span>
              <span style={{ marginLeft: '8px', fontWeight: 700, color: securityAnalysis.levelColor }}>
                {securityAnalysis.bitLength} bits
              </span>
            </div>
            <div>
              <span style={{ color: '#718096' }}>Độ phức tạp:</span>
              <span style={{ marginLeft: '8px', fontFamily: 'monospace' }}>
                2^{Math.ceil(securityAnalysis.bitLength * 0.693)} operations
              </span>
            </div>
          </div>
        </div>

        {/* Warnings */}
        {securityAnalysis.warnings.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #fff3cd 0%, #fff8e1 100%)',
            borderLeft: '4px solid #ff9800',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ fontWeight: 700, marginBottom: '12px', color: '#f57c00' }}>
              ⚠️ Cảnh báo An toàn
            </div>
            {securityAnalysis.warnings.map((warning, idx) => (
              <div key={idx} style={{ 
                marginBottom: '8px', 
                fontSize: '0.9rem',
                color: '#e65100'
              }}>
                • {warning}
              </div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        <div style={{
          background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%)',
          borderLeft: '4px solid #4caf50',
          padding: '16px',
          borderRadius: '12px'
        }}>
          <div style={{ fontWeight: 700, marginBottom: '12px', color: '#2e7d32' }}>
            💡 Khuyến nghị
          </div>
          {securityAnalysis.recommendations.map((rec, idx) => (
            <div key={idx} style={{ 
              marginBottom: '8px', 
              fontSize: '0.9rem',
              color: '#1b5e20'
            }}>
              ✓ {rec}
            </div>
          ))}
        </div>

        {/* Security Facts */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: '#f8f9fa',
          borderRadius: '12px'
        }}>
          <div style={{ fontWeight: 600, marginBottom: '12px', color: '#2d3748' }}>
            📚 Thông tin Bảo mật
          </div>
          <div style={{ fontSize: '0.85rem', lineHeight: '1.8', color: '#4a5568' }}>
            <div>• RSA-1024: Có thể bị crack bởi quantum computer trong tương lai</div>
            <div>• RSA-2048: Khuyến nghị cho production (bảo mật tới 2030)</div>
            <div>• RSA-4096: Khuyến nghị cho dữ liệu nhạy cảm cao</div>
            <div>• Public exponent e=65537 là tiêu chuẩn an toàn</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecurityCheck;

