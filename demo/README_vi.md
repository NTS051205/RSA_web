# RSA Demo (Tiếng Việt) – Streamlit
**Mục tiêu:** Thực thi RSA (học thuật) để *mã hóa/giải mã (OAEP)*, *ký/verify (PSS-like)*, *CRT*, và *demo tấn công* (factor n nhỏ).  
**KHÔNG dùng sản xuất**. Dùng cho thuyết trình môn ATBM.

## Cách chạy
```bash
pip install -r requirements.txt
streamlit run app.py
```
Trang web sẽ mở tại `http://localhost:8501`.

## Tính năng
- Sinh khóa RSA (p,q từ khoảng [1e9..2e9]) → n nhỏ để minh họa tấn công factor
- Mã hóa/giải mã với **OAEP** (mô phỏng học thuật) + **CRT** tăng tốc
- Ký số/Verify **PSS-like** (mô phỏng, không chuẩn)
- Thử factor n (trial division + Pollard Rho) để chứng minh không an toàn
- Tải xuống: `rsa_keys.txt`, `cipher.txt`, `signature.txt`

## Khuyến nghị
- Thực tế: RSA-2048+ và OAEP/PSS từ thư viện `cryptography`/`pycryptodome`
- RNG: `secrets` (CS-PRNG)
- Bảo vệ side-channel, quản lý khóa, xác thực toàn vẹn khi truyền/ghi file
