const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Tạo pool kết nối MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Thay bằng user MySQL của bạn
  database: 'green-travel', // Tạo database này trước trong MySQL
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Tạo bảng users nếu chưa tồn tại
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    connection.release();
    console.log('Database initialized');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

initializeDatabase();

// API đăng ký
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const [emailRows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (emailRows.length > 0) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // Kiểm tra username đã tồn tại chưa
    const [userRows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (userRows.length > 0) {
      return res.status(400).json({ message: 'Username đã được sử dụng' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu user vào database
    await pool.query(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
      [email, username, hashedPassword]
    );

    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Đăng ký thất bại' });
  }
});

// API đăng nhập
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tìm user trong database
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Username hoặc mật khẩu không đúng' });
    }

    const user = rows[0];

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username hoặc mật khẩu không đúng' });
    }

    // Trả về thông tin user (có thể thêm JWT token nếu cần)
    res.json({
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Đăng nhập thất bại' });
  }
});

// Khởi động server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy ở port ${PORT}`);
});