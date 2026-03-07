// src/components/Editor/Modals/FontPicker.js
import React from 'react';
import { Search } from 'lucide-react';
import { useEditor } from '../EditorContext';
import { AVAILABLE_FONTS } from '../EditorConstants';

const FontPicker = () => {
  const {
    setShowFontPicker,
    searchFont,
    setSearchFont,
    fontCategory,
    setFontCategory,
    selectedFont,
    handleFontChange
  } = useEditor();

  return (
    <div className="font-picker-overlay" onClick={() => setShowFontPicker(false)}>
      <div className="font-picker-modal" onClick={e => e.stopPropagation()}>
        <div className="font-picker-header">
          <h3>Fonts</h3>
          <button className="close-btn" onClick={() => setShowFontPicker(false)}>✕</button>
        </div>
        
        <div className="font-picker-search">
          <Search size={14} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Search fonts..." 
            value={searchFont} 
            onChange={(e) => setSearchFont(e.target.value)} 
          />
        </div>
        
        <div className="font-categories">
          <button 
            className={`category-btn ${fontCategory === 'all' ? 'active' : ''}`} 
            onClick={() => setFontCategory('all')}
          >
            All Fonts
          </button>
          <button 
            className={`category-btn ${fontCategory === 'popular' ? 'active' : ''}`} 
            onClick={() => setFontCategory('popular')}
          >
            Popular
          </button>
          <button 
            className={`category-btn ${fontCategory === 'sans' ? 'active' : ''}`} 
            onClick={() => setFontCategory('sans')}
          >
            Sans Serif
          </button>
          <button 
            className={`category-btn ${fontCategory === 'serif' ? 'active' : ''}`} 
            onClick={() => setFontCategory('serif')}
          >
            Serif
          </button>
          <button 
            className={`category-btn ${fontCategory === 'display' ? 'active' : ''}`} 
            onClick={() => setFontCategory('display')}
          >
            Display
          </button>
          <button 
            className={`category-btn ${fontCategory === 'mono' ? 'active' : ''}`} 
            onClick={() => setFontCategory('mono')}
          >
            Monospace
          </button>
          <button 
            className={`category-btn ${fontCategory === 'cursive' ? 'active' : ''}`} 
            onClick={() => setFontCategory('cursive')}
          >
            Handwriting
          </button>
        </div>
        
        <div className="fonts-list">
          {AVAILABLE_FONTS.filter(font => {
            if (searchFont) return font.name.toLowerCase().includes(searchFont.toLowerCase());
            if (fontCategory === 'popular') return font.popular;
            if (fontCategory === 'sans') return font.category === 'Sans Serif';
            if (fontCategory === 'serif') return font.category === 'Serif';
            if (fontCategory === 'display') return font.category === 'Display';
            if (fontCategory === 'mono') return font.category === 'Monospace';
            if (fontCategory === 'cursive') return font.category === 'Cursive';
            return true;
          }).map(font => (
            <div 
              key={font.name} 
              className={`font-item ${selectedFont === font.name ? 'selected' : ''}`} 
              onClick={() => handleFontChange(font.name)}
            >
              <span style={{ fontFamily: font.name }}>{font.name}</span>
              {font.popular && <span className="popular-badge">Popular</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FontPicker;