// src/components/Editor/groups/ReviewGroup.jsx
import React from 'react';
import { useEditor } from '../EditorContext';
import {
  CheckCircle, BookOpen, Accessibility, Search, Sparkles,
  Languages, Globe, MessageSquarePlus, MessageSquare, ChevronLeft,
  ChevronRight, Trash2, Lock, CheckSquare, Users, ChevronDown
} from 'lucide-react';

const ReviewGroup = () => {
  const {
    handleSpellingCheck,
    handleThesaurus,
    handleAccessibilityCheck,
    checkingSpelling,
    spellingErrors,
    handleSmartLookup,
    handleTranslate,
    handleLanguagePreference,
    targetLanguage,
    getLanguageName,
    comments,
    handleNewComment,
    setShowComments,
    showComments,
    navigateComments,
    handleDeleteAllComments,
    isProtected,
    isMarkedFinal,
    handleProtectPresentation,
    handleMarkAsFinal,
    handleRestrictAccess
  } = useEditor();

  // ===== دالة Proofing =====
  const renderProofing = () => {
    const hasErrors = spellingErrors.length > 0;
    
    return (
      <div className="ribbon-group" key="proofing">
        <div className="group-content-col">
          <div className="tool-row" style={{ gap: '2px', marginBottom: '4px' }}>
            <button
              className={`btn-proofing-mega ${checkingSpelling ? 'checking' : ''}`}
              onClick={handleSpellingCheck}
              disabled={checkingSpelling}
            >
              <div className="proofing-icon-wrapper">
                <CheckCircle size={24} color={hasErrors ? "#ef4444" : "#059669"} />
                {checkingSpelling && <div className="spinner-small" />}
              </div>
              <div className="proofing-text">
                <span className="main-text">Spelling</span>
                <span className="sub-text">
                  {checkingSpelling ? 'Checking...' :
                    hasErrors ? `${spellingErrors.length} errors` : 'No errors'}
                </span>
              </div>
            </button>

            <div className="mini-tools-stack" style={{ marginLeft: '4px' }}>
              <button className="btn-mini-wide" onClick={handleThesaurus}>
                <BookOpen size={14} color="#2563eb" /> Thesaurus
              </button>
              <button className="btn-mini-wide" onClick={handleAccessibilityCheck}>
                <Accessibility size={14} color="#8b5cf6" /> Check Accessibility
              </button>
            </div>
          </div>

          {checkingSpelling && (
            <div className="spelling-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
              <span className="progress-text">Checking spelling...</span>
            </div>
          )}
        </div>
        <div className="group-label">Proofing</div>
      </div>
    );
  };

  // ===== دالة Insights =====
  const renderInsights = () => (
    <div className="ribbon-group" key="insights">
      <div className="group-content-flex">
        <button className="btn-insights" onClick={handleSmartLookup}>
          <div className="insights-icon">
            <Search size={24} color="#6366f1" />
            <Sparkles size={12} color="#f59e0b" className="sparkle-icon" />
          </div>
          <div className="insights-text">
            <span className="main-text">Smart Lookup</span>
            <span className="sub-text">Research & citations</span>
          </div>
        </button>
      </div>
      <div className="group-label">Insights</div>
    </div>
  );

  // ===== دالة Language =====
  const renderLanguage = () => (
    <div className="ribbon-group" key="language">
      <div className="group-content-col">
        <button className="btn-language-main" onClick={handleTranslate}>
          <Languages size={18} color="#2563eb" />
          <div className="language-text">
            <span className="main-text">Translate</span>
            <span className="sub-text">To {getLanguageName?.(targetLanguage) || 'Arabic'}</span>
          </div>
          <ChevronDown size={12} className="dropdown-arrow" />
        </button>

        <button className="btn-mini-wide" onClick={handleLanguagePreference}>
          <Globe size={14} color="#64748b" /> Language Preferences
        </button>

        <div className="current-language-badge">
          <span className="badge-text">English (United States)</span>
        </div>
      </div>
      <div className="group-label">Language</div>
    </div>
  );

  // ===== دالة Comments =====
  const renderComments = () => {
    const unreadCount = comments.filter(c => !c.read).length;

    return (
      <div className="ribbon-group" key="comments">
        <div className="group-content-col">
          <div className="tool-row" style={{ gap: '4px', marginBottom: '4px' }}>
            <button
              className={`btn-new-comment ${showComments ? 'active' : ''}`}
              onClick={handleNewComment}
            >
              <MessageSquarePlus size={18} color="#f59e0b" />
              <span>New Comment</span>
            </button>

            {unreadCount > 0 && (
              <div className="comment-badge">
                {unreadCount}
              </div>
            )}
          </div>

          <div className="tool-row" style={{ gap: '2px' }}>
            <button className="btn-icon-s" onClick={navigateComments?.('prev')} title="Previous Comment">
              <ChevronLeft size={14} />
            </button>
            <button className="btn-icon-s" onClick={navigateComments?.('next')} title="Next Comment">
              <ChevronRight size={14} />
            </button>
            <button className="btn-icon-s" onClick={() => setShowComments?.(!showComments)} title="Show Comments">
              <MessageSquare size={14} />
            </button>
            <button className="btn-icon-s danger" onClick={handleDeleteAllComments} title="Delete All Comments">
              <Trash2 size={14} color="#ef4444" />
            </button>
          </div>

          {comments.length > 0 && (
            <div className="comments-summary">
              <span>{comments.length} comment{comments.length > 1 ? 's' : ''}</span>
              {unreadCount > 0 && <span className="unread-badge">{unreadCount} unread</span>}
            </div>
          )}
        </div>
        <div className="group-label">Comments</div>
      </div>
    );
  };

  // ===== دالة Protect =====
  const renderProtect = () => (
    <div className="ribbon-group" key="protect">
      <div className="group-content-col">
        <button
          className={`btn-protect ${isProtected ? 'active' : ''}`}
          onClick={handleProtectPresentation}
        >
          <Lock size={16} color={isProtected ? "#f59e0b" : "#475569"} />
          <span>{isProtected ? 'Protected' : 'Protect Presentation'}</span>
          {isProtected && <CheckCircle size={12} color="#10b981" className="check-icon" />}
        </button>

        <button
          className={`btn-mark-final ${isMarkedFinal ? 'active' : ''}`}
          onClick={handleMarkAsFinal}
        >
          <CheckSquare size={16} color={isMarkedFinal ? "#f59e0b" : "#475569"} />
          <span>{isMarkedFinal ? 'Marked as Final' : 'Mark as Final'}</span>
        </button>

        <button className="btn-mini-wide" onClick={handleRestrictAccess}>
          <Users size={14} color="#64748b" /> Restrict Access
        </button>

        {isMarkedFinal && (
          <div className="final-badge">
            <CheckCircle size={10} color="#10b981" />
            <span>Final version</span>
          </div>
        )}
      </div>
      <div className="group-label">Protect</div>
    </div>
  );

  return (
    <>
      {renderProofing()}
      <div className="v-divider-slim"></div>
      {renderInsights()}
      <div className="v-divider-slim"></div>
      {renderLanguage()}
      <div className="v-divider-slim"></div>
      {renderComments()}
      <div className="v-divider-slim"></div>
      {renderProtect()}
    </>
  );
};

export default ReviewGroup;