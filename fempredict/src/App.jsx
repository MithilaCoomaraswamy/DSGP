import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Profile from './pages/Profile.jsx';

function App() {
  return (
    <Router>
      <Header />
      <div className="main-content">
        <Routes>
          {/* Default route (home page) */}
          <Route path="/" element={<Home />} />
          {/* Other routes */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
