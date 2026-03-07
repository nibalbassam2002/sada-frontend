// src/components/Editor/Hooks/useTransitions.jsx
import { useState, useCallback, useEffect } from 'react';

export const useTransitions = (slides, activeSlideId, isPresenting, showToast) => {
  const [transitions, setTransitions] = useState({});
  const [selectedTransition, setSelectedTransition] = useState('none');
  const [transitionDuration, setTransitionDuration] = useState(1.0);
  const [transitionSound, setTransitionSound] = useState('');
  const [advanceOnClick, setAdvanceOnClick] = useState(true);
  const [advanceAfter, setAdvanceAfter] = useState(0);
  const [applyToAll, setApplyToAll] = useState(false);
  const [previewTransition, setPreviewTransition] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionCategory, setTransitionCategory] = useState('all');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // أضف هذا السطر

  // تحديث currentSlideIndex عندما يتغير activeSlideId
  useEffect(() => {
    const index = slides.findIndex(s => s.id === activeSlideId);
    if (index !== -1) {
      setCurrentSlideIndex(index);
    }
  }, [activeSlideId, slides]);

  const availableSounds = [
    '[No Sound]', 'Applause', 'Click', 'Drum Roll', 'Whoosh',
    'Chime', 'Breeze', 'Camera', 'Cash Register', 'Explosion',
    'Glass', 'Laser', 'Push', 'Swoosh', 'Typewriter', 'Wind'
  ];

  const transitionTypes = [
    { id: 'none', name: 'None', category: 'basic' },
    { id: 'fade', name: 'Fade', category: 'basic' },
    { id: 'wipe', name: 'Wipe', category: 'basic' },
    { id: 'dissolve', name: 'Dissolve', category: 'basic' },
    { id: 'push', name: 'Push', category: 'dynamic' },
    { id: 'morph', name: 'Morph', category: 'dynamic' },
    { id: 'split', name: 'Split', category: 'dynamic' },
    { id: 'uncover', name: 'Uncover', category: 'dynamic' },
    { id: 'cover', name: 'Cover', category: 'dynamic' },
    { id: 'zoom', name: 'Zoom', category: 'dynamic' },
    { id: 'switch', name: 'Switch', category: 'dynamic' },
    { id: 'flip', name: 'Flip', category: 'dynamic' },
    { id: 'gallery', name: 'Gallery', category: 'dynamic' },
    { id: 'comb', name: 'Comb', category: 'dynamic' },
    { id: 'rotate', name: 'Rotate', category: 'dynamic' },
    { id: 'window', name: 'Window', category: 'dynamic' },
    { id: 'flash', name: 'Flash', category: 'exciting' },
    { id: 'fall', name: 'Fall', category: 'exciting' },
    { id: 'glitter', name: 'Glitter', category: 'exciting' },
    { id: 'ripple', name: 'Ripple', category: 'exciting' },
    { id: 'honeycomb', name: 'Honeycomb', category: 'exciting' },
    { id: 'glow', name: 'Glow', category: 'exciting' },
    { id: 'cube', name: 'Cube', category: '3d' },
    { id: 'doors', name: 'Doors', category: '3d' },
    { id: 'box', name: 'Box', category: '3d' },
    { id: 'orb', name: 'Orb', category: '3d' },
    { id: 'checkerboard', name: 'Checkerboard', category: 'exciting' }
  ];

  // ========== TRANSITION EFFECT ==========
  useEffect(() => {
    if (isPresenting) {
      setTransitioning(true);

      const transition = transitions[slides[currentSlideIndex]?.id];
      const duration = transition?.duration || 1;

      setTimeout(() => {
        setTransitioning(false);
      }, duration * 1000);
    }
  }, [currentSlideIndex, isPresenting, slides, transitions]);

  // ========== TRANSITION FUNCTIONS ==========
  const applyTransition = useCallback((transitionType) => {
    setSelectedTransition(transitionType);

    setTransitions(prev => ({
      ...prev,
      [activeSlideId]: {
        type: transitionType,
        duration: transitionDuration,
        sound: transitionSound,
        advanceOnClick: advanceOnClick,
        advanceAfter: advanceAfter
      }
    }));

    if (applyToAll) {
      const newTransitions = {};
      slides.forEach(slide => {
        newTransitions[slide.id] = {
          type: transitionType,
          duration: transitionDuration,
          sound: transitionSound,
          advanceOnClick: advanceOnClick,
          advanceAfter: advanceAfter
        };
      });
      setTransitions(newTransitions);
      showToast(`Applied ${transitionType} transition to all slides`);
    } else {
      showToast(`Applied ${transitionType} transition to current slide`);
    }
  }, [activeSlideId, transitionDuration, transitionSound, advanceOnClick, advanceAfter, applyToAll, slides, showToast]);

  const updateTransition = useCallback((updates) => {
    setTransitions(prev => ({
      ...prev,
      [activeSlideId]: {
        ...prev[activeSlideId],
        ...updates
      }
    }));

    if (applyToAll) {
      const newTransitions = {};
      slides.forEach(slide => {
        newTransitions[slide.id] = {
          ...transitions[slide.id],
          ...updates
        };
      });
      setTransitions(newTransitions);
    }
  }, [activeSlideId, applyToAll, slides, transitions]);

  const handleTransitionSelect = useCallback((type) => {
    setSelectedTransition(type);
    applyTransition(type);
  }, [applyTransition]);

  const handleDurationChange = useCallback((value) => {
    setTransitionDuration(value);
    updateTransition({ duration: value });
  }, [updateTransition]);

  const handleSoundChange = useCallback((sound) => {
    setTransitionSound(sound);
    updateTransition({ sound: sound });
  }, [updateTransition]);

  const handleAdvanceModeChange = useCallback((mode) => {
    if (mode === 'click') {
      setAdvanceOnClick(true);
      setAdvanceAfter(0);
      updateTransition({ advanceOnClick: true, advanceAfter: 0 });
    } else {
      setAdvanceOnClick(false);
      updateTransition({ advanceOnClick: false });
    }
  }, [updateTransition]);

  const handleAdvanceAfterChange = useCallback((seconds) => {
    setAdvanceAfter(seconds);
    setAdvanceOnClick(false);
    updateTransition({ advanceAfter: seconds, advanceOnClick: false });
  }, [updateTransition]);

  const handlePreviewTransition = useCallback(() => {
    const transition = transitions[activeSlideId];
    if (!transition || transition.type === 'none') {
      showToast("Please select a transition first");
      return;
    }

    // startPresentation(true); // هذه الدالة غير متوفرة هنا
    showToast(`Starting presentation with ${transition.type} transition`);
  }, [activeSlideId, transitions, showToast]);

  const handleApplyToAllToggle = useCallback(() => {
    setApplyToAll(prev => !prev);
    showToast(!applyToAll ? "Will apply to all slides" : "Will apply to current slide only");
  }, [applyToAll, showToast]);

  const getTransitionStyle = useCallback((slideId) => {
    const transition = transitions[slideId];
    if (!transition || transition.type === 'none') return {};

    return {
      transition: `all ${transition.duration}s ease-in-out`,
      animation: previewTransition && activeSlideId === slideId ? `${transition.type} ${transition.duration}s` : undefined
    };
  }, [transitions, previewTransition, activeSlideId]);

  const playTransitionSound = useCallback((soundName) => {
    if (soundName && soundName !== '[No Sound]') {
      console.log(`Playing sound: ${soundName}`);
      showToast(`🔊 ${soundName}`);
    }
  }, [showToast]);

  return {
    // States
    transitions,
    setTransitions,
    selectedTransition,
    setSelectedTransition,
    transitionDuration,
    setTransitionDuration,
    transitionSound,
    setTransitionSound,
    advanceOnClick,
    setAdvanceOnClick,
    advanceAfter,
    setAdvanceAfter,
    applyToAll,
    setApplyToAll,
    previewTransition,
    setPreviewTransition,
    transitioning,
    setTransitioning,
    transitionCategory,
    setTransitionCategory,
    availableSounds,
    transitionTypes,

    // Functions
    applyTransition,
    updateTransition,
    handleTransitionSelect,
    handleDurationChange,
    handleSoundChange,
    handleAdvanceModeChange,
    handleAdvanceAfterChange,
    handlePreviewTransition,
    handleApplyToAllToggle,
    getTransitionStyle,
    playTransitionSound
  };
};