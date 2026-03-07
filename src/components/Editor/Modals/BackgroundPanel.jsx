// src/components/Editor/Modals/BackgroundPanel.js
import React from 'react';
import { useEditor } from '../EditorContext';

const BackgroundPanel = ({ onClose }) => {
  const {
    backgroundType,
    setBackgroundType,
    backgroundColor,
    setBackgroundColor,
    gradientStart,
    setGradientStart,
    gradientEnd,
    setGradientEnd,
    gradientAngle,
    setGradientAngle,
    backgroundImage,
    setBackgroundImage,
    backgroundTransparency,
    setBackgroundTransparency,
    handleImageUpload,
    applyBackground,
    resetBackground
  } = useEditor();

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel-content right" onClick={e => e.stopPropagation()}>
        <div className="panel-header">
          <h3>Format Background</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="panel-body">
          <div className="background-type-tabs">
            <button
              className={`tab-btn ${backgroundType === 'solid' ? 'active' : ''}`}
              onClick={() => setBackgroundType('solid')}
            >
              Solid
            </button>
            <button
              className={`tab-btn ${backgroundType === 'gradient' ? 'active' : ''}`}
              onClick={() => setBackgroundType('gradient')}
            >
              Gradient
            </button>
            <button
              className={`tab-btn ${backgroundType === 'image' ? 'active' : ''}`}
              onClick={() => setBackgroundType('image')}
            >
              Image
            </button>
          </div>

          {backgroundType === 'solid' && (
            <div className="color-picker-section">
              <label>Color</label>
              <div className="color-input-row">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>
          )}

          {backgroundType === 'gradient' && (
            <div className="gradient-section">
              <div className="color-input-row">
                <label>Start:</label>
                <input
                  type="color"
                  value={gradientStart}
                  onChange={(e) => setGradientStart(e.target.value)}
                />
              </div>
              <div className="color-input-row">
                <label>End:</label>
                <input
                  type="color"
                  value={gradientEnd}
                  onChange={(e) => setGradientEnd(e.target.value)}
                />
              </div>
              <div className="angle-control">
                <label>Angle: {gradientAngle}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={gradientAngle}
                  onChange={(e) => setGradientAngle(parseInt(e.target.value))}
                />
              </div>
            </div>
          )}

          {backgroundType === 'image' && (
            <div className="image-section">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="background-image-upload"
                style={{ display: 'none' }}
              />
              <button
                className="upload-btn"
                onClick={() => document.getElementById('background-image-upload').click()}
              >
                Choose Image
              </button>
              {backgroundImage && (
                <div className="image-preview">
                  <img src={backgroundImage} alt="preview" />
                  <button className="remove-img" onClick={() => setBackgroundImage(null)}>×</button>
                </div>
              )}
            </div>
          )}

          <div className="transparency-control">
            <label>Transparency: {backgroundTransparency}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={backgroundTransparency}
              onChange={(e) => setBackgroundTransparency(parseInt(e.target.value))}
            />
          </div>
        </div>
        
        <div className="panel-footer">
          <button className="reset-btn" onClick={resetBackground}>Reset</button>
          <button className="apply-btn" onClick={applyBackground}>Apply</button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundPanel;