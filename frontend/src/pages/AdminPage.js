import React, { useState, useEffect } from 'react';
import { adminService, getFileUrl } from '../services/api';

const AdminPage = () => {
  const [stats, setStats] = useState({});
  const [pendingNotes, setPendingNotes] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes, reportsRes, usersRes] = await Promise.all([
        adminService.getStats(),
        adminService.getPendingNotes(),
        adminService.getReports(),
        adminService.getUsers()
      ]);
      setStats(statsRes.data || {});
      setPendingNotes(pendingRes.data || []);
      setReports(reportsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await adminService.updateNoteStatus(id, status);
      setPendingNotes(prev => prev.filter(n => n.id !== id));
      setStats(prev => ({ ...prev, pendingNotes: Math.max(0, prev.pendingNotes - 1) }));
    } catch (err) {
      console.error('Error updating note status:', err);
      alert('Error updating note status.');
    }
  };

  const handleResolveReport = async (id, status) => {
    try {
      await adminService.resolveReport(id, status);
      setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (err) {
      console.error('Error resolving report:', err);
      alert('Error updating report.');
    }
  };

  return (
    <div className="py-4" style={{ backgroundColor: 'var(--ns-bg-main)' }}>
      <div className="container">
        <div className="mb-4">
          <div className="badge bg-danger-subtle text-danger rounded-pill px-3 py-1 mb-2 fw-semibold">
            Administrative Control Center
          </div>
          <h2 className="fw-bold mb-1">NoteStack Admin Dashboard</h2>
          <p className="text-secondary small mb-0">Review submitted academic notes, moderate user reports, and oversee platform activity.</p>
        </div>

        {/* System Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <div className="card-ns p-3 text-center border-start border-primary border-4">
              <h4 className="fw-bold mb-0 text-primary">{stats.totalNotes || 0}</h4>
              <small className="text-muted fw-semibold">Total Notes</small>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card-ns p-3 text-center border-start border-warning border-4">
              <h4 className="fw-bold mb-0 text-warning">{stats.pendingNotes || 0}</h4>
              <small className="text-muted fw-semibold">Pending Approvals</small>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card-ns p-3 text-center border-start border-danger border-4">
              <h4 className="fw-bold mb-0 text-danger">{stats.totalReports || 0}</h4>
              <small className="text-muted fw-semibold">User Reports</small>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card-ns p-3 text-center border-start border-success border-4">
              <h4 className="fw-bold mb-0 text-success">{stats.totalUsers || 0}</h4>
              <small className="text-muted fw-semibold">Registered Users</small>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <ul className="nav nav-pills mb-4 gap-2 border-bottom pb-3">
          <li className="nav-item">
            <button
              onClick={() => setActiveTab('pending')}
              className={`nav-link rounded-pill px-3 btn-sm ${activeTab === 'pending' ? 'active' : 'btn-light'}`}
            >
              <i className="bi bi-hourglass-split me-1"></i> Pending Notes ({pendingNotes.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setActiveTab('reports')}
              className={`nav-link rounded-pill px-3 btn-sm ${activeTab === 'reports' ? 'active' : 'btn-light'}`}
            >
              <i className="bi bi-flag-fill me-1"></i> Reports Queue ({reports.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setActiveTab('users')}
              className={`nav-link rounded-pill px-3 btn-sm ${activeTab === 'users' ? 'active' : 'btn-light'}`}
            >
              <i className="bi bi-people-fill me-1"></i> Student Directory ({users.length})
            </button>
          </li>
        </ul>

        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted small mt-2">Loading administrative records...</p>
          </div>
        )}

        {/* Tab 1: Pending Notes */}
        {!loading && activeTab === 'pending' && (
          <div>
            {pendingNotes.length > 0 ? (
              <div className="card-ns overflow-hidden border">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0 small">
                    <thead className="table-light">
                      <tr>
                        <th>Title & Subject</th>
                        <th>Uploader</th>
                        <th>Category</th>
                        <th>Submitted</th>
                        <th className="text-end">Moderation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingNotes.map((note) => (
                        <tr key={note.id}>
                          <td>
                            <div className="fw-bold">{note.title}</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{note.subjectName}</div>
                          </td>
                          <td>
                            <div>{note.uploader?.name}</div>
                            <small className="text-muted">{note.uploader?.college}</small>
                          </td>
                          <td>
                            <span className="badge-ns-cat">{note.categoryName}</span>
                          </td>
                          <td className="text-muted">
                            {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ''}
                          </td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-1">
                              <a
                                href={getFileUrl(encodeURI(note.fileUrl || ''))}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-outline-secondary btn-sm py-1 px-2"
                              >
                                Preview
                              </a>
                              <button
                                onClick={() => handleUpdateStatus(note.id, 'APPROVED')}
                                className="btn btn-success btn-sm py-1 px-2"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(note.id, 'REJECTED')}
                                className="btn btn-danger btn-sm py-1 px-2"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="card-ns p-5 text-center text-muted">
                <i className="bi bi-check2-circle fs-1 text-success mb-2"></i>
                <h5 className="fw-bold">No pending notes</h5>
                <p className="small mb-0">All submitted study materials have been reviewed and approved.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Reports Queue */}
        {activeTab === 'reports' && (
          <div>
            {reports.length > 0 ? (
              <div className="card-ns overflow-hidden border">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0 small">
                    <thead className="table-light">
                      <tr>
                        <th>Note Title</th>
                        <th>Reporter</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((rep) => (
                        <tr key={rep.id}>
                          <td>
                            <strong className="text-dark">{rep.note?.title}</strong>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Details: {rep.details || 'None'}</div>
                          </td>
                          <td>{rep.reporter?.name}</td>
                          <td>
                            <span className="badge bg-warning-subtle text-warning">{rep.reason}</span>
                          </td>
                          <td>
                            <span className={`badge ${rep.status === 'PENDING' ? 'bg-danger' : 'bg-secondary'}`}>
                              {rep.status}
                            </span>
                          </td>
                          <td className="text-end">
                            {rep.status === 'PENDING' ? (
                              <div className="d-flex justify-content-end gap-1">
                                <button
                                  onClick={() => handleResolveReport(rep.id, 'RESOLVED')}
                                  className="btn btn-outline-success btn-sm py-1 px-2"
                                >
                                  Resolve
                                </button>
                                <button
                                  onClick={() => handleResolveReport(rep.id, 'DISMISSED')}
                                  className="btn btn-outline-secondary btn-sm py-1 px-2"
                                >
                                  Dismiss
                                </button>
                              </div>
                            ) : (
                              <span className="text-muted small">Closed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="card-ns p-5 text-center text-muted">
                <i className="bi bi-shield-check fs-1 text-success mb-2"></i>
                <h5 className="fw-bold">No unresolved reports</h5>
                <p className="small mb-0">The platform community is clean and in compliance with guidelines.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Users */}
        {activeTab === 'users' && (
          <div className="card-ns overflow-hidden border">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light">
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>College</th>
                    <th>Department</th>
                    <th>Year</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="fw-bold">{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.college}</td>
                      <td>{u.department}</td>
                      <td>Year {u.year}</td>
                      <td>
                        <span className={`badge ${u.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'} rounded-pill`}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
