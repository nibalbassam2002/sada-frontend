// src/components/Editor/Modals/SizeModal.js
import React from 'react';
import { useEditor } from '../EditorContext';

const SizeModal = ({ onClose }) => {
  const {
    slideSize,
    handleSlideSizeChange,
    slideWidth,
    slideHeight,
    setSlideWidth,
    setSlideHeight,
    applyCustomSize
  } = useEditor();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Slide Size</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="size-presets">
            <button 
              className={`preset-btn ${slideSize === 'standard' ? 'active' : ''}`} 
              onClick={() => handleSlideSizeChange('standard')}
            >
              Standard (4:3)
            </button>
            <button 
              className={`preset-btn ${slideSize === 'widescreen' ? 'active' : ''}`} 
              onClick={() => handleSlideSizeChange('widescreen')}
            >
              Widescreen (16:9)
            </button>
          </div>
          
          <div className="custom-size-inputs">
            <div className="input-group">
              <label>Width (px):</label>
              <input
                type="number"
                value={slideWidth}
                onChange={(e) => setSlideWidth(parseInt(e.target.value) || 800)}
                min="800"
                max="1920"
              />
            </div>
            <div className="input-group">
              <label>Height (px):</label>
              <input
                type="number"
                value={slideHeight}
                onChange={(e) => setSlideHeight(parseInt(e.target.value) || 600)}
                min="600"
                max="1080"
              />
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="apply-btn" onClick={() => { applyCustomSize(); onClose(); }}>Apply</button>
        </div>
      </div>
    </div>
  );
};

export default SizeModal;