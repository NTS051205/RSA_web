# validators.py - Input validation functions
import re
import logging
from typing import Any, Optional
from functools import wraps
from flask import request, jsonify
from config import Config

logger = logging.getLogger(__name__)

class ValidationError(Exception):
    """Custom validation error"""
    pass

def validate_key_id_format(key_id: str) -> bool:
    """Validate key_id follows expected format (YYYYMMDD_HHMMSS)"""
    if not key_id or not isinstance(key_id, str):
        return False
    pattern = r'^\d{8}_\d{6}$'
    return bool(re.match(pattern, key_id))

def validate_message_length(message: str, max_length: Optional[int] = None) -> bool:
    """Validate message length"""
    if not isinstance(message, str):
        return False
    
    max_len = max_length or Config.MAX_MESSAGE_LENGTH
    return len(message) <= max_len and len(message) > 0

def validate_number_range(value: Any, min_val: Optional[int] = None, max_val: Optional[int] = None) -> bool:
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

def validate_key_size(bits: Any) -> bool:
    """Validate RSA key size"""
    return validate_number_range(bits, Config.MIN_KEY_SIZE, Config.MAX_KEY_SIZE)

def validate_blocks_count(blocks: list) -> bool:
    """Validate ciphertext blocks count"""
    return isinstance(blocks, list) and len(blocks) <= Config.MAX_BLOCKS_COUNT

def validate_json_required(f):
    """Decorator to check JSON is provided"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.is_json:
            return jsonify({'success': False, 'error': 'JSON required'}), 400
        return f(*args, **kwargs)
    return decorated_function

def validate_request_data(data: dict, required_fields: list) -> None:
    """Validate required fields in request data"""
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        raise ValidationError(f"Missing required fields: {', '.join(missing_fields)}")

def validate_encryption_request(data: dict) -> None:
    """Validate encryption request data"""
    validate_request_data(data, ['key_id', 'message'])
    
    if not validate_key_id_format(data['key_id']):
        raise ValidationError('Invalid key_id format')
    
    if not validate_message_length(data['message']):
        raise ValidationError(f'Message too long (max {Config.MAX_MESSAGE_LENGTH} chars)')

def validate_decryption_request(data: dict) -> None:
    """Validate decryption request data"""
    validate_request_data(data, ['key_id'])
    
    if not validate_key_id_format(data['key_id']):
        raise ValidationError('Invalid key_id format')
    
    mode = (data.get('mode') or 'text').strip().lower()
    
    if mode == 'text':
        if 'ciphertext_blocks_b64' not in data:
            raise ValidationError('ciphertext_blocks_b64 required for text mode')
        
        blocks = data['ciphertext_blocks_b64']
        if not validate_blocks_count(blocks):
            raise ValidationError(f'Too many blocks (max {Config.MAX_BLOCKS_COUNT})')
    
    elif mode == 'packed':
        if 'ciphertext' not in data:
            raise ValidationError('ciphertext required for packed mode')
        
        ciphertext = data['ciphertext']
        if not isinstance(ciphertext, dict) or 'c' not in ciphertext or 'sizes' not in ciphertext:
            raise ValidationError('ciphertext must contain c and sizes fields')
    
    else:
        raise ValidationError("Invalid mode. Use 'text' or 'packed'")
