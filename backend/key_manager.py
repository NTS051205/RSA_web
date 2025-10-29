# key_manager.py - RSA key management
import logging
import os
import sys
from typing import Dict, Optional
from datetime import datetime

# Import RSA core from demo folder
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
demo_dir = os.path.join(project_root, 'demo')
sys.path.insert(0, demo_dir)

from rsa_core import generate_rsa, RSAKey, export_public, export_private

logger = logging.getLogger(__name__)

class KeyManager:
    """Manages RSA key storage and operations"""
    
    def __init__(self):
        self.keys_storage: Dict[str, RSAKey] = {}
    
    def generate_key(self, bits: int) -> tuple[str, RSAKey]:
        """Generate new RSA key pair"""
        try:
            # Convert to int to avoid float issues
            bits = int(float(bits)) if isinstance(bits, (str, float)) else int(bits)
            
            logger.info(f"Generating RSA key with bits: {bits}")
            key = generate_rsa(bits)
            
            # Generate unique key ID
            key_id = datetime.now().strftime("%Y%m%d_%H%M%S")
            self.keys_storage[key_id] = key
            
            logger.info(f"Key generated successfully. Key ID: {key_id}, n bits: {key.n.bit_length()}")
            return key_id, key
            
        except Exception as e:
            logger.error(f"Error generating key: {str(e)}", exc_info=True)
            raise
    
    def get_key(self, key_id: str) -> Optional[RSAKey]:
        """Get key by ID"""
        return self.keys_storage.get(key_id)
    
    def key_exists(self, key_id: str) -> bool:
        """Check if key exists"""
        return key_id in self.keys_storage
    
    def get_key_info(self, key_id: str) -> Optional[dict]:
        """Get key information"""
        key = self.get_key(key_id)
        if not key:
            return None
        
        return {
            'key_id': key_id,
            'public_key': export_public(key),
            'private_key': export_private(key),
            'bit_length': key.n.bit_length()
        }
    
    def list_keys(self) -> list:
        """List all stored keys"""
        return list(self.keys_storage.keys())
    
    def delete_key(self, key_id: str) -> bool:
        """Delete key by ID"""
        if key_id in self.keys_storage:
            del self.keys_storage[key_id]
            logger.info(f"Key {key_id} deleted")
            return True
        return False
    
    def clear_all_keys(self) -> int:
        """Clear all stored keys"""
        count = len(self.keys_storage)
        self.keys_storage.clear()
        logger.info(f"Cleared {count} keys")
        return count

# Global key manager instance
key_manager = KeyManager()
