import React, { useState } from 'react';
import './Login.css';
import { FaUser, FaLock, FaTimes } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '' // 'error' or 'success'
  });
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const validateRegisterForm = () => {
    if (!registerData.email.trim()) {
      showNotification('Email là bắt buộc', 'error');
      return false;
    }
    if (!validateEmail(registerData.email)) {
      showNotification('Email không hợp lệ', 'error');
      return false;
    }
    if (!registerData.username.trim()) {
      showNotification('Username là bắt buộc', 'error');
      return false;
    }
    if (registerData.username.length < 6) {
      showNotification('Username phải có ít nhất 6 ký tự', 'error');
      return false;
    }
    if (!registerData.password.trim()) {
      showNotification('Mật khẩu là bắt buộc', 'error');
      return false;
    }
    if (registerData.password.length < 6) {
      showNotification('Mật khẩu phải có ít nhất 6 ký tự', 'error');
      return false;
    }
    if (!registerData.confirmPassword.trim()) {
      showNotification('Xác nhận mật khẩu là bắt buộc', 'error');
      return false;
    }
    if (registerData.password !== registerData.confirmPassword) {
      showNotification('Mật khẩu không khớp', 'error');
      return false;
    }
    return true;
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
      
      if (response.data && response.data.user) {
        showNotification('Đăng nhập thành công!', 'success');
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onLoginSuccess(); // Gọi callback để cập nhật trạng thái đăng nhập
        navigate('/news'); // Chuyển hướng đến trang bảng tin
      } else {
        throw new Error('Đăng nhập thất bại');
      }
    } catch (err) {
      showNotification(
        err.response?.data?.message || 'Username hoặc mật khẩu không đúng',
        'error'
      );
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        email: registerData.email,
        username: registerData.username,
        password: registerData.password
      });

      if (response.status === 201) {
        showNotification('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
        setRegisterData({
          email: '',
          username: '',
          password: '',
          confirmPassword: ''
        });
        setIsRegister(false);
      }
    } catch (err) {
      showNotification(
        err.response?.data?.message || 'Đăng ký thất bại. Email hoặc username đã tồn tại',
        'error'
      );
    }
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  return (
    <div className={`wrapper ${isRegister ? 'active' : ''}`}>
      {/* Notification Popup */}
      {notification.show && (
        <div className={`notification-popup ${notification.type}`}>
          <div className="notification-content">
            <span>{notification.message}</span>
            <button onClick={closeNotification} className="close-btn">
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      <div className="container-panel">
        <div className="form-box login-box">
          <form onSubmit={handleLoginSubmit}>
            <h1>ĐĂNG NHẬP</h1>
            <div className="input-box">
              <input 
                type="text" 
                name='username'
                placeholder="Username"
                value={loginData.username}
                onChange={handleLoginChange}
                required 
              />
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input 
                type="password" 
                name='password'
                placeholder="Password" 
                value={loginData.password}
                onChange={handleLoginChange}
                required 
              />
              <FaLock className="icon" />
            </div>
            <div className="remember-forgot">
                <label><input type="checkbox" />Remember me</label><br />
                <a href="#">Quên mật khẩu?</a>
            </div>
            <button type="submit">Đăng nhập</button>
          </form>
        </div>

        <div className="form-box register-box">
          <form onSubmit={handleRegisterSubmit}>
            <h1>ĐĂNG KÝ</h1>
            <div className="input-box">
              <input 
                type="email" 
                name='email'
                placeholder="Email" 
                value={registerData.email}
                onChange={handleRegisterChange}
                required 
              />
              <MdEmail className="icon" />
            </div>
            <div className="input-box">
              <input 
                type="text" 
                name='username'
                placeholder="Username" 
                value={registerData.username}
                onChange={handleRegisterChange}
                required 
              />
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input 
                type="password" 
                name='password'
                placeholder="Mật khẩu" 
                value={registerData.password}
                onChange={handleRegisterChange}
                required 
              />
              <FaLock className="icon" />
            </div>
            <div className="input-box">
              <input 
                type="password" 
                name='confirmPassword'
                placeholder="Nhập lại mật khẩu" 
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                required 
              />
              <FaLock className="icon" />
            </div>
            <button type="submit">Đăng ký</button>
          </form>
        </div>

        <div className="overlay-panel">
          <div className="overlay">
            <div className="overlay-content left">
              <h2>Xin chào bạn mới!</h2>
              <p>Bạn đã có tài khoản? Đăng nhập ngay!</p>
              <button className="ghost" onClick={() => setIsRegister(false)}>Đăng nhập</button>
            </div>
            <div className="overlay-content right">
              <h2>Chào mừng trở lại!</h2>
              <p>Chưa có tài khoản? Hãy đăng ký ngay!</p>
              <button className="ghost" onClick={() => setIsRegister(true)}>Đăng ký</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;