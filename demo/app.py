# app.py - Streamlit UI tiếng Việt cho RSA Demo
import streamlit as st
from rsa_core import *
import json, os

st.set_page_config(
    page_title="RSA Demo (ATBM) – Python",
    page_icon="🔐",
    layout="wide"
)

# ====== STYLE ======
st.markdown("""
<style>
:root { --radius: 16px; }
.block { background: #111827; padding: 16px 18px; border-radius: var(--radius); border: 1px solid #1f2937; }
h1,h2,h3 { margin-bottom: .4rem; }
.small { color: #9ca3af; font-size: 13px; }
.metric { font-weight: 600; font-size: 28px; }
hr { border: none; height: 1px; background: #1f2937; margin: 12px 0; }
</style>
""", unsafe_allow_html=True)

st.title("🔐 RSA Demo – An toàn & Bảo mật thông tin (Python)")
st.caption("Demo học thuật: key nhỏ để minh họa. Không dùng sản xuất.")

# ====== SIDEBAR ======
st.sidebar.header("Cấu hình / Tác vụ")
bits_input = st.sidebar.text_input("Độ dài khóa (bits)", value="256", help="Nhập độ dài khóa (ví dụ: 64, 128, 256, 512, 1024, 2048...)")

# Validate và chuyển đổi bits
try:
    bits = int(bits_input) if bits_input else 256
    if bits < 8:
        st.sidebar.warning("Độ dài khóa quá nhỏ (tối thiểu 8 bits). Sử dụng 8 bits.")
        bits = 8
    elif bits > 4096:
        st.sidebar.warning("Độ dài khóa quá lớn (tối đa 4096 bits). Sử dụng 4096 bits.")
        bits = 4096
    elif bits % 2 != 0:
        st.sidebar.info("Độ dài khóa nên là số chẵn. Đã làm tròn xuống.")
        bits = bits - 1
except ValueError:
    st.sidebar.error("❌ Vui lòng nhập số hợp lệ!")
    bits = 256

st.sidebar.caption(f"Độ dài khóa hiện tại: **{bits} bits**")

gen = st.sidebar.button("🔁 Sinh khóa mới")
load_default = st.sidebar.button("📂 Tải khóa từ file (rsa_keys.txt)")

if "K" not in st.session_state:
    st.session_state.K = None
if "ct" not in st.session_state:
    st.session_state.ct = []
if "ct_sizes" not in st.session_state:
    st.session_state.ct_sizes = []
if "sig" not in st.session_state:
    st.session_state.sig = []

col1, col2 = st.columns([1,1])

with col1:
    st.subheader("1) Sinh / Nạp khóa")
    box = st.container()
    with box:
        if gen:
            with st.spinner("Đang sinh khóa..."):
                try:
                    K = generate_rsa(bits)
                    st.session_state.K = K
                    st.success(f"Đã sinh khóa {bits} bits (demo).")
                except Exception as e:
                    st.error(f"Lỗi sinh khóa: {e}")
        elif load_default:
            try:
                if os.path.exists("rsa_keys.txt"):
                    with open("rsa_keys.txt", "r") as f:
                        content = f.read()
                        # Parse keys from file
                        lines = content.strip().split('\n')
                        key_dict = {}
                        for line in lines:
                            if '=' in line and not line.startswith('#'):
                                key, value = line.split('=', 1)
                                key_dict[key.strip()] = int(value.strip())
                        if all(k in key_dict for k in ['n', 'e', 'd', 'p', 'q']):
                            K = RSAKey(key_dict['n'], key_dict['e'], key_dict['d'], 
                                      key_dict['p'], key_dict['q'])
                            st.session_state.K = K
                            st.success("Đã nạp khóa từ rsa_keys.txt")
                        else:
                            st.error("File khóa không đúng định dạng.")
                else:
                    st.error("Không tìm thấy file rsa_keys.txt")
            except Exception as e:
                st.error(f"Lỗi nạp khóa: {e}")

        K = st.session_state.K
        if K:
            c1, c2, c3, c4 = st.columns(4)
            c1.metric("bitlen(n)", K.n.bit_length())
            c2.metric("e", K.e)
            c3.metric("p (demo)", str(K.p)[:20] + "..." if len(str(K.p)) > 20 else K.p)
            c4.metric("q (demo)", str(K.q)[:20] + "..." if len(str(K.q)) > 20 else K.q)
            st.caption("Khóa demo: n nhỏ để minh họa tấn công phân tích thừa số.")
            st.download_button("Tải khóa (rsa_keys.txt)", data=(
                f"# RSA demo keys\nn={K.n}\ne={K.e}\nd={K.d}\np={K.p}\nq={K.q}\n"
            ), file_name="rsa_keys.txt", mime="text/plain")

with col2:
    st.subheader("2) Mã hóa / Giải mã (Packed Mode)")
    msg = st.text_area("Thông điệp cần mã hóa", "Hello ATBM NEU!")
    colE, colD = st.columns(2)
    with colE:
        if st.button("Mã hóa"):
            if st.session_state.K is None:
                st.warning("Hãy sinh hoặc nạp khóa trước.")
            else:
                try:
                    ct_blocks, ct_sizes = rsa_encrypt_packed(msg, st.session_state.K)
                    st.session_state.ct = ct_blocks
                    st.session_state.ct_sizes = ct_sizes
                    st.success(f"Đã mã hóa {len(ct_blocks)} block.")
                except Exception as e:
                    st.error(f"Lỗi mã hóa: {e}")
        if st.session_state.ct:
            preview = str(st.session_state.ct[:3]) + (" ..." if len(st.session_state.ct)>3 else "")
            st.code(preview)
            # Export ciphertext as JSON
            cipher_data = pack_packed(st.session_state.ct, st.session_state.ct_sizes)
            st.download_button("Tải ciphertext (cipher.json)", 
                             data=json.dumps(cipher_data, indent=2), 
                             file_name="cipher.json", 
                             mime="application/json")
    with colD:
        if st.button("Giải mã"):
            if st.session_state.K is None:
                st.warning("Chưa có khóa.")
            elif not st.session_state.ct:
                st.warning("Chưa có ciphertext.")
            else:
                try:
                    pt = rsa_decrypt_packed(st.session_state.ct, st.session_state.ct_sizes, st.session_state.K)
                    st.text_area("Plaintext giải mã", pt, height=120, key="decrypted_text")
                    st.success("OK")
                except Exception as e:
                    st.error(f"Lỗi giải mã: {e}")

st.subheader("3) Mã hóa / Giải mã (Byte Mode - đơn giản)")
colS, colV = st.columns(2)
with colS:
    sign_msg = st.text_area("Thông điệp cần mã hóa (Byte Mode)", "Hello World!")
    if st.button("Mã hóa (Byte Mode)"):
        if st.session_state.K is None:
            st.warning("Chưa có khóa.")
        else:
            try:
                sig_blocks = rsa_encrypt_text(sign_msg, st.session_state.K)
                st.session_state.sig = sig_blocks
                st.success(f"Đã mã hóa {len(sig_blocks)} byte.")
                st.code(str(sig_blocks[:10]) + ("..." if len(sig_blocks)>10 else ""))
                st.download_button("Tải ciphertext (cipher_bytes.txt)",
                                   data=" ".join(map(str, sig_blocks)),
                                   file_name="cipher_bytes.txt")
            except Exception as e:
                st.error(f"Lỗi: {e}")

with colV:
    verify_msg = st.text_input("Nhập lại thông điệp để so sánh", "Hello World!")
    if st.button("Giải mã & So sánh"):
        if st.session_state.K is None or not st.session_state.sig:
            st.warning("Thiếu khóa hoặc ciphertext.")
        else:
            try:
                decrypted = rsa_decrypt_text(st.session_state.sig, st.session_state.K)
                st.text_area("Plaintext giải mã", decrypted, height=100, key="decrypted_byte")
                if decrypted == verify_msg:
                    st.success("KHỚP ✅")
                else:
                    st.warning("Không khớp (có thể do lỗi làm tròn trong byte mode)")
            except Exception as e:
                st.error(f"Lỗi: {e}")

st.subheader("4) Thông tin khóa công khai / Riêng tư")
if st.session_state.K:
    col_pub, col_priv = st.columns(2)
    with col_pub:
        st.write("**Khóa công khai:**")
        pub_key = export_public(st.session_state.K)
        st.json(pub_key)
    with col_priv:
        st.write("**Khóa riêng tư:**")
        priv_key = export_private(st.session_state.K)
        st.json(priv_key)
else:
    st.info("Hãy sinh hoặc nạp khóa để xem thông tin.")

st.subheader("5) Ghi chú an toàn & khuyến nghị")
st.markdown("""
- Đây là **bản demo học thuật**: modulus nhỏ để minh họa ⇒ **không an toàn thực tế**.
- Hỗ trợ 2 chế độ mã hóa:
  - **Byte Mode**: Mã hóa từng byte riêng lẻ (đơn giản, chậm)
  - **Packed Mode**: Đóng gói nhiều byte vào một block (hiệu quả hơn)
- Thực tế: dùng RSA-2048/3072+, OAEP & PSS **chuẩn** từ thư viện `cryptography`/`pycryptodome`.
- Lưu ý RNG: đã dùng `secrets` module để sinh số ngẫu nhiên an toàn.
- **Cảnh báo**: Không dùng cho mục đích sản xuất, chỉ để học tập và minh họa.
""")
