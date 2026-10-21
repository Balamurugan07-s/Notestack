import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { noteService, getDownloadUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const NoteCard = ({ note, onBookmarkToggle }) => {
  const { isAuthenticated } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(note.bookmarkedByCurrentUser);
  const [downloadCount, setDownloadCount] = useState(note.downloadCount);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please log in to bookmark notes.');
      return;
    }
    setBookmarkLoading(true);
    try {
      const res = await noteService.toggleBookmark(note.id);
      const newState = res.data.data;
      setIsBookmarked(newState);
      if (onBookmarkToggle) onBookmarkToggle(note.id, newState);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    setDownloadCount(prev => prev + 1);
  };

  return (
    <div className="card-ns p-3 h-100 d-flex flex-column justify-content-between position-relative">
      {/* Top Badges */}
      <div>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex flex-wrap gap-1">
            <span className="badge-ns-dept">
              {note.department} • Sem {note.semester}
            </span>
            <span className="badge-ns-cat">
              {note.categoryName}
            </span>
          </div>

          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className={`btn btn-sm rounded-circle p-1 border-0 ${isBookmarked ? 'text-warning' : 'text-muted'}`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark note'}
            style={{ backgroundColor: 'transparent' }}
          >
            <i className={`bi bi-${isBookmarked ? 'bookmark-fill' : 'bookmark'} fs-5`}></i>
          </button>
        </div>

        {/* Note Title */}
        <h6 className="fw-bold mb-2">
          <Link to={`/notes/${note.id}`} className="text-decoration-none text-dark hover-primary" style={{ color: 'var(--ns-text-primary)' }}>
            {note.title}
          </Link>
        </h6>

        {/* Subject code & name */}
        <div className="small text-muted mb-2 d-flex align-items-center gap-1">
          <i className="bi bi-book-half text-primary"></i>
          <span>{note.subjectCode} – {note.subjectName}</span>
        </div>

        {/* Description */}
        <p className="text-secondary small mb-3 text-truncate-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {note.description || 'No description provided.'}
        </p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-3">
            {note.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="badge bg-light text-secondary border rounded-pill" style={{ fontSize: '0.7rem' }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Metadata & Actions */}
      <div className="border-top pt-2 mt-2">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="badge-ns-rating d-flex align-items-center gap-1">
            <i className="bi bi-star-fill text-warning"></i>
            <span>{note.averageRating ? Number(note.averageRating).toFixed(1) : '0.0'}</span>
            <span className="text-muted fw-normal">({note.totalRatings || 0})</span>
          </div>

          <div className="small text-muted d-flex align-items-center gap-2">
            <span title="Views"><i className="bi bi-eye"></i> {note.viewCount}</span>
            <span title="Downloads"><i className="bi bi-download"></i> {downloadCount}</span>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center pt-1">
          <div className="small text-secondary text-truncate" style={{ maxWidth: '140px' }}>
            <i className="bi bi-person-circle me-1"></i>
            <span>{note.uploader?.name || 'Student'}</span>
          </div>

          <div className="d-flex gap-1">
            <Link to={`/notes/${note.id}`} className="btn btn-outline-primary btn-sm px-2 py-1" style={{ fontSize: '0.75rem' }}>
              Preview
            </Link>
            <a
              href={getDownloadUrl(note.id)}
              onClick={handleDownload}
              download
              className="btn btn-primary-ns btn-sm px-2 py-1"
              style={{ fontSize: '0.75rem' }}
              title="Download File"
            >
              <i className="bi bi-download"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
