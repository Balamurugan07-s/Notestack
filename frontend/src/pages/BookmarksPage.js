import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { noteService } from '../services/api';
import NoteCard from '../components/common/NoteCard';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await noteService.getMyBookmarks();
      setBookmarks(res.data || []);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkToggle = (noteId, isBookmarked) => {
    if (!isBookmarked) {
      setBookmarks(prev => prev.filter(n => n.id !== noteId));
    }
  };

  return (
    <div className="py-4" style={{ backgroundColor: 'var(--ns-bg-main)' }}>
      <div className="container">
        <div className="mb-4">
          <h2 className="fw-bold mb-1">Bookmarked Notes</h2>
          <p className="text-secondary small mb-0">Study materials saved for quick exam revision and reference.</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted small mt-2">Loading saved collection...</p>
          </div>
        ) : bookmarks.length > 0 ? (
          <div className="row g-4">
            {bookmarks.map((note) => (
              <div key={note.id} className="col-md-6 col-lg-4">
                <NoteCard note={note} onBookmarkToggle={handleBookmarkToggle} />
              </div>
            ))}
          </div>
        ) : (
          <div className="card-ns p-5 text-center">
            <i className="bi bi-bookmark-heart fs-1 text-muted mb-2"></i>
            <h5 className="fw-bold">No saved bookmarks</h5>
            <p className="text-secondary small mb-3">While browsing notes, click the bookmark icon to save materials for quick access anytime.</p>
            <div>
              <Link to="/browse" className="btn btn-outline-primary btn-sm rounded-pill px-3">
                Browse Notes
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
