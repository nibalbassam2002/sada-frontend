// src/components/Editor/Hooks/useAnimations.js
import { useState, useCallback } from 'react';
import { ANIMATION_TYPES } from '../EditorConstants';

export const useAnimations = (activeSlideId, selectedField, showToast) => {
  const [animations, setAnimations] = useState({});
  const [animationPane, setAnimationPane] = useState([]);
  const [showAnimationPane, setShowAnimationPane] = useState(false);
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPreview, setAnimationPreview] = useState(false);
  
  // Animation Settings
  const [currentAnimationCategory, setCurrentAnimationCategory] = useState('entrance');
  const [animationDuration, setAnimationDuration] = useState(0.5);
  const [animationDelay, setAnimationDelay] = useState(0);
  const [animationRepeat, setAnimationRepeat] = useState(1);
  const [animationDirection, setAnimationDirection] = useState('normal');
  const [animationFillMode, setAnimationFillMode] = useState('none');
  const [animationEasing, setAnimationEasing] = useState('ease');
  const [animationTrigger, setAnimationTrigger] = useState('on-click');
  const [animationOrder, setAnimationOrder] = useState([]);

  // ========== ANIMATION STYLE HELPER ==========
  const getAnimationStyle = useCallback((animation) => {
    if (!animation) return undefined;

    const { type, duration, delay, repeat, direction, fillMode, easing } = animation;

    let animationName = '';
    switch (type) {
      case 'fade': animationName = 'fadeIn'; break;
      case 'fade-out': animationName = 'fadeOut'; break;
      case 'fly-in': animationName = 'flyIn'; break;
      case 'fly-out': animationName = 'flyOut'; break;
      case 'float-in': animationName = 'floatIn'; break;
      case 'float-out': animationName = 'floatOut'; break;
      case 'zoom-in': animationName = 'zoomIn'; break;
      case 'zoom-out': animationName = 'zoomOut'; break;
      case 'bounce': animationName = 'bounce'; break;
      case 'pulse': animationName = 'pulse'; break;
      case 'spin': animationName = 'spin'; break;
      case 'shake': animationName = 'shake'; break;
      case 'glow': animationName = 'glow'; break;
      case 'slide': animationName = 'slideIn'; break;
      case 'swivel': animationName = 'swivel'; break;
      case 'grow': animationName = 'grow'; break;
      case 'wave': animationName = 'wave'; break;
      case 'teeter': animationName = 'teeter'; break;
      case 'flash': animationName = 'flash'; break;
      case 'collapse': animationName = 'collapse'; break;
      case 'disappear': animationName = 'disappear'; break;
      case 'arc': animationName = 'arc'; break;
      case 'curve': animationName = 'curve'; break;
      case 'loop': animationName = 'loop'; break;
      default: animationName = 'fadeIn';
    }

    const repeatValue = repeat === 'infinite' ? 'infinite' : repeat;
    return `${animationName} ${duration}s ${easing} ${delay}s ${repeatValue} ${direction} ${fillMode}`;
  }, []);

  // ========== ANIMATION FUNCTIONS ==========
  const addAnimation = useCallback((elementId, animationType) => {
    if (!elementId && !selectedField) {
      showToast("Please select an element to animate");
      return;
    }

    const targetId = elementId || `element-${activeSlideId}-${selectedField}`;

    setAnimations(prev => ({
      ...prev,
      [targetId]: {
        type: animationType,
        duration: animationDuration,
        delay: animationDelay,
        repeat: animationRepeat,
        direction: animationDirection,
        fillMode: animationFillMode,
        easing: animationEasing,
        trigger: animationTrigger
      }
    }));

    setAnimationPane(prev => [...prev, {
      id: Date.now(),
      elementId: targetId,
      elementType: selectedField,
      animationType,
      duration: animationDuration,
      delay: animationDelay,
      order: prev.length
    }]);

    showToast(`Animation added to ${selectedField}`);
  }, [selectedField, activeSlideId, animationDuration, animationDelay, animationRepeat, animationDirection, animationFillMode, animationEasing, animationTrigger, showToast]);

  const removeAnimation = useCallback((elementId) => {
    setAnimations(prev => {
      const newAnimations = { ...prev };
      delete newAnimations[elementId];
      return newAnimations;
    });

    setAnimationPane(prev => prev.filter(item => item.elementId !== elementId));
    showToast("Animation removed");
  }, [showToast]);

  const updateAnimation = useCallback((elementId, updates) => {
    setAnimations(prev => ({
      ...prev,
      [elementId]: {
        ...prev[elementId],
        ...updates
      }
    }));

    setAnimationPane(prev => prev.map(item =>
      item.elementId === elementId ? { ...item, ...updates } : item
    ));
  }, []);

  const reorderAnimation = useCallback((fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= animationPane.length) return;
    
    const newOrder = [...animationPane];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);

    setAnimationPane(newOrder.map((item, index) => ({ ...item, order: index })));
  }, [animationPane]);

  const previewAnimation = useCallback(() => {
    if (!selectedField) {
      showToast("Please select an element to preview");
      return;
    }

    setAnimationPreview(true);
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
      setAnimationPreview(false);
    }, animationDuration * 1000 + 100);

    showToast("Previewing animation");
  }, [selectedField, animationDuration, showToast]);

  const copyAnimation = useCallback(() => {
    if (!selectedField) {
      showToast("Please select an element to copy animation from");
      return;
    }

    const elementId = `element-${activeSlideId}-${selectedField}`;
    const animation = animations[elementId];

    if (animation) {
      navigator.clipboard.writeText(JSON.stringify(animation));
      showToast("Animation copied");
    } else {
      showToast("No animation on selected element");
    }
  }, [selectedField, activeSlideId, animations, showToast]);

  const pasteAnimation = useCallback(() => {
    if (!selectedField) {
      showToast("Please select an element to paste animation to");
      return;
    }

    navigator.clipboard.readText().then(text => {
      try {
        const animation = JSON.parse(text);
        const elementId = `element-${activeSlideId}-${selectedField}`;
        addAnimation(elementId, animation.type);
        updateAnimation(elementId, animation);
        showToast("Animation pasted");
      } catch (error) {
        showToast("No animation in clipboard");
      }
    });
  }, [selectedField, activeSlideId, addAnimation, updateAnimation, showToast]);

  return {
    // States
    animations,
    setAnimations,
    animationPane,
    setAnimationPane,
    showAnimationPane,
    setShowAnimationPane,
    selectedAnimation,
    setSelectedAnimation,
    isAnimating,
    setIsAnimating,
    animationPreview,
    setAnimationPreview,
    animationTypes: ANIMATION_TYPES,
    
    // Animation Settings
    currentAnimationCategory,
    setCurrentAnimationCategory,
    animationDuration,
    setAnimationDuration,
    animationDelay,
    setAnimationDelay,
    animationRepeat,
    setAnimationRepeat,
    animationDirection,
    setAnimationDirection,
    animationFillMode,
    setAnimationFillMode,
    animationEasing,
    setAnimationEasing,
    animationTrigger,
    setAnimationTrigger,
    animationOrder,
    setAnimationOrder,

    // Functions
    getAnimationStyle,
    addAnimation,
    removeAnimation,
    updateAnimation,
    reorderAnimation,
    previewAnimation,
    copyAnimation,
    pasteAnimation
  };
};