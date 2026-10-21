import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';

const Footer = () => {
  return (
    <footer className="footer-ns mt-auto">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img src={logo} alt="NoteStack" width="32" height="32" />
              <span className="brand-text">NoteStack</span>
            </div>
            <p className="text-secondary small mb-3">
              A centralized student notes sharing platform. Upload academic notes, organize them by department, semester, and subject, and share them anywhere, anytime.
            </p>
            <div className="d-flex gap-2">
              <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">Spring Boot 3</span>
              <span className="badge bg-info-subtle text-info rounded-pill px-3 py-2">React 18</span>
              <span className="badge bg-warning-subtle text-warning rounded-pill px-3 py-2">MySQL</span>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">Explore</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-secondary">
              <li><Link to="/browse" className="text-decoration-none text-secondary">All Notes</Link></li>
              <li><Link to="/browse?category=1" className="text-decoration-none text-secondary">Lecture Notes</Link></li>
              <li><Link to="/browse?category=2" className="text-decoration-none text-secondary">Past Papers (PYQs)</Link></li>
              <li><Link to="/browse?category=4" className="text-decoration-none text-secondary">Formula Sheets</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3">Student Hub</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-secondary">
              <li><Link to="/upload" className="text-decoration-none text-secondary">Upload Notes</Link></li>
              <li><Link to="/dashboard" className="text-decoration-none text-secondary">Student Dashboard</Link></li>
              <li><Link to="/my-notes" className="text-decoration-none text-secondary">My Uploads</Link></li>
              <li><Link to="/bookmarks" className="text-decoration-none text-secondary">Saved Collections</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3">Community & Safety</h6>
            <p className="text-secondary small mb-2">
              NoteStack is an academic platform built on academic integrity and open collaboration.
            </p>
            <div className="d-flex align-items-center gap-2 text-success small fw-semibold">
              <i className="bi bi-shield-check fs-5"></i>
              <span>Verified Student Peer Sharing</span>
            </div>
          </div>
        </div>

        <div className="border-top pt-3 d-flex flex-wrap justify-content-between align-items-center text-muted small">
          <div>© 2026 NoteStack Platform. All rights reserved.</div>
          <div>Built for students, by students.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
