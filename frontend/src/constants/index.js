// constants/index.js - Application constants
export const TABS = {
  OPERATIONS: 'operations',
  CHAT: 'chat',
  CHART: 'chart',
  HISTORY: 'history'
};

export const TAB_LABELS = {
  [TABS.OPERATIONS]: 'RSA cơ bản (Giải thuật)',
  [TABS.CHAT]: 'Nâng cao (Hybrid Chat)',
  [TABS.CHART]: 'Biểu đồ Thời gian',
  [TABS.HISTORY]: 'Lịch sử'
};

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning'
};

export const KEY_SIZES = [
  { value: 512, label: '512 bits (Nhanh)' },
  { value: 1024, label: '1024 bits (Cân bằng)' },
  { value: 2048, label: '2048 bits (An toàn)' },
  { value: 4096, label: '4096 bits (Rất an toàn - Khuyến nghị)' }
];

export const CHAT_DIRECTIONS = {
  A2B: 'A2B',
  B2A: 'B2A'
};

export const CHAT_DIRECTION_LABELS = {
  [CHAT_DIRECTIONS.A2B]: 'Alice ➜ Bob',
  [CHAT_DIRECTIONS.B2A]: 'Bob ➜ Alice'
};

export const ENCRYPTION_MODES = {
  TEXT: 'text',
  PACKED: 'packed'
};

export const DEFAULT_MESSAGE = 'Hello Bob! Đây là tin nhắn bí mật.';

export const API_CHECK_INTERVAL = 30000; // 30 seconds
export const NOTIFICATION_TIMEOUT = 4000; // 4 seconds
