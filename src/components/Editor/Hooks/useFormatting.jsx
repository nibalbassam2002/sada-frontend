// src/components/Editor/Hooks/useFormatting.js
import { useState, useCallback } from 'react';

export const useFormatting = (selectedField, activeSlideId, slides, setSlides, showToast) => {

  // ========== TEXT FORMATTING STATES ==========
  const [isBold, setIsBold]               = useState(false);
  const [isItalic, setIsItalic]           = useState(false);
  const [isUnderline, setIsUnderline]     = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript]     = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [textColor, setTextColor]         = useState('#1e293b');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [recentColors, setRecentColors]   = useState([
    '#1e293b', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'
  ]);

  // ========== PARAGRAPH STATES ==========
  const [alignment, setAlignment]           = useState('left');
  const [listType, setListType]             = useState(null);
  const [indentLevel, setIndentLevel]       = useState(0);
  const [lineSpacing, setLineSpacing]       = useState('1.0');
  const [paragraphSpacing, setParagraphSpacing] = useState({ before: 0, after: 0 });
  const [highlightColor, setHighlightColor] = useState('transparent');

  // ========== SELECTED ELEMENT STATE ==========
  // هذا الـ state يربط العنصر المحدد في ElementsLayer بالـ formatting
  const [selectedElementId, setSelectedElementId] = useState(null);

  const themeColors = {
    standard: [
      '#000000','#444444','#666666','#999999','#cccccc','#ffffff',
      '#d0312d','#e67e22','#f1c40f','#2ecc71','#3498db','#9b59b6',
      '#e84342','#f39c12','#f7dc6f','#27ae60','#2980b9','#8e44ad',
      '#c0392b','#d35400','#f4d03f','#16a085','#1f618d','#6c3483',
    ],
  };

  // ─── Helper: هل المحدد الحالي عنصر Insert؟ ───────────────────────────────
  const isElementSelected = () => !!selectedElementId;

  // ─── Helper: تحديث عنصر Insert مباشرة ────────────────────────────────────
  const updateSelectedElement = useCallback((updates) => {
    if (!selectedElementId) return false;
    setSlides(prev => prev.map(slide => {
      if (slide.id !== activeSlideId) return slide;
      return {
        ...slide,
        elements: (slide.elements || []).map(el =>
          el.id === selectedElementId ? { ...el, ...updates } : el
        )
      };
    }));
    return true;
  }, [selectedElementId, activeSlideId, setSlides]);

  // ─── Helper: الحصول على العنصر المحدد حالياً ──────────────────────────────
  const getSelectedElement = useCallback(() => {
    if (!selectedElementId) return null;
    const slide = slides.find(s => s.id === activeSlideId);
    return slide?.elements?.find(el => el.id === selectedElementId) || null;
  }, [selectedElementId, activeSlideId, slides]);

  // ========== TEXT FORMATTING FUNCTIONS ==========

  const toggleBold = useCallback(() => {
    // عنصر Insert محدد؟
    if (isElementSelected()) {
      const el = getSelectedElement();
      if (el?.elementType === 'textbox') {
        const newBold = !el.bold;
        updateSelectedElement({ bold: newBold });
        setIsBold(newBold);
        showToast(newBold ? 'Bold applied' : 'Bold removed');
        return;
      }
    }
    // نص عادي في الشريحة
    if (selectedField) {
      document.execCommand('bold', false, null);
      setIsBold(prev => !prev);
      showToast(isBold ? 'Bold removed' : 'Bold applied');
    } else {
      showToast('Select text first');
    }
  }, [selectedField, isBold, showToast, isElementSelected, getSelectedElement, updateSelectedElement]);

  const toggleItalic = useCallback(() => {
    if (isElementSelected()) {
      const el = getSelectedElement();
      if (el?.elementType === 'textbox') {
        const newItalic = !el.italic;
        updateSelectedElement({ italic: newItalic });
        setIsItalic(newItalic);
        showToast(newItalic ? 'Italic applied' : 'Italic removed');
        return;
      }
    }
    if (selectedField) {
      document.execCommand('italic', false, null);
      setIsItalic(prev => !prev);
      showToast(isItalic ? 'Italic removed' : 'Italic applied');
    } else showToast('Select text first');
  }, [selectedField, isItalic, showToast, isElementSelected, getSelectedElement, updateSelectedElement]);

  const toggleUnderline = useCallback(() => {
    if (isElementSelected()) {
      const el = getSelectedElement();
      if (el?.elementType === 'textbox') {
        const newUnderline = !el.underline;
        updateSelectedElement({ underline: newUnderline });
        setIsUnderline(newUnderline);
        showToast(newUnderline ? 'Underline applied' : 'Underline removed');
        return;
      }
    }
    if (selectedField) {
      document.execCommand('underline', false, null);
      setIsUnderline(prev => !prev);
      showToast(isUnderline ? 'Underline removed' : 'Underline applied');
    } else showToast('Select text first');
  }, [selectedField, isUnderline, showToast, isElementSelected, getSelectedElement, updateSelectedElement]);

  const toggleStrikethrough = useCallback(() => {
    if (isElementSelected()) {
      const el = getSelectedElement();
      if (el?.elementType === 'textbox') {
        const newVal = !el.strikethrough;
        updateSelectedElement({ strikethrough: newVal });
        setIsStrikethrough(newVal);
        return;
      }
    }
    if (selectedField) {
      document.execCommand('strikethrough', false, null);
      setIsStrikethrough(prev => !prev);
      showToast(isStrikethrough ? 'Strikethrough removed' : 'Strikethrough applied');
    } else showToast('Select text first');
  }, [selectedField, isStrikethrough, showToast, isElementSelected, getSelectedElement, updateSelectedElement]);

  const toggleSubscript = useCallback(() => {
    if (selectedField) {
      if (isSuperscript) { document.execCommand('superscript', false, null); setIsSuperscript(false); }
      document.execCommand('subscript', false, null);
      setIsSubscript(prev => !prev);
      showToast(isSubscript ? 'Subscript removed' : 'Subscript applied');
    } else showToast('Select text first');
  }, [selectedField, isSubscript, isSuperscript, showToast]);

  const toggleSuperscript = useCallback(() => {
    if (selectedField) {
      if (isSubscript) { document.execCommand('subscript', false, null); setIsSubscript(false); }
      document.execCommand('superscript', false, null);
      setIsSuperscript(prev => !prev);
      showToast(isSuperscript ? 'Superscript removed' : 'Superscript applied');
    } else showToast('Select text first');
  }, [selectedField, isSuperscript, isSubscript, showToast]);

  // ─── Font Size ────────────────────────────────────────────────────────────
  const applyFontSizeToElement = useCallback((newSize) => {
    if (isElementSelected()) {
      const el = getSelectedElement();
      if (el?.elementType === 'textbox' || el?.elementType === 'equation' || el?.elementType === 'symbol') {
        updateSelectedElement({ fontSize: newSize });
        showToast(`Font size: ${newSize}px`);
        return true;
      }
    }
    return false;
  }, [isElementSelected, getSelectedElement, updateSelectedElement, showToast]);

  // ─── Text Color ───────────────────────────────────────────────────────────
  const handleTextColorChange = useCallback((color) => {
    setRecentColors(prev => [color, ...prev.filter(c => c !== color)].slice(0, 6));
    setTextColor(color);

    // عنصر Insert محدد؟
    if (isElementSelected()) {
      const el = getSelectedElement();
      if (el) {
        updateSelectedElement({ color });
        setShowColorPicker(false);
        showToast('Color applied');
        return;
      }
    }

    // نص عادي
    if (selectedField) {
      document.execCommand('foreColor', false, color);
      setSlides(prev => prev.map(s => {
        if (s.id === activeSlideId && selectedField) {
          return {
            ...s,
            [`${selectedField}Style`]: { ...(s[`${selectedField}Style`] || {}), color }
          };
        }
        return s;
      }));
      setShowColorPicker(false);
      showToast('Text color updated');
    } else {
      showToast('Please select text first');
      setShowColorPicker(false);
    }
  }, [selectedField, activeSlideId, setSlides, showToast,
      isElementSelected, getSelectedElement, updateSelectedElement]);

  // ─── Clear Formatting ─────────────────────────────────────────────────────
  const clearFormatting = useCallback(() => {
    if (isElementSelected()) {
      const el = getSelectedElement();
      if (el?.elementType === 'textbox') {
        updateSelectedElement({ bold: false, italic: false, underline: false, strikethrough: false, color: '#1e293b' });
        setIsBold(false); setIsItalic(false); setIsUnderline(false);
        setIsStrikethrough(false); setTextColor('#1e293b');
        showToast('Formatting cleared');
        return;
      }
    }
    if (selectedField) {
      document.execCommand('removeFormat', false, null);
      setIsBold(false); setIsItalic(false); setIsUnderline(false);
      setIsStrikethrough(false); setIsSubscript(false); setIsSuperscript(false);
      setTextColor('#1e293b');
      showToast('Formatting cleared');
    } else showToast('Select text first');
  }, [selectedField, showToast, isElementSelected, getSelectedElement, updateSelectedElement]);

  // ========== PARAGRAPH FUNCTIONS ==========

  const handleAlignLeft = useCallback(() => {
    if (isElementSelected()) { updateSelectedElement({ align: 'left' }); setAlignment('left'); showToast('Aligned left'); return; }
    if (selectedField) { document.execCommand('justifyLeft', false, null); setAlignment('left'); showToast('Text aligned left'); }
    else showToast('Select text first');
  }, [selectedField, showToast, isElementSelected, updateSelectedElement]);

  const handleAlignCenter = useCallback(() => {
    if (isElementSelected()) { updateSelectedElement({ align: 'center' }); setAlignment('center'); showToast('Aligned center'); return; }
    if (selectedField) { document.execCommand('justifyCenter', false, null); setAlignment('center'); showToast('Text aligned center'); }
    else showToast('Select text first');
  }, [selectedField, showToast, isElementSelected, updateSelectedElement]);

  const handleAlignRight = useCallback(() => {
    if (isElementSelected()) { updateSelectedElement({ align: 'right' }); setAlignment('right'); showToast('Aligned right'); return; }
    if (selectedField) { document.execCommand('justifyRight', false, null); setAlignment('right'); showToast('Text aligned right'); }
    else showToast('Select text first');
  }, [selectedField, showToast, isElementSelected, updateSelectedElement]);

  const handleAlignJustify = useCallback(() => {
    if (isElementSelected()) { updateSelectedElement({ align: 'justify' }); setAlignment('justify'); showToast('Justified'); return; }
    if (selectedField) { document.execCommand('justifyFull', false, null); setAlignment('justify'); showToast('Text justified'); }
    else showToast('Select text first');
  }, [selectedField, showToast, isElementSelected, updateSelectedElement]);

  const handleBulletList = useCallback(() => {
    if (selectedField) {
      if (listType === 'bullet') { document.execCommand('insertUnorderedList', false, null); setListType(null); showToast('Bullet list removed'); }
      else { document.execCommand('insertUnorderedList', false, null); setListType('bullet'); showToast('Bullet list applied'); }
    } else showToast('Select text first');
  }, [selectedField, listType, showToast]);

  const handleNumberList = useCallback(() => {
    if (selectedField) {
      if (listType === 'number') { document.execCommand('insertOrderedList', false, null); setListType(null); showToast('Number list removed'); }
      else { document.execCommand('insertOrderedList', false, null); setListType('number'); showToast('Number list applied'); }
    } else showToast('Select text first');
  }, [selectedField, listType, showToast]);

  const handleIndent = useCallback(() => {
    if (selectedField) { document.execCommand('indent', false, null); setIndentLevel(prev => prev + 1); showToast('Indented'); }
    else showToast('Select text first');
  }, [selectedField, showToast]);

  const handleOutdent = useCallback(() => {
    if (selectedField) { document.execCommand('outdent', false, null); setIndentLevel(prev => Math.max(0, prev - 1)); showToast('Outdented'); }
    else showToast('Select text first');
  }, [selectedField, showToast]);

  const handleLineSpacing = useCallback((spacing) => {
    if (isElementSelected()) {
      updateSelectedElement({ lineHeight: parseFloat(spacing) });
      setLineSpacing(spacing);
      showToast(`Line spacing: ${spacing}`);
      return;
    }
    if (selectedField) {
      setLineSpacing(spacing);
      const el = document.querySelector('.active-editing');
      if (el) {
        el.style.lineHeight = spacing;
        setSlides(prev => prev.map(s => {
          if (s.id === activeSlideId && selectedField) {
            return { ...s, [`${selectedField}Style`]: { ...(s[`${selectedField}Style`] || {}), lineHeight: spacing } };
          }
          return s;
        }));
      }
      showToast(`Line spacing: ${spacing}`);
    } else showToast('Select text first');
  }, [selectedField, activeSlideId, setSlides, showToast, isElementSelected, updateSelectedElement]);

  const handleParagraphSpacing = useCallback((type, value) => {
    if (selectedField) {
      const newSpacing = { ...paragraphSpacing, [type]: value };
      setParagraphSpacing(newSpacing);
      const el = document.querySelector('.active-editing');
      if (el) {
        if (type === 'before') el.style.marginTop = `${value}px`;
        else el.style.marginBottom = `${value}px`;
        setSlides(prev => prev.map(s => {
          if (s.id === activeSlideId && selectedField) {
            return { ...s, [`${selectedField}Style`]: { ...(s[`${selectedField}Style`] || {}), marginTop: newSpacing.before, marginBottom: newSpacing.after } };
          }
          return s;
        }));
      }
    } else showToast('Select text first');
  }, [selectedField, paragraphSpacing, activeSlideId, setSlides, showToast]);

  // ─── Sync formatting state when element is selected ──────────────────────
  const syncFormattingFromElement = useCallback((el) => {
    if (!el) return;
    setIsBold(el.bold || false);
    setIsItalic(el.italic || false);
    setIsUnderline(el.underline || false);
    setIsStrikethrough(el.strikethrough || false);
    if (el.color) setTextColor(el.color);
    if (el.align) setAlignment(el.align);
    if (el.fontSize) { /* handled externally */ }
  }, []);

  return {
    // Text Formatting
    isBold, setIsBold,
    isItalic, setIsItalic,
    isUnderline, setIsUnderline,
    isStrikethrough, setIsStrikethrough,
    isSubscript, setIsSubscript,
    isSuperscript, setIsSuperscript,
    textColor, setTextColor,
    showColorPicker, setShowColorPicker,
    recentColors, setRecentColors,

    // Paragraph
    alignment, setAlignment,
    listType, setListType,
    indentLevel, setIndentLevel,
    lineSpacing, setLineSpacing,
    paragraphSpacing, setParagraphSpacing,
    highlightColor, setHighlightColor,

    // Theme Colors
    themeColors,

    // ✅ Selected Element (Insert elements)
    selectedElementId, setSelectedElementId,
    syncFormattingFromElement,
    applyFontSizeToElement,

    // Functions
    toggleBold, toggleItalic, toggleUnderline, toggleStrikethrough,
    toggleSubscript, toggleSuperscript,
    handleTextColorChange, clearFormatting,
    handleAlignLeft, handleAlignCenter, handleAlignRight, handleAlignJustify,
    handleBulletList, handleNumberList,
    handleIndent, handleOutdent,
    handleLineSpacing, handleParagraphSpacing,
  };
};
