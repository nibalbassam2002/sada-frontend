// src/components/Editor/SlideRenderer.js
import React from 'react';
import { useEditor } from './EditorContext';
import { LAYOUT_TYPES } from './EditorConstants';
import EditableBox from './EditableBox';

const SlideRenderer = ({ slide }) => {
  const { renderBox } = useEditor();

  if (!slide) return null;

  switch (slide.layout) {
    case LAYOUT_TYPES.TITLE_SLIDE:
      return (
        <div className="title-slide-layout">
          {renderBox('title', 'Click to add title', 'title-slide-main')}
          {renderBox('subtitle', 'Click to add subtitle', 'title-slide-sub')}
        </div>
      );

    case LAYOUT_TYPES.SECTION_HEADER:
      return (
        <div className="section-header-layout">
          {renderBox('title', 'Section title', 'section-header-title')}
        </div>
      );

    case LAYOUT_TYPES.TITLE_AND_CONTENT:
      return (
        <div className="title-content-layout">
          {renderBox('title', 'Click to add title', 'content-title')}
          {renderBox('content', 'Click to add text', 'content-body')}
        </div>
      );

    case LAYOUT_TYPES.TWO_CONTENT:
      return (
        <div className="two-column-layout">
          {renderBox('title', 'Click to add title', 'two-column-title')}
          <div className="two-column-container">
            {renderBox('leftContent', 'Click to add content to left column', 'column-left')}
            {renderBox('rightContent', 'Click to add content to right column', 'column-right')}
          </div>
        </div>
      );

    case LAYOUT_TYPES.COMPARISON:
      return (
        <div className="comparison-layout">
          {renderBox('title', 'Click to add title', 'comparison-title')}
          <div className="comparison-container">
            <div className="comparison-column">
              <div className="comparison-header">Left</div>
              {renderBox('leftContent', 'Click to add', 'comparison-content')}
            </div>
            <div className="comparison-column">
              <div className="comparison-header">Right</div>
              {renderBox('rightContent', 'Click to add', 'comparison-content')}
            </div>
          </div>
        </div>
      );

    default:
      return <div className="blank-slide-layout"></div>;
  }
};

export default SlideRenderer;