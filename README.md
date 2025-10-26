# 🔐 RSA Demo - Web Application

> **Một ứng dụng web demo trực quan thuật toán RSA với giao diện hiện đại**  
> Demo cho môn An toàn và Bảo mật Thông tin - Đại học Kinh tế Quốc dân (NEU)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)](https://flask.palletsprojects.com/)

## ✨ Tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 🔑 **Sinh khóa RSA** | Tạo cặp khóa công khai (n, e) và riêng tư (p, q, d) với độ dài tùy chỉnh |
| 🔓 **Mã hóa/Giải mã** | RSA-OAEP với CRT tối ưu, hiển thị đầy đủ p, q, public/private keys |
| ✍️ **Ký số/Xác minh** | RSA-PSS (PSS-like) với salt-based security |
| 🔍 **Demo tấn công** | Phân tích modulus n bằng trial division + Pollard's Rho |
| 📊 **Biểu đồ Thời gian** | Theo dõi và hiển thị hiệu suất của từng thao tác RSA |
| 🔔 **Toast Notifications** | Thông báo real-time với animation đẹp mắt |
| 📱 **Responsive Design** | Giao diện đẹp, hiện đại, tương thích mọi thiết bị |

## 📁 Cấu trúc Project

```
rsa-demo/
├── backend/                    # Flask Backend API
│   ├── app.py                 # Flask REST API server
│   ├── requirements.txt        # Python dependencies
│   └── logs/                  # Application logs (gitignored)
│
├── demo/                       # Original RSA Core
│   ├── rsa_core.py           # Core RSA algorithms implementation
│   ├── app.py                 # Streamlit version (alternative)
│   ├── requirements.txt       # Dependencies
│   └── README_vi.md          # Vietnamese docs
│
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── KeyGeneration.jsx
│   │   │   ├── Encryption.jsx
│   │   │   ├── Signing.jsx
│   │   │   ├── Factorization.jsx
│   │   │   ├── Chart.jsx
│   │   │   └── ToastNotification.jsx
│   │   ├── services/
│   │   │   └── api.js        # API service layer
│   │   ├── App.jsx           # Main application
│   │   ├── App.css           # Styling
│   │   └── index.js          # Entry point
│   ├── package.json
│   └── public/
│
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🚀 Cách chạy

### Bước 1: Cài đặt Backend

```bash
cd backend
pip install -r requirements.txt
```

### Bước 2: Chạy Backend (Terminal 1)

```bash
cd backend
python app.py
```

Backend sẽ chạy tại `http://localhost:5000`

### Bước 3: Cài đặt Frontend

```bash
cd frontend
npm install
```

### Bước 4: Chạy Frontend (Terminal 2)

```bash
cd frontend
npm start
```

Frontend sẽ mở tại `http://localhost:3000`

## 📖 Hướng dẫn sử dụng

### 1. Sinh khóa RSA
- Nhập giới hạn dưới và trên cho các số nguyên tố p, q
- Click "Sinh khóa mới"
- Xem thông tin khóa: Key ID, độ dài bits, public exponent e

### 2. Mã hóa/Giải mã
- Nhập thông điệp cần mã hóa
- Click "Mã hóa" để mã hóa thông điệp
- Click "Giải mã" để giải mã ciphertext

### 3. Ký số/Xác minh
- Nhập chuỗi cần ký
- Click "Ký số" để tạo chữ ký
- Nhập lại chuỗi và click "Xác minh" để kiểm tra

### 4. Demo tấn công Factor
- Click "Thử factor n" để phân tích modulus
- Xem kết quả: phương pháp, thời gian, thừa số (nếu tìm thấy)

## 📝 Logs

- **Backend logs**: `logs/rsa_api.log`
- **Frontend logs**: Hiển thị real-time trong panel Logs
- Logs ghi lại mọi request, response và lỗi

## ⚠️ Lưu ý

- **Demo học thuật**: Khóa nhỏ (khoảng 60-80 bits) để minh họa
- **Không dùng production**: Không an toàn cho ứng dụng thực tế
- **Production**: Dùng RSA-2048/3072+ với thư viện chuẩn `cryptography`

## 🛠️ Công nghệ

### Backend
- Python 3.8+
- Flask (REST API)
- Flask-CORS
- RSA core implementation

### Frontend
- React 18
- Axios (HTTP client)
- Modern responsive UI

## 📚 Tài liệu tham khảo

- [RSA Encryption](https://en.wikipedia.org/wiki/RSA_(cryptosystem))
- [OAEP](https://en.wikipedia.org/wiki/Optimal_asymmetric_encryption_padding)
- [PSS](https://en.wikipedia.org/wiki/Probabilistic_signature_scheme)
- [Chinese Remainder Theorem](https://en.wikipedia.org/wiki/Chinese_remainder_theorem)

## 📸 Screenshots

Thêm screenshots vào để dự án trở nên chuyên nghiệp hơn:

```markdown
![Main Interface](./screenshots/main.png)
![Chart](./screenshots/chart.png)
```

## 🎓 Tác giả

Demo cho môn **An toàn và Bảo mật Thông tin** - Đại học Kinh tế Quốc dân (NEU)

---

## ⚠️ Lưu ý

> **Demo học thuật**: Khóa nhỏ (60-80 bits) để minh họa thuật toán  
> **KHÔNG dùng production**: Không an toàn cho ứng dụng thực tế  
> **Production**: Dùng RSA-2048/3072+ với thư viện chuẩn `cryptography`

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết

---

**Star ⭐ repository này nếu bạn thấy hữu ích!**
