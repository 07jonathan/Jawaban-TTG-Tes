const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { pool, testConnection } = require('./database');

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mengambil semua user
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
});

// Mengambil user berdasarkan ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user'
        });
    }
});

// Membuat user baru
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        
        // Validasi input
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Name and email are required'
            });
        }
        
        const [result] = await pool.query(
            'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)',
            [name, email, phone]
        );
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                id: result.insertId,
                name,
                email,
                phone
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to create user'
        });
    }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const userId = req.params.id;
        
        // Validasi input
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Name and email are required'
            });
        }
        
        // Cek user
        const [checkRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (checkRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Update user
        await pool.query(
            'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
            [name, email, phone, userId]
        );
        
        res.json({
            success: true,
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error('Error updating user:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to update user'
        });
    }
});

// Menghapus user
app.delete('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Cek user
        const [checkRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (checkRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Hapus user
        await pool.query('DELETE FROM users WHERE id = ?', [userId]);
        
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
});

// Cek database
app.get('/api/health', async (req, res) => {
    const dbConnected = await testConnection();
    
    res.json({
        server: 'running',
        database: dbConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Jalankan server
async function startServer() {
    // Test koneksi database
    await testConnection();
    
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`API Endpoint: http://localhost:${PORT}/api/users`);
    });
}

startServer().catch(console.error);