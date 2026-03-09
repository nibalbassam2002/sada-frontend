// src/components/Editor/Editor.jsx
import React from 'react';
import { EditorProvider, useEditor } from './EditorContext';
import EditorHeader from './EditorHeader';
import Ribbon from './Ribbon';
import SlideSidebar from './SlideSidebar';
import SlideCanvas from './SlideCanvas';
import PropertiesPanel from './PropertiesPanel';
import { Modals } from './Modals';
import { Panels } from './Panels';
import PresentationMode from './Presentation/PresentationMode';
import { CheckCircle } from 'lucide-react';
import '../../styles/Editor.css';

// المكون الداخلي الذي يستخدم الـ Context
const EditorContent = () => {
  const {
    viewMode,
    showOutline,
    statusMessage,
    isPresenting,
    showComments,
    showAccessibilityPanel,
    showTranslator,
    showAnimationPane,
    showSizeModal,
    showBackgroundPanel,
    setShowSizeModal,
    setShowBackgroundPanel,
    handleImageUpload
  } = useEditor();

  return (
    <div className="editor-page">
      <EditorHeader />
      <Ribbon />

      <main className="editor-main-body">
        {/* LEFT SIDEBAR */}
        {viewMode !== 'reading' && !showOutline && <SlideSidebar />}

        {/* OUTLINE PANEL */}
        <Panels.Outline />

        {/* MASTER VIEW PANEL */}
        <Panels.MasterView />

        {/* CENTER - CANVAS */}
        <SlideCanvas />

        {/* RIGHT SIDEBAR */}
        {viewMode !== 'reading' && <PropertiesPanel />}
      </main>

      {/* TOAST NOTIFICATION */}
      {statusMessage && (
        <div className="toast-notification">
          <CheckCircle size={18} color="#10b981" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* MODALS - كل النوافذ المنبثقة */}
      <Modals.LayoutPicker />
      <Modals.FontPicker />
      <Modals.ColorPicker />
      <Modals.TableModal />
      <Modals.SearchReplace />
  
      {showSizeModal && (
        <Modals.SizeModal onClose={() => setShowSizeModal(false)} />
      )}
      {showBackgroundPanel && (
        <Modals.BackgroundPanel onClose={() => setShowBackgroundPanel(false)} />
      )}

      {/* REVIEW PANELS */}
      {showComments && <Panels.Comments />}
      {showAccessibilityPanel && <Panels.Accessibility />}
      {showTranslator && <Panels.Translator />}

      {/* PRESENTATION MODE */}
      {isPresenting && <PresentationMode />}

      {/* ANIMATION PANE */}
      {showAnimationPane && <Panels.AnimationPane />}

      {/* input الصور */}
      <input
        type="file"
        id="global-image-upload"
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleImageUpload}
      />
    </div>
  );
};

// المكون الرئيسي
const Editor = () => {
  return (
    <EditorProvider>
      <EditorContent />
    </EditorProvider>
  );
};

export default Editor;