// src/components/Editor/Hooks/usePresentation.js
import { useState, useEffect, useCallback } from 'react';

export const usePresentation = (slides, setActiveSlideId, showToast) => {
  const [isPresenting, setIsPresenting] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [presenterMode, setPresenterMode] = useState(false);
  const [showPresenterTools, setShowPresenterTools] = useState(false);
  const [presenterNotes, setPresenterNotes] = useState({});
  const [presentationTimer, setPresentationTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [selectedMonitor, setSelectedMonitor] = useState('auto');
  const [availableMonitors, setAvailableMonitors] = useState([]);
  const [rehearseMode, setRehearseMode] = useState(false);
  const [slideTimings, setSlideTimings] = useState({});
  const [recordingMode, setRecordingMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hideSlide, setHideSlide] = useState({});
  const [loopMode, setLoopMode] = useState(false);
  const [showMediaControls, setShowMediaControls] = useState(false);
  const [laserPointer, setLaserPointer] = useState({ visible: false, x: 0, y: 0 });
  const [penMode, setPenMode] = useState(false);
  const [penColor, setPenColor] = useState('#f59e0b');
  const [penSize, setPenSize] = useState(2);
  const [drawingPaths, setDrawingPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);

  // ========== TIMER EFFECT ==========
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setPresentationTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // ========== GET AVAILABLE MONITORS ==========
  useEffect(() => {
    if (window.getScreenDetails) {
      window.getScreenDetails().then(details => {
        setAvailableMonitors(details.screens);
      });
    }
  }, []);

  // ========== KEYBOARD SHORTCUTS FOR PRESENTATION ==========
  useEffect(() => {
    const handlePresentationKey = (e) => {
      if (!isPresenting) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'Space':
        case 'PageDown':
        case 'Enter':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'PageUp':
        case 'Backspace':
          e.preventDefault();
          prevSlide();
          break;
        case 'Escape':
          endPresentation();
          break;
        case 'p':
        case 'P':
          togglePresenterMode();
          break;
        case 'l':
        case 'L':
          toggleLaserPointer();
          break;
        case 'c':
        case 'C':
          togglePenMode();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(slides.length - 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handlePresentationKey);
    return () => window.removeEventListener('keydown', handlePresentationKey);
  }, [isPresenting, currentSlideIndex, slides.length]);

  // ========== PRESENTATION FUNCTIONS ==========
  const startPresentation = useCallback((fromBeginning = true) => {
    if (fromBeginning) {
      setCurrentSlideIndex(0);
      setActiveSlideId(slides[0].id);
    } else {
      const index = slides.findIndex(s => s.id === activeSlideId);
      setCurrentSlideIndex(index);
    }

    setIsPresenting(true);
    setShowPresenterTools(true);
    setPresentationTimer(0);
    setIsTimerRunning(true);
    showToast("Presentation started");
  }, [slides, setActiveSlideId, showToast]);

  const endPresentation = useCallback(() => {
    setIsPresenting(false);
    setShowPresenterTools(false);
    setIsTimerRunning(false);
    setPenMode(false);
    setDrawingPaths([]);
    setCurrentPath([]);
    
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    
    showToast("Presentation ended");
  }, [showToast]);

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      const nextIndex = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIndex);
      setActiveSlideId(slides[nextIndex].id);

      if (rehearseMode) {
        setSlideTimings(prev => ({
          ...prev,
          [slides[currentSlideIndex].id]: presentationTimer
        }));
      }
    } else if (loopMode && currentSlideIndex === slides.length - 1) {
      // العودة للبداية إذا كان اللوب مفعل
      setCurrentSlideIndex(0);
      setActiveSlideId(slides[0].id);
    }
  }, [currentSlideIndex, slides, setActiveSlideId, rehearseMode, presentationTimer, loopMode]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      const prevIndex = currentSlideIndex - 1;
      setCurrentSlideIndex(prevIndex);
      setActiveSlideId(slides[prevIndex].id);
    }
  }, [currentSlideIndex, slides, setActiveSlideId]);

  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlideIndex(index);
      setActiveSlideId(slides[index].id);
    }
  }, [slides, setActiveSlideId]);

  const togglePresenterMode = useCallback(() => {
    setPresenterMode(prev => !prev);
    showToast(presenterMode ? "Presenter mode off" : "Presenter mode on");
  }, [presenterMode, showToast]);

  const updatePresenterNotes = useCallback((slideId, notes) => {
    setPresenterNotes(prev => ({ ...prev, [slideId]: notes }));
  }, []);

  const toggleHideSlide = useCallback((slideId) => {
    setHideSlide(prev => ({ ...prev, [slideId]: !prev[slideId] }));
    showToast("Slide visibility toggled");
  }, [showToast]);

  const startRehearseTimings = useCallback(() => {
    setRehearseMode(true);
    setPresentationTimer(0);
    setIsTimerRunning(true);
    setSlideTimings({});
    startPresentation(true);
    showToast("Rehearsing timings - click next to record each slide");
  }, [startPresentation, showToast]);

  const saveTimings = useCallback(() => {
    console.log("Saved timings:", slideTimings);
    showToast("Timings saved");
  }, [slideTimings, showToast]);

  const startRecording = useCallback(() => {
    setRecordingMode(true);
    setIsRecording(true);
    showToast("Recording started...");

    setTimeout(() => {
      setIsRecording(false);
      showToast("Recording completed");
    }, 5000);
  }, [showToast]);

  const toggleLoopMode = useCallback(() => {
    setLoopMode(prev => !prev);
    showToast(loopMode ? "Loop mode off" : "Loop mode on");
  }, [loopMode, showToast]);

  const toggleMediaControls = useCallback(() => {
    setShowMediaControls(prev => !prev);
  }, []);

  // ========== LASER POINTER & PEN FUNCTIONS ==========
  const handleMouseMove = useCallback((e) => {
    if (!isPresenting) return;

    if (laserPointer.visible) {
      setLaserPointer({
        visible: true,
        x: e.clientX,
        y: e.clientY
      });
    }

    if (penMode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCurrentPath(prev => [...prev, { x, y, color: penColor, size: penSize }]);
    }
  }, [isPresenting, laserPointer.visible, penMode, penColor, penSize]);

  const toggleLaserPointer = useCallback(() => {
    setLaserPointer(prev => ({ ...prev, visible: !prev.visible }));
    setPenMode(false);
    showToast(laserPointer.visible ? "Laser pointer off" : "Laser pointer on");
  }, [laserPointer.visible, showToast]);

  const togglePenMode = useCallback(() => {
    setPenMode(prev => !prev);
    setLaserPointer(prev => ({ ...prev, visible: false }));

    if (!penMode) {
      setCurrentPath([]);
    } else {
      if (currentPath.length > 0) {
        setDrawingPaths(prev => [...prev, currentPath]);
        setCurrentPath([]);
      }
    }

    showToast(penMode ? "Pen mode off" : "Pen mode on");
  }, [penMode, currentPath, showToast]);

  const clearDrawings = useCallback(() => {
    setDrawingPaths([]);
    setCurrentPath([]);
    showToast("All drawings cleared");
  }, [showToast]);

  return {
    // States
    isPresenting,
    currentSlideIndex,
    presenterMode,
    showPresenterTools,
    presenterNotes,
    presentationTimer,
    isTimerRunning,
    showTimer,
    setShowTimer,
    selectedMonitor,
    setSelectedMonitor,
    availableMonitors,
    rehearseMode,
    slideTimings,
    recordingMode,
    isRecording,
    hideSlide,
    loopMode,
    showMediaControls,
    laserPointer,
    penMode,
    penColor,
    setPenColor,
    penSize,
    setPenSize,
    drawingPaths,
    currentPath,

    // Functions
    startPresentation,
    endPresentation,
    nextSlide,
    prevSlide,
    goToSlide,
    togglePresenterMode,
    updatePresenterNotes,
    toggleHideSlide,
    startRehearseTimings,
    saveTimings,
    startRecording,
    toggleLoopMode,
    toggleMediaControls,
    handleMouseMove,
    toggleLaserPointer,
    togglePenMode,
    clearDrawings
  };
};