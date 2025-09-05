import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoanForm from './pages/LoanForm';
import Result from './pages/Result';
import './App.css';
import Navbar from './components/Navbar';
import CalculatorPage from './pages/Calculator';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Contact from './pages/Contact';
import PredictLoan from './pages/PredictLoan';

function App() {
  return (
    <Router>
      <div className="App ">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loan-form" element={<LoanForm />} />
          <Route path="/result" element={<Result />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/predict-loan" element={<PredictLoan />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
