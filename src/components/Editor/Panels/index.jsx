// src/components/Editor/Panels/index.js
import React from 'react';
import { useEditor } from '../EditorContext';
import OutlinePanel from './OutlinePanel';
import NotesPanel from './NotesPanel';
import CommentsPanel from './CommentsPanel';
import AccessibilityPanel from './AccessibilityPanel';
import TranslatorPanel from './TranslatorPanel';
import AnimationPane from './AnimationPane';
import MasterViewPanel from './MasterViewPanel';

export const Panels = {
  Outline: () => {
    const { showOutline } = useEditor();
    return showOutline ? <OutlinePanel /> : null;
  },
  
  Notes: ({ onClose }) => {
    return <NotesPanel onClose={onClose} />;
  },
  
  Comments: () => {
    const { showComments, comments, resolveComment, addReply, setShowComments } = useEditor();
    return showComments ? (
      <CommentsPanel 
        comments={comments}
        onResolve={resolveComment}
        onReply={addReply}
        onClose={() => setShowComments(false)}
      />
    ) : null;
  },
  
  Accessibility: () => {
    const { showAccessibilityPanel, accessibilityIssues, setShowAccessibilityPanel, showToast } = useEditor();
    return showAccessibilityPanel ? (
      <AccessibilityPanel 
        issues={accessibilityIssues}
        onClose={() => setShowAccessibilityPanel(false)}
        onFix={(issue) => {
          showToast(`Fixing: ${issue.description}`);
        }}
      />
    ) : null;
  },
  
  Translator: () => {
    const { 
      showTranslator, 
      translationResults, 
      setShowTranslator,
      setTargetLanguage,
      targetLanguage,
      selectedField,
      updateStateFromDOM,
      showToast,
      googleTranslate
    } = useEditor();

    return showTranslator ? (
      <TranslatorPanel
        results={translationResults}
        onClose={() => setShowTranslator(false)}
        onLanguageChange={async (lang) => {
          setTargetLanguage(lang);
          const selection = window.getSelection().toString();
          if (selection) {
            try {
              showToast("Translating...");
              const { text } = await googleTranslate(selection, { to: lang });
              setTranslationResults([{
                original: selection,
                translated: text,
                language: lang,
                timestamp: new Date().toISOString()
              }]);
              showToast("Translation complete!");
            } catch (error) {
              console.error("Translation error:", error);
              showToast("Translation failed");
            }
          }
        }}
        targetLanguage={targetLanguage}
        onInsert={(translatedText) => {
          if (!selectedField) {
            showToast("Please select where to insert the translation");
            return;
          }
          const element = document.querySelector('.active-editing');
          if (element) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              range.deleteContents();
              range.insertNode(document.createTextNode(translatedText));
              updateStateFromDOM(element);
              showToast("Translation inserted");
            }
          }
        }}
      />
    ) : null;
  },
  
  AnimationPane: () => {
    const { 
      showAnimationPane, 
      animations, 
      removeAnimation, 
      reorderAnimation, 
      updateAnimation 
    } = useEditor();
    
    return showAnimationPane ? (
      <AnimationPane 
        animations={animations}
        onRemove={removeAnimation}
        onReorder={reorderAnimation}
        onUpdate={updateAnimation}
      />
    ) : null;
  },
  
  MasterView: () => {
    const { showMasterView, masterView, closeMasterView } = useEditor();
    return showMasterView ? (
      <MasterViewPanel 
        type={masterView} 
        onClose={closeMasterView} 
      />
    ) : null;
  }
};