import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-badge">SCP</span>
          <div className="brand-text">
            <span className="brand-title">FOUNDATION ARCHIVE</span>
            <span className="brand-subtitle">SECURE. CONTAIN. PROTECT.</span>
          </div>
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Command Center
          </NavLink>
          <NavLink to="/catalogue" onClick={closeMenu} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            SCP Catalogue
          </NavLink>
          <NavLink to="/search" onClick={closeMenu} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Search Database
          </NavLink>
          <NavLink to="/admin" onClick={closeMenu} className={({ isActive }) => (isActive ? 'nav-link nav-link-admin active' : 'nav-link nav-link-admin')}>
            + Admin CRUD
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
