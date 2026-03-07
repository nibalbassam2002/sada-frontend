// src/components/Editor/Elements/ShapeLayer.js
import React from 'react';

const ShapeLayer = ({ shapes, selectedShape, setSelectedShape }) => {
  if (!shapes || shapes.length === 0) return null;

  return (
    <div className="shape-layer">
      {shapes.map(shape => (
        <svg 
          key={shape.id} 
          className={selectedShape === shape.id ? 'selected' : ''} 
          style={{ 
            position: 'absolute', 
            left: shape.x, 
            top: shape.y, 
            width: shape.width, 
            height: shape.height, 
            transform: `rotate(${shape.rotation}deg)`, 
            opacity: shape.opacity / 100, 
            cursor: 'pointer',
            pointerEvents: 'auto',
            ...(shape.effects?.shadow && { filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))' }),
            ...(shape.effects?.glow && { filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.6))' }),
            ...(shape.effects?.reflection && { 
              WebkitBoxReflect: 'below 0px linear-gradient(transparent, rgba(0,0,0,0.2))' 
            })
          }} 
          onClick={(e) => { 
            e.stopPropagation(); 
            setSelectedShape(shape.id); 
          }}
        >
          {shape.type === 'rectangle' && 
            <rect 
              width="100%" 
              height="100%" 
              fill={shape.fill} 
              stroke={shape.outline} 
              strokeWidth={shape.outlineWidth} 
              rx="8" 
            />
          }
          {shape.type === 'circle' && 
            <circle 
              cx="50%" 
              cy="50%" 
              r="45%" 
              fill={shape.fill} 
              stroke={shape.outline} 
              strokeWidth={shape.outlineWidth} 
            />
          }
          {shape.type === 'triangle' && 
            <polygon 
              points="50%,5% 95%,95% 5%,95%" 
              fill={shape.fill} 
              stroke={shape.outline} 
              strokeWidth={shape.outlineWidth} 
            />
          }
          {shape.type === 'line' && 
            <line 
              x1="0" 
              y1="50%" 
              x2="100%" 
              y2="50%" 
              stroke={shape.outline} 
              strokeWidth={shape.outlineWidth} 
            />
          }
          {shape.type === 'arrow' && 
            <>
              <line 
                x1="0" 
                y1="50%" 
                x2="80%" 
                y2="50%" 
                stroke={shape.outline} 
                strokeWidth={shape.outlineWidth} 
              />
              <polygon 
                points="80%,45% 95%,50% 80%,55%" 
                fill={shape.outline} 
              />
            </>
          }
        </svg>
      ))}
    </div>
  );
};

export default ShapeLayer;