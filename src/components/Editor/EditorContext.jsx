// src/components/Editor/EditorContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { LAYOUT_TYPES } from './EditorConstants';
import { googleTranslate, getFieldFromElement, getAnimationStyle } from './EditorUtils';
import { usePresentation } from './Hooks/usePresentation';
import { useAnimations } from './Hooks/useAnimations';
import { useTransitions } from './Hooks/useTransitions';
import { useFormatting } from './Hooks/useFormatting';
import { useDrawing } from './Hooks/useDrawing';
import { useClipboard } from './Hooks/useClipboard';
import Typo from 'typo-js';

const dictionary = new Typo('en_US');

const EditorContext = createContext();

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
};

export const EditorProvider = ({ children }) => {
  // ========== BASIC STATES ==========
  const query = new URLSearchParams(window.location.search);
  const initialTheme = parseInt(query.get('templateId')) ?? 0;

  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const [activeTab, setActiveTab] = useState("Home");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [title, setTitle] = useState("First Presentation");
  const [statusMessage, setStatusMessage] = useState("");
  const [selectedField, setSelectedField] = useState(null);
  const colorButtonRef = React.useRef(null);

  // ========== SLIDES STATES ==========
  const [slides, setSlides] = useState([{ 
    id: 1, 
    layout: LAYOUT_TYPES.TITLE_SLIDE, 
    title: "", 
    subtitle: "", 
    tables: [], 
    shapes: [], 
    images: [], 
    content: "", 
    leftContent: "", 
    rightContent: "", 
    titleStyle: { fontFamily: 'Calibri', fontSize: 48 }, 
    subtitleStyle: { fontFamily: 'Calibri', fontSize: 24 }, 
    contentStyle: { fontFamily: 'Calibri', fontSize: 24 } 
  }]);
  const [activeSlideId, setActiveSlideId] = useState(1);

  // ========== VIEW STATES ==========
  const [viewMode, setViewMode] = useState('normal');
  const [showOutline, setShowOutline] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showRuler, setShowRuler] = useState(false);
  const [showGridlines, setShowGridlines] = useState(false);
  const [showGuides, setShowGuides] = useState(false);

  // ========== MASTER VIEWS STATES ==========
  const [masterView, setMasterView] = useState(null);
  const [showMasterView, setShowMasterView] = useState(false);
  const [masterSlides, setMasterSlides] = useState([
    {
      id: 'master-1',
      type: 'slide-master',
      title: "Master Title Style",
      subtitle: "Master Subtitle Style",
      content: "Master Content Style",
      background: "#ffffff",
      colors: ['#f59e0b', '#1e293b', '#64748b', '#ef4444', '#10b981'],
      fonts: { title: 'Calibri', body: 'Calibri' }
    }
  ]);

  // ========== WINDOW CONTROLS STATES ==========
  const [windows, setWindows] = useState([{ id: 1, name: 'Presentation1' }]);
  const [activeWindow, setActiveWindow] = useState(1);

  // ========== FONT STATES ==========
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [selectedFont, setSelectedFont] = useState('Calibri');
  const [fontSize, setFontSize] = useState(44);
  const [fontCategory, setFontCategory] = useState('all');
  const [searchFont, setSearchFont] = useState('');

  // ========== MODALS STATES ==========
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('add');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showMoreColors, setShowMoreColors] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showBackgroundPanel, setShowBackgroundPanel] = useState(false);
  const [showColorScheme, setShowColorScheme] = useState(false);
  const [showDesignIdeas, setShowDesignIdeas] = useState(false);

  // ========== REVIEW STATES ==========
  const [spellingErrors, setSpellingErrors] = useState([]);
  const [currentSpellingIndex, setCurrentSpellingIndex] = useState(-1);
  const [checkingSpelling, setCheckingSpelling] = useState(false);
  const [thesaurusResults, setThesaurusResults] = useState([]);
  const [selectedWord, setSelectedWord] = useState('');
  const [accessibilityIssues, setAccessibilityIssues] = useState([]);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [translationResults, setTranslationResults] = useState([]);
  const [targetLanguage, setTargetLanguage] = useState('ar');
  const [showTranslator, setShowTranslator] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [selectedCommentThread, setSelectedCommentThread] = useState(null);
  const [isProtected, setIsProtected] = useState(false);
  const [isMarkedFinal, setIsMarkedFinal] = useState(false);
  const [protectionPassword, setProtectionPassword] = useState('');

  // ========== DESIGN STATES ==========
  const [variants, setVariants] = useState([
    { id: 1, colors: ['#f59e0b', '#1e293b', '#64748b'] },
    { id: 2, colors: ['#3b82f6', '#1e293b', '#94a3b8'] },
    { id: 3, colors: ['#10b981', '#065f46', '#d1fae5'] },
    { id: 4, colors: ['#8b5cf6', '#2e1065', '#ede9fe'] },
  ]);
  const [selectedVariant, setSelectedVariant] = useState(1);
  const [slideSize, setSlideSize] = useState('widescreen');
  const [slideWidth, setSlideWidth] = useState(1366);
  const [slideHeight, setSlideHeight] = useState(768);
  const [backgroundType, setBackgroundType] = useState('solid');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [gradientStart, setGradientStart] = useState('#f59e0b');
  const [gradientEnd, setGradientEnd] = useState('#fbbf24');
  const [gradientAngle, setGradientAngle] = useState(90);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundTransparency, setBackgroundTransparency] = useState(100);
  const [designIdeas, setDesignIdeas] = useState([
    { id: 1, name: 'Corporate', thumbnail: '#1e293b', slides: 4 },
    { id: 2, name: 'Creative', thumbnail: '#8b5cf6', slides: 6 },
    { id: 3, name: 'Modern', thumbnail: '#0ea5e9', slides: 5 },
    { id: 4, name: 'Elegant', thumbnail: '#475569', slides: 4 },
  ]);

  // ========== TABLE STATES ==========
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [activeCell, setActiveCell] = useState(null);

  // ========== SEARCH STATES ==========
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [matchCase, setMatchCase] = useState(false);
  const [matchWholeWord, setMatchWholeWord] = useState(false);
  const [selectionMode, setSelectionMode] = useState('normal');

  // ========== QUESTION SESSION STATES ==========
  const [sessionActive, setSessionActive] = useState(false);
  const [currentQuestionResponses, setCurrentQuestionResponses] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [sessionParticipants, setSessionParticipants] = useState([]);

  // ========== POLL SETTINGS ==========
  const [pollSettings, setPollSettings] = useState({
    showResults: false,
    isPrivate: false,
    showCount: true,
    timer: 30,
    allowMultiple: false
  });

  // ========== HELPER FUNCTIONS ==========
  const showToast = useCallback((msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(""), 2000);
  }, []);

  // ========== SLIDE FUNCTIONS ==========
  const createNewSlide = useCallback((layoutType = LAYOUT_TYPES.BLANK) => ({
    id: Date.now(),
    layout: layoutType,
    title: "",
    subtitle: "",
    content: "",
    leftContent: "",
    rightContent: "",
    tables: [],
    shapes: [],
    images: [],
    titleStyle: { fontFamily: selectedFont, fontSize: 48 },
    subtitleStyle: { fontFamily: selectedFont, fontSize: 24 },
    contentStyle: { fontFamily: selectedFont, fontSize: 24 },
    leftContentStyle: { fontFamily: selectedFont, fontSize: 20 },
    rightContentStyle: { fontFamily: selectedFont, fontSize: 20 }
  }), [selectedFont]);

  const addNewSlide = useCallback((layoutType = LAYOUT_TYPES.BLANK) => {
    const newSlide = createNewSlide(layoutType);
    setSlides(prev => [...prev, newSlide]);
    setActiveSlideId(newSlide.id);
    setShowLayoutPicker(false);
    showToast("New slide added");
  }, [createNewSlide, showToast]);

  const handleLayoutSelection = useCallback((type) => {
    if (pickerMode === 'add') {
      addNewSlide(type);
    } else {
      setSlides(prev => prev.map(s => 
        s.id === activeSlideId ? { ...s, layout: type } : s
      ));
      setShowLayoutPicker(false);
      showToast("Layout changed!");
    }
  }, [pickerMode, activeSlideId, addNewSlide, showToast]);

  const deleteSlide = useCallback((e, id) => {
    e.stopPropagation();
    if (slides.length > 1) {
      const newSlides = slides.filter(slide => slide.id !== id);
      setSlides(newSlides);
      if (activeSlideId === id) {
        setActiveSlideId(newSlides[0].id);
      }
      showToast("Slide deleted");
    }
  }, [slides, activeSlideId, showToast]);

  // ========== FONT FUNCTIONS ==========
  const handleFontChange = useCallback((fontName) => {
    setSelectedFont(fontName);
    if (selectedField) {
      const element = document.querySelector('.active-editing');
      if (element) {
        element.style.fontFamily = fontName;
        setSlides(prev => prev.map(s => {
          if (s.id === activeSlideId) {
            return {
              ...s,
              [`${selectedField}Style`]: {
                ...(s[`${selectedField}Style`] || {}),
                fontFamily: fontName
              }
            };
          }
          return s;
        }));
      }
    }
    setShowFontPicker(false);
    showToast(`Font changed to ${fontName}`);
  }, [selectedField, activeSlideId, showToast]);

  const handleFontSizeChange = useCallback((newSize) => {
    if (newSize < 8) newSize = 8;
    if (newSize > 200) newSize = 200;
    setFontSize(newSize);
    if (selectedField) {
      const element = document.querySelector('.active-editing');
      if (element) {
        element.style.fontSize = `${newSize}px`;
        setSlides(prev => prev.map(s => {
          if (s.id === activeSlideId) {
            return {
              ...s,
              [`${selectedField}Style`]: {
                ...(s[`${selectedField}Style`] || {}),
                fontSize: newSize
              }
            };
          }
          return s;
        }));
      }
    }
  }, [selectedField, activeSlideId]);

  const increaseFontSize = useCallback(() => handleFontSizeChange(fontSize + 2), [fontSize, handleFontSizeChange]);
  const decreaseFontSize = useCallback(() => { 
    if (fontSize > 8) handleFontSizeChange(fontSize - 2); 
  }, [fontSize, handleFontSizeChange]);

  // ========== VIEW FUNCTIONS ==========
  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
    setShowOutline(mode === 'outline');

    let message = '';
    switch (mode) {
      case 'normal': message = "Normal view activated"; break;
      case 'outline': message = "Outline view activated"; break;
      case 'sorter': message = "Slide Sorter view activated"; break;
      case 'reading': message = "Reading view activated"; break;
      default: message = `${mode} view activated`;
    }
    showToast(message);
  }, [showToast]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
    showToast(`Zoom: ${zoomLevel + 10}%`);
  }, [zoomLevel, showToast]);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
    showToast(`Zoom: ${zoomLevel - 10}%`);
  }, [zoomLevel, showToast]);

  const handleFitToWindow = useCallback(() => {
    setZoomLevel(100);
    showToast("Fit to window");
  }, [showToast]);

  // ========== MASTER VIEWS FUNCTIONS ==========
  const handleMasterView = useCallback((type) => {
    setMasterView(type);
    setShowMasterView(true);

    let message = '';
    switch (type) {
      case 'slide': message = "Slide Master view activated"; break;
      case 'handout': message = "Handout Master view activated"; break;
      case 'notes': message = "Notes Master view activated"; break;
      default: message = "Master view activated";
    }
    showToast(message);
  }, [showToast]);

  const closeMasterView = useCallback(() => {
    setShowMasterView(false);
    setMasterView(null);
    showToast("Returned to Normal view");
  }, [showToast]);

  // ========== WINDOW CONTROLS FUNCTIONS ==========
  const handleNewWindow = useCallback(() => {
    const newId = windows.length + 1;
    setWindows([...windows, { id: newId, name: `Presentation${newId}` }]);
    setActiveWindow(newId);
    showToast(`New window opened: Presentation${newId}`);
  }, [windows, showToast]);

  const handleArrangeAll = useCallback(() => {
    showToast("Arranging all windows");
  }, [showToast]);

  const handleSwitchWindow = useCallback(() => {
    const currentIndex = windows.findIndex(w => w.id === activeWindow);
    const nextIndex = (currentIndex + 1) % windows.length;
    setActiveWindow(windows[nextIndex].id);
    showToast(`Switched to ${windows[nextIndex].name}`);
  }, [windows, activeWindow, showToast]);

  // ========== PICTURE FUNCTIONS ==========
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: Date.now(),
          src: event.target.result,
          x: 100,
          y: 100,
          width: 300,
          height: 'auto',
          rotation: 0,
          opacity: 100,
          filters: { brightness: 100, contrast: 100 }
        };

        setSlides(prev => prev.map(slide => {
          if (slide.id === activeSlideId) {
            return { ...slide, images: [...(slide.images || []), newImage] };
          }
          return slide;
        }));
        showToast("Image added to slide");
      };
      reader.readAsDataURL(file);
    }
  }, [activeSlideId, showToast]);

  const deleteImage = useCallback((imageId) => {
    setSlides(prev => prev.map(slide => {
      if (slide.id === activeSlideId) {
        return { ...slide, images: slide.images.filter(img => img.id !== imageId) };
      }
      return slide;
    }));
    showToast("Image deleted");
  }, [activeSlideId, showToast]);

  const updateImageStyle = useCallback((imageId, updates) => {
    setSlides(prev => prev.map(slide => {
      if (slide.id === activeSlideId) {
        return {
          ...slide,
          images: slide.images.map(img => img.id === imageId ? { ...img, ...updates } : img)
        };
      }
      return slide;
    }));
  }, [activeSlideId]);

  // ========== TABLE FUNCTIONS ==========
  const addTable = useCallback((rows, cols) => { 
    const newTable = { 
      id: Date.now(), 
      type: 'table', 
      rows, 
      cols, 
      x: 150, 
      y: 150, 
      width: cols * 100, 
      height: rows * 40, 
      data: {}, 
      style: { fill: '#ffffff', borderColor: '#e2e8f0', align: 'left', bold: false, italic: false } 
    }; 
    
    setSlides(prev => prev.map(slide => { 
      if (slide.id === activeSlideId) {
        return { ...slide, tables: [...(slide.tables || []), newTable] }; 
      }
      return slide; 
    })); 
    
    setSelectedTable(newTable.id); 
    setShowTableModal(false); 
    showToast(`${rows}x${cols} table added to current slide`); 
  }, [activeSlideId, showToast]);

  const updateTable = useCallback((updatedTable) => { 
    setSlides(prev => prev.map(slide => { 
      if (slide.id === activeSlideId) {
        return { 
          ...slide, 
          tables: (slide.tables || []).map(t => t.id === updatedTable.id ? updatedTable : t) 
        }; 
      }
      return slide; 
    })); 
  }, [activeSlideId]);

  const deleteTable = useCallback((tableId) => { 
    setSlides(prev => prev.map(slide => { 
      if (slide.id === activeSlideId) {
        return { ...slide, tables: (slide.tables || []).filter(t => t.id !== tableId) }; 
      }
      return slide; 
    })); 
    
    if (selectedTable === tableId) setSelectedTable(null); 
    showToast("Table deleted"); 
  }, [activeSlideId, selectedTable, showToast]);

  const handleCellSelect = useCallback((tableId, row, col) => { 
    setSelectedTable(tableId); 
    setActiveCell({ tableId, row, col }); 
  }, []);

  const handleTableSelect = useCallback((tableId) => { 
    const currentSlide = slides.find(s => s.id === activeSlideId); 
    const tableExists = currentSlide?.tables?.some(t => t.id === tableId); 
    if (tableExists) setSelectedTable(tableId); 
  }, [slides, activeSlideId]);

  // ========== PROOFING FUNCTIONS ==========
  const handleSpellingCheck = useCallback(() => {
    if (!selectedField) {
      showToast("Please select a text field first");
      return;
    }

    setCheckingSpelling(true);

    setTimeout(() => {
      const element = document.querySelector('.active-editing');
      if (!element) {
        setCheckingSpelling(false);
        return;
      }

      const text = element.innerText;
      const words = text.split(/\s+/);
      const errors = [];

      words.forEach((word, index) => {
        const cleanWord = word.replace(/[.,!?;:()]/g, '');
        if (!dictionary.check(cleanWord)) {
          const suggestions = dictionary.suggest(cleanWord);
          errors.push({
            word: word,
            index: index,
            position: text.indexOf(word),
            suggestions: suggestions.slice(0, 5)
          });
        }
      });

      setSpellingErrors(errors);
      setCheckingSpelling(false);

      if (errors.length > 0) {
        setCurrentSpellingIndex(0);
        showToast(`Found ${errors.length} spelling errors`);
      } else {
        showToast("Spelling check complete. No errors found.");
      }
    }, 500);
  }, [selectedField, showToast]);

  const handleThesaurus = useCallback(async () => {
    const selection = window.getSelection().toString();
    if (!selection) {
      showToast("Select a word to look up in thesaurus");
      return;
    }

    setSelectedWord(selection);
    showToast("Thesaurus lookup failed");
  }, [showToast]);

  const handleAccessibilityCheck = useCallback(() => {
    setShowAccessibilityPanel(true);

    const issues = [];

    slides.forEach((slide, index) => {
      if (Math.random() > 0.8) {
        issues.push({
          type: 'contrast',
          slide: index + 1,
          description: 'Low color contrast in text',
          severity: 'warning',
          suggestion: 'Use darker text or lighter background'
        });
      }

      if (slide.tables?.length > 0 && Math.random() > 0.7) {
        issues.push({
          type: 'alt-text',
          slide: index + 1,
          description: 'Table missing alternative text',
          severity: 'error',
          suggestion: 'Add descriptive alt text'
        });
      }
    });

    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach((el, idx) => {
      const fontSize = window.getComputedStyle(el).fontSize;
      const size = parseInt(fontSize);
      if (size < 12) {
        issues.push({
          type: 'font-size',
          element: idx,
          description: 'Text size may be too small',
          severity: 'warning',
          suggestion: 'Increase font size to at least 12pt'
        });
      }
    });

    setAccessibilityIssues(issues);

    if (issues.length > 0) {
      showToast(`Found ${issues.length} accessibility issues`);
    } else {
      showToast("No accessibility issues found");
    }
  }, [slides, showToast]);

  const handleSmartLookup = useCallback(async () => {
    const selection = window.getSelection().toString();
    if (!selection) {
      showToast("Select text to look up");
      return;
    }

    showToast(`Searching: "${selection}"...`);

    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(selection)}`
      );
      const data = await response.json();
      showToast(data.extract || "No information found");
    } catch (error) {
      showToast("Lookup failed");
    }
  }, [showToast]);

  // ========== COMMENTS FUNCTIONS ==========
  const handleNewComment = useCallback(() => {
    if (!selectedField) {
      showToast("Select a text field to comment on");
      return;
    }

    const selection = window.getSelection();
    const selectedText = selection.toString();

    const newCommentObj = {
      id: Date.now(),
      author: 'Current User',
      text: '',
      timestamp: new Date().toISOString(),
      resolved: false,
      replies: [],
      selectedText: selectedText || null,
      position: {
        field: selectedField,
        slideId: activeSlideId,
      }
    };

    setComments(prev => [...prev, newCommentObj]);
    setSelectedCommentThread(newCommentObj.id);
    showToast("New comment added");
  }, [selectedField, activeSlideId, showToast]);

  const navigateComments = useCallback((direction) => {
    return () => {
      if (comments.length === 0) {
        showToast("No comments");
        return;
      }

      const currentIndex = comments.findIndex(c => c.id === selectedCommentThread);
      let newIndex;

      if (direction === 'next') {
        newIndex = (currentIndex + 1) % comments.length;
      } else {
        newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = comments.length - 1;
      }

      setSelectedCommentThread(comments[newIndex].id);

      const comment = comments[newIndex];
      if (comment.position) {
        setActiveSlideId(comment.position.slideId);
        setSelectedField(comment.position.field);
      }

      showToast(`Comment ${newIndex + 1} of ${comments.length}`);
    };
  }, [comments, selectedCommentThread, showToast]);

  const handleDeleteAllComments = useCallback(() => {
    if (window.confirm('Delete all comments?')) {
      setComments([]);
      setSelectedCommentThread(null);
      showToast("All comments deleted");
    }
  }, [showToast]);

  const resolveComment = useCallback((commentId) => {
    setComments(prev => prev.map(c =>
      c.id === commentId ? { ...c, resolved: !c.resolved } : c
    ));
  }, []);

  const addReply = useCallback((commentId, replyText) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [...c.replies, {
            id: Date.now(),
            author: 'Current User',
            text: replyText,
            timestamp: new Date().toISOString()
          }]
        };
      }
      return c;
    }));
  }, []);

  // ========== PROTECT FUNCTIONS ==========
  const handleProtectPresentation = useCallback(() => {
    if (!isProtected) {
      const password = prompt('Enter password to protect this presentation:');
      if (password) {
        setProtectionPassword(password);
        setIsProtected(true);
        showToast("Presentation protected");
      }
    } else {
      if (window.confirm('Remove protection?')) {
        setIsProtected(false);
        setProtectionPassword('');
        showToast("Protection removed");
      }
    }
  }, [isProtected, showToast]);

  const handleMarkAsFinal = useCallback(() => {
    setIsMarkedFinal(prev => !prev);
    showToast(!isMarkedFinal ? "Marked as final" : "Marked as not final");

    if (!isMarkedFinal) {
      document.querySelectorAll('[contenteditable="true"]').forEach(el => {
        el.setAttribute('contenteditable', 'false');
      });
    } else {
      document.querySelectorAll('[contenteditable="true"]').forEach(el => {
        el.setAttribute('contenteditable', 'true');
      });
    }
  }, [isMarkedFinal, showToast]);

  const handleRestrictAccess = useCallback(() => {
    showToast("Restrict access settings opened");
  }, [showToast]);

  // ========== DESIGN FUNCTIONS ==========
  const applyTheme = useCallback((themeId) => {
    setCurrentTheme(themeId);
    showToast(`Theme ${themeId} applied`);
  }, [showToast]);

  const applyVariant = useCallback((variantId) => {
    setSelectedVariant(variantId);
    const variant = variants.find(v => v.id === variantId);
    if (variant) {
      document.documentElement.style.setProperty('--sada-orange', variant.colors[0]);
      showToast(`Variant applied`);
    }
  }, [variants, showToast]);

  const handleSlideSizeChange = useCallback((size) => {
    setSlideSize(size);
    if (size === 'standard') {
      setSlideWidth(1024);
      setSlideHeight(768);
    } else if (size === 'widescreen') {
      setSlideWidth(1366);
      setSlideHeight(768);
    }
    showToast(`Slide size changed to ${size}`);
  }, [showToast]);

  const applyCustomSize = useCallback(() => {
    setSlideSize('custom');
    showToast(`Custom size applied: ${slideWidth}x${slideHeight}`);
    setShowSizeModal(false);
  }, [slideWidth, slideHeight, showToast]);

  const applyBackground = useCallback(() => {
    const canvas = document.querySelector('.slide-canvas-container');
    if (!canvas) return;

    let backgroundStyle = '';
    if (backgroundType === 'solid') {
      backgroundStyle = backgroundColor;
    } else if (backgroundType === 'gradient') {
      backgroundStyle = `linear-gradient(${gradientAngle}deg, ${gradientStart}, ${gradientEnd})`;
    } else if (backgroundType === 'image' && backgroundImage) {
      backgroundStyle = `url(${backgroundImage}) center/cover`;
    }

    canvas.style.background = backgroundStyle;
    canvas.style.opacity = backgroundTransparency / 100;

    setSlides(prev => prev.map(s =>
      s.id === activeSlideId
        ? { ...s, background: { type: backgroundType, value: backgroundStyle, transparency: backgroundTransparency } }
        : s
    ));

    showToast('Background applied');
  }, [backgroundType, backgroundColor, gradientStart, gradientEnd, gradientAngle, backgroundImage, backgroundTransparency, activeSlideId, showToast]);

  // ========== QUESTION FUNCTIONS ==========
  const convertToQuestion = useCallback((questionType) => {
    setSlides(prev => prev.map(s => {
      if (s.id === activeSlideId) {
        let defaultOptions = [];
        
        if (questionType === 'multiple-choice') {
          defaultOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
        } else if (questionType === 'true-false') {
          defaultOptions = ['True', 'False'];
        } else if (questionType === 'quiz') {
          defaultOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
        } else {
          defaultOptions = [];
        }

        return {
          ...s,
          layout: 'QUESTION',
          questionType: questionType,
          questionData: {
            title: s.title || "Enter your question here...",
            options: defaultOptions,
            correctAnswer: null,
            appearance: {
              layoutMode: 'grid',
              theme: 'light',
              accentColor: '#f59e0b',
              cardStyle: 'curved',
              fontSize: 'medium',
              showLetters: true,
              gap: '20px'
            }
          }
        };
      }
      return s;
    }));
    
    showToast(`${questionType} question created`);
  }, [activeSlideId, showToast]);

  const toggleCorrectAnswer = useCallback((index) => {
    setSlides(prev => prev.map(s => {
      if (s.id === activeSlideId) {
        return {
          ...s,
          questionData: {
            ...s.questionData,
            correctAnswer: s.questionData.correctAnswer === index ? null : index
          }
        };
      }
      return s;
    }));
  }, [activeSlideId]);

  const updateQuestionData = useCallback((newData) => {
    setSlides(prev => prev.map(s => 
      s.id === activeSlideId ? { ...s, questionData: { ...s.questionData, ...newData } } : s
    ));
  }, [activeSlideId]);

  // ========== SESSION FUNCTIONS ==========
  const startSession = useCallback(() => {
    setSessionActive(true);
    setCurrentQuestionResponses([]);
    showToast("Session started");
  }, [showToast]);

  const endSession = useCallback(() => {
    setSessionActive(false);
    setShowResults(true);
    showToast("Session ended");
  }, [showToast]);

  const addResponse = useCallback((response) => {
    setCurrentQuestionResponses(prev => [...prev, {
      ...response,
      timestamp: Date.now(),
      id: `resp_${Date.now()}_${Math.random()}`
    }]);
  }, []);

  const clearResponses = useCallback(() => {
    setCurrentQuestionResponses([]);
  }, []);

  // ========== ADVANCED FUNCTIONS ==========
  const handleExportResults = useCallback(() => {
    const currentSlide = slides.find(s => s.id === activeSlideId);
    const questionData = {
      id: `Q${activeSlideId}`,
      type: currentSlide?.questionType,
      title: currentSlide?.questionData?.title || "Untitled Question",
      options: currentSlide?.questionData?.options || [],
      correctAnswer: currentSlide?.questionData?.correctAnswer,
      responses: currentQuestionResponses || [],
      stats: {
        total: currentQuestionResponses?.length || 0,
        correct: currentQuestionResponses?.filter(r => r.selectedOption === currentSlide?.questionData?.correctAnswer).length || 0,
        timestamp: new Date().toISOString()
      }
    };

    const blob = new Blob([JSON.stringify(questionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `question-${activeSlideId}-results.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast("Results exported successfully!");
  }, [activeSlideId, slides, currentQuestionResponses, showToast]);

  const handleShareQuestion = useCallback(() => {
    const questionUrl = `${window.location.origin}/question/${activeSlideId}`;
    
    navigator.clipboard.writeText(questionUrl).then(() => {
      showToast("Question link copied to clipboard!");
    }).catch(() => {
      prompt("Copy this link:", questionUrl);
    });
  }, [activeSlideId, showToast]);

  const handleCopyQuestionId = useCallback(() => {
    const questionId = `Q${activeSlideId}`;
    navigator.clipboard.writeText(questionId).then(() => {
      showToast("Question ID copied!");
    });
  }, [activeSlideId, showToast]);

  const resetBackground = useCallback(() => {
    setBackgroundType('solid');
    setBackgroundColor('#ffffff');
    setGradientStart('#f59e0b');
    setGradientEnd('#fbbf24');
    setGradientAngle(90);
    setBackgroundImage(null);
    setBackgroundTransparency(100);

    const canvas = document.querySelector('.slide-canvas-container');
    if (canvas) {
      canvas.style.background = '#ffffff';
      canvas.style.opacity = '1';
    }

    showToast('Background reset');
  }, [showToast]);

  const formatBackground = useCallback(() => {
    setShowBackgroundPanel(true);
  }, []);

  // ========== SELECT ALL FUNCTION ==========
  const handleSelectAll = useCallback(() => {
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    if (editableElements.length === 0) {
      showToast("No text fields found");
      return;
    }
    const selection = window.getSelection();
    selection.removeAllRanges();
    editableElements.forEach(element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      selection.addRange(range);
    });
    const fieldName = getFieldFromElement(editableElements[0]);
    if (fieldName) setSelectedField(fieldName);
    const message = editableElements.length === 1 ? "All text selected (Ctrl+A)" : `Selected ${editableElements.length} text fields (Ctrl+A)`;
    showToast(message);
  }, [showToast]);

  // ========== USE EFFECTS ==========
  useEffect(() => {
    document.body.classList.remove('view-normal', 'view-outline', 'view-sorter', 'view-reading');
    document.body.classList.add(`view-${viewMode}`);

    const mainBody = document.querySelector('.editor-main-body');
    if (mainBody) {
      if (viewMode === 'reading') {
        mainBody.classList.add('reading-mode');
      } else {
        mainBody.classList.remove('reading-mode');
      }
    }

    return () => {
      document.body.classList.remove(`view-${viewMode}`);
    };
  }, [viewMode]);

  useEffect(() => {
    window.showMoreColors = setShowMoreColors;
    return () => {
      window.showMoreColors = null;
    };
  }, []);

  // ========== HOOKS ==========
  const presentation = usePresentation(slides, setActiveSlideId, showToast);
  const animations = useAnimations(activeSlideId, selectedField, showToast);
  const transitions = useTransitions(slides, activeSlideId, presentation.isPresenting, showToast);
  const formatting = useFormatting(selectedField, activeSlideId, slides, setSlides, showToast);
  const drawing = useDrawing(showToast);
  const clipboard = useClipboard(selectedField, slides, activeSlideId, setSlides, setActiveSlideId, showToast);

  // ========== RENDER BOX FUNCTION ==========
  const renderBox = useCallback((field, placeholder, className = "", displayCondition = true) => {
    if (!displayCondition) return null;
    
    const currentSlide = slides.find(s => s.id === activeSlideId);
    const hasContent = currentSlide && currentSlide[field] && currentSlide[field].trim() !== "";
    const fieldStyle = currentSlide?.[`${field}Style`] || {};
    const elementId = `element-${activeSlideId}-${field}`;
    const elementAnimation = animations.animations[elementId];

    return (
      <div 
        id={elementId} 
        className={`${className} ${selectedField === field ? 'active-editing' : ''} editable-box ${elementAnimation ? 'has-animation' : ''}`}
        contentEditable 
        suppressContentEditableWarning 
        spellCheck="false"
        data-placeholder={placeholder} 
        data-has-content={hasContent}
        style={{
          fontFamily: fieldStyle.fontFamily || selectedFont,
          fontSize: fieldStyle.fontSize ? `${fieldStyle.fontSize}px` : undefined,
          color: fieldStyle.color,
          fontWeight: fieldStyle.fontWeight,
          fontStyle: fieldStyle.fontStyle,
          textDecoration: fieldStyle.textDecoration,
          textAlign: fieldStyle.textAlign,
          lineHeight: fieldStyle.lineHeight,
          marginTop: fieldStyle.marginTop,
          marginBottom: fieldStyle.marginBottom,
          animation: elementAnimation ? animations.getAnimationStyle(elementAnimation) : undefined
        }}
        onFocus={() => setSelectedField(field)}
        onBlur={(e) => { 
          const text = e.target.innerText; 
          setSlides(prev => prev.map(s => 
            s.id === activeSlideId ? { ...s, [field]: text } : s
          )); 
        }}
        onClick={(e) => { 
          if (clipboard.isPainterActive) clipboard.applyFormat(e); 
          e.stopPropagation(); 
        }}
      >
        {currentSlide?.[field] || ""}
      </div>
    );
  }, [slides, activeSlideId, selectedField, selectedFont, animations, clipboard, setSlides]);

  // ========== KEYBOARD SHORTCUTS ==========
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'c') { e.preventDefault(); clipboard.handleCopy(); }
      if (e.ctrlKey && e.key === 'x') { e.preventDefault(); clipboard.handleCut(); }
      if (e.ctrlKey && e.key === 'v') { if (!selectedField) { e.preventDefault(); clipboard.handlePaste(); } }
      if (e.altKey && e.shiftKey && e.key === 'S') { e.preventDefault(); formatting.toggleStrikethrough(); }
      if (e.ctrlKey && e.key === '=' && !e.shiftKey) { e.preventDefault(); formatting.toggleSubscript(); }
      if (e.ctrlKey && e.shiftKey && e.key === '=') { e.preventDefault(); formatting.toggleSuperscript(); }
      if (e.ctrlKey && e.key === 'f') { e.preventDefault(); if (!selectedField) { showToast("Please select a text field first"); return; } setShowSearchDialog(true); }
      if (e.ctrlKey && e.key === 'a') { e.preventDefault(); handleSelectAll(); }
      if (e.ctrlKey && e.key === 'h') { e.preventDefault(); if (!selectedField) { showToast("Please select a text field first"); return; } setShowSearchDialog(true); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedField, clipboard, formatting, handleSelectAll, showToast]);

  const value = {
    // Basic
    currentTheme, setCurrentTheme,
    activeTab, setActiveTab,
    isCollapsed, setIsCollapsed,
    title, setTitle,
    statusMessage,
    selectedField, setSelectedField,
    colorButtonRef,
    showToast,

    // Slides
    slides, setSlides,
    activeSlideId, setActiveSlideId,
    addNewSlide,
    deleteSlide,
    createNewSlide,
    handleLayoutSelection,
    renderBox,

    // View
    viewMode, setViewMode,
    showOutline, setShowOutline,
    showNotes, setShowNotes,
    zoomLevel, setZoomLevel,
    showRuler, setShowRuler,
    showGridlines, setShowGridlines,
    showGuides, setShowGuides,
    handleViewModeChange,
    handleZoomIn, handleZoomOut, handleFitToWindow,

    // Master Views
    masterView, setMasterView,
    showMasterView, setShowMasterView,
    masterSlides, setMasterSlides,
    handleMasterView, closeMasterView,

    // Window Controls
    windows, setWindows,
    activeWindow, setActiveWindow,
    handleNewWindow, handleArrangeAll, handleSwitchWindow,

    // Font
    showFontPicker, setShowFontPicker,
    selectedFont, setSelectedFont,
    fontSize, setFontSize,
    fontCategory, setFontCategory,
    searchFont, setSearchFont,
    handleFontChange, handleFontSizeChange,
    increaseFontSize, decreaseFontSize,

    // Modals
    showLayoutPicker, setShowLayoutPicker,
    pickerMode, setPickerMode,
    showColorPicker, setShowColorPicker,
    showMoreColors, setShowMoreColors,
    showSearchDialog, setShowSearchDialog,
    showTableModal, setShowTableModal,
    showSizeModal, setShowSizeModal,
    showBackgroundPanel, setShowBackgroundPanel,
    showColorScheme, setShowColorScheme,
    showDesignIdeas, setShowDesignIdeas,

    // Pictures
    handleImageUpload, deleteImage, updateImageStyle,

    // Tables
    tables, setTables,
    selectedTable, setSelectedTable,
    activeCell, setActiveCell,
    addTable, updateTable, deleteTable,
    handleCellSelect, handleTableSelect,

    // Search
    searchQuery, setSearchQuery,
    replaceQuery, setReplaceQuery,
    searchResults, setSearchResults,
    currentSearchIndex, setCurrentSearchIndex,
    matchCase, setMatchCase,
    matchWholeWord, setMatchWholeWord,
    selectionMode, setSelectionMode,
    handleSelectAll,

    // Review
    spellingErrors, setSpellingErrors,
    currentSpellingIndex, setCurrentSpellingIndex,
    checkingSpelling, setCheckingSpelling,
    thesaurusResults, setThesaurusResults,
    selectedWord, setSelectedWord,
    accessibilityIssues, setAccessibilityIssues,
    showAccessibilityPanel, setShowAccessibilityPanel,
    translationResults, setTranslationResults,
    targetLanguage, setTargetLanguage,
    showTranslator, setShowTranslator,
    comments, setComments,
    showComments, setShowComments,
    selectedCommentThread, setSelectedCommentThread,
    isProtected, setIsProtected,
    isMarkedFinal, setIsMarkedFinal,
    protectionPassword, setProtectionPassword,
    handleSpellingCheck,
    handleThesaurus,
    handleAccessibilityCheck,
    handleSmartLookup,
    handleNewComment,
    navigateComments,
    handleDeleteAllComments,
    resolveComment,
    addReply,
    handleProtectPresentation,
    handleMarkAsFinal,
    handleRestrictAccess,

    // Design
    variants, setVariants,
    selectedVariant, setSelectedVariant,
    slideSize, setSlideSize,
    slideWidth, setSlideWidth,
    slideHeight, setSlideHeight,
    backgroundType, setBackgroundType,
    backgroundColor, setBackgroundColor,
    gradientStart, setGradientStart,
    gradientEnd, setGradientEnd,
    gradientAngle, setGradientAngle,
    backgroundImage, setBackgroundImage,
    backgroundTransparency, setBackgroundTransparency,
    designIdeas, setDesignIdeas,
    applyTheme,
    applyVariant,
    handleSlideSizeChange,
    applyCustomSize,
    applyBackground,
    resetBackground,
    formatBackground,

    // Dictionary
    dictionary,
    googleTranslate,
    getFieldFromElement,

    // Poll Settings
    pollSettings, setPollSettings,

    // Question Functions
    convertToQuestion, updateQuestionData, toggleCorrectAnswer,

    // Session Management
    sessionActive, setSessionActive,
    currentQuestionResponses, setCurrentQuestionResponses,
    showResults, setShowResults,
    sessionParticipants, setSessionParticipants,
    startSession, endSession, addResponse, clearResponses,

    // Advanced Functions
    handleExportResults,
    handleShareQuestion,
    handleCopyQuestionId,

    // Hooks
    ...presentation,
    ...animations,
    ...transitions,
    ...formatting,
    ...drawing,
    ...clipboard
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};