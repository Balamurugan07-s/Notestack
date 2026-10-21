import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { noteService, metadataService } from '../services/api';
import NoteCard from '../components/common/NoteCard';

const departments = [
  'Computer Science',
  'Electronics & Communication',
  'Information Technology',
  'Mechanical Engineering'
];

const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

const BrowseNotesPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [department, setDepartment] = useState(searchParams.get('department') || '');
  const [semester, setSemester] = useState(searchParams.get('semester') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(0);

  const hasFilters = Boolean(query || categoryId || department || semester);

  useEffect(() => {
    metadataService.getCategories()
      .then(res => setCategories(res.data || []))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          size: 9,
          sortBy
        };
        if (query) params.query = query;
        if (categoryId) params.categoryId = categoryId;
        if (department) params.department = department;
        if (semester) params.semester = semester;

        const res = await noteService.getNotes(params);
        setNotes(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error('Error fetching notes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [query, categoryId, department, semester, sortBy, page]);

  const handleResetFilters = () => {
    setQuery('');
    setCategoryId('');
    setDepartment('');
    setSemester('');
    setSortBy('newest');
    setPage(0);
  };

  return (
    <div className="py-4" style={{ backgroundColor: 'var(--ns-bg-main)' }}>
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold mb-1">Browse Academic Study Notes</h2>
          <p className="text-secondary small mb-0">
            Filter materials by department, semester, subject, and resource category.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="card-ns p-3 mb-4">
          <div className="row g-2 align-items-center">
            {/* Search */}
            <div className="col-lg-3 col-md-6">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-transparent border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0 shadow-none"
                  placeholder="Keyword, subject, topic..."
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(0); }}
                />
              </div>
            </div>

            {/* Department Filter */}
            <div className="col-lg-2 col-md-3 col-6">
              <select
                className="form-select form-select-sm"
                value={department}
                onChange={(e) => { setDepartment(e.target.value); setPage(0); }}
              >
                <option value="">All Departments</option>
                {departments.map((dept, i) => (
                  <option key={i} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Semester Filter */}
            <div className="col-lg-2 col-md-3 col-6">
              <select
                className="form-select form-select-sm"
                value={semester}
                onChange={(e) => { setSemester(e.target.value); setPage(0); }}
              >
                <option value="">All Semesters</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="col-lg-2 col-md-4 col-6">
              <select
                className="form-select form-select-sm"
                value={categoryId}
                onChange={(e) => { setCategoryId(e.target.value); setPage(0); }}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="col-lg-2 col-md-4 col-6">
              <select
                className="form-select form-select-sm"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
              >
                <option value="newest">Newest First</option>
                <option value="top-rated">Top Rated ★</option>
                <option value="most-downloaded">Most Downloaded</option>
                <option value="most-viewed">Most Viewed</option>
              </select>
            </div>

            {/* Reset */}
            <div className="col-lg-1 col-md-4 col-12 text-end">
              <button
                onClick={handleResetFilters}
                className="btn btn-outline-secondary btn-sm w-100"
                title="Reset all filters"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted small mt-2">Loading study materials...</p>
          </div>
        ) : notes.length > 0 ? (
          <>
            <div className="row g-4 mb-4">
              {notes.map((note) => (
                <div key={note.id} className="col-md-6 col-lg-4">
                  <NoteCard note={note} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center gap-2 mt-4">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  className="btn btn-outline-primary btn-sm px-3 rounded-pill"
                >
                  <i className="bi bi-chevron-left me-1"></i> Prev
                </button>
                <span className="align-self-center small fw-semibold text-secondary">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                  className="btn btn-outline-primary btn-sm px-3 rounded-pill"
                >
                  Next <i className="bi bi-chevron-right ms-1"></i>
                </button>
              </div>
            )}
          </>
        ) : (
            <div className="card-ns p-5 text-center">
              <i className={`bi ${hasFilters ? 'bi-search' : 'bi-folder2-open'} fs-1 text-muted mb-2`}></i>
              <h5 className="fw-bold">{hasFilters ? 'No notes matched your criteria' : 'No notes uploaded yet'}</h5>
              <p className="text-secondary small mb-3">
                {hasFilters
                  ? 'Try adjusting your department, semester, or search term filters.'
                  : 'Be the first student to upload and share study materials for your peers!'}
              </p>
              <div className="d-flex justify-content-center gap-2">
                {hasFilters && (
                  <button onClick={handleResetFilters} className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                    Clear Filters
                  </button>
                )}
                <Link to="/upload" className="btn btn-primary-ns btn-sm rounded-pill px-4">
                  <i className="bi bi-cloud-arrow-up-fill me-1"></i> Upload Notes
                </Link>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default BrowseNotesPage;
