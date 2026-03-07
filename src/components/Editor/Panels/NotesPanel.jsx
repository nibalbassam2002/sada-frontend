// src/components/Editor/Panels/NotesPanel.js
import React from 'react';
import { StickyNote } from 'lucide-react';

const NotesPanel = ({ onClose }) => {
  return (
    <div className="notes-panel">
      <div className="notes-header">
        <StickyNote size={16} color="#f59e0b" />
        <span>Speaker Notes</span>
        <button className="close-notes" onClick={onClose}>×</button>
      </div>
      <div className="notes-content">
        <textarea 
          placeholder="Click to add speaker notes for this slide..." 
          defaultValue="" 
          rows={4} 
        />
      </div>
    </div>
  );
};

export default NotesPanel;