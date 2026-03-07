// src/components/Editor/EditorUtils.jsx
import Typo from 'typo-js';

const dictionary = new Typo('en_US');

// ========== GOOGLE TRANSLATE API ==========
export const googleTranslate = async (text, options) => {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${options.to}&dt=t&q=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return { text: data[0][0][0] };
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
};

// ========== HELPER FUNCTIONS ==========
export const getFieldFromElement = (element) => {
  if (element.classList.contains('title-slide-main')) return 'title';
  if (element.classList.contains('title-slide-sub')) return 'subtitle';
  if (element.classList.contains('content-title')) return 'title';
  if (element.classList.contains('content-body')) return 'content';
  if (element.classList.contains('two-column-title')) return 'title';
  if (element.classList.contains('column-left')) return 'leftContent';
  if (element.classList.contains('column-right')) return 'rightContent';
  if (element.classList.contains('comparison-title')) return 'title';
  if (element.classList.contains('comparison-content')) {
    const parent = element.closest('.comparison-column');
    if (parent && parent.querySelector('.comparison-header')?.innerText === 'Left') 
      return 'leftContent';
    else 
      return 'rightContent';
  }
  if (element.classList.contains('section-header-title')) return 'title';
  return null;
};

// ========== ANIMATION STYLES ==========
export const getAnimationStyle = (animation) => {
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
};

// ========== DICTIONARY ==========
export { dictionary };