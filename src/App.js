import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router } from 'react-router-dom';
import Card from './test/Card';

function App() {
  return (
    <Router>
      <Header />
      <h1>Green Travel 🌿</h1>
      <Card />
    </Router>
  );
}

export default App;
