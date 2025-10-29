# 🔐 RSA Demo - Clean Code Architecture

> **Professional RSA Cryptography Web Application with Modern Clean Code Architecture**  
> Advanced demo for Information Security course - National Economics University (NEU)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)](https://flask.palletsprojects.com/)
[![Clean Code](https://img.shields.io/badge/Clean%20Code-Architecture-orange.svg)](https://github.com/NTS051205/RSA_web)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black.svg)](https://vercel.com)
[![Render](https://img.shields.io/badge/Render-Deployed-blue.svg)](https://render.com)

## 🌐 Live Demo

**🔗 Experience Now:** [https://rsa-web-omega.vercel.app](https://rsa-web-omega.vercel.app)

**📦 GitHub Repository:** [https://github.com/NTS051205/RSA_web](https://github.com/NTS051205/RSA_web)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔑 **RSA Key Generation** | Generate public (n, e) and private (p, q, d) key pairs with customizable bit length |
| 🔓 **Encryption/Decryption** | RSA-OAEP with CRT optimization, full display of p, q, public/private keys |
| ✍️ **Digital Signing/Verification** | RSA-PSS (PSS-like) with salt-based security |
| 🔍 **Attack Demo** | Factor modulus n using trial division + Pollard's Rho |
| 📊 **Performance Charts** | Real-time tracking and visualization of RSA operations |
| 🚀 **Advanced Chat** | Interactive RSA chat simulation with Alice & Bob |
| 🔔 **Toast Notifications** | Real-time notifications with beautiful animations |
| 📱 **Responsive Design** | Modern, beautiful interface compatible with all devices |

## 🏗️ Clean Code Architecture

### 📊 Code Metrics Improvement

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Backend main file | 413 lines | 71 lines | **-83%** |
| Frontend main file | 268 lines | 120 lines | **-55%** |
| Chat component | 984 lines | 200 lines | **-80%** |
| Max component size | 984 lines | 150 lines | **-85%** |
| Modularity | 2 large files | 15+ small files | **+650%** |

### 🎯 Architecture Benefits

- ✅ **Separation of Concerns**: Each module has single responsibility
- ✅ **Easy Maintenance**: Find bugs in specific modules
- ✅ **Easy Testing**: Test individual components separately
- ✅ **Easy Extension**: Add features without affecting existing code
- ✅ **Code Reusability**: Components can be reused across the application

## 📁 Project Structure

```
RSA_web/
├── 📁 backend/                    # Flask Backend API (Clean Architecture)
│   ├── app.py                     # Main Flask app (71 lines)
│   ├── config.py                  # Configuration management (40 lines)
│   ├── database.py                # MongoDB operations (92 lines)
│   ├── key_manager.py             # RSA key management (65 lines)
│   ├── routes.py                  # API endpoints (200 lines)
│   ├── validators.py              # Input validation (95 lines)
│   ├── requirements.txt           # Python dependencies
│   ├── README_REFACTOR.md         # Backend architecture docs
│   └── logs/                      # Application logs
│
├── 📁 demo/                       # Original RSA Core (Preserved)
│   ├── rsa_core.py               # Core RSA algorithms (129 lines)
│   ├── app.py                     # Streamlit version
│   ├── requirements.txt           # Dependencies
│   └── README_vi.md              # Vietnamese documentation
│
├── 📁 frontend/                   # React Frontend (Modular Architecture)
│   ├── src/
│   │   ├── 📁 components/         # React components
│   │   │   ├── RSAChat.jsx        # Main chat component (200 lines)
│   │   │   ├── KeyGeneration.jsx  # Key generation UI
│   │   │   ├── Encryption.jsx     # Encryption/decryption UI
│   │   │   ├── Chart.jsx          # Performance charts
│   │   │   ├── History.jsx        # Operation history
│   │   │   └── 📁 chat/           # Chat sub-components
│   │   │       ├── KeyGenerationSection.jsx
│   │   │       ├── MessageInput.jsx
│   │   │       ├── ActionSection.jsx
│   │   │       ├── ProgressLog.jsx
│   │   │       └── ChatHistory.jsx
│   │   ├── 📁 hooks/              # Custom React hooks
│   │   │   ├── useNotifications.js
│   │   │   ├── useHistory.js
│   │   │   ├── usePerformance.js
│   │   │   └── useApiHealth.js
│   │   ├── 📁 constants/          # Application constants
│   │   │   └── index.js
│   │   ├── 📁 services/           # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx                # Main application (120 lines)
│   │   ├── App.css                # Styling
│   │   └── index.js               # Entry point
│   ├── package.json
│   ├── README_REFACTOR.md         # Frontend architecture docs
│   └── public/
│
├── Procfile                       # Heroku deployment config
├── runtime.txt                    # Python version specification
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

## 🌐 Deployment

- **Frontend**: Deployed on [Vercel](https://vercel.com) - https://rsa-web-omega.vercel.app
- **Backend**: Deployed on [Render](https://render.com) - https://rsa-backend-2ew3.onrender.com
- **Repository**: [GitHub](https://github.com/NTS051205/RSA_web)

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 16+
- npm or yarn

### Option 1: Using Virtual Environment (Recommended)

```bash
# Clone repository
git clone https://github.com/NTS051205/RSA_web.git
cd RSA_web

# Setup virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install backend dependencies
pip install -r backend/requirements.txt

# Install frontend dependencies
cd frontend
npm install
cd ..

# Run both servers
# Terminal 1 - Backend
source .venv/bin/activate && cd backend && python app.py

# Terminal 2 - Frontend  
cd frontend && npm start
```

### Option 2: Direct Installation

```bash
# Backend
cd backend
pip install -r requirements.txt
python app.py

# Frontend (new terminal)
cd frontend
npm install
npm start
```

**Backend**: http://localhost:5001  
**Frontend**: http://localhost:3000

## 📖 User Guide

### 🔑 RSA Key Generation
- Select key bit length (512, 1024, 2048, 4096)
- Click "Generate Key" to create RSA key pair
- View key details: Key ID, bit length, public/private components

### 🔓 Encryption/Decryption
- Enter message to encrypt
- Click "Encrypt" to encrypt the message
- Click "Decrypt" to decrypt ciphertext
- Supports both text and packed modes

### 🚀 Advanced Chat Simulation
- Generate keys for Alice and Bob
- Send encrypted messages between users
- Real-time encryption/decryption process
- Interactive chat history

### 📊 Performance Monitoring
- Real-time performance charts
- Operation duration tracking
- Key generation statistics
- Encryption/decryption metrics

## 🛠️ Technology Stack

### Backend Architecture
- **Python 3.11+** - Core language
- **Flask 3.0** - Web framework
- **Flask-CORS** - Cross-origin resource sharing
- **PyMongo** - MongoDB integration
- **Modular Design** - Clean code architecture

### Frontend Architecture
- **React 18** - UI framework
- **Custom Hooks** - State management
- **Modular Components** - Component composition
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Modern CSS** - Responsive design

### Security Features
- **Input Validation** - Comprehensive validation
- **Rate Limiting** - API protection
- **Error Handling** - Graceful error management
- **Logging** - Comprehensive logging system

## 📚 Documentation

- [Backend Architecture](./backend/README_REFACTOR.md) - Backend clean code structure
- [Frontend Architecture](./frontend/README_REFACTOR.md) - Frontend modular design
- [Demo Documentation](./demo/README_vi.md) - Original RSA core documentation

## ⚠️ Security Notice

> **Academic Demo**: Small keys (60-80 bits) for algorithm demonstration  
> **NOT for Production**: Not secure for real-world applications  
> **Production Use**: Use RSA-2048/3072+ with standard `cryptography` library

## 🎓 Academic Information

**Course**: Information Security and Cryptography  
**University**: National Economics University (NEU)  
**Year**: 2025  
**Developer**: NTS  
**Purpose**: Educational demonstration of RSA algorithm implementation

## 📄 License

MIT License - See LICENSE file for details

---

## 🌟 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⭐ Support

If you find this project helpful, please give it a star! ⭐

---

**Built with ❤️ for educational purposes**