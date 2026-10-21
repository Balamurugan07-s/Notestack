import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { noteService, metadataService } from '../services/api';
import NoteCard from '../components/common/NoteCard';

const LandingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [trendingNotes, setTrendingNotes] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, recentRes, catRes] = await Promise.all([
          noteService.getTrendingNotes(),
          noteService.getRecentNotes(),
          metadataService.getCategories()
        ]);
        setTrendingNotes(trendingRes.data || []);
        setRecentNotes(recentRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error('Error fetching landing page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/browse?query=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="py-5 text-center position-relative overflow-hidden" style={{ background: 'var(--ns-gradient-hero)' }}>
        <div className="container py-4">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white shadow-sm mb-3 border">
            <span className="badge rounded-pill" style={{ backgroundColor: 'var(--ns-green)', color: '#fff' }}>NEW</span>
            <small className="text-secondary fw-semibold">Next-Gen Academic Collaboration Platform</small>
          </div>

          <h1 className="display-4 fw-bold mb-3">
            Share Notes. <span className="text-gradient">Ace Exams.</span>
          </h1>

          <p className="lead mx-auto mb-4" style={{ maxWidth: '680px', color: 'var(--ns-text-secondary)' }}>
            A centralized student notes sharing platform. Upload, categorize, rate, and access academic study materials anywhere, anytime.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="mx-auto mb-4" style={{ maxWidth: '600px' }}>
            <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white p-1 border">
              <span className="input-group-text bg-transparent border-0 text-muted ps-3">
                <i className="bi bi-search fs-5 text-primary"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none ps-2"
                placeholder="Search by subject, topic (e.g. DBMS, Algorithms, OS)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary-ns rounded-pill px-4" type="submit">
                Search
              </button>
            </div>
          </form>

          {/* Quick Category Pills */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/browse?category=${cat.id}`}
                className="btn btn-sm btn-light border rounded-pill px-3 py-1 d-flex align-items-center gap-1 shadow-sm"
                style={{ backgroundColor: 'var(--ns-bg-surface)' }}
              >
                <i className={`bi ${cat.icon || 'bi-tag'} text-primary`}></i>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="d-flex justify-content-center gap-3">
            <Link to="/upload" className="btn btn-primary-ns btn-lg px-4 d-flex align-items-center gap-2">
              <i className="bi bi-cloud-arrow-up-fill"></i>
              <span>Upload Notes</span>
            </Link>
            <Link to="/browse" className="btn btn-outline-ns btn-lg px-4 d-flex align-items-center gap-2">
              <i className="bi bi-compass"></i>
              <span>Browse All Subjects</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="border-bottom py-4" style={{ backgroundColor: 'var(--ns-bg-surface)' }}>
        <div className="container">
          <div className="row text-center g-3">
            <div className="col-6 col-md-3">
              <h3 className="fw-bold text-primary mb-0">1,500+</h3>
              <small className="text-muted fw-semibold">Uploaded Documents</small>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="fw-bold text-warning mb-0">4.8★</h3>
              <small className="text-muted fw-semibold">Peer Rating Average</small>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="fw-bold text-success mb-0">25,000+</h3>
              <small className="text-muted fw-semibold">Total Downloads</small>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="fw-bold text-primary mb-0">100%</h3>
              <small className="text-muted fw-semibold">Free Academic Access</small>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Notes Section */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <div className="d-inline-flex align-items-center gap-1 text-danger small fw-bold mb-1">
              <i className="bi bi-fire"></i>
              <span>TRENDING THIS WEEK</span>
            </div>
            <h2 className="fw-bold mb-0">Popular Student Materials</h2>
          </div>
          <Link to="/browse?sort=most-downloaded" className="btn btn-outline-primary btn-sm rounded-pill px-3">
            View All Trending <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted small mt-2">Loading popular notes...</p>
          </div>
        ) : trendingNotes.length > 0 ? (
          <div className="row g-4">
            {trendingNotes.map((note) => (
              <div key={note.id} className="col-md-6 col-lg-4">
                <NoteCard note={note} />
              </div>
            ))}
          </div>
        ) : (
          <div className="card-ns p-5 text-center">
            <div className="d-inline-flex p-3 rounded-circle bg-light mb-3">
              <i className="bi bi-journal-plus fs-2 text-primary"></i>
            </div>
            <h5 className="fw-bold mb-1">No trending notes yet</h5>
            <p className="text-secondary small mb-3">Be the first to share study materials! Upload your lecture slides, handwritten notes, or exam solutions.</p>
            <div>
              <Link to="/upload" className="btn btn-primary-ns btn-sm rounded-pill px-4">
                <i className="bi bi-cloud-arrow-up-fill me-1"></i> Upload Study Notes
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Recently Added Section */}
      <section className="py-5" style={{ backgroundColor: 'var(--ns-bg-subtle)' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <div className="d-inline-flex align-items-center gap-1 text-primary small fw-bold mb-1">
                <i className="bi bi-clock-history"></i>
                <span>JUST UPLOADED</span>
              </div>
              <h2 className="fw-bold mb-0">Recently Added Study Materials</h2>
            </div>
            <Link to="/browse?sort=newest" className="btn btn-outline-primary btn-sm rounded-pill px-3">
              View All Recent <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : recentNotes.length > 0 ? (
            <div className="row g-4">
              {recentNotes.slice(0, 3).map((note) => (
                <div key={note.id} className="col-md-6 col-lg-4">
                  <NoteCard note={note} />
                </div>
              ))}
            </div>
          ) : (
            <div className="card-ns p-5 text-center">
              <div className="d-inline-flex p-3 rounded-circle bg-light mb-3">
                <i className="bi bi-file-earmark-arrow-up fs-2 text-primary"></i>
              </div>
              <h5 className="fw-bold mb-1">No notes uploaded yet</h5>
              <p className="text-secondary small mb-3">Once students or faculty publish notes, they will appear right here in real time.</p>
              <div>
                <Link to="/upload" className="btn btn-primary-ns btn-sm rounded-pill px-4">
                  <i className="bi bi-cloud-arrow-up-fill me-1"></i> Upload First Note
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Why Students Love NoteStack</h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
            Built specifically to solve unorganized WhatsApp groups, expired Google Drive links, and missing syllabus notes.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card-ns p-4 h-100">
              <div className="d-inline-flex p-3 rounded-3 mb-3" style={{ background: 'var(--ns-primary-light)', color: 'var(--ns-primary)' }}>
                <i className="bi bi-diagram-3-fill fs-3"></i>
              </div>
              <h5 className="fw-bold mb-2">Hierarchical Organization</h5>
              <p className="text-secondary small mb-0">
                Filter directly by Department → Semester → Subject to pinpoint precisely the unit or chapter you need before exams.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card-ns p-4 h-100">
              <div className="d-inline-flex p-3 rounded-3 mb-3" style={{ background: 'var(--ns-violet-light)', color: 'var(--ns-violet)' }}>
                <i className="bi bi-eye-fill fs-3"></i>
              </div>
              <h5 className="fw-bold mb-2">In-Browser PDF Previews</h5>
              <p className="text-secondary small mb-0">
                Preview full slide decks, handwritten notes, and solved questions instantly without needing to download files first.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card-ns p-4 h-100">
              <div className="d-inline-flex p-3 rounded-3 mb-3" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--ns-amber)' }}>
                <i className="bi bi-share-fill fs-3"></i>
              </div>
              <h5 className="fw-bold mb-2">One-Click Share Links</h5>
              <p className="text-secondary small mb-0">
                Generate clean, lightweight share tokens that anyone can view and download on mobile without requiring an app install.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
