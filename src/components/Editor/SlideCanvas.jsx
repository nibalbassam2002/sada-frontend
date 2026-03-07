// src/components/Editor/SlideCanvas.jsx
import React from 'react';
import { Languages, Monitor } from 'lucide-react';
import { useEditor } from './EditorContext';
import SlideRenderer from './SlideRenderer';
import ShapeLayer from './Elements/ShapeLayer';
import TableLayer from './Elements/TableLayer';
import ImageLayer from './Elements/ImageLayer';
import NotesPanel from './Panels/NotesPanel';
import ThemeManager from '../../templates/ThemeManager';

const SlideCanvas = () => {
  const {
    slides,
    activeSlideId,
    selectedField,
    setSelectedField,
    showRuler,
    viewMode,
    showGridlines,
    showGuides,
    currentTheme,
    updateTable,
    handleTableSelect,
    handleCellSelect,
    deleteTable,
    selectedTable,
    activeCell,
    updateImageStyle,
    deleteImage,
    shapes,
    selectedShape,
    setSelectedShape,
    showNotes,
    setShowNotes,
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
    handleFitToWindow
  } = useEditor();

  const currentSlide = slides.find(s => s.id === activeSlideId);

  const handleCanvasClick = (e) => {
    if (e.target.className === 'canvas-workspace' || 
        e.target.className.includes('slide-canvas-container')) {
      setSelectedField(null);
    }
  };

  return (
    <section 
      className="canvas-workspace" 
      onClick={handleCanvasClick}
      style={{ 
        transform: viewMode === 'sorter' ? 'scale(0.8)' : 'none',
        transition: 'transform 0.3s ease'
      }}
    >
      <div 
        className="slide-canvas-container shadow-premium" 
        style={{ 
          position: 'relative', 
          overflow: 'hidden', 
          transform: `scale(${zoomLevel / 100})`, 
          transformOrigin: 'center center', 
          transition: 'transform 0.2s ease' 
        }}
      >
        {/* Rulers and Guides */}
        {showRuler && viewMode === 'normal' && <div className="ruler-horizontal"></div>}
        {showGridlines && <div className="gridlines-overlay"></div>}
        {showGuides && (
          <div className="guides-overlay">
            <div className="guide guide-vertical"></div>
            <div className="guide guide-horizontal"></div>
          </div>
        )}

        {/* Theme Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <ThemeManager themeId={currentTheme} slideType="intro" data={{ title: '', subtitle: '' }} />
        </div>

        {/* Slide Content */}
        <div className="powerpoint-layout" style={{ position: 'relative', zIndex: 10, background: 'transparent' }}>
          <SlideRenderer slide={currentSlide} />
        </div>

        {/* Layers */}
        <ShapeLayer shapes={shapes} selectedShape={selectedShape} setSelectedShape={setSelectedShape} />
        <TableLayer 
          tables={currentSlide?.tables || []}
          onUpdate={updateTable}
          onSelect={handleTableSelect}
          selectedTable={selectedTable}
          onCellSelect={handleCellSelect}
          onDelete={deleteTable}
          activeCell={activeCell}
        />
        <ImageLayer 
          images={currentSlide?.images || []}
          onUpdate={updateImageStyle}
          onDelete={deleteImage}
          selectedField={selectedField}
          setSelectedField={setSelectedField}
        />
      </div>

      {/* Notes Panel */}
      {showNotes && <NotesPanel onClose={() => setShowNotes(false)} />}

      {/* Canvas Footer */}
      <footer className="canvas-footer">
        <span>Slide {slides.findIndex(s => s.id === activeSlideId) + 1} of {slides.length}</span>
        <div className="footer-controls">
          <button><Languages size={12} /> English</button>
          <button onClick={() => setShowNotes(!showNotes)}>
            <Monitor size={12} /> Notes
          </button>
          <div className="zoom-display">
            <button onClick={handleZoomOut}>−</button>
            <span>{zoomLevel}%</span>
            <button onClick={handleZoomIn}>+</button>
          </div>
          <button onClick={handleFitToWindow}>Fit</button>
        </div>
      </footer>
    </section>
  );
};

export default SlideCanvas;