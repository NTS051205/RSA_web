# RSA Demo Backend - Refactored Structure

## Cấu trúc Clean Code

Backend đã được refactor từ 1 file `app.py` dài 413 dòng thành các module nhỏ, dễ đọc và maintain:

### 📁 Cấu trúc thư mục

```
backend/
├── app.py              # Main Flask app (71 dòng) - chỉ khởi tạo và chạy server
├── config.py           # Cấu hình (40 dòng) - quản lý tất cả settings
├── database.py         # Database operations (92 dòng) - MongoDB connection & CRUD
├── key_manager.py      # RSA key management (65 dòng) - generate, store, retrieve keys
├── validators.py       # Input validation (95 dòng) - validate requests, decorators
├── routes.py           # API endpoints (200 dòng) - tất cả route handlers
├── requirements.txt    # Dependencies
└── logs/              # Log files
```

### 🔧 Các module chính

#### 1. **config.py** - Configuration Management
- Tập trung tất cả cấu hình vào 1 chỗ
- Environment variables
- Security settings (rate limiting, validation limits)
- Database settings

#### 2. **database.py** - Database Operations
- MongoDB connection management
- Log operations (save, get, clear)
- Error handling và connection status

#### 3. **key_manager.py** - RSA Key Management
- Generate RSA keys
- Store/retrieve keys by ID
- Key information export

#### 4. **validators.py** - Input Validation
- Request validation functions
- Security decorators
- Custom validation errors

#### 5. **routes.py** - API Endpoints
- Tất cả route handlers
- Business logic cho từng endpoint
- Error handling

#### 6. **app.py** - Main Application
- Chỉ khởi tạo Flask app
- Setup logging
- Register routes
- Start server

### ✅ Lợi ích của Clean Code

1. **Dễ đọc**: Mỗi file có trách nhiệm rõ ràng, không quá dài
2. **Dễ maintain**: Sửa bug chỉ cần tìm đúng module
3. **Dễ test**: Có thể test từng module riêng biệt
4. **Dễ mở rộng**: Thêm tính năng mới không ảnh hưởng code cũ
5. **Separation of Concerns**: Mỗi module chỉ làm 1 việc

### 🚀 Cách chạy

```bash
cd backend
python3 app.py
```

### 📝 Demo folder

Folder `demo/` được giữ nguyên như yêu cầu:
- `rsa_core.py` - RSA implementation
- `app.py` - Streamlit demo UI
- `README_vi.md` - Hướng dẫn demo

### 🔒 Security Features

- Input validation
- Rate limiting (có thể mở rộng)
- Error handling
- Logging
- MongoDB connection security
