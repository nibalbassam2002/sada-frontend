// src/components/Editor/groups/TransitionsGroup.js
import React from 'react';
import { useEditor } from '../EditorContext';
import {
  Play, Timer, Music, MousePointer2, Copy, CheckCircle,
  ChevronDown, ChevronRight
} from 'lucide-react';

const TransitionsGroup = () => {
  const {
    handlePreviewTransition,
    transitionTypes,
    transitionCategory,
    setTransitionCategory,
    selectedTransition,
    handleTransitionSelect,
    transitionDuration,
    handleDurationChange,
    transitionSound,
    handleSoundChange,
    availableSounds,
    advanceOnClick,
    handleAdvanceModeChange,
    advanceAfter,
    handleAdvanceAfterChange,
    applyToAll,
    handleApplyToAllToggle
  } = useEditor();

  const groups = [
    {
      id: 'preview',
      label: 'Preview',
      type: 'preview-button'
    },
    {
      id: 'transition-gallery',
      label: 'Transition to This Slide',
      type: 'transition-gallery'
    },
    {
      id: 'effect',
      label: 'Effect',
      type: 'effect-options'
    },
    {
      id: 'timing',
      label: 'Timing',
      type: 'timing-controls'
    }
  ];

  const renderGroup = (group) => {
    switch(group.type) {
      case 'preview-button':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega" onClick={handlePreviewTransition}>
                <Play size={28} color="#475569" />
                <span>Preview</span>
              </button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'transition-gallery':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <div className="transition-categories">
                <button
                  className={`category-chip ${transitionCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setTransitionCategory('all')}
                >
                  All
                </button>
                <button
                  className={`category-chip ${transitionCategory === 'basic' ? 'active' : ''}`}
                  onClick={() => setTransitionCategory('basic')}
                >
                  Basic
                </button>
                <button
                  className={`category-chip ${transitionCategory === 'dynamic' ? 'active' : ''}`}
                  onClick={() => setTransitionCategory('dynamic')}
                >
                  Dynamic
                </button>
                <button
                  className={`category-chip ${transitionCategory === 'exciting' ? 'active' : ''}`}
                  onClick={() => setTransitionCategory('exciting')}
                >
                  Exciting
                </button>
                <button
                  className={`category-chip ${transitionCategory === '3d' ? 'active' : ''}`}
                  onClick={() => setTransitionCategory('3d')}
                >
                  3D
                </button>
              </div>

              <div className="transition-grid">
                {transitionTypes
                  .filter(t => transitionCategory === 'all' || t.category === transitionCategory)
                  .map(transition => (
                    <button
                      key={transition.id}
                      className={`transition-item-btn ${selectedTransition === transition.id ? 'active' : ''}`}
                      onClick={() => handleTransitionSelect(transition.id)}
                    >
                      <span className="transition-name">{transition.name}</span>
                      {selectedTransition === transition.id && <CheckCircle size={10} color="#10b981" />}
                    </button>
                  ))}
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'effect-options':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <div className="tool-row">
                <Timer size={14} color="#64748b" />
                <span className="ribbon-text-s">Duration:</span>
                <input
                  type="number"
                  className="ribbon-select"
                  style={{ width: '60px' }}
                  value={transitionDuration}
                  min="0.1"
                  max="10"
                  step="0.1"
                  onChange={(e) => handleDurationChange(parseFloat(e.target.value))}
                />
                <span className="ribbon-text-s">sec</span>
              </div>

              <div className="tool-row">
                <Music size={14} color="#64748b" />
                <span className="ribbon-text-s">Sound:</span>
                <select
                  className="ribbon-select"
                  style={{ width: '100px' }}
                  value={transitionSound}
                  onChange={(e) => handleSoundChange(e.target.value)}
                >
                  {availableSounds.map(sound => (
                    <option key={sound} value={sound}>{sound}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'timing-controls':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <div className="tool-row">
                <MousePointer2 size={14} color="#64748b" />
                <label className="advance-option">
                  <input
                    type="radio"
                    checked={advanceOnClick}
                    onChange={() => handleAdvanceModeChange('click')}
                  /> On Mouse Click
                </label>
              </div>

              <div className="tool-row">
                <Timer size={14} color="#64748b" />
                <label className="advance-option">
                  <input
                    type="radio"
                    checked={!advanceOnClick && advanceAfter > 0}
                    onChange={() => handleAdvanceAfterChange(1)}
                  /> After
                  <input
                    type="number"
                    className="ribbon-select"
                    style={{ width: '50px', margin: '0 4px' }}
                    value={advanceAfter}
                    min="0"
                    max="60"
                    step="0.5"
                    disabled={advanceOnClick}
                    onChange={(e) => handleAdvanceAfterChange(parseFloat(e.target.value))}
                  /> sec
                </label>
              </div>

              <button
                className={`btn-mini-wide ${applyToAll ? 'active' : ''}`}
                onClick={handleApplyToAllToggle}
              >
                <Copy size={14} color={applyToAll ? "#10b981" : "#64748b"} /> Apply To All
              </button>
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

export default TransitionsGroup;