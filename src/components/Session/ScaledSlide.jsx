import React, { useRef, useState, useEffect } from 'react';
import SlideRenderer from '../Editor/SlideRenderer';

const ScaledSlide = ({ slide, themeId = 0 }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const resolvedThemeId = (themeId && themeId !== 0)
    ? themeId
    : parseInt(localStorage.getItem('current_theme') || '0');

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setScale(Math.min(width / 960, height / 540));
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%', height: '100%',
        position: 'relative', overflow: 'hidden',
        pointerEvents: 'none',
        userSelect: 'none',
        cursor: 'default',
      }}
    >
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 960, height: 540,
        transform: `translate(-50%, -50%) scale(${scale})`,
        transformOrigin: 'center center',
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        {/* SlideRenderer يستدعي ThemeManager داخلياً */}
        <SlideRenderer
          slide={slide}
          isThumbnail={false}
          isReadOnly={true}
          themeId={resolvedThemeId}
        />
      </div>
    </div>
  );
};

export default ScaledSlide;