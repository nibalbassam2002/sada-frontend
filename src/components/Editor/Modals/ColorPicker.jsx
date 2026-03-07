// src/components/Editor/Modals/ColorPicker.js
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Palette } from 'lucide-react';
import { useEditor } from '../EditorContext';
import { THEME_COLORS } from '../EditorConstants';

// ========== COLOR PICKER DROPDOWN ==========
export const ColorPickerDropdown = ({ onColorSelect, onClose, buttonRef }) => {
  const dropdownRef = React.useRef(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const { recentColors, setShowMoreColors } = useEditor();

  React.useEffect(() => {
    const handleClickOutside = (event) => { 
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) onClose(); 
    };
    
    if (buttonRef && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 260;
      let leftPos = rect.left - 100;
      if (leftPos + dropdownWidth > window.innerWidth) leftPos = window.innerWidth - dropdownWidth - 10;
      if (leftPos < 10) leftPos = 10;
      setPosition({ top: rect.bottom + 2, left: leftPos });
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, buttonRef]);

  if (!position.top) return null;

  return (
    <div 
      ref={dropdownRef} 
      className="color-picker-dropdown exact-match" 
      style={{ position: 'fixed', top: position.top, left: position.left, zIndex: 1000000 }} 
      onClick={e => e.stopPropagation()}
    >
      <div className="color-picker-section">
        <div className="color-picker-header">
          <span>Recently Used</span>
          <button className="color-picker-clear" onClick={() => onColorSelect('')}>Clear</button>
        </div>
        <div className="color-picker-grid">
          {recentColors.map((color, index) => (
            <button 
              key={index} 
              className="color-picker-swatch" 
              style={{ backgroundColor: color }} 
              onClick={() => onColorSelect(color)} 
              title={color} 
            />
          ))}
        </div>
      </div>
      
      <div className="color-picker-section">
        <div className="color-picker-header">Standard Colors</div>
        <div className="color-picker-grid standard">
          {THEME_COLORS.standard.map((color, index) => (
            <button 
              key={index} 
              className="color-picker-swatch standard" 
              style={{ backgroundColor: color }} 
              onClick={() => onColorSelect(color)} 
              title={color} 
            />
          ))}
        </div>
      </div>
      
      <div className="color-picker-footer">
        <button 
          className="color-picker-more" 
          onClick={() => { 
            onClose(); 
            if (window.showMoreColors) window.showMoreColors(true); 
          }}
        >
          <Palette size={12} />
          <span>More Colors...</span>
        </button>
      </div>
    </div>
  );
};

// ========== MORE COLORS MODAL ==========
export const MoreColorsModal = ({ onClose, onSelect, currentColor }) => {
  const [color, setColor] = useState(currentColor);
  const [hexValue, setHexValue] = useState(currentColor.replace('#', ''));
  const [rgbValue, setRgbValue] = useState({ r: 30, g: 41, b: 59 });

  React.useEffect(() => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    setRgbValue({ r, g, b });
    setHexValue(hex);
  }, [color]);

  const handleHexChange = (e) => {
    let val = e.target.value.replace('#', '');
    if (val.length <= 6 && /^[0-9A-Fa-f]*$/.test(val)) {
      setHexValue(val);
      if (val.length === 6) setColor('#' + val);
    }
  };

  const handleRgbChange = (type, val) => {
    const num = parseInt(val) || 0;
    const clamped = Math.min(255, Math.max(0, num));
    const newRgb = { ...rgbValue, [type]: clamped };
    setRgbValue(newRgb);
    const hex = '#' + 
      newRgb.r.toString(16).padStart(2, '0') + 
      newRgb.g.toString(16).padStart(2, '0') + 
      newRgb.b.toString(16).padStart(2, '0');
    setColor(hex);
  };

  return ReactDOM.createPortal(
    <div className="more-colors-overlay" onClick={onClose}>
      <div className="more-colors-modal" onClick={e => e.stopPropagation()}>
        <div className="more-colors-header">
          <h3>Colors</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="more-colors-content">
          <div className="color-preview-section">
            <div className="color-preview-large" style={{ backgroundColor: color }}>
              <span className="color-preview-text">{color}</span>
            </div>
          </div>
          
          <div className="color-picker-section-custom">
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)} 
              className="color-input-native" 
            />
            <div className="color-input-placeholder">Click to select color</div>
          </div>
          
          <div className="color-input-group">
            <label>Hex:</label>
            <div className="hex-input-wrapper">
              <span className="hex-prefix">#</span>
              <input 
                type="text" 
                value={hexValue} 
                onChange={handleHexChange} 
                maxLength="6" 
                className="hex-input" 
              />
            </div>
          </div>
          
          <div className="color-input-group">
            <label>RGB:</label>
            <div className="rgb-inputs">
              <input 
                type="number" 
                value={rgbValue.r} 
                onChange={(e) => handleRgbChange('r', e.target.value)} 
                min="0" 
                max="255" 
                className="rgb-input" 
                placeholder="R" 
              />
              <input 
                type="number" 
                value={rgbValue.g} 
                onChange={(e) => handleRgbChange('g', e.target.value)} 
                min="0" 
                max="255" 
                className="rgb-input" 
                placeholder="G" 
              />
              <input 
                type="number" 
                value={rgbValue.b} 
                onChange={(e) => handleRgbChange('b', e.target.value)} 
                min="0" 
                max="255" 
                className="rgb-input" 
                placeholder="B" 
              />
            </div>
          </div>
          
          <div className="recent-colors-section">
            <label>Recent Colors:</label>
            <div className="recent-colors-grid">
              {['#1e293b', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'].map((c, i) => (
                <button 
                  key={i} 
                  className="recent-color-swatch" 
                  style={{ backgroundColor: c }} 
                  onClick={() => setColor(c)} 
                  title={c} 
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="more-colors-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="ok-btn" onClick={() => { onSelect(color); onClose(); }}>OK</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ========== COLOR PICKER PORTAL ==========
export const ColorPickerPortal = ({ children, isOpen }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="color-picker-portal-container" style={{ position: 'relative' }}>
      {children}
    </div>,
    document.body
  );
};

// ========== MAIN COLOR PICKER COMPONENT ==========
const ColorPicker = () => {
  const { 
    showColorPicker, 
    setShowColorPicker, 
    handleTextColorChange,
    colorButtonRef 
  } = useEditor();

  if (!showColorPicker) return null;

  return (
    <ColorPickerPortal isOpen={showColorPicker}>
      <ColorPickerDropdown 
        onColorSelect={handleTextColorChange} 
        onClose={() => setShowColorPicker(false)} 
        buttonRef={colorButtonRef} 
      />
    </ColorPickerPortal>
  );
};

export default ColorPicker;