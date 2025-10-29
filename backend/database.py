# database.py - Database connection and operations
import logging
from typing import Optional, Dict, Any, List
from pymongo import MongoClient
from pymongo.collection import Collection
from config import Config

logger = logging.getLogger(__name__)

class DatabaseManager:
    """Manages database connections and operations"""
    
    def __init__(self):
        self.client: Optional[MongoClient] = None
        self.db = None
        self.logs_collection: Optional[Collection] = None
        self._connect()
    
    def _connect(self):
        """Establish MongoDB connection"""
        try:
            logger.info(f"Connecting to MongoDB: {Config.MONGODB_URI[:30]}...")
            
            self.client = MongoClient(
                Config.MONGODB_URI,
                serverSelectionTimeoutMS=5000,
                tlsAllowInvalidCertificates=True
            )
            self.db = self.client.get_database(Config.DATABASE_NAME)
            self.logs_collection = self.db.logs
            
            logger.info("MongoDB client created successfully")
        except Exception as e:
            logger.error(f"MongoDB connection failed: {e}", exc_info=True)
            self.client = None
            self.db = None
            self.logs_collection = None
    
    def is_connected(self) -> bool:
        """Check if database is connected"""
        return self.client is not None and self.logs_collection is not None
    
    def save_log(self, log_data: Dict[str, Any]) -> bool:
        """Save log entry to database"""
        if not self.is_connected():
            logger.debug("MongoDB not connected, skipping log save")
            return False
        
        try:
            self.logs_collection.insert_one(log_data)
            logger.info("Log saved to MongoDB")
            return True
        except Exception as e:
            logger.debug(f"Could not save to MongoDB: {str(e)[:100]}")
            return False
    
    def get_logs(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get logs from database"""
        if not self.is_connected():
            logger.error("MongoDB not connected")
            return []
        
        try:
            logs = list(self.logs_collection.find().sort('timestamp', -1).limit(limit))
            # Convert ObjectId to string
            for log in logs:
                log['_id'] = str(log['_id'])
            return logs
        except Exception as e:
            logger.error(f"Error getting logs: {e}", exc_info=True)
            return []
    
    def clear_logs(self) -> int:
        """Clear all logs from database"""
        if not self.is_connected():
            logger.error("MongoDB not connected")
            return 0
        
        try:
            result = self.logs_collection.delete_many({})
            logger.info(f"Cleared {result.deleted_count} logs")
            return result.deleted_count
        except Exception as e:
            logger.error(f"Error clearing logs: {e}", exc_info=True)
            return 0
    
    def close(self):
        """Close database connection"""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")

# Global database instance
db_manager = DatabaseManager()
