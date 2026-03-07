// src/components/Editor/groups/SlideShowGroup.js
import React from 'react';
import { useEditor } from '../EditorContext';
import {
  Presentation, MonitorPlay, EyeOff, Timer, Mic, RotateCcw,
  Monitor
} from 'lucide-react';

const SlideShowGroup = () => {
  const {
    startPresentation,
    activeSlideId,
    toggleHideSlide,
    hideSlide,
    startRehearseTimings,
    startRecording,
    isRecording,
    toggleLoopMode,
    loopMode,
    selectedMonitor,
    setSelectedMonitor,
    availableMonitors,
    presenterMode,
    togglePresenterMode,
    showTimer,
    setShowTimer
  } = useEditor();

  const groups = [
    {
      id: 'start',
      label: 'Start',
      type: 'slideshow-start'
    },
    {
      id: 'setup',
      label: 'Set Up',
      type: 'slideshow-setup'
    },
    {
      id: 'monitors',
      label: 'Monitors',
      type: 'slideshow-monitors'
    }
  ];

  const renderGroup = (group) => {
    switch(group.type) {
      case 'slideshow-start':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega" onClick={() => startPresentation(true)}>
                <Presentation size={28} color="#d83b01" />
                <span>Beginning</span>
              </button>
              <button className="btn-mega" onClick={() => startPresentation(false)}>
                <MonitorPlay size={28} color="#475569" />
                <span>Current</span>
              </button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'slideshow-setup':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <button className="btn-mini-wide" onClick={() => toggleHideSlide(activeSlideId)}>
                <EyeOff size={14} color="#ef4444" /> {hideSlide[activeSlideId] ? 'Show Slide' : 'Hide Slide'}
              </button>
              <button className="btn-mini-wide" onClick={startRehearseTimings}>
                <Timer size={14} /> Rehearse Timings
              </button>
              <button className="btn-mini-wide" onClick={startRecording}>
                <Mic size={14} color="#ef4444" /> {isRecording ? 'Recording...' : 'Record Show'}
              </button>
              <button className="btn-mini-wide" onClick={toggleLoopMode}>
                <RotateCcw size={14} /> {loopMode ? 'Loop On' : 'Loop Off'}
              </button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'slideshow-monitors':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <div className="tool-row">
                <span className="ribbon-text-s">Monitor:</span>
                <select
                  className="ribbon-select"
                  value={selectedMonitor}
                  onChange={(e) => setSelectedMonitor(e.target.value)}
                >
                  <option value="auto">Auto</option>
                  {availableMonitors.map((monitor, index) => (
                    <option key={index} value={index}>Monitor {index + 1}</option>
                  ))}
                </select>
              </div>
              <label className="btn-mini-wide cursor-p">
                <input
                  type="checkbox"
                  checked={presenterMode}
                  onChange={togglePresenterMode}
                /> Presenter View
              </label>
              <label className="btn-mini-wide cursor-p">
                <input
                  type="checkbox"
                  checked={showTimer}
                  onChange={(e) => setShowTimer(e.target.checked)}
                /> Show Timer
              </label>
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

export default SlideShowGroup;