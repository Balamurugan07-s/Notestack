import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.svg';

const departments = [
  'Computer Science',
  'Electronics & Communication',
  'Information Technology',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical & Electronics',
  'Chemical Engineering',
  'Biotechnology'
];

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    department: 'Computer Science',
    year: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup({
        ...formData,
        year: parseInt(formData.year, 10)
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--ns-bg-main)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card-ns p-4 p-md-5 shadow-lg border">
              <div className="text-center mb-4">
                <img src={logo} alt="NoteStack" width="56" height="56" className="mb-2" />
                <h3 className="fw-bold mb-1">Join NoteStack</h3>
                <p className="text-secondary small">Create your student account to share & discover study notes</p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="e.g. Aarav Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">College Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="name@college.edu"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">Password (min 6 characters)</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="••••••••"
                      minLength="6"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">College / University Name</label>
                    <input
                      type="text"
                      name="college"
                      className="form-control"
                      placeholder="e.g. National Institute of Technology"
                      value={formData.college}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-7">
                    <label className="form-label small fw-semibold text-secondary">Department / Branch</label>
                    <select
                      name="department"
                      className="form-select"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    >
                      {departments.map((dept, idx) => (
                        <option key={idx} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-5">
                    <label className="form-label small fw-semibold text-secondary">Academic Year</label>
                    <select
                      name="year"
                      className="form-select"
                      value={formData.year}
                      onChange={handleChange}
                      required
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary-ns w-100 py-2 mt-4 d-flex align-items-center justify-content-center gap-2"
                >
                  {loading && <span className="spinner-border spinner-border-sm" role="status"></span>}
                  <span>Create Account</span>
                </button>
              </form>

              <div className="text-center mt-4 text-secondary small">
                Already have an account?{' '}
                <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
