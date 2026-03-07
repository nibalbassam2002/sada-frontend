// src/components/Editor/Panels/AccessibilityPanel.js
import React from 'react';
import { Accessibility, XCircle, AlertTriangle, Info } from 'lucide-react';

const AccessibilityPanel = ({ issues, onClose, onFix }) => {
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error': return <XCircle size={16} color="#ef4444" />;
      case 'warning': return <AlertTriangle size={16} color="#f59e0b" />;
      default: return <Info size={16} color="#3b82f6" />;
    }
  };

  return (
    <div className="accessibility-panel">
      <div className="accessibility-header">
        <h4>Accessibility Checker</h4>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="accessibility-summary">
        <div className="summary-icon">
          <Accessibility size={24} color={issues.length === 0 ? "#10b981" : "#f59e0b"} />
        </div>
        <div className="summary-text">
          <span className="summary-count">
            {issues.length} issue{issues.length !== 1 ? 's' : ''} found
          </span>
          <span className="summary-desc">
            {issues.length === 0 ? 'Great job!' : 'Make your presentation accessible to everyone'}
          </span>
        </div>
      </div>

      {issues.length > 0 && (
        <div className="issues-list">
          {issues.map((issue, index) => (
            <div key={index} className={`issue-item severity-${issue.severity}`}>
              <div className="issue-icon">
                {getSeverityIcon(issue.severity)}
              </div>
              <div className="issue-content">
                <div className="issue-type">
                  {issue.type === 'contrast' && 'Color Contrast'}
                  {issue.type === 'alt-text' && 'Alternative Text'}
                  {issue.type === 'font-size' && 'Font Size'}
                </div>
                <div className="issue-description">
                  {issue.description}
                </div>
                <div className="issue-location">
                  Slide {issue.slide || 'current'}
                </div>
                <div className="issue-suggestion">
                  💡 {issue.suggestion}
                </div>
                <button className="fix-btn" onClick={() => onFix(issue)}>
                  Fix it
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccessibilityPanel;