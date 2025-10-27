# Flask backend for RSA Demo with logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import logging
import os
import sys
import re
from functools import wraps
from pymongo import MongoClient
import json

# Import RSA core from demo folder
# Get the project root directory (parent of backend)
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
demo_dir = os.path.join(project_root, 'demo')
sys.path.insert(0, demo_dir)

# Try importing with error handling
try:
    from rsa_core import generate_rsa, RSAKey, rsa_encrypt_bytes, rsa_decrypt_bytes, pss_sign, pss_verify, factor_demo
except ImportError as e:
    print(f"ERROR: Cannot import rsa_core from {demo_dir}")
    print(f"Error: {e}")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Python path: {sys.path}")
    raise

# Setup logging
if not os.path.exists('logs'):
    os.makedirs('logs')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/rsa_api.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Store keys (in production, use proper storage)
keys_storage = {}

# MongoDB connection
try:
    mongodb_uri = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/')
    logger.info(f"Connecting to MongoDB: {mongodb_uri[:30]}...")
    # Add SSL parameters to work around Python 3.13 SSL issues
    mongo_client = MongoClient(
        mongodb_uri, 
        serverSelectionTimeoutMS=5000,
        tlsAllowInvalidCertificates=True,
        ssl=True,
        ssl_cert_reqs='CERT_NONE'
    )
    
    # Get or create database directly (skip ping to avoid SSL issue)
    db = mongo_client.get_database('rsa_demo')
    logs_collection = db.logs
    
    # Try to insert a test doc to verify connection (lazy connection)
    logger.info("MongoDB client created successfully")
except Exception as e:
    logger.error(f"MongoDB connection failed: {e}", exc_info=True)
    mongo_client = None
    logs_collection = None

# Security: Rate limiting (simple counter)
request_counts = {}

# Security: Input validation helpers
def validate_key_id_format(key_id):
    """Validate key_id follows expected format"""
    if not key_id or not isinstance(key_id, str):
        return False
    # Expected format: YYYYMMDD_HHMMSS
    pattern = r'^\d{8}_\d{6}$'
    return bool(re.match(pattern, key_id))

def validate_message_length(message, max_length=10000):
    """Validate message length"""
    if not isinstance(message, str):
        return False
    return len(message) <= max_length and len(message) > 0

def validate_number_range(value, min_val=None, max_val=None):
    """Validate numeric range"""
    try:
        num = int(value)
        if min_val is not None and num < min_val:
            return False
        if max_val is not None and num > max_val:
            return False
        return True
    except (ValueError, TypeError):
        return False

def validate_json_required(f):
    """Decorator to check JSON is provided"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.is_json:
            return jsonify({'success': False, 'error': 'JSON required'}), 400
        return f(*args, **kwargs)
    return decorated_function

@app.route('/', methods=['GET'])
def index():
    """Landing page"""
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>RSA Demo - Backend API</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
                padding: 50px;
            }
            .container {
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                padding: 40px;
                border-radius: 20px;
                max-width: 600px;
                margin: 0 auto;
            }
            h1 { font-size: 2.5rem; margin-bottom: 20px; }
            p { font-size: 1.2rem; line-height: 1.6; }
            .endpoint {
                background: rgba(255,255,255,0.2);
                padding: 10px;
                border-radius: 8px;
                margin: 10px 0;
                font-family: monospace;
            }
            .warning {
                background: rgba(255,255,0,0.2);
                padding: 15px;
                border-radius: 10px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔐 RSA Demo Backend API</h1>
            <p>Đây là backend API server. Để sử dụng giao diện, vui lòng truy cập:</p>
            <div class="warning">
                <strong>🌐 Frontend:</strong>
                <div style="font-size: 1.5rem; margin-top: 10px;">
                    <a href="http://localhost:3000" style="color: #fff; text-decoration: underline;">
                        http://localhost:3000
                    </a>
                </div>
            </div>
            <h2 style="margin-top: 40px;">API Endpoints:</h2>
            <div class="endpoint">GET /api/health</div>
            <div class="endpoint">POST /api/generate-key</div>
            <div class="endpoint">POST /api/encrypt</div>
            <div class="endpoint">POST /api/decrypt</div>
            <div class="endpoint">POST /api/sign</div>
            <div class="endpoint">POST /api/verify</div>
            <div class="endpoint">POST /api/factor</div>
        </div>
    </body>
    </html>
    '''

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    logger.info("Health check request")
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/generate-key', methods=['POST'])
@validate_json_required
def generate_key():
    """Generate new RSA key pair"""
    try:
        data = request.get_json() or {}
        p_low = data.get('p_low', 10**9)
        p_high = data.get('p_high', 2*10**9)
        
        # Convert to int to avoid float issues
        p_low = int(float(p_low)) if isinstance(p_low, (str, float)) else int(p_low)
        p_high = int(float(p_high)) if isinstance(p_high, (str, float)) else int(p_high)
        
        # Security: Validate range
        if p_low < 1000 or p_high < 1000:
            logger.warning(f"Invalid p_low/p_high values: p_low={p_low}, p_high={p_high}")
            return jsonify({'success': False, 'error': 'p_low and p_high must be at least 1000'}), 400
        
        if p_low >= p_high:
            logger.warning(f"Invalid range: p_low >= p_high")
            return jsonify({'success': False, 'error': 'p_low must be less than p_high'}), 400
        
        # Security: Limit key size to prevent DoS (max ~4096 bits roughly)
        # 10^150 is roughly 500 bits, 10^600 is roughly 2000 bits
        if p_high > 10**600:
            logger.warning(f"Request too large: p_high={p_high}")
            return jsonify({'success': False, 'error': 'Key size too large (max ~4096 bits - 10^600)'}), 400
        
        logger.info(f"Generating RSA key with p_range: [{p_low}, {p_high}]")
        
        key = generate_rsa(p_low, p_high)
        
        # Store key (in production, use secure storage)
        key_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        keys_storage[key_id] = key
        
        logger.info(f"Key generated successfully. Key ID: {key_id}, n bits: {key.n.bit_length()}")
        
        return jsonify({
            'success': True,
            'key_id': key_id,
            'public_key': {
                'n': str(key.n),
                'e': str(key.e),
                'bit_length': key.n.bit_length()
            },
            'private_key': {
                'n': str(key.n),
                'd': str(key.d),
                'p': str(key.p),
                'q': str(key.q)
            }
        })
    except Exception as e:
        logger.error(f"Error generating key: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/encrypt', methods=['POST'])
@validate_json_required
def encrypt():
    """Encrypt message using RSA"""
    try:
        data = request.get_json()
        key_id = data.get('key_id')
        message = data.get('message', '')
        
        # Security: Validate input
        if not key_id:
            return jsonify({'success': False, 'error': 'key_id required'}), 400
        
        if not validate_key_id_format(key_id):
            logger.warning(f"Invalid key_id format: {key_id}")
            return jsonify({'success': False, 'error': 'Invalid key_id format'}), 400
        
        if not validate_message_length(message, max_length=50000):
            return jsonify({'success': False, 'error': 'Message too long (max 50000 chars)'}), 400
        
        logger.info(f"Encryption request. Key ID: {key_id}, Message length: {len(message)}")
        
        if key_id not in keys_storage:
            logger.error(f"Key not found: {key_id}")
            return jsonify({'success': False, 'error': 'Key not found'}), 404
        
        key = keys_storage[key_id]
        
        # Encrypt
        plaintext_bytes = message.encode('utf-8')
        ciphertext_blocks = rsa_encrypt_bytes(plaintext_bytes, key)
        
        logger.info(f"Encryption successful. Blocks count: {len(ciphertext_blocks)}")
        
        return jsonify({
            'success': True,
            'ciphertext_blocks': [str(c) for c in ciphertext_blocks],
            'block_count': len(ciphertext_blocks)
        })
    except Exception as e:
        logger.error(f"Error encrypting: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/decrypt', methods=['POST'])
@validate_json_required
def decrypt():
    """Decrypt message using RSA"""
    try:
        data = request.get_json()
        key_id = data.get('key_id')
        ciphertext_blocks = data.get('ciphertext_blocks', [])
        
        # Security: Validate input
        if not key_id:
            return jsonify({'success': False, 'error': 'key_id required'}), 400
        
        if not validate_key_id_format(key_id):
            logger.warning(f"Invalid key_id format: {key_id}")
            return jsonify({'success': False, 'error': 'Invalid key_id format'}), 400
        
        if not isinstance(ciphertext_blocks, list):
            return jsonify({'success': False, 'error': 'ciphertext_blocks must be a list'}), 400
        
        if len(ciphertext_blocks) > 1000:
            return jsonify({'success': False, 'error': 'Too many blocks (max 1000)'}), 400
        
        logger.info(f"Decryption request. Key ID: {key_id}, Blocks count: {len(ciphertext_blocks)}")
        
        if key_id not in keys_storage:
            logger.error(f"Key not found: {key_id}")
            return jsonify({'success': False, 'error': 'Key not found'}), 404
        
        key = keys_storage[key_id]
        
        # Convert string blocks to integers
        ct_blocks_int = [int(c) for c in ciphertext_blocks]
        
        # Decrypt
        plaintext_bytes = rsa_decrypt_bytes(ct_blocks_int, key)
        plaintext = plaintext_bytes.decode('utf-8')
        
        logger.info(f"Decryption successful. Plaintext length: {len(plaintext)}")
        
        return jsonify({
            'success': True,
            'plaintext': plaintext
        })
    except Exception as e:
        logger.error(f"Error decrypting: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/sign', methods=['POST'])
@validate_json_required
def sign():
    """Sign message using RSA"""
    try:
        data = request.get_json()
        key_id = data.get('key_id')
        message = data.get('message', '')
        
        # Security: Validate input
        if not key_id:
            return jsonify({'success': False, 'error': 'key_id required'}), 400
        
        if not validate_key_id_format(key_id):
            return jsonify({'success': False, 'error': 'Invalid key_id format'}), 400
        
        if not validate_message_length(message, max_length=10000):
            return jsonify({'success': False, 'error': 'Message too long (max 10000 chars)'}), 400
        
        logger.info(f"Signing request. Key ID: {key_id}, Message length: {len(message)}")
        
        if key_id not in keys_storage:
            logger.error(f"Key not found: {key_id}")
            return jsonify({'success': False, 'error': 'Key not found'}), 404
        
        key = keys_storage[key_id]
        
        # Sign
        signature, salt = pss_sign(message.encode('utf-8'), key)
        
        logger.info(f"Signing successful")
        
        return jsonify({
            'success': True,
            'signature': str(signature),
            'salt': salt.hex()
        })
    except Exception as e:
        logger.error(f"Error signing: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/verify', methods=['POST'])
@validate_json_required
def verify():
    """Verify signature using RSA"""
    try:
        data = request.get_json()
        key_id = data.get('key_id')
        message = data.get('message', '')
        signature = data.get('signature', '')
        salt_hex = data.get('salt', '')
        
        # Security: Validate input
        if not key_id or not message or not signature or not salt_hex:
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        if not validate_key_id_format(key_id):
            return jsonify({'success': False, 'error': 'Invalid key_id format'}), 400
        
        if not validate_message_length(message, max_length=10000):
            return jsonify({'success': False, 'error': 'Message too long'}), 400
        
        logger.info(f"Verification request. Key ID: {key_id}, Message length: {len(message)}")
        
        if key_id not in keys_storage:
            logger.error(f"Key not found: {key_id}")
            return jsonify({'success': False, 'error': 'Key not found'}), 404
        
        key = keys_storage[key_id]
        
        # Convert hex string back to bytes
        salt = bytes.fromhex(salt_hex)
        sig_int = int(signature)
        
        # Verify
        is_valid = pss_verify(message.encode('utf-8'), sig_int, salt, key)
        
        logger.info(f"Verification result: {is_valid}")
        
        return jsonify({
            'success': True,
            'is_valid': is_valid
        })
    except Exception as e:
        logger.error(f"Error verifying: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/factor', methods=['POST'])
@validate_json_required
def factor():
    """Factor n to demonstrate attack"""
    try:
        data = request.get_json()
        key_id = data.get('key_id')
        
        # Security: Validate input
        if not key_id:
            return jsonify({'success': False, 'error': 'key_id required'}), 400
        
        if not validate_key_id_format(key_id):
            return jsonify({'success': False, 'error': 'Invalid key_id format'}), 400
        
        logger.info(f"Factor attack request. Key ID: {key_id}")
        
        if key_id not in keys_storage:
            logger.error(f"Key not found: {key_id}")
            return jsonify({'success': False, 'error': 'Key not found'}), 404
        
        key = keys_storage[key_id]
        
        # Factor
        method, factor, time_taken = factor_demo(key.n)
        
        logger.info(f"Factor attack completed. Method: {method}, Factor: {factor}, Time: {time_taken:.3f}s")
        
        return jsonify({
            'success': True,
            'method': method,
            'factor': str(factor) if factor else None,
            'time_seconds': time_taken,
            'found': factor is not None
        })
    except Exception as e:
        logger.error(f"Error in factor attack: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/logs', methods=['POST'])
def save_log():
    """Save operation log to MongoDB"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        if logs_collection is not None:
            log_entry = {
                'type': data.get('type', 'info'),
                'message': data.get('message', ''),
                'timestamp': datetime.now().isoformat(),
                'operation': data.get('operation', ''),
                'keyId': data.get('keyId'),
                'duration': data.get('duration'),
                'blockCount': data.get('blockCount'),
                'isValid': data.get('isValid'),
                'bitLength': data.get('bitLength'),
                'signatureLength': data.get('signatureLength')
            }
            logs_collection.insert_one(log_entry)
            logger.info("Log saved to MongoDB")
        
        return jsonify({'success': True})
    except Exception as e:
        logger.error(f"Error saving log: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/logs', methods=['GET'])
def get_logs():
    """Get logs from MongoDB"""
    try:
        limit = request.args.get('limit', 50, type=int)
        
        if logs_collection is not None:
            logs = list(logs_collection.find().sort('timestamp', -1).limit(limit))
            # Convert ObjectId to string
            for log in logs:
                log['_id'] = str(log['_id'])
            return jsonify({'success': True, 'logs': logs})
        else:
            return jsonify({'success': False, 'error': 'MongoDB not connected'}), 503
    except Exception as e:
        logger.error(f"Error getting logs: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/logs/clear', methods=['DELETE'])
def clear_logs():
    """Clear all logs from MongoDB"""
    try:
        if logs_collection is not None:
            result = logs_collection.delete_many({})
            logger.info(f"Cleared {result.deleted_count} logs")
            return jsonify({'success': True, 'deleted': result.deleted_count})
        else:
            return jsonify({'success': False, 'error': 'MongoDB not connected'}), 503
    except Exception as e:
        logger.error(f"Error clearing logs: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting RSA Demo API Server")
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))