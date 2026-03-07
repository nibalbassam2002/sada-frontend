// src/components/Editor/groups/AnimationsGroup.js
import React from 'react';
import { useEditor } from '../EditorContext';
import {
  Play, Copy, Clipboard, PlusSquare, Layers, Timer, RotateCcw,
  Move, ArrowUp, ArrowDown, Sparkles
} from 'lucide-react';

const AnimationsGroup = () => {
  const {
    previewAnimation,
    isAnimating,
    selectedField,
    animationTypes,
    currentAnimationCategory,
    setCurrentAnimationCategory,
    addAnimation,
    copyAnimation,
    pasteAnimation,
    setShowAnimationPane,
    animationPane,
    animationDuration,
    setAnimationDuration,
    animationDelay,
    setAnimationDelay,
    animationRepeat,
    setAnimationRepeat,
    animationDirection,
    setAnimationDirection,
    animationFillMode,
    setAnimationFillMode,
    animationEasing,
    setAnimationEasing,
    activeSlideId,
    selectedField: field,
    reorderAnimation,
    animationPane: pane
  } = useEditor();

  const groups = [
    {
      id: 'preview',
      label: 'Preview',
      type: 'animation-preview-button',
      onPreview: previewAnimation,
      isAnimating: isAnimating
    },
    {
      id: 'animation-gallery',
      label: 'Animation',
      type: 'animation-gallery-complete',
      categories: animationTypes,
      currentCategory: currentAnimationCategory,
      onCategoryChange: setCurrentAnimationCategory,
      onSelectAnimation: (type) => addAnimation(null, type),
      onCopy: copyAnimation,
      onPaste: pasteAnimation
    },
    {
      id: 'advanced',
      label: 'Advanced',
      type: 'advanced-animation-complete',
      onAddAnimation: () => addAnimation(null, 'fade'),
      onShowPane: () => setShowAnimationPane(true),
      onCopy: copyAnimation,
      onPaste: pasteAnimation,
      hasAnimations: animationPane.length > 0
    },
    {
      id: 'timing',
      label: 'Timing',
      type: 'animation-timing-complete',
      duration: animationDuration,
      delay: animationDelay,
      repeat: animationRepeat,
      direction: animationDirection,
      fillMode: animationFillMode,
      easing: animationEasing,
      onDurationChange: setAnimationDuration,
      onDelayChange: setAnimationDelay,
      onRepeatChange: setAnimationRepeat,
      onDirectionChange: setAnimationDirection,
      onFillModeChange: setAnimationFillMode,
      onEasingChange: setAnimationEasing,
      onReorderUp: () => {
        const index = pane.findIndex(a => a.elementId === `element-${activeSlideId}-${field}`);
        if (index > 0) reorderAnimation(index, index - 1);
      },
      onReorderDown: () => {
        const index = pane.findIndex(a => a.elementId === `element-${activeSlideId}-${field}`);
        if (index < pane.length - 1) reorderAnimation(index, index + 1);
      }
    }
  ];

  const renderGroup = (group) => {
    switch(group.type) {
      case 'animation-preview-button':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button 
                className={`btn-mega ${group.isAnimating ? 'active-tool' : ''}`} 
                onClick={group.onPreview} 
                disabled={!selectedField}
              >
                <Play size={28} color={selectedField ? "#475569" : "#94a3b8"} />
                <span>Preview</span>
                {group.isAnimating && <div className="preview-spinner" />}
              </button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'animation-gallery-complete':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <div className="animation-categories">
                <button
                  className={`category-chip ${group.currentCategory === 'entrance' ? 'active' : ''}`}
                  onClick={() => group.onCategoryChange('entrance')}
                >
                  Entrance
                </button>
                <button
                  className={`category-chip ${group.currentCategory === 'emphasis' ? 'active' : ''}`}
                  onClick={() => group.onCategoryChange('emphasis')}
                >
                  Emphasis
                </button>
                <button
                  className={`category-chip ${group.currentCategory === 'exit' ? 'active' : ''}`}
                  onClick={() => group.onCategoryChange('exit')}
                >
                  Exit
                </button>
                <button
                  className={`category-chip ${group.currentCategory === 'motion' ? 'active' : ''}`}
                  onClick={() => group.onCategoryChange('motion')}
                >
                  Motion
                </button>
              </div>

              <div className="animation-grid">
                {group.categories[group.currentCategory]?.map(anim => (
                  <button
                    key={anim.id}
                    className="animation-item-btn"
                    onClick={() => group.onSelectAnimation(anim.id)}
                    disabled={!selectedField}
                  >
                    <span className="animation-name">{anim.name}</span>
                  </button>
                ))}
              </div>

              <div className="animation-actions">
                <button className="btn-mini-wide" onClick={group.onCopy} disabled={!selectedField}>
                  <Copy size={14} /> Copy Animation
                </button>
                <button className="btn-mini-wide" onClick={group.onPaste} disabled={!selectedField}>
                  <Clipboard size={14} /> Paste Animation
                </button>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'advanced-animation-complete':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col" style={{ minWidth: '140px' }}>
              <button className="btn-mini-wide" onClick={group.onAddAnimation} disabled={!selectedField}>
                <PlusSquare size={14} color="#f59e0b" /> Add Animation
              </button>
              <button className="btn-mini-wide" onClick={group.onShowPane}>
                <Layers size={14} color={group.hasAnimations ? "#2563eb" : "#64748b"} />
                Animation Pane
                {group.hasAnimations && <span className="pane-badge">{animationPane.length}</span>}
              </button>
              <button className="btn-mini-wide" onClick={group.onCopy} disabled={!selectedField}>
                <Copy size={14} color="#db2777" /> Copy
              </button>
              <button className="btn-mini-wide" onClick={group.onPaste} disabled={!selectedField}>
                <Clipboard size={14} color="#10b981" /> Paste
              </button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'animation-timing-complete':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <div className="tool-row">
                <Timer size={14} color="#64748b" />
                <span className="ribbon-text-s" style={{ width: '55px' }}>Duration:</span>
                <input
                  type="number"
                  className="ribbon-select"
                  style={{ width: '60px' }}
                  value={group.duration}
                  min="0.1"
                  max="10"
                  step="0.1"
                  onChange={(e) => group.onDurationChange(parseFloat(e.target.value))}
                />
              </div>
              <div className="tool-row">
                <Timer size={14} color="#64748b" />
                <span className="ribbon-text-s" style={{ width: '55px' }}>Delay:</span>
                <input
                  type="number"
                  className="ribbon-select"
                  style={{ width: '60px' }}
                  value={group.delay}
                  min="0"
                  max="10"
                  step="0.1"
                  onChange={(e) => group.onDelayChange(parseFloat(e.target.value))}
                />
              </div>
              <div className="tool-row">
                <RotateCcw size={14} color="#64748b" />
                <span className="ribbon-text-s" style={{ width: '55px' }}>Repeat:</span>
                <select
                  className="ribbon-select"
                  style={{ width: '70px' }}
                  value={group.repeat}
                  onChange={(e) => group.onRepeatChange(e.target.value === 'infinite' ? 'infinite' : parseInt(e.target.value))}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="infinite">∞</option>
                </select>
              </div>
              <div className="tool-row">
                <Move size={14} color="#64748b" />
                <span className="ribbon-text-s" style={{ width: '55px' }}>Easing:</span>
                <select
                  className="ribbon-select"
                  style={{ width: '85px' }}
                  value={group.easing}
                  onChange={(e) => group.onEasingChange(e.target.value)}
                >
                  <option value="ease">Ease</option>
                  <option value="linear">Linear</option>
                  <option value="ease-in">Ease In</option>
                  <option value="ease-out">Ease Out</option>
                  <option value="ease-in-out">Ease InOut</option>
                  <option value="bounce">Bounce</option>
                </select>
              </div>
              <div className="tool-row" style={{ marginTop: '4px', gap: '5px' }}>
                <div className="reorder-btns">
                  <button className="btn-icon-s" onClick={group.onReorderUp} title="Move Up">
                    <ArrowUp size={12} />
                  </button>
                  <button className="btn-icon-s" onClick={group.onReorderDown} title="Move Down">
                    <ArrowDown size={12} />
                  </button>
                </div>
                <span className="ribbon-text-s">Reorder</span>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {groups.map((group, index) => (
        <React.Fragment key={group.id}>
          {renderGroup(group)}
          {index < groups.length - 1 && <div className="v-divider-slim"></div>}
        </React.Fragment>
      ))}
    </>
  );
};

export default AnimationsGroup;