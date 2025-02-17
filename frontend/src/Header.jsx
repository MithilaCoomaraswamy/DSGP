import { NavLink } from 'react-router-dom';

function Header({ openModal }) {
  return (
    <header>
      <nav>
        <ul>
          <div className="heading">
            <NavLink to="/">
              <img src="logo.png" alt="FemPredict Logo" className="logo" />
            </NavLink>
          </div>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'active' : ''} 
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/about" 
              className={({ isActive }) => isActive ? 'active' : ''} 
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/period_tracker" 
              className={({ isActive }) => isActive ? 'active' : ''} 
            >
              Period Tracker
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/pcos_quiz" 
              className={({ isActive }) => isActive ? 'active' : ''} 
            >
              PCOS Quiz
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/exercise_recommender" 
              className={({ isActive }) => isActive ? 'active' : ''} 
            >
              Exercise Recommender
            </NavLink>
          </li>
          {/* Login link that opens the modal */}
          <li>
            <NavLink
              to="#"
              onClick={openModal} // Trigger modal open
              style={{ display: 'block', textDecoration: 'none' }}
              className={({ isActive }) => isActive ? 'active' : ''} // Ensures active class is applied when needed
            >
              Login
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
