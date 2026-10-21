import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { noteService, getFileUrl, getDownloadUrl, getShareUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

const NoteDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [note, setNote] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [loading, setLoading] = useState(true);

  // PDF Preview State
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);

  // Report modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate Content');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState('');

  // Fetch note and comments
  useEffect(() => {
    const fetchNoteAndComments = async () => {
      try {
        const [noteRes, commentsRes] = await Promise.all([
          noteService.getNoteById(id),
          noteService.getComments(id)
        ]);
        setNote(noteRes.data);
        setIsBookmarked(noteRes.data.bookmarkedByCurrentUser);
        setUserRating(noteRes.data.userRating || 0);
        setComments(commentsRes.data || []);
      } catch (err) {
        console.error('Error fetching note details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNoteAndComments();
  }, [id]);

  // Load PDF as a Blob to bypass cross-origin iframe security / X-Frame-Options
  useEffect(() => {
    if (!note || !note.fileUrl) return;

    let isMounted = true;
    setPdfLoading(true);
    setPdfError(false);

    const targetUrl = getFileUrl(encodeURI(note.fileUrl));

    fetch(targetUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (isMounted) {
          const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
          setPdfBlobUrl(blobUrl);
          setPdfLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load PDF via blob:', err);
        if (isMounted) {
          setPdfError(true);
          setPdfLoading(false);
        }
      });

    return () => {
      isMounted = false;
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.fileUrl]);

  const handleRate = async (ratingVal) => {
    if (!isAuthenticated) {
      alert('Please log in to rate this note.');
      return;
    }
    setRatingSubmitting(true);
    try {
      const res = await noteService.rateNote(id, ratingVal);
      setNote(res.data);
      setUserRating(ratingVal);
    } catch (err) {
      console.error('Error submitting rating:', err);
    } finally {
      setRatingSubmitting(false);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      alert('Please log in to save notes.');
      return;
    }
    try {
      const res = await noteService.toggleBookmark(id);
      setIsBookmarked(res.data.data);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!isAuthenticated) {
      alert('Please log in to comment.');
      return;
    }

    setCommentSubmitting(true);
    try {
      const res = await noteService.addComment(id, newComment);
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleCopyShareLink = () => {
    const shareUrl = getShareUrl(note.shareToken);
    navigator.clipboard.writeText(shareUrl);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await noteService.reportNote(id, reportReason, reportDetails);
      setReportSuccess('Thank you. Note has been reported to moderators.');
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Error reporting note:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 min-vh-50 d-flex flex-column justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted small mt-2">Loading document...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="container py-5 text-center">
        <h4 className="fw-bold">Note Not Found</h4>
        <p className="text-secondary small">This study note may have been removed or is unavailable.</p>
        <Link to="/browse" className="btn btn-primary-ns">Browse Other Notes</Link>
      </div>
    );
  }

  return (
    <div className="py-4" style={{ backgroundColor: 'var(--ns-bg-main)' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/browse" className="text-decoration-none">Notes</Link></li>
            <li className="breadcrumb-item text-secondary">{note.subjectCode}</li>
            <li className="breadcrumb-item active text-truncate" style={{ maxWidth: '200px' }}>{note.title}</li>
          </ol>
        </nav>

        <div className="row g-4">
          {/* Main Content & PDF Viewer */}
          <div className="col-lg-8">
            <div className="card-ns p-4 mb-4">
              {/* Badges */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge-ns-dept">{note.department} • Sem {note.semester}</span>
                <span className="badge-ns-cat">{note.categoryName}</span>
                <span className="badge-ns-rating">★ {Number(note.averageRating).toFixed(1)} ({note.totalRatings} ratings)</span>
              </div>

              {/* Title & Description */}
              <h1 className="h3 fw-bold mb-2">{note.title}</h1>
              <p className="text-secondary mb-4">{note.description || 'No description provided.'}</p>

              {/* Action Buttons Bar */}
              <div className="d-flex flex-wrap gap-2 mb-4 p-3 rounded-3 border" style={{ backgroundColor: 'var(--ns-bg-subtle)' }}>
                <a
                  href={getDownloadUrl(note.id)}
                  download
                  className="btn btn-primary-ns btn-sm d-flex align-items-center gap-2"
                >
                  <i className="bi bi-cloud-arrow-down-fill fs-6"></i>
                  <span>Download Document</span>
                </a>

                <button
                  onClick={handleBookmark}
                  className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1 ${isBookmarked ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'}`}
                >
                  <i className={`bi bi-${isBookmarked ? 'bookmark-fill' : 'bookmark'}`}></i>
                  <span>{isBookmarked ? 'Bookmarked' : 'Save'}</span>
                </button>

                <button
                  onClick={handleCopyShareLink}
                  className="btn btn-outline-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
                >
                  <i className={`bi bi-${copyFeedback ? 'check-circle-fill text-success' : 'share-fill'}`}></i>
                  <span>{copyFeedback ? 'Copied Public Link!' : 'Share'}</span>
                </button>

                <button
                  onClick={() => setShowReportModal(true)}
                  className="btn btn-outline-danger btn-sm rounded-pill px-3 ms-auto"
                  title="Report inappropriate content"
                >
                  <i className="bi bi-flag"></i> Report
                </button>
              </div>

              {/* Interactive PDF Preview */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center p-2 px-3 bg-light rounded-top border text-secondary small">
                  <span className="fw-semibold">
                    <i className="bi bi-file-earmark-pdf-fill text-danger me-1"></i> {note.fileName}
                  </span>
                  <div className="d-flex align-items-center gap-3">
                    <span>{(note.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                    <a
                      href={getDownloadUrl(note.id)}
                      download
                      className="text-decoration-none text-primary fw-semibold"
                      title="Download file directly"
                    >
                      <i className="bi bi-download me-1"></i> Download
                    </a>
                  </div>
                </div>

                {pdfLoading ? (
                  <div className="d-flex flex-column align-items-center justify-content-center p-5 bg-light rounded-bottom border" style={{ height: '560px' }}>
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-secondary fw-semibold">Loading document preview...</p>
                  </div>
                ) : pdfError || !pdfBlobUrl ? (
                  <div className="p-5 text-center bg-light rounded-bottom border" style={{ minHeight: '320px' }}>
                    <i className="bi bi-file-earmark-pdf fs-1 text-danger mb-2 d-block"></i>
                    <h5 className="fw-bold text-dark">Preview Unavailable in Browser</h5>
                    <p className="text-muted small mb-3">You can download the PDF document directly to view it on your device.</p>
                    <a href={getDownloadUrl(note.id)} download className="btn btn-primary-ns px-4 py-2">
                      <i className="bi bi-cloud-arrow-down-fill me-2"></i> Download File ({note.fileName})
                    </a>
                  </div>
                ) : (
                  <iframe
                    src={pdfBlobUrl}
                    title="Note PDF Preview"
                    className="w-100 rounded-bottom border"
                    style={{ height: '640px', backgroundColor: '#525659' }}
                  />
                )}
              </div>

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="d-flex flex-wrap gap-1 align-items-center mb-2">
                  <span className="small text-muted fw-semibold me-1">Tags:</span>
                  {note.tags.map((tag, i) => (
                    <Link key={i} to={`/browse?query=${tag}`} className="badge bg-light text-secondary border rounded-pill text-decoration-none">
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Comments & Discussions */}
            <div className="card-ns p-4">
              <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-chat-left-text-fill text-primary"></i>
                <span>Discussion ({comments.length})</span>
              </h4>

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-4">
                <div className="mb-2">
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder={isAuthenticated ? "Ask a question or leave helpful feedback for the uploader..." : "Log in to post a question or comment..."}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={!isAuthenticated || commentSubmitting}
                    required
                  ></textarea>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    disabled={!isAuthenticated || commentSubmitting || !newComment.trim()}
                    className="btn btn-primary-ns btn-sm px-4"
                  >
                    {commentSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                    Post Comment
                  </button>
                </div>
              </form>

              {/* Comments List */}
              {comments.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {comments.map((c) => (
                    <div key={c.id} className="p-3 rounded-3 border" style={{ backgroundColor: 'var(--ns-bg-subtle)' }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold small"
                            style={{ width: '28px', height: '28px', background: 'var(--ns-gradient-primary)' }}
                          >
                            {c.user?.name?.charAt(0) || 'U'}
                          </div>
                          <span className="fw-bold small">{c.user?.name}</span>
                          <span className="text-muted small" style={{ fontSize: '0.75rem' }}>• {c.user?.college}</span>
                        </div>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}
                        </small>
                      </div>
                      <p className="mb-0 small text-secondary ps-4">{c.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted small text-center py-3 mb-0">No comments yet. Start the conversation!</p>
              )}
            </div>
          </div>

          {/* Right Sidebar: Rating & Uploader Details */}
          <div className="col-lg-4">
            {/* Interactive Rating Box */}
            <div className="card-ns p-4 mb-4 text-center">
              <h5 className="fw-bold mb-2">Rate This Study Material</h5>
              <p className="text-secondary small mb-3">Help fellow students know if these notes are accurate and high quality.</p>
              
              <div className="d-flex justify-content-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRate(star)}
                    disabled={ratingSubmitting}
                    className="btn btn-link p-0 text-warning border-0"
                    style={{ fontSize: '1.8rem', cursor: 'pointer' }}
                  >
                    <i className={`bi bi-star${(hoverRating || userRating) >= star ? '-fill' : ''}`}></i>
                  </button>
                ))}
              </div>

              {userRating > 0 ? (
                <div className="badge bg-success-subtle text-success small px-3 py-1 rounded-pill">
                  You rated this {userRating} out of 5 stars
                </div>
              ) : (
                <small className="text-muted">Click a star to submit your rating</small>
              )}
            </div>

            {/* Uploader Card */}
            <div className="card-ns p-4 mb-4">
              <h6 className="fw-bold text-muted small text-uppercase mb-3">Uploaded By</h6>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-5"
                  style={{ width: '50px', height: '50px', background: 'var(--ns-gradient-primary)' }}
                >
                  {note.uploader?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="fw-bold">{note.uploader?.name}</div>
                  <div className="text-secondary small">{note.uploader?.college}</div>
                  <div className="text-muted small">{note.uploader?.department} • Year {note.uploader?.year}</div>
                </div>
              </div>

              <hr className="my-3 opacity-25" />

              <div className="small d-flex flex-column gap-2 text-secondary">
                <div className="d-flex justify-content-between">
                  <span>Subject:</span>
                  <strong className="text-dark">{note.subjectName} ({note.subjectCode})</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Resource Type:</span>
                  <strong className="text-dark">{note.categoryName}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Total Views:</span>
                  <strong className="text-dark">{note.viewCount}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Total Downloads:</span>
                  <strong className="text-dark">{note.downloadCount}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Uploaded On:</span>
                  <strong className="text-dark">{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'N/A'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold text-danger">Report Inappropriate Note</h5>
                <button type="button" className="btn-close" onClick={() => setShowReportModal(false)}></button>
              </div>
              <div className="modal-body py-3">
                {reportSuccess ? (
                  <div className="alert alert-success">{reportSuccess}</div>
                ) : (
                  <form onSubmit={handleReportSubmit}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Reason for Report</label>
                      <select
                        className="form-select"
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        required
                      >
                        <option value="Incorrect or Misleading Notes">Incorrect or Misleading Notes</option>
                        <option value="Copyright or Plagiarism Violation">Copyright or Plagiarism Violation</option>
                        <option value="Spam or Unrelated Content">Spam or Unrelated Content</option>
                        <option value="Inappropriate Language or Images">Inappropriate Language or Images</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Additional Details (Optional)</label>
                      <textarea
                        rows="3"
                        className="form-control"
                        placeholder="Please describe what is wrong with this material..."
                        value={reportDetails}
                        onChange={(e) => setReportDetails(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                      <button type="button" className="btn btn-light" onClick={() => setShowReportModal(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-danger">
                        Submit Report
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteDetailsPage;
