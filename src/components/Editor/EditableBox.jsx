// src/components/Editor/EditableBox.jsx
import React from 'react';
import { useEditor } from './EditorContext';

const EditableBox = ({ field, placeholder, className = "", displayCondition = true }) => {
  const {
    slides,
    activeSlideId,
    selectedField,
    setSelectedField,
    setSlides,
    selectedFont,
    isPainterActive,
    painterStyle,
    setIsPainterActive,
    setPainterStyle,
    animations,
    getAnimationStyle
  } = useEditor();

  if (!displayCondition) return null;

  const currentSlide = slides.find(s => s.id === activeSlideId);
  const hasContent = currentSlide && currentSlide[field] && currentSlide[field].trim() !== "";
  const fieldStyle = currentSlide?.[`${field}Style`] || {};
  const elementId = `element-${activeSlideId}-${field}`;
  const elementAnimation = animations[elementId];

  const handleFocus = () => setSelectedField(field);

  const handleBlur = (e) => {
    const text = e.target.innerText;
    setSlides(prev => prev.map(s => 
      s.id === activeSlideId ? { ...s, [field]: text } : s
    ));
  };

  const handleClick = (e) => {
    if (isPainterActive && painterStyle) {
      const element = e.target;
      Object.assign(element.style, painterStyle);
      setIsPainterActive(false);
      setPainterStyle(null);
      
      // تحديث الـ style في الـ state
      setSlides(prev => prev.map(s => 
        s.id === activeSlideId ? { 
          ...s, 
          [`${field}Style`]: { 
            ...(s[`${field}Style`] || {}),
            ...painterStyle
          } 
        } : s
      ));
    }
    e.stopPropagation();
  };

  return (
    <div 
      id={elementId}
      className={`${className} ${selectedField === field ? 'active-editing' : ''} editable-box ${elementAnimation ? 'has-animation' : ''}`}
      contentEditable
      suppressContentEditableWarning
      spellCheck="false"
      data-placeholder={placeholder}
      data-has-content={hasContent}
      style={{
        fontFamily: fieldStyle.fontFamily || selectedFont,
        fontSize: fieldStyle.fontSize ? `${fieldStyle.fontSize}px` : undefined,
        color: fieldStyle.color,
        fontWeight: fieldStyle.fontWeight,
        fontStyle: fieldStyle.fontStyle,
        textDecoration: fieldStyle.textDecoration,
        textAlign: fieldStyle.textAlign,
        lineHeight: fieldStyle.lineHeight,
        marginTop: fieldStyle.marginTop,
        marginBottom: fieldStyle.marginBottom,
        animation: elementAnimation ? getAnimationStyle(elementAnimation) : undefined
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
    >
      {currentSlide?.[field] || ""}
    </div>
  );
};

export default EditableBox;