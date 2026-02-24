import React, { useState, useEffect } from 'react';
import api from '../api/axios'; 
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Play, Copy, Archive, Trash2, Eye, Clock, 
  BarChart3, Monitor, LayoutGrid, Users, FileText, Loader2, X, AlertCircle
} from 'lucide-react';
import '../styles/Presentations.css';

const Presentations = () => {
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [newTitle, setNewTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchPresentations();
  }, []);

  const fetchPresentations = async () => {
    try {
      const response = await api.get('/presentations');
      setPresentations(response.data.data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const executeCreateBlank = async () => {
    if (!newTitle.trim()) { setErrorMsg('Please enter a project name'); return; }
    try {
      setCreating(true);
      const response = await api.post('/presentations', { title: newTitle, template_id: null });
      navigate(`/editor/${response.data.data.id}`); 
    } catch (error) {
      setErrorMsg('Failed to create project. Check your connection.');
      setCreating(false);
    }
  };

  const filteredPresentations = presentations.filter(p => 
    activeFilter === 'All' ? true : p.status === activeFilter.toLowerCase()
  );

  if (loading) return (
    <div className="loading-container-full">
      <Loader2 className="spinner-icon" size={40} />
      <p>Loading your workspace...</p>
    </div>
  );

  return (
    <div className="pres-v2-container fade-in">
      <header className="pres-v2-header">
        <div className="header-text">
          <h1 className="main-title">My Presentations <span className="count-badge">{presentations.length}</span></h1>
        </div>
        <button className="create-new-btn" onClick={() => setShowModal(true)}><Plus size={20} /> <span>New Presentation</span></button>
      </header>

      <div className="pres-v2-controls">
        <div className="filter-pills">
          {['All', 'Live', 'Draft', 'Archived'].map(f => (
            <button key={f} className={`pill ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {presentations.length > 0 ? (
        <div className="pres-v2-grid">
           {filteredPresentations.map((p) => (
               <div key={p.id} className={`pres-v2-card ${p.status.toLowerCase()}`}>
                    <div className="card-visual">
                        <div className="status-tag"><span className="dot"></span> {p.status}</div>
                        <div className="hover-actions">
                            <button className="action-circle" onClick={() => navigate(`/editor/${p.id}`)} title="Edit"><FileText size={18}/></button>
                        </div>
                    </div>
                    <div className="card-content">
                        <h4 className="p-title">{p.title}</h4>
                        <div className="p-stats-row">
                            <div className="stat"><LayoutGrid size={14}/> {p.slides_count} Slides</div>
                            <div className="stat"><Monitor size={14}/> {p.sessions_count} Sessions</div>
                        </div>
                    </div>
                    <div className="card-actions-area">
                        <button className="start-session-btn"><Play size={16} fill="white"/> Start Session</button>
                    </div>
               </div>
           ))}
        </div>
      ) : (
        <div className="empty-state-v2">
          <div className="empty-illustration"><FileText size={50} /></div>
          <h3>No Presentations Found</h3>
          <button className="btn-create-first" onClick={() => setShowModal(true)}>Create Your First Project</button>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop-v2" onClick={() => setShowModal(false)}>
          <div className="creation-modal-v2" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header-v2">
              <h2>{step === 1 ? 'Start New Project' : 'Name your project'}</h2>
              <button className="modal-close-v2" onClick={() => setShowModal(false)}><X size={20}/></button>
            </header>
            
            {step === 1 ? (
              <div className="modal-options-v2 fade-in">
                <div className="modal-opt-card" onClick={() => setStep(2)}>
                  <div className="opt-icon-wrap amber"><Plus size={30}/></div>
                  <h3>Blank Canvas</h3>
                  <p>Design from scratch</p>
                </div>
                <div className="modal-opt-card" onClick={() => navigate('/dashboard/templates')}>
                  <div className="opt-icon-wrap indigo"><LayoutGrid size={30}/></div>
                  <h3>Use Template</h3>
                  <p>Choose from SADA gallery</p>
                </div>
              </div>
            ) : (
              <div className="title-input-step fade-in">
                <input type="text" autoFocus placeholder="Project Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="modal-title-input" />
                {errorMsg && <div className="modal-error"><AlertCircle size={14}/> {errorMsg}</div>}
                <div className="modal-footer-btns">
                    <button className="btn-cancel-modal" onClick={() => setStep(1)}>Back</button>
                    <button className="btn-confirm-create" onClick={executeCreateBlank} disabled={creating}>
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