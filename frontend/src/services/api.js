import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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

  generateKey: async (pLow, pHigh) => {
    const response = await api.post('/api/generate-key', {
      p_low: pLow,
      p_high: pHigh,
    });
    return response.data;
  },

  encrypt: async (keyId, message) => {
    const response = await api.post('/api/encrypt', {
      key_id: keyId,
      message: message,
    });
    return response.data;
  },

  decrypt: async (keyId, ciphertextBlocks) => {
    const response = await api.post('/api/decrypt', {
      key_id: keyId,
      ciphertext_blocks: ciphertextBlocks,
    });
    return response.data;
  },

  sign: async (keyId, message) => {
    const response = await api.post('/api/sign', {
      key_id: keyId,
      message: message,
    });
    return response.data;
  },

  verify: async (keyId, message, signature, salt) => {
    const response = await api.post('/api/verify', {
      key_id: keyId,
      message: message,
      signature: signature,
      salt: salt,
    });
    return response.data;
  },

  factor: async (keyId) => {
    const response = await api.post('/api/factor', {
      key_id: keyId,
    });
    return response.data;
  },

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
