import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { noteService } from '../services/api';
import NoteCard from '../components/common/NoteCard';

const DashboardPage = () => {
  const { user } = useAuth();
  const [myNotes, setMyNotes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [notesRes, bmRes] = await Promise.all([
          noteService.getMyNotes(),
          noteService.getMyBookmarks()
        ]);
        setMyNotes(notesRes.data || []);
        setBookmarks(bmRes.data || []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalViews = myNotes.reduce((acc, note) => acc + (note.viewCount || 0), 0);
  const totalDownloads = myNotes.reduce((acc, note) => acc + (note.downloadCount || 0), 0);

  return (
    <div className="py-4" style={{ backgroundColor: 'var(--ns-bg-main)' }}>
      <div className="container">
        {/* Welcome Banner */}
        <div className="p-4 p-md-5 rounded-4 mb-4 border text-white position-relative overflow-hidden"
             style={{ background: 'var(--ns-gradient-primary)' }}>
          <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
            <div className="col-md-8">
              <span className="badge bg-white text-primary rounded-pill px-3 py-1 mb-2 fw-semibold">
                Student Workspace
              </span>
              <h2 className="fw-bold mb-2">Hello, {user?.name}! 👋</h2>
              <p className="mb-0 opacity-90">
                {user?.college} • {user?.department} • Year {user?.year}
              </p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <Link to="/upload" className="btn btn-light rounded-pill px-4 py-2 fw-bold text-primary shadow">
                <i className="bi bi-cloud-arrow-up-fill me-1"></i> Upload New Note
              </Link>
            </div>
          </div>
        </div>

        {/* Contribution Overview Stats */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <div className="card-ns p-3 text-center">
              <div className="d-inline-flex p-2 rounded-circle mb-2" style={{ backgroundColor: 'var(--ns-primary-light)', color: 'var(--ns-primary)' }}>
                <i className="bi bi-journal-check fs-4"></i>
              </div>
              <h4 className="fw-bold mb-0">{myNotes.length}</h4>
              <small className="text-muted fw-semibold">My Uploads</small>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="card-ns p-3 text-center">
              <div className="d-inline-flex p-2 rounded-circle mb-2" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--ns-amber)' }}>
                <i className="bi bi-eye fs-4"></i>
              </div>
              <h4 className="fw-bold mb-0">{totalViews}</h4>
              <small className="text-muted fw-semibold">Total Views</small>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="card-ns p-3 text-center">
              <div className="d-inline-flex p-2 rounded-circle mb-2" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--ns-green)' }}>
                <i className="bi bi-cloud-download fs-4"></i>
              </div>
              <h4 className="fw-bold mb-0">{totalDownloads}</h4>
              <small className="text-muted fw-semibold">Total Downloads</small>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="card-ns p-3 text-center">
              <div className="d-inline-flex p-2 rounded-circle mb-2" style={{ backgroundColor: 'var(--ns-violet-light)', color: 'var(--ns-violet)' }}>
                <i className="bi bi-bookmark-heart fs-4"></i>
              </div>
              <h4 className="fw-bold mb-0">{bookmarks.length}</h4>
              <small className="text-muted fw-semibold">Bookmarked</small>
            </div>
          </div>
        </div>

        {/* My Notes Section */}
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0">My Uploaded Notes</h4>
            <Link to="/my-notes" className="btn btn-outline-primary btn-sm rounded-pill px-3">
              Manage All Notes ({myNotes.length})
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : myNotes.length > 0 ? (
            <div className="row g-4">
              {myNotes.slice(0, 3).map((note) => (
                <div key={note.id} className="col-md-6 col-lg-4">
                  <NoteCard note={note} />
                </div>
              ))}
            </div>
          ) : (
            <div className="card-ns p-5 text-center">
              <i className="bi bi-cloud-arrow-up fs-1 text-muted mb-2"></i>
              <h5 className="fw-bold">No notes uploaded yet</h5>
              <p className="text-secondary small mb-3">Share your study notes to help peers and build your contribution rating!</p>
              <div>
                <Link to="/upload" className="btn btn-primary-ns">
                  Upload Your First Note
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Saved Bookmarks Section */}
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0">Saved for Quick Revision</h4>
            <Link to="/bookmarks" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
              View All ({bookmarks.length})
            </Link>
          </div>

          {bookmarks.length > 0 ? (
            <div className="row g-4">
              {bookmarks.slice(0, 3).map((note) => (
                <div key={note.id} className="col-md-6 col-lg-4">
                  <NoteCard note={note} />
                </div>
              ))}
            </div>
          ) : (
            <div className="card-ns p-4 text-center text-muted">
              <p className="mb-0 small">You haven't bookmarked any notes yet. Browse materials and click the bookmark ribbon to save them.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
