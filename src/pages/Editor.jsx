// import React, { useState } from 'react';
// import ReactDOM from 'react-dom';
// import ThemeManager from '../templates/ThemeManager';
// import {
//   ChevronLeft, Play, Eye, Share2, Download, Copy, Save, CheckCircle2, MoreVertical, Search,
//   PlusSquare, Layout, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
//   Type, ChevronDown, List, ListOrdered, CaseSensitive, Palette, ChevronUp, RotateCcw,
//   Columns, Eraser, Baseline, Highlighter, ArrowLeftRight, PaintBucket, Layers,
//   Sparkles, Mic, Replace, Table, Image, Video, Music, Square, Smile,
//   Cloud, MessageSquare, CheckSquare, Trophy, Zap, BarChart2, PieChart, Timer, HelpCircle,
//   Languages, MessageSquarePlus, ZoomIn, Maximize2, Monitor, Grid, Ruler, EyeOff,
//   CheckCircle, Globe, Accessibility, Trash2, Plus,
//   Clipboard, Scissors, PaintRoller, Outdent, Indent, MousePointer2,
//   Link, Hash, Sigma, PenTool, ArrowUp, ArrowDown, Settings2, Users, Target, Activity, Award,
//   Settings, Sliders, Lightbulb, FileQuestion, TrendingUp, ImagePlus, ListChecks, ChevronRight, Lock,
//   BookOpen, LayoutTemplate, Printer, StickyNote, AppWindow, PanelRight, PanelLeft, QrCode,
//   Presentation, MonitorPlay, Airplay, XCircle, AlertTriangle, Info, Send, Move, MoveHorizontal, MoveVertical,
//   Minimize, Maximize, RotateCw, FlipHorizontal, FlipVertical, CornerDownRight, CornerRightUp,
//   Radius, Circle, Diamond, Octagon, Hexagon, Star, Heart, Square as SquareIcon
// } from 'lucide-react';
// import '../styles/Editor.css';

// // ========== GOOGLE TRANSLATE API ==========
// const googleTranslate = async (text, options) => {
//   const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${options.to}&dt=t&q=${encodeURIComponent(text)}`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     return { text: data[0][0][0] };
//   } catch (error) {
//     console.error("Translation error:", error);
//     throw error;
//   }
// };

// // ========== TYPO JS FOR SPELLING ==========
// import Typo from 'typo-js';
// const dictionary = new Typo('en_US');

// const ColorPickerPortal = ({ children, isOpen }) => {
//   if (!isOpen) return null;

//   return ReactDOM.createPortal(
//     <div className="color-picker-portal-container" style={{ position: 'relative' }}>
//       {children}
//     </div>,
//     document.body
//   );
// };

// const Editor = () => {
//   const query = new URLSearchParams(window.location.search);
//   const initialTheme = parseInt(query.get('templateId')) ?? 0;

//   // ========== STATE DEFINITIONS ==========
//   const [currentTheme, setCurrentTheme] = useState(initialTheme);
//   const [activeTab, setActiveTab] = useState("Home");
//   const [isCollapsed, setIsCollapsed] = useState(true);
//   const [title, setTitle] = useState("First Presentation");
//   const [statusMessage, setStatusMessage] = useState("");
//   const [showLayoutPicker, setShowLayoutPicker] = useState(false);
//   const [pickerMode, setPickerMode] = useState('add');
//   const [selectedField, setSelectedField] = useState(null);
//   const [clipboardItem, setClipboardItem] = useState(null);
//   const [painterStyle, setPainterStyle] = useState(null);
//   const [isPainterActive, setIsPainterActive] = useState(false);
//   const [copiedSlide, setCopiedSlide] = useState(null);

//   // ========== VIEW STATES ==========
//   const [viewMode, setViewMode] = useState('normal');
//   const [showOutline, setShowOutline] = useState(false);
//   const [showNotes, setShowNotes] = useState(false);
//   const [zoomLevel, setZoomLevel] = useState(100);
//   const [showRuler, setShowRuler] = useState(false);
//   const [showGridlines, setShowGridlines] = useState(false);
//   const [showGuides, setShowGuides] = useState(false);

//   // ========== MASTER VIEWS STATES ==========
//   const [masterView, setMasterView] = useState(null);
//   const [showMasterView, setShowMasterView] = useState(false);
//   const [masterSlides, setMasterSlides] = useState([
//     {
//       id: 'master-1',
//       type: 'slide-master',
//       title: "Master Title Style",
//       subtitle: "Master Subtitle Style",
//       content: "Master Content Style",
//       background: "#ffffff",
//       colors: ['#f59e0b', '#1e293b', '#64748b', '#ef4444', '#10b981'],
//       fonts: { title: 'Calibri', body: 'Calibri' }
//     }
//   ]);

//   // ========== WINDOW CONTROLS STATES ==========
//   const [windows, setWindows] = useState([{ id: 1, name: 'Presentation1' }]);
//   const [activeWindow, setActiveWindow] = useState(1);

//   // ========== FONT RELATED STATES ==========
//   const [availableFonts, setAvailableFonts] = useState([
//     { name: 'Aptos', category: 'Sans Serif', popular: true },
//     { name: 'Calibri', category: 'Sans Serif', popular: true },
//     { name: 'Arial', category: 'Sans Serif', popular: true },
//     { name: 'Segoe UI', category: 'Sans Serif', popular: true },
//     { name: 'Helvetica', category: 'Sans Serif', popular: true },
//     { name: 'Verdana', category: 'Sans Serif', popular: true },
//     { name: 'Tahoma', category: 'Sans Serif', popular: true },
//     { name: 'Trebuchet MS', category: 'Sans Serif', popular: false },
//     { name: 'Montserrat', category: 'Sans Serif', popular: true },
//     { name: 'Open Sans', category: 'Sans Serif', popular: true },
//     { name: 'Roboto', category: 'Sans Serif', popular: true },
//     { name: 'Lato', category: 'Sans Serif', popular: true },
//     { name: 'Poppins', category: 'Sans Serif', popular: true },
//     { name: 'Inter', category: 'Sans Serif', popular: true },
//     { name: 'Source Sans Pro', category: 'Sans Serif', popular: false },
//     { name: 'Ubuntu', category: 'Sans Serif', popular: false },
//     { name: 'Oswald', category: 'Sans Serif', popular: false },
//     { name: 'Times New Roman', category: 'Serif', popular: true },
//     { name: 'Georgia', category: 'Serif', popular: true },
//     { name: 'Garamond', category: 'Serif', popular: true },
//     { name: 'Cambria', category: 'Serif', popular: true },
//     { name: 'Merriweather', category: 'Serif', popular: true },
//     { name: 'Playfair Display', category: 'Serif', popular: true },
//     { name: 'Lora', category: 'Serif', popular: true },
//     { name: 'Roboto Slab', category: 'Serif', popular: true },
//     { name: 'Impact', category: 'Display', popular: true },
//     { name: 'Bebas Neue', category: 'Display', popular: true },
//     { name: 'Abril Fatface', category: 'Display', popular: true },
//     { name: 'Lobster', category: 'Display', popular: true },
//     { name: 'Pacifico', category: 'Display', popular: true },
//     { name: 'Consolas', category: 'Monospace', popular: true },
//     { name: 'Courier New', category: 'Monospace', popular: true },
//     { name: 'Fira Code', category: 'Monospace', popular: true },
//     { name: 'Roboto Mono', category: 'Monospace', popular: true },
//     { name: 'Source Code Pro', category: 'Monospace', popular: true },
//     { name: 'Comic Sans MS', category: 'Cursive', popular: false },
//     { name: 'Brush Script MT', category: 'Cursive', popular: false },
//     { name: 'Dancing Script', category: 'Cursive', popular: true },
//     { name: 'Caveat', category: 'Cursive', popular: true }
//   ]);

//   const [showFontPicker, setShowFontPicker] = useState(false);
//   const [selectedFont, setSelectedFont] = useState('Calibri');
//   const [fontSize, setFontSize] = useState(44);
//   const [fontCategory, setFontCategory] = useState('all');
//   const [searchFont, setSearchFont] = useState('');

//   // ========== TEXT FORMATTING STATES ==========
//   const [isBold, setIsBold] = useState(false);
//   const [isItalic, setIsItalic] = useState(false);
//   const [isUnderline, setIsUnderline] = useState(false);
//   const [isStrikethrough, setIsStrikethrough] = useState(false);
//   const [isSubscript, setIsSubscript] = useState(false);
//   const [isSuperscript, setIsSuperscript] = useState(false);
//   const [textColor, setTextColor] = useState('#1e293b');
//   const [showColorPicker, setShowColorPicker] = useState(false);
//   const [recentColors, setRecentColors] = useState([
//     '#1e293b', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'
//   ]);

//   const [showMoreColors, setShowMoreColors] = useState(false);
//   const [customColor, setCustomColor] = useState('#1e293b');
//   const [customColorHex, setCustomColorHex] = useState('1e293b');
//   const [customColorRgb, setCustomColorRgb] = useState({ r: 30, g: 41, b: 59 });
//   const colorButtonRef = React.useRef(null);

//   // ========== PARAGRAPH STATES ==========
//   const [alignment, setAlignment] = useState('left');
//   const [listType, setListType] = useState(null);
//   const [indentLevel, setIndentLevel] = useState(0);
//   const [lineSpacing, setLineSpacing] = useState('1.0');
//   const [paragraphSpacing, setParagraphSpacing] = useState({ before: 0, after: 0 });
//   const [showAdvancedPicker, setShowAdvancedPicker] = useState(false);
//   const [highlightColor, setHighlightColor] = useState('transparent');

//   // ========== DRAWING STATES ==========
//   const [shapes, setShapes] = useState([]);
//   const [selectedShape, setSelectedShape] = useState(null);
//   const [shapeType, setShapeType] = useState('rectangle');
//   const [shapeFill, setShapeFill] = useState('#f59e0b');
//   const [shapeOutline, setShapeOutline] = useState('#1e293b');
//   const [outlineWidth, setOutlineWidth] = useState(2);
//   const [shapeOpacity, setShapeOpacity] = useState(100);
//   const [rotation, setRotation] = useState(0);
//   const [shapeEffects, setShapeEffects] = useState({
//     shadow: false,
//     glow: false,
//     reflection: false,
//     softEdges: false
//   });
//   const [arrangeMode, setArrangeMode] = useState(null);

//   // ========== EDITING FUNCTIONS ==========
//   const [searchQuery, setSearchQuery] = useState('');
//   const [replaceQuery, setReplaceQuery] = useState('');
//   const [showSearchDialog, setShowSearchDialog] = useState(false);
//   const [searchResults, setSearchResults] = useState([]);
//   const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
//   const [matchCase, setMatchCase] = useState(false);
//   const [matchWholeWord, setMatchWholeWord] = useState(false);
//   const [selectionMode, setSelectionMode] = useState('normal');

//   // ========== TABLE STATES ==========
//   const [tables, setTables] = useState([]);
//   const [showTableModal, setShowTableModal] = useState(false);
//   const [tableConfig, setTableConfig] = useState({ rows: 3, cols: 3 });
//   const [selectedTable, setSelectedTable] = useState(null);
//   const [activeCell, setActiveCell] = useState(null);

//   // ========== REVIEW TAB STATES ==========
//   const [spellingErrors, setSpellingErrors] = useState([]);
//   const [currentSpellingIndex, setCurrentSpellingIndex] = useState(-1);
//   const [spellingSuggestions, setSpellingSuggestions] = useState([]);
//   const [checkingSpelling, setCheckingSpelling] = useState(false);
//   const [thesaurusResults, setThesaurusResults] = useState([]);
//   const [selectedWord, setSelectedWord] = useState('');
//   const [accessibilityIssues, setAccessibilityIssues] = useState([]);
//   const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
//   const [translationResults, setTranslationResults] = useState([]);
//   const [targetLanguage, setTargetLanguage] = useState('ar');
//   const [showTranslator, setShowTranslator] = useState(false);
//   const [comments, setComments] = useState([]);
//   const [showComments, setShowComments] = useState(false);
//   const [newComment, setNewComment] = useState('');
//   const [selectedCommentThread, setSelectedCommentThread] = useState(null);
//   const [isProtected, setIsProtected] = useState(false);
//   const [isMarkedFinal, setIsMarkedFinal] = useState(false);
//   const [protectionPassword, setProtectionPassword] = useState('');

//   // ========== SLIDE SHOW STATES ==========
//   const [isPresenting, setIsPresenting] = useState(false);
//   const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
//   const [presenterMode, setPresenterMode] = useState(false);
//   const [showPresenterTools, setShowPresenterTools] = useState(false);
//   const [presenterNotes, setPresenterNotes] = useState({});
//   const [presentationTimer, setPresentationTimer] = useState(0);
//   const [isTimerRunning, setIsTimerRunning] = useState(false);
//   const [showTimer, setShowTimer] = useState(false);
//   const [selectedMonitor, setSelectedMonitor] = useState('auto');
//   const [availableMonitors, setAvailableMonitors] = useState([]);
//   const [rehearseMode, setRehearseMode] = useState(false);
//   const [slideTimings, setSlideTimings] = useState({});
//   const [recordingMode, setRecordingMode] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [hideSlide, setHideSlide] = useState({});
//   const [loopMode, setLoopMode] = useState(false);
//   const [showMediaControls, setShowMediaControls] = useState(false);
//   const [laserPointer, setLaserPointer] = useState({ visible: false, x: 0, y: 0 });
//   const [penMode, setPenMode] = useState(false);
//   const [penColor, setPenColor] = useState('#f59e0b');
//   const [penSize, setPenSize] = useState(2);
//   const [drawingPaths, setDrawingPaths] = useState([]);
//   const [currentPath, setCurrentPath] = useState([]);

//   // ========== ANIMATION STATES ==========
//   const [animations, setAnimations] = useState({}); // { elementId: { type, duration, delay, ... } }
//   const [animationPane, setAnimationPane] = useState([]);
//   const [showAnimationPane, setShowAnimationPane] = useState(false);
//   const [selectedAnimation, setSelectedAnimation] = useState(null);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [animationPreview, setAnimationPreview] = useState(false);
//   const [animationTypes] = useState({
//     entrance: [
//       { id: 'fade', name: 'Fade', category: 'entrance' },
//       { id: 'fly-in', name: 'Fly In', category: 'entrance' },
//       { id: 'float-in', name: 'Float In', category: 'entrance' },
//       { id: 'zoom-in', name: 'Zoom In', category: 'entrance' },
//       { id: 'bounce', name: 'Bounce', category: 'entrance' },
//       { id: 'peek', name: 'Peek', category: 'entrance' },
//       { id: 'slide', name: 'Slide', category: 'entrance' },
//       { id: 'swivel', name: 'Swivel', category: 'entrance' }
//     ],
//     emphasis: [
//       { id: 'pulse', name: 'Pulse', category: 'emphasis' },
//       { id: 'spin', name: 'Spin', category: 'emphasis' },
//       { id: 'grow', name: 'Grow/Shrink', category: 'emphasis' },
//       { id: 'shake', name: 'Shake', category: 'emphasis' },
//       { id: 'wave', name: 'Wave', category: 'emphasis' },
//       { id: 'glow', name: 'Glow', category: 'emphasis' },
//       { id: 'flash', name: 'Flash', category: 'emphasis' },
//       { id: 'teeter', name: 'Teeter', category: 'emphasis' }
//     ],
//     exit: [
//       { id: 'fade-out', name: 'Fade Out', category: 'exit' },
//       { id: 'fly-out', name: 'Fly Out', category: 'exit' },
//       { id: 'float-out', name: 'Float Out', category: 'exit' },
//       { id: 'zoom-out', name: 'Zoom Out', category: 'exit' },
//       { id: 'collapse', name: 'Collapse', category: 'exit' },
//       { id: 'disappear', name: 'Disappear', category: 'exit' }
//     ],
//     motion: [
//       { id: 'arc', name: 'Arc', category: 'motion' },
//       { id: 'curve', name: 'Curve', category: 'motion' },
//       { id: 'loop', name: 'Loop', category: 'motion' },
//       { id: 'custom', name: 'Custom Path', category: 'motion' }
//     ]
//   });

//   const [currentAnimationCategory, setCurrentAnimationCategory] = useState('entrance');
//   const [animationDuration, setAnimationDuration] = useState(0.5);
//   const [animationDelay, setAnimationDelay] = useState(0);
//   const [animationRepeat, setAnimationRepeat] = useState(1);
//   const [animationDirection, setAnimationDirection] = useState('normal');
//   const [animationFillMode, setAnimationFillMode] = useState('none');
//   const [animationEasing, setAnimationEasing] = useState('ease');
//   const [animationTrigger, setAnimationTrigger] = useState('on-click');
//   const [animationOrder, setAnimationOrder] = useState([]);

//   // ========== TRANSITION STATES ==========
//   const [transitions, setTransitions] = useState({}); // { slideId: { type, duration, sound, advanceOnClick, advanceAfter } }
//   const [selectedTransition, setSelectedTransition] = useState('none');
//   const [transitionDuration, setTransitionDuration] = useState(1.0);
//   const [transitionSound, setTransitionSound] = useState('');
//   const [advanceOnClick, setAdvanceOnClick] = useState(true);
//   const [advanceAfter, setAdvanceAfter] = useState(0);
//   const [applyToAll, setApplyToAll] = useState(false);
//   const [previewTransition, setPreviewTransition] = useState(false);
//   const [transitioning, setTransitioning] = useState(false);
//   const [transitionCategory, setTransitionCategory] = useState('all');
//   const [availableSounds] = useState([
//     '[No Sound]',
//     'Applause',
//     'Click',
//     'Drum Roll',
//     'Whoosh',
//     'Chime',
//     'Breeze',
//     'Camera',
//     'Cash Register',
//     'Explosion',
//     'Glass',
//     'Laser',
//     'Push',
//     'Swoosh',
//     'Typewriter',
//     'Wind'
//   ]);

//   const [transitionTypes] = useState([
//     { id: 'none', name: 'None', category: 'basic' },
//     { id: 'fade', name: 'Fade', category: 'basic' },
//     { id: 'wipe', name: 'Wipe', category: 'basic' },
//     { id: 'dissolve', name: 'Dissolve', category: 'basic' },
//     { id: 'push', name: 'Push', category: 'dynamic' },
//     { id: 'morph', name: 'Morph', category: 'dynamic' },
//     { id: 'split', name: 'Split', category: 'dynamic' },
//     { id: 'uncover', name: 'Uncover', category: 'dynamic' },
//     { id: 'cover', name: 'Cover', category: 'dynamic' },
//     { id: 'zoom', name: 'Zoom', category: 'dynamic' },
//     { id: 'switch', name: 'Switch', category: 'dynamic' },
//     { id: 'flip', name: 'Flip', category: 'dynamic' },
//     { id: 'gallery', name: 'Gallery', category: 'dynamic' },
//     { id: 'comb', name: 'Comb', category: 'dynamic' },
//     { id: 'rotate', name: 'Rotate', category: 'dynamic' },
//     { id: 'window', name: 'Window', category: 'dynamic' },
//     { id: 'flash', name: 'Flash', category: 'exciting' },
//     { id: 'fall', name: 'Fall', category: 'exciting' },
//     { id: 'glitter', name: 'Glitter', category: 'exciting' },
//     { id: 'ripple', name: 'Ripple', category: 'exciting' },
//     { id: 'honeycomb', name: 'Honeycomb', category: 'exciting' },
//     { id: 'glow', name: 'Glow', category: 'exciting' },
//     { id: 'cube', name: 'Cube', category: '3d' },
//     { id: 'doors', name: 'Doors', category: '3d' },
//     { id: 'box', name: 'Box', category: '3d' },
//     { id: 'orb', name: 'Orb', category: '3d' },
//     { id: 'checkerboard', name: 'Checkerboard', category: 'exciting' }
//   ]);

//   // ========== DESIGN STATES ==========
//   const [variants, setVariants] = useState([
//     { id: 1, colors: ['#f59e0b', '#1e293b', '#64748b'] },
//     { id: 2, colors: ['#3b82f6', '#1e293b', '#94a3b8'] },
//     { id: 3, colors: ['#10b981', '#065f46', '#d1fae5'] },
//     { id: 4, colors: ['#8b5cf6', '#2e1065', '#ede9fe'] },
//   ]);
//   const [selectedVariant, setSelectedVariant] = useState(1);
//   const [showColorScheme, setShowColorScheme] = useState(false);
//   const [slideSize, setSlideSize] = useState('widescreen'); // 'standard', 'widescreen', 'custom'
//   const [slideWidth, setSlideWidth] = useState(1366);
//   const [slideHeight, setSlideHeight] = useState(768);
//   const [showSizeModal, setShowSizeModal] = useState(false);
//   const [backgroundType, setBackgroundType] = useState('solid'); // 'solid', 'gradient', 'image'
//   const [backgroundColor, setBackgroundColor] = useState('#ffffff');
//   const [gradientStart, setGradientStart] = useState('#f59e0b');
//   const [gradientEnd, setGradientEnd] = useState('#fbbf24');
//   const [gradientAngle, setGradientAngle] = useState(90);
//   const [backgroundImage, setBackgroundImage] = useState(null);
//   const [backgroundTransparency, setBackgroundTransparency] = useState(100);
//   const [showBackgroundPanel, setShowBackgroundPanel] = useState(false);
//   const [designIdeas, setDesignIdeas] = useState([
//     { id: 1, name: 'Corporate', thumbnail: '#1e293b', slides: 4 },
//     { id: 2, name: 'Creative', thumbnail: '#8b5cf6', slides: 6 },
//     { id: 3, name: 'Modern', thumbnail: '#0ea5e9', slides: 5 },
//     { id: 4, name: 'Elegant', thumbnail: '#475569', slides: 4 },
//   ]);
//   const [showDesignIdeas, setShowDesignIdeas] = useState(false);

//   // ========== VIEW EFFECT ==========
//   React.useEffect(() => {
//     document.body.classList.remove('view-normal', 'view-outline', 'view-sorter', 'view-reading');
//     document.body.classList.add(`view-${viewMode}`);

//     const mainBody = document.querySelector('.editor-main-body');
//     if (mainBody) {
//       if (viewMode === 'reading') {
//         mainBody.classList.add('reading-mode');
//       } else {
//         mainBody.classList.remove('reading-mode');
//       }
//     }

//     return () => {
//       document.body.classList.remove(`view-${viewMode}`);
//     };
//   }, [viewMode]);

//   // ========== MASTER VIEWS FUNCTIONS ==========
//   const handleMasterView = (type) => {
//     setMasterView(type);
//     setShowMasterView(true);

//     let message = '';
//     switch (type) {
//       case 'slide': message = "Slide Master view activated"; break;
//       case 'handout': message = "Handout Master view activated"; break;
//       case 'notes': message = "Notes Master view activated"; break;
//       default: message = "Master view activated";
//     }
//     showToast(message);
//   };

//   const closeMasterView = () => {
//     setShowMasterView(false);
//     setMasterView(null);
//     showToast("Returned to Normal view");
//   };

//   const updateMasterStyle = (property, value) => {
//     setMasterSlides(prev => prev.map(master => ({
//       ...master,
//       [property]: value
//     })));
//   };

//   // ========== WINDOW CONTROLS FUNCTIONS ==========
//   const handleNewWindow = () => {
//     const newId = windows.length + 1;
//     setWindows([...windows, { id: newId, name: `Presentation${newId}` }]);
//     setActiveWindow(newId);
//     showToast(`New window opened: Presentation${newId}`);
//   };

//   const handleArrangeAll = () => {
//     showToast("Arranging all windows");
//   };

//   const handleSwitchWindow = () => {
//     const currentIndex = windows.findIndex(w => w.id === activeWindow);
//     const nextIndex = (currentIndex + 1) % windows.length;
//     setActiveWindow(windows[nextIndex].id);
//     showToast(`Switched to ${windows[nextIndex].name}`);
//   };

//   // ========== HELPER FUNCTIONS ==========
//   const showToast = (msg) => {
//     setStatusMessage(msg);
//     setTimeout(() => setStatusMessage(""), 2000);
//   };

//   // ========== VIEW FUNCTIONS ==========
//   const handleViewModeChange = (mode) => {
//     setViewMode(mode);
//     setShowOutline(mode === 'outline');

//     let message = '';
//     switch (mode) {
//       case 'normal': message = "Normal view activated"; break;
//       case 'outline': message = "Outline view activated"; break;
//       case 'sorter': message = "Slide Sorter view activated"; break;
//       case 'reading': message = "Reading view activated"; break;
//       default: message = `${mode} view activated`;
//     }
//     showToast(message);
//   };

//   const handleZoomIn = () => {
//     setZoomLevel(prev => Math.min(prev + 10, 200));
//     showToast(`Zoom: ${zoomLevel + 10}%`);
//   };

//   const handleZoomOut = () => {
//     setZoomLevel(prev => Math.max(prev - 10, 50));
//     showToast(`Zoom: ${zoomLevel - 10}%`);
//   };

//   const handleFitToWindow = () => {
//     setZoomLevel(100);
//     showToast("Fit to window");
//   };

//   // ========== FONT HANDLING FUNCTIONS ==========
//   const handleFontChange = (fontName) => {
//     setSelectedFont(fontName);
//     if (selectedField) {
//       const element = document.querySelector('.active-editing');
//       if (element) {
//         element.style.fontFamily = fontName;
//         setSlides(prev => prev.map(s => {
//           if (s.id === activeSlideId) {
//             return {
//               ...s,
//               [`${selectedField}Style`]: {
//                 ...(s[`${selectedField}Style`] || {}),
//                 fontFamily: fontName
//               }
//             };
//           }
//           return s;
//         }));
//       }
//     }
//     setShowFontPicker(false);
//     showToast(`Font changed to ${fontName}`);
//   };

//   const handleFontSizeChange = (newSize) => {
//     if (newSize < 8) newSize = 8;
//     if (newSize > 200) newSize = 200;
//     setFontSize(newSize);
//     if (selectedField) {
//       const element = document.querySelector('.active-editing');
//       if (element) {
//         element.style.fontSize = `${newSize}px`;
//         setSlides(prev => prev.map(s => {
//           if (s.id === activeSlideId) {
//             return {
//               ...s,
//               [`${selectedField}Style`]: {
//                 ...(s[`${selectedField}Style`] || {}),
//                 fontSize: newSize
//               }
//             };
//           }
//           return s;
//         }));
//       }
//     }
//   };

//   const increaseFontSize = () => handleFontSizeChange(fontSize + 2);
//   const decreaseFontSize = () => { if (fontSize > 8) handleFontSizeChange(fontSize - 2); };

//   // ========== TEXT FORMATTING FUNCTIONS ==========
//   const toggleBold = () => { if (selectedField) { document.execCommand('bold', false, null); setIsBold(!isBold); showToast(isBold ? "Bold removed" : "Bold applied"); } else showToast("Select text first"); };
//   const toggleItalic = () => { if (selectedField) { document.execCommand('italic', false, null); setIsItalic(!isItalic); showToast(isItalic ? "Italic removed" : "Italic applied"); } else showToast("Select text first"); };
//   const toggleUnderline = () => { if (selectedField) { document.execCommand('underline', false, null); setIsUnderline(!isUnderline); showToast(isUnderline ? "Underline removed" : "Underline applied"); } else showToast("Select text first"); };
//   const toggleStrikethrough = () => { if (selectedField) { document.execCommand('strikethrough', false, null); setIsStrikethrough(!isStrikethrough); showToast(isStrikethrough ? "Strikethrough removed" : "Strikethrough applied"); } else showToast("Select text first"); };
//   const toggleSubscript = () => { if (selectedField) { if (isSuperscript) { document.execCommand('superscript', false, null); setIsSuperscript(false); } document.execCommand('subscript', false, null); setIsSubscript(!isSubscript); showToast(isSubscript ? "Subscript removed" : "Subscript applied"); } else showToast("Select text first"); };
//   const toggleSuperscript = () => { if (selectedField) { if (isSubscript) { document.execCommand('subscript', false, null); setIsSubscript(false); } document.execCommand('superscript', false, null); setIsSuperscript(!isSuperscript); showToast(isSuperscript ? "Superscript removed" : "Superscript applied"); } else showToast("Select text first"); };

//   const themeColors = {
//     standard: [
//       '#000000', '#444444', '#666666', '#999999', '#cccccc', '#ffffff',
//       '#d0312d', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6',
//       '#e84342', '#f39c12', '#f7dc6f', '#27ae60', '#2980b9', '#8e44ad',
//       '#c0392b', '#d35400', '#f4d03f', '#16a085', '#1f618d', '#6c3483',
//     ],
//   };

//   // ========== PARAGRAPH FUNCTIONS ==========
//   const handleAlignLeft = () => { if (selectedField) { document.execCommand('justifyLeft', false, null); setAlignment('left'); showToast("Text aligned left"); } else showToast("Select text first"); };
//   const handleAlignCenter = () => { if (selectedField) { document.execCommand('justifyCenter', false, null); setAlignment('center'); showToast("Text aligned center"); } else showToast("Select text first"); };
//   const handleAlignRight = () => { if (selectedField) { document.execCommand('justifyRight', false, null); setAlignment('right'); showToast("Text aligned right"); } else showToast("Select text first"); };
//   const handleAlignJustify = () => { if (selectedField) { document.execCommand('justifyFull', false, null); setAlignment('justify'); showToast("Text justified"); } else showToast("Select text first"); };
//   const handleBulletList = () => { if (selectedField) { if (listType === 'bullet') { document.execCommand('insertUnorderedList', false, null); setListType(null); showToast("Bullet list removed"); } else { document.execCommand('insertUnorderedList', false, null); setListType('bullet'); showToast("Bullet list applied"); } } else showToast("Select text first"); };
//   const handleNumberList = () => { if (selectedField) { if (listType === 'number') { document.execCommand('insertOrderedList', false, null); setListType(null); showToast("Number list removed"); } else { document.execCommand('insertOrderedList', false, null); setListType('number'); showToast("Number list applied"); } } else showToast("Select text first"); };
//   const handleIndent = () => { if (selectedField) { document.execCommand('indent', false, null); setIndentLevel(prev => prev + 1); showToast("Indented"); } else showToast("Select text first"); };
//   const handleOutdent = () => { if (selectedField) { document.execCommand('outdent', false, null); setIndentLevel(prev => Math.max(0, prev - 1)); showToast("Outdented"); } else showToast("Select text first"); };
//   const handleLineSpacing = (spacing) => { if (selectedField) { setLineSpacing(spacing); const element = document.querySelector('.active-editing'); if (element) { element.style.lineHeight = spacing; setSlides(prev => prev.map(s => { if (s.id === activeSlideId && selectedField) { return { ...s, [`${selectedField}Style`]: { ...(s[`${selectedField}Style`] || {}), lineHeight: spacing } }; } return s; })); } showToast(`Line spacing: ${spacing}`); } else showToast("Select text first"); };
//   const handleParagraphSpacing = (type, value) => { if (selectedField) { const newSpacing = { ...paragraphSpacing, [type]: value }; setParagraphSpacing(newSpacing); const element = document.querySelector('.active-editing'); if (element) { if (type === 'before') element.style.marginTop = `${value}px`; else element.style.marginBottom = `${value}px`; setSlides(prev => prev.map(s => { if (s.id === activeSlideId && selectedField) { return { ...s, [`${selectedField}Style`]: { ...(s[`${selectedField}Style`] || {}), marginTop: newSpacing.before, marginBottom: newSpacing.after } }; } return s; })); } } else showToast("Select text first"); };

//   // ========== DRAWING FUNCTIONS ==========
//   const addShape = (type) => {
//     const newShape = { id: Date.now(), type, x: 100, y: 100, width: 150, height: type === 'circle' ? 150 : 100, fill: shapeFill, outline: shapeOutline, outlineWidth, opacity: shapeOpacity, rotation: 0, effects: { ...shapeEffects } };
//     setShapes([...shapes, newShape]);
//     setSelectedShape(newShape.id);
//     showToast(`${type} shape added`);
//   };

//   const updateShapeStyle = (property, value) => { if (selectedShape) setShapes(prev => prev.map(shape => shape.id === selectedShape ? { ...shape, [property]: value } : shape)); };
//   const handleShapeFill = (color) => { setShapeFill(color); if (selectedShape) updateShapeStyle('fill', color); };
//   const handleShapeOutline = (color) => { setShapeOutline(color); if (selectedShape) updateShapeStyle('outline', color); };
//   const handleOutlineWidth = (width) => { setOutlineWidth(width); if (selectedShape) updateShapeStyle('outlineWidth', width); };
//   const handleShapeOpacity = (opacity) => { setShapeOpacity(opacity); if (selectedShape) updateShapeStyle('opacity', opacity); };
//   const handleRotation = (angle) => { setRotation(angle); if (selectedShape) updateShapeStyle('rotation', angle); };
//   const handleEffect = (effect, value) => { setShapeEffects(prev => ({ ...prev, [effect]: value })); if (selectedShape) setShapes(prev => prev.map(shape => shape.id === selectedShape ? { ...shape, effects: { ...shape.effects, [effect]: value } } : shape)); };
//   const bringToFront = () => { if (selectedShape) { setShapes(prev => { const index = prev.findIndex(s => s.id === selectedShape); if (index < prev.length - 1) { const newShapes = [...prev]; const [shape] = newShapes.splice(index, 1); newShapes.push(shape); return newShapes; } return prev; }); showToast("Brought to front"); } };
//   const sendToBack = () => { if (selectedShape) { setShapes(prev => { const index = prev.findIndex(s => s.id === selectedShape); if (index > 0) { const newShapes = [...prev]; const [shape] = newShapes.splice(index, 1); newShapes.unshift(shape); return newShapes; } return prev; }); showToast("Sent to back"); } };
//   const bringForward = () => { if (selectedShape) { setShapes(prev => { const index = prev.findIndex(s => s.id === selectedShape); if (index < prev.length - 1) { const newShapes = [...prev];[newShapes[index], newShapes[index + 1]] = [newShapes[index + 1], newShapes[index]]; return newShapes; } return prev; }); showToast("Brought forward"); } };
//   const sendBackward = () => { if (selectedShape) { setShapes(prev => { const index = prev.findIndex(s => s.id === selectedShape); if (index > 0) { const newShapes = [...prev];[newShapes[index], newShapes[index - 1]] = [newShapes[index - 1], newShapes[index]]; return newShapes; } return prev; }); showToast("Sent backward"); } };
//   const deleteShape = () => { if (selectedShape) { setShapes(prev => prev.filter(s => s.id !== selectedShape)); setSelectedShape(null); showToast("Shape deleted"); } };
//   const duplicateShape = () => { if (selectedShape) { const shape = shapes.find(s => s.id === selectedShape); const newShape = { ...shape, id: Date.now(), x: shape.x + 20, y: shape.y + 20 }; setShapes([...shapes, newShape]); setSelectedShape(newShape.id); showToast("Shape duplicated"); } };

//   // More Colors Modal Component
//   const MoreColorsModal = ({ onClose, onSelect, currentColor }) => {
//     const [color, setColor] = useState(currentColor);
//     const [hexValue, setHexValue] = useState(currentColor.replace('#', ''));
//     const [rgbValue, setRgbValue] = useState({ r: 30, g: 41, b: 59 });

//     React.useEffect(() => {
//       const hex = color.replace('#', '');
//       const r = parseInt(hex.substring(0, 2), 16);
//       const g = parseInt(hex.substring(2, 4), 16);
//       const b = parseInt(hex.substring(4, 6), 16);
//       setRgbValue({ r, g, b });
//       setHexValue(hex);
//     }, [color]);

//     const handleHexChange = (e) => {
//       let val = e.target.value.replace('#', '');
//       if (val.length <= 6 && /^[0-9A-Fa-f]*$/.test(val)) {
//         setHexValue(val);
//         if (val.length === 6) setColor('#' + val);
//       }
//     };

//     const handleRgbChange = (type, val) => {
//       const num = parseInt(val) || 0;
//       const clamped = Math.min(255, Math.max(0, num));
//       const newRgb = { ...rgbValue, [type]: clamped };
//       setRgbValue(newRgb);
//       const hex = '#' + newRgb.r.toString(16).padStart(2, '0') + newRgb.g.toString(16).padStart(2, '0') + newRgb.b.toString(16).padStart(2, '0');
//       setColor(hex);
//     };

//     return ReactDOM.createPortal(
//       <div className="more-colors-overlay" onClick={onClose}>
//         <div className="more-colors-modal" onClick={e => e.stopPropagation()}>
//           <div className="more-colors-header"><h3>Colors</h3><button className="close-btn" onClick={onClose}>×</button></div>
//           <div className="more-colors-content">
//             <div className="color-preview-section"><div className="color-preview-large" style={{ backgroundColor: color }}><span className="color-preview-text">{color}</span></div></div>
//             <div className="color-picker-section-custom"><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="color-input-native" /><div className="color-input-placeholder">Click to select color</div></div>
//             <div className="color-input-group"><label>Hex:</label><div className="hex-input-wrapper"><span className="hex-prefix">#</span><input type="text" value={hexValue} onChange={handleHexChange} maxLength="6" className="hex-input" /></div></div>
//             <div className="color-input-group"><label>RGB:</label><div className="rgb-inputs"><input type="number" value={rgbValue.r} onChange={(e) => handleRgbChange('r', e.target.value)} min="0" max="255" className="rgb-input" placeholder="R" /><input type="number" value={rgbValue.g} onChange={(e) => handleRgbChange('g', e.target.value)} min="0" max="255" className="rgb-input" placeholder="G" /><input type="number" value={rgbValue.b} onChange={(e) => handleRgbChange('b', e.target.value)} min="0" max="255" className="rgb-input" placeholder="B" /></div></div>
//             <div className="recent-colors-section"><label>Recent Colors:</label><div className="recent-colors-grid">{['#1e293b', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'].map((c, i) => (<button key={i} className="recent-color-swatch" style={{ backgroundColor: c }} onClick={() => setColor(c)} title={c} />))}</div></div>
//           </div>
//           <div className="more-colors-footer"><button className="cancel-btn" onClick={onClose}>Cancel</button><button className="ok-btn" onClick={() => { onSelect(color); onClose(); }}>OK</button></div>
//         </div>
//       </div>,
//       document.body
//     );
//   };

//   // Color Picker Dropdown Component
//   const ColorPickerDropdown = ({ onColorSelect, onClose, recentColors, themeColors, buttonRef }) => {
//     const dropdownRef = React.useRef(null);
//     const [position, setPosition] = React.useState({ top: 0, left: 0 });

//     React.useEffect(() => {
//       const handleClickOutside = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) onClose(); };
//       if (buttonRef && buttonRef.current) {
//         const rect = buttonRef.current.getBoundingClientRect();
//         const dropdownWidth = 260;
//         let leftPos = rect.left - 100;
//         if (leftPos + dropdownWidth > window.innerWidth) leftPos = window.innerWidth - dropdownWidth - 10;
//         if (leftPos < 10) leftPos = 10;
//         setPosition({ top: rect.bottom + 2, left: leftPos });
//       }
//       document.addEventListener('mousedown', handleClickOutside);
//       return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, [onClose, buttonRef]);

//     if (!position.top) return null;

//     return (
//       <div ref={dropdownRef} className="color-picker-dropdown exact-match" style={{ position: 'fixed', top: position.top, left: position.left, zIndex: 1000000 }} onClick={e => e.stopPropagation()}>
//         <div className="color-picker-section"><div className="color-picker-header"><span>Recently Used</span><button className="color-picker-clear" onClick={() => onColorSelect('')}>Clear</button></div><div className="color-picker-grid">{recentColors.map((color, index) => (<button key={index} className="color-picker-swatch" style={{ backgroundColor: color }} onClick={() => onColorSelect(color)} title={color} />))}</div></div>
//         <div className="color-picker-section"><div className="color-picker-header">Standard Colors</div><div className="color-picker-grid standard">{themeColors.standard.map((color, index) => (<button key={index} className="color-picker-swatch standard" style={{ backgroundColor: color }} onClick={() => onColorSelect(color)} title={color} />))}</div></div>
//         <div className="color-picker-footer"><button className="color-picker-more" onClick={() => { onClose(); if (window.showMoreColors) window.showMoreColors(true); }}><Palette size={12} /><span>More Colors...</span></button></div>
//       </div>
//     );
//   };

//   const clearFormatting = () => { if (selectedField) { document.execCommand('removeFormat', false, null); setIsBold(false); setIsItalic(false); setIsUnderline(false); setIsStrikethrough(false); setIsSubscript(false); setIsSuperscript(false); setTextColor('#1e293b'); showToast("Formatting cleared"); } else showToast("Select text first"); };

//   // ========== CREATE NEW SLIDE FUNCTION ==========
//   const LAYOUT_TYPES = { TITLE_SLIDE: 'Title Slide', TITLE_AND_CONTENT: 'Title and Content', SECTION_HEADER: 'Section Header', TWO_CONTENT: 'Two Content', COMPARISON: 'Comparison', BLANK: 'Blank' };

//   const [slides, setSlides] = useState([{ id: 1, layout: LAYOUT_TYPES.TITLE_SLIDE, title: "", subtitle: "", tables: [], shapes: [], images: [], content: "", leftContent: "", rightContent: "", titleStyle: { fontFamily: 'Calibri', fontSize: 48 }, subtitleStyle: { fontFamily: 'Calibri', fontSize: 24 }, contentStyle: { fontFamily: 'Calibri', fontSize: 24 } }]);
//   const [activeSlideId, setActiveSlideId] = useState(1);

//   const createNewSlide = (layoutType = LAYOUT_TYPES.BLANK) => ({ id: Date.now(), layout: layoutType, title: "", subtitle: "", content: "", leftContent: "", rightContent: "", tables: [], shapes: [], titleStyle: { fontFamily: selectedFont, fontSize: 48 }, subtitleStyle: { fontFamily: selectedFont, fontSize: 24 }, contentStyle: { fontFamily: selectedFont, fontSize: 24 }, leftContentStyle: { fontFamily: selectedFont, fontSize: 20 }, rightContentStyle: { fontFamily: selectedFont, fontSize: 20 } });

//   const addNewSlide = (layoutType = LAYOUT_TYPES.BLANK) => { const newSlide = createNewSlide(layoutType); setSlides([...slides, newSlide]); setActiveSlideId(newSlide.id); setShowLayoutPicker(false); showToast("New slide added"); };

//   const handleLayoutSelection = (type) => { if (pickerMode === 'add') addNewSlide(type); else { setSlides(prev => prev.map(s => s.id === activeSlideId ? { ...s, layout: type } : s)); setShowLayoutPicker(false); showToast("Layout changed!"); } };

//   const deleteSlide = (e, id) => { e.stopPropagation(); if (slides.length > 1) { const newSlides = slides.filter(slide => slide.id !== id); setSlides(newSlides); if (activeSlideId === id) setActiveSlideId(newSlides[0].id); showToast("Slide deleted"); } };

//   const handleTextColorChange = (color) => { if (selectedField) { document.execCommand('foreColor', false, color); setTextColor(color); setRecentColors(prev => [color, ...prev.filter(c => c !== color)].slice(0, 6)); setSlides(prev => prev.map(s => { if (s.id === activeSlideId && selectedField) { return { ...s, [`${selectedField}Style`]: { ...(s[`${selectedField}Style`] || {}), color: color } }; } return s; })); setShowColorPicker(false); showToast(`Text color updated`); } else { showToast("Please select text first"); setShowColorPicker(false); } };

//   // ========== COPY/PASTE FUNCTIONS ==========
//   const handleCopy = async () => { const selection = window.getSelection(); const selectedText = selection.toString(); if (selectedText) { setClipboardItem({ type: 'text', content: selectedText }); await navigator.clipboard.writeText(selectedText); showToast("Text copied!"); } else if (!selectedField) { const currentSlide = slides.find(s => s.id === activeSlideId); setClipboardItem({ type: 'slide', content: JSON.parse(JSON.stringify(currentSlide)) }); showToast("Slide copied!"); } };

//   const handleCut = () => { const selection = window.getSelection(); const selectedText = selection.toString(); if (selectedText) { setClipboardItem({ type: 'text', content: selectedText }); navigator.clipboard.writeText(selectedText); document.execCommand('delete'); showToast("Text cut!"); const element = document.querySelector(`.active-editing`); if (element) updateStateFromDOM(element); } else if (!selectedField && slides.length > 1) { handleCopy(); const newSlides = slides.filter(s => s.id !== activeSlideId); setSlides(newSlides); setActiveSlideId(newSlides[0].id); showToast("Slide cut!"); } };

//   const handlePaste = async () => { try { const externalText = await navigator.clipboard.readText(); if (selectedField) { document.execCommand('insertText', false, externalText); showToast("Pasted!"); const element = document.querySelector(`.active-editing`); if (element) updateStateFromDOM(element); return; } } catch (err) { console.log("Clipboard access denied"); } if (clipboardItem && clipboardItem.type === 'slide') { const newId = Date.now(); const newSlide = { ...clipboardItem.content, id: newId }; const activeIndex = slides.findIndex(s => s.id === activeSlideId); const newSlides = [...slides]; newSlides.splice(activeIndex + 1, 0, newSlide); setSlides(newSlides); setActiveSlideId(newId); showToast("Slide pasted!"); } };

//   // ========== FORMAT PAINTER FUNCTIONS ==========
//   const handleFormatPainter = () => { if (selectedField) { const element = document.querySelector('.active-editing'); if (element) { const style = window.getComputedStyle(element); const copiedStyle = { fontWeight: style.fontWeight, fontStyle: style.fontStyle, textDecoration: style.textDecoration, color: style.color, fontSize: style.fontSize, fontFamily: style.fontFamily, textAlign: style.textAlign }; setPainterStyle(copiedStyle); setIsPainterActive(true); showToast("Format copied! Click another text to apply."); } } else showToast("Select formatted text first!"); };

//   const applyFormat = (e) => { if (isPainterActive && painterStyle) { const element = e.target; Object.assign(element.style, painterStyle); setIsPainterActive(false); setPainterStyle(null); showToast("Format applied!"); } };

//   // ========== UPDATE STATE FROM DOM ==========
//   const updateStateFromDOM = (el) => { const text = el.innerText; setSlides(prev => prev.map(s => s.id === activeSlideId ? { ...s, [selectedField]: text } : s)); };

//   const renderBox = (field, placeholder, className = "", displayCondition = true) => {
//     if (!displayCondition) return null;
//     const currentSlide = slides.find(s => s.id === activeSlideId);
//     const hasContent = currentSlide && currentSlide[field] && currentSlide[field].trim() !== "";
//     const fieldStyle = currentSlide?.[`${field}Style`] || {};
//     const elementId = `element-${activeSlideId}-${field}`;
//     const elementAnimation = animations[elementId];

//     return (<div id={elementId} className={`${className} ${selectedField === field ? 'active-editing' : ''} editable-box ${elementAnimation ? 'has-animation' : ''}`}
//       contentEditable suppressContentEditableWarning spellCheck="false"
//       data-placeholder={placeholder} data-has-content={hasContent}
//       style={{
//         fontFamily: fieldStyle.fontFamily || selectedFont,
//         fontSize: fieldStyle.fontSize ? `${fieldStyle.fontSize}px` : undefined,
//         animation: elementAnimation ? getAnimationStyle(elementAnimation) : undefined
//       }}
//       onFocus={() => setSelectedField(field)}
//       onBlur={(e) => { const text = e.target.innerText; setSlides(prev => prev.map(s => s.id === activeSlideId ? { ...s, [field]: text } : s)); }}
//       onClick={(e) => { if (isPainterActive) applyFormat(e); e.stopPropagation(); }} >
//       {currentSlide?.[field] || ""}
//     </div>);
//   };

//   // ========== KEYBOARD SHORTCUTS ==========
//   React.useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.ctrlKey && e.key === 'c') { e.preventDefault(); handleCopy(); }
//       if (e.ctrlKey && e.key === 'x') { e.preventDefault(); handleCut(); }
//       if (e.ctrlKey && e.key === 'v') { if (!selectedField) { e.preventDefault(); handlePaste(); } }
//       if (e.altKey && e.shiftKey && e.key === 'S') { e.preventDefault(); toggleStrikethrough(); }
//       if (e.ctrlKey && e.key === '=' && !e.shiftKey) { e.preventDefault(); toggleSubscript(); }
//       if (e.ctrlKey && e.shiftKey && e.key === '=') { e.preventDefault(); toggleSuperscript(); }
//       if (e.ctrlKey && e.key === 'f') { e.preventDefault(); if (!selectedField) { showToast("Please select a text field first"); return; } setShowSearchDialog(true); }
//       if (e.ctrlKey && e.key === 'a') { e.preventDefault(); handleSelectAll(); }
//       if (e.ctrlKey && e.key === 'h') { e.preventDefault(); if (!selectedField) { showToast("Please select a text field first"); return; } setShowSearchDialog(true); }
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [selectedField, activeSlideId, slides, clipboardItem]);

//   // ========== EDITING FUNCTIONS ==========
//   const handleFind = () => { if (!selectedField) { showToast("Please select a text field first"); return; } setShowSearchDialog(true); setSearchQuery(''); setReplaceQuery(''); setSearchResults([]); setCurrentSearchIndex(-1); };

//   const performSearch = () => { if (!searchQuery || !selectedField) return; const element = document.querySelector('.active-editing'); if (!element) return; const text = element.innerText; const results = []; let searchText = text; let query = searchQuery; if (!matchCase) { searchText = searchText.toLowerCase(); query = query.toLowerCase(); } let index = -1; do { index = searchText.indexOf(query, index + 1); if (index !== -1) { if (matchWholeWord) { const beforeChar = index > 0 ? text[index - 1] : ' '; const afterChar = index + query.length < text.length ? text[index + query.length] : ' '; const isWordBoundary = !/[a-zA-Z0-9]/.test(beforeChar) && !/[a-zA-Z0-9]/.test(afterChar); if (!isWordBoundary) continue; } results.push({ start: index, end: index + searchQuery.length, text: text.substring(index, index + searchQuery.length) }); } } while (index !== -1); setSearchResults(results); if (results.length > 0) { setCurrentSearchIndex(0); highlightSearchResult(0, results); showToast(`Found ${results.length} matches`); } else showToast("No matches found"); };

//   const highlightSearchResult = (index, results = searchResults) => { if (index < 0 || index >= results.length || !selectedField) return; const element = document.querySelector('.active-editing'); if (!element) return; const range = document.createRange(); const textNode = element.firstChild; if (textNode) { range.setStart(textNode, results[index].start); range.setEnd(textNode, results[index].end); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); element.scrollIntoView({ behavior: 'smooth', block: 'center' }); } };

//   const navigateSearch = (direction) => { if (searchResults.length === 0) return; let newIndex; if (direction === 'next') newIndex = (currentSearchIndex + 1) % searchResults.length; else { newIndex = currentSearchIndex - 1; if (newIndex < 0) newIndex = searchResults.length - 1; } setCurrentSearchIndex(newIndex); highlightSearchResult(newIndex); };

//   const handleReplace = () => { if (!selectedField || currentSearchIndex === -1) return; const element = document.querySelector('.active-editing'); if (!element) return; const selection = window.getSelection(); if (selection.rangeCount > 0) { const range = selection.getRangeAt(0); range.deleteContents(); range.insertNode(document.createTextNode(replaceQuery)); updateStateFromDOM(element); const remainingResults = searchResults.filter((_, i) => i !== currentSearchIndex); setSearchResults(remainingResults); if (remainingResults.length > 0) { setCurrentSearchIndex(Math.min(currentSearchIndex, remainingResults.length - 1)); highlightSearchResult(currentSearchIndex, remainingResults); } else { setCurrentSearchIndex(-1); showToast("No more matches"); } showToast("Replaced"); } };

//   const handleReplaceAll = () => { if (!selectedField || searchResults.length === 0) return; const element = document.querySelector('.active-editing'); if (!element) { showToast("Please select a text field"); return; } let text = element.innerText; let newText = text; const sortedResults = [...searchResults].sort((a, b) => b.start - a.start); sortedResults.forEach(result => { newText = newText.substring(0, result.start) + replaceQuery + newText.substring(result.end); }); element.innerText = newText; updateStateFromDOM(element); setSearchResults([]); setCurrentSearchIndex(-1); showToast(`Replaced ${searchResults.length} occurrences`); };

//   const handleSelectAll = () => { const editableElements = document.querySelectorAll('[contenteditable="true"]'); if (editableElements.length === 0) { showToast("No text fields found"); return; } const selection = window.getSelection(); selection.removeAllRanges(); editableElements.forEach(element => { const range = document.createRange(); range.selectNodeContents(element); selection.addRange(range); }); const fieldName = getFieldFromElement(editableElements[0]); if (fieldName) setSelectedField(fieldName); const message = editableElements.length === 1 ? "All text selected (Ctrl+A)" : `Selected ${editableElements.length} text fields (Ctrl+A)`; showToast(message); };

//   const getFieldFromElement = (element) => { if (element.classList.contains('title-slide-main')) return 'title'; if (element.classList.contains('title-slide-sub')) return 'subtitle'; if (element.classList.contains('content-title')) return 'title'; if (element.classList.contains('content-body')) return 'content'; if (element.classList.contains('two-column-title')) return 'title'; if (element.classList.contains('column-left')) return 'leftContent'; if (element.classList.contains('column-right')) return 'rightContent'; if (element.classList.contains('comparison-title')) return 'title'; if (element.classList.contains('comparison-content')) { const parent = element.closest('.comparison-column'); if (parent && parent.querySelector('.comparison-header')?.innerText === 'Left') return 'leftContent'; else return 'rightContent'; } if (element.classList.contains('section-header-title')) return 'title'; return null; };

//   const handleSelectionMode = (mode) => { setSelectionMode(mode); if (mode === 'selectAll') handleSelectAll(); else if (mode === 'selectObjects') showToast("Click on objects to select them (Ctrl+Click for multiple)"); };
//   // ========== PICTURE FUNCTIONS ==========
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const newImage = {
//           id: Date.now(),
//           src: event.target.result, // تخزين الصورة كـ Base64
//           x: 100,
//           y: 100,
//           width: 300,
//           height: 'auto',
//           rotation: 0,
//           opacity: 100,
//           filters: { brightness: 100, contrast: 100 }
//         };

//         setSlides(prev => prev.map(slide => {
//           if (slide.id === activeSlideId) {
//             return { ...slide, images: [...(slide.images || []), newImage] };
//           }
//           return slide;
//         }));
//         showToast("Image added to slide");
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const deleteImage = (imageId) => {
//     setSlides(prev => prev.map(slide => {
//       if (slide.id === activeSlideId) {
//         return { ...slide, images: slide.images.filter(img => img.id !== imageId) };
//       }
//       return slide;
//     }));
//     showToast("Image deleted");
//   };

//   // وظيفة لتحديث موقع أو حجم الصورة
//   const updateImageStyle = (imageId, updates) => {
//     setSlides(prev => prev.map(slide => {
//       if (slide.id === activeSlideId) {
//         return {
//           ...slide,
//           images: slide.images.map(img => img.id === imageId ? { ...img, ...updates } : img)
//         };
//       }
//       return slide;
//     }));
//   };
//   // ========== TABLE FUNCTIONS ==========
//   const addTable = (rows, cols) => { const newTable = { id: Date.now(), type: 'table', rows, cols, x: 150, y: 150, width: cols * 100, height: rows * 40, data: {}, style: { fill: '#ffffff', borderColor: '#e2e8f0', align: 'left', bold: false, italic: false } }; setSlides(prev => prev.map(slide => { if (slide.id === activeSlideId) return { ...slide, tables: [...(slide.tables || []), newTable] }; return slide; })); setSelectedTable(newTable.id); setShowTableModal(false); showToast(`${rows}x${cols} table added to current slide`); };

//   const updateTable = (updatedTable) => { setSlides(prev => prev.map(slide => { if (slide.id === activeSlideId) return { ...slide, tables: (slide.tables || []).map(t => t.id === updatedTable.id ? updatedTable : t) }; return slide; })); };

//   const deleteTable = (tableId) => { setSlides(prev => prev.map(slide => { if (slide.id === activeSlideId) return { ...slide, tables: (slide.tables || []).filter(t => t.id !== tableId) }; return slide; })); if (selectedTable === tableId) setSelectedTable(null); showToast("Table deleted"); };

//   const handleCellSelect = (tableId, row, col) => { setSelectedTable(tableId); setActiveCell({ tableId, row, col }); };

//   const handleTableSelect = (tableId) => { const currentSlide = slides.find(s => s.id === activeSlideId); const tableExists = currentSlide?.tables?.some(t => t.id === tableId); if (tableExists) setSelectedTable(tableId); };

//   // ========== PROOFING FUNCTIONS ==========
//   const handleSpellingCheck = () => {
//     if (!selectedField) {
//       showToast("Please select a text field first");
//       return;
//     }

//     setCheckingSpelling(true);

//     setTimeout(() => {
//       const element = document.querySelector('.active-editing');
//       if (!element) {
//         setCheckingSpelling(false);
//         return;
//       }

//       const text = element.innerText;
//       const words = text.split(/\s+/);
//       const errors = [];

//       words.forEach((word, index) => {
//         const cleanWord = word.replace(/[.,!?;:()]/g, '');
//         if (!dictionary.check(cleanWord)) {
//           const suggestions = dictionary.suggest(cleanWord);
//           errors.push({
//             word: word,
//             index: index,
//             position: text.indexOf(word),
//             suggestions: suggestions.slice(0, 5)
//           });
//         }
//       });

//       setSpellingErrors(errors);
//       setCheckingSpelling(false);

//       if (errors.length > 0) {
//         setCurrentSpellingIndex(0);
//         showToast(`Found ${errors.length} spelling errors`);
//       } else {
//         showToast("Spelling check complete. No errors found.");
//       }
//     }, 500);
//   };

//   const getSpellingSuggestions = (word) => {
//     const suggestions = {
//       'recieve': ['receive', 'received', 'receives'],
//       'seperate': ['separate', 'separated', 'separates'],
//       'occured': ['occurred', 'occurs', 'occurring'],
//       'acommodate': ['accommodate', 'accommodated', 'accommodates']
//     };

//     return suggestions[word.toLowerCase()] || [
//       word + 'ing',
//       word + 'ed',
//       'corrected version of ' + word
//     ];
//   };

//   const handleThesaurus = async () => {
//     const selection = window.getSelection().toString();
//     if (!selection) {
//       showToast("Select a word to look up in thesaurus");
//       return;
//     }

//     setSelectedWord(selection);

//     try {
//       const response = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${selection}/synonyms`, {
//         headers: {
//           'X-RapidAPI-Key': 'YOUR_API_KEY_HERE'
//         }
//       });
//       const data = await response.json();
//       setThesaurusResults(data.synonyms || []);
//       showToast(`Found synonyms for "${selection}"`);
//     } catch (error) {
//       showToast("Thesaurus lookup failed");
//     }
//   };

//   const handleAccessibilityCheck = () => {
//     setShowAccessibilityPanel(true);

//     const issues = [];

//     slides.forEach((slide, index) => {
//       if (Math.random() > 0.8) {
//         issues.push({
//           type: 'contrast',
//           slide: index + 1,
//           description: 'Low color contrast in text',
//           severity: 'warning',
//           suggestion: 'Use darker text or lighter background'
//         });
//       }

//       if (slide.tables?.length > 0 && Math.random() > 0.7) {
//         issues.push({
//           type: 'alt-text',
//           slide: index + 1,
//           description: 'Table missing alternative text',
//           severity: 'error',
//           suggestion: 'Add descriptive alt text'
//         });
//       }
//     });

//     const editableElements = document.querySelectorAll('[contenteditable="true"]');
//     editableElements.forEach((el, idx) => {
//       const fontSize = window.getComputedStyle(el).fontSize;
//       const size = parseInt(fontSize);
//       if (size < 12) {
//         issues.push({
//           type: 'font-size',
//           element: idx,
//           description: 'Text size may be too small',
//           severity: 'warning',
//           suggestion: 'Increase font size to at least 12pt'
//         });
//       }
//     });

//     setAccessibilityIssues(issues);

//     if (issues.length > 0) {
//       showToast(`Found ${issues.length} accessibility issues`);
//     } else {
//       showToast("No accessibility issues found");
//     }
//   };

//   const handleSmartLookup = async () => {
//     const selection = window.getSelection().toString();
//     if (!selection) {
//       showToast("Select text to look up");
//       return;
//     }

//     showToast(`Searching: "${selection}"...`);

//     try {
//       const response = await fetch(
//         `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(selection)}`
//       );
//       const data = await response.json();

//       showToast(data.extract || "No information found");
//     } catch (error) {
//       showToast("Lookup failed");
//     }
//   };

//   // ========== TRANSLATION FUNCTIONS ==========
//   const handleTranslate = async () => {
//     const selection = window.getSelection().toString();
//     if (!selection) {
//       showToast("Select text to translate");
//       return;
//     }

//     setShowTranslator(true);
//     showToast("Translating...");

//     try {
//       const { text } = await googleTranslate(selection, { to: targetLanguage });
//       setTranslationResults([{
//         original: selection,
//         translated: text,
//         language: targetLanguage,
//         timestamp: new Date().toISOString()
//       }]);
//       showToast("Translation complete!");
//     } catch (error) {
//       console.error("Translation error:", error);
//       showToast("Translation failed. Using fallback.");

//       const fallbackTranslations = {
//         'ar': 'مرحباً بالعالم',
//         'fr': 'Bonjour le monde',
//         'es': 'Hola mundo',
//         'de': 'Hallo Welt'
//       };

//       setTranslationResults([{
//         original: selection,
//         translated: fallbackTranslations[targetLanguage] || `[${targetLanguage}] ${selection}`,
//         language: targetLanguage
//       }]);
//     }
//   };

//   const getLanguageName = (code) => {
//     const languages = {
//       'ar': 'Arabic',
//       'fr': 'French',
//       'es': 'Spanish',
//       'de': 'German',
//       'it': 'Italian',
//       'zh': 'Chinese',
//       'ja': 'Japanese'
//     };
//     return languages[code] || code;
//   };

//   const handleLanguagePreference = () => {
//     showToast("Language preferences opened");
//   };

//   // ========== COMMENTS FUNCTIONS ==========
//   const handleNewComment = () => {
//     if (!selectedField) {
//       showToast("Select a text field to comment on");
//       return;
//     }

//     const selection = window.getSelection();
//     const selectedText = selection.toString();

//     const newCommentObj = {
//       id: Date.now(),
//       author: 'Current User',
//       text: '',
//       timestamp: new Date().toISOString(),
//       resolved: false,
//       replies: [],
//       selectedText: selectedText || null,
//       position: {
//         field: selectedField,
//         slideId: activeSlideId,
//       }
//     };

//     setComments([...comments, newCommentObj]);
//     setSelectedCommentThread(newCommentObj.id);
//     showToast("New comment added");
//   };

//   const navigateComments = (direction) => {
//     return () => {
//       if (comments.length === 0) {
//         showToast("No comments");
//         return;
//       }

//       const currentIndex = comments.findIndex(c => c.id === selectedCommentThread);
//       let newIndex;

//       if (direction === 'next') {
//         newIndex = (currentIndex + 1) % comments.length;
//       } else {
//         newIndex = currentIndex - 1;
//         if (newIndex < 0) newIndex = comments.length - 1;
//       }

//       setSelectedCommentThread(comments[newIndex].id);

//       const comment = comments[newIndex];
//       if (comment.position) {
//         setActiveSlideId(comment.position.slideId);
//         setSelectedField(comment.position.field);
//       }

//       showToast(`Comment ${newIndex + 1} of ${comments.length}`);
//     };
//   };

//   const handleDeleteAllComments = () => {
//     if (window.confirm('Delete all comments?')) {
//       setComments([]);
//       setSelectedCommentThread(null);
//       showToast("All comments deleted");
//     }
//   };

//   const resolveComment = (commentId) => {
//     setComments(comments.map(c =>
//       c.id === commentId ? { ...c, resolved: !c.resolved } : c
//     ));
//   };

//   const addReply = (commentId, replyText) => {
//     setComments(comments.map(c => {
//       if (c.id === commentId) {
//         return {
//           ...c,
//           replies: [...c.replies, {
//             id: Date.now(),
//             author: 'Current User',
//             text: replyText,
//             timestamp: new Date().toISOString()
//           }]
//         };
//       }
//       return c;
//     }));
//   };

//   // ========== PROTECT FUNCTIONS ==========
//   const handleProtectPresentation = () => {
//     if (!isProtected) {
//       const password = prompt('Enter password to protect this presentation:');
//       if (password) {
//         setProtectionPassword(password);
//         setIsProtected(true);
//         showToast("Presentation protected");
//       }
//     } else {
//       if (window.confirm('Remove protection?')) {
//         setIsProtected(false);
//         setProtectionPassword('');
//         showToast("Protection removed");
//       }
//     }
//   };

//   const handleMarkAsFinal = () => {
//     setIsMarkedFinal(!isMarkedFinal);
//     showToast(!isMarkedFinal ? "Marked as final" : "Marked as not final");

//     if (!isMarkedFinal) {
//       document.querySelectorAll('[contenteditable="true"]').forEach(el => {
//         el.setAttribute('contenteditable', 'false');
//       });
//     } else {
//       document.querySelectorAll('[contenteditable="true"]').forEach(el => {
//         el.setAttribute('contenteditable', 'true');
//       });
//     }
//   };

//   const handleRestrictAccess = () => {
//     showToast("Restrict access settings opened");
//   };

//   const startPresentation = (fromBeginning = true) => {
//     if (fromBeginning) {
//       setCurrentSlideIndex(0);
//       setActiveSlideId(slides[0].id);
//     } else {
//       const index = slides.findIndex(s => s.id === activeSlideId);
//       setCurrentSlideIndex(index);
//     }

//     setIsPresenting(true);
//     setShowPresenterTools(true);

//     setPresentationTimer(0);
//     setIsTimerRunning(true);

//     // إزالة طلب ملء الشاشة - نخليه اختياري
//     // const element = document.querySelector('.presentation-mode');
//     // if (element && element.requestFullscreen) {
//     //   element.requestFullscreen();
//     // }

//     showToast("Presentation started");
//   };

//   const endPresentation = () => {
//     setIsPresenting(false);
//     setShowPresenterTools(false);
//     setIsTimerRunning(false);
//     setPenMode(false);
//     setDrawingPaths([]);

//     if (document.exitFullscreen) {
//       document.exitFullscreen();
//     }

//     showToast("Presentation ended");
//   };

//   const nextSlide = () => {
//     if (currentSlideIndex < slides.length - 1) {
//       const nextIndex = currentSlideIndex + 1;
//       setCurrentSlideIndex(nextIndex);
//       setActiveSlideId(slides[nextIndex].id);

//       if (rehearseMode) {
//         setSlideTimings(prev => ({
//           ...prev,
//           [slides[currentSlideIndex].id]: presentationTimer
//         }));
//       }
//     }
//   };

//   const prevSlide = () => {
//     if (currentSlideIndex > 0) {
//       const prevIndex = currentSlideIndex - 1;
//       setCurrentSlideIndex(prevIndex);
//       setActiveSlideId(slides[prevIndex].id);
//     }
//   };

//   const goToSlide = (index) => {
//     if (index >= 0 && index < slides.length) {
//       setCurrentSlideIndex(index);
//       setActiveSlideId(slides[index].id);
//     }
//   };

//   const togglePresenterMode = () => {
//     setPresenterMode(!presenterMode);
//     showToast(presenterMode ? "Presenter mode off" : "Presenter mode on");
//   };

//   const updatePresenterNotes = (slideId, notes) => {
//     setPresenterNotes(prev => ({
//       ...prev,
//       [slideId]: notes
//     }));
//   };

//   const toggleHideSlide = (slideId) => {
//     setHideSlide(prev => ({
//       ...prev,
//       [slideId]: !prev[slideId]
//     }));
//     showToast("Slide visibility toggled");
//   };

//   const startRehearseTimings = () => {
//     setRehearseMode(true);
//     setPresentationTimer(0);
//     setIsTimerRunning(true);
//     setSlideTimings({});
//     startPresentation(true);
//     showToast("Rehearsing timings - click next to record each slide");
//   };

//   const saveTimings = () => {
//     console.log("Saved timings:", slideTimings);
//     showToast("Timings saved");
//   };

//   const startRecording = () => {
//     setRecordingMode(true);
//     setIsRecording(true);
//     showToast("Recording started...");

//     setTimeout(() => {
//       setIsRecording(false);
//       showToast("Recording completed");
//     }, 5000);
//   };

//   const toggleLoopMode = () => {
//     setLoopMode(!loopMode);
//     showToast(loopMode ? "Loop mode off" : "Loop mode on");
//   };

//   const toggleMediaControls = () => {
//     setShowMediaControls(!showMediaControls);
//   };

//   const handleMouseMove = (e) => {
//     if (!isPresenting) return;

//     if (laserPointer.visible) {
//       setLaserPointer({
//         visible: true,
//         x: e.clientX,
//         y: e.clientY
//       });
//     }

//     if (penMode) {
//       const rect = e.currentTarget.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;

//       setCurrentPath(prev => [...prev, { x, y, color: penColor, size: penSize }]);
//     }
//   };

//   const toggleLaserPointer = () => {
//     setLaserPointer(prev => ({ ...prev, visible: !prev.visible }));
//     setPenMode(false);
//     showToast(laserPointer.visible ? "Laser pointer off" : "Laser pointer on");
//   };

//   const togglePenMode = () => {
//     setPenMode(!penMode);
//     setLaserPointer(prev => ({ ...prev, visible: false }));

//     if (!penMode) {
//       setCurrentPath([]);
//     } else {
//       if (currentPath.length > 0) {
//         setDrawingPaths(prev => [...prev, currentPath]);
//         setCurrentPath([]);
//       }
//     }

//     showToast(penMode ? "Pen mode off" : "Pen mode on");
//   };

//   const clearDrawings = () => {
//     setDrawingPaths([]);
//     setCurrentPath([]);
//     showToast("All drawings cleared");
//   };

//   React.useEffect(() => {
//     let interval;
//     if (isTimerRunning) {
//       interval = setInterval(() => {
//         setPresentationTimer(prev => prev + 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isTimerRunning]);
//   // useEffect لتشغيل الترانزيشن عند تغيير الشريحة
//   React.useEffect(() => {
//     if (isPresenting) {
//       setTransitioning(true);

//       const transition = transitions[slides[currentSlideIndex]?.id];
//       const duration = transition?.duration || 1;

//       setTimeout(() => {
//         setTransitioning(false);
//       }, duration * 1000);
//     }
//   }, [currentSlideIndex, isPresenting]);
//   React.useEffect(() => {
//     if (window.getScreenDetails) {
//       window.getScreenDetails().then(details => {
//         setAvailableMonitors(details.screens);
//       });
//     }
//   }, []);

//   React.useEffect(() => {
//     const handlePresentationKey = (e) => {
//       if (!isPresenting) return;

//       switch (e.key) {
//         case 'ArrowRight':
//         case 'Space':
//         case 'PageDown':
//         case 'Enter':
//           e.preventDefault();
//           nextSlide();
//           break;
//         case 'ArrowLeft':
//         case 'PageUp':
//         case 'Backspace':
//           e.preventDefault();
//           prevSlide();
//           break;
//         case 'Escape':
//           endPresentation();
//           break;
//         case 'p':
//         case 'P':
//           togglePresenterMode();
//           break;
//         case 'l':
//         case 'L':
//           toggleLaserPointer();
//           break;
//         case 'c':
//         case 'C':
//           togglePenMode();
//           break;
//         case 'Home':
//           e.preventDefault();
//           goToSlide(0);
//           break;
//         case 'End':
//           e.preventDefault();
//           goToSlide(slides.length - 1);
//           break;
//         default:
//           break;
//       }
//     };

//     window.addEventListener('keydown', handlePresentationKey);
//     return () => window.removeEventListener('keydown', handlePresentationKey);
//   }, [isPresenting, currentSlideIndex, slides.length]);

//   // ========== ANIMATION HELPER FUNCTIONS ==========
//   const getAnimationStyle = (animation) => {
//     if (!animation) return undefined;

//     const { type, duration, delay, repeat, direction, fillMode, easing } = animation;

//     let animationName = '';
//     switch (type) {
//       case 'fade': animationName = 'fadeIn'; break;
//       case 'fade-out': animationName = 'fadeOut'; break;
//       case 'fly-in': animationName = 'flyIn'; break;
//       case 'fly-out': animationName = 'flyOut'; break;
//       case 'float-in': animationName = 'floatIn'; break;
//       case 'float-out': animationName = 'floatOut'; break;
//       case 'zoom-in': animationName = 'zoomIn'; break;
//       case 'zoom-out': animationName = 'zoomOut'; break;
//       case 'bounce': animationName = 'bounce'; break;
//       case 'pulse': animationName = 'pulse'; break;
//       case 'spin': animationName = 'spin'; break;
//       case 'shake': animationName = 'shake'; break;
//       case 'glow': animationName = 'glow'; break;
//       case 'slide': animationName = 'slideIn'; break;
//       case 'swivel': animationName = 'swivel'; break;
//       case 'grow': animationName = 'grow'; break;
//       case 'wave': animationName = 'wave'; break;
//       case 'teeter': animationName = 'teeter'; break;
//       case 'flash': animationName = 'flash'; break;
//       case 'collapse': animationName = 'collapse'; break;
//       case 'disappear': animationName = 'disappear'; break;
//       case 'arc': animationName = 'arc'; break;
//       case 'curve': animationName = 'curve'; break;
//       case 'loop': animationName = 'loop'; break;
//       default: animationName = 'fadeIn';
//     }

//     const repeatValue = repeat === 'infinite' ? 'infinite' : repeat;
//     return `${animationName} ${duration}s ${easing} ${delay}s ${repeatValue} ${direction} ${fillMode}`;
//   };

//   const addAnimation = (elementId, animationType) => {
//     if (!elementId && !selectedField) {
//       showToast("Please select an element to animate");
//       return;
//     }

//     const targetId = elementId || `element-${activeSlideId}-${selectedField}`;

//     setAnimations(prev => ({
//       ...prev,
//       [targetId]: {
//         type: animationType,
//         duration: animationDuration,
//         delay: animationDelay,
//         repeat: animationRepeat,
//         direction: animationDirection,
//         fillMode: animationFillMode,
//         easing: animationEasing,
//         trigger: animationTrigger
//       }
//     }));

//     // إضافة إلى لوحة الأنيميشن
//     setAnimationPane(prev => [...prev, {
//       id: Date.now(),
//       elementId: targetId,
//       elementType: selectedField,
//       animationType,
//       duration: animationDuration,
//       delay: animationDelay,
//       order: prev.length
//     }]);

//     showToast(`Animation added to ${selectedField}`);
//   };

//   const removeAnimation = (elementId) => {
//     setAnimations(prev => {
//       const newAnimations = { ...prev };
//       delete newAnimations[elementId];
//       return newAnimations;
//     });

//     setAnimationPane(prev => prev.filter(item => item.elementId !== elementId));
//     showToast("Animation removed");
//   };

//   const updateAnimation = (elementId, updates) => {
//     setAnimations(prev => ({
//       ...prev,
//       [elementId]: {
//         ...prev[elementId],
//         ...updates
//       }
//     }));

//     setAnimationPane(prev => prev.map(item =>
//       item.elementId === elementId ? { ...item, ...updates } : item
//     ));
//   };

//   const reorderAnimation = (fromIndex, toIndex) => {
//     const newOrder = [...animationPane];
//     const [movedItem] = newOrder.splice(fromIndex, 1);
//     newOrder.splice(toIndex, 0, movedItem);

//     // تحديث الترتيب
//     setAnimationPane(newOrder.map((item, index) => ({ ...item, order: index })));
//   };

//   const previewAnimation = () => {
//     if (!selectedField) {
//       showToast("Please select an element to preview");
//       return;
//     }

//     setAnimationPreview(true);
//     setIsAnimating(true);

//     // إزالة كلاس الأنيميشن بعد انتهائها
//     setTimeout(() => {
//       setIsAnimating(false);
//       setAnimationPreview(false);
//     }, animationDuration * 1000 + 100);

//     showToast("Previewing animation");
//   };

//   const copyAnimation = () => {
//     if (!selectedField) {
//       showToast("Please select an element to copy animation from");
//       return;
//     }

//     const elementId = `element-${activeSlideId}-${selectedField}`;
//     const animation = animations[elementId];

//     if (animation) {
//       navigator.clipboard.writeText(JSON.stringify(animation));
//       showToast("Animation copied");
//     } else {
//       showToast("No animation on selected element");
//     }
//   };

//   const pasteAnimation = () => {
//     if (!selectedField) {
//       showToast("Please select an element to paste animation to");
//       return;
//     }

//     navigator.clipboard.readText().then(text => {
//       try {
//         const animation = JSON.parse(text);
//         const elementId = `element-${activeSlideId}-${selectedField}`;
//         addAnimation(elementId, animation.type);
//         updateAnimation(elementId, animation);
//         showToast("Animation pasted");
//       } catch (error) {
//         showToast("No animation in clipboard");
//       }
//     });
//   };

//   // ========== TRANSITION FUNCTIONS ==========
//   const applyTransition = (transitionType) => {
//     setSelectedTransition(transitionType);

//     setTransitions(prev => ({
//       ...prev,
//       [activeSlideId]: {
//         type: transitionType,
//         duration: transitionDuration,
//         sound: transitionSound,
//         advanceOnClick: advanceOnClick,
//         advanceAfter: advanceAfter
//       }
//     }));

//     if (applyToAll) {
//       const newTransitions = {};
//       slides.forEach(slide => {
//         newTransitions[slide.id] = {
//           type: transitionType,
//           duration: transitionDuration,
//           sound: transitionSound,
//           advanceOnClick: advanceOnClick,
//           advanceAfter: advanceAfter
//         };
//       });
//       setTransitions(newTransitions);
//       showToast(`Applied ${transitionType} transition to all slides`);
//     } else {
//       showToast(`Applied ${transitionType} transition to current slide`);
//     }
//   };

//   const updateTransition = (updates) => {
//     setTransitions(prev => ({
//       ...prev,
//       [activeSlideId]: {
//         ...prev[activeSlideId],
//         ...updates
//       }
//     }));

//     if (applyToAll) {
//       const newTransitions = {};
//       slides.forEach(slide => {
//         newTransitions[slide.id] = {
//           ...transitions[slide.id],
//           ...updates
//         };
//       });
//       setTransitions(newTransitions);
//     }
//   };

//   const handleTransitionSelect = (type) => {
//     setSelectedTransition(type);
//     applyTransition(type);
//   };

//   const handleDurationChange = (value) => {
//     setTransitionDuration(value);
//     updateTransition({ duration: value });
//   };

//   const handleSoundChange = (sound) => {
//     setTransitionSound(sound);
//     updateTransition({ sound: sound });
//   };

//   const handleAdvanceModeChange = (mode) => {
//     if (mode === 'click') {
//       setAdvanceOnClick(true);
//       setAdvanceAfter(0);
//       updateTransition({ advanceOnClick: true, advanceAfter: 0 });
//     } else {
//       setAdvanceOnClick(false);
//       updateTransition({ advanceOnClick: false });
//     }
//   };

//   const handleAdvanceAfterChange = (seconds) => {
//     setAdvanceAfter(seconds);
//     setAdvanceOnClick(false);
//     updateTransition({ advanceAfter: seconds, advanceOnClick: false });
//   };

//   const handlePreviewTransition = () => {
//     const transition = transitions[activeSlideId];
//     if (!transition || transition.type === 'none') {
//       showToast("Please select a transition first");
//       return;
//     }

//     startPresentation(true);

//     showToast(`Starting presentation with ${transition.type} transition`);
//   };

//   const handleApplyToAllToggle = () => {
//     setApplyToAll(!applyToAll);
//     showToast(!applyToAll ? "Will apply to all slides" : "Will apply to current slide only");
//   };

//   const getTransitionStyle = (slideId) => {
//     const transition = transitions[slideId];
//     if (!transition || transition.type === 'none') return {};

//     return {
//       transition: `all ${transition.duration}s ease-in-out`,
//       animation: previewTransition && activeSlideId === slideId ? `${transition.type} ${transition.duration}s` : undefined
//     };
//   };

//   const playTransitionSound = (soundName) => {
//     if (soundName && soundName !== '[No Sound]') {
//       console.log(`Playing sound: ${soundName}`);
//       showToast(`🔊 ${soundName}`);
//     }
//   };

//   // ========== DESIGN FUNCTIONS ==========
//   const applyTheme = (themeId) => {
//     setCurrentTheme(themeId);
//     showToast(`Theme ${themeId} applied`);
//   };

//   const applyVariant = (variantId) => {
//     setSelectedVariant(variantId);
//     const variant = variants.find(v => v.id === variantId);
//     if (variant) {
//       document.documentElement.style.setProperty('--sada-orange', variant.colors[0]);
//       showToast(`Variant applied`);
//     }
//   };

//   const handleSlideSizeChange = (size) => {
//     setSlideSize(size);
//     if (size === 'standard') {
//       setSlideWidth(1024);
//       setSlideHeight(768);
//     } else if (size === 'widescreen') {
//       setSlideWidth(1366);
//       setSlideHeight(768);
//     }
//     showToast(`Slide size changed to ${size}`);
//   };

//   const applyCustomSize = () => {
//     setSlideSize('custom');
//     showToast(`Custom size applied: ${slideWidth}x${slideHeight}`);
//     setShowSizeModal(false);
//   };

//   const applyBackground = () => {
//     const canvas = document.querySelector('.slide-canvas-container');
//     if (!canvas) return;

//     let backgroundStyle = '';
//     if (backgroundType === 'solid') {
//       backgroundStyle = backgroundColor;
//     } else if (backgroundType === 'gradient') {
//       backgroundStyle = `linear-gradient(${gradientAngle}deg, ${gradientStart}, ${gradientEnd})`;
//     } else if (backgroundType === 'image' && backgroundImage) {
//       backgroundStyle = `url(${backgroundImage}) center/cover`;
//     }

//     canvas.style.background = backgroundStyle;
//     canvas.style.opacity = backgroundTransparency / 100;

//     // حفظ في slides
//     setSlides(prev => prev.map(s =>
//       s.id === activeSlideId
//         ? { ...s, background: { type: backgroundType, value: backgroundStyle, transparency: backgroundTransparency } }
//         : s
//     ));

//     showToast('Background applied');
//   };



//   const resetBackground = () => {
//     setBackgroundType('solid');
//     setBackgroundColor('#ffffff');
//     setGradientStart('#f59e0b');
//     setGradientEnd('#fbbf24');
//     setGradientAngle(90);
//     setBackgroundImage(null);
//     setBackgroundTransparency(100);

//     const canvas = document.querySelector('.slide-canvas-container');
//     if (canvas) {
//       canvas.style.background = '#ffffff';
//       canvas.style.opacity = '1';
//     }

//     showToast('Background reset');
//   };

//   const applyDesignIdea = (ideaId) => {
//     setShowDesignIdeas(false);
//     showToast(`Design idea applied`);
//     // هنا يمكن إضافة منطق تغيير التصميم بالكامل
//   };

//   const formatBackground = () => {
//     setShowBackgroundPanel(true);
//   };

//   // ========== TABLE COMPONENT ==========
//   const TableComponent = ({ table, onUpdate, onSelect, isSelected, onCellSelect, onDelete, activeCell }) => {
//     const [editingCell, setEditingCell] = useState(null);
//     const [hoverRow, setHoverRow] = useState(null);
//     const [hoverCol, setHoverCol] = useState(null);
//     const [isDragging, setIsDragging] = useState(false);
//     const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
//     const [isResizing, setIsResizing] = useState(false);
//     const [resizeDirection, setResizeDirection] = useState(null);
//     const [startSize, setStartSize] = useState({ width: table.width, height: table.height });
//     const [startPos, setStartPos] = useState({ x: 0, y: 0 });

//     const handleDragStart = (e) => { e.preventDefault(); e.stopPropagation(); if (editingCell || e.target.tagName === 'TD' || e.target.closest('td')) return; setIsDragging(true); setDragOffset({ x: e.clientX - table.x, y: e.clientY - table.y }); onSelect(table.id); };
//     const handleDragMove = (e) => { if (!isDragging) return; e.preventDefault(); const newX = e.clientX - dragOffset.x; const newY = e.clientY - dragOffset.y; const canvas = document.querySelector('.slide-canvas-container'); if (canvas) { const rect = canvas.getBoundingClientRect(); const maxX = rect.width - table.width; const maxY = rect.height - table.height; onUpdate({ ...table, x: Math.max(0, Math.min(newX, maxX)), y: Math.max(0, Math.min(newY, maxY)) }); } };
//     const handleDragEnd = () => setIsDragging(false);
//     const handleResizeStart = (e, direction) => { e.preventDefault(); e.stopPropagation(); setIsResizing(true); setResizeDirection(direction); setStartSize({ width: table.width, height: table.height }); setStartPos({ x: e.clientX, y: e.clientY }); onSelect(table.id); };
//     const handleResizeMove = (e) => { if (!isResizing) return; e.preventDefault(); const deltaX = e.clientX - startPos.x; const deltaY = e.clientY - startPos.y; let newWidth = startSize.width; let newHeight = startSize.height; let newX = table.x; let newY = table.y; const minWidth = 100; const minHeight = 60; switch (resizeDirection) { case 'se': newWidth = Math.max(minWidth, startSize.width + deltaX); newHeight = Math.max(minHeight, startSize.height + deltaY); break; case 'sw': newWidth = Math.max(minWidth, startSize.width - deltaX); newHeight = Math.max(minHeight, startSize.height + deltaY); newX = table.x + (startSize.width - newWidth); break; case 'ne': newWidth = Math.max(minWidth, startSize.width + deltaX); newHeight = Math.max(minHeight, startSize.height - deltaY); newY = table.y + (startSize.height - newHeight); break; case 'nw': newWidth = Math.max(minWidth, startSize.width - deltaX); newHeight = Math.max(minHeight, startSize.height - deltaY); newX = table.x + (startSize.width - newWidth); newY = table.y + (startSize.height - newHeight); break; } onUpdate({ ...table, x: newX, y: newY, width: newWidth, height: newHeight }); };
//     const handleResizeEnd = () => { setIsResizing(false); setResizeDirection(null); };

//     React.useEffect(() => { if (isDragging) { window.addEventListener('mousemove', handleDragMove); window.addEventListener('mouseup', handleDragEnd); } else if (isResizing) { window.addEventListener('mousemove', handleResizeMove); window.addEventListener('mouseup', handleResizeEnd); } return () => { window.removeEventListener('mousemove', handleDragMove); window.removeEventListener('mouseup', handleDragEnd); window.removeEventListener('mousemove', handleResizeMove); window.removeEventListener('mouseup', handleResizeEnd); }; }, [isDragging, isResizing, dragOffset, startPos, startSize]);

//     const updateCell = (rowIndex, colIndex, value) => { const newData = { ...table.data }; if (!newData[rowIndex]) newData[rowIndex] = {}; newData[rowIndex][colIndex] = value; onUpdate({ ...table, data: newData }); };
//     const insertRow = (position) => { const newRows = table.rows + 1; const newData = { ...table.data }; if (position === 'above' && hoverRow !== null) { for (let r = newRows - 1; r > hoverRow; r--) newData[r] = newData[r - 1] || {}; newData[hoverRow] = {}; } else if (position === 'below' && hoverRow !== null) { for (let r = newRows - 1; r > hoverRow + 1; r--) newData[r] = newData[r - 1] || {}; newData[hoverRow + 1] = {}; } else newData[table.rows] = {}; onUpdate({ ...table, rows: newRows, data: newData }); };
//     const insertColumn = (position) => { const newCols = table.cols + 1; const newData = { ...table.data }; for (let r = 0; r < table.rows; r++) { if (!newData[r]) newData[r] = {}; const rowData = { ...newData[r] }; if (position === 'left' && hoverCol !== null) { for (let c = newCols - 1; c > hoverCol; c--) rowData[c] = rowData[c - 1]; rowData[hoverCol] = ''; } else if (position === 'right' && hoverCol !== null) { for (let c = newCols - 1; c > hoverCol + 1; c--) rowData[c] = rowData[c - 1]; rowData[hoverCol + 1] = ''; } else rowData[table.cols] = ''; newData[r] = rowData; } onUpdate({ ...table, cols: newCols, data: newData }); };
//     const deleteRow = (index) => { if (table.rows <= 1) return; const newRows = table.rows - 1; const newData = { ...table.data }; delete newData[index]; for (let r = index; r < newRows; r++) newData[r] = newData[r + 1] || {}; delete newData[newRows]; onUpdate({ ...table, rows: newRows, data: newData }); };
//     const deleteColumn = (index) => { if (table.cols <= 1) return; const newCols = table.cols - 1; const newData = { ...table.data }; for (let r = 0; r < table.rows; r++) { if (newData[r]) { const rowData = { ...newData[r] }; delete rowData[index]; for (let c = index; c < newCols; c++) rowData[c] = rowData[c + 1]; delete rowData[newCols]; newData[r] = rowData; } } onUpdate({ ...table, cols: newCols, data: newData }); };

//     return (<div className={`table-container ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`} onClick={() => onSelect(table.id)} onMouseDown={handleDragStart} style={{ position: 'absolute', left: table.x, top: table.y, width: table.width, height: table.height, zIndex: isSelected ? 100 : 1, cursor: isSelected ? 'grab' : 'default', userSelect: 'none' }}>
//       {isSelected && (<div className="table-toolbar"><button onClick={() => insertRow('above')} title="Insert Row Above"><Plus size={12} /> Row Above</button><button onClick={() => insertRow('below')} title="Insert Row Below"><Plus size={12} /> Row Below</button><button onClick={() => insertColumn('left')} title="Insert Column Left"><Plus size={12} /> Col Left</button><button onClick={() => insertColumn('right')} title="Insert Column Right"><Plus size={12} /> Col Right</button>{table.rows > 1 && (<button onClick={() => deleteRow(hoverRow ?? table.rows - 1)} className="danger"><Trash2 size={12} /> Delete Row</button>)}{table.cols > 1 && (<button onClick={() => deleteColumn(hoverCol ?? table.cols - 1)} className="danger"><Trash2 size={12} /> Delete Col</button>)}<button onClick={() => onDelete(table.id)} className="danger"><Trash2 size={12} /> Delete Table</button></div>)}
//       <table className="powerpoint-table" style={{ width: '100%', height: '100%', borderCollapse: 'collapse', background: table.style?.fill || 'white' }}><tbody>{Array.from({ length: table.rows }).map((_, rowIndex) => (<tr key={rowIndex}>{Array.from({ length: table.cols }).map((_, colIndex) => { const isActive = activeCell?.tableId === table.id && activeCell?.row === rowIndex && activeCell?.col === colIndex; const isHover = hoverRow === rowIndex && hoverCol === colIndex; const isEditing = editingCell?.row === rowIndex && editingCell?.col === colIndex; const cellValue = table.data[rowIndex]?.[colIndex] || ''; return (<td key={colIndex} className={`table-cell ${isActive ? 'active' : ''}`} onMouseEnter={() => { setHoverRow(rowIndex); setHoverCol(colIndex); }} onMouseLeave={() => { setHoverRow(null); setHoverCol(null); }} onClick={(e) => { e.stopPropagation(); onCellSelect(table.id, rowIndex, colIndex); }} onDoubleClick={() => setEditingCell({ row: rowIndex, col: colIndex })} style={{ border: `1px solid ${table.style?.borderColor || '#e2e8f0'}`, padding: '8px', textAlign: table.style?.align || 'left', fontWeight: table.style?.bold ? 'bold' : 'normal', fontStyle: table.style?.italic ? 'italic' : 'normal', backgroundColor: isActive ? 'rgba(245, 158, 11, 0.1)' : isHover ? 'rgba(245, 158, 11, 0.05)' : 'transparent' }} >{isEditing ? (<div contentEditable suppressContentEditableWarning onBlur={(e) => { updateCell(rowIndex, colIndex, e.target.innerHTML); setEditingCell(null); }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.target.blur(); } }} style={{ outline: 'none', minHeight: '20px', width: '100%' }} dangerouslySetInnerHTML={{ __html: cellValue }} autoFocus />) : (<div style={{ minHeight: '20px' }} dangerouslySetInnerHTML={{ __html: cellValue || '&nbsp;' }} />)}</td>); })}</tr>))}</tbody></table>
//       {isSelected && (<><div className="resize-handle resize-handle-se" onMouseDown={(e) => handleResizeStart(e, 'se')} title="تغيير الحجم" /><div className="resize-handle resize-handle-sw" onMouseDown={(e) => handleResizeStart(e, 'sw')} title="تغيير الحجم" /><div className="resize-handle resize-handle-ne" onMouseDown={(e) => handleResizeStart(e, 'ne')} title="تغيير الحجم" /><div className="resize-handle resize-handle-nw" onMouseDown={(e) => handleResizeStart(e, 'nw')} title="تغيير الحجم" /></>)}
//     </div>);
//   };

//   // ========== TABLE MODAL ==========
//   const TableModal = ({ onClose, onInsert }) => {
//     const [rows, setRows] = useState(3);
//     const [cols, setCols] = useState(3);
//     const [hoverRow, setHoverRow] = useState(3);
//     const [hoverCol, setHoverCol] = useState(3);
//     const handleMouseEnter = (r, c) => { setHoverRow(r); setHoverCol(c); };
//     const handleMouseLeave = () => { setHoverRow(rows); setHoverCol(cols); };
//     const handleClick = (r, c) => { setRows(r); setCols(c); onInsert(r, c); };
//     return (<div className="table-modal-overlay" onClick={onClose}><div className="table-modal" onClick={(e) => e.stopPropagation()}><div className="table-modal-header"><h4>Insert Table</h4><button className="close-btn" onClick={onClose}>×</button></div><div className="table-modal-content"><div className="table-size-selector"><div className="table-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 24px)', gap: '4px', padding: '15px', background: '#f8fafc', borderRadius: '8px', justifyContent: 'center' }}>{Array.from({ length: 100 }).map((_, index) => { const r = Math.floor(index / 10) + 1; const c = (index % 10) + 1; const isActive = r <= hoverRow && c <= hoverCol; return (<div key={index} className={`grid-cell ${isActive ? 'active' : ''}`} onMouseEnter={() => handleMouseEnter(r, c)} onMouseLeave={handleMouseLeave} onClick={() => handleClick(r, c)} style={{ width: '24px', height: '24px', background: isActive ? '#f59e0b' : '#e2e8f0', border: `1px solid ${isActive ? '#d97706' : '#cbd5e1'}`, borderRadius: '3px', cursor: 'pointer', transition: 'all 0.1s ease' }} title={`${r} rows, ${c} columns`} />); })}</div><div className="table-size-info">{hoverRow} x {hoverCol} table</div></div><div className="table-size-inputs"><div className="input-group"><label>Rows:</label><input type="number" min="1" max="50" value={rows} onChange={(e) => setRows(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))} /></div><div className="input-group"><label>Columns:</label><input type="number" min="1" max="50" value={cols} onChange={(e) => setCols(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))} /></div></div></div><div className="table-modal-footer"><button className="cancel-btn" onClick={onClose}>Cancel</button><button className="insert-btn" onClick={() => onInsert(rows, cols)}>Insert Table</button></div></div></div>);
//   };

//   // ========== SEARCH REPLACE DIALOG ==========
//   const SearchReplaceDialog = ({ onClose }) => {
//     const dialogRef = React.useRef(null);
//     const [activeTab, setActiveTab] = useState('find');
//     const [findText, setFindText] = useState('');
//     const [replaceText, setReplaceText] = useState('');
//     const [matchCase, setMatchCase] = useState(false);
//     const [matchWholeWord, setMatchWholeWord] = useState(false);
//     const [searchResults, setSearchResults] = useState([]);
//     const [currentIndex, setCurrentIndex] = useState(-1);

//     React.useEffect(() => { const handleClickOutside = (event) => { if (dialogRef.current && !dialogRef.current.contains(event.target)) onClose(); }; document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside); }, [onClose]);

//     const handleFind = () => { if (!selectedField) { showToast("Please select a text field first"); return; } const element = document.querySelector('.active-editing'); if (!element) return; const text = element.innerText; let searchText = text; let query = findText; if (!matchCase) { searchText = searchText.toLowerCase(); query = query.toLowerCase(); } const results = []; let index = -1; do { index = searchText.indexOf(query, index + 1); if (index !== -1) { if (matchWholeWord) { const beforeChar = index > 0 ? text[index - 1] : ' '; const afterChar = index + findText.length < text.length ? text[index + findText.length] : ' '; const isWordBoundary = !/[a-zA-Z0-9]/.test(beforeChar) && !/[a-zA-Z0-9]/.test(afterChar); if (!isWordBoundary) continue; } results.push(index); } } while (index !== -1); setSearchResults(results); if (results.length > 0) { setCurrentIndex(0); highlightResult(results[0], findText.length); showToast(`Found ${results.length} matches`); } else showToast("No matches found"); };
//     const highlightResult = (start, length) => { const element = document.querySelector('.active-editing'); if (!element) return; const range = document.createRange(); const textNode = element.firstChild; if (textNode) { range.setStart(textNode, start); range.setEnd(textNode, start + length); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); element.scrollIntoView({ behavior: 'smooth', block: 'center' }); } };
//     const navigateResult = (direction) => { if (searchResults.length === 0) return; let newIndex; if (direction === 'next') newIndex = (currentIndex + 1) % searchResults.length; else { newIndex = currentIndex - 1; if (newIndex < 0) newIndex = searchResults.length - 1; } setCurrentIndex(newIndex); highlightResult(searchResults[newIndex], findText.length); };
//     const handleReplace = () => { if (!selectedField || currentIndex === -1) return; const element = document.querySelector('.active-editing'); if (!element) return; const selection = window.getSelection(); if (selection.rangeCount > 0) { const range = selection.getRangeAt(0); range.deleteContents(); range.insertNode(document.createTextNode(replaceText)); const newText = element.innerText; setSlides(prev => prev.map(s => s.id === activeSlideId ? { ...s, [selectedField]: newText } : s)); handleFind(); showToast("Replaced"); } };
//     const handleReplaceAll = () => { if (!selectedField || searchResults.length === 0) return; const element = document.querySelector('.active-editing'); if (!element) return; let text = element.innerText; let newText = text; const sortedResults = [...searchResults].sort((a, b) => b - a); sortedResults.forEach(start => { newText = newText.substring(0, start) + replaceText + newText.substring(start + findText.length); }); element.innerText = newText; setSlides(prev => prev.map(s => s.id === activeSlideId ? { ...s, [selectedField]: newText } : s)); setSearchResults([]); setCurrentIndex(-1); showToast(`Replaced ${searchResults.length} occurrences`); };

//     return (<div className="search-dialog-overlay"><div className="search-dialog-modern" ref={dialogRef}><div className="search-dialog-header-modern"><div className="search-tabs"><button className={`search-tab ${activeTab === 'find' ? 'active' : ''}`} onClick={() => setActiveTab('find')}><Search size={14} />Find</button><button className={`search-tab ${activeTab === 'replace' ? 'active' : ''}`} onClick={() => setActiveTab('replace')}><Replace size={14} />Replace</button></div><button className="close-btn-modern" onClick={onClose}>✕</button></div><div className="search-dialog-content-modern"><div className="search-field-group"><Search size={16} className="field-icon" /><input type="text" placeholder="Find what" value={findText} onChange={(e) => setFindText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleFind()} autoFocus /></div>{activeTab === 'replace' && (<div className="search-field-group"><Replace size={16} className="field-icon" /><input type="text" placeholder="Replace with" value={replaceText} onChange={(e) => setReplaceText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleReplace()} /></div>)}<div className="search-options-modern"><label className="search-option"><input type="checkbox" checked={matchCase} onChange={(e) => setMatchCase(e.target.checked)} /><span>Match case</span></label><label className="search-option"><input type="checkbox" checked={matchWholeWord} onChange={(e) => setMatchWholeWord(e.target.checked)} /><span>Whole word only</span></label></div>{searchResults.length > 0 && (<div className="search-results-info-modern">{currentIndex + 1} of {searchResults.length} matches</div>)}<div className="search-actions-modern"><div className="search-nav-modern"><button className="nav-btn-modern" onClick={() => navigateResult('prev')} disabled={searchResults.length === 0}><ChevronLeft size={14} /> Previous</button><button className="nav-btn-modern" onClick={() => navigateResult('next')} disabled={searchResults.length === 0}>Next <ChevronRight size={14} /></button></div><div className="action-buttons-modern"><button className="find-btn-modern" onClick={handleFind}><Search size={14} /> Find</button>{activeTab === 'replace' && (<><button className="replace-btn-modern" onClick={handleReplace} disabled={searchResults.length === 0}><Replace size={14} /> Replace</button><button className="replace-all-btn-modern" onClick={handleReplaceAll} disabled={searchResults.length === 0}><Copy size={14} /> All</button></>)}</div></div></div></div></div>);
//   };

//   // ========== ANIMATION PANE COMPONENT ==========
//   const AnimationPane = ({ animations, onRemove, onReorder, onUpdate }) => {
//     return (
//       <div className="animation-pane">
//         <div className="animation-pane-header">
//           <h4>Animation Pane</h4>
//           <button className="close-btn" onClick={() => setShowAnimationPane(false)}>×</button>
//         </div>
//         <div className="animation-pane-content">
//           {animationPane.length === 0 ? (
//             <div className="animation-pane-empty">
//               <Sparkles size={32} color="#94a3b8" />
//               <p>No animations</p>
//               <small>Select an element and add animation</small>
//             </div>
//           ) : (
//             <div className="animation-list">
//               {animationPane.map((item, index) => (
//                 <div key={item.id} className="animation-item">
//                   <div className="animation-item-order">{index + 1}</div>
//                   <div className="animation-item-content">
//                     <div className="animation-item-type">
//                       <span className="animation-name">{item.animationType}</span>
//                     </div>
//                     <div className="animation-item-details">
//                       <span className="animation-element">{item.elementType}</span>
//                       <span className="animation-time">{item.duration}s</span>
//                     </div>
//                     <div className="animation-item-controls">
//                       <button onClick={() => onReorder(index, index - 1)} disabled={index === 0}><ArrowUp size={14} /></button>
//                       <button onClick={() => onReorder(index, index + 1)} disabled={index === animationPane.length - 1}><ArrowDown size={14} /></button>
//                       <button onClick={() => onRemove(item.elementId)} className="danger"><Trash2 size={14} /></button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // ========== SIZE MODAL COMPONENT ==========
//   const SizeModal = ({ onClose, onApply, width, height, onWidthChange, onHeightChange }) => {
//     return (
//       <div className="modal-overlay" onClick={onClose}>
//         <div className="modal-content" onClick={e => e.stopPropagation()}>
//           <div className="modal-header">
//             <h3>Slide Size</h3>
//             <button className="close-btn" onClick={onClose}>×</button>
//           </div>
//           <div className="modal-body">
//             <div className="size-presets">
//               <button className={`preset-btn ${slideSize === 'standard' ? 'active' : ''}`} onClick={() => handleSlideSizeChange('standard')}>
//                 Standard (4:3)
//               </button>
//               <button className={`preset-btn ${slideSize === 'widescreen' ? 'active' : ''}`} onClick={() => handleSlideSizeChange('widescreen')}>
//                 Widescreen (16:9)
//               </button>
//             </div>
//             <div className="custom-size-inputs">
//               <div className="input-group">
//                 <label>Width (px):</label>
//                 <input
//                   type="number"
//                   value={width}
//                   onChange={(e) => onWidthChange(parseInt(e.target.value))}
//                   min="800"
//                   max="1920"
//                 />
//               </div>
//               <div className="input-group">
//                 <label>Height (px):</label>
//                 <input
//                   type="number"
//                   value={height}
//                   onChange={(e) => onHeightChange(parseInt(e.target.value))}
//                   min="600"
//                   max="1080"
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="modal-footer">
//             <button className="cancel-btn" onClick={onClose}>Cancel</button>
//             <button className="apply-btn" onClick={onApply}>Apply</button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // ========== BACKGROUND PANEL COMPONENT ==========
//   const BackgroundPanel = ({ onClose, onApply, onReset }) => {
//     return (
//       <div className="panel-overlay" onClick={onClose}>
//         <div className="panel-content right" onClick={e => e.stopPropagation()}>
//           <div className="panel-header">
//             <h3>Format Background</h3>
//             <button className="close-btn" onClick={onClose}>×</button>
//           </div>
//           <div className="panel-body">
//             <div className="background-type-tabs">
//               <button
//                 className={`tab-btn ${backgroundType === 'solid' ? 'active' : ''}`}
//                 onClick={() => setBackgroundType('solid')}
//               >
//                 Solid
//               </button>
//               <button
//                 className={`tab-btn ${backgroundType === 'gradient' ? 'active' : ''}`}
//                 onClick={() => setBackgroundType('gradient')}
//               >
//                 Gradient
//               </button>
//               <button
//                 className={`tab-btn ${backgroundType === 'image' ? 'active' : ''}`}
//                 onClick={() => setBackgroundType('image')}
//               >
//                 Image
//               </button>
//             </div>

//             {backgroundType === 'solid' && (
//               <div className="color-picker-section">
//                 <label>Color</label>
//                 <div className="color-input-row">
//                   <input
//                     type="color"
//                     value={backgroundColor}
//                     onChange={(e) => setBackgroundColor(e.target.value)}
//                   />
//                   <input
//                     type="text"
//                     value={backgroundColor}
//                     onChange={(e) => setBackgroundColor(e.target.value)}
//                     placeholder="#000000"
//                   />
//                 </div>
//               </div>
//             )}

//             {backgroundType === 'gradient' && (
//               <div className="gradient-section">
//                 <div className="color-input-row">
//                   <label>Start:</label>
//                   <input
//                     type="color"
//                     value={gradientStart}
//                     onChange={(e) => setGradientStart(e.target.value)}
//                   />
//                 </div>
//                 <div className="color-input-row">
//                   <label>End:</label>
//                   <input
//                     type="color"
//                     value={gradientEnd}
//                     onChange={(e) => setGradientEnd(e.target.value)}
//                   />
//                 </div>
//                 <div className="angle-control">
//                   <label>Angle: {gradientAngle}°</label>
//                   <input
//                     type="range"
//                     min="0"
//                     max="360"
//                     value={gradientAngle}
//                     onChange={(e) => setGradientAngle(parseInt(e.target.value))}
//                   />
//                 </div>
//               </div>
//             )}

//             {backgroundType === 'image' && (
//               <div className="image-section">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   id="image-upload"
//                   style={{ display: 'none' }}
//                 />
//                 <button
//                   className="upload-btn"
//                   onClick={() => document.getElementById('image-upload').click()}
//                 >
//                   Choose Image
//                 </button>
//                 {backgroundImage && (
//                   <div className="image-preview">
//                     <img src={backgroundImage} alt="preview" />
//                     <button className="remove-img" onClick={() => setBackgroundImage(null)}>×</button>
//                   </div>
//                 )}
//               </div>
//             )}

//             <div className="transparency-control">
//               <label>Transparency: {backgroundTransparency}%</label>
//               <input
//                 type="range"
//                 min="0"
//                 max="100"
//                 value={backgroundTransparency}
//                 onChange={(e) => setBackgroundTransparency(parseInt(e.target.value))}
//               />
//             </div>
//           </div>
//           <div className="panel-footer">
//             <button className="reset-btn" onClick={onReset}>Reset</button>
//             <button className="apply-btn" onClick={onApply}>Apply</button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // ========== COMMENTS PANEL COMPONENT ==========
//   const CommentsPanel = ({ comments, onResolve, onReply, onClose }) => {
//     const [replyText, setReplyText] = useState('');
//     const [activeReply, setActiveReply] = useState(null);

//     if (!comments.length) {
//       return (
//         <div className="comments-panel">
//           <div className="comments-header">
//             <h4>Comments</h4>
//             <button className="close-btn" onClick={onClose}>×</button>
//           </div>
//           <div className="comments-empty">
//             <MessageSquare size={32} color="#94a3b8" />
//             <p>No comments yet</p>
//             <button className="btn-add-comment" onClick={handleNewComment}>
//               <Plus size={14} /> Add a comment
//             </button>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="comments-panel">
//         <div className="comments-header">
//           <h4>Comments ({comments.length})</h4>
//           <button className="close-btn" onClick={onClose}>×</button>
//         </div>

//         <div className="comments-list">
//           {comments.map(comment => (
//             <div key={comment.id} className={`comment-thread ${comment.resolved ? 'resolved' : ''}`}>
//               <div className="comment-main">
//                 <div className="comment-avatar">
//                   <div className="avatar-circle">
//                     {comment.author.charAt(0)}
//                   </div>
//                 </div>
//                 <div className="comment-content">
//                   <div className="comment-header">
//                     <span className="comment-author">{comment.author}</span>
//                     <span className="comment-time">
//                       {new Date(comment.timestamp).toLocaleTimeString()}
//                     </span>
//                   </div>

//                   {comment.selectedText && (
//                     <div className="quoted-text">
//                       "{comment.selectedText}"
//                     </div>
//                   )}

//                   <div className="comment-text">
//                     {comment.text || <em>New comment...</em>}
//                   </div>

//                   <div className="comment-actions">
//                     <button
//                       className={`resolve-btn ${comment.resolved ? 'resolved' : ''}`}
//                       onClick={() => onResolve(comment.id)}
//                     >
//                       {comment.resolved ? 'Reopen' : 'Resolve'}
//                     </button>
//                     <button
//                       className="reply-btn"
//                       onClick={() => setActiveReply(activeReply === comment.id ? null : comment.id)}
//                     >
//                       Reply
//                     </button>
//                   </div>

//                   {activeReply === comment.id && (
//                     <div className="reply-input">
//                       <input
//                         type="text"
//                         placeholder="Write a reply..."
//                         value={replyText}
//                         onChange={(e) => setReplyText(e.target.value)}
//                         onKeyDown={(e) => {
//                           if (e.key === 'Enter' && replyText.trim()) {
//                             onReply(comment.id, replyText);
//                             setReplyText('');
//                             setActiveReply(null);
//                           }
//                         }}
//                       />
//                       <button onClick={() => {
//                         if (replyText.trim()) {
//                           onReply(comment.id, replyText);
//                           setReplyText('');
//                           setActiveReply(null);
//                         }
//                       }}>
//                         <Send size={12} />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {comment.replies.length > 0 && (
//                 <div className="comment-replies">
//                   {comment.replies.map(reply => (
//                     <div key={reply.id} className="reply">
//                       <div className="reply-avatar">
//                         <div className="avatar-circle small">{reply.author.charAt(0)}</div>
//                       </div>
//                       <div className="reply-content">
//                         <div className="reply-header">
//                           <span className="reply-author">{reply.author}</span>
//                           <span className="reply-time">
//                             {new Date(reply.timestamp).toLocaleTimeString()}
//                           </span>
//                         </div>
//                         <div className="reply-text">{reply.text}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // ========== ACCESSIBILITY PANEL COMPONENT ==========
//   const AccessibilityPanel = ({ issues, onClose, onFix }) => {
//     const getSeverityIcon = (severity) => {
//       switch (severity) {
//         case 'error': return <XCircle size={16} color="#ef4444" />;
//         case 'warning': return <AlertTriangle size={16} color="#f59e0b" />;
//         default: return <Info size={16} color="#3b82f6" />;
//       }
//     };

//     return (
//       <div className="accessibility-panel">
//         <div className="accessibility-header">
//           <h4>Accessibility Checker</h4>
//           <button className="close-btn" onClick={onClose}>×</button>
//         </div>

//         <div className="accessibility-summary">
//           <div className="summary-icon">
//             <Accessibility size={24} color={issues.length === 0 ? "#10b981" : "#f59e0b"} />
//           </div>
//           <div className="summary-text">
//             <span className="summary-count">
//               {issues.length} issue{issues.length !== 1 ? 's' : ''} found
//             </span>
//             <span className="summary-desc">
//               {issues.length === 0 ? 'Great job!' : 'Make your presentation accessible to everyone'}
//             </span>
//           </div>
//         </div>

//         {issues.length > 0 && (
//           <div className="issues-list">
//             {issues.map((issue, index) => (
//               <div key={index} className={`issue-item severity-${issue.severity}`}>
//                 <div className="issue-icon">
//                   {getSeverityIcon(issue.severity)}
//                 </div>
//                 <div className="issue-content">
//                   <div className="issue-type">
//                     {issue.type === 'contrast' && 'Color Contrast'}
//                     {issue.type === 'alt-text' && 'Alternative Text'}
//                     {issue.type === 'font-size' && 'Font Size'}
//                   </div>
//                   <div className="issue-description">
//                     {issue.description}
//                   </div>
//                   <div className="issue-location">
//                     Slide {issue.slide || 'current'}
//                   </div>
//                   <div className="issue-suggestion">
//                     💡 {issue.suggestion}
//                   </div>
//                   <button className="fix-btn" onClick={() => onFix(issue)}>
//                     Fix it
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ========== TRANSLATOR PANEL COMPONENT ==========
//   const TranslatorPanel = ({ results, onClose, onLanguageChange, targetLanguage }) => {
//     const languages = [
//       { code: 'ar', name: 'Arabic' },
//       { code: 'en', name: 'English' },
//       { code: 'fr', name: 'French' },
//       { code: 'es', name: 'Spanish' },
//       { code: 'de', name: 'German' },
//       { code: 'it', name: 'Italian' },
//       { code: 'zh', name: 'Chinese' },
//       { code: 'ja', name: 'Japanese' }
//     ];

//     return (
//       <div className="translator-panel">
//         <div className="translator-header">
//           <h4>Translator</h4>
//           <button className="close-btn" onClick={onClose}>×</button>
//         </div>

//         <div className="translator-content">
//           <div className="language-selector">
//             <label>Translate to:</label>
//             <select
//               value={targetLanguage}
//               onChange={(e) => onLanguageChange(e.target.value)}
//             >
//               {languages.map(lang => (
//                 <option key={lang.code} value={lang.code}>
//                   {lang.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {results.map((result, index) => (
//             <div key={index} className="translation-result">
//               <div className="original-text">
//                 <span className="label">Original:</span>
//                 <p>{result.original}</p>
//               </div>
//               <div className="translated-text">
//                 <span className="label">Translated:</span>
//                 <p>{result.translated}</p>
//               </div>
//               <button className="insert-btn" onClick={() => {
//                 showToast("Translation inserted");
//               }}>
//                 <Copy size={12} /> Insert
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // ========== PRESENTATION MODE COMPONENT ==========
//   const PresentationMode = () => {
//     const currentSlide = slides[currentSlideIndex];
//     const formatTime = (seconds) => {
//       const mins = Math.floor(seconds / 60);
//       const secs = seconds % 60;
//       return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//     };

//     // دالة لتطبيق الترانزيشن
//     const getTransitionStyle = () => {
//       const transition = transitions[slides[currentSlideIndex]?.id];
//       if (!transition || transition.type === 'none' || !transitioning) return {};

//       return {
//         animation: `${transition.type} ${transition.duration}s ease-in-out`
//       };
//     };

//     return (
//       <div className="presentation-mode" style={{ background: '#f1f5f9', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000000, overflow: 'auto' }} onMouseMove={handleMouseMove}>
//         <div className="presentation-background" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>

//           {/* شريط الأدوات العلوي */}
//           {showPresenterTools && (
//             <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <div style={{ display: 'flex', gap: '10px' }}>
//                 <button onClick={prevSlide} disabled={currentSlideIndex === 0} style={{ padding: '5px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer' }}>
//                   <ChevronLeft size={18} />
//                 </button>
//                 <button onClick={nextSlide} disabled={currentSlideIndex === slides.length - 1} style={{ padding: '5px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer' }}>
//                   <ChevronRight size={18} />
//                 </button>
//                 <span style={{ padding: '5px 10px', background: '#f1f5f9', borderRadius: '4px', fontSize: '13px' }}>
//                   {currentSlideIndex + 1} / {slides.length}
//                 </span>
//               </div>

//               <div style={{ display: 'flex', gap: '10px' }}>
//                 {showTimer && (
//                   <span style={{ padding: '5px 10px', background: '#1e293b', color: 'white', borderRadius: '4px', fontSize: '13px' }}>
//                     <Timer size={14} style={{ marginRight: '4px' }} /> {formatTime(presentationTimer)}
//                   </span>
//                 )}
//                 <button onClick={endPresentation} style={{ padding: '5px 15px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
//                   End
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* مؤشر الليزر */}
//           {laserPointer.visible && (
//             <div
//               className="laser-pointer"
//               style={{
//                 left: laserPointer.x,
//                 top: laserPointer.y,
//                 position: 'fixed',
//                 width: '20px',
//                 height: '20px',
//                 borderRadius: '50%',
//                 background: 'radial-gradient(circle, rgba(255,0,0,0.8) 0%, rgba(255,0,0,0) 70%)',
//                 pointerEvents: 'none',
//                 zIndex: 10001,
//                 transform: 'translate(-50%, -50%)'
//               }}
//             />
//           )}

//           {/* منطقة الرسم */}
//           <svg className="drawing-layer" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
//             {drawingPaths.map((path, index) => (
//               <path
//                 key={index}
//                 d={`M ${path.map(p => `${p.x},${p.y}`).join(' L ')}`}
//                 stroke={path[0]?.color || '#f59e0b'}
//                 strokeWidth={path[0]?.size || 2}
//                 fill="none"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             ))}
//             {currentPath.length > 0 && (
//               <path
//                 d={`M ${currentPath.map(p => `${p.x},${p.y}`).join(' L ')}`}
//                 stroke={penColor}
//                 strokeWidth={penSize}
//                 fill="none"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             )}
//           </svg>

//           {/* محتوى الشريحة مع الترانزيشن */}
//           <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
//             <div className="slide-canvas-container" style={{
//               width: '100%',
//               maxWidth: '960px',
//               aspectRatio: '16/9',
//               background: '#fff',
//               boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
//               position: 'relative',
//               overflow: 'hidden',
//               padding: '20px 40px',
//               ...getTransitionStyle()
//             }}>
//               <ThemeManager themeId={currentTheme} slideType="intro" data={{ title: '', subtitle: '' }} />
//               <div className="powerpoint-layout" style={{ position: 'relative', zIndex: 10, background: 'transparent', height: '100%' }}>
//                 {(() => {
//                   if (!currentSlide) return null;
//                   switch (currentSlide.layout) {
//                     case LAYOUT_TYPES.TITLE_SLIDE: return (
//                       <div className="title-slide-layout">
//                         <div className="title-slide-main">{currentSlide.title || 'Click to add title'}</div>
//                         <div className="title-slide-sub">{currentSlide.subtitle || 'Click to add subtitle'}</div>
//                       </div>
//                     );
//                     case LAYOUT_TYPES.TITLE_AND_CONTENT: return (
//                       <div className="title-content-layout">
//                         <div className="content-title">{currentSlide.title || 'Click to add title'}</div>
//                         <div className="content-body">{currentSlide.content || 'Click to add text'}</div>
//                       </div>
//                     );
//                     default: return (
//                       <div className="blank-slide-layout">
//                         Slide {currentSlideIndex + 1}
//                       </div>
//                     );
//                   }
//                 })()}
//                 {/* طبقة الصور - ضعها تحت طبقة الجداول tables-layer */}
//                 <div className="images-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
//                   {slides.find(s => s.id === activeSlideId)?.images?.map(img => (
//                     <div
//                       key={img.id}
//                       style={{
//                         position: 'absolute',
//                         left: img.x,
//                         top: img.y,
//                         width: img.width,
//                         transform: `rotate(${img.rotation}deg)`,
//                         opacity: img.opacity / 100,
//                         pointerEvents: 'auto',
//                         cursor: 'move',
//                         border: selectedField === `img-${img.id}` ? '2px solid #f59e0b' : 'none'
//                       }}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setSelectedField(`img-${img.id}`); // لتحديد الصورة
//                       }}
//                       onMouseDown={(e) => {
//                         // منطق السحب (Drag and Drop)
//                         const startX = e.clientX - img.x;
//                         const startY = e.clientY - img.y;

//                         const handleMouseMove = (moveEvent) => {
//                           updateImageStyle(img.id, {
//                             x: moveEvent.clientX - startX,
//                             y: moveEvent.clientY - startY
//                           });
//                         };

//                         const handleMouseUp = () => {
//                           document.removeEventListener('mousemove', handleMouseMove);
//                           document.removeEventListener('mouseup', handleMouseUp);
//                         };

//                         document.addEventListener('mousemove', handleMouseMove);
//                         document.addEventListener('mouseup', handleMouseUp);
//                       }}
//                     >
//                       <img src={img.src} style={{ width: '100%', display: 'block' }} draggable="false" />

//                       {/* زر الحذف يظهر عند تحديد الصورة */}
//                       {selectedField === `img-${img.id}` && (
//                         <button
//                           onClick={() => deleteImage(img.id)}
//                           style={{
//                             position: 'absolute', top: -10, right: -10, background: 'red',
//                             color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer'
//                           }}
//                         >
//                           ×
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                 </div></div>
//             </div>
//           </div>

//           {/* شريط الأدوات السفلي */}
//           {showPresenterTools && (
//             <div style={{ background: 'white', borderTop: '1px solid #e2e8f0', padding: '10px 20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
//               <button onClick={toggleLaserPointer} style={{ padding: '5px 15px', background: laserPointer.visible ? '#f59e0b' : '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer', color: laserPointer.visible ? 'white' : '#475569' }}>
//                 <span style={{ fontSize: '16px', marginRight: '4px' }}>🔴</span> Laser
//               </button>
//               <button onClick={togglePenMode} style={{ padding: '5px 15px', background: penMode ? '#f59e0b' : '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer', color: penMode ? 'white' : '#475569' }}>
//                 <PenTool size={14} style={{ marginRight: '4px' }} /> Pen
//               </button>
//               <button onClick={clearDrawings} disabled={drawingPaths.length === 0} style={{ padding: '5px 15px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: drawingPaths.length === 0 ? 'not-allowed' : 'pointer', opacity: drawingPaths.length === 0 ? 0.5 : 1 }}>
//                 <Eraser size={14} style={{ marginRight: '4px' }} /> Clear
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // ========== useEffect for More Colors ==========
//   React.useEffect(() => { window.showMoreColors = setShowMoreColors; return () => { window.showMoreColors = null; }; }, []);

//   // ========== RIBBON GROUPS DATA ==========
//   const ribbonGroups = {
//     Home: [
//       { id: 'clipboard', label: 'Clipboard', type: 'mega-with-stack', megaIcon: Clipboard, megaText: 'Paste', onClick: handlePaste, stackButtons: [{ icon: Scissors, text: 'Cut', onClick: handleCut }, { icon: Copy, text: 'Copy', onClick: handleCopy }, { icon: PaintRoller, text: 'Format Painter', onClick: handleFormatPainter }] },
//       { id: 'slides', label: 'Slides', type: 'mega-with-stack', megaIcon: PlusSquare, megaText: ['New', 'Slide'], onClick: () => addNewSlide(LAYOUT_TYPES.BLANK), stackButtons: [{ icon: ChevronDown, text: 'More', onClick: () => { setPickerMode('add'); setShowLayoutPicker(true); } }, { icon: Layout, text: 'Layout', onClick: () => { setPickerMode('change'); setShowLayoutPicker(true); } }] },
//       { id: 'font', label: 'Font', type: 'font-controls-advanced', currentFont: selectedFont, currentSize: fontSize, onFontClick: () => setShowFontPicker(true), onIncreaseSize: increaseFontSize, onDecreaseSize: decreaseFontSize, onBold: toggleBold, onItalic: toggleItalic, onUnderline: toggleUnderline, onClear: clearFormatting, isBold: isBold, isItalic: isItalic, isUnderline: isUnderline },
//       { id: 'paragraph', label: 'Paragraph', type: 'paragraph-controls' },
//       { id: 'drawing', label: 'Drawing', type: 'drawing-controls' },
//       { id: 'editing', label: 'Editing', type: 'editing-controls' }
//     ],
//     Insert: [
//       { id: 'tables', label: 'Tables', type: 'simple-mega', icon: Table, text: 'Table', hasDropdown: true },
//       // ابحث عن قسم الصور داخل Insert وقم بتغيير onClick
//       {
//         id: 'images',
//         label: 'Images',
//         type: 'mega-with-stack',
//         megaIcon: Image,
//         megaColor: '#059669',
//         megaText: ['Pictures'],
//         // أضف هذا الجزء هنا:
//         onClick: () => document.getElementById('global-image-upload').click(),
//         stackButtons: [{ icon: Search, text: 'Stock Images' }, { icon: Copy, text: 'Screenshot' }]
//       },
//       { id: 'illustrations', label: 'Illustrations', type: 'illustrations-grid' },
//       { id: 'links-comments', label: 'Links & Comments', type: 'vertical-buttons', buttons: [{ icon: Link, text: 'Link', color: '#2563eb' }, { icon: MessageSquare, text: 'Comment', color: '#f59e0b' }] },
//       { id: 'text', label: 'Text', type: 'mega-with-stack', megaIcon: Type, megaColor: '#2563eb', megaText: 'Text Box', stackButtons: [{ icon: PenTool, text: 'WordArt', color: '#db2777' }, { icon: Hash, text: 'Slide Number' }] },
//       { id: 'symbols', label: 'Symbols', type: 'vertical-buttons', buttons: [{ icon: Sigma, text: 'Equation', color: '#475569' }, { icon: Smile, text: 'Symbol' }] },
//       { id: 'media', label: 'Media', type: 'vertical-buttons', buttons: [{ icon: Video, text: 'Video', color: '#ef4444' }, { icon: Music, text: 'Audio', color: '#3b82f6' }] }
//     ],
//     Design: [
//       { id: 'themes', label: 'Themes', type: 'themes-gallery-dynamic' },
//       { id: 'variants', label: 'Variants', type: 'variants-gallery' },
//       { id: 'customize', label: 'Customize', type: 'customize-controls' },
//       { id: 'designer', label: 'Designer', type: 'designer-ideas' }
//     ],
//     Transitions: [
//       { id: 'preview', label: 'Preview', type: 'preview-button' },
//       { id: 'transition-gallery', label: 'Transition to This Slide', type: 'transition-gallery' },
//       { id: 'effect', label: 'Effect', type: 'effect-options' },
//       { id: 'timing', label: 'Timing', type: 'timing-controls' }
//     ],
//     Animations: [
//       {
//         id: 'preview',
//         label: 'Preview',
//         type: 'animation-preview-button',
//         onPreview: previewAnimation,
//         isAnimating: isAnimating
//       },
//       {
//         id: 'animation-gallery',
//         label: 'Animation',
//         type: 'animation-gallery-complete',
//         categories: animationTypes,
//         currentCategory: currentAnimationCategory,
//         onCategoryChange: setCurrentAnimationCategory,
//         onSelectAnimation: (type) => addAnimation(null, type),
//         onCopy: copyAnimation,
//         onPaste: pasteAnimation
//       },
//       {
//         id: 'advanced',
//         label: 'Advanced',
//         type: 'advanced-animation-complete',
//         onAddAnimation: () => addAnimation(null, 'fade'),
//         onShowPane: () => setShowAnimationPane(true),
//         onCopy: copyAnimation,
//         onPaste: pasteAnimation,
//         hasAnimations: animationPane.length > 0
//       },
//       {
//         id: 'timing',
//         label: 'Timing',
//         type: 'animation-timing-complete',
//         duration: animationDuration,
//         delay: animationDelay,
//         repeat: animationRepeat,
//         direction: animationDirection,
//         fillMode: animationFillMode,
//         easing: animationEasing,
//         onDurationChange: setAnimationDuration,
//         onDelayChange: setAnimationDelay,
//         onRepeatChange: setAnimationRepeat,
//         onDirectionChange: setAnimationDirection,
//         onFillModeChange: setAnimationFillMode,
//         onEasingChange: setAnimationEasing,
//         onReorderUp: () => {
//           const index = animationPane.findIndex(a => a.elementId === `element-${activeSlideId}-${selectedField}`);
//           if (index > 0) reorderAnimation(index, index - 1);
//         },
//         onReorderDown: () => {
//           const index = animationPane.findIndex(a => a.elementId === `element-${activeSlideId}-${selectedField}`);
//           if (index < animationPane.length - 1) reorderAnimation(index, index + 1);
//         }
//       }
//     ],
//     Questions: [
//       { id: 'basic-polls', label: 'Basic Polls', type: 'polls-basic' },
//       { id: 'advanced', label: 'Advanced', type: 'polls-advanced' },
//       { id: 'gaming', label: 'Gaming', type: 'polls-gaming' },
//       { id: 'privacy', label: 'Privacy', type: 'polls-privacy' },
//       { id: 'config', label: 'Config', type: 'polls-config' }
//     ],
//     Session: [
//       { id: 'live-access', label: 'Live Access', type: 'session-live' },
//       { id: 'audience-control', label: 'Audience Control', type: 'session-audience' },
//       { id: 'atmosphere', label: 'Atmosphere', type: 'session-atmosphere' }
//     ],
//     Review: [
//       {
//         id: 'proofing',
//         label: 'Proofing',
//         type: 'proofing-controls-complete',
//         onSpelling: handleSpellingCheck,
//         onThesaurus: handleThesaurus,
//         onAccessibility: handleAccessibilityCheck,
//         isChecking: checkingSpelling,
//         hasErrors: spellingErrors.length > 0
//       },
//       {
//         id: 'insights',
//         label: 'Insights',
//         type: 'insights-complete',
//         onSmartLookup: handleSmartLookup
//       },
//       {
//         id: 'language',
//         label: 'Language',
//         type: 'language-controls-complete',
//         onTranslate: handleTranslate,
//         onLanguagePref: handleLanguagePreference,
//         currentLanguage: 'English (United States)'
//       },
//       {
//         id: 'comments',
//         label: 'Comments',
//         type: 'comments-controls-complete',
//         comments: comments,
//         onNewComment: handleNewComment,
//         onShowComments: () => setShowComments(!showComments),
//         onNextComment: navigateComments('next'),
//         onPrevComment: navigateComments('prev'),
//         onDeleteAll: handleDeleteAllComments,
//         showComments: showComments
//       },
//       {
//         id: 'protect',
//         label: 'Protect',
//         type: 'protect-controls-complete',
//         isProtected: isProtected,
//         isMarkedFinal: isMarkedFinal,
//         onProtect: handleProtectPresentation,
//         onMarkFinal: handleMarkAsFinal,
//         onRestrict: handleRestrictAccess
//       }
//     ],
//     'Slide Show': [
//       { id: 'start', label: 'Start', type: 'slideshow-start' },
//       { id: 'setup', label: 'Set Up', type: 'slideshow-setup' },
//       { id: 'monitors', label: 'Monitors', type: 'slideshow-monitors' }
//     ],
//     View: [
//       { id: 'presentation-views', label: 'Presentation Views', type: 'presentation-views' },
//       { id: 'master-views', label: 'Master Views', type: 'master-views' },
//       { id: 'show', label: 'Show', type: 'show-controls' },
//       { id: 'zoom', label: 'Zoom', type: 'zoom-controls' },
//       { id: 'window', label: 'Window', type: 'window-controls' }
//     ]
//   };

//   // ========== RENDER RIBBON GROUP ==========
//   const renderRibbonGroup = (group) => {
//     switch (group.type) {
//       case 'mega-with-stack':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-flex"><button className="btn-mega" onClick={group.onClick}><group.megaIcon size={28} color={group.megaColor || "#475569"} />{Array.isArray(group.megaText) ? (<div className="btn-label-stack">{group.megaText.map((text, i) => <span key={i}>{text}</span>)}</div>) : (<span>{group.megaText}</span>)}{group.hasDropdown && <ChevronDown size={10} />}</button>{group.stackButtons && (<div className="mini-tools-stack">{group.stackButtons.map((btn, i) => (<button key={i} className="btn-mini-wide" onClick={btn.onClick}><btn.icon size={14} color={btn.color} /> {btn.text}</button>))}</div>)}</div><div className="group-label">{group.label}</div></div>);

//       case 'font-controls-advanced':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-col"><div className="tool-row" style={{ gap: '4px' }}><button className="btn-font-selector" onClick={group.onFontClick} style={{ fontFamily: group.currentFont, width: '140px', textAlign: 'left', padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: '4px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>{group.currentFont}</span><ChevronDown size={12} color="#64748b" /></button><div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}><button className="btn-icon-s" onClick={group.onDecreaseSize} style={{ borderRadius: '0' }}><Type size={12} />-</button><input type="number" value={group.currentSize} onChange={(e) => handleFontSizeChange(parseInt(e.target.value) || 12)} style={{ width: '50px', textAlign: 'center', border: 'none', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', padding: '4px 0' }} /><button className="btn-icon-s" onClick={group.onIncreaseSize} style={{ borderRadius: '0' }}><Type size={14} />+</button></div><button className="btn-icon-s" onClick={group.onClear}><Eraser size={14} /></button></div><div className="tool-row"><button className={`btn-icon-s bold ${group.isBold ? 'active' : ''}`} onClick={group.onBold} title="Bold (Ctrl+B)">B</button><button className={`btn-icon-s italic ${group.isItalic ? 'active' : ''}`} onClick={group.onItalic} title="Italic (Ctrl+I)">I</button><button className={`btn-icon-s underline ${group.isUnderline ? 'active' : ''}`} onClick={group.onUnderline} title="Underline (Ctrl+U)">U</button><div className="v-sep"></div><button className={`btn-icon-s ${isStrikethrough ? 'active' : ''}`} onClick={toggleStrikethrough} title="Strikethrough (Alt+Shift+S)" style={{ textDecoration: 'line-through' }}>S</button><button className={`btn-icon-s ${isSubscript ? 'active' : ''}`} onClick={toggleSubscript} title="Subscript (Ctrl+=)">X<sub>2</sub></button><button className={`btn-icon-s ${isSuperscript ? 'active' : ''}`} onClick={toggleSuperscript} title="Superscript (Ctrl+Shift+=)">X<sup>2</sup></button><div className="v-sep"></div><div style={{ position: 'relative' }}><button ref={colorButtonRef} className="format-btn color-picker-btn" onClick={() => setShowColorPicker(!showColorPicker)} style={{ padding: '4px 8px', display: 'flex', alignItems: 'center' }}><div className="color-preview" style={{ background: textColor, width: '24px', height: '24px', borderRadius: '4px', border: '2px solid #e2e8f0' }}></div><ChevronDown size={12} style={{ marginLeft: '4px' }} /></button></div><button className="btn-icon-s" title="Highlight"><Highlighter size={14} color="#f59e0b" /></button><button className="btn-icon-s" onClick={group.onClear} title="Clear Formatting"><Eraser size={14} /></button></div></div><div className="group-label">{group.label}</div></div>);

//       case 'paragraph-controls':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-col"><div className="tool-row"><button className={`btn-icon-s ${listType === 'bullet' ? 'active' : ''}`} onClick={handleBulletList} title="Bullet List"><List size={14} /></button><button className={`btn-icon-s ${listType === 'number' ? 'active' : ''}`} onClick={handleNumberList} title="Number List"><ListOrdered size={14} /></button><div className="v-sep"></div><button className="btn-icon-s" onClick={handleOutdent} title="Decrease Indent"><Outdent size={14} /></button><button className="btn-icon-s" onClick={handleIndent} title="Increase Indent"><Indent size={14} /></button></div><div className="tool-row"><button className={`btn-icon-s ${alignment === 'left' ? 'active' : ''}`} onClick={handleAlignLeft} title="Align Left"><AlignLeft size={14} /></button><button className={`btn-icon-s ${alignment === 'center' ? 'active' : ''}`} onClick={handleAlignCenter} title="Align Center"><AlignCenter size={14} /></button><button className={`btn-icon-s ${alignment === 'right' ? 'active' : ''}`} onClick={handleAlignRight} title="Align Right"><AlignRight size={14} /></button><button className={`btn-icon-s ${alignment === 'justify' ? 'active' : ''}`} onClick={handleAlignJustify} title="Justify"><AlignJustify size={14} /></button></div><div className="tool-row" style={{ gap: '4px' }}><select className="ribbon-select" value={lineSpacing} onChange={(e) => handleLineSpacing(e.target.value)} style={{ width: '70px' }} title="Line Spacing"><option value="1.0">1.0</option><option value="1.15">1.15</option><option value="1.5">1.5</option><option value="2.0">2.0</option><option value="2.5">2.5</option><option value="3.0">3.0</option></select><div className="v-sep"></div><div className="spacing-controls" style={{ display: 'flex', gap: '2px' }}><button className="btn-icon-s" onClick={() => handleParagraphSpacing('before', Math.max(0, paragraphSpacing.before - 2))} title="Decrease Space Before" style={{ padding: '4px' }}><ArrowUp size={10} />-</button><button className="btn-icon-s" onClick={() => handleParagraphSpacing('before', paragraphSpacing.before + 2)} title="Increase Space Before" style={{ padding: '4px' }}><ArrowUp size={10} />+</button><button className="btn-icon-s" onClick={() => handleParagraphSpacing('after', Math.max(0, paragraphSpacing.after - 2))} title="Decrease Space After" style={{ padding: '4px' }}><ArrowDown size={10} />-</button><button className="btn-icon-s" onClick={() => handleParagraphSpacing('after', paragraphSpacing.after + 2)} title="Increase Space After" style={{ padding: '4px' }}><ArrowDown size={10} />+</button></div></div></div><div className="group-label">{group.label}</div></div>);

//       case 'drawing-controls':
//         return (<div className="ribbon-group drawing-group" key={group.id}><div className="group-content-col"><div className="tool-row" style={{ gap: '4px', marginBottom: '4px' }}><button className={`btn-icon-s ${shapeType === 'rectangle' ? 'active' : ''}`} onClick={() => { setShapeType('rectangle'); addShape('rectangle'); }} title="Rectangle"><Square size={16} /></button><button className={`btn-icon-s ${shapeType === 'circle' ? 'active' : ''}`} onClick={() => { setShapeType('circle'); addShape('circle'); }} title="Circle"><div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid currentColor' }} /></button><button className={`btn-icon-s ${shapeType === 'triangle' ? 'active' : ''}`} onClick={() => { setShapeType('triangle'); addShape('triangle'); }} title="Triangle"><div style={{ width: '0', height: '0', borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '14px solid currentColor' }} /></button><button className={`btn-icon-s ${shapeType === 'line' ? 'active' : ''}`} onClick={() => { setShapeType('line'); addShape('line'); }} title="Line"><div style={{ width: '16px', height: '2px', background: 'currentColor' }} /></button><button className={`btn-icon-s ${shapeType === 'arrow' ? 'active' : ''}`} onClick={() => { setShapeType('arrow'); addShape('arrow'); }} title="Arrow">→</button><div className="v-sep"></div><button className="btn-icon-s" onClick={() => document.getElementById('shape-fill-picker').click()} title="Shape Fill" style={{ background: shapeFill }}><PaintBucket size={14} color="#fff" /><input id="shape-fill-picker" type="color" value={shapeFill} onChange={(e) => handleShapeFill(e.target.value)} style={{ display: 'none' }} /></button><button className="btn-icon-s" onClick={() => document.getElementById('shape-outline-picker').click()} title="Shape Outline" style={{ border: `2px solid ${shapeOutline}` }}><Baseline size={14} /><input id="shape-outline-picker" type="color" value={shapeOutline} onChange={(e) => handleShapeOutline(e.target.value)} style={{ display: 'none' }} /></button></div><div className="tool-row" style={{ gap: '4px', marginBottom: '4px' }}><button className="btn-mini-wide" onClick={bringToFront} title="Bring to Front" disabled={!selectedShape}><Layers size={14} /> Front</button><button className="btn-mini-wide" onClick={sendToBack} title="Send to Back" disabled={!selectedShape}><Layers size={14} style={{ transform: 'rotate(180deg)' }} /> Back</button><button className="btn-mini-wide" onClick={bringForward} title="Bring Forward" disabled={!selectedShape}><ArrowUp size={14} /> Fwd</button><button className="btn-mini-wide" onClick={sendBackward} title="Send Backward" disabled={!selectedShape}><ArrowDown size={14} /> Bwd</button></div><div className="tool-row" style={{ gap: '8px', flexWrap: 'wrap' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="ribbon-text-s">Outline:</span><select className="ribbon-select" value={outlineWidth} onChange={(e) => handleOutlineWidth(parseInt(e.target.value))} style={{ width: '60px' }} disabled={!selectedShape}><option value="1">1px</option><option value="2">2px</option><option value="3">3px</option><option value="4">4px</option><option value="5">5px</option></select></div><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="ribbon-text-s">Opacity:</span><input type="range" min="0" max="100" value={shapeOpacity} onChange={(e) => handleShapeOpacity(parseInt(e.target.value))} style={{ width: '60px' }} disabled={!selectedShape} /><span className="ribbon-text-s">{shapeOpacity}%</span></div><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="ribbon-text-s">Rotate:</span><input type="number" value={rotation} onChange={(e) => handleRotation(parseInt(e.target.value))} style={{ width: '50px' }} min="0" max="360" disabled={!selectedShape} /><span>°</span></div></div><div className="tool-row" style={{ gap: '4px', marginTop: '4px' }}><button className={`btn-mini-wide ${shapeEffects.shadow ? 'active' : ''}`} onClick={() => handleEffect('shadow', !shapeEffects.shadow)} disabled={!selectedShape}><div style={{ width: '12px', height: '12px', background: '#f59e0b', boxShadow: '2px 2px 4px rgba(0,0,0,0.3)', marginRight: '4px' }} /> Shadow</button><button className={`btn-mini-wide ${shapeEffects.glow ? 'active' : ''}`} onClick={() => handleEffect('glow', !shapeEffects.glow)} disabled={!selectedShape}><Sparkles size={14} /> Glow</button><button className={`btn-mini-wide ${shapeEffects.reflection ? 'active' : ''}`} onClick={() => handleEffect('reflection', !shapeEffects.reflection)} disabled={!selectedShape}><RotateCcw size={14} /> Reflect</button><button className="btn-mini-wide" onClick={duplicateShape} disabled={!selectedShape}><Copy size={14} /> Duplicate</button><button className="btn-mini-wide" onClick={deleteShape} disabled={!selectedShape} style={{ color: '#ef4444' }}><Trash2 size={14} /> Delete</button></div></div><div className="group-label">{group.label}</div></div>);

//       case 'editing-controls':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-row"><button className="btn-find-replace" onClick={() => setShowSearchDialog(true)} title="Find and Replace (Ctrl+H)"><div className="icon-wrapper"><Search size={18} color="#475569" /><span className="replace-badge">↔</span></div><div className="btn-text"><span className="main-text">Find</span><span className="sub-text">Replace</span></div></button><button className={`btn-select-all ${!selectedField ? 'disabled' : ''}`} onClick={handleSelectAll} title={selectedField ? "Select All (Ctrl+A)" : "Select a text field first"}><MousePointer2 size={16} color={selectedField ? "#3b82f6" : "#94a3b8"} /><span className="select-text">Select All</span><span className="shortcut-hint">Ctrl+A</span></button></div><div className="group-label">{group.label}</div></div>);

//       case 'simple-mega':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-flex"><button className="btn-mega" onClick={() => { if (group.id === 'tables') setShowTableModal(true); }}><group.icon size={28} color="#475569" /><div className="btn-label-stack"><span>{group.text}</span>{group.hasDropdown && <ChevronDown size={10} />}</div></button></div><div className="group-label">{group.label}</div></div>);

//       case 'illustrations-grid':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-col"><div className="tool-row"><button className="btn-icon-s"><Square size={16} /> Shapes</button><button className="btn-icon-s"><Smile size={16} /> Icons</button></div><div className="tool-row"><button className="btn-icon-s"><Layers size={16} /> SmartArt</button><button className="btn-icon-s"><BarChart2 size={16} /> Chart</button></div></div><div className="group-label">{group.label}</div></div>);

//       case 'vertical-buttons':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-col">{group.buttons.map((btn, i) => (<button key={i} className="btn-mini-wide"><btn.icon size={16} color={btn.color} /> {btn.text}</button>))}</div><div className="group-label">{group.label}</div></div>);

//       case 'themes-gallery-dynamic':
//         return (
//           <div className="ribbon-group" key={group.id}>
//             <div className="group-content-flex">
//               <div className="themes-gallery-mini" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
//                 <div
//                   className={`theme-item ${currentTheme === 0 ? 'active' : ''}`}
//                   style={{ background: '#ffffff', border: '2px solid #e2e8f0', color: '#1e293b' }}
//                   onClick={() => applyTheme(0)}
//                 >
//                   Blank
//                 </div>
//                 <div
//                   className={`theme-item ${currentTheme === 1 ? 'active' : ''}`}
//                   style={{ background: '#1e293b' }}
//                   onClick={() => applyTheme(1)}
//                 >
//                   1
//                 </div>
//                 <div
//                   className={`theme-item ${currentTheme === 2 ? 'active' : ''}`}
//                   style={{ background: '#f59e0b' }}
//                   onClick={() => applyTheme(2)}
//                 >
//                   2
//                 </div>
//                 <div
//                   className={`theme-item ${currentTheme === 3 ? 'active' : ''}`}
//                   style={{ background: '#3b82f6' }}
//                   onClick={() => applyTheme(3)}
//                 >
//                   3
//                 </div>
//                 <div
//                   className={`theme-item ${currentTheme === 4 ? 'active' : ''}`}
//                   style={{ background: '#3b82f6' }}
//                   onClick={() => applyTheme(4)}
//                 >
//                   4
//                 </div>
//                 <div
//                   className={`theme-item ${currentTheme === 5 ? 'active' : ''}`}
//                   style={{ background: '#3b82f6' }}
//                   onClick={() => applyTheme(5)}
//                 >
//                   5
//                 </div>
//                 <div
//                   className={`theme-item ${currentTheme === 6 ? 'active' : ''}`}
//                   style={{ background: '#3b82f6' }}
//                   onClick={() => applyTheme(6)}
//                 >
//                   6
//                 </div>
//                 <div
//                   className={`theme-item ${currentTheme === 7 ? 'active' : ''}`}
//                   style={{ background: '#3b82f6' }}
//                   onClick={() => applyTheme(7)}
//                 >
//                   7
//                 </div>
//                 <div
//                   className={`theme-item ${currentTheme === 8 ? 'active' : ''}`}
//                   style={{ background: '#3b82f6' }}
//                   onClick={() => applyTheme(8)}
//                 >
//                   8
//                 </div>
//                 <div
//                   className={`theme-item ${currentTheme === 9 ? 'active' : ''}`}
//                   style={{ background: '#3b82f6' }}
//                   onClick={() => applyTheme(9)}
//                 >
//                   9
//                 </div>
//                 <div
//                   className={`theme-item ${currentTheme === 10 ? 'active' : ''}`}
//                   style={{ background: '#3b82f6' }}
//                   onClick={() => applyTheme(10)}
//                 >
//                   10
//                 </div>
//               </div>
//             </div>
//             <div className="group-label">{group.label}</div>
//           </div>
//         );

//       case 'variants-gallery':
//         return (
//           <div className="ribbon-group" key={group.id}>
//             <div className="group-content-flex">
//               <div className="variants-grid">
//                 {variants.map(variant => (
//                   <div
//                     key={variant.id}
//                     className={`variant-box ${selectedVariant === variant.id ? 'active' : ''}`}
//                     style={{ background: `linear-gradient(90deg, ${variant.colors[0]} 33%, ${variant.colors[1]} 33%, ${variant.colors[1]} 66%, ${variant.colors[2]} 66%)` }}
//                     onClick={() => applyVariant(variant.id)}
//                   >
//                     {variant.colors.map((color, i) => (
//                       <span key={i} className="color-dot" style={{ background: color }} />
//                     ))}
//                   </div>
//                 ))}
//               </div>
//               <div className="mini-tools-stack">
//                 <button className="btn-mini-wide" onClick={() => setShowColorScheme(true)}>
//                   <Palette size={14} /> Colors
//                 </button>
//                 <button className="btn-mini-wide" onClick={() => applyVariant(selectedVariant)}>
//                   <RotateCcw size={14} /> Reset
//                 </button>
//               </div>
//             </div>
//             <div className="group-label">{group.label}</div>
//           </div>
//         );

//       case 'customize-controls':
//         return (
//           <div className="ribbon-group" key={group.id}>
//             <div className="group-content-flex">
//               <button className="btn-mega" onClick={() => setShowSizeModal(true)}>
//                 <Columns size={28} color="#475569" />
//                 <div className="btn-label-stack">
//                   <span>Slide Size</span>
//                   <span style={{ fontSize: '8px' }}>{slideSize}</span>
//                 </div>
//               </button>
//               <button className="btn-mega" onClick={formatBackground}>
//                 <PaintBucket size={28} color="#059669" />
//                 <span>Format<br />Background</span>
//               </button>
//             </div>
//             <div className="group-label">{group.label}</div>
//           </div>
//         );


//       case 'preview-button':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-flex"><button className="btn-mega" onClick={handlePreviewTransition}><Play size={28} color="#475569" /><span>Preview</span></button></div><div className="group-label">{group.label}</div></div>);

//       case 'animation-preview-button':
//         return (
//           <div className="ribbon-group" key={group.id}>
//             <div className="group-content-flex">
//               <button className={`btn-mega ${group.isAnimating ? 'active-tool' : ''}`} onClick={group.onPreview} disabled={!selectedField}>
//                 <Play size={28} color={selectedField ? "#475569" : "#94a3b8"} />
//                 <span>Preview</span>
//                 {group.isAnimating && <div className="preview-spinner" />}
//               </button>
//             </div>
//             <div className="group-label">{group.label}</div>
//           </div>
//         );

//       case 'transition-gallery':
//         return (
//           <div className="ribbon-group" key={group.id}>
//             <div className="group-content-col">
//               <div className="transition-categories">
//                 <button
//                   className={`category-chip ${transitionCategory === 'all' ? 'active' : ''}`}
//                   onClick={() => setTransitionCategory('all')}
//                 >
//                   All
//                 </button>
//                 <button
//                   className={`category-chip ${transitionCategory === 'basic' ? 'active' : ''}`}
//                   onClick={() => setTransitionCategory('basic')}
//                 >
//                   Basic
//                 </button>
//                 <button
//                   className={`category-chip ${transitionCategory === 'dynamic' ? 'active' : ''}`}
//                   onClick={() => setTransitionCategory('dynamic')}
//                 >
//                   Dynamic
//                 </button>
//                 <button
//                   className={`category-chip ${transitionCategory === 'exciting' ? 'active' : ''}`}
//                   onClick={() => setTransitionCategory('exciting')}
//                 >
//                   Exciting
//                 </button>
//                 <button
//                   className={`category-chip ${transitionCategory === '3d' ? 'active' : ''}`}
//                   onClick={() => setTransitionCategory('3d')}
//                 >
//                   3D
//                 </button>
//               </div>

//               <div className="transition-grid">
//                 {transitionTypes
//                   .filter(t => transitionCategory === 'all' || t.category === transitionCategory)
//                   .map(transition => (
//                     <button
//                       key={transition.id}
//                       className={`transition-item-btn ${selectedTransition === transition.id ? 'active' : ''}`}
//                       onClick={() => handleTransitionSelect(transition.id)}
//                     >
//                       <span className="transition-name">{transition.name}</span>
//                       {selectedTransition === transition.id && <CheckCircle size={10} color="#10b981" />}
//                     </button>
//                   ))}
//               </div>
//             </div>
//             <div className="group-label">{group.label}</div>
//           </div>
//         );

//       case 'effect-options':
//         return (
//           <div className="ribbon-group" key={group.id}>
//             <div className="group-content-col">
//               <div className="tool-row">
//                 <Timer size={14} color="#64748b" />
//                 <span className="ribbon-text-s">Duration:</span>
//                 <input
//                   type="number"
//                   className="ribbon-select"
//                   style={{ width: '60px' }}
//                   value={transitionDuration}
//                   min="0.1"
//                   max="10"
//                   step="0.1"
//                   onChange={(e) => handleDurationChange(parseFloat(e.target.value))}
//                 />
//                 <span className="ribbon-text-s">sec</span>
//               </div>

//               <div className="tool-row">
//                 <Music size={14} color="#64748b" />
//                 <span className="ribbon-text-s">Sound:</span>
//                 <select
//                   className="ribbon-select"
//                   style={{ width: '100px' }}
//                   value={transitionSound}
//                   onChange={(e) => handleSoundChange(e.target.value)}
//                 >
//                   {availableSounds.map(sound => (
//                     <option key={sound} value={sound}>{sound}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             <div className="group-label">{group.label}</div>
//           </div>
//         );

//       case 'timing-controls':
//         return (
//           <div className="ribbon-group" key={group.id}>
//             <div className="group-content-col">
//               <div className="tool-row">
//                 <MousePointer2 size={14} color="#64748b" />
//                 <label className="advance-option">
//                   <input
//                     type="radio"
//                     checked={advanceOnClick}
//                     onChange={() => handleAdvanceModeChange('click')}
//                   /> On Mouse Click
//                 </label>
//               </div>

//               <div className="tool-row">
//                 <Timer size={14} color="#64748b" />
//                 <label className="advance-option">
//                   <input
//                     type="radio"
//                     checked={!advanceOnClick && advanceAfter > 0}
//                     onChange={() => handleAdvanceAfterChange(1)}
//                   /> After
//                   <input
//                     type="number"
//                     className="ribbon-select"
//                     style={{ width: '50px', margin: '0 4px' }}
//                     value={advanceAfter}
//                     min="0"
//                     max="60"
//                     step="0.5"
//                     disabled={advanceOnClick}
//                     onChange={(e) => handleAdvanceAfterChange(parseFloat(e.target.value))}
//                   /> sec
//                 </label>
//               </div>

//               <button
//                 className={`btn-mini-wide ${applyToAll ? 'active' : ''}`}
//                 onClick={handleApplyToAllToggle}
//               >
//                 <Copy size={14} color={applyToAll ? "#10b981" : "#64748b"} /> Apply To All
//               </button>
//             </div>
//             <div className="group-label">{group.label}</div>
//           </div>
//         );

//       case 'animation-gallery-complete':
//         return (
//           <div className="ribbon-group" key={group.id}>
//             <div className="group-content-col">
//               <div className="animation-categories">
//                 <button
//                   className={`category-chip ${group.currentCategory === 'entrance' ? 'active' : ''}`}
//                   onClick={() => group.onCategoryChange('entrance')}
//                 >
//                   Entrance
//                 </button>
//                 <button
//                   className={`category-chip ${group.currentCategory === 'emphasis' ? 'active' : ''}`}
//                   onClick={() => group.onCategoryChange('emphasis')}
//                 >
//                   Emphasis
//                 </button>
//                 <button
//                   className={`category-chip ${group.currentCategory === 'exit' ? 'active' : ''}`}
//                   onClick={() => group.onCategoryChange('exit')}
//                 >
//                   Exit
//                 </button>
//                 <button
//                   className={`category-chip ${group.currentCategory === 'motion' ? 'active' : ''}`}
//                   onClick={() => group.onCategoryChange('motion')}
//                 >
//                   Motion
//                 </button>
//               </div>

//               <div className="animation-grid">
//                 {group.categories[group.currentCategory]?.map(anim => (
//                   <button
//                     key={anim.id}
//                     className="animation-item-btn"
//                     onClick={() => group.onSelectAnimation(anim.id)}
//                     disabled={!selectedField}
//                   >
//                     <span className="animation-name">{anim.name}</span>
//                   </button>
//                 ))}
//               </div>

//               <div className="animation-actions">
//                 <button className="btn-mini-wide" onClick={group.onCopy} disabled={!selectedField}>
//                   <Copy size={14} /> Copy Animation
//                 </button>
//                 <button className="btn-mini-wide" onClick={group.onPaste} disabled={!selectedField}>
//                   <Clipboard size={14} /> Paste Animation
//                 </button>
//               </div>
//             </div>
//             <div className="group-label">{group.label}</div>
//           </div>
//         );

//       case 'advanced-animation-complete':
//         return (
//           <div className="ribbon-group" key={group.id}>
//             <div className="group-content-col" style={{ minWidth: '140px' }}>
//               <button className="btn-mini-wide" onClick={group.onAddAnimation} disabled={!selectedField}>
//                 <PlusSquare size={14} color="#f59e0b" /> Add Animation
//               </button>
//               <button className="btn-mini-wide" onClick={group.onShowPane}>
//                 <Layers size={14} color={group.hasAnimations ? "#2563eb" : "#64748b"} />
//                 Animation Pane
//                 {group.hasAnimations && <span className="pane-badge">{animationPane.length}</span>}
//               </button>
//               <button className="btn-mini-wide" onClick={group.onCopy} disabled={!selectedField}>
//                 <Copy size={14} color="#db2777" /> Copy
//               </button>
//               <button className="btn-mini-wide" onClick={group.onPaste} disabled={!selectedField}>
//                 <Clipboard size={14} color="#10b981" /> Paste
//               </button>
//             </div>
//             <div className="group-label">{group.label}</div>
//           </div>
//         );

//       case 'animation-timing-complete':
//         return (
//           <div className="ribbon-group" key={group.id}>
//             <div className="group-content-col">
//               <div className="tool-row">
//                 <Timer size={14} color="#64748b" />
//                 <span className="ribbon-text-s" style={{ width: '55px' }}>Duration:</span>
//                 <input
//                   type="number"
//                   className="ribbon-select"
//                   style={{ width: '60px' }}
//                   value={group.duration}
//                   min="0.1"
//                   max="10"
//                   step="0.1"
//                   onChange={(e) => group.onDurationChange(parseFloat(e.target.value))}
//                 />
//               </div>
//               <div className="tool-row">
//                 <Timer size={14} color="#64748b" />
//                 <span className="ribbon-text-s" style={{ width: '55px' }}>Delay:</span>
//                 <input
//                   type="number"
//                   className="ribbon-select"
//                   style={{ width: '60px' }}
//                   value={group.delay}
//                   min="0"
//                   max="10"
//                   step="0.1"
//                   onChange={(e) => group.onDelayChange(parseFloat(e.target.value))}
//                 />
//               </div>
//               <div className="tool-row">
//                 <RotateCcw size={14} color="#64748b" />
//                 <span className="ribbon-text-s" style={{ width: '55px' }}>Repeat:</span>
//                 <select
//                   className="ribbon-select"
//                   style={{ width: '70px' }}
//                   value={group.repeat}
//                   onChange={(e) => group.onRepeatChange(e.target.value === 'infinite' ? 'infinite' : parseInt(e.target.value))}
//                 >
//                   <option value="1">1</option>
//                   <option value="2">2</option>
//                   <option value="3">3</option>
//                   <option value="4">4</option>
//                   <option value="5">5</option>
//                   <option value="infinite">∞</option>
//                 </select>
//               </div>
//               <div className="tool-row">
//                 <Move size={14} color="#64748b" />
//                 <span className="ribbon-text-s" style={{ width: '55px' }}>Easing:</span>
//                 <select
//                   className="ribbon-select"
//                   style={{ width: '85px' }}
//                   value={group.easing}
//                   onChange={(e) => group.onEasingChange(e.target.value)}
//                 >
//                   <option value="ease">Ease</option>
//                   <option value="linear">Linear</option>
//                   <option value="ease-in">Ease In</option>
//                   <option value="ease-out">Ease Out</option>
//                   <option value="ease-in-out">Ease InOut</option>
//                   <option value="bounce">Bounce</option>
//                 </select>
//               </div>
//               <div className="tool-row" style={{ marginTop: '4px', gap: '5px' }}>
//                 <div className="reorder-btns">
//                   <button className="btn-icon-s" onClick={group.onReorderUp} title="Move Up">
//                     <ArrowUp size={12} />
//                   </button>
//                   <button className="btn-icon-s" onClick={group.onReorderDown} title="Move Down">
//                     <ArrowDown size={12} />
//                   </button>
//                 </div>
//                 <span className="ribbon-text-s">Reorder</span>
//               </div>
//             </div>
//             <div className="group-label">{group.label}</div>
//           </div>
//         );

//       case 'polls-basic':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-flex"><button className="btn-mega"><List size={28} color="#f59e0b" /><span>Multiple Choice</span></button><div className="mini-tools-stack"><button className="btn-mini-wide"><Cloud size={14} color="#3b82f6" /> Word Cloud</button><button className="btn-mini-wide"><MessageSquare size={14} color="#10b981" /> Open Ended</button></div></div><div className="group-label">{group.label}</div></div>);

//       case 'polls-advanced':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-col"><div className="tool-row"><button className="btn-icon-s"><TrendingUp size={16} color="#8b5cf6" /> Ranking</button><button className="btn-icon-s"><Sliders size={16} color="#06b6d4" /> Scales</button></div><div className="tool-row"><button className="btn-icon-s"><ImagePlus size={16} color="#db2777" /> Images</button><button className="btn-icon-s"><Lightbulb size={16} color="#fbbf24" /> Ideas</button></div></div><div className="group-label">{group.label}</div></div>);

//       case 'polls-gaming':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-flex"><button className="btn-mega"><FileQuestion size={28} color="#ef4444" /><span>Quiz Mode</span></button><div className="mini-tools-stack"><button className="btn-mini-wide"><Target size={14} color="#f97316" /> True / False</button><button className="btn-mini-wide"><Award size={14} color="#eab308" /> Leaderboard</button></div></div><div className="group-label">{group.label}</div></div>);

//       case 'polls-privacy':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-col"><button className="btn-mini-wide active-tool"><Eye size={14} color="#10b981" /> Public Results</button><button className="btn-mini-wide"><EyeOff size={14} color="#64748b" /> Private View</button><button className="btn-mini-wide"><Users size={14} color="#6366f1" /> Count: On</button></div><div className="group-label">{group.label}</div></div>);

//       case 'polls-config':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-col"><div className="tool-row"><Timer size={14} color="#64748b" /><select className="ribbon-select" style={{ width: '65px' }}><option>30s</option><option>60s</option></select></div><div className="tool-row" style={{ marginTop: '5px' }}><button className="btn-icon-s" title="Reset"><RotateCcw size={16} /></button><button className="btn-icon-s" title="Report"><Download size={16} /></button><button className="btn-icon-s" title="Settings"><Settings size={16} /></button></div></div><div className="group-label">{group.label}</div></div>);

//       case 'session-live':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-flex"><button className="btn-mega" style={{ border: '1px solid #f59e0b' }}><Zap size={28} color="#f59e0b" /><span>Live Now</span></button><button className="btn-mega"><QrCode size={28} /><span>Show QR</span></button><button className="btn-mega"><Trash2 size={24} color="#ef4444" /><span>End Session</span></button></div><div className="group-label">{group.label}</div></div>);

//       case 'session-audience':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-col"><label className="btn-mini-wide"><input type="checkbox" defaultChecked /> Names Required</label><label className="btn-mini-wide"><input type="checkbox" defaultChecked /> Show Leaderboard</label><button className="btn-mini-wide"><MessageSquare size={14} /> Chat: Enabled</button></div><div className="group-label">{group.label}</div></div>);

//       case 'session-atmosphere':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-col"><button className="btn-mini-wide"><Music size={14} color="#6366f1" /> BG Music</button><button className="btn-mini-wide"><Palette size={14} color="#f59e0b" /> Theme for All</button></div><div className="group-label">{group.label}</div></div>);

//       case 'proofing-controls-complete':
//         return (
//           <div className="ribbon-group" key={group.id}>
//             <div className="group-content-col">
//               <div className="tool-row" style={{ gap: '2px', marginBottom: '4px' }}>
//                 <button
//                   className={`btn-proofing-mega ${group.isChecking ? 'checking' : ''}`}
//                   onClick={group.onSpelling}
//                   disabled={group.isChecking}
//                 >
//                   <div className="proofing-icon-wrapper">
//                     <CheckCircle size={24} color={group.hasErrors ? "#ef4444" : "#059669"} />
//                     {group.isChecking && <div className="spinner-small" />}
//                   </div>
//                   <div className="proofing-text">
//                     <span className="main-text">Spelling</span>
//                     <span className="sub-text">
//                       {group.isChecking ? 'Checking...' :
//                         group.hasErrors ? `${group.hasErrors} errors` : 'No errors'}
//                     </span>
//                   </div>
//                 </button>

//                 <div className="mini-tools-stack" style={{ marginLeft: '4px' }}>
//                   <button className="btn-mini-wide" onClick={group.onThesaurus}>
//                     <BookOpen size={14} color="#2563eb" /> Thesaurus
//                   </button>
//                   <button className="btn-mini-wide" onClick={group.onAccessibility}>
//                     <Accessibility size={14} color="#8b5cf6" /> Check Accessibility
//                   </button>
//                 </div>
//               </div>

//               {group.isChecking && (
//                 <div className="spelling-progress">
//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{ width: '60%' }}></div>
//                   </div>
//                   <span className="progress-text">Checking spelling...</span>
//                 </div>
//               )}
//             </div>
//             <div className="group-label">{group.label}</div>
//           </div>
//         );

//       case 'insights-complete':
//         return (
//           <div className="ribbon-group" key={group.id}>
//             <div className="group-content-flex">
//               <button className="btn-insights" onClick={group.onSmartLookup}>
//                 <div className="insights-icon">
//                   <Search size={24} color="#6366f1" />
//                   <Sparkles size={12} color="#f59e0b" className="sparkle-icon" />
//                 </div>
//                 <div className="insights-text">
//                   <span className="main-text">Smart Lookup</span>
//                   <span className="sub-text">Research & citations</span>
//                 </div>
//               </button>
//             </div>
//             <div className="group-label">{group.label}</div>
//           </div>
//         );

//       case 'language-controls-complete':
//         return (
//           <div className="ribbon-group" key={group.id}>
//             <div className="group-content-col">
//               <button className="btn-language-main" onClick={group.onTranslate}>
//                 <Languages size={18} color="#2563eb" />
//                 <div className="language-text">
//                   <span className="main-text">Translate</span>
//                   <span className="sub-text">To {getLanguageName(targetLanguage)}</span>
//                 </div>
//                 <ChevronDown size={12} className="dropdown-arrow" />
//               </button>

//               <button className="btn-mini-wide" onClick={group.onLanguagePref}>
//                 <Globe size={14} color="#64748b" /> Language Preferences
//               </button>

//               <div className="current-language-badge">
//                 <span className="badge-text">{group.currentLanguage}</span>
//               </div>
//             </div>
//             <div className="group-label">{group.label}</div>
//           </div>
//         );

//       case 'comments-controls-complete':
//         const unreadCount = group.comments.filter(c => !c.read).length;

//         return (
//           <div className="ribbon-group" key={group.id}>
//             <div className="group-content-col">
//               <div className="tool-row" style={{ gap: '4px', marginBottom: '4px' }}>
//                 <button
//                   className={`btn-new-comment ${group.showComments ? 'active' : ''}`}
//                   onClick={group.onNewComment}
//                 >
//                   <MessageSquarePlus size={18} color="#f59e0b" />
//                   <span>New Comment</span>
//                 </button>

//                 {unreadCount > 0 && (
//                   <div className="comment-badge">
//                     {unreadCount}
//                   </div>
//                 )}
//               </div>

//               <div className="tool-row" style={{ gap: '2px' }}>
//                 <button className="btn-icon-s" onClick={group.onPrevComment} title="Previous Comment">
//                   <ChevronLeft size={14} />
//                 </button>
//                 <button className="btn-icon-s" onClick={group.onNextComment} title="Next Comment">
//                   <ChevronRight size={14} />
//                 </button>
//                 <button className="btn-icon-s" onClick={group.onShowComments} title="Show Comments">
//                   <MessageSquare size={14} />
//                 </button>
//                 <button className="btn-icon-s danger" onClick={group.onDeleteAll} title="Delete All Comments">
//                   <Trash2 size={14} color="#ef4444" />
//                 </button>
//               </div>

//               {group.comments.length > 0 && (
//                 <div className="comments-summary">
//                   <span>{group.comments.length} comment{group.comments.length > 1 ? 's' : ''}</span>
//                   {unreadCount > 0 && <span className="unread-badge">{unreadCount} unread</span>}
//                 </div>
//               )}
//             </div>
//             <div className="group-label">{group.label}</div>
//           </div>
//         );

//       case 'protect-controls-complete':
//         return (
//           <div className="ribbon-group" key={group.id}>
//             <div className="group-content-col">
//               <button
//                 className={`btn-protect ${group.isProtected ? 'active' : ''}`}
//                 onClick={group.onProtect}
//               >
//                 <Lock size={16} color={group.isProtected ? "#f59e0b" : "#475569"} />
//                 <span>{group.isProtected ? 'Protected' : 'Protect Presentation'}</span>
//                 {group.isProtected && <CheckCircle size={12} color="#10b981" className="check-icon" />}
//               </button>

//               <button
//                 className={`btn-mark-final ${group.isMarkedFinal ? 'active' : ''}`}
//                 onClick={group.onMarkFinal}
//               >
//                 <CheckSquare size={16} color={group.isMarkedFinal ? "#f59e0b" : "#475569"} />
//                 <span>{group.isMarkedFinal ? 'Marked as Final' : 'Mark as Final'}</span>
//               </button>

//               <button className="btn-mini-wide" onClick={group.onRestrict}>
//                 <Users size={14} color="#64748b" /> Restrict Access
//               </button>

//               {group.isMarkedFinal && (
//                 <div className="final-badge">
//                   <CheckCircle size={10} color="#10b981" />
//                   <span>Final version</span>
//                 </div>
//               )}
//             </div>
//             <div className="group-label">{group.label}</div>
//           </div>
//         );

//       case 'slideshow-start':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-flex"><button className="btn-mega" onClick={() => startPresentation(true)}><Presentation size={28} color="#d83b01" /><span>Beginning</span></button><button className="btn-mega" onClick={() => startPresentation(false)}><MonitorPlay size={28} color="#475569" /><span>Current</span></button></div><div className="group-label">{group.label}</div></div>);

//       case 'slideshow-setup':
//         return (
//           <div className="ribbon-group" key={group.id}>
//             <div className="group-content-col">
//               <button className="btn-mini-wide" onClick={() => toggleHideSlide(activeSlideId)}>
//                 <EyeOff size={14} color="#ef4444" /> {hideSlide[activeSlideId] ? 'Show Slide' : 'Hide Slide'}
//               </button>
//               <button className="btn-mini-wide" onClick={startRehearseTimings}>
//                 <Timer size={14} /> Rehearse Timings
//               </button>
//               <button className="btn-mini-wide" onClick={startRecording}>
//                 <Mic size={14} color="#ef4444" /> {isRecording ? 'Recording...' : 'Record Show'}
//               </button>
//               <button className="btn-mini-wide" onClick={toggleLoopMode}>
//                 <RotateCcw size={14} /> {loopMode ? 'Loop On' : 'Loop Off'}
//               </button>
//             </div>
//             <div className="group-label">{group.label}</div>
//           </div>
//         );

//       case 'slideshow-monitors':
//         return (
//           <div className="ribbon-group" key={group.id}>
//             <div className="group-content-col">
//               <div className="tool-row">
//                 <span className="ribbon-text-s">Monitor:</span>
//                 <select
//                   className="ribbon-select"
//                   value={selectedMonitor}
//                   onChange={(e) => setSelectedMonitor(e.target.value)}
//                 >
//                   <option value="auto">Auto</option>
//                   {availableMonitors.map((monitor, index) => (
//                     <option key={index} value={index}>Monitor {index + 1}</option>
//                   ))}
//                 </select>
//               </div>
//               <label className="btn-mini-wide cursor-p">
//                 <input
//                   type="checkbox"
//                   checked={presenterMode}
//                   onChange={togglePresenterMode}
//                 /> Presenter View
//               </label>
//               <label className="btn-mini-wide cursor-p">
//                 <input
//                   type="checkbox"
//                   checked={showTimer}
//                   onChange={(e) => setShowTimer(e.target.checked)}
//                 /> Show Timer
//               </label>
//             </div>
//             <div className="group-label">{group.label}</div>
//           </div>
//         );

//       // ===== VIEW GROUPS =====
//       case 'presentation-views':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-flex"><button className={`btn-mega ${viewMode === 'normal' ? 'active-tool' : ''}`} onClick={() => handleViewModeChange('normal')}><Monitor size={28} color={viewMode === 'normal' ? "#f59e0b" : "#475569"} /><span>Normal</span></button><div className="mini-tools-stack"><button className={`btn-mini-wide ${viewMode === 'outline' ? 'active' : ''}`} onClick={() => handleViewModeChange('outline')}><List size={14} color={viewMode === 'outline' ? "#f59e0b" : "#64748b"} /> Outline View</button><button className={`btn-mini-wide ${viewMode === 'sorter' ? 'active' : ''}`} onClick={() => handleViewModeChange('sorter')}><Layers size={14} color={viewMode === 'sorter' ? "#f59e0b" : "#64748b"} /> Slide Sorter</button><button className={`btn-mini-wide ${viewMode === 'reading' ? 'active' : ''}`} onClick={() => handleViewModeChange('reading')}><BookOpen size={14} color={viewMode === 'reading' ? "#f59e0b" : "#64748b"} /> Reading View</button></div></div><div className="group-label">{group.label}</div></div>);

//       case 'master-views':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-col"><button className={`btn-mini-wide ${masterView === 'slide' ? 'active' : ''}`} onClick={() => handleMasterView('slide')}><LayoutTemplate size={16} color={masterView === 'slide' ? "#f59e0b" : "#2563eb"} /> Slide Master</button><button className={`btn-mini-wide ${masterView === 'handout' ? 'active' : ''}`} onClick={() => handleMasterView('handout')}><Printer size={16} color={masterView === 'handout' ? "#f59e0b" : "#64748b"} /> Handout Master</button><button className={`btn-mini-wide ${masterView === 'notes' ? 'active' : ''}`} onClick={() => handleMasterView('notes')}><StickyNote size={16} color={masterView === 'notes' ? "#f59e0b" : "#f59e0b"} /> Notes Master</button></div><div className="group-label">{group.label}</div></div>);

//       case 'show-controls':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-col"><label className="btn-mini-wide cursor-p"><input type="checkbox" checked={showRuler} onChange={(e) => setShowRuler(e.target.checked)} /> Ruler</label><label className="btn-mini-wide cursor-p"><input type="checkbox" checked={showGridlines} onChange={(e) => setShowGridlines(e.target.checked)} /> Gridlines</label><label className="btn-mini-wide cursor-p"><input type="checkbox" checked={showGuides} onChange={(e) => setShowGuides(e.target.checked)} /> Guides</label><button className={`btn-mini-wide ${showNotes ? 'active' : ''}`} onClick={() => setShowNotes(!showNotes)}><PanelRight size={14} /> Notes</button></div><div className="group-label">{group.label}</div></div>);

//       case 'zoom-controls':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-flex"><button className="btn-mega" onClick={handleZoomIn}><ZoomIn size={28} color="#64748b" /><span>Zoom In</span></button><button className="btn-mega" onClick={handleZoomOut}><ZoomIn size={28} color="#64748b" style={{ transform: 'scaleX(-1)' }} /><span>Zoom Out</span></button><button className="btn-mega" onClick={handleFitToWindow}><Maximize2 size={28} color="#64748b" /><span>Fit to Window</span></button></div><div className="group-label">{group.label} {zoomLevel}%</div></div>);

//       case 'window-controls':
//         return (<div className="ribbon-group" key={group.id}><div className="group-content-col"><button className="btn-mini-wide" onClick={handleNewWindow}><AppWindow size={16} color="#2563eb" /> New Window</button><button className="btn-mini-wide" onClick={handleArrangeAll}><Layout size={16} /> Arrange All</button><button className="btn-mini-wide" onClick={handleSwitchWindow}><ArrowLeftRight size={16} /> Switch Windows</button></div><div className="group-label">{group.label}</div></div>);

//       default: return null;
//     }
//   };

//   // ========== RENDER OUTLINE PANEL ==========
//   const renderOutlinePanel = () => {
//     if (!showOutline) return null;
//     return (<div className="outline-panel"><div className="outline-header"><List size={16} color="#f59e0b" /><span>Outline</span></div><div className="outline-content">{slides.map((slide, index) => (<div key={slide.id} className={`outline-item ${activeSlideId === slide.id ? 'active' : ''}`} onClick={() => setActiveSlideId(slide.id)}><div className="outline-number">{index + 1}</div><div className="outline-text">{slide.title || 'Untitled Slide'}{slide.subtitle && <small>{slide.subtitle}</small>}</div></div>))}</div></div>);
//   };

//   // ========== RENDER NOTES PANEL ==========
//   const renderNotesPanel = () => {
//     if (!showNotes) return null;
//     return (<div className="notes-panel"><div className="notes-header"><StickyNote size={16} color="#f59e0b" /><span>Speaker Notes</span><button className="close-notes" onClick={() => setShowNotes(false)}>×</button></div><div className="notes-content"><textarea placeholder="Click to add speaker notes for this slide..." defaultValue="" rows={4} /></div></div>);
//   };

//   // ========== RENDER MASTER VIEW PANEL ==========
//   const renderMasterViewPanel = () => {
//     if (!showMasterView) return null;
//     return (<div className="master-view-overlay"><div className="master-view-panel"><div className="master-view-header"><h3>{masterView === 'slide' ? 'Slide Master' : masterView === 'handout' ? 'Handout Master' : 'Notes Master'}</h3><button className="close-master" onClick={closeMasterView}>×</button></div><div className="master-view-content"><div className="master-preview-area"><div className="master-slide-mini"></div></div><div className="master-properties"><h4>Master Properties</h4><p>Edit master styles here</p></div></div></div></div>);
//   };

//   // ========== RENDER ==========
//   return (
//     <div className="editor-page">
//       {/* TOP NAVBAR */}
//       <nav className="top-nav-bar">
//         <div className="nav-left">
//           <button className="btn-back"><ChevronLeft size={22} /></button>
//           <div className="title-status-wrapper">
//             <input className="inline-title-input" value={title} onChange={(e) => setTitle(e.target.value)} />
//             <div className="save-status"><CheckCircle2 size={12} /><span>Changes saved</span></div>
//           </div>
//         </div>
//         <div className="nav-right">
//           <button className="action-btn"><Save size={18} /></button>
//           <button className="action-btn" onClick={handleCopy}><Copy size={18} /></button>
//           <div className="v-divider"></div>
//           <button className="action-btn"><Eye size={18} /></button>
//           <button className="action-btn"><Share2 size={18} /></button>
//           <button className="action-btn"><Download size={18} /></button>
//           <div className="v-divider"></div>
//           <button className="more-btn"><Search size={18} /></button>
//           <button className="more-btn"><MoreVertical size={20} /></button>
//           <button className="action-btn btn-present" onClick={() => startPresentation(true)}><Play size={18} fill="currentColor" /><span>Present</span></button>
//         </div>
//       </nav>

//       {/* RIBBON AREA */}
//       <div className={`ribbon-wrapper ${isCollapsed ? 'collapsed' : ''}`}>
//         <div className="ribbon-tabs">
//           <div className="tabs-list">
//             {['Home', 'Insert', 'Design', 'Transitions', 'Animations', 'Slide Show', 'Questions', 'Session', 'Review', 'View'].map(tab => (
//               <button key={tab} className={`tab-link ${activeTab === tab ? 'active' : ''}`} onClick={() => { setActiveTab(tab); setIsCollapsed(false); }}>{tab}</button>
//             ))}
//           </div>
//           <button className="collapse-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>{isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}</button>
//         </div>

//         {!isCollapsed && (
//           <div className="ribbon-content">
//             {activeTab === 'Home' && (<div className="tab-pane active fade-in">{ribbonGroups.Home.map((group, index) => (<React.Fragment key={group.id}>{renderRibbonGroup(group)}{index < ribbonGroups.Home.length - 1 && <div className="v-divider-slim"></div>}</React.Fragment>))}</div>)}
//             {activeTab === 'Insert' && (<div className="tab-pane active fade-in">{ribbonGroups.Insert.map((group, index) => (<React.Fragment key={group.id}>{renderRibbonGroup(group)}{index < ribbonGroups.Insert.length - 1 && <div className="v-divider-slim"></div>}</React.Fragment>))}</div>)}
//             {activeTab === 'Design' && (<div className="tab-pane active fade-in">{ribbonGroups.Design.map((group, index) => (<React.Fragment key={group.id}>{renderRibbonGroup(group)}{index < ribbonGroups.Design.length - 1 && <div className="v-divider-slim"></div>}</React.Fragment>))}</div>)}
//             {activeTab === 'Transitions' && (<div className="tab-pane active fade-in">{ribbonGroups.Transitions.map((group, index) => (<React.Fragment key={group.id}>{renderRibbonGroup(group)}{index < ribbonGroups.Transitions.length - 1 && <div className="v-divider-slim"></div>}</React.Fragment>))}</div>)}
//             {activeTab === 'Animations' && (<div className="tab-pane active fade-in">{ribbonGroups.Animations.map((group, index) => (<React.Fragment key={group.id}>{renderRibbonGroup(group)}{index < ribbonGroups.Animations.length - 1 && <div className="v-divider-slim"></div>}</React.Fragment>))}</div>)}
//             {activeTab === 'Questions' && (<div className="tab-pane active fade-in">{ribbonGroups.Questions.map((group, index) => (<React.Fragment key={group.id}>{renderRibbonGroup(group)}{index < ribbonGroups.Questions.length - 1 && <div className="v-divider-slim"></div>}</React.Fragment>))}</div>)}
//             {activeTab === 'Session' && (<div className="tab-pane active fade-in">{ribbonGroups.Session.map((group, index) => (<React.Fragment key={group.id}>{renderRibbonGroup(group)}{index < ribbonGroups.Session.length - 1 && <div className="v-divider-slim"></div>}</React.Fragment>))}</div>)}
//             {activeTab === 'Review' && (<div className="tab-pane active fade-in">{ribbonGroups.Review.map((group, index) => (<React.Fragment key={group.id}>{renderRibbonGroup(group)}{index < ribbonGroups.Review.length - 1 && <div className="v-divider-slim"></div>}</React.Fragment>))}</div>)}
//             {activeTab === 'Slide Show' && (<div className="tab-pane active fade-in">{ribbonGroups['Slide Show'].map((group, index) => (<React.Fragment key={group.id}>{renderRibbonGroup(group)}{index < ribbonGroups['Slide Show'].length - 1 && <div className="v-divider-slim"></div>}</React.Fragment>))}</div>)}
//             {activeTab === 'View' && (<div className="tab-pane active fade-in">{ribbonGroups.View.map((group, index) => (<React.Fragment key={group.id}>{renderRibbonGroup(group)}{index < ribbonGroups.View.length - 1 && <div className="v-divider-slim"></div>}</React.Fragment>))}</div>)}
//           </div>
//         )}
//       </div>

//       {/* MAIN CONTENT */}
//       <main className="editor-main-body">
//         {/* LEFT SIDEBAR */}
//         {viewMode !== 'reading' && !showOutline && (
//           <aside className="slides-list-sidebar">
//             <div className="sidebar-label">SLIDES</div>
//             <div className="slides-container">
//               {slides.map((slide, index) => (
//                 <div key={slide.id} className={`slide-item ${activeSlideId === slide.id ? 'active' : ''} ${hideSlide[slide.id] ? 'hidden-slide' : ''}`} onClick={() => setActiveSlideId(slide.id)}>
//                   <span className="slide-num">{index + 1}</span>
//                   <div className="slide-preview-box">
//                     <div className="mini-content-preview">
//                       <div className="mini-line"></div>
//                       <div className="mini-line short"></div>
//                     </div>
//                   </div>
//                   <button className="btn-delete-slide" onClick={(e) => deleteSlide(e, slide.id)}><Trash2 size={12} /></button>
//                 </div>
//               ))}
//               <button className="btn-add-slide-ghost" onClick={() => addNewSlide()}><Plus size={16} /> Add Slide</button>
//             </div>
//           </aside>
//         )}

//         {/* OUTLINE PANEL */}
//         {renderOutlinePanel()}

//         {/* MASTER VIEW PANEL */}
//         {renderMasterViewPanel()}

//         {/* CENTER - CANVAS */}
//         <section className="canvas-workspace" onClick={(e) => { if (e.target.className === 'canvas-workspace' || e.target.className.includes('slide-canvas-container')) setSelectedField(null); }} style={{ transform: viewMode === 'sorter' ? 'scale(0.8)' : 'none', transition: 'transform 0.3s ease' }}>
//           <div className="slide-canvas-container shadow-premium" style={{ position: 'relative', overflow: 'hidden', transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center', transition: 'transform 0.2s ease' }}>
//             {showRuler && viewMode === 'normal' && <div className="ruler-horizontal"></div>}
//             {showGridlines && <div className="gridlines-overlay"></div>}
//             {showGuides && (<div className="guides-overlay"><div className="guide guide-vertical"></div><div className="guide guide-horizontal"></div></div>)}
//             <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}><ThemeManager themeId={currentTheme} slideType="intro" data={{ title: '', subtitle: '' }} /></div>
//             <div className="powerpoint-layout" style={{ position: 'relative', zIndex: 10, background: 'transparent' }}>
//               {(() => {
//                 const currentSlide = slides.find(s => s.id === activeSlideId);
//                 if (!currentSlide) return null;
//                 switch (currentSlide.layout) {
//                   case LAYOUT_TYPES.TITLE_SLIDE: return (<div className="title-slide-layout">{renderBox('title', 'Click to add title', 'title-slide-main')}{renderBox('subtitle', 'Click to add subtitle', 'title-slide-sub')}</div>);
//                   case LAYOUT_TYPES.SECTION_HEADER: return (<div className="section-header-layout">{renderBox('title', 'Section title', 'section-header-title')}</div>);
//                   case LAYOUT_TYPES.TITLE_AND_CONTENT: return (<div className="title-content-layout">{renderBox('title', 'Click to add title', 'content-title')}{renderBox('content', 'Click to add text', 'content-body')}</div>);
//                   case LAYOUT_TYPES.TWO_CONTENT: return (<div className="two-column-layout">{renderBox('title', 'Click to add title', 'two-column-title')}<div className="two-column-container">{renderBox('leftContent', 'Click to add content to left column', 'column-left')}{renderBox('rightContent', 'Click to add content to right column', 'column-right')}</div></div>);
//                   case LAYOUT_TYPES.COMPARISON: return (<div className="comparison-layout">{renderBox('title', 'Click to add title', 'comparison-title')}<div className="comparison-container"><div className="comparison-column"><div className="comparison-header">Left</div>{renderBox('leftContent', 'Click to add', 'comparison-content')}</div><div className="comparison-column"><div className="comparison-header">Right</div>{renderBox('rightContent', 'Click to add', 'comparison-content')}</div></div></div>);
//                   default: return (<div className="blank-slide-layout"></div>);
//                 }
//               })()}
//             </div>
//             <div className="shape-layer">{shapes.map(shape => (<svg key={shape.id} className={selectedShape === shape.id ? 'selected' : ''} style={{ position: 'absolute', left: shape.x, top: shape.y, width: shape.width, height: shape.height, transform: `rotate(${shape.rotation}deg)`, opacity: shape.opacity / 100, cursor: 'pointer', ...(shape.effects.shadow && { filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))' }), ...(shape.effects.glow && { filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.6))' }) }} onClick={(e) => { e.stopPropagation(); setSelectedShape(shape.id); }}>{shape.type === 'rectangle' && <rect width="100%" height="100%" fill={shape.fill} stroke={shape.outline} strokeWidth={shape.outlineWidth} rx="8" />}{shape.type === 'circle' && <circle cx="50%" cy="50%" r="45%" fill={shape.fill} stroke={shape.outline} strokeWidth={shape.outlineWidth} />}{shape.type === 'triangle' && <polygon points="50%,5% 95%,95% 5%,95%" fill={shape.fill} stroke={shape.outline} strokeWidth={shape.outlineWidth} />}{shape.type === 'line' && <line x1="0" y1="50%" x2="100%" y2="50%" stroke={shape.outline} strokeWidth={shape.outlineWidth} />}{shape.type === 'arrow' && <><line x1="0" y1="50%" x2="80%" y2="50%" stroke={shape.outline} strokeWidth={shape.outlineWidth} /><polygon points="80%,45% 95%,50% 80%,55%" fill={shape.outline} /></>}</svg>))}</div>
//             <div className="tables-layer">{slides.find(s => s.id === activeSlideId)?.tables?.map(table => (<TableComponent key={table.id} table={table} onUpdate={updateTable} onSelect={handleTableSelect} isSelected={selectedTable === table.id} onCellSelect={handleCellSelect} onDelete={deleteTable} activeCell={activeCell} />))}</div>
//             {/* طبقة الصور في منطقة التحرير */}
//             <div className="images-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 15 }}>
//               {slides.find(s => s.id === activeSlideId)?.images?.map(img => (
//                 <div
//                   key={img.id}
//                   style={{
//                     position: 'absolute',
//                     left: img.x,
//                     top: img.y,
//                     width: img.width,
//                     transform: `rotate(${img.rotation}deg)`,
//                     opacity: img.opacity / 100,
//                     pointerEvents: 'auto',
//                     cursor: 'move',
//                     border: selectedField === `img-${img.id}` ? '2px solid #f59e0b' : 'none',
//                     boxShadow: selectedField === `img-${img.id}` ? '0 0 10px rgba(0,0,0,0.2)' : 'none'
//                   }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setSelectedField(`img-${img.id}`);
//                   }}
//                   onMouseDown={(e) => {
//                     if (e.button !== 0) return; // السحب بالزر الأيسر فقط
//                     const startX = e.clientX - img.x;
//                     const startY = e.clientY - img.y;

//                     const handleMouseMove = (moveEvent) => {
//                       updateImageStyle(img.id, {
//                         x: moveEvent.clientX - startX,
//                         y: moveEvent.clientY - startY
//                       });
//                     };

//                     const handleMouseUp = () => {
//                       document.removeEventListener('mousemove', handleMouseMove);
//                       document.removeEventListener('mouseup', handleMouseUp);
//                     };

//                     document.addEventListener('mousemove', handleMouseMove);
//                     document.addEventListener('mouseup', handleMouseUp);
//                   }}
//                 >
//                   <img src={img.src} style={{ width: '100%', display: 'block', pointerEvents: 'none' }} />

//                   {/* زر الحذف */}
//                   {selectedField === `img-${img.id}` && (
//                     <button
//                       onClick={(e) => { e.stopPropagation(); deleteImage(img.id); }}
//                       style={{
//                         position: 'absolute', top: -12, right: -12, background: '#ef4444',
//                         color: 'white', border: '2px solid white', borderRadius: '50%',
//                         width: 24, height: 24, cursor: 'pointer', display: 'flex',
//                         alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
//                         zIndex: 20
//                       }}
//                     >
//                       ×
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//             </div>

//           {/* NOTES PANEL */}
//           {renderNotesPanel()}

//           {/* CANVAS FOOTER */}
//           <footer className="canvas-footer">
//             <span>Slide {slides.findIndex(s => s.id === activeSlideId) + 1} of {slides.length}</span>
//             <div className="footer-controls">
//               <button><Languages size={12} /> English</button>
//               <button><Monitor size={12} /> Notes</button>
//               <div className="zoom-display">
//                 <button onClick={handleZoomOut}>−</button>
//                 <span>{zoomLevel}%</span>
//                 <button onClick={handleZoomIn}>+</button>
//               </div>
//             </div>
//           </footer>
//         </section>

//         {/* RIGHT SIDEBAR */}
//         {viewMode !== 'reading' && (
//           <aside className="properties-panel-sidebar">
//             <div className="sidebar-label">PROPERTIES</div>
//             <div className="empty-properties"><Sparkles size={32} color="#e2e8f0" /><p>Select an element to edit</p></div>
//           </aside>
//         )}
//       </main>

//       {/* TOAST NOTIFICATION */}
//       {statusMessage && (<div className="toast-notification"><CheckCircle size={18} color="#10b981" /><span>{statusMessage}</span></div>)}

//       {/* MODALS */}
//       {showLayoutPicker && (<div className="layout-picker-overlay" onClick={() => setShowLayoutPicker(false)}><div className="layout-picker-grid" onClick={e => e.stopPropagation()}><div className="picker-header">Office Theme<span>Choose a layout</span></div><div className="layouts-container">{Object.entries(LAYOUT_TYPES).map(([key, type]) => { let previewClass = ""; if (type === LAYOUT_TYPES.TITLE_SLIDE) previewClass = "title-slide-preview"; else if (type === LAYOUT_TYPES.TITLE_AND_CONTENT) previewClass = "title-content-preview"; else if (type === LAYOUT_TYPES.TWO_CONTENT) previewClass = "two-content-preview"; else if (type === LAYOUT_TYPES.COMPARISON) previewClass = "comparison-preview"; else if (type === LAYOUT_TYPES.SECTION_HEADER) previewClass = "section-header-preview"; else if (type === LAYOUT_TYPES.BLANK) previewClass = "blank-preview"; return (<div key={key} className="layout-option" onClick={() => handleLayoutSelection(type)}><div className={`layout-icon-preview ${previewClass}`}>{type === LAYOUT_TYPES.TITLE_SLIDE && (<><div className="preview-title"></div><div className="preview-subtitle"></div></>)}{type === LAYOUT_TYPES.TITLE_AND_CONTENT && (<><div className="preview-title"></div><div className="preview-content"></div></>)}{type === LAYOUT_TYPES.TWO_CONTENT && (<><div className="preview-title"></div><div className="preview-columns"><div className="preview-column"></div><div className="preview-column"></div></div></>)}{type === LAYOUT_TYPES.COMPARISON && (<><div className="preview-title"></div><div className="preview-columns"><div className="preview-column"><div className="preview-column-header"></div><div className="preview-column-content"></div></div><div className="preview-column"><div className="preview-column-header"></div><div className="preview-column-content"></div></div></div></>)}{type === LAYOUT_TYPES.SECTION_HEADER && (<div className="preview-title"></div>)}{type === LAYOUT_TYPES.BLANK && (<div className="preview-blank"></div>)}</div><span>{type}</span></div>); })}</div></div></div>)}
//       {showFontPicker && (<div className="font-picker-overlay" onClick={() => setShowFontPicker(false)}><div className="font-picker-modal" onClick={e => e.stopPropagation()}><div className="font-picker-header"><h3>Fonts</h3><button className="close-btn" onClick={() => setShowFontPicker(false)}>✕</button></div><div className="font-picker-search"><Search size={14} color="#94a3b8" /><input type="text" placeholder="Search fonts..." value={searchFont} onChange={(e) => setSearchFont(e.target.value)} /></div><div className="font-categories"><button className={`category-btn ${fontCategory === 'all' ? 'active' : ''}`} onClick={() => setFontCategory('all')}>All Fonts</button><button className={`category-btn ${fontCategory === 'popular' ? 'active' : ''}`} onClick={() => setFontCategory('popular')}>Popular</button><button className={`category-btn ${fontCategory === 'sans' ? 'active' : ''}`} onClick={() => setFontCategory('sans')}>Sans Serif</button><button className={`category-btn ${fontCategory === 'serif' ? 'active' : ''}`} onClick={() => setFontCategory('serif')}>Serif</button><button className={`category-btn ${fontCategory === 'display' ? 'active' : ''}`} onClick={() => setFontCategory('display')}>Display</button><button className={`category-btn ${fontCategory === 'mono' ? 'active' : ''}`} onClick={() => setFontCategory('mono')}>Monospace</button><button className={`category-btn ${fontCategory === 'cursive' ? 'active' : ''}`} onClick={() => setFontCategory('cursive')}>Handwriting</button></div><div className="fonts-list">{availableFonts.filter(font => { if (searchFont) return font.name.toLowerCase().includes(searchFont.toLowerCase()); if (fontCategory === 'popular') return font.popular; if (fontCategory === 'sans') return font.category === 'Sans Serif'; if (fontCategory === 'serif') return font.category === 'Serif'; if (fontCategory === 'display') return font.category === 'Display'; if (fontCategory === 'mono') return font.category === 'Monospace'; if (fontCategory === 'cursive') return font.category === 'Cursive'; return true; }).map(font => (<div key={font.name} className={`font-item ${selectedFont === font.name ? 'selected' : ''}`} onClick={() => handleFontChange(font.name)}><span style={{ fontFamily: font.name }}>{font.name}</span>{font.popular && <span className="popular-badge">Popular</span>}</div>))}</div></div></div>)}
//       {showSearchDialog && (<SearchReplaceDialog onClose={() => setShowSearchDialog(false)} />)}
//       <ColorPickerPortal isOpen={showColorPicker}>{showColorPicker && (<ColorPickerDropdown onColorSelect={handleTextColorChange} onClose={() => setShowColorPicker(false)} recentColors={recentColors} themeColors={themeColors} buttonRef={colorButtonRef} />)}</ColorPickerPortal>
//       {showMoreColors && (<MoreColorsModal onClose={() => setShowMoreColors(false)} onSelect={(color) => handleTextColorChange(color)} currentColor={textColor} />)}
//       {showTableModal && (<TableModal onClose={() => setShowTableModal(false)} onInsert={addTable} />)}

//       {/* REVIEW PANELS */}
//       {showComments && (
//         <CommentsPanel
//           comments={comments}
//           onResolve={resolveComment}
//           onReply={addReply}
//           onClose={() => setShowComments(false)}
//         />
//       )}

//       {showAccessibilityPanel && (
//         <AccessibilityPanel
//           issues={accessibilityIssues}
//           onClose={() => setShowAccessibilityPanel(false)}
//           onFix={(issue) => {
//             showToast(`Fixing: ${issue.description}`);
//           }}
//         />
//       )}

//       {showTranslator && (
//         <TranslatorPanel
//           results={translationResults}
//           onClose={() => setShowTranslator(false)}
//           onLanguageChange={async (lang) => {
//             setTargetLanguage(lang);
//             const selection = window.getSelection().toString();
//             if (selection) {
//               try {
//                 showToast("Translating...");
//                 const { text } = await googleTranslate(selection, { to: lang });
//                 setTranslationResults([{
//                   original: selection,
//                   translated: text,
//                   language: lang,
//                   timestamp: new Date().toISOString()
//                 }]);
//                 showToast("Translation complete!");
//               } catch (error) {
//                 console.error("Translation error:", error);
//                 showToast("Translation failed");
//               }
//             }
//           }}
//           targetLanguage={targetLanguage}
//           onInsert={(translatedText) => {
//             if (!selectedField) {
//               showToast("Please select where to insert the translation");
//               return;
//             }
//             const element = document.querySelector('.active-editing');
//             if (element) {
//               const selection = window.getSelection();
//               if (selection.rangeCount > 0) {
//                 const range = selection.getRangeAt(0);
//                 range.deleteContents();
//                 range.insertNode(document.createTextNode(translatedText));
//                 updateStateFromDOM(element);
//                 showToast("Translation inserted");
//               }
//             }
//           }}
//         />
//       )}

//       {/* PRESENTATION MODE */}
//       {isPresenting && <PresentationMode />}

//       {/* ANIMATION PANE */}
//       {showAnimationPane && (
//         <AnimationPane
//           animations={animations}
//           onRemove={removeAnimation}
//           onReorder={reorderAnimation}
//           onUpdate={updateAnimation}
//         />
//       )}

//       {/* DESIGN MODALS */}
//       {showSizeModal && (
//         <SizeModal
//           onClose={() => setShowSizeModal(false)}
//           onApply={applyCustomSize}
//           width={slideWidth}
//           height={slideHeight}
//           onWidthChange={setSlideWidth}
//           onHeightChange={setSlideHeight}
//         />
//       )}

//       {showBackgroundPanel && (
//         <BackgroundPanel
//           onClose={() => setShowBackgroundPanel(false)}
//           onApply={applyBackground}
//           onReset={resetBackground}
//         />
//       )}
//       <input
//         type="file"
//         id="global-image-upload"
//         style={{ display: 'none' }}
//         accept="image/*"
//         onChange={handleImageUpload}
//       />
//     </div>
//   );
// };

// export default Editor;
// src/pages/Editor.js
import React from 'react';
import Editor from '../components/Editor'; // هذا يستورد من index.js
import '../styles/Editor.css';

const EditorPage = () => {
  return (
    <div className="editor-page-container">
      <Editor />
    </div>
  );
};

export default EditorPage;