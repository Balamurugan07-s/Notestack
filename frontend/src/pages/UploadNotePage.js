import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { noteService, metadataService } from '../services/api';

const departments = [
  'Computer Science',
  'Electronics & Communication',
  'Information Technology',
  'Mechanical Engineering'
];

const UploadNotePage = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [semester, setSemester] = useState('4');
  const [subjectId, setSubjectId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');

  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Load categories and initial subjects
  useEffect(() => {
    metadataService.getCategories()
      .then(res => {
        setCategories(res.data || []);
        if (res.data && res.data.length > 0) {
          setCategoryId(res.data[0].id);
        }
      })
      .catch(err => console.error('Error loading categories:', err));
  }, []);

  // Filter subjects based on department & semester
  useEffect(() => {
    metadataService.getSubjects({ department, semester })
      .then(res => {
        setSubjects(res.data || []);
        if (res.data && res.data.length > 0) {
          setSubjectId(res.data[0].id);
        } else {
          setSubjectId('');
        }
      })
      .catch(err => console.error('Error loading subjects:', err));
  }, [department, semester]);

  const handleFileChange = (selectedFile) => {
    setFileError('');
    if (!selectedFile) return;

    // Check size <= 10MB
    if (selectedFile.size > 10 * 1024 * 1024) {
      setFileError('File exceeds the 10 MB maximum limit. Please choose a smaller document.');
      setFile(null);
      return;
    }

    const allowed = ['pdf', 'docx', 'pptx', 'png', 'jpg', 'jpeg', 'webp'];
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) {
      setFileError('Invalid file type. Allowed: PDF, DOCX, PPTX, PNG, JPG, JPEG, WEBP.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    if (!title) {
      // Auto fill title from filename without extension
      const baseName = selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTitle(baseName.charAt(0).toUpperCase() + baseName.slice(1));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setFileError('Please attach a document or notes file.');
      return;
    }
    if (!subjectId) {
      setError('Please select a subject.');
      return;
    }

    setError('');
    setUploading(true);
    setUploadProgress(10);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('subjectId', subjectId);
    formData.append('categoryId', categoryId);
    formData.append('tags', tags.trim());
    formData.append('visibility', visibility);

    try {
      const res = await noteService.uploadNote(formData, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      });

      navigate(`/notes/${res.data.id}`);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload notes. Please verify all fields and file size.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--ns-bg-main)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card-ns p-4 p-md-5 shadow-sm border">
              <div className="mb-4">
                <h2 className="fw-bold mb-1">Upload Academic Notes</h2>
                <p className="text-secondary small mb-0">
                  Share lectures, solved assignments, past exam questions, or cheatsheets with fellow students.
                </p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Drag and drop upload zone */}
                <div className="mb-4">
                  <label className="form-label small fw-semibold text-secondary">Document Attachment (Max 10 MB)</label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`p-4 text-center rounded-3 border-2 border-dashed transition-all ${
                      isDragging ? 'border-primary bg-primary-subtle' : 'border-secondary-subtle bg-light'
                    }`}
                    style={{ borderStyle: 'dashed', cursor: 'pointer' }}
                    onClick={() => document.getElementById('file-upload-input').click()}
                  >
                    <input
                      id="file-upload-input"
                      type="file"
                      className="d-none"
                      onChange={(e) => handleFileChange(e.target.files[0])}
                      accept=".pdf,.docx,.pptx,.png,.jpg,.jpeg,.webp"
                    />

                    {file ? (
                      <div>
                        <i className="bi bi-file-earmark-check-fill text-success fs-1 mb-2"></i>
                        <h6 className="fw-bold mb-1">{file.name}</h6>
                        <small className="text-muted">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • Click or drag another file to replace
                        </small>
                      </div>
                    ) : (
                      <div>
                        <i className="bi bi-cloud-arrow-up-fill text-primary fs-1 mb-2"></i>
                        <h6 className="fw-bold mb-1">Drag and drop file here, or browse</h6>
                        <small className="text-muted">
                          Supports PDF, DOCX, PPTX, and image formats up to 10 MB
                        </small>
                      </div>
                    )}
                  </div>
                  {fileError && <div className="text-danger small mt-1">{fileError}</div>}
                </div>

                {/* Upload Progress Bar */}
                {uploading && (
                  <div className="mb-4">
                    <div className="d-flex justify-content-between small text-muted mb-1">
                      <span>Uploading to NoteStack secure storage...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Title */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Note Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Unit 3 Relational Algebra & Normalization Hand-drawn Notes"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Description (Optional)</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Briefly describe what topics, formulas, or solved questions are included..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                {/* Department & Semester Hierarchy */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Department</label>
                    <select
                      className="form-select"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    >
                      {departments.map((dept, i) => (
                        <option key={i} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Semester</label>
                    <select
                      className="form-select"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>Semester {s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject & Category */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Subject</label>
                    <select
                      className="form-select"
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      required
                    >
                      {subjects.length > 0 ? (
                        subjects.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.code} – {sub.name}
                          </option>
                        ))
                      ) : (
                        <option value="">No subjects found for this semester</option>
                      )}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Resource Category</label>
                    <select
                      className="form-select"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Tags (Comma or space separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. dbms, normalization, midterm, formula-sheet"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <small className="text-muted">Tags help peers quickly search and find your notes.</small>
                </div>

                {/* Visibility */}
                <div className="mb-4">
                  <label className="form-label small fw-semibold text-secondary">Sharing Visibility</label>
                  <div className="d-flex flex-wrap gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="visibility"
                        id="vis-public"
                        value="PUBLIC"
                        checked={visibility === 'PUBLIC'}
                        onChange={(e) => setVisibility(e.target.value)}
                      />
                      <label className="form-check-label small" htmlFor="vis-public">
                        <strong>Public:</strong> Anyone can search and view
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="visibility"
                        id="vis-link"
                        value="LINK_ONLY"
                        checked={visibility === 'LINK_ONLY'}
                        onChange={(e) => setVisibility(e.target.value)}
                      />
                      <label className="form-check-label small" htmlFor="vis-link">
                        <strong>Link-only:</strong> Accessible only via unique share URL
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="visibility"
                        id="vis-private"
                        value="PRIVATE"
                        checked={visibility === 'PRIVATE'}
                        onChange={(e) => setVisibility(e.target.value)}
                      />
                      <label className="form-check-label small" htmlFor="vis-private">
                        <strong>Private:</strong> Only you can view
                      </label>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-outline-secondary px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="btn btn-primary-ns px-4 d-flex align-items-center gap-2"
                  >
                    {uploading && <span className="spinner-border spinner-border-sm" role="status"></span>}
                    <span>Publish Note</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadNotePage;
