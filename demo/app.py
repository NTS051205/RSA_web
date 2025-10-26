# app.py - Streamlit UI tiếng Việt cho RSA Demo
import streamlit as st
from rsa_core import *
import json, base64, io

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
st.caption("Demo học thuật: key nhỏ, OAEP/PSS mô phỏng. Không dùng sản xuất.")

# ====== SIDEBAR ======
st.sidebar.header("Cấu hình / Tác vụ")
p_low = int(st.sidebar.text_input("Giới hạn dưới p,q", "100000000000000000000000000000000000000000000000000"))
p_high = int(st.sidebar.text_input("Giới hạn trên p,q", "200000000000000000000000000000000000000000000000000"))

gen = st.sidebar.button("🔁 Sinh khóa mới")
load_default = st.sidebar.button("📂 Tải khóa từ file (rsa_keys.txt)")

if "K" not in st.session_state:
    st.session_state.K = None
if "ct" not in st.session_state:
    st.session_state.ct = []
if "sig" not in st.session_state:
    st.session_state.sig = 0
if "salt" not in st.session_state:
    st.session_state.salt = b""

col1, col2 = st.columns([1,1])

with col1:
    st.subheader("1) Sinh / Nạp khóa")
    box = st.container()
    with box:
        if gen:
            with st.spinner("Đang sinh khóa..."):
                K = generate_rsa(int(p_low), int(p_high))
                st.session_state.K = K
                st.success("Đã sinh khóa (demo).")
        elif load_default:
            try:
                K = load_keys("rsa_keys.txt")
                st.session_state.K = K
                st.success("Đã nạp khóa từ rsa_keys.txt")
            except Exception as e:
                st.error(f"Lỗi nạp khóa: {e}")

        K = st.session_state.K
        if K:
            c1, c2, c3, c4 = st.columns(4)
            c1.metric("bitlen(n)", K.n.bit_length())
            c2.metric("e", K.e)
            c3.metric("p (demo)", K.p)
            c4.metric("q (demo)", K.q)
            st.caption("Khóa demo: n nhỏ để minh họa tấn công phân tích thừa số.")
            st.download_button("Tải khóa (rsa_keys.txt)", data=(
                f"# RSA demo keys\nn={K.n}\ne={K.e}\nd={K.d}\np={K.p}\nq={K.q}\n"
            ), file_name="rsa_keys.txt", mime="text/plain")

with col2:
    st.subheader("2) Mã hóa / Giải mã (OAEP + CRT)")
    msg = st.text_area("Thông điệp cần mã hóa", "Hello ATBM NEU!")
    colE, colD = st.columns(2)
    with colE:
        if st.button("🔒 Mã hóa (OAEP)"):
            if st.session_state.K is None:
                st.warning("Hãy sinh hoặc nạp khóa trước.")
            else:
                try:
                    ct_blocks = rsa_encrypt_bytes(msg.encode('utf-8'), st.session_state.K)
                    st.session_state.ct = ct_blocks
                    st.success(f"Đã mã hóa {len(ct_blocks)} block.")
                except Exception as e:
                    st.error(f"Lỗi mã hóa: {e}")
        if st.session_state.ct:
            st.code(str(st.session_state.ct[:12]) + (" ..." if len(st.session_state.ct)>12 else ""))
            st.download_button("Tải ciphertext (cipher.txt)", data=" ".join(map(str, st.session_state.ct)), file_name="cipher.txt")
    with colD:
        if st.button("🔓 Giải mã (CRT)"):
            if st.session_state.K is None:
                st.warning("Chưa có khóa.")
            elif not st.session_state.ct:
                st.warning("Chưa có ciphertext.")
            else:
                try:
                    pt = rsa_decrypt_bytes(st.session_state.ct, st.session_state.K).decode('utf-8', errors='replace')
                    st.text_area("Plaintext giải mã", pt, height=120)
                    st.success("OK")
                except Exception as e:
                    st.error(f"Lỗi giải mã: {e}")

st.subheader("3) Ký số / Kiểm tra (PSS-like)")
colS, colV = st.columns(2)
with colS:
    sign_msg = st.text_area("Chuỗi cần ký", "Đây là chữ ký demo PSS-like.")
    if st.button("✍️ Ký số (PSS-like)"):
        if st.session_state.K is None:
            st.warning("Chưa có khóa.")
        else:
            sig, salt = pss_sign(sign_msg.encode('utf-8'), st.session_state.K)
            st.session_state.sig = sig
            st.session_state.salt = salt
            st.success("Đã ký.")
            st.code(str(sig)[:200] + ("..." if len(str(sig))>200 else ""))
            st.download_button("Tải signature (signature.txt)",
                               data=(len(sig.to_bytes((sig.bit_length()+7)//8 or 1,'big')).to_bytes(2,'big')+
                                     sig.to_bytes((sig.bit_length()+7)//8 or 1,'big')+
                                     salt),
                               file_name="signature.txt")

with colV:
    verify_msg = st.text_input("Nhập lại chuỗi để verify", "Đây là chữ ký demo PSS-like.")
    if st.button("🧪 Verify"):
        if st.session_state.K is None or st.session_state.sig == 0:
            st.warning("Thiếu khóa hoặc chữ ký.")
        else:
            ok = pss_verify(verify_msg.encode('utf-8'), st.session_state.sig, st.session_state.salt, st.session_state.K)
            if ok:
                st.success("HỢP LỆ ✅")
            else:
                st.error("KHÔNG HỢP LỆ ❌")

st.subheader("4) Demo tấn công: phân tích n nhỏ (factor)")
if st.button("🔍 Thử factor n (trial + Pollard Rho)"):
    if st.session_state.K is None:
        st.warning("Chưa có khóa.")
    else:
        try:
            method, f, secs = factor_demo(st.session_state.K.n)
            if f:
                st.error(f"ĐÃ TÌM THẤY THỪA SỐ ({method}) trong {secs:.3f}s: {f}")
                st.write(f"Thừa số còn lại: {st.session_state.K.n // f}")
            else:
                st.info(f"Chưa factor được trong thời gian demo (~{secs:.3f}s).")
        except Exception as e:
            st.error(f"Lỗi khi chạy factor demo: {e}")

st.subheader("5) Ghi chú an toàn & khuyến nghị")
st.markdown("""
- Đây là **bản demo học thuật**: modulus nhỏ (khoảng 60 bit) để minh họa factor ⇒ **không an toàn thực tế**.
- Đã mô phỏng **OAEP** cho mã hóa (chống tấn công bản rõ đã biết / chosen-cipher), **PSS-like** cho chữ ký.
- Thực tế: dùng RSA-2048/3072+, OAEP & PSS **chuẩn** từ thư viện `cryptography`/`pycryptodome`.
- Lưu ý RNG: dùng `secrets` thay vì random.
""")
