// src/components/Editor/Hooks/useFormatting.js
import { useState, useCallback } from 'react';

export const useFormatting = (selectedField, activeSlideId, slides, setSlides, showToast) => {
  // ========== TEXT FORMATTING STATES ==========
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [textColor, setTextColor] = useState('#1e293b');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [recentColors, setRecentColors] = useState([
    '#1e293b', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'
  ]);

  // ========== PARAGRAPH STATES ==========
  const [alignment, setAlignment] = useState('left');
  const [listType, setListType] = useState(null);
  const [indentLevel, setIndentLevel] = useState(0);
  const [lineSpacing, setLineSpacing] = useState('1.0');
  const [paragraphSpacing, setParagraphSpacing] = useState({ before: 0, after: 0 });
  const [highlightColor, setHighlightColor] = useState('transparent');

  const themeColors = {
    standard: [
      '#000000', '#444444', '#666666', '#999999', '#cccccc', '#ffffff',
      '#d0312d', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6',
      '#e84342', '#f39c12', '#f7dc6f', '#27ae60', '#2980b9', '#8e44ad',
      '#c0392b', '#d35400', '#f4d03f', '#16a085', '#1f618d', '#6c3483',
    ],
  };

  // ========== TEXT FORMATTING FUNCTIONS ==========
  const toggleBold = useCallback(() => { 
    if (selectedField) { 
      document.execCommand('bold', false, null); 
      setIsBold(prev => !prev); 
      showToast(isBold ? "Bold removed" : "Bold applied"); 
    } else showToast("Select text first"); 
  }, [selectedField, isBold, showToast]);

  const toggleItalic = useCallback(() => { 
    if (selectedField) { 
      document.execCommand('italic', false, null); 
      setIsItalic(prev => !prev); 
      showToast(isItalic ? "Italic removed" : "Italic applied"); 
    } else showToast("Select text first"); 
  }, [selectedField, isItalic, showToast]);

  const toggleUnderline = useCallback(() => { 
    if (selectedField) { 
      document.execCommand('underline', false, null); 
      setIsUnderline(prev => !prev); 
      showToast(isUnderline ? "Underline removed" : "Underline applied"); 
    } else showToast("Select text first"); 
  }, [selectedField, isUnderline, showToast]);

  const toggleStrikethrough = useCallback(() => { 
    if (selectedField) { 
      document.execCommand('strikethrough', false, null); 
      setIsStrikethrough(prev => !prev); 
      showToast(isStrikethrough ? "Strikethrough removed" : "Strikethrough applied"); 
    } else showToast("Select text first"); 
  }, [selectedField, isStrikethrough, showToast]);

  const toggleSubscript = useCallback(() => { 
    if (selectedField) { 
      if (isSuperscript) { 
        document.execCommand('superscript', false, null); 
        setIsSuperscript(false); 
      } 
      document.execCommand('subscript', false, null); 
      setIsSubscript(prev => !prev); 
      showToast(isSubscript ? "Subscript removed" : "Subscript applied"); 
    } else showToast("Select text first"); 
  }, [selectedField, isSubscript, isSuperscript, showToast]);

  const toggleSuperscript = useCallback(() => { 
    if (selectedField) { 
      if (isSubscript) { 
        document.execCommand('subscript', false, null); 
        setIsSubscript(false); 
      } 
      document.execCommand('superscript', false, null); 
      setIsSuperscript(prev => !prev); 
      showToast(isSuperscript ? "Superscript removed" : "Superscript applied"); 
    } else showToast("Select text first"); 
  }, [selectedField, isSuperscript, isSubscript, showToast]);

  const handleTextColorChange = useCallback((color) => { 
    if (selectedField) { 
      document.execCommand('foreColor', false, color); 
      setTextColor(color); 
      setRecentColors(prev => [color, ...prev.filter(c => c !== color)].slice(0, 6)); 
      setSlides(prev => prev.map(s => { 
        if (s.id === activeSlideId && selectedField) { 
          return { 
            ...s, 
            [`${selectedField}Style`]: { 
              ...(s[`${selectedField}Style`] || {}), 
              color: color 
            } 
          }; 
        } 
        return s; 
      })); 
      setShowColorPicker(false); 
      showToast(`Text color updated`); 
    } else { 
      showToast("Please select text first"); 
      setShowColorPicker(false); 
    } 
  }, [selectedField, activeSlideId, setSlides, showToast]);

  const clearFormatting = useCallback(() => { 
    if (selectedField) { 
      document.execCommand('removeFormat', false, null); 
      setIsBold(false); 
      setIsItalic(false); 
      setIsUnderline(false); 
      setIsStrikethrough(false); 
      setIsSubscript(false); 
      setIsSuperscript(false); 
      setTextColor('#1e293b'); 
      showToast("Formatting cleared"); 
    } else showToast("Select text first"); 
  }, [selectedField, showToast]);

  // ========== PARAGRAPH FUNCTIONS ==========
  const handleAlignLeft = useCallback(() => { 
    if (selectedField) { 
      document.execCommand('justifyLeft', false, null); 
      setAlignment('left'); 
      showToast("Text aligned left"); 
    } else showToast("Select text first"); 
  }, [selectedField, showToast]);

  const handleAlignCenter = useCallback(() => { 
    if (selectedField) { 
      document.execCommand('justifyCenter', false, null); 
      setAlignment('center'); 
      showToast("Text aligned center"); 
    } else showToast("Select text first"); 
  }, [selectedField, showToast]);

  const handleAlignRight = useCallback(() => { 
    if (selectedField) { 
      document.execCommand('justifyRight', false, null); 
      setAlignment('right'); 
      showToast("Text aligned right"); 
    } else showToast("Select text first"); 
  }, [selectedField, showToast]);

  const handleAlignJustify = useCallback(() => { 
    if (selectedField) { 
      document.execCommand('justifyFull', false, null); 
      setAlignment('justify'); 
      showToast("Text justified"); 
    } else showToast("Select text first"); 
  }, [selectedField, showToast]);

  const handleBulletList = useCallback(() => { 
    if (selectedField) { 
      if (listType === 'bullet') { 
        document.execCommand('insertUnorderedList', false, null); 
        setListType(null); 
        showToast("Bullet list removed"); 
      } else { 
        document.execCommand('insertUnorderedList', false, null); 
        setListType('bullet'); 
        showToast("Bullet list applied"); 
      } 
    } else showToast("Select text first"); 
  }, [selectedField, listType, showToast]);

  const handleNumberList = useCallback(() => { 
    if (selectedField) { 
      if (listType === 'number') { 
        document.execCommand('insertOrderedList', false, null); 
        setListType(null); 
        showToast("Number list removed"); 
      } else { 
        document.execCommand('insertOrderedList', false, null); 
        setListType('number'); 
        showToast("Number list applied"); 
      } 
    } else showToast("Select text first"); 
  }, [selectedField, listType, showToast]);

  const handleIndent = useCallback(() => { 
    if (selectedField) { 
      document.execCommand('indent', false, null); 
      setIndentLevel(prev => prev + 1); 
      showToast("Indented"); 
    } else showToast("Select text first"); 
  }, [selectedField, showToast]);

  const handleOutdent = useCallback(() => { 
    if (selectedField) { 
      document.execCommand('outdent', false, null); 
      setIndentLevel(prev => Math.max(0, prev - 1)); 
      showToast("Outdented"); 
    } else showToast("Select text first"); 
  }, [selectedField, showToast]);

  const handleLineSpacing = useCallback((spacing) => { 
    if (selectedField) { 
      setLineSpacing(spacing); 
      const element = document.querySelector('.active-editing'); 
      if (element) { 
        element.style.lineHeight = spacing; 
        setSlides(prev => prev.map(s => { 
          if (s.id === activeSlideId && selectedField) { 
            return { 
              ...s, 
              [`${selectedField}Style`]: { 
                ...(s[`${selectedField}Style`] || {}), 
                lineHeight: spacing 
              } 
            }; 
          } 
          return s; 
        })); 
      } 
      showToast(`Line spacing: ${spacing}`); 
    } else showToast("Select text first"); 
  }, [selectedField, activeSlideId, setSlides, showToast]);

  const handleParagraphSpacing = useCallback((type, value) => { 
    if (selectedField) { 
      const newSpacing = { ...paragraphSpacing, [type]: value }; 
      setParagraphSpacing(newSpacing); 
      const element = document.querySelector('.active-editing'); 
      if (element) { 
        if (type === 'before') element.style.marginTop = `${value}px`; 
        else element.style.marginBottom = `${value}px`; 
        setSlides(prev => prev.map(s => { 
          if (s.id === activeSlideId && selectedField) { 
            return { 
              ...s, 
              [`${selectedField}Style`]: { 
                ...(s[`${selectedField}Style`] || {}), 
                marginTop: newSpacing.before, 
                marginBottom: newSpacing.after 
              } 
            }; 
          } 
          return s; 
        })); 
      } 
    } else showToast("Select text first"); 
  }, [selectedField, paragraphSpacing, activeSlideId, setSlides, showToast]);

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

    // Functions
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleStrikethrough,
    toggleSubscript,
    toggleSuperscript,
    handleTextColorChange,
    clearFormatting,
    handleAlignLeft,
    handleAlignCenter,
    handleAlignRight,
    handleAlignJustify,
    handleBulletList,
    handleNumberList,
    handleIndent,
    handleOutdent,
    handleLineSpacing,
    handleParagraphSpacing
  };
};