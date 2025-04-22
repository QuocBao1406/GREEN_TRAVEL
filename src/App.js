import './App.css';
import Header from './components/header/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NewsFeed from './pages/newsFeed/NewsFeed';
import React from 'react';

function App() {
  return (
    <Router>
      <Header />

      <main className='main-content'>
        <Routes>
          <Route path='/news' element={<NewsFeed />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
