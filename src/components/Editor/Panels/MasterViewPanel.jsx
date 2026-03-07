// src/components/Editor/Panels/MasterViewPanel.js
import React from 'react';

const MasterViewPanel = ({ type, onClose }) => {
  const getTitle = () => {
    switch(type) {
      case 'slide': return 'Slide Master';
      case 'handout': return 'Handout Master';
      case 'notes': return 'Notes Master';
      default: return 'Master View';
    }
  };

  return (
    <div className="master-view-overlay">
      <div className="master-view-panel">
        <div className="master-view-header">
          <h3>{getTitle()}</h3>
          <button className="close-master" onClick={onClose}>×</button>
        </div>
        <div className="master-view-content">
          <div className="master-preview-area">
            <div className="master-slide-mini"></div>
          </div>
          <div className="master-properties">
            <h4>Master Properties</h4>
            <p>Edit master styles here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterViewPanel;