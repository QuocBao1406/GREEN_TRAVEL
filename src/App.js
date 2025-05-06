import './App.css';
import Header from './components/header/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NewsFeed from './pages/newsFeed/NewsFeed';
import React, { useState } from 'react';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import Travel from './pages/travel/Travel';
import Products from './pages/products/Products';
import About from './pages/about/About';
import Message from './pages/message/Message';
import Profile from './pages/profile/Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('user'));

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} />
      <main className='main-content'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/travel' element={<Travel />} />
          <Route path='/products' element={<Products />} />
          <Route path='/news' element={<NewsFeed />} />
          <Route path='/about' element={<About />} />
          <Route path='/message' element={<Message />} />
          <Route 
            path='/login' 
            element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />} 
          />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;