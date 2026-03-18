// src/components/Session/ScaledSlide.jsx
// يعرض الشريحة بحجم 960x540 ويصغّرها تلقائياً لتناسب الحاوية

import React, { useRef, useState, useEffect } from 'react';
import SlideRenderer from '../Editor/SlideRenderer';

const ScaledSlide = ({ slide }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const scaleX = width  / 960;
      const scaleY = height / 540;
      setScale(Math.min(scaleX, scaleY));
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{
        position: 'absolute',
        top:  '50%',
        left: '50%',
        width:  960,
        height: 540,
        transform: `translate(-50%, -50%) scale(${scale})`,
        transformOrigin: 'center center',
      }}>
        <SlideRenderer slide={slide} isThumbnail={false} />
      </div>
    </div>
  );
};

export default ScaledSlide;
