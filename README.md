#  Dự án RSA Demo – Ứng dụng Mã hóa và Giải mã RSA

> **Ứng dụng web minh họa thuật toán RSA**  
> Bài tập lớn môn *An toàn & Bảo mật Thông tin* – Đại học Kinh tế Quốc dân (NEU)

---

##  Tính năng chính

| Chức năng | Mô tả |
|------------|--------|
|  **Sinh khóa RSA** | Sinh cặp khóa công khai (n, e) và khóa bí mật (p, q, d) với độ dài bit tùy chọn |
|  **Mã hóa / Giải mã** | Mã hóa và giải mã thông điệp bằng RSA |
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

## 📁 Project Structure

```
RSA_web/
├── backend/                       # Flask Backend API
├── frontend/                      # Giao diện ReactJS
├── demo/                          # Mã nguồn gốc (RSA Core)
├── LICENSE                        # Giấy phép MIT
├── README.md                      # Tài liệu này
├── CONTRIBUTING.md                # Quy định đóng góp
├── Procfile                       # Cấu hình Heroku / Render
└── runtime.txt                    # Phiên bản Python
```

### Chi tiết cấu trúc

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

---

## 🛠️ Công nghệ sử dụng

### Backend
- **Python 3.11+** - Core language
- **Flask 3.0** - Web framework
- **Flask-CORS** - Cross-origin resource sharing
- **PyMongo** - MongoDB integration
- **Clean Architecture** - Modular design

### Frontend
- **React 18** - UI framework
- **Custom Hooks** - State management
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **TailwindCSS** - Responsive design

### Deployment
- **Render** - Backend deployment
- **Vercel** - Frontend deployment

---

## 🚀 Cách chạy chương trình

### Điều kiện tiên quyết
- Python 3.11+
- Node.js 16+
- npm hoặc yarn

### Option 1: Sử dụng Virtual Environment (Khuyến nghị)

```bash
# Clone dự án
git clone https://github.com/NTS051205/RSA_web.git
cd RSA_web

# Tạo môi trường ảo
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Cài đặt dependencies backend
pip install -r backend/requirements.txt

# Cài đặt dependencies frontend
cd frontend
npm install
cd ..

# Terminal 1 - Chạy backend
source .venv/bin/activate && cd backend && python app.py

# Terminal 2 - Chạy frontend  
cd frontend && npm start
```

### Option 2: Cài đặt trực tiếp

```bash
# Backend
cd backend
pip install -r requirements.txt
python app.py

# Frontend (terminal riêng)
cd frontend
npm install
npm start
```

**Backend**: http://localhost:5001  
**Frontend**: http://localhost:3000

---

## 📖 Hướng dẫn sử dụng

### Sinh khóa RSA
- Chọn độ dài khóa (64, 128, 256, 512, 1024, 2048, 4096 bits)
- Click "Generate Key" để sinh cặp khóa RSA
- Xem chi tiết khóa: Key ID, độ dài, các thành phần công khai/bí mật

### Mã hóa/Giải mã
- Nhập thông điệp cần mã hóa
- Click "Encrypt" để mã hóa
- Click "Decrypt" để giải mã
- Hỗ trợ cả chế độ text và packed

### Chat mô phỏng Alice - Bob
- Sinh khóa cho Alice và Bob
- Gửi thông điệp mã hóa giữa các user
- Theo dõi quá trình mã hóa/giải mã theo thời gian thực
- Xem lịch sử chat tương tác

### Theo dõi Hiệu năng
- Biểu đồ hiệu năng theo thời gian thực
- Theo dõi thời gian thực thi
- Thống kê sinh khóa
- Metrics mã hóa/giải mã

---

## 🔒 Thông báo Bảo mật

> **Bản Demo Học tập**: Sử dụng khóa nhỏ (60-80 bits) để minh họa thuật toán  
> **KHÔNG dùng cho Production**: Không an toàn cho các ứng dụng thực tế  
> **Sử dụng thực tế**: Dùng RSA-2048/3072+ với thư viện `cryptography` tiêu chuẩn

---

## 📚 Thông tin Học tập

**Học phần**: An toàn và Bảo mật Thông tin
**Trường**: Đại học Kinh tế Quốc dân (NEU)
**Năm học**: 2025
**Sinh viên thực hiện**: Nguyễn Tiến Sơn (NTS)
**Mục đích**: Xây dựng ứng dụng minh họa thuật toán mã hóa RSA phục vụ học tập và trình diễn.

---

## 📄 Giấy phép

MIT License - Xem file LICENSE để biết chi tiết

---

## 🌟 Đóng góp

Chúng tôi rất hoan nghênh các đóng góp! Vui lòng tạo Pull Request để đóng góp.

---

## ⭐ Hỗ trợ

Nếu bạn thấy dự án này hữu ích, vui lòng cho nó một sao! ⭐

---

**Built with ❤️ for educational purposes**
