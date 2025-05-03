import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';
import logo from '../../images/logo/travel-logo.png';

const Header = () => {
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
                <li><NavLink to='/login'>Đăng nhập</NavLink></li>
                </ul>
            </div>
        </nav>
    )
}

export default Header;