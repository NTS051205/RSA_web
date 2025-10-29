import React, { useState } from 'react';
import { ApiService } from '../services/api';

function RSAChat({ addLog, addPerformanceData, addHistory }) {
  const [alice, setAlice] = useState(null);
  const [bob, setBob] = useState(null);
  const [message, setMessage] = useState('Hello Bob! Đây là tin nhắn bí mật.');
  const [mode] = useState('packed');
  const [direction, setDirection] = useState('A2B'); // 'A2B' | 'B2A'
  const [progress, setProgress] = useState([]);
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState({ alice: false, bob: false, send: false, decrypt: false }); // Thêm decrypt loading
  const [keyBits, setKeyBits] = useState(1024); // Thêm state cho bit size
  const [showKeyDetails, setShowKeyDetails] = useState({ alice: false, bob: false }); // State để toggle key details
  const [showCiphertext, setShowCiphertext] = useState(false); // State để toggle ciphertext display
  const [compactMode, setCompactMode] = useState(false); // State để toggle compact mode cho ciphertext dài

  const pushStep = (text, type = 'info') => {
    setProgress(prev => [...prev, { id: Date.now() + Math.random(), text, type }]);
  };

  const handleGenAlice = async () => {
    setLoading(s => ({ ...s, alice: true }));
    setProgress([]);
    try {
      pushStep('Alice: Đang sinh khóa...', 'info');
      const t0 = performance.now();
      const res = await ApiService.generateKey(keyBits);
      const t1 = performance.now();
      if (res.success) {
        setAlice(res);
        pushStep(`Alice: Khóa sẵn sàng (Key ID: ${res.key_id})`, 'success');
        addLog && addLog(`Alice sinh khóa thành công (${res.bit_length})`, 'success');
        addPerformanceData && addPerformanceData('Generate Key (Alice)', ((t1 - t0) / 1000).toFixed(3), res.key_id);
        addHistory && addHistory({ type: 'generate_key', keyId: res.key_id, bitLength: res.bit_length, duration: parseFloat(((t1 - t0) / 1000).toFixed(3)), modulus: res.public_key.n });
      } else {
        pushStep('Alice: Lỗi sinh khóa', 'error');
        addLog && addLog('Alice: Lỗi sinh khóa', 'error');
      }
    } catch (e) {
      pushStep('Alice: Lỗi API sinh khóa', 'error');
      addLog && addLog('Alice: Lỗi API sinh khóa: ' + e.message, 'error');
    } finally {
      setLoading(s => ({ ...s, alice: false }));
    }
  };

  const handleGenBob = async () => {
    setLoading(s => ({ ...s, bob: true }));
    setProgress([]);
    try {
      pushStep('Bob: Đang sinh khóa...', 'info');
      const t0 = performance.now();
      const res = await ApiService.generateKey(keyBits);
      const t1 = performance.now();
      if (res.success) {
        setBob(res);
        pushStep(`Bob: Khóa sẵn sàng (Key ID: ${res.key_id})`, 'success');
        addLog && addLog(`Bob sinh khóa thành công (${res.bit_length})`, 'success');
        addPerformanceData && addPerformanceData('Generate Key (Bob)', ((t1 - t0) / 1000).toFixed(3), res.key_id);
        addHistory && addHistory({ type: 'generate_key', keyId: res.key_id, bitLength: res.bit_length, duration: parseFloat(((t1 - t0) / 1000).toFixed(3)), modulus: res.public_key.n });
      } else {
        pushStep('Bob: Lỗi sinh khóa', 'error');
        addLog && addLog('Bob: Lỗi sinh khóa', 'error');
      }
    } catch (e) {
      pushStep('Bob: Lỗi API sinh khóa', 'error');
      addLog && addLog('Bob: Lỗi API sinh khóa: ' + e.message, 'error');
    } finally {
      setLoading(s => ({ ...s, bob: false }));
    }
  };

  const handleSend = async () => {
    // Kiểm tra logic RSA đúng: chỉ cần khóa công khai của người nhận
    if (direction === 'A2B' && !bob) { 
      addLog && addLog('Bob chưa có khóa công khai để nhận tin!', 'error'); 
      return; 
    }
    if (direction === 'B2A' && !alice) { 
      addLog && addLog('Alice chưa có khóa công khai để nhận tin!', 'error'); 
      return; 
    }

    setLoading(s => ({ ...s, send: true }));
    setProgress([]);

    try {
      const sender = direction === 'A2B' ? 'Alice' : 'Bob';
      const receiver = direction === 'A2B' ? 'Bob' : 'Alice';
      const recvKey = direction === 'A2B' ? bob : alice;

      pushStep(`${sender} → ${receiver}: Bắt đầu`, 'info');
      pushStep(`${sender}: Lấy public key của ${receiver}`, 'info');
      const tEnc0 = performance.now();
      const encRes = await ApiService.encrypt(recvKey.key_id, message, mode);
      const tEnc1 = performance.now();
      if (!encRes.success) throw new Error(encRes.error || 'Encrypt failed');
      if (mode === 'text') {
        pushStep(`${sender}: Mã hóa (text) thành công (${encRes.block_count} block)`, 'success');
      } else {
        pushStep(`${sender}: Mã hóa (packed) thành công (${encRes.block_count} block)`, 'success');
      }
      addPerformanceData && addPerformanceData('Encrypt (Chat)', ((tEnc1 - tEnc0) / 1000).toFixed(3), recvKey.key_id);

      pushStep(`${receiver}: Nhận ciphertext, sẵn sàng để giải mã`, 'info');
      
      const chatItem = {
        id: Date.now(),
        from: sender,
        to: receiver,
        plaintext: message,
        ciphertextBlocks: mode === 'text' ? (encRes.ciphertext_blocks_b64 || []) : (encRes.ciphertext?.c || []),
        ciphertextData: encRes, // Lưu toàn bộ dữ liệu ciphertext
        decrypted: null, // Chưa giải mã
        receiverKeyId: recvKey.key_id
      };
      setChat(prev => [chatItem, ...prev]);

      addHistory && addHistory({ 
        type: 'chat_message', 
        keyId: recvKey.key_id, 
        message: message, 
        duration: parseFloat(((tEnc1 - tEnc0) / 1000).toFixed(3)), 
        blockCount: encRes.block_count,
        from: sender,
        to: receiver,
        decrypted: null
      });
      addLog && addLog(`${sender} gửi tin nhắn mã hóa tới ${receiver} thành công. ${receiver} có thể giải mã bằng khóa bí mật.`, 'success');
    } catch (e) {
      pushStep(`Lỗi: ${e.message}`, 'error');
      addLog && addLog('Chat error: ' + e.message, 'error');
    } finally {
      setLoading(s => ({ ...s, send: false }));
    }
  };

  const handleDecrypt = async (chatItem) => {
    setLoading(s => ({ ...s, decrypt: true }));
    // Không reset progress, chỉ thêm bước mới
    
    try {
      const receiver = chatItem.to;
      const receiverKey = receiver === 'Alice' ? alice : bob;
      
      if (!receiverKey) {
        addLog && addLog(`Chưa có khóa của ${receiver}`, 'error');
        return;
      }
      
      pushStep(`${receiver}: Bắt đầu giải mã bằng khóa bí mật...`, 'info');
      const tDec0 = performance.now();
      
      let decRes;
      if (mode === 'text') {
        decRes = await ApiService.decryptText(receiverKey.key_id, chatItem.ciphertextData.ciphertext_blocks_b64);
      } else {
        decRes = await ApiService.decryptPacked(receiverKey.key_id, chatItem.ciphertextData.ciphertext);
      }
      
      const tDec1 = performance.now();
      if (!decRes.success) throw new Error(decRes.error || 'Decrypt failed');
      
      pushStep(`${receiver}: Giải mã thành công!`, 'success');
      addPerformanceData && addPerformanceData('Decrypt (Chat)', ((tDec1 - tDec0) / 1000).toFixed(3), receiverKey.key_id);
      
      // Cập nhật chat item với kết quả giải mã
      setChat(prev => prev.map(item => 
        item.id === chatItem.id 
          ? { ...item, decrypted: decRes.plaintext }
          : item
      ));
      
      addHistory && addHistory({ 
        type: 'decrypt', 
        keyId: receiverKey.key_id, 
        message: decRes.plaintext, 
        duration: parseFloat(((tDec1 - tDec0) / 1000).toFixed(3)),
        from: chatItem.from,
        to: chatItem.to,
        decrypted: decRes.plaintext
      });
      addLog && addLog(`${receiver} giải mã thành công tin nhắn từ ${chatItem.from}`, 'success');
      
    } catch (e) {
      pushStep(`Lỗi giải mã: ${e.message}`, 'error');
      addLog && addLog('Decrypt error: ' + e.message, 'error');
    } finally {
      setLoading(s => ({ ...s, decrypt: false }));
    }
  };

  return (
    <div className="card">
      <h2>🚀 Nâng cao: Packed Chat (RSA Packed Mode)</h2>
      <div className="card-content">
        {/* Header with avatars */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '24px', 
          marginBottom: '24px',
          padding: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.2)', 
              color: '#fff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 700,
              fontSize: '1.1rem',
              backdropFilter: 'blur(10px)'
            }}>A</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Alice</div>
          </div>
          <div style={{ 
            fontSize: '1.2rem', 
            fontWeight: 600,
            opacity: 0.8
          }}>💬</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.2)', 
              color: '#fff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 700,
              fontSize: '1.1rem',
              backdropFilter: 'blur(10px)'
            }}>B</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Bob</div>
          </div>
        </div>

        {/* Key Generation Section */}
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
                <option value={512}>512 bits (Nhanh)</option>
                <option value={1024}>1024 bits (Cân bằng)</option>
                <option value={2048}>2048 bits (An toàn)</option>
                <option value={4096}>4096 bits (Rất an toàn - Khuyến nghị)</option>
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
              onClick={handleGenAlice}
              disabled={loading.alice}
              style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)'
              }}
            >{loading.alice && <span className="loading"></span>}🔑 Sinh khóa Alice</button>
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
              onClick={handleGenBob}
              disabled={loading.bob}
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)'
              }}
            >{loading.bob && <span className="loading"></span>}🔑 Sinh khóa Bob</button>
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

        {/* Message Input Section */}
        <div style={{ 
          marginBottom: '20px',
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          border: 'none',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            opacity: 0.3
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '150px',
            height: '150px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
            opacity: 0.4
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                backdropFilter: 'blur(10px)'
              }}>
                💬
              </div>
              <div>
                <div style={{ 
                  fontWeight: 700, 
                  color: 'white',
                  fontSize: '1.2rem',
                  marginBottom: '4px'
                }}>Thông điệp bí mật</div>
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 500
                }}>Nhập tin nhắn cần mã hóa</div>
              </div>
            </div>
            
            <textarea 
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              placeholder="Nhập tin nhắn bí mật..."
              style={{ 
                width: '100%',
                minHeight: '100px',
                borderRadius: '12px',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '16px',
                fontSize: '1rem',
                resize: 'vertical',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                color: '#333',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
              onFocus={(e) => {
                e.target.style.border = '2px solid rgba(255,255,255,0.8)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(255,255,255,0.3)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
              }}
            />
            
            <div style={{
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.8)'
            }}>
              <span>📝</span>
              <span>{message.length} ký tự</span>
              <span style={{ marginLeft: 'auto', fontWeight: 600 }}>
                🔐 Sẽ được mã hóa bằng RSA
              </span>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div style={{
          display: 'flex', 
          gap: '16px', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: '20px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: '16px',
          border: '2px solid #cbd5e1',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              color: 'white',
              fontWeight: 700
            }}>
              📤
            </div>
            <select 
              value={direction} 
              onChange={e => setDirection(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: '2px solid #667eea',
                background: 'white',
                fontWeight: 600,
                color: '#667eea',
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
              }}
            >
              <option value="A2B">Alice ➜ Bob</option>
              <option value="B2A">Bob ➜ Alice</option>
            </select>
          </div>
          
          <div style={{ 
            fontSize: '0.9rem', 
            color: '#475569',
            fontWeight: 600,
            background: 'rgba(102, 126, 234, 0.1)',
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1px solid rgba(102, 126, 234, 0.2)'
          }}>
            🔐 Chế độ: Packed
          </div>
          
          <button 
            className="btn btn-success" 
            onClick={handleSend}
            disabled={loading.send}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 24px',
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
              color: 'white',
              cursor: loading.send ? 'not-allowed' : 'pointer',
              opacity: loading.send ? 0.7 : 1,
              transition: 'all 0.3s ease',
              transform: loading.send ? 'scale(0.98)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              if (!loading.send) {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading.send) {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.3)';
              }
            }}
          >
            {loading.send && <span className="loading"></span>}
            📨 Gửi tin nhắn mã hóa
          </button>
        </div>

        {/* Bottom Panels */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.2fr 1fr', 
          gap: '20px',
          marginTop: '24px'
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            padding: '16px',
            minHeight: '200px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <strong style={{ 
                color: '#475569',
                fontSize: '1rem'
              }}>📜 Nhật ký tiến trình</strong>
              <button
                onClick={() => setProgress([])}
                style={{
                  padding: '4px 8px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                🗑️ Xóa
              </button>
            </div>
            <div style={{ 
              marginTop: '8px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px',
              maxHeight: '160px',
              overflowY: 'auto'
            }}>
              {progress.slice(-8).map(step => (
                <div key={step.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '6px 8px',
                  background: 'rgba(255,255,255,0.7)',
                  borderRadius: '6px',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    background: step.type === 'error' ? '#ef4444' : step.type === 'success' ? '#10b981' : '#3b82f6' 
                  }}></div>
                  <div style={{ 
                    color: step.type === 'error' ? '#dc2626' : step.type === 'success' ? '#059669' : '#1e40af' 
                  }}>{step.text}</div>
                </div>
              ))}
            </div>
          </div>
          
                  <div style={{ 
                    background: 'linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%)',
                    borderRadius: '12px',
                    border: '2px solid #d8b4fe',
                    padding: '16px',
                    minHeight: '200px',
                    overflow: 'hidden',
                    wordWrap: 'break-word'
                  }}>
            <strong style={{ 
              color: '#7c3aed',
              fontSize: '1rem',
              marginBottom: '12px',
              display: 'block'
            }}>💬 Tin nhắn gần nhất</strong>
            {chat.length === 0 ? (
              <div style={{ 
                marginTop: '8px', 
                color: '#a78bfa',
                textAlign: 'center',
                padding: '20px',
                fontSize: '0.9rem'
              }}>Chưa có tin nhắn</div>
            ) : (
              <div style={{ 
                marginTop: '8px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                maxHeight: '160px',
                overflowY: 'auto'
              }}>
                {/* Sender bubble */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ 
                    maxWidth: '75%', 
                    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', 
                    color: '#1e40af', 
                    padding: '10px 12px', 
                    borderRadius: '12px', 
                    borderTopRightRadius: 4,
                    fontSize: '0.9rem'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginBottom: 4 }}>{chat[0].from}</div>
                    <div>{chat[0].plaintext}</div>
                  </div>
                </div>
                {/* Cipher preview */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: 600 }}>
                    Cipher payload ({chat[0].ciphertextBlocks.length} blocks):
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {showCiphertext && chat[0].ciphertextBlocks.length > 0 && (
                      <button
                        onClick={() => setCompactMode(!compactMode)}
                        style={{
                          padding: '4px 8px',
                          background: compactMode ? '#ff9800' : '#2196f3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        {compactMode ? '📄 Dạng đầy đủ' : '📋 Dạng compact'}
                      </button>
                    )}
                    <button
                      onClick={() => setShowCiphertext(!showCiphertext)}
                      style={{
                        padding: '4px 8px',
                        background: showCiphertext ? '#f44336' : '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      {showCiphertext ? '🔽 Ẩn' : '🔍 Xem'}
                    </button>
                  </div>
                </div>
                
                {showCiphertext ? (
                  <div>
                    {compactMode ? (
                      <div>
                        <pre style={{ 
                          whiteSpace: 'pre-wrap', 
                          wordBreak: 'break-all',
                          background: '#f8f9fa', 
                          color: '#212529', 
                          padding: '12px', 
                          borderRadius: '8px',
                          fontSize: '0.65rem',
                          overflow: 'auto',
                          maxHeight: '200px',
                          border: '1px solid #dee2e6',
                          fontFamily: 'monospace',
                          lineHeight: '1.2',
                          maxWidth: '100%'
                        }}>{JSON.stringify(chat[0].ciphertextBlocks, null, 0)}</pre>
                        <div style={{ 
                          fontSize: '0.7rem', 
                          color: '#ff9800', 
                          marginTop: '4px',
                          textAlign: 'center',
                          background: 'rgba(255, 152, 0, 0.1)',
                          padding: '4px',
                          borderRadius: '4px'
                        }}>
                          📋 Dạng compact - Phù hợp cho khóa lớn (4096 bits)
                        </div>
                      </div>
                    ) : (
                      <div>
                        <pre style={{ 
                          whiteSpace: 'pre-wrap', 
                          wordBreak: 'break-all',
                          background: '#f8f9fa', 
                          color: '#212529', 
                          padding: '12px', 
                          borderRadius: '8px',
                          fontSize: '0.7rem',
                          overflow: 'auto',
                          maxHeight: '300px',
                          border: '1px solid #dee2e6',
                          fontFamily: 'monospace',
                          lineHeight: '1.3',
                          maxWidth: '100%'
                        }}>{JSON.stringify(chat[0].ciphertextBlocks, null, 2)}</pre>
                        <div style={{ 
                          fontSize: '0.7rem', 
                          color: '#a78bfa', 
                          marginTop: '4px',
                          textAlign: 'center',
                          background: 'rgba(167, 139, 250, 0.1)',
                          padding: '4px',
                          borderRadius: '4px'
                        }}>
                          📋 Đầy đủ {chat[0].ciphertextBlocks.length} blocks - Copy để test với thuật toán khác
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ 
                    fontSize: '0.7rem', 
                    color: '#666', 
                    textAlign: 'center',
                    background: 'rgba(0,0,0,0.05)',
                    padding: '8px',
                    borderRadius: '4px',
                    fontStyle: 'italic'
                  }}>
                    Click "🔍 Xem" để hiển thị ciphertext đầy đủ
                  </div>
                )}
                {/* Receiver bubble */}
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ 
                    maxWidth: '75%', 
                    background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', 
                    color: '#166534', 
                    padding: '10px 12px', 
                    borderRadius: '12px', 
                    borderTopLeftRadius: 4,
                    fontSize: '0.9rem'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#16a34a', marginBottom: 4 }}>{chat[0].to}</div>
                    {chat[0].decrypted ? (
                      <div>{chat[0].decrypted}</div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontStyle: 'italic', color: '#666' }}>Tin nhắn đã mã hóa</span>
                        <button
                          onClick={() => handleDecrypt(chat[0])}
                          disabled={loading.decrypt}
                          style={{
                            padding: '4px 8px',
                            background: '#4caf50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            cursor: loading.decrypt ? 'not-allowed' : 'pointer',
                            fontWeight: 600,
                            opacity: loading.decrypt ? 0.6 : 1
                          }}
                        >
                          {loading.decrypt ? '⏳' : '🔓'} Giải mã
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {chat.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <strong>📚 Lịch sử chat</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              {chat.map(item => (
                <div key={item.id} style={{ padding: '8px 0' }}>
                  <div style={{ display: 'flex', justifyContent: item.from === 'Alice' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '75%', background: item.from === 'Alice' ? '#e0e7ff' : '#dcfce7', color: '#1f2937', padding: '10px 12px', borderRadius: '12px', borderTopRightRadius: item.from === 'Alice' ? 4 : 12, borderTopLeftRadius: item.from === 'Alice' ? 12 : 4 }}>
                      <div style={{ fontSize: '0.75rem', color: item.from === 'Alice' ? '#4338ca' : '#16a34a', marginBottom: 4 }}>{item.from} ➜ {item.to}</div>
                      {item.decrypted ? (
                        <div>{item.decrypted}</div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#666' }}>Tin nhắn đã mã hóa</span>
                          <button
                            onClick={() => handleDecrypt(item)}
                            disabled={loading.decrypt}
                            style={{
                              padding: '3px 6px',
                              background: '#4caf50',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              fontSize: '0.65rem',
                              cursor: loading.decrypt ? 'not-allowed' : 'pointer',
                              fontWeight: 600,
                              opacity: loading.decrypt ? 0.6 : 1
                            }}
                          >
                            {loading.decrypt ? '⏳' : '🔓'} Giải mã
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RSAChat;


