import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import logo from '../assets/logo.svg';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [resetTokenInfo, setResetTokenInfo] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage('');
    try {
      const res = await authService.forgotPassword(forgotEmail);
      setForgotMessage(res.data.message || 'Password reset link sent!');
      if (res.data.data) {
        setResetTokenInfo(res.data.data);
      }
    } catch (err) {
      setForgotMessage(err.response?.data?.message || 'Error requesting password reset.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="py-5 d-flex align-items-center min-vh-75" style={{ backgroundColor: 'var(--ns-bg-main)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="card-ns p-4 p-md-5 shadow-lg border">
              {/* Logo & Header */}
              <div className="text-center mb-4">
                <img src={logo} alt="NoteStack" width="56" height="56" className="mb-2" />
                <h3 className="fw-bold mb-1">Welcome Back</h3>
                <p className="text-secondary small">Log in to access your notes, uploads, and saved materials</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <div>{error}</div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">College Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0 text-muted">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0 ps-0 shadow-none"
                      placeholder="student@notestack.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold text-secondary mb-0">Password</label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="btn btn-link p-0 text-decoration-none small text-primary"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0 text-muted">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0 ps-0 shadow-none"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary-ns w-100 py-2 mt-2 d-flex align-items-center justify-content-center gap-2"
                >
                  {loading && <span className="spinner-border spinner-border-sm" role="status"></span>}
                  <span>Log In</span>
                </button>
              </form>

              <div className="text-center mt-4 text-secondary small">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary fw-semibold text-decoration-none">
                  Sign Up Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Reset Password</h5>
                <button type="button" className="btn-close" onClick={() => setShowForgotModal(false)}></button>
              </div>
              <div className="modal-body py-3">
                <p className="text-secondary small mb-3">
                  Enter your registered college email and we will generate a password recovery token.
                </p>

                {forgotMessage && (
                  <div className="alert alert-info py-2 small mb-3">
                    {forgotMessage}
                    {resetTokenInfo && (
                      <div className="mt-2 p-2 bg-white rounded border small">
                        <strong>Reset Token:</strong> <code>{resetTokenInfo}</code>
                        <div className="text-muted mt-1">
                          Copy this token to reset your password.
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handleForgotSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="name@college.edu"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-light" onClick={() => setShowForgotModal(false)}>
                      Close
                    </button>
                    <button type="submit" disabled={forgotLoading} className="btn btn-primary-ns">
                      {forgotLoading && <span className="spinner-border spinner-border-sm me-1"></span>}
                      Send Reset Token
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
