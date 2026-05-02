import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft, Save, Copy, Eye, Share2, Download,
  Search, MoreVertical, Play, CheckCircle2, AlertCircle,
  RotateCw, X, Printer, FileJson, Link2, Check,
  Trash2, Settings, HelpCircle
} from 'lucide-react';
import { useEditor } from './EditorContext';
import { useNavigate } from 'react-router-dom';

const EditorHeader = () => {
  const {
    title, setTitle, handleCopy, startPresentation,
    savePresentation, isDirty, isSaving, slides, presentationId
  } = useEditor();

  const navigate = useNavigate();

  const [showSearch,    setShowSearch]    = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [showMoreMenu,  setShowMoreMenu]  = useState(false);
  const [shareCopied,   setShareCopied]   = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const moreMenuRef  = useRef(null);
  const searchRef    = useRef(null);

  // إغلاق الـ dropdown لما يضغط برا
  useEffect(() => {
    const handler = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // focus على search input لما يفتح
  useEffect(() => {
    if (showSearch) searchRef.current?.focus();
  }, [showSearch]);

  // البحث في الـ slides
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    const results = (slides || []).filter((s, i) => {
      const content = typeof s.content === 'string'
        ? JSON.parse(s.content || '{}')
        : (s.content || {});
      const text = [
        content.title, content.subtitle, content.content, s.type
      ].filter(Boolean).join(' ').toLowerCase();
      return text.includes(q);
    }).map((s, i) => ({ ...s, slideIndex: (slides || []).indexOf(s) }));
    setSearchResults(results);
  }, [searchQuery, slides]);

  // Eye: Preview في tab جديد
  const handlePreview = () => {
    window.open(`/preview/${presentationId}`, '_blank');
  };

  // Share: كوبي الرابط
  const handleShare = async () => {
    const url = `${window.location.origin}/join`;
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      prompt('Copy this link:', url);
    }
  };

  // Download: طباعة أو export
  const handleDownloadJSON = () => {
    const data = JSON.stringify({ title, slides }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${title || 'presentation'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowMoreMenu(false);
  };

  const handlePrint = () => {
    window.print();
    setShowMoreMenu(false);
  };

  return (
    <>
      <nav className="top-nav-bar">
        <div className="nav-left">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            <ChevronLeft size={22} />
          </button>
          <div className="title-status-wrapper">
            <input
              className="inline-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="save-status">
              {isSaving ? (
                <><RotateCw size={12} className="spinning" /><span>Saving...</span></>
              ) : isDirty ? (
                <><AlertCircle size={12} color="#f59e0b" /><span style={{ color:'#f59e0b' }}>Unsaved changes</span></>
              ) : (
                <><CheckCircle2 size={12} color="#10b981" /><span style={{ color:'#10b981' }}>Changes saved</span></>
              )}
            </div>
          </div>
        </div>

        <div className="nav-right">
          {/* Save */}
          <button
            className={`action-btn ${isDirty ? 'active-save' : ''}`}
            onClick={savePresentation}
            disabled={isSaving}
            title="Save (Ctrl+S)"
          >
            <Save size={18} />
          </button>

          {/* Duplicate */}
          <button className="action-btn" onClick={handleCopy} title="Duplicate">
            <Copy size={18} />
          </button>

          <div className="v-divider" />

          {/* Preview */}
          <button className="action-btn" onClick={handlePreview} title="Preview">
            <Eye size={18} />
          </button>

          {/* Share */}
          <button className="action-btn" onClick={handleShare} title="Share">
            {shareCopied ? <Check size={18} color="#10b981" /> : <Share2 size={18} />}
          </button>

          {/* Download */}
          <button className="action-btn" onClick={handleDownloadJSON} title="Download JSON">
            <Download size={18} />
          </button>

          <div className="v-divider" />

          {/* Search */}
          <button
            className={`more-btn ${showSearch ? 'active' : ''}`}
            onClick={() => { setShowSearch(v => !v); setSearchQuery(''); setSearchResults([]); }}
            title="Search slides"
          >
            <Search size={18} />
          </button>

          {/* More */}
          <div style={{ position:'relative' }} ref={moreMenuRef}>
            <button
              className="more-btn"
              onClick={() => setShowMoreMenu(v => !v)}
              title="More options"
            >
              <MoreVertical size={20} />
            </button>

            {showMoreMenu && (
              <div style={{
                position:'absolute', top:'calc(100% + 8px)', right:0,
                background:'#fff', borderRadius:12, boxShadow:'0 8px 32px rgba(0,0,0,.14)',
                border:'1px solid #e2e8f0', minWidth:190, zIndex:999,
                overflow:'hidden',
              }}>
                {[
                  { icon:<Printer size={15}/>,  label:'Print',         action: handlePrint },
                  { icon:<FileJson size={15}/>, label:'Export JSON',   action: handleDownloadJSON },
                  { icon:<Trash2 size={15} color="#ef4444"/>, label:'Delete Presentation', action:() => {}, danger:true },
                ].map((item, i) => (
                  <button key={i} onClick={item.action} style={{
                    width:'100%', display:'flex', alignItems:'center', gap:10,
                    padding:'10px 16px', background:'none', border:'none',
                    cursor:'pointer', fontSize:13, fontWeight:600,
                    color: item.danger ? '#ef4444' : '#374151',
                    borderTop: i > 0 ? '1px solid #f1f5f9' : 'none',
                    fontFamily:'inherit',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = item.danger ? '#fef2f2' : '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Present */}
          <button className="action-btn btn-present" onClick={startPresentation}>
            <Play size={18} fill="currentColor" />
            <span>Present</span>
          </button>
        </div>
      </nav>

      {/* Search Bar */}
      {showSearch && (
        <div style={{
          position:'fixed', top:56, left:0, right:0, zIndex:998,
          background:'#fff', borderBottom:'1px solid #e2e8f0',
          padding:'10px 20px', boxShadow:'0 4px 16px rgba(0,0,0,.08)',
        }}>
          <div style={{ maxWidth:600, margin:'0 auto', display:'flex', flexDirection:'column', gap:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <Search size={16} color="#94a3b8" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search in slides..."
                style={{
                  flex:1, border:'none', outline:'none', fontSize:14,
                  color:'#1e293b', background:'transparent', fontFamily:'inherit',
                }}
              />
              <button onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }}
                style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display:'flex' }}>
                <X size={18} />
              </button>
            </div>

            {searchResults.length > 0 && (
              <div style={{ display:'flex', flexDirection:'column', gap:4, maxHeight:200, overflowY:'auto' }}>
                {searchResults.map((s, i) => {
                  const content = typeof s.content === 'string'
                    ? JSON.parse(s.content || '{}') : (s.content || {});
                  return (
                    <button key={i} onClick={() => { /* navigate to slide */ setShowSearch(false); }}
                      style={{
                        display:'flex', alignItems:'center', gap:10, padding:'8px 12px',
                        borderRadius:8, background:'#f8fafc', border:'none', cursor:'pointer',
                        textAlign:'left', fontFamily:'inherit',
                      }}>
                      <span style={{ fontSize:11, fontWeight:700, color:'#94a3b8', minWidth:20 }}>
                        {s.slideIndex + 1}
                      </span>
                      <span style={{ fontSize:13, color:'#1e293b', fontWeight:600 }}>
                        {content.title || s.type || `Slide ${s.slideIndex + 1}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {searchQuery && searchResults.length === 0 && (
              <p style={{ fontSize:12, color:'#94a3b8', textAlign:'center', padding:'4px 0' }}>
                No slides found
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EditorHeader;