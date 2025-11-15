# routes.py - API route handlers
import logging
import os
import sys
from datetime import datetime
from flask import request, jsonify

# Import RSA core from demo folder
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
demo_dir = os.path.join(project_root, 'demo')
sys.path.insert(0, demo_dir)

from rsa_core import (
    rsa_encrypt_text, rsa_decrypt_text,
    rsa_encrypt_packed, rsa_decrypt_packed,
    pack_packed, unpack_packed,
    int_list_to_b64, b64_to_int_list
)
from validators import (
    validate_json_required, validate_encryption_request,
    validate_decryption_request, validate_key_size,
    ValidationError
)
from key_manager import key_manager
from database import db_manager

logger = logging.getLogger(__name__)

def register_routes(app):
    """Register all API routes"""
    
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
                <h1>RSA Demo Backend API</h1>
                <p>Đây là backend API server. Để sử dụng giao diện, vui lòng truy cập:</p>
                <div class="warning">
                    <strong>Frontend:</strong>
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
                <div class="endpoint">POST /api/encrypt (mode: text | packed)</div>
                <div class="endpoint">POST /api/decrypt (mode: text | packed)</div>
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
            bits = data.get('bits', 1024)
            
            # Validate key size
            if not validate_key_size(bits):
                logger.warning(f"Invalid bits value: {bits}")
                return jsonify({'success': False, 'error': f'bits must be between {1024} and {4096}'}), 400
            
            key_id, key = key_manager.generate_key(bits)
            
            return jsonify({
                'success': True,
                'key_id': key_id,
                'public_key': key_manager.get_key_info(key_id)['public_key'],
                'private_key': key_manager.get_key_info(key_id)['private_key'],
                'bit_length': key.n.bit_length()
            })
        except Exception as e:
            logger.error(f"Error generating key: {str(e)}", exc_info=True)
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/encrypt', methods=['POST'])
    @validate_json_required
    def encrypt():
        """Encrypt message using RSA in two modes: 'text' or 'packed'"""
        try:
            data = request.get_json()
            validate_encryption_request(data)
            
            key_id = data['key_id']
            message = data['message']
            mode = (data.get('mode') or 'text').strip().lower()
            
            if not key_manager.key_exists(key_id):
                logger.error(f"Key not found: {key_id}")
                return jsonify({'success': False, 'error': 'Key not found'}), 404
            
            key = key_manager.get_key(key_id)
            logger.info(f"Encryption request. mode={mode} Key ID: {key_id}, Message length: {len(message)}")
            
            if mode == 'text':
                blocks = rsa_encrypt_text(message, key)
                blocks_b64 = int_list_to_b64(blocks)
                return jsonify({
                    'success': True,
                    'mode': 'text',
                    'ciphertext_blocks_b64': blocks_b64,
                    'block_count': len(blocks_b64)
                })
            elif mode == 'packed':
                blocks, sizes = rsa_encrypt_packed(message, key)
                packed_data = pack_packed(blocks, sizes)
                return jsonify({
                    'success': True,
                    'mode': 'packed',
                    'ciphertext': packed_data,
                    'block_count': len(blocks)
                })
            
        except ValidationError as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        except Exception as e:
            logger.error(f"Error encrypting: {str(e)}", exc_info=True)
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/decrypt', methods=['POST'])
    @validate_json_required
    def decrypt():
        """Decrypt message using RSA in two modes: 'text' or 'packed'"""
        try:
            data = request.get_json()
            validate_decryption_request(data)
            
            key_id = data['key_id']
            mode = (data.get('mode') or 'text').strip().lower()
            
            if not key_manager.key_exists(key_id):
                logger.error(f"Key not found: {key_id}")
                return jsonify({'success': False, 'error': 'Key not found'}), 404
            
            key = key_manager.get_key(key_id)
            
            if mode == 'text':
                blocks_b64 = data['ciphertext_blocks_b64']
                logger.info(f"Decryption request (text). Key ID: {key_id}, Blocks count: {len(blocks_b64)}")
                
                ct_blocks = b64_to_int_list(blocks_b64)
                plaintext = rsa_decrypt_text(ct_blocks, key)
                return jsonify({'success': True, 'mode': 'text', 'plaintext': plaintext})
            
            elif mode == 'packed':
                ciphertext = data['ciphertext']
                logger.info(f"Decryption request (packed). Key ID: {key_id}")
                
                blocks, sizes = unpack_packed(ciphertext)
                plaintext = rsa_decrypt_packed(blocks, sizes, key)
                return jsonify({'success': True, 'mode': 'packed', 'plaintext': plaintext})
            
        except ValidationError as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        except Exception as e:
            logger.error(f"Error decrypting: {str(e)}", exc_info=True)
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/logs', methods=['POST'])
    def save_log():
        """Save operation log to MongoDB"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No data provided'}), 400
            
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
            
            success = db_manager.save_log(log_entry)
            return jsonify({'success': success})
            
        except Exception as e:
            logger.error(f"Error saving log: {str(e)}")
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/logs', methods=['GET'])
    def get_logs():
        """Get logs from MongoDB"""
        try:
            limit = request.args.get('limit', 50, type=int)
            logs = db_manager.get_logs(limit)
            
            if logs is None:
                return jsonify({'success': False, 'error': 'MongoDB not connected'}), 503
            
            return jsonify({'success': True, 'logs': logs})
            
        except Exception as e:
            logger.error(f"Error getting logs: {str(e)}", exc_info=True)
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/logs/clear', methods=['DELETE'])
    def clear_logs():
        """Clear all logs from MongoDB"""
        try:
            deleted_count = db_manager.clear_logs()
            return jsonify({'success': True, 'deleted': deleted_count})
            
        except Exception as e:
            logger.error(f"Error clearing logs: {str(e)}", exc_info=True)
            return jsonify({'success': False, 'error': str(e)}), 500
