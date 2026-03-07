// src/components/Editor/groups/DesignGroup.jsx
import React from 'react';
import { useEditor } from '../EditorContext';
import { Palette, RotateCcw, Columns, PaintBucket, Sparkles } from 'lucide-react';

const DesignGroup = () => {
  const {
    currentTheme, applyTheme,
    variants, selectedVariant, applyVariant,
    setShowColorScheme, setShowSizeModal, formatBackground,
    slideSize
  } = useEditor();

  const renderThemesGallery = () => (
    <div className="ribbon-group" key="themes">
      <div className="group-content-flex">
        <div className="themes-gallery-mini" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
          {[0,1,2,3,4,5,6,7,8,9,10].map(num => (
            <div
              key={num}
              className={`theme-item ${currentTheme === num ? 'active' : ''}`}
              style={{ 
                background: num === 0 ? '#ffffff' : 
                           num === 1 ? '#1e293b' : 
                           num === 2 ? '#f59e0b' : '#3b82f6',
                border: num === 0 ? '2px solid #e2e8f0' : 'none',
                color: num === 0 ? '#1e293b' : 'white'
              }}
              onClick={() => applyTheme(num)}
            >
              {num === 0 ? 'Blank' : num}
            </div>
          ))}
        </div>
      </div>
      <div className="group-label">Themes</div>
    </div>
  );

  const renderVariantsGallery = () => (
    <div className="ribbon-group" key="variants">
      <div className="group-content-flex">
        <div className="variants-grid">
          {variants.map(variant => (
            <div
              key={variant.id}
              className={`variant-box ${selectedVariant === variant.id ? 'active' : ''}`}
              style={{ 
                background: `linear-gradient(90deg, ${variant.colors[0]} 33%, ${variant.colors[1]} 33%, ${variant.colors[1]} 66%, ${variant.colors[2]} 66%)` 
              }}
              onClick={() => applyVariant(variant.id)}
            >
              {variant.colors.map((color, i) => (
                <span key={i} className="color-dot" style={{ background: color }} />
              ))}
            </div>
          ))}
        </div>
        <div className="mini-tools-stack">
          <button className="btn-mini-wide" onClick={() => setShowColorScheme(true)}>
            <Palette size={14} /> Colors
          </button>
          <button className="btn-mini-wide" onClick={() => applyVariant(selectedVariant)}>
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>
      <div className="group-label">Variants</div>
    </div>
  );

  const renderCustomizeControls = () => (
    <div className="ribbon-group" key="customize">
      <div className="group-content-flex">
        <button className="btn-mega" onClick={() => setShowSizeModal(true)}>
          <Columns size={28} color="#475569" />
          <div className="btn-label-stack">
            <span>Slide Size</span>
            <span style={{ fontSize: '8px' }}>{slideSize}</span>
          </div>
        </button>
        <button className="btn-mega" onClick={formatBackground}>
          <PaintBucket size={28} color="#059669" />
          <span>Format<br />Background</span>
        </button>
      </div>
      <div className="group-label">Customize</div>
    </div>
  );

  const renderDesignerIdeas = () => (
    <div className="ribbon-group" key="designer">
      <div className="group-content-flex">
        <button className="btn-mega">
          <Sparkles size={28} color="#8b5cf6" />
          <span>Design<br />Ideas</span>
        </button>
      </div>
      <div className="group-label">Designer</div>
    </div>
  );

  return (
    <>
      {renderThemesGallery()}
      <div className="v-divider-slim"></div>
      {renderVariantsGallery()}
      <div className="v-divider-slim"></div>
      {renderCustomizeControls()}
      <div className="v-divider-slim"></div>
      {renderDesignerIdeas()}
    </>
  );
};

export default DesignGroup;