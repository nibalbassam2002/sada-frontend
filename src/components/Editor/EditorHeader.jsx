// src/components/Editor/EditorHeader.jsx
import React from 'react';
import { 
  ChevronLeft, Save, Copy, Eye, Share2, Download, 
  Search, MoreVertical, Play, CheckCircle2 
} from 'lucide-react';
import { useEditor } from './EditorContext';

const EditorHeader = () => {
  const { title, setTitle, handleCopy, startPresentation } = useEditor();

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
          <div className="save-status">
            <CheckCircle2 size={12} />
            <span>Changes saved</span>
          </div>
        </div>
      </div>
      
      <div className="nav-right">
        <button className="action-btn"><Save size={18} /></button>
        <button className="action-btn" onClick={handleCopy}><Copy size={18} /></button>
        <div className="v-divider"></div>
        <button className="action-btn"><Eye size={18} /></button>
        <button className="action-btn"><Share2 size={18} /></button>
        <button className="action-btn"><Download size={18} /></button>
        <div className="v-divider"></div>
        <button className="more-btn"><Search size={18} /></button>
        <button className="more-btn"><MoreVertical size={20} /></button>
        <button 
          className="action-btn btn-present" 
          onClick={() => startPresentation(true)}
        >
          <Play size={18} fill="currentColor" />
          <span>Present</span>
        </button>
      </div>
    </nav>
  );
};

export default EditorHeader;