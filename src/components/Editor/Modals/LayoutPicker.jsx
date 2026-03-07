// src/components/Editor/Modals/LayoutPicker.js
import React from 'react';
import { useEditor } from '../EditorContext';
import { LAYOUT_TYPES } from '../EditorConstants';

const LayoutPicker = () => {
  const { setShowLayoutPicker, pickerMode, handleLayoutSelection } = useEditor();

  return (
    <div className="layout-picker-overlay" onClick={() => setShowLayoutPicker(false)}>
      <div className="layout-picker-grid" onClick={e => e.stopPropagation()}>
        <div className="picker-header">
          Office Theme
          <span>Choose a layout</span>
        </div>
        <div className="layouts-container">
          {Object.entries(LAYOUT_TYPES).map(([key, type]) => {
            let previewClass = "";
            
            if (type === LAYOUT_TYPES.TITLE_SLIDE) previewClass = "title-slide-preview";
            else if (type === LAYOUT_TYPES.TITLE_AND_CONTENT) previewClass = "title-content-preview";
            else if (type === LAYOUT_TYPES.TWO_CONTENT) previewClass = "two-content-preview";
            else if (type === LAYOUT_TYPES.COMPARISON) previewClass = "comparison-preview";
            else if (type === LAYOUT_TYPES.SECTION_HEADER) previewClass = "section-header-preview";
            else if (type === LAYOUT_TYPES.BLANK) previewClass = "blank-preview";
            
            return (
              <div key={key} className="layout-option" onClick={() => handleLayoutSelection(type)}>
                <div className={`layout-icon-preview ${previewClass}`}>
                  {type === LAYOUT_TYPES.TITLE_SLIDE && (
                    <>
                      <div className="preview-title"></div>
                      <div className="preview-subtitle"></div>
                    </>
                  )}
                  {type === LAYOUT_TYPES.TITLE_AND_CONTENT && (
                    <>
                      <div className="preview-title"></div>
                      <div className="preview-content"></div>
                    </>
                  )}
                  {type === LAYOUT_TYPES.TWO_CONTENT && (
                    <>
                      <div className="preview-title"></div>
                      <div className="preview-columns">
                        <div className="preview-column"></div>
                        <div className="preview-column"></div>
                      </div>
                    </>
                  )}
                  {type === LAYOUT_TYPES.COMPARISON && (
                    <>
                      <div className="preview-title"></div>
                      <div className="preview-columns">
                        <div className="preview-column">
                          <div className="preview-column-header"></div>
                          <div className="preview-column-content"></div>
                        </div>
                        <div className="preview-column">
                          <div className="preview-column-header"></div>
                          <div className="preview-column-content"></div>
                        </div>
                      </div>
                    </>
                  )}
                  {type === LAYOUT_TYPES.SECTION_HEADER && (
                    <div className="preview-title"></div>
                  )}
                  {type === LAYOUT_TYPES.BLANK && (
                    <div className="preview-blank"></div>
                  )}
                </div>
                <span>{type}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LayoutPicker;