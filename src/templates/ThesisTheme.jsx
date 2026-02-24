import React from 'react';
import './Themes.css';

const ThesisTheme = () => {
  return (
    <div className="thesis-graphics-layer">
      {/* الأشكال الزرقاء العلوية */}
      <div className="blue-shape top-light"></div>
      <div className="blue-shape top-dark"></div>
      
      {/* الأشكال الزرقاء السفلية */}
      <div className="blue-shape bottom-light"></div>
      <div className="blue-shape bottom-dark"></div>

      {/* الإطار الأسود الرفيع */}
      <div className="design-frame">
         <div className="corner-dot dot-tr"></div>
         <div className="corner-dot dot-bl"></div>
      </div>
    </div>
  );
};

export default ThesisTheme;