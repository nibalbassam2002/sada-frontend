import React from 'react';
import './Themes.css';
const BoldElegantLeaf = ({ className, color }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M50 85C50 85 80 60 80 35C80 20 65 10 50 10C35 10 20 20 20 35C20 60 50 85 50 85Z" 
      fill={color} 
      fillOpacity="0.15"
      stroke={color} 
      strokeWidth="1.2"  /* زدت سمك الخط للوضوح */
    />
    <path d="M50 80V15" stroke={color} strokeWidth="1.2" />
    <path d="M50 65Q70 55 72 40" stroke={color} strokeWidth="0.8" />
    <path d="M50 65Q30 55 28 40" stroke={color} strokeWidth="0.8" />
  </svg>
);
// مكون وردة فنية للحالات الأخرى (8 و 9)
const ArtisticRose = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="5" fill="currentColor" />
    <path d="M50 50C60 20 90 20 90 50C90 80 60 80 50 50Z" opacity="0.4" strokeWidth="1" />
    <path d="M50 50C40 20 10 20 10 50C10 80 40 80 50 50Z" opacity="0.4" strokeWidth="1" />
    <path d="M50 50C80 60 80 90 50 90C20 90 20 60 50 50Z" opacity="0.4" strokeWidth="1" />
    <path d="M50 50C80 40 80 10 50 10C20 10 20 40 50 50Z" opacity="0.4" strokeWidth="1" />
  </svg>
);

const ThemeManager = ({ themeId }) => {
  const renderShapes = () => {
    switch (themeId) {
      case 1: return (
        <>
          <div className="t1-blue-top" />
          <div className="t1-blue-bottom" />
          <div className="t1-frame" />
        </>
      );
case 2: return (
  <div className="t2-elegant-container">
    {/* الخطوط المتقاطعة - فوق يسار */}
    <div className="t2-grid-group top-left">
      <div className="t2-line-v" />
      <div className="t2-line-h" />
    </div>

    {/* الدوائر المتداخلة - فوق يمين */}
    <div className="t2-circles-wrapper">
      <div className="t2-circle c1" />
      <div className="t2-circle c2" />
      <div className="t2-circle c3" />
      <div className="t2-circle c4" />
      <div className="t2-circle c5" />
    </div>

    {/* القوس المزدوج - تحت يسار */}
    <div className="t2-arch-wrapper">
      <div className="t2-arch-main" />
      <div className="t2-arch-secondary" />
    </div>

    {/* الخطوط المتقاطعة - تحت يمين */}
    <div className="t2-grid-group bottom-right">
      <div className="t2-line-v" />
      <div className="t2-line-h" />
    </div>
  </div>
);
 case 3: return (
  <div className="t3-bold-container">
    <div className="t3-side-strip" />
    <BoldElegantLeaf className="t3-leaf-tr" color="#1a365d" /> {/* كحلي غامق */}
    <BoldElegantLeaf className="t3-leaf-bl" color="#2d3822" /> {/* أخضر غامق جداً */}
    <div className="t3-bottom-line" />
    <div className="t3-dark-grid" />
  </div>
);
case 4: return (
  <div className="t4-modern-green-container">
    {/* المنحنى الجانبي الكبير (أخضر فاتح) */}
    <div className="t4-bg-curve" />

    {/* الدائرة العلوية (أخضر داكن) */}
    <div className="t4-circle-accent t4-circle-top" />

    {/* الدائرة السفلية (أخضر داكن) */}
    <div className="t4-circle-accent t4-circle-bottom" />

    {/* الخط العلوي مع النقطة */}
    <div className="t4-line-group t4-line-top">
      <div className="t4-line-path" />
      <div className="t4-line-dot" />
    </div>

    {/* الخط السفلي مع النقطة */}
    <div className="t4-line-group t4-line-bottom">
      <div className="t4-line-dot" />
      <div className="t4-line-path" />
    </div>
  </div>
);
      case 5: return (
        <div className="t5-container">
          <div className="t5-geo-top-left" />
          <div className="t5-geo-bottom-right" />
          <div className="t5-circle-tr">
            <div className="t5-arches" />
          </div>
          <div className="t5-circle-bl">
            <div className="t5-arches" />
          </div>
          <div className="t5-center-divider" />
        </div>
      );
case 6: return (
  <div className="t6-main-wrapper">
    {/* المجموعة العلوية: نقاط ثم خط يمتد */}
    <div className="t6-decoration-row t6-top">
      <div className="t6-dots-container">
        {[...Array(5)].map((_, i) => <div key={i} className="t6-solid-dot" />)}
      </div>
      <div className="t6-horizontal-line" />
    </div>

    {/* المجموعة السفلية: خط يمتد ثم نقاط */}
    <div className="t6-decoration-row t6-bottom">
      <div className="t6-horizontal-line" />
      <div className="t6-dots-container">
        {[...Array(5)].map((_, i) => <div key={i} className="t6-solid-dot" />)}
      </div>
    </div>
  </div>
);
      case 7: return (
  <div className="t7-luxury-container">
    <div className="t7-outer-border" />
    <div className="t7-inner-frame" />
    {/* زوايا إبداعية مزدوجة */}
    <div className="t7-double-corner tl" />
    <div className="t7-double-corner tr" />
    <div className="t7-double-corner bl" />
    <div className="t7-double-corner br" />
    <div className="t7-decorative-element" />
  </div>
);
      case 8: return (
        <>
          <div className="t8-frame-line" />
          <ArtisticRose className="t8-flower-corner" />
        </>
      );
case 9: return (
  <div className="t9-creative-frame">
    {/* الزوايا الأربعة مع تأثير الخطوط */}
    <div className="t9-corner-wrapper tl"><div className="t9-stripe-pattern" /></div>
    <div className="t9-corner-wrapper tr"><div className="t9-stripe-pattern" /></div>
    <div className="t9-corner-wrapper bl"><div className="t9-stripe-pattern" /></div>
    <div className="t9-corner-wrapper br"><div className="t9-stripe-pattern" /></div>
    
    {/* لمسات إبداعية إضافية */}
    <div className="t9-center-focus" />
    <div className="t9-floating-plus top-right">+</div>
    <div className="t9-floating-plus bottom-left">+</div>
  </div>
);
      case 10: return (
        <>
          <div className="t10-sidebar" />
          <div className="t10-corner-design" />

        </>
      );
      default: return null;
    }
  };

  return (
    <div className={`theme-master theme-${themeId}`}>
      {renderShapes()}
    </div>
  );
};

export default ThemeManager;