import mysql from 'mysql2/promise'; // Use the promise-based version
import Redis from 'ioredis';
import logger from '../utils/logger.js';


// Connect to MySQL
export const connectDB = async () => {

  while (true) {
    try {
      const db = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: "ecommerce",
        waitForConnections: true,
        connectionLimit: process.env.MYSQL_CONNECTION_LIMIT, // or more depending on expected load
        dateStrings: true
      });

      // Force connection test
      const connection = await db.getConnection();
      connection.release();

      logger.info(`MySQL connected successfully!`);
      return db; // Return the connection object

    } catch (error) {
      
      logger.error("MySQL connection Failed. Retrying in 5 seconds...");
      logger.error(error?.message || error);
      
      // Wait 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Connect to Redis
export const connectRedis = async () => {
  try {
    const redis = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      // password: process.env.REDIS_PASSWORD, // if needed
    });

    logger.info(`Redis connected successfully!`);
    return redis; // Return the connection object
  } catch (error) {
    logger.error("Redis connection FAILED:", error);
    process.exit(1);
  }
};
