import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { noteService } from '../services/api';

const MyNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchMyNotes();
  }, []);

  const fetchMyNotes = async () => {
    setLoading(true);
    try {
      const res = await noteService.getMyNotes();
      setNotes(res.data || []);
    } catch (err) {
      console.error('Error fetching my notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this study note?')) return;
    setDeleteLoading(id);
    try {
      await noteService.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Could not delete note.');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="py-4" style={{ backgroundColor: 'var(--ns-bg-main)' }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">My Uploaded Notes</h2>
            <p className="text-secondary small mb-0">Manage study documents and materials you have shared.</p>
          </div>
          <Link to="/upload" className="btn btn-primary-ns btn-sm px-3">
            <i className="bi bi-cloud-arrow-up-fill me-1"></i> Upload Another
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted small mt-2">Loading your uploads...</p>
          </div>
        ) : notes.length > 0 ? (
          <div className="card-ns overflow-hidden border">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-secondary">
                  <tr>
                    <th>Title & Subject</th>
                    <th>Category</th>
                    <th>Visibility</th>
                    <th>Views</th>
                    <th>Downloads</th>
                    <th>Rating</th>
                    <th>Uploaded</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {notes.map((note) => (
                    <tr key={note.id}>
                      <td>
                        <div className="fw-bold text-dark">{note.title}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {note.subjectCode} • {note.subjectName}
                        </div>
                      </td>
                      <td>
                        <span className="badge-ns-cat">{note.categoryName}</span>
                      </td>
                      <td>
                        <span className={`badge ${
                          note.visibility === 'PUBLIC' ? 'bg-success-subtle text-success' :
                          note.visibility === 'LINK_ONLY' ? 'bg-info-subtle text-info' :
                          'bg-secondary-subtle text-secondary'
                        } rounded-pill`}>
                          {note.visibility}
                        </span>
                      </td>
                      <td>{note.viewCount}</td>
                      <td>{note.downloadCount}</td>
                      <td>
                        <span className="badge-ns-rating">★ {Number(note.averageRating).toFixed(1)}</span>
                      </td>
                      <td className="text-muted">
                        {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ''}
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Link to={`/notes/${note.id}`} className="btn btn-outline-primary btn-sm py-1 px-2" title="View Note">
                            <i className="bi bi-eye"></i>
                          </Link>
                          <button
                            onClick={() => handleDelete(note.id)}
                            disabled={deleteLoading === note.id}
                            className="btn btn-outline-danger btn-sm py-1 px-2"
                            title="Delete Note"
                          >
                            {deleteLoading === note.id ? (
                              <span className="spinner-border spinner-border-sm" role="status"></span>
                            ) : (
                              <i className="bi bi-trash"></i>
                            )}
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
          <div className="card-ns p-5 text-center">
            <i className="bi bi-journal-plus fs-1 text-muted mb-2"></i>
            <h5 className="fw-bold">You haven't uploaded any notes yet</h5>
            <p className="text-secondary small mb-3">Upload lecture notes, cheatsheets, or previous exam papers to help your classmates.</p>
            <div>
              <Link to="/upload" className="btn btn-primary-ns">
                Upload Study Material
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNotesPage;
