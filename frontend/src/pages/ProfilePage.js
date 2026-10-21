import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--ns-bg-main)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card-ns p-4 p-md-5 border shadow-sm">
              <div className="text-center mb-4">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold mb-3 shadow"
                  style={{ width: '80px', height: '80px', background: 'var(--ns-gradient-primary)', fontSize: '2rem' }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <h4 className="fw-bold mb-1">{user?.name}</h4>
                <div className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 mb-2">
                  {user?.role}
                </div>
                <p className="text-secondary small mb-0">{user?.email}</p>
              </div>

              <div className="p-3 rounded-3 border mb-4" style={{ backgroundColor: 'var(--ns-bg-subtle)' }}>
                <h6 className="fw-bold small text-secondary mb-3 text-uppercase">Academic Credentials</h6>
                <div className="d-flex flex-column gap-2 small">
                  <div className="d-flex justify-content-between">
                    <span className="text-secondary">College / University:</span>
                    <strong className="text-dark">{user?.college}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-secondary">Department:</span>
                    <strong className="text-dark">{user?.department}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-secondary">Academic Year:</span>
                    <strong className="text-dark">Year {user?.year}</strong>
                  </div>
                </div>
              </div>

              {user?.bio && (
                <div className="mb-4">
                  <h6 className="fw-bold small text-secondary mb-1">About</h6>
                  <p className="text-secondary small mb-0">{user.bio}</p>
                </div>
              )}

              <div className="d-flex justify-content-center gap-2">
                <Link to="/my-notes" className="btn btn-outline-primary btn-sm px-3 rounded-pill">
                  View My Uploads
                </Link>
                <Link to="/dashboard" className="btn btn-primary-ns btn-sm px-3 rounded-pill">
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
