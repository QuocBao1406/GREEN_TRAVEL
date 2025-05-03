import React, { useState } from 'react';
import './Login.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import axios from 'axios';

const Login = () => {
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
  const [error, setError] = useState('');

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value}));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value}));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/auth/login', loginData,
        {
          validateStatus: (status) => status < 500
        }
      );

      if(!response || !response.data) {
        throw new Error('Không nhận được phản hồi từ server')
      }

      if(response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.location.href = '/';

        return;
      }
      
    } catch (err) {
      console.error('Login error: ', err);
      setError(
        err.response?.data?.message ||
        err.response?.statusText ||
        err.massage ||
        'Đăng nhập thất bại!'
      );
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if(registerData.password !== registerData.confirmPassword) {
      setError('Mật khẩu không khớp!');
      return;
    }

    try {
      const response = await axios.post('/api/auth/register', {
        email: registerData.email,
        username: registerData.username,
        password: registerData.password
      }, {
        validateStatus: function (status) {
          return status < 500;
        }
      });
      
      if(response.status === 201) {
        setIsRegister(false);
        setError('Đăng ký thành công! Vui lòng đăng nhập.');
      } else {
        setError(response.data?.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Đăng ký thất bại');
    }
  }


  return (
    <div className={`wrapper ${isRegister ? 'active' : ''}`}>
      <div className="container-panel">
        <div className="form-box login-box">
          <form onSubmit={handleLoginSubmit}>
            <h1>ĐĂNG NHẬP</h1>
            {error && <div className="error-message">{error}</div>}
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
            {error && <div className='error-message'>{error}</div>}
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
              required />
              <FaLock className="icon" />
            </div>
            {registerData.password && registerData.confirmPassword && (
              <div className={`password-match ${registerData.password === registerData.confirmPassword ? 'match' : 'mismatch'}`}>
                {registerData.password === registerData.confirmPassword
                  ? '✓ Mật khẩu khớp' 
                  : '✗ Mật khẩu không khớp'
                  }
              </div>
            )};
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