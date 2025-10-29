// components/RSAChatNew.jsx - Refactored RSA Chat component
import React, { useState } from 'react';
import { ApiService } from '../services/api';
import { CHAT_DIRECTIONS, DEFAULT_MESSAGE } from '../constants';

// Import sub-components
import KeyGenerationSection from './chat/KeyGenerationSection';
import MessageInput from './chat/MessageInput';
import ActionSection from './chat/ActionSection';
import ProgressLog from './chat/ProgressLog';
import ChatHistory from './chat/ChatHistory';

function RSAChatNew({ addLog, addPerformanceData, addHistory }) {
  const [alice, setAlice] = useState(null);
  const [bob, setBob] = useState(null);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [mode] = useState('packed');
  const [direction, setDirection] = useState(CHAT_DIRECTIONS.A2B);
  const [progress, setProgress] = useState([]);
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState({ alice: false, bob: false, send: false, decrypt: false });
  const [keyBits, setKeyBits] = useState(1024);
  const [showKeyDetails, setShowKeyDetails] = useState({ alice: false, bob: false });
  const [showCiphertext, setShowCiphertext] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

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
    if (direction === CHAT_DIRECTIONS.A2B && !bob) { 
      addLog && addLog('Bob chưa có khóa công khai để nhận tin!', 'error'); 
      return; 
    }
    if (direction === CHAT_DIRECTIONS.B2A && !alice) { 
      addLog && addLog('Alice chưa có khóa công khai để nhận tin!', 'error'); 
      return; 
    }

    setLoading(s => ({ ...s, send: true }));
    setProgress([]);

    try {
      const sender = direction === CHAT_DIRECTIONS.A2B ? 'Alice' : 'Bob';
      const receiver = direction === CHAT_DIRECTIONS.A2B ? 'Bob' : 'Alice';
      const recvKey = direction === CHAT_DIRECTIONS.A2B ? bob : alice;

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
        ciphertextData: encRes,
        decrypted: null,
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
        <KeyGenerationSection
          alice={alice}
          bob={bob}
          keyBits={keyBits}
          setKeyBits={setKeyBits}
          showKeyDetails={showKeyDetails}
          setShowKeyDetails={setShowKeyDetails}
          loading={loading}
          onGenerateAlice={handleGenAlice}
          onGenerateBob={handleGenBob}
        />

        {/* Message Input Section */}
        <MessageInput
          message={message}
          setMessage={setMessage}
          onSend={handleSend}
          loading={loading}
        />

        {/* Action Section */}
        <ActionSection
          direction={direction}
          setDirection={setDirection}
          onSend={handleSend}
          loading={loading}
        />

        {/* Bottom Panels */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.2fr 1fr', 
          gap: '20px',
          marginTop: '24px'
        }}>
          <ProgressLog
            progress={progress}
            setProgress={setProgress}
          />
          
          <ChatHistory
            chat={chat}
            showCiphertext={showCiphertext}
            setShowCiphertext={setShowCiphertext}
            compactMode={compactMode}
            setCompactMode={setCompactMode}
            loading={loading}
            onDecrypt={handleDecrypt}
          />
        </div>

        {/* Chat History */}
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

export default RSAChatNew;
