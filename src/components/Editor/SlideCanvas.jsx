// src/components/Editor/SlideCanvas.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Languages, Monitor } from 'lucide-react';
import { useEditor } from './EditorContext';
import SlideRenderer from './SlideRenderer';
import TableLayer from './Elements/TableLayer';
import ImageLayer from './Elements/ImageLayer';
import ElementsLayer from './Elements/ElementsLayer';   // ✅ جديد
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
  const workspaceRef = useRef(null);
  const [scaledSize, setScaledSize] = useState({ width: 960, height: 540 });

  useEffect(() => {
    const updateScale = () => {
      if (!workspaceRef.current) return;
      const workspace = workspaceRef.current;
      const availableWidth  = workspace.clientWidth  - 80;
      const availableHeight = workspace.clientHeight - 80;
      const baseWidth  = 960;
      const baseHeight = 540;
      const scaleX = availableWidth  / baseWidth;
      const scaleY = availableHeight / baseHeight;
      const scale  = Math.min(scaleX, scaleY, 1);
      setScaledSize({
        width:  baseWidth  * scale * (zoomLevel / 100),
        height: baseHeight * scale * (zoomLevel / 100),
        scale:  scale * (zoomLevel / 100)
      });
    };
    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    if (workspaceRef.current) resizeObserver.observe(workspaceRef.current);
    return () => resizeObserver.disconnect();
  }, [zoomLevel]);

  const handleCanvasClick = (e) => {
    if (
      e.target === workspaceRef.current ||
      e.target.classList.contains('canvas-workspace') ||
      e.target.classList.contains('slide-outer-wrapper')
    ) {
      setSelectedField(null);
    }
  };

  return (
    <section
      className="canvas-workspace"
      ref={workspaceRef}
      onClick={handleCanvasClick}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: viewMode === 'reading' ? '#1a1a2e' : '#f0f0f0',
        position: 'relative',
        minHeight: 0,
      }}
    >
      {/* Rulers */}
      {showRuler && viewMode === 'normal' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '20px',
          background: '#fff', borderBottom: '1px solid #ddd', zIndex: 10, pointerEvents: 'none'
        }} />
      )}

      {/* Slide outer wrapper */}
      <div
        className="slide-outer-wrapper"
        style={{
          position: 'relative',
          width:  `${scaledSize.width  || 960}px`,
          height: `${scaledSize.height || 540}px`,
          flexShrink: 0,
          boxShadow: '0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)',
          borderRadius: '2px',
          background: '#fff',
        }}
      >
        {/* Slide inner (960×540 scaled) */}
        <div
          className="slide-canvas-inner"
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '960px',
            height: '540px',
            transformOrigin: 'top left',
            transform: `scale(${scaledSize.scale || 1})`,
            overflow: 'visible',
          }}
        >
          {/* Gridlines */}
          {showGridlines && (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              pointerEvents: 'none', zIndex: 100
            }} />
          )}

          {/* Guides */}
          {showGuides && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 101 }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,0,0,0.4)' }} />
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(255,0,0,0.4)' }} />
            </div>
          )}

          {/* Theme Background */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
            <ThemeManager
              themeId={currentTheme}
              slideType={currentSlide?.layout || 'intro'}
              data={{ title: currentSlide?.title || '', subtitle: currentSlide?.subtitle || '' }}
            />
          </div>

          {/* Slide Content */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 5, background: 'transparent', pointerEvents: 'auto' }}>
            <SlideRenderer slide={currentSlide} />
          </div>

          {/* Shapes Layer (القديم) */}
          {shapes && shapes.length > 0 && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 15, pointerEvents: 'none' }}>
              {shapes.map(shape => {
                let IconComponent = null;
                if (shape.type === 'star')   IconComponent = FaStar;
                if (shape.type === 'heart')  IconComponent = FaHeart;
                if (shape.type === 'arrow')  IconComponent = FaArrowUp;
                if (shape.type === 'square') IconComponent = FaSquare;
                if (shape.type === 'circle') IconComponent = FaCircle;
                return (
                  <div
                    key={shape.id}
                    style={{
                      position: 'absolute',
                      left: shape.x, top: shape.y,
                      width: shape.width || 100, height: shape.height || 100,
                      backgroundColor: shape.fill || 'transparent',
                      borderRadius: shape.type === 'circle' ? '50%' : shape.type === 'triangle' ? '0' : '8px',
                      clipPath: shape.type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
                      border: selectedShape === shape.id
                        ? '3px solid #f59e0b'
                        : shape.outline ? `2px solid ${shape.outline}` : 'none',
                      transform: `rotate(${shape.rotation || 0}deg)`,
                      opacity: (shape.opacity || 100) / 100,
                      pointerEvents: 'auto', cursor: 'move',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: shape.fill || '#f59e0b', fontSize: '40px',
                      zIndex: selectedShape === shape.id ? 20 : 15
                    }}
                    onClick={(e) => { e.stopPropagation(); setSelectedShape(shape.id); }}
                  >
                    {IconComponent && <IconComponent />}
                    {shape.text && <span style={{ fontSize: '14px', color: '#fff' }}>{shape.text}</span>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Table Layer */}
          <TableLayer
            tables={currentSlide?.tables || []}
            onUpdate={updateTable}
            onSelect={handleTableSelect}
            selectedTable={selectedTable}
            onCellSelect={handleCellSelect}
            onDelete={deleteTable}
            activeCell={activeCell}
          />

          {/* Image Layer */}
          <ImageLayer
            images={currentSlide?.images || []}
            onUpdate={updateImageStyle}
            onDelete={deleteImage}
            selectedField={selectedField}
            setSelectedField={setSelectedField}
          />

          {/* ✅ Elements Layer - الجديد (shapes, icons, charts, textbox, wordart...) */}
          <ElementsLayer />
        </div>

        {/* Clip overflow */}
        <div style={{
          position: 'absolute', inset: 0,
          overflow: 'hidden', pointerEvents: 'none', zIndex: 0, borderRadius: '2px'
        }} />
      </div>

      {/* Notes Panel */}
      {showNotes && (
        <div style={{
          width: `${scaledSize.width || 960}px`,
          maxWidth: '960px',
          marginTop: '8px',
          flexShrink: 0
        }}>
          <NotesPanel onClose={() => setShowNotes(false)} />
        </div>
      )}

      {/* Canvas Footer */}
      <footer
        className="canvas-footer"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '4px 16px',
          background: '#f8f8f8', borderTop: '1px solid #e0e0e0',
          fontSize: '12px', color: '#666', zIndex: 50, height: '32px'
        }}
      >
        <span>Slide {slides.findIndex(s => s.id === activeSlideId) + 1} of {slides.length}</span>
        <div className="footer-controls" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#666' }}>
            <Languages size={12} /> English
          </button>
          <button
            onClick={() => setShowNotes(!showNotes)}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#666' }}
          >
            <Monitor size={12} /> Notes
          </button>
          <div className="zoom-display" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button onClick={handleZoomOut} style={{ width: '20px', height: '20px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', borderRadius: '3px', lineHeight: 1 }}>−</button>
            <span style={{ minWidth: '44px', textAlign: 'center', fontSize: '12px' }}>{zoomLevel}%</span>
            <button onClick={handleZoomIn}  style={{ width: '20px', height: '20px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', borderRadius: '3px', lineHeight: 1 }}>+</button>
          </div>
          <button onClick={handleFitToWindow} style={{ background: 'none', border: '1px solid #ddd', cursor: 'pointer', fontSize: '12px', color: '#666', borderRadius: '3px', padding: '1px 6px' }}>
            Fit
          </button>
        </div>
      </footer>
    </section>
  );
};

export default SlideCanvas;
