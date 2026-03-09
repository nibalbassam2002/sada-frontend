// src/components/Editor/SlideCanvas.jsx
import React from 'react';
import { Languages, Monitor } from 'lucide-react';
import { useEditor } from './EditorContext';
import SlideRenderer from './SlideRenderer';
import TableLayer from './Elements/TableLayer';
import ImageLayer from './Elements/ImageLayer';
import NotesPanel from './Panels/NotesPanel';
import ThemeManager from '../../templates/ThemeManager';
import { FaStar, FaHeart, FaArrowUp, FaSquare, FaCircle } from 'react-icons/fa';

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

        {/* Shape Layer - عرض الأشكال مباشرة */}
        {shapes && shapes.map(shape => {
          let IconComponent = null;
          
          if (shape.type === 'star') IconComponent = FaStar;
          else if (shape.type === 'heart') IconComponent = FaHeart;
          else if (shape.type === 'arrow') IconComponent = FaArrowUp;
          else if (shape.type === 'square') IconComponent = FaSquare;
          else if (shape.type === 'circle') IconComponent = FaCircle;

          return (
            <div
              key={shape.id}
              style={{
                position: 'absolute',
                left: shape.x,
                top: shape.y,
                width: shape.width || 100,
                height: shape.height || 100,
                backgroundColor: shape.fill || 'transparent',
                borderRadius: shape.type === 'circle' ? '50%' : 
                             shape.type === 'triangle' ? '0' : '8px',
                clipPath: shape.type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
                border: selectedShape === shape.id ? '3px solid #f59e0b' : shape.outline ? `2px solid ${shape.outline}` : 'none',
                transform: `rotate(${shape.rotation || 0}deg)`,
                opacity: (shape.opacity || 100) / 100,
                pointerEvents: 'auto',
                cursor: 'move',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: shape.fill || '#f59e0b',
                fontSize: '40px',
                zIndex: selectedShape === shape.id ? 100 : 1
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedShape(shape.id);
              }}
            >
              {IconComponent && <IconComponent />}
              {shape.text && <span style={{ fontSize: '14px', color: '#fff' }}>{shape.text}</span>}
            </div>
          );
        })}

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