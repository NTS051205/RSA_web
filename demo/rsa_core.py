import secrets
import math
from dataclasses import dataclass
from typing import List, Tuple, Dict
import base64

def egcd(a: int, b: int):
    if b == 0:
        return (a, 1, 0)
    g, x1, y1 = egcd(b, a % b)
    return g, y1, x1 - (a // b) * y1

def modinv(a: int, m: int):
    g, x, _ = egcd(a % m, m)
    if g != 1:
        raise ValueError("No modular inverse")
    return x % m

def is_probable_prime(n: int) -> bool:
    if n < 2:
        return False
    small = [2,3,5,7,11,13,17,19,23,29]
    for p in small:
        if n == p:
            return True
        if n % p == 0:
            return False
    d = n - 1
    r = 0
    while d % 2 == 0:
        d //= 2
        r += 1
    for a in [2,325,9375,28178,450775,9780504,1795265022]:
        if a % n == 0:
            continue
        x = pow(a, d, n)
        if x in (1, n - 1):
            continue
        for _ in range(r - 1):
            x = (x * x) % n
            if x == n - 1:
                break
        else:
            return False
    return True

def gen_prime(bits: int) -> int:
    while True:
        x = secrets.randbits(bits)
        x |= (1 << (bits - 1)) | 1
        if is_probable_prime(x):
            return x

@dataclass
class RSAKey:
    n: int
    e: int
    d: int
    p: int
    q: int

def generate_rsa(bits: int = 1024) -> RSAKey:
    half = bits // 2
    p = gen_prime(half)
    q = gen_prime(half)
    while q == p:
        q = gen_prime(half)
    n = p * q
    phi = (p - 1) * (q - 1)
    e = 65537
    if math.gcd(e, phi) != 1:
        e = 3
        while math.gcd(e, phi) != 1:
            e += 2
    d = modinv(e, phi)
    return RSAKey(n, e, d, p, q)

def export_public(K: RSAKey):
    return {"e": str(K.e), "n": str(K.n)}

def export_private(K: RSAKey):
    return {"d": str(K.d), "p": str(K.p), "q": str(K.q)}

def rsa_encrypt_text(text: str, K: RSAKey) -> List[int]:
    return [pow(b, K.e, K.n) for b in text.encode('utf-8')]

def rsa_decrypt_text(blocks: List[int], K: RSAKey) -> str:
    data = bytes(pow(c, K.d, K.n) % 256 for c in blocks)
    return data.decode('utf-8', 'ignore')

def max_bytes_per_block(K: RSAKey) -> int:
    return max(1, (K.n.bit_length() - 1) // 8)

def _chunk(data: bytes, size: int):
    for i in range(0, len(data), size):
        yield data[i:i+size]

def rsa_encrypt_packed(text: str, K: RSAKey) -> Tuple[List[int], List[int]]:
    b = text.encode('utf-8')
    k = max_bytes_per_block(K)
    blocks, sizes = [], []
    for blk in _chunk(b, k):
        sizes.append(len(blk))
        M = int.from_bytes(blk, 'big')
        blocks.append(pow(M, K.e, K.n))
    return blocks, sizes

def rsa_decrypt_packed(blocks: List[int], sizes: List[int], K: RSAKey) -> str:
    out = bytearray()
    for C, sz in zip(blocks, sizes):
        M = pow(C, K.d, K.n)
        out.extend(M.to_bytes(sz, 'big'))
    return out.decode('utf-8', 'ignore')

def int_list_to_b64(lst: List[int]) -> List[str]:
    return [base64.b64encode(i.to_bytes((i.bit_length()+7)//8 or 1,'big')).decode() for i in lst]

def b64_to_int_list(lst: List[str]) -> List[int]:
    return [int.from_bytes(base64.b64decode(s), "big") for s in lst]

def pack_packed(blocks: List[int], sizes: List[int]) -> Dict[str, List]:
    return {"c": int_list_to_b64(blocks), "sizes": sizes}

def unpack_packed(payload: Dict[str, List]) -> Tuple[List[int], List[int]]:
    return b64_to_int_list(payload["c"]), list(map(int, payload["sizes"]))
