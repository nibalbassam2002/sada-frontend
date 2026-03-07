import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, MoreVertical, LayoutGrid, Users, Play,
  BarChart3, Share2, Filter, ChevronDown, Clock,
  Copy, Archive, Trash2, Eye, FileEdit, Loader2, X, AlertCircle, Monitor, FileText
} from 'lucide-react';
import ThemeManager from '../templates/ThemeManager';
import '../styles/Presentations.css';

const Presentations = () => {
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Modal states for creating new project
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [newTitle, setNewTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. جلب البيانات من الباك إند عند فتح الصفحة
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
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. وظيفة الحذف (Delete)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This will permanently delete the presentation.")) return;
    try {
      await api.delete(`/presentations/${id}`);
      fetchPresentations(); // تحديث القائمة
    } catch (error) { alert("Delete failed"); }
  };

  // 3. وظيفة الأرشفة (Archive)
  const handleArchive = async (id) => {
    try {
      await api.patch(`/presentations/${id}/archive`);
      fetchPresentations();
    } catch (error) { alert("Archive operation failed"); }
  };

  // 4. وظيفة النسخ (Duplicate)
  const handleDuplicate = async (id) => {
    try {
      await api.post(`/presentations/${id}/duplicate`);
      fetchPresentations();
    } catch (error) { alert("Duplicate failed"); }
  };

  // 5. وظيفة الإنشاء النهائية (Create)
  const executeCreate = async () => {
    if (!newTitle.trim()) { setErrorMsg('Title is required'); return; }
    try {
      setCreating(true);
      const response = await api.post('/presentations', {
        title: newTitle,
        template_id: selectedTemplate
      });
      // التوجه للمحرر فوراً بالـ ID الجديد
      navigate(`/editor/${response.data.data.id}?templateId=${selectedTemplate || 0}`);
    } catch (error) {
      setErrorMsg('Server error. Failed to create.');
      setCreating(false);
    }
  };

  const filteredPresentations = presentations.filter(p =>
    activeFilter === 'All' ? true : p.status === activeFilter.toLowerCase()
  );

  if (loading) return (
    <div className="loading-container-full">
      <Loader2 className="spinner-icon" size={40} />
      <p>Syncing Workspace...</p>
    </div>
  );
  return (
    <div className="sada-simple-container fade-in">
      <header className="sada-simple-header">
        <h1 className="simple-title">My Presentations <span>{presentations.length}</span></h1>
        <button className="btn-add-simple" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Presentation
        </button>
      </header>

      {/* شريط الفلترة والبحث */}
      <div className="sada-simple-toolbar">
        <div className="filter-n-sort">
          <div className="pills-v4">
            {['All', 'Live', 'Draft', 'Archived'].map(f => (
              <button key={f} className={`v4-pill ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
            ))}
          </div>
        </div>
        <div className={`search-v4 ${isSearchFocused ? 'expanded' : ''}`}>
          <Search size={16} />
          <input type="text" placeholder="Search..." onFocus={() => setIsSearchFocused(true)} onBlur={(e) => !e.target.value && setIsSearchFocused(false)} />
        </div>
      </div>

      {presentations.length > 0 ? (
        <div className="sada-simple-grid">
          {filteredPresentations.map((p) => (
            <div key={p.id} className="p-mini-card">
              <div
                className="mini-preview-area"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/editor/${p.id}?templateId=${p.template_id || 0}`)}
              >
                <div className="mini-render-engine">
                  <ThemeManager themeId={parseInt(p.template_id) || 0} slideType="intro" data={{ title: '' }} />
                </div>
                <div className={`mini-status ${p.status.toLowerCase()}`}>{p.status}</div>
              </div>
              

              <div className="mini-card-info">
                <h4 className="mini-title-text">{p.title}</h4>

                {/* سطر الإحصائيات الرئيسي */}
                <div className="mini-stats-grid">
                  <div className="stat-pill"><LayoutGrid size={12} /> {p.slides_count} Slides</div>
                  <div className="stat-pill"><Monitor size={12} /> {p.sessions_count || 0} Sessions</div>
                  <div className="stat-pill"><Users size={12} /> {p.total_participants || 0} Users</div>
                </div>

                {/* سطر التاريخ تحتهم بلون هادئ */}
                <div className="mini-date-row">
                  <Clock size={11} /> <span>Created: {p.created_at}</span>
                </div>
              </div>

              <div className="mini-card-footer">
                <div className="mini-actions-group">
                  <button className="btn-icon-s"><BarChart3 size={15} /></button>
                  <button className="btn-icon-s"><Share2 size={15} /></button>

                  <div className="more-menu-wrapper">
                    <button className={`btn-icon-s ${openMenuId === p.id ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setOpenMenuId(p.id); }}>
                      <MoreVertical size={15} />
                    </button>

                    {openMenuId === p.id && (
                      <div className="mini-dropdown fade-in">
                        <button onClick={() => navigate(`/editor/${p.id}?templateId=${p.template_id || 0}`)}><FileEdit size={14} /> Edit</button>
                        <button onClick={() => handleDuplicate(p.id)}><Copy size={14} /> Duplicate</button>
                        <button onClick={() => handleArchive(p.id)}><Archive size={14} /> {p.status === 'archived' ? 'Unarchive' : 'Archive'}</button>
                        <div className="drop-divider"></div>
                        <button className="delete-opt" onClick={() => handleDelete(p.id)}><Trash2 size={14} /> Delete</button>
                      </div>
                    )}
                  </div>
                </div>
                <button className="btn-play-s"><Play size={12} fill="white" /> Start</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state-v2">
          <FileText size={50} color="#cbd5e1" />
          <h3>No Presentations Found</h3>
          <button className="btn-add-simple" style={{ marginTop: '20px' }} onClick={() => setShowModal(true)}>Create Your First Presentation</button>
        </div>
      )}

      {/* المودال المطور لإدخال الاسم واختيار النوع */}
      {showModal && (
        <div className="modal-backdrop-v2" onClick={() => setShowModal(false)}>
          <div className="creation-modal-v2" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header-v2">
              <h2>{step === 1 ? 'Start New Project' : 'Name your project'}</h2>
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
              </div>
            ) : (
              <div className="title-input-step fade-in">
                <input type="text" autoFocus placeholder="Project Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="modal-title-input" />
                {errorMsg && <div className="modal-error"><AlertCircle size={14} /> {errorMsg}</div>}
                <div className="modal-footer-btns">
                  <button className="btn-cancel-modal" onClick={() => setStep(1)}>Back</button>
                  <button className="btn-confirm-create" onClick={executeCreate} disabled={creating}>
                    {creating ? <Loader2 className="spinner-icon" size={18} /> : 'Create'}
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