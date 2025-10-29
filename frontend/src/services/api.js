import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ApiService = {
  health: async () => {
    const response = await api.get('/api/health');
    return response.data;
  },

  generateKey: async (bits) => {
    const response = await api.post('/api/generate-key', {
      bits: bits,
    });
    return response.data;
  },

  encrypt: async (keyId, message, mode = 'text') => {
    const response = await api.post('/api/encrypt', {
      key_id: keyId,
      message: message,
      mode,
    });
    return response.data;
  },

  decryptText: async (keyId, ciphertextBlocksB64) => {
    const response = await api.post('/api/decrypt', {
      key_id: keyId,
      mode: 'text',
      ciphertext_blocks_b64: ciphertextBlocksB64,
    });
    return response.data;
  },

  decryptPacked: async (keyId, ciphertext) => {
    const response = await api.post('/api/decrypt', {
      key_id: keyId,
      mode: 'packed',
      ciphertext: ciphertext,
    });
    return response.data;
  },

  // Removed sign/verify/factor API as backend no longer supports them

  saveLog: async (logData) => {
    const response = await api.post('/api/logs', logData);
    return response.data;
  },

  getLogs: async (limit = 50) => {
    const response = await api.get(`/api/logs?limit=${limit}`);
    return response.data;
  },

  clearLogs: async () => {
    const response = await api.delete('/api/logs/clear');
    return response.data;
  },
};
