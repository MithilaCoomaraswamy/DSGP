// Header.js
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ handleLogout, handleEditProfile }) => {
  const [menuOpen, setMenuOpen] = useState(false); // State to control hamburger menu visibility
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle the hamburger menu
  };

  // Close menu if the user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="header">
      <div className="logo">
        <Link to="/Profile" className="logo-link">
          <img src="logo.png" alt="Logo" className="logo-img" />
        </Link>
      </div>

      <div className="header-nav">
        <div ref={hamburgerRef} className="hamburger-icon" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <ul ref={menuRef} className={`header-nav-list ${menuOpen ? 'open' : ''}`}>
          <li onClick={handleEditProfile} className="header-btn">Edit Profile</li>
          <li onClick={handleLogout} className="header-btn btn-warning">Logout</li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
