// src/components/Editor/groups/ViewGroup.js
import React from 'react';
import { useEditor } from '../EditorContext';
import {
  Monitor, List, Layers, BookOpen, LayoutTemplate, Printer,
  StickyNote, PanelRight, Ruler, Grid, EyeOff, ZoomIn,
  Maximize2, AppWindow, Layout, ArrowLeftRight
} from 'lucide-react';

const ViewGroup = () => {
  const {
    viewMode,
    handleViewModeChange,
    masterView,
    handleMasterView,
    showRuler,
    setShowRuler,
    showGridlines,
    setShowGridlines,
    showGuides,
    setShowGuides,
    showNotes,
    setShowNotes,
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
    handleFitToWindow,
    handleNewWindow,
    handleArrangeAll,
    handleSwitchWindow
  } = useEditor();

  const groups = [
    {
      id: 'presentation-views',
      label: 'Presentation Views',
      type: 'presentation-views'
    },
    {
      id: 'master-views',
      label: 'Master Views',
      type: 'master-views'
    },
    {
      id: 'show',
      label: 'Show',
      type: 'show-controls'
    },
    {
      id: 'zoom',
      label: 'Zoom',
      type: 'zoom-controls'
    },
    {
      id: 'window',
      label: 'Window',
      type: 'window-controls'
    }
  ];

  const renderGroup = (group) => {
    switch(group.type) {
      case 'presentation-views':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button 
                className={`btn-mega ${viewMode === 'normal' ? 'active-tool' : ''}`} 
                onClick={() => handleViewModeChange('normal')}
              >
                <Monitor size={28} color={viewMode === 'normal' ? "#f59e0b" : "#475569"} />
                <span>Normal</span>
              </button>
              <div className="mini-tools-stack">
                <button 
                  className={`btn-mini-wide ${viewMode === 'outline' ? 'active' : ''}`} 
                  onClick={() => handleViewModeChange('outline')}
                >
                  <List size={14} color={viewMode === 'outline' ? "#f59e0b" : "#64748b"} /> Outline View
                </button>
                <button 
                  className={`btn-mini-wide ${viewMode === 'sorter' ? 'active' : ''}`} 
                  onClick={() => handleViewModeChange('sorter')}
                >
                  <Layers size={14} color={viewMode === 'sorter' ? "#f59e0b" : "#64748b"} /> Slide Sorter
                </button>
                <button 
                  className={`btn-mini-wide ${viewMode === 'reading' ? 'active' : ''}`} 
                  onClick={() => handleViewModeChange('reading')}
                >
                  <BookOpen size={14} color={viewMode === 'reading' ? "#f59e0b" : "#64748b"} /> Reading View
                </button>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'master-views':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <button 
                className={`btn-mini-wide ${masterView === 'slide' ? 'active' : ''}`} 
                onClick={() => handleMasterView('slide')}
              >
                <LayoutTemplate size={16} color={masterView === 'slide' ? "#f59e0b" : "#2563eb"} /> Slide Master
              </button>
              <button 
                className={`btn-mini-wide ${masterView === 'handout' ? 'active' : ''}`} 
                onClick={() => handleMasterView('handout')}
              >
                <Printer size={16} color={masterView === 'handout' ? "#f59e0b" : "#64748b"} /> Handout Master
              </button>
              <button 
                className={`btn-mini-wide ${masterView === 'notes' ? 'active' : ''}`} 
                onClick={() => handleMasterView('notes')}
              >
                <StickyNote size={16} color={masterView === 'notes' ? "#f59e0b" : "#f59e0b"} /> Notes Master
              </button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'show-controls':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <label className="btn-mini-wide cursor-p">
                <input 
                  type="checkbox" 
                  checked={showRuler} 
                  onChange={(e) => setShowRuler(e.target.checked)} 
                /> Ruler
              </label>
              <label className="btn-mini-wide cursor-p">
                <input 
                  type="checkbox" 
                  checked={showGridlines} 
                  onChange={(e) => setShowGridlines(e.target.checked)} 
                /> Gridlines
              </label>
              <label className="btn-mini-wide cursor-p">
                <input 
                  type="checkbox" 
                  checked={showGuides} 
                  onChange={(e) => setShowGuides(e.target.checked)} 
                /> Guides
              </label>
              <button 
                className={`btn-mini-wide ${showNotes ? 'active' : ''}`} 
                onClick={() => setShowNotes(!showNotes)}
              >
                <PanelRight size={14} /> Notes
              </button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'zoom-controls':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega" onClick={handleZoomIn}>
                <ZoomIn size={28} color="#64748b" />
                <span>Zoom In</span>
              </button>
              <button className="btn-mega" onClick={handleZoomOut}>
                <ZoomIn size={28} color="#64748b" style={{ transform: 'scaleX(-1)' }} />
                <span>Zoom Out</span>
              </button>
              <button className="btn-mega" onClick={handleFitToWindow}>
                <Maximize2 size={28} color="#64748b" />
                <span>Fit to Window</span>
              </button>
            </div>
            <div className="group-label">{group.label} {zoomLevel}%</div>
          </div>
        );

      case 'window-controls':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <button className="btn-mini-wide" onClick={handleNewWindow}>
                <AppWindow size={16} color="#2563eb" /> New Window
              </button>
              <button className="btn-mini-wide" onClick={handleArrangeAll}>
                <Layout size={16} /> Arrange All
              </button>
              <button className="btn-mini-wide" onClick={handleSwitchWindow}>
                <ArrowLeftRight size={16} /> Switch Windows
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

export default ViewGroup;