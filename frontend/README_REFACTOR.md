# RSA Demo Frontend - Refactored Structure

### 📁 Cấu trúc thư mục 

```
frontend/src/
├── App.jsx                    # Main App (120 dòng) - chỉ orchestration
├── components/
│   ├── RSAChat.jsx           # RSA Chat main (200 dòng) - chỉ logic chính
│   ├── chat/                 # Chat sub-components
│   │   ├── KeyGenerationSection.jsx  # Key generation UI (150 dòng)
│   │   ├── MessageInput.jsx          # Message input UI (80 dòng)
│   │   ├── ActionSection.jsx         # Action buttons UI (60 dòng)
│   │   ├── ProgressLog.jsx           # Progress log UI (50 dòng)
│   │   └── ChatHistory.jsx           # Chat history UI (120 dòng)
│   ├── KeyGeneration.jsx    # Existing component
│   ├── Encryption.jsx        # Existing component
│   ├── Chart.jsx             # Existing component
│   ├── History.jsx           # Existing component
│   └── ToastNotification.jsx # Existing component
├── hooks/                    # Custom hooks
│   ├── useNotifications.js   # Notification management (40 dòng)
│   ├── useHistory.js         # History management (60 dòng)
│   ├── usePerformance.js    # Performance data (25 dòng)
│   └── useApiHealth.js       # API health monitoring (30 dòng)
├── constants/
│   └── index.js              # Application constants (35 dòng)
├── services/
│   └── api.js                # API service (existing)
└── App.css                   # Styles (existing)
```

### 🔧 Các module chính

#### 1. **Custom Hooks** - State Management
- **`useNotifications`**: Quản lý toast notifications
- **`useHistory`**: Quản lý lịch sử operations và localStorage
- **`usePerformance`**: Quản lý dữ liệu performance cho chart
- **`useApiHealth`**: Monitor API health status

#### 2. **Constants** - Configuration
- **`constants/index.js`**: Tất cả constants, labels, default values
- Centralized configuration management

#### 3. **Chat Components** - Modular UI
- **`KeyGenerationSection`**: UI cho sinh khóa Alice/Bob
- **`MessageInput`**: UI cho nhập tin nhắn
- **`ActionSection`**: UI cho các action buttons
- **`ProgressLog`**: UI cho hiển thị progress
- **`ChatHistory`**: UI cho hiển thị chat history

#### 4. **Main Components** - Orchestration
- **`App.jsx`**: Main app với tab navigation
- **`RSAChat.jsx`**: Chat logic chính, sử dụng sub-components
### 🚀 **Cách sử dụng**

```bash
cd frontend
npm start
```
