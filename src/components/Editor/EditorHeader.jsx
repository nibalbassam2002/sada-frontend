// src/components/Editor/EditorHeader.jsx
import React from 'react';
import {
  ChevronLeft, Save, Copy, Eye, Share2, Download,
  Search, MoreVertical, Play, CheckCircle2, AlertCircle, RotateCw
} from 'lucide-react';
import { useEditor } from './EditorContext';

const EditorHeader = () => {
  // جلب جميع الحالات والدوال من الـ Context
  const {
    title,
    setTitle,
    handleCopy,
    startPresentation,
    savePresentation,
    isDirty,
    isSaving
  } = useEditor();


  return (
    <nav className="top-nav-bar">
      <div className="nav-left">
        <button className="btn-back">
          <ChevronLeft size={22} />
        </button>
        <div className="title-status-wrapper">
          <input
            className="inline-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {/* عرض حالة الحفظ بشكل ديناميكي */}
          <div className="save-status">
            {isSaving ? (
              <>
                <RotateCw size={12} className="spinning" />
                <span>Saving...</span>
              </>
            ) : isDirty ? (
              <>
                <AlertCircle size={12} color="#f59e0b" />
                <span style={{ color: '#f59e0b' }}>Unsaved changes</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={12} color="#10b981" />
                <span style={{ color: '#10b981' }}>Changes saved</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="nav-right">
        {/* زر الحفظ اليدوي مع حالة التفعيل */}
        <button
          className={`action-btn ${isDirty ? 'active-save' : ''}`}
          onClick={savePresentation}
          disabled={isSaving}
        >
          <Save size={18} />
        </button>

        <button
          className="action-btn"
          onClick={handleCopy}
        >
          <Copy size={18} />
        </button>

        <div className="v-divider"></div>

        <button className="action-btn">
          <Eye size={18} />
        </button>

        <button className="action-btn">
          <Share2 size={18} />
        </button>

        <button className="action-btn">
          <Download size={18} />
        </button>

        <div className="v-divider"></div>

        <button className="more-btn">
          <Search size={18} />
        </button>

        <button className="more-btn">
          <MoreVertical size={20} />
        </button>

      
        <button
          className="action-btn btn-present"
          onClick={startPresentation} // عند الضغط سيتم تغيير isPresenting لـ true
        >
          <Play size={18} fill="currentColor" />
          <span>Present</span>
        </button>
      </div>
    </nav>
  );
};

export default EditorHeader;