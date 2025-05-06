import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';
import logo from '../../images/logo/travel-logo.png';
import { FaUserCircle } from 'react-icons/fa';

const Header = ({ isAuthenticated }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // Ảnh mặc định nếu người dùng chưa có ảnh đại diện
  const defaultAvatar = <FaUserCircle size={30} />;

  return (
    <nav className="nav">
      <div className="logo">
        <Link to='/'><img src={logo} alt="Logo" /></Link>
      </div>

      <div className='nav-center'>
        <ul>
          <li><NavLink to='/'>TRANG CHỦ</NavLink></li>
          <li><NavLink to='/travel'>DU LỊCH</NavLink></li>
          <li><NavLink to='/products'>SẢN PHẨM</NavLink></li>
          <li><NavLink to='/news'>BẢNG TIN</NavLink></li>
          <li><NavLink to='/about'>GIỚI THIỆU</NavLink></li>
        </ul>
      </div>

      <div className='nav-right'>
        <ul>
          <li><NavLink to='/message'>Nhắn tin</NavLink></li>
          {isAuthenticated ? (
            <li className="user-menu">
              <div className="user-avatar">
                {currentUser?.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt="User avatar" 
                    className="avatar-image"
                  />
                ) : (
                  defaultAvatar
                )}
              </div>
              <div className="dropdown-menu">
                <NavLink to="/profile" className="dropdown-item">Hồ sơ</NavLink>
                <button onClick={handleLogout} className="dropdown-item">Đăng xuất</button>
              </div>
            </li>
          ) : (
            <li><NavLink to='/login'>Đăng nhập</NavLink></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;