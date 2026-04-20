import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, MoreVertical, LayoutGrid, Users, Play,
  BarChart3, Share2, Clock,
  Copy, Archive, Trash2, FileEdit, Loader2, X, AlertCircle, Monitor, FileText, Upload
} from 'lucide-react';
import ThemeManager from '../templates/ThemeManager';
import '../styles/Presentations.css';

const SlideMiniPreview = ({ themeId, firstSlide }) => {
  const title = firstSlide?.title || '';
  const subtitle = firstSlide?.subtitle || '';

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      overflow: 'hidden', background: '#ffffff', borderRadius: '10px',
    }}>
      <div style={{
        width: '960px', height: '540px',
        transform: 'scale(0.2708)',
        transformOrigin: 'top left',
        pointerEvents: 'none',
        position: 'absolute', top: 0, left: 0,
        background: '#ffffff', overflow: 'hidden',
      }}>
        {/* ① الثيم */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <ThemeManager themeId={parseInt(themeId) || 0} />
        </div>

        {/* ② محتوى الشريحة الأولى الحقيقي */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '80px', gap: '20px',
        }}>
          {title && (
            <div style={{
              fontSize: '56px', fontWeight: '700',
              color: firstSlide?.titleStyle?.color || '#1e293b',
              fontFamily: firstSlide?.titleStyle?.fontFamily || 'inherit',
              textAlign: 'center', lineHeight: '1.2', wordBreak: 'break-word', width: '100%',
            }}>{title}</div>
          )}
          {subtitle && (
            <div style={{
              fontSize: '28px', fontWeight: '400',
              color: firstSlide?.subtitleStyle?.color || '#64748b',
              textAlign: 'center', lineHeight: '1.4', wordBreak: 'break-word', width: '100%',
              opacity: 0.85,
            }}>{subtitle}</div>
          )}
        </div>
      </div>
    </div>
  );
};

const Presentations = () => {
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [newTitle, setNewTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPresentations();
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchPresentations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/presentations');
      setPresentations(response.data.data);
    } catch (error) {
      const data = error.response?.data;
      setErrorMsg(
        data?.message + ' | ' + (data?.file || '') + ':' + (data?.line || '') +
        ' | errors: ' + JSON.stringify(data?.errors || {})
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This will permanently delete the presentation.")) return;
    try {
      await api.delete(`/presentations/${id}`);
      fetchPresentations();
    } catch (error) { alert("Delete failed"); }
  };

  const handleArchive = async (id) => {
    try {
      await api.patch(`/presentations/${id}/archive`);
      fetchPresentations();
    } catch (error) { alert("Archive operation failed"); }
  };

  const handleDuplicate = async (id) => {
    try {
      await api.post(`/presentations/${id}/duplicate`);
      fetchPresentations();
    } catch (error) { alert("Duplicate failed"); }
  };

  const executeCreate = async () => {
    if (!newTitle.trim()) { setErrorMsg('Title is required'); return; }
    try {
      setCreating(true);
      const response = await api.post('/presentations', {
        title: newTitle,
        template_id: selectedTemplate
      });
      navigate(`/editor/${response.data.data.id}?templateId=${selectedTemplate || 0}`);
    } catch (error) {
      setErrorMsg('Server error. Failed to create.');
      setCreating(false);
    }
  };
  const handlePptxUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setErrorMsg('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name.replace('.pptx', ''));
    try {
      const response = await api.post('/presentations/import-pptx', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/editor/${response.data.data.id}?templateId=0`);
      setShowModal(false);
    } catch {
      setErrorMsg('Failed to import. Check file format.');
    } finally {
      setUploading(false);
    }
  };
  // فلترة + بحث
  const filteredPresentations = presentations.filter(p => {
    const matchFilter = activeFilter === 'All' ? true : p.status === activeFilter.toLowerCase();
    const matchSearch = searchQuery.trim() === '' || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) return (
    <div className="loading-container-full">
      <Loader2 className="spinner-icon" size={40} />
      <p>Syncing Workspace...</p>
    </div>
  );

  return (
    <div className="sada-simple-container fade-in">
      <header className="sada-simple-header">
        <h1 className="simple-title">
          My Presentations <span>{presentations.length}</span>
        </h1>
        <button className="btn-add-simple" onClick={() => { setShowModal(true); setStep(1); setNewTitle(''); setErrorMsg(''); }}>
          <Plus size={18} /> New Presentation
        </button>
      </header>

      <div className="sada-simple-toolbar">
        <div className="filter-n-sort">
          <div className="pills-v4">
            {['All', 'Live', 'Draft', 'Archived'].map(f => (
              <button
                key={f}
                className={`v4-pill ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >{f}</button>
            ))}
          </div>
        </div>
        <div className={`search-v4 ${isSearchFocused ? 'expanded' : ''}`}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={(e) => !e.target.value && setIsSearchFocused(false)}
          />
        </div>
      </div>

      {filteredPresentations.length > 0 ? (
        <div className="sada-simple-grid">
          {filteredPresentations.map((p) => (
            <div key={p.id} className="p-mini-card">

              <div
                className="mini-preview-area"
                style={{ cursor: 'pointer', height: '146px' }}  /* 960×0.2708=260 / 540×0.2708=146 — نسبة 16:9 */
                onClick={() => navigate(`/editor/${p.id}?templateId=${p.template_id || 0}`)}
              >
                <SlideMiniPreview
                  themeId={p.template_id}
                  firstSlide={p.first_slide}
                />
                <div className={`mini-status ${p.status?.toLowerCase()}`}>{p.status}</div>
              </div>

              <div className="mini-card-info">
                <h4 className="mini-title-text">{p.title}</h4>
                <div className="mini-stats-grid">
                  <div className="stat-pill"><LayoutGrid size={12} /> {p.slides_count} Slides</div>
                  <div className="stat-pill"><Monitor size={12} /> {p.sessions_count || 0} Sessions</div>
                  <div className="stat-pill"><Users size={12} /> {p.total_participants || 0} Users</div>
                </div>
                <div className="mini-date-row">
                  <Clock size={11} /> <span>Created: {p.created_at}</span>
                </div>
              </div>

              <div className="mini-card-footer">
                <div className="mini-actions-group">
                  <button className="btn-icon-s"><BarChart3 size={15} /></button>
                  <button className="btn-icon-s"><Share2 size={15} /></button>

                  <div className="more-menu-wrapper">
                    <button
                      className={`btn-icon-s ${openMenuId === p.id ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === p.id ? null : p.id); }}
                    >
                      <MoreVertical size={15} />
                    </button>

                    {openMenuId === p.id && (
                      <div className="mini-dropdown fade-in">
                        <button onClick={() => navigate(`/editor/${p.id}?templateId=${p.template_id || 0}`)}>
                          <FileEdit size={14} /> Edit
                        </button>
                        <button onClick={() => handleDuplicate(p.id)}>
                          <Copy size={14} /> Duplicate
                        </button>
                        <button onClick={() => handleArchive(p.id)}>
                          <Archive size={14} /> {p.status === 'archived' ? 'Unarchive' : 'Archive'}
                        </button>
                        <div className="drop-divider" />
                        <button className="delete-opt" onClick={() => handleDelete(p.id)}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <button className="btn-play-s">
                  <Play size={12} fill="white" /> Start
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state-v2">
          <FileText size={50} color="#cbd5e1" />
          <h3>No Presentations Found</h3>
          <button
            className="btn-add-simple"
            style={{ marginTop: '20px' }}
            onClick={() => { setShowModal(true); setStep(1); }}
          >
            Create Your First Presentation
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop-v2" onClick={() => setShowModal(false)}>
          <div className="creation-modal-v2" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header-v2">
              <h2>
                {step === 1 ? 'Start New Project'
                  : step === 'import' ? 'Import PowerPoint'
                    : 'Name your project'}
              </h2>
              <button className="modal-close-v2" onClick={() => setShowModal(false)}><X size={20} /></button>
            </header>


            {step === 1 ? (
              <div className="modal-options-v2 fade-in">
                <div className="modal-opt-card" onClick={() => { setSelectedTemplate(null); setStep(2); }}>
                  <div className="opt-icon-wrap amber"><Plus size={30} /></div>
                  <h3>Blank Canvas</h3>
                  <p>Design from scratch</p>
                </div>
                <div className="modal-opt-card" onClick={() => navigate('/dashboard/templates')}>
                  <div className="opt-icon-wrap indigo"><LayoutGrid size={30} /></div>
                  <h3>Use Template</h3>
                  <p>Pick from SADA gallery</p>
                </div>
                <div className="modal-opt-card" onClick={() => setStep('import')}>
                  <div className="opt-icon-wrap" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                    <Upload size={30} />
                  </div>
                  <h3>Import PowerPoint</h3>
                  <p>Upload .pptx file</p>
                </div>
              </div>

            ) : step === 'import' ? (
              <div className="title-input-step fade-in">
                <input
                  type="file"
                  accept=".pptx"
                  onChange={handlePptxUpload}
                  id="pptx-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="pptx-upload" style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 12, padding: 32, border: '2px dashed #e2e8f0',
                  borderRadius: 12, cursor: 'pointer'
                }}>
                  <Upload size={40} color="#16a34a" />
                  <span style={{ color: '#64748b', fontSize: 14 }}>Click to choose .pptx file</span>
                </label>
                {uploading && (
                  <div style={{ textAlign: 'center', color: '#64748b', marginTop: 12 }}>
                    <Loader2 className="spinner-icon" size={18} /> Converting...
                  </div>
                )}
                {errorMsg && (
                  <div className="modal-error"><AlertCircle size={14} /> {errorMsg}</div>
                )}
                <div className="modal-footer-btns">
                  <button className="btn-back-modal" onClick={() => setStep(1)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                </div>
              </div>

            ) : (
              <div className="title-input-step fade-in">
                <input
                  type="text"
                  autoFocus
                  placeholder="Project Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && executeCreate()}
                  className="modal-title-input"
                />
                {errorMsg && (
                  <div className="modal-error"><AlertCircle size={14} /> {errorMsg}</div>
                )}
                <div className="modal-footer-btns">
                  <button className="btn-back-modal" onClick={() => setStep(1)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  <button className="btn-confirm-create" onClick={executeCreate} disabled={creating}>
                    {creating ? (
                      <><Loader2 className="spinner-icon" size={16} /> Creating...</>
                    ) : (
                      <>Create
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
                          <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Presentations;
