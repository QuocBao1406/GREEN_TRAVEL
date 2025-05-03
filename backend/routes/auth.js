const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

//Đăng ký
router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;

    const [emailExists] = await pool.query(
        'SELECT id FROM users WHERE email = ?', 
        [email]
      );
      if (emailExists.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email đã được sử dụng'
        });
      }
  
      const [usernameExists] = await pool.query(
        'SELECT id FROM users WHERE username = ?', 
        [username]
      );
      if (usernameExists.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Username đã được sử dụng'
        });
      }

        if(!email || !username || !password) {
            return res.status(400).json({
                sucess: false,
                message: 'Vui lòng điền đầy đủ thông tin'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({
                sucess: false,
                message: 'Email không hợp lệ'
            })
        }

        if(password.length < 6) {
            return res.status(400).json({
                sucess: false,
                message: 'Mật khẩu phải có ít nhất 6 ký tự'
            })
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const [result] = await pool.query(
            'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
            [email, username, hashedPassword]
        );

        res.status(201).json({
            success: true,
            messange: 'Đăng ký thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            messange: 'Lỗi server'});
    }
});

//Đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if(users.length === 0) {
            return res.status(400).json({ messange: 'Tài khoản không tồn tại' });
        }

        const user = users[0];

        const isMatch = bcrypt.compareSync(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ messange: 'Mật khẩu không đúng' });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ messange: 'Lỗi server'});
    }
});

module.exports = router;