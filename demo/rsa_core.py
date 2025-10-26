# rsa_core.py - Educational RSA core (Vietnamese comments)
# WARNING: Chỉ dùng cho mục đích học thuật/demo. Không dùng production.
import secrets, hashlib, math, time
from dataclasses import dataclass
from typing import Optional, List, Tuple

# ================== TIỆN ÍCH CƠ BẢN ==================
def egcd(a: int, b: int):
    if b == 0: return (a, 1, 0)
    g, x1, y1 = egcd(b, a % b)
    return (g, y1, x1 - (a // b) * y1)

def modinv(a: int, m: int) -> Optional[int]:
    g, x, _ = egcd(a % m, m)
    if g != 1: return None
    return x % m

def is_probable_prime(n: int) -> bool:
    if n < 2: return False
    small = [2,3,5,7,11,13,17,19,23,29,31]
    for p in small:
        if n == p: return True
        if n % p == 0: return False
    # Miller–Rabin với bases đủ cho <2^64
    d = n - 1
    r = 0
    while d % 2 == 0:
        d //= 2
        r += 1
    for a in [2,325,9375,28178,450775,9780504,1795265022]:
        if a % n == 0: 
            continue
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        composite = True
        for _ in range(r - 1):
            x = (x * x) % n
            if x == n - 1:
                composite = False
                break
        if composite:
            return False
    return True

def gen_prime_in_range(lo: int, hi: int) -> int:
    if lo < 3: lo = 3
    if lo % 2 == 0: lo += 1
    span = max(1, hi - lo + 1)
    while True:
        x = lo + secrets.randbelow(span)
        if x % 2 == 0: x += 1
        for _ in range(200000):
            if is_probable_prime(x): return x
            x += 2
            if x > hi: x = lo

@dataclass
class RSAKey:
    n: int; e: int; d: int; p: int; q: int

def generate_rsa(p_low=10**9, p_high=2*10**9) -> RSAKey:
    p = gen_prime_in_range(p_low, p_high)
    q = gen_prime_in_range(p_low, p_high)
    while q == p: q = gen_prime_in_range(p_low, p_high)
    n = p * q
    phi = (p - 1) * (q - 1)
    e = 65537
    if egcd(e, phi)[0] != 1:
        e = 3
        while e < phi and egcd(e, phi)[0] != 1: e += 2
    d = modinv(e, phi)
    if d is None: raise RuntimeError("Không tính được d")
    return RSAKey(n,e,d,p,q)

def decrypt_crt(C: int, K: RSAKey) -> int:
    p,q,d = K.p, K.q, K.d
    dp = d % (p-1)
    dq = d % (q-1)
    qinv = modinv(q,p)
    m1 = pow(C % p, dp, p)
    m2 = pow(C % q, dq, q)
    h = ((m1 - m2) % p) * qinv % p
    return (m2 + h*q) % (p*q)

# ================== OAEP (MGF1) HỌC THUẬT ==================
def mgf1(seed: bytes, length: int, hashfn=hashlib.sha256) -> bytes:
    T = b""; counter = 0
    hlen = hashfn().digest_size
    while len(T) < length:
        C = counter.to_bytes(4, 'big')
        T += hashfn(seed + C).digest()
        counter += 1
    return T[:length]

def oaep_encode(message: bytes, k: int, label: bytes=b"", hashfn=hashlib.sha256) -> bytes:
    hlen = hashfn().digest_size
    if len(message) > k - 2*hlen - 2:
        raise ValueError("Thông điệp quá dài cho OAEP")
    lhash = hashfn(label).digest()
    ps = b'\x00' * (k - len(message) - 2*hlen - 2)
    db = lhash + ps + b'\x01' + message
    seed = secrets.token_bytes(hlen)
    dbMask = mgf1(seed, k - hlen - 1, hashfn)
    maskedDB = bytes(x ^ y for x,y in zip(db, dbMask))
    seedMask = mgf1(maskedDB, hlen, hashfn)
    maskedSeed = bytes(x ^ y for x,y in zip(seed, seedMask))
    return b'\x00' + maskedSeed + maskedDB

def oaep_decode(em: bytes, k: int, label: bytes=b"", hashfn=hashlib.sha256) -> bytes:
    hlen = hashfn().digest_size
    if len(em) != k or em[0] != 0: raise ValueError("Lỗi giải mã OAEP")
    maskedSeed = em[1:1+hlen]
    maskedDB = em[1+hlen:]
    seedMask = mgf1(maskedDB, hlen, hashfn)
    seed = bytes(x ^ y for x,y in zip(maskedSeed, seedMask))
    dbMask = mgf1(seed, k - hlen - 1, hashfn)
    db = bytes(x ^ y for x,y in zip(maskedDB, dbMask))
    lhash = hashfn(label).digest()
    if db[:hlen] != lhash: raise ValueError("Sai nhãn OAEP")
    idx = db.find(b'\x01', hlen)
    if idx == -1: raise ValueError("Thiếu byte phân tách OAEP")
    return db[idx+1:]

# ================== RSA + OAEP ==================
def rsa_encrypt_bytes(msg: bytes, K: RSAKey, hashfn=hashlib.sha256) -> list[int]:
    k = (K.n.bit_length() + 7)//8
    max_msg_len = k - 2*hashfn().digest_size - 2
    blocks = []
    for i in range(0, len(msg), max_msg_len):
        chunk = msg[i:i+max_msg_len]
        em = oaep_encode(chunk, k, b"", hashfn)
        m_int = int.from_bytes(em, 'big')
        c = pow(m_int, K.e, K.n)
        blocks.append(c)
    return blocks

def rsa_decrypt_bytes(ct_blocks: list[int], K: RSAKey, hashfn=hashlib.sha256) -> bytes:
    k = (K.n.bit_length() + 7)//8
    out = bytearray()
    for c in ct_blocks:
        m_int = decrypt_crt(c, K)
        em = m_int.to_bytes(k, 'big')
        chunk = oaep_decode(em, k, b"", hashfn)
        out.extend(chunk)
    return bytes(out)

# ================== PSS-like (giản lược học thuật) ==================
def pss_sign(msg: bytes, K: RSAKey, salt_len=32, hashfn=hashlib.sha256):
    salt = secrets.token_bytes(salt_len)
    H = hashfn(msg + salt).digest()
    H_int = int.from_bytes(H, 'big')
    sig = pow(H_int, K.d, K.n)
    return sig, salt

def pss_verify(msg: bytes, sig: int, salt: bytes, K: RSAKey, hashfn=hashlib.sha256) -> bool:
    H = hashfn(msg + salt).digest()
    H_int = int.from_bytes(H, 'big')
    v = pow(sig, K.e, K.n)
    return v == H_int

# ================== PHÂN TÍCH n NHỎ (FACTOR) ==================
def trial_factor(n: int, limit: int = 1_000_000):
    if n % 2 == 0: return 2
    i, stop = 3, int(math.isqrt(n)) + 1
    stop = min(stop, limit)
    while i <= stop:
        if n % i == 0: return i
        i += 2
    return None

def pollards_rho(n: int, timeout=5.0):
    if n % 2 == 0: return 2
    if is_probable_prime(n): return n
    start = time.time()
    while time.time() - start <= timeout:
        x = secrets.randbelow(n-2) + 2
        y, c, d = x, secrets.randbelow(n-1) + 1, 1
        while d == 1 and time.time() - start <= timeout:
            x = (x*x + c) % n
            y = (y*y + c) % n
            y = (y*y + c) % n
            d = math.gcd(abs(x - y), n)
            if d == n: break
        if 1 < d < n: return d
    return None

def factor_demo(n: int):
    t0 = time.time()
    f = trial_factor(n)
    t1 = time.time()
    if f: return ("trial", f, t1 - t0)
    f = pollards_rho(n, timeout=5.0)
    t2 = time.time()
    if f: return ("rho", f, t2 - t1)
    return ("none", None, t2 - t0 if 't2' in locals() else t1 - t0)
