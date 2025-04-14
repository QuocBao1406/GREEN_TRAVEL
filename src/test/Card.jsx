import React, { useState } from 'react';
import './Card.css';

const Card = () => {
  const [clickedIndex, setClickedIndex] = useState(null);

  const handleClick = (index) => {
    setClickedIndex(index);
  };

  return (
    <div className="cards-container">
      <div 
        className={`card ${clickedIndex === 0 ? 'clicked' : ''}`} 
        onClick={() => handleClick(0)}
      >
        <div className="card-content">
          <h2>Card 1</h2>
          <p>Hover or click to see the effects!</p>
        </div>
        <div className="card-underline"></div>
      </div>
      <div 
        className={`card ${clickedIndex === 1 ? 'clicked' : ''}`} 
        onClick={() => handleClick(1)}
      >
        <div className="card-content">
          <h2>Card 2</h2>
          <p>Hover or click to see the effects!</p>
        </div>
        <div className="card-underline"></div>
      </div>
      <div 
        className={`card ${clickedIndex === 2 ? 'clicked' : ''}`} 
        onClick={() => handleClick(2)}
      >
        <div className="card-content">
          <h2>Card 3</h2>
          <p>Hover or click to see the effects!</p>
        </div>
        <div className="card-underline"></div>
      </div>
    </div>
  );
};

export default Card;
