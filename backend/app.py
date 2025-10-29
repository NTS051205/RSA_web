# app.py - Main Flask application
import os
import sys
import logging
from flask import Flask
from flask_cors import CORS

# Import configuration and modules
from config import Config
from database import db_manager
from routes import register_routes

# Import RSA core from demo folder
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
demo_dir = os.path.join(project_root, 'demo')
sys.path.insert(0, demo_dir)

try:
    from rsa_core import (
        generate_rsa, RSAKey, rsa_encrypt_text, rsa_decrypt_text,
        rsa_encrypt_packed, rsa_decrypt_packed, pack_packed, unpack_packed,
        int_list_to_b64, b64_to_int_list, export_public, export_private,
    )
except ImportError as e:
    print(f"ERROR: Cannot import rsa_core from {demo_dir}")
    print(f"Error: {e}")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Python path: {sys.path}")
    raise

def setup_logging():
    """Setup logging configuration"""
    if not os.path.exists('logs'):
        os.makedirs('logs')

    logging.basicConfig(
        level=getattr(logging, Config.LOG_LEVEL),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(Config.LOG_FILE, encoding='utf-8'),
            logging.StreamHandler()
        ]
    )

def create_app():
    """Create and configure Flask application"""
    app = Flask(__name__)
    CORS(app)
    
    # Register routes
    register_routes(app)
    
    return app

def main():
    """Main application entry point"""
    setup_logging()
    logger = logging.getLogger(__name__)
    
    app = create_app()
    
    logger.info("Starting RSA Demo API Server")
    app.run(
        debug=Config.DEBUG,
        host=Config.HOST,
        port=Config.PORT
    )

if __name__ == '__main__':
    main()
