import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.svg';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg border-bottom sticky-top"
         style={{ backgroundColor: 'var(--ns-bg-surface)', borderColor: 'var(--ns-border)', zIndex: 1020 }}>
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src={logo} alt="NoteStack" className="navbar-brand-logo" />
          <span className="brand-text">NoteStack</span>
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <Link className={`nav-link fw-semibold ${isActive('/browse') ? 'text-primary active' : ''}`} to="/browse">
                <i className="bi bi-grid-3x3-gap-fill me-1"></i> Browse Notes
              </Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link fw-semibold ${isActive('/dashboard') ? 'text-primary active' : ''}`} to="/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link fw-semibold ${isActive('/upload') ? 'text-primary active' : ''}`} to="/upload">
                    <i className="bi bi-cloud-arrow-up-fill me-1"></i> Upload
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link fw-semibold ${isActive('/my-notes') ? 'text-primary active' : ''}`} to="/my-notes">
                    <i className="bi bi-folder2-open me-1"></i> My Notes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link fw-semibold ${isActive('/bookmarks') ? 'text-primary active' : ''}`} to="/bookmarks">
                    <i className="bi bi-bookmark-heart-fill me-1"></i> Saved
                  </Link>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <Link className={`nav-link fw-semibold text-danger ${isActive('/admin') ? 'active' : ''}`} to="/admin">
                      <i className="bi bi-shield-lock-fill me-1"></i> Admin Panel
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          {/* Right Controls */}
          <div className="d-flex align-items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="btn btn-outline-secondary btn-sm rounded-pill px-3 d-flex align-items-center gap-2"
              title="Toggle Dark/Light Mode"
              id="theme-toggle-btn"
            >
              <i className={`bi bi-${darkMode ? 'sun-fill text-warning' : 'moon-stars-fill text-primary'}`}></i>
              <span className="small">{darkMode ? 'Light' : 'Dark'}</span>
            </button>

            {/* Auth Actions */}
            {!isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-ns btn-sm px-3">
                  Log In
                </Link>
                <Link to="/signup" className="btn btn-primary-ns btn-sm px-3">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="dropdown">
                <button
                  className="btn btn-light btn-sm rounded-pill d-flex align-items-center gap-2 px-3 border dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ backgroundColor: 'var(--ns-bg-subtle)', borderColor: 'var(--ns-border)', color: 'var(--ns-text-primary)' }}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold small"
                    style={{ width: '26px', height: '26px', background: 'var(--ns-gradient-primary)' }}
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="fw-semibold small">{user?.name}</span>
                  {isAdmin && <span className="badge bg-danger ms-1" style={{ fontSize: '0.65rem' }}>ADMIN</span>}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border" style={{ backgroundColor: 'var(--ns-bg-surface)' }}>
                  <li className="px-3 py-2 border-bottom">
                    <div className="fw-bold small">{user?.name}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{user?.email}</div>
                    <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{user?.department} • Year {user?.year}</div>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/profile">
                      <i className="bi bi-person-fill me-2 text-primary"></i> Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/my-notes">
                      <i className="bi bi-file-earmark-text-fill me-2 text-primary"></i> My Uploads
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/bookmarks">
                      <i className="bi bi-bookmark-fill me-2 text-warning"></i> Bookmarked Notes
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Log Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
