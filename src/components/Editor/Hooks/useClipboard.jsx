// src/components/Editor/Hooks/useClipboard.js
import { useState, useCallback } from 'react';

export const useClipboard = (selectedField, slides, activeSlideId, setSlides, setActiveSlideId, showToast) => {
  const [clipboardItem, setClipboardItem] = useState(null);
  const [painterStyle, setPainterStyle] = useState(null);
  const [isPainterActive, setIsPainterActive] = useState(false);
  const [copiedSlide, setCopiedSlide] = useState(null);

  // ========== UPDATE STATE FROM DOM ==========
  const updateStateFromDOM = useCallback((el) => { 
    const text = el.innerText; 
    setSlides(prev => prev.map(s => 
      s.id === activeSlideId ? { ...s, [selectedField]: text } : s
    )); 
  }, [selectedField, activeSlideId, setSlides]);

  // ========== COPY/PASTE FUNCTIONS ==========
  const handleCopy = useCallback(async () => { 
    const selection = window.getSelection(); 
    const selectedText = selection.toString(); 
    
    if (selectedText) { 
      setClipboardItem({ type: 'text', content: selectedText }); 
      await navigator.clipboard.writeText(selectedText); 
      showToast("Text copied!"); 
    } else if (!selectedField) { 
      const currentSlide = slides.find(s => s.id === activeSlideId); 
      setClipboardItem({ type: 'slide', content: JSON.parse(JSON.stringify(currentSlide)) }); 
      showToast("Slide copied!"); 
    } 
  }, [selectedField, slides, activeSlideId, showToast]);

  const handleCut = useCallback(() => { 
    const selection = window.getSelection(); 
    const selectedText = selection.toString(); 
    
    if (selectedText) { 
      setClipboardItem({ type: 'text', content: selectedText }); 
      navigator.clipboard.writeText(selectedText); 
      document.execCommand('delete'); 
      showToast("Text cut!"); 
      
      const element = document.querySelector(`.active-editing`); 
      if (element) updateStateFromDOM(element); 
    } else if (!selectedField && slides.length > 1) { 
      handleCopy(); 
      const newSlides = slides.filter(s => s.id !== activeSlideId); 
      setSlides(newSlides); 
      setActiveSlideId(newSlides[0].id); 
      showToast("Slide cut!"); 
    } 
  }, [selectedField, slides, activeSlideId, handleCopy, setSlides, setActiveSlideId, updateStateFromDOM, showToast]);

  const handlePaste = useCallback(async () => { 
    try { 
      const externalText = await navigator.clipboard.readText(); 
      if (selectedField) { 
        document.execCommand('insertText', false, externalText); 
        showToast("Pasted!"); 
        const element = document.querySelector(`.active-editing`); 
        if (element) updateStateFromDOM(element); 
        return; 
      } 
    } catch (err) { 
      console.log("Clipboard access denied"); 
    } 
    
    if (clipboardItem && clipboardItem.type === 'slide') { 
      const newId = Date.now(); 
      const newSlide = { ...clipboardItem.content, id: newId }; 
      const activeIndex = slides.findIndex(s => s.id === activeSlideId); 
      const newSlides = [...slides]; 
      newSlides.splice(activeIndex + 1, 0, newSlide); 
      setSlides(newSlides); 
      setActiveSlideId(newId); 
      showToast("Slide pasted!"); 
    } 
  }, [selectedField, clipboardItem, slides, activeSlideId, setSlides, setActiveSlideId, updateStateFromDOM, showToast]);

  // ========== FORMAT PAINTER FUNCTIONS ==========
  const handleFormatPainter = useCallback(() => { 
    if (selectedField) { 
      const element = document.querySelector('.active-editing'); 
      if (element) { 
        const style = window.getComputedStyle(element); 
        const copiedStyle = { 
          fontWeight: style.fontWeight, 
          fontStyle: style.fontStyle, 
          textDecoration: style.textDecoration, 
          color: style.color, 
          fontSize: style.fontSize, 
          fontFamily: style.fontFamily, 
          textAlign: style.textAlign 
        }; 
        setPainterStyle(copiedStyle); 
        setIsPainterActive(true); 
        showToast("Format copied! Click another text to apply."); 
      } 
    } else showToast("Select formatted text first!"); 
  }, [selectedField, showToast]);

  const applyFormat = useCallback((e) => { 
    if (isPainterActive && painterStyle) { 
      const element = e.target; 
      Object.assign(element.style, painterStyle); 
      setIsPainterActive(false); 
      setPainterStyle(null); 
      showToast("Format applied!"); 
    } 
  }, [isPainterActive, painterStyle, showToast]);

  return {
    // States
    clipboardItem,
    setClipboardItem,
    painterStyle,
    setPainterStyle,
    isPainterActive,
    setIsPainterActive,
    copiedSlide,
    setCopiedSlide,

    // Functions
    updateStateFromDOM,
    handleCopy,
    handleCut,
    handlePaste,
    handleFormatPainter,
    applyFormat
  };
};