// src/components/Editor/Panels/AnimationPane.js
import React from 'react';
import { Sparkles, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { useEditor } from '../EditorContext';

const AnimationPane = ({ animations, onRemove, onReorder, onUpdate }) => {
  const { animationPane, setShowAnimationPane } = useEditor();

  return (
    <div className="animation-pane">
      <div className="animation-pane-header">
        <h4>Animation Pane</h4>
        <button className="close-btn" onClick={() => setShowAnimationPane(false)}>×</button>
      </div>
      <div className="animation-pane-content">
        {animationPane.length === 0 ? (
          <div className="animation-pane-empty">
            <Sparkles size={32} color="#94a3b8" />
            <p>No animations</p>
            <small>Select an element and add animation</small>
          </div>
        ) : (
          <div className="animation-list">
            {animationPane.map((item, index) => (
              <div key={item.id} className="animation-item">
                <div className="animation-item-order">{index + 1}</div>
                <div className="animation-item-content">
                  <div className="animation-item-type">
                    <span className="animation-name">{item.animationType}</span>
                  </div>
                  <div className="animation-item-details">
                    <span className="animation-element">{item.elementType}</span>
                    <span className="animation-time">{item.duration}s</span>
                  </div>
                  <div className="animation-item-controls">
                    <button onClick={() => onReorder(index, index - 1)} disabled={index === 0}>
                      <ArrowUp size={14} />
                    </button>
                    <button onClick={() => onReorder(index, index + 1)} disabled={index === animationPane.length - 1}>
                      <ArrowDown size={14} />
                    </button>
                    <button onClick={() => onRemove(item.elementId)} className="danger">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimationPane;