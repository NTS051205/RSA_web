# config.py - Configuration settings for RSA Demo Backend
import os
from typing import Optional

class Config:
    """Configuration class for RSA Demo Backend"""
    
    # Flask settings
    DEBUG = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    HOST = os.environ.get('HOST', '0.0.0.0')
    PORT = int(os.environ.get('PORT', 5001))
    
    # MongoDB settings
    MONGODB_URI = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/')
    DATABASE_NAME = 'rsa_demo'
    
    # Security settings
    MAX_MESSAGE_LENGTH = 50000
    MAX_BLOCKS_COUNT = 1000
    MAX_KEY_SIZE = 4096
    MIN_KEY_SIZE = 32
    
    # Rate limiting
    RATE_LIMIT_WINDOW = 60  # seconds
    MAX_REQUESTS_PER_WINDOW = 100
    
    # Logging
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    LOG_FILE = 'logs/rsa_api.log'
    
    @classmethod
    def get_mongodb_config(cls) -> dict:
        """Get MongoDB connection configuration"""
        return {
            'uri': cls.MONGODB_URI,
            'serverSelectionTimeoutMS': 5000,
            'tlsAllowInvalidCertificates': True
        }
