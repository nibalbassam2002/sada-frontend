import React, { useState } from 'react';
import api from '../api/axios';
import { Upload, Globe, User, Eye, X, Loader2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import { SYSTEM_TEMPLATES } from '../templates/templatesData';
import ThemeManager from '../templates/ThemeManager'; // استيراد الموزع لرسم المعاينة
import '../styles/Templates.css';

const Templates = () => {
  const navigate = useNavigate(); 
  
  // حالات المودال لتسمية المشروع
  const [showNamingModal, setShowNamingModal] = useState(false);
  const [selectedTemp, setSelectedTemp] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenNaming = (template) => {
    setSelectedTemp(template);
    setNewTitle('');
    setShowNamingModal(true);
  };

  const handleConfirmUse = async () => {
    if (!newTitle.trim()) { setErrorMsg('Please enter a title'); return; }
    try {
      setCreating(true);
      // 1. طلب إنشاء مشروع حقيقي في الباك إند
      const response = await api.post('/presentations', {
        title: newTitle,
        template_id: selectedTemp.id
      });
      // 2. التوجه للمحرر بالـ ID الجديد
      navigate(`/editor/${response.data.data.id}?templateId=${selectedTemp.id}`);
    } catch (error) {
      setErrorMsg('Failed to create project. Please try again.');
      setCreating(false);
    }
  };

  return (
    <div className="templates-modern-wrapper fade-in">
      <header className="templates-top-section">
        <div className="header-content">
          <h1 className="main-title">Template Library</h1>
          <p className="main-subtitle">Select a professional design to start your interactive session</p>
        </div>
      </header>

      {/* عرض القوالب بنظام المعاينة الحية (Live Preview) */}
      <div className="templates-visual-grid">
        {SYSTEM_TEMPLATES.map(t => (
          <div key={t.id} className="theme-preview-card">
            <div className="live-preview-container">
              
              {/* هنا "السحر": نقوم برسم القالب الحقيقي ولكن بحجم مصغر جداً */}
              <div className="mini-render-wrapper">
                 <ThemeManager themeId={t.id} data={{ title: t.title, subtitle: 'Preview Mode' }} />
              </div>

              <div className="hover-overlay">
                  <button className="btn-use-now" onClick={() => handleOpenNaming(t)}>
                    Use This Design <ArrowUpRight size={16} />
                  </button>
              </div>
            </div>
            <div className="theme-details">
              <h4 className="theme-title">{t.title}</h4>
              <span className="theme-cat">{t.cat}</span>
            </div>
          </div>
        ))}
      </div>

    {showNamingModal && (
  <div className="modal-backdrop-v2" onClick={() => setShowNamingModal(false)}>
    <div className="creation-modal-v2" onClick={(e) => e.stopPropagation()}>
      <header className="modal-header-v2">
        <h2>Create New Project</h2>
        <button className="modal-close-v2" onClick={() => setShowNamingModal(false)}>
          <X size={20}/>
        </button>
      </header>
      <div className="title-input-step">
        <p className="input-hint">
          Selected Design: <strong>{selectedTemp?.title}</strong>
        </p>
        <div className="input-wrapper">
          <input 
            type="text" 
            autoFocus 
            className="modal-title-input" 
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)} 
            placeholder="Enter your project name..."  // مجرد نص إرشادي يختفي عند الكتابة
          />
        </div>
        {errorMsg && (
          <div className="modal-error">
            <AlertCircle size={14}/> {errorMsg}
          </div>
        )}
        <div className="modal-footer-btns">
          <button 
            className="btn-confirm-create" 
            onClick={handleConfirmUse} 
            disabled={creating}
          >
            {creating ? (
              <>
                <Loader2 className="spinner-icon" size={18} />
                Creating...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                  <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                  <path d="M12 11v6" />
                  <path d="M9 14h6" />
                </svg>
                Create Presentation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Templates;