// src/pages/DisplayPage.jsx
// ════════════════════════════════════════════════════════
// شاشة العرض النظيفة — الشريحة فقط بدون أي controls
// تُفتح في نافذة منفصلة للبروجكتور
// ════════════════════════════════════════════════════════

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ScaledSlide from '../components/Session/ScaledSlide';
import { EditorProvider, useEditor } from '../components/Editor/EditorContext';

const DisplayContent = () => {
  const { slides, currentSlideIndex, isLoading } = useEditor();
  const currentSlide = slides[currentSlideIndex];

  // Fullscreen تلقائي
  useEffect(() => {
    document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  if (isLoading || !currentSlide) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 20 }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#000', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ScaledSlide slide={currentSlide} />
      </div>
    </div>
  );
};

const DisplayPage = () => (
  <EditorProvider>
    <DisplayContent />
  </EditorProvider>
);

export default DisplayPage;
