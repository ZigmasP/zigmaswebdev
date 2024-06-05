import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.webp";
import "./Header.scss";

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
      <nav className={isMenuOpen ? "open" : ""} aria-label="Main Navigation">
        <ul>
          <li>
            <Link to="/" onClick={closeMenu}>Home</Link>
          </li>
          <li>
            <Link to="/apie-mane" onClick={closeMenu}>Apie mane</Link>
          </li>
          <li>
            <Link to="/mano-darbai" onClick={closeMenu}>Mano darbai</Link>
          </li>
          <li>
            <Link to="/kontaktai" onClick={closeMenu}>Kontaktai</Link>
          </li>
        </ul>
      </nav>
      <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </header>
  );
};

export default Header;
