import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Routes instead of Switch

import Chatbot from './components/Chatbot';


function App() {
  return (
    <Router>
      <Routes>  {/* Use Routes instead of Switch */}
        {/* Define routes for different pages */}
        <Route path="/" element={<Chatbot/>} /> {/* Use element instead of component */}

      </Routes>
    </Router>
  );
}

export default App;




