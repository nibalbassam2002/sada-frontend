// src/components/Editor/SlideSidebar.jsx
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useEditor } from './EditorContext';

const SlideSidebar = () => {
  const { 
    slides, 
    activeSlideId, 
    setActiveSlideId, 
    addNewSlide, 
    deleteSlide, 
    hideSlide 
  } = useEditor();

  return (
    <aside className="slides-list-sidebar">
      <div className="sidebar-label">SLIDES</div>
      <div className="slides-container">
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`slide-item ${activeSlideId === slide.id ? 'active' : ''} ${hideSlide[slide.id] ? 'hidden-slide' : ''}`} 
            onClick={() => setActiveSlideId(slide.id)}
          >
            <span className="slide-num">{index + 1}</span>
            <div className="slide-preview-box">
              <div className="mini-content-preview">
                <div className="mini-line"></div>
                <div className="mini-line short"></div>
              </div>
            </div>
            <button className="btn-delete-slide" onClick={(e) => deleteSlide(e, slide.id)}>
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        
        <button className="btn-add-slide-ghost" onClick={() => addNewSlide()}>
          <Plus size={16} /> Add Slide
        </button>
      </div>
    </aside>
  );
};

export default SlideSidebar;