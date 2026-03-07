// src/components/Editor/Panels/OutlinePanel.js
import React from 'react';
import { List } from 'lucide-react';
import { useEditor } from '../EditorContext';

const OutlinePanel = () => {
  const { slides, activeSlideId, setActiveSlideId } = useEditor();

  return (
    <div className="outline-panel">
      <div className="outline-header">
        <List size={16} color="#f59e0b" />
        <span>Outline</span>
      </div>
      <div className="outline-content">
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`outline-item ${activeSlideId === slide.id ? 'active' : ''}`} 
            onClick={() => setActiveSlideId(slide.id)}
          >
            <div className="outline-number">{index + 1}</div>
            <div className="outline-text">
              {slide.title || 'Untitled Slide'}
              {slide.subtitle && <small>{slide.subtitle}</small>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutlinePanel;