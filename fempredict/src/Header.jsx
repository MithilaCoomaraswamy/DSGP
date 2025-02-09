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
            <NavLink to="/" activeClassName="active" exact>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" activeClassName="active">
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/period_tracker" activeClassName="active">
              Period Tracker
            </NavLink>
          </li>
          <li>
            <NavLink to="/pcos_quiz" activeClassName="active">
              PCOS Quiz
            </NavLink>
          </li>
          <li>
            <NavLink to="/chatbot" activeClassName="active">
              Chatbot
            </NavLink>
          </li>
          <li>
            <NavLink to="/exercise_recommender" activeClassName="active">
              Exercise Recommender
            </NavLink>
          </li>
          {/* Login link that opens the modal */}
          <li>
            <NavLink
              to="#"
              onClick={openModal} // Trigger modal open
              style={{ display: 'block', textDecoration: 'none' }}
              activeClassName="active"
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
