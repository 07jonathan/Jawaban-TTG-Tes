const mysql = require('mysql2');
require('dotenv').config();

//Koneksi database
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'crud_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Test koneksi database
async function testConnection() {
    try {
        const [rows] = await promisePool.query('SELECT 1 + 1 AS result');
        console.log('Database connected successfully');
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        return false;
    }
}

module.exports = {
    pool: promisePool,
    testConnection
};