// src/components/Editor/Presentation/PresentationMode.js
import React from 'react';
import { ChevronLeft, ChevronRight, Timer, PenTool, Eraser } from 'lucide-react';
import { useEditor } from '../EditorContext';
import ThemeManager from '../../../templates/ThemeManager';
import { LAYOUT_TYPES } from '../EditorConstants';

const PresentationMode = () => {
  const {
    slides,
    currentSlideIndex,
    showPresenterTools,
    prevSlide,
    nextSlide,
    endPresentation,
    showTimer,
    presentationTimer,
    laserPointer,
    penMode,
    penColor,
    penSize,
    drawingPaths,
    currentPath,
    toggleLaserPointer,
    togglePenMode,
    clearDrawings,
    handleMouseMove,
    transitions,
    transitioning,
    currentTheme,
    selectedField,
    setSelectedField,
    updateImageStyle,
    deleteImage
  } = useEditor();

  const currentSlide = slides[currentSlideIndex];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // دالة لتطبيق الترانزيشن
  const getTransitionStyle = () => {
    const transition = transitions[slides[currentSlideIndex]?.id];
    if (!transition || transition.type === 'none' || !transitioning) return {};

    return {
      animation: `${transition.type} ${transition.duration}s ease-in-out`
    };
  };

  return (
    <div 
      className="presentation-mode" 
      style={{ 
        background: '#f1f5f9', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 1000000, 
        overflow: 'auto' 
      }} 
      onMouseMove={handleMouseMove}
    >
      <div className="presentation-background" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* شريط الأدوات العلوي */}
        {showPresenterTools && (
          <div style={{ 
            background: 'white', 
            borderBottom: '1px solid #e2e8f0', 
            padding: '10px 20px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={prevSlide} 
                disabled={currentSlideIndex === 0} 
                style={{ 
                  padding: '5px 10px', 
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={nextSlide} 
                disabled={currentSlideIndex === slides.length - 1} 
                style={{ 
                  padding: '5px 10px', 
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                <ChevronRight size={18} />
              </button>
              <span style={{ 
                padding: '5px 10px', 
                background: '#f1f5f9', 
                borderRadius: '4px', 
                fontSize: '13px' 
              }}>
                {currentSlideIndex + 1} / {slides.length}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {showTimer && (
                <span style={{ 
                  padding: '5px 10px', 
                  background: '#1e293b', 
                  color: 'white', 
                  borderRadius: '4px', 
                  fontSize: '13px' 
                }}>
                  <Timer size={14} style={{ marginRight: '4px' }} /> {formatTime(presentationTimer)}
                </span>
              )}
              <button 
                onClick={endPresentation} 
                style={{ 
                  padding: '5px 15px', 
                  background: '#ef4444', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer', 
                  fontSize: '13px' 
                }}
              >
                End
              </button>
            </div>
          </div>
        )}

        {/* مؤشر الليزر */}
        {laserPointer.visible && (
          <div
            className="laser-pointer"
            style={{
              left: laserPointer.x,
              top: laserPointer.y,
              position: 'fixed',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,0,0,0.8) 0%, rgba(255,0,0,0) 70%)',
              pointerEvents: 'none',
              zIndex: 10001,
              transform: 'translate(-50%, -50%)'
            }}
          />
        )}

        {/* منطقة الرسم */}
        <svg className="drawing-layer" style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none', 
          zIndex: 9999 
        }}>
          {drawingPaths.map((path, index) => (
            <path
              key={index}
              d={`M ${path.map(p => `${p.x},${p.y}`).join(' L ')}`}
              stroke={path[0]?.color || '#f59e0b'}
              strokeWidth={path[0]?.size || 2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {currentPath.length > 0 && (
            <path
              d={`M ${currentPath.map(p => `${p.x},${p.y}`).join(' L ')}`}
              stroke={penColor}
              strokeWidth={penSize}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>

        {/* محتوى الشريحة مع الترانزيشن */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div className="slide-canvas-container" style={{
            width: '100%',
            maxWidth: '960px',
            aspectRatio: '16/9',
            background: '#fff',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            position: 'relative',
            overflow: 'hidden',
            padding: '20px 40px',
            ...getTransitionStyle()
          }}>
            <ThemeManager themeId={currentTheme} slideType="intro" data={{ title: '', subtitle: '' }} />
            <div className="powerpoint-layout" style={{ position: 'relative', zIndex: 10, background: 'transparent', height: '100%' }}>
              {(() => {
                if (!currentSlide) return null;
                switch (currentSlide.layout) {
                  case LAYOUT_TYPES.TITLE_SLIDE:
                    return (
                      <div className="title-slide-layout">
                        <div className="title-slide-main">{currentSlide.title || 'Click to add title'}</div>
                        <div className="title-slide-sub">{currentSlide.subtitle || 'Click to add subtitle'}</div>
                      </div>
                    );
                  case LAYOUT_TYPES.TITLE_AND_CONTENT:
                    return (
                      <div className="title-content-layout">
                        <div className="content-title">{currentSlide.title || 'Click to add title'}</div>
                        <div className="content-body">{currentSlide.content || 'Click to add text'}</div>
                      </div>
                    );
                  default:
                    return (
                      <div className="blank-slide-layout">
                        Slide {currentSlideIndex + 1}
                      </div>
                    );
                }
              })()}
              
              {/* طبقة الصور */}
              <div className="images-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {slides.find(s => s.id === activeSlideId)?.images?.map(img => (
                  <div
                    key={img.id}
                    style={{
                      position: 'absolute',
                      left: img.x,
                      top: img.y,
                      width: img.width,
                      transform: `rotate(${img.rotation}deg)`,
                      opacity: img.opacity / 100,
                      pointerEvents: 'auto',
                      cursor: 'move',
                      border: selectedField === `img-${img.id}` ? '2px solid #f59e0b' : 'none'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedField(`img-${img.id}`);
                    }}
                    onMouseDown={(e) => {
                      const startX = e.clientX - img.x;
                      const startY = e.clientY - img.y;

                      const handleMouseMove = (moveEvent) => {
                        updateImageStyle(img.id, {
                          x: moveEvent.clientX - startX,
                          y: moveEvent.clientY - startY
                        });
                      };

                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };

                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  >
                    <img src={img.src} style={{ width: '100%', display: 'block' }} draggable="false" />

                    {/* زر الحذف يظهر عند تحديد الصورة */}
                    {selectedField === `img-${img.id}` && (
                      <button
                        onClick={() => deleteImage(img.id)}
                        style={{
                          position: 'absolute', top: -10, right: -10, background: 'red',
                          color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer'
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* شريط الأدوات السفلي */}
        {showPresenterTools && (
          <div style={{ 
            background: 'white', 
            borderTop: '1px solid #e2e8f0', 
            padding: '10px 20px', 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '10px' 
          }}>
            <button 
              onClick={toggleLaserPointer} 
              style={{ 
                padding: '5px 15px', 
                background: laserPointer.visible ? '#f59e0b' : '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: '4px', 
                cursor: 'pointer', 
                color: laserPointer.visible ? 'white' : '#475569' 
              }}
            >
              <span style={{ fontSize: '16px', marginRight: '4px' }}>🔴</span> Laser
            </button>
            <button 
              onClick={togglePenMode} 
              style={{ 
                padding: '5px 15px', 
                background: penMode ? '#f59e0b' : '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: '4px', 
                cursor: 'pointer', 
                color: penMode ? 'white' : '#475569' 
              }}
            >
              <PenTool size={14} style={{ marginRight: '4px' }} /> Pen
            </button>
            <button 
              onClick={clearDrawings} 
              disabled={drawingPaths.length === 0} 
              style={{ 
                padding: '5px 15px', 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: '4px', 
                cursor: drawingPaths.length === 0 ? 'not-allowed' : 'pointer', 
                opacity: drawingPaths.length === 0 ? 0.5 : 1 
              }}
            >
              <Eraser size={14} style={{ marginRight: '4px' }} /> Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentationMode;