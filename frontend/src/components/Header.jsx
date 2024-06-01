import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.jpeg';
import './Header.scss';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header>
      <div className="logo">
        <img src={logo} alt="Zigmaswebdev Logo" />
      </div>
      <nav className={isMenuOpen ? "open" : ""}>
        <ul>
          <li>
            <Link to="/" onClick={closeMenu}></Link>
          </li>
          <li>
            <Link to="/apie-mane" onClick={closeMenu}>Apie mane</Link>
          </li>
          <li>
            <Link to="/darbai" onClick={closeMenu}>Mano darbai</Link>
          </li>
          <li>
            <Link to="/kontaktai" onClick={closeMenu}>Kontaktai</Link>
          </li>
        </ul>
      </nav>
      <div className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </header>
  );
};

export default Header;
