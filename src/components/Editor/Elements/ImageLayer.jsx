// src/components/Editor/Elements/ImageLayer.js
import React from 'react';

const ImageLayer = ({ images, onUpdate, onDelete, selectedField, setSelectedField }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="images-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 15 }}>
      {images.map(img => (
        <div
          key={img.id}
          style={{
            position: 'absolute',
            left: img.x,
            top: img.y,
            width: img.width,
            height: img.height,
            transform: `rotate(${img.rotation}deg)`,
            opacity: img.opacity / 100,
            pointerEvents: 'auto',
            cursor: 'move',
            border: selectedField === `img-${img.id}` ? '2px solid #f59e0b' : 'none',
            boxShadow: selectedField === `img-${img.id}` ? '0 0 10px rgba(245,158,11,0.3)' : 'none',
            filter: `brightness(${img.filters?.brightness || 100}%) contrast(${img.filters?.contrast || 100}%)`
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedField(`img-${img.id}`);
          }}
          onMouseDown={(e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            
            const startX = e.clientX - img.x;
            const startY = e.clientY - img.y;

            const handleMouseMove = (moveEvent) => {
              onUpdate(img.id, {
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
          <img 
            src={img.src} 
            style={{ 
              width: '100%', 
              height: '100%', 
              display: 'block', 
              pointerEvents: 'none',
              objectFit: 'contain'
            }} 
            draggable="false" 
            alt=""
          />

          {/* مقابض تغيير الحجم */}
          {selectedField === `img-${img.id}` && (
            <>
              {/* مقابض الزوايا */}
              <div 
                className="resize-handle resize-handle-se"
                style={{ position: 'absolute', bottom: -5, right: -5, width: 10, height: 10, background: '#f59e0b', borderRadius: '50%', cursor: 'se-resize' }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  const startX = e.clientX;
                  const startY = e.clientY;
                  const startWidth = img.width;
                  const startHeight = img.height;
                  const aspectRatio = startWidth / startHeight;

                  const handleMouseMove = (moveEvent) => {
                    const deltaX = moveEvent.clientX - startX;
                    const deltaY = moveEvent.clientY - startY;
                    const newWidth = Math.max(50, startWidth + deltaX);
                    const newHeight = Math.max(50, startHeight + deltaY);
                    onUpdate(img.id, { width: newWidth, height: newHeight });
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };

                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />
              
              {/* زر التدوير */}
              <div 
                style={{
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 24,
                  height: 24,
                  background: '#f59e0b',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'grab',
                  color: 'white',
                  fontSize: 12
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  const centerX = img.x + img.width / 2;
                  const centerY = img.y + img.height / 2;
                  const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;

                  const handleMouseMove = (moveEvent) => {
                    const currentAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * 180 / Math.PI;
                    const deltaAngle = currentAngle - startAngle;
                    onUpdate(img.id, { rotation: (img.rotation + deltaAngle) % 360 });
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };

                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              >
                ↻
              </div>

              {/* زر الحذف */}
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(img.id); }}
                style={{
                  position: 'absolute', 
                  top: -12, 
                  right: -12, 
                  background: '#ef4444',
                  color: 'white', 
                  border: '2px solid white', 
                  borderRadius: '50%',
                  width: 24, 
                  height: 24, 
                  cursor: 'pointer', 
                  display: 'flex',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 'bold',
                  zIndex: 20,
                  fontSize: 16,
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageLayer;