#  Dự án RSA Demo – Ứng dụng Mã hóa và Giải mã RSA

> **Ứng dụng web minh họa thuật toán RSA**  
> Bài tập lớn môn *An toàn & Bảo mật Thông tin* – Đại học Kinh tế Quốc dân (NEU)

---

##  Tính năng chính

| Chức năng | Mô tả |
|------------|--------|
|  **Sinh khóa RSA** | Sinh cặp khóa công khai (n, e) và khóa bí mật (p, q, d) với độ dài bit tùy chọn |
|  **Mã hóa / Giải mã** | |
|  **Chat mô phỏng Alice - Bob** | Mô phỏng gửi – nhận tin nhắn được mã hóa RSA |
|  **Biểu đồ hiệu năng** | So sánh tốc độ sinh khóa, mã hóa, giải mã |

---
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)](https://flask.palletsprojects.com/)
[![Clean Code](https://img.shields.io/badge/Clean%20Code-Architecture-orange.svg)](https://github.com/NTS051205/RSA_web)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black.svg)](https://vercel.com)
[![Render](https://img.shields.io/badge/Render-Deployed-blue.svg)](https://render.com)

---

## 🌐 Live Demo

**🔗 Experience Now:** [https://rsa-web-omega.vercel.app](https://rsa-web-omega.vercel.app)

**📦 GitHub Repository:** [https://github.com/NTS051205/RSA_web](https://github.com/NTS051205/RSA_web)

---
RSA_web/
├── backend/ # Flask Backend API
├── frontend/ # Giao diện ReactJS
├── demo/ # Mã nguồn gốc (RSA Core)
├── LICENSE # Giấy phép MIT
├── README.md # Tài liệu này
├── CONTRIBUTING.md # Quy định đóng góp
├── Procfile # Cấu hình Heroku / Render
├── runtime.txt # Phiên bản Python

---
## Công nghệ sử dụng

- **Backend:** Flask 3.0, Python 3.11, MongoDB
- **Frontend:** ReactJS 18, Axios, Recharts, TailwindCSS
- **Triển khai:** Render (Backend), Vercel (Frontend)

---
## Cách chạy chương trình

### Cách 1 – Chạy toàn bộ môi trường ảo (khuyến nghị)

```bash
# Clone dự án
git clone https://github.com/NTS051205/RSA_web.git
cd RSA_web

# Tạo môi trường ảo
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Cài đặt backend
pip install -r backend/requirements.txt
cd frontend && npm install && cd ..

# Chạy backend
cd backend
python app.py

# Chạy frontend
cd ../frontend
npm install
npm start


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

## Deployment

- **Frontend**: Deployed on [Vercel](https://vercel.com) - https://rsa-web-omega.vercel.app
- **Backend**: Deployed on [Render](https://render.com) - https://rsa-backend-2ew3.onrender.com
- **Repository**: [GitHub](https://github.com/NTS051205/RSA_web)

---

## Quick Start

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

### RSA Key Generation
- Select key bit length (64, 128, 256, 512, 1024, 2048, 4096)
- Click "Generate Key" to create RSA key pair
- View key details: Key ID, bit length, public/private components

### Encryption/Decryption
- Enter message to encrypt
- Click "Encrypt" to encrypt the message
- Click "Decrypt" to decrypt ciphertext
- Supports both text and packed modes

### Advanced Chat Simulation
- Generate keys for Alice and Bob
- Send encrypted messages between users
- Real-time encryption/decryption process
- Interactive chat history

### Performance Monitoring
- Real-time performance charts
- Operation duration tracking
- Key generation statistics
- Encryption/decryption metrics

## Technology Stack

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

## Security Notice

> **Academic Demo**: Small keys (60-80 bits) for algorithm demonstration  
> **NOT for Production**: Not secure for real-world applications  
> **Production Use**: Use RSA-2048/3072+ with standard `cryptography` library

## Academic Information

**Học phần**: An toàn và Bảo mật Thông tin
**Trường**: Đại học Kinh tế Quốc dân (NEU)
**Năm học**: 2025
**Sinh viên thực hiện**: Nguyễn Tiến Sơn (NTS)
**Mục đích**: Xây dựng ứng dụng minh họa thuật toán mã hóa RSA phục vụ học tập và trình diễn.

## 📄 License

MIT License - See LICENSE file for details

---

## 🌟 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⭐ Support

If you find this project helpful, please give it a star! ⭐

---

**Built with ❤️ for educational purposes**