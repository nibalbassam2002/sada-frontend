// src/components/Editor/EditorConstants.jsx
export const LAYOUT_TYPES = {
  TITLE_SLIDE: 'Title Slide',
  TITLE_AND_CONTENT: 'Title and Content',
  SECTION_HEADER: 'Section Header',
  TWO_CONTENT: 'Two Content',
  COMPARISON: 'Comparison',
  BLANK: 'Blank'
};

export const ANIMATION_TYPES = {
  entrance: [
    { id: 'fade', name: 'Fade', category: 'entrance' },
    { id: 'fly-in', name: 'Fly In', category: 'entrance' },
    { id: 'float-in', name: 'Float In', category: 'entrance' },
    { id: 'zoom-in', name: 'Zoom In', category: 'entrance' },
    { id: 'bounce', name: 'Bounce', category: 'entrance' },
    { id: 'peek', name: 'Peek', category: 'entrance' },
    { id: 'slide', name: 'Slide', category: 'entrance' },
    { id: 'swivel', name: 'Swivel', category: 'entrance' }
  ],
  emphasis: [
    { id: 'pulse', name: 'Pulse', category: 'emphasis' },
    { id: 'spin', name: 'Spin', category: 'emphasis' },
    { id: 'grow', name: 'Grow/Shrink', category: 'emphasis' },
    { id: 'shake', name: 'Shake', category: 'emphasis' },
    { id: 'wave', name: 'Wave', category: 'emphasis' },
    { id: 'glow', name: 'Glow', category: 'emphasis' },
    { id: 'flash', name: 'Flash', category: 'emphasis' },
    { id: 'teeter', name: 'Teeter', category: 'emphasis' }
  ],
  exit: [
    { id: 'fade-out', name: 'Fade Out', category: 'exit' },
    { id: 'fly-out', name: 'Fly Out', category: 'exit' },
    { id: 'float-out', name: 'Float Out', category: 'exit' },
    { id: 'zoom-out', name: 'Zoom Out', category: 'exit' },
    { id: 'collapse', name: 'Collapse', category: 'exit' },
    { id: 'disappear', name: 'Disappear', category: 'exit' }
  ],
  motion: [
    { id: 'arc', name: 'Arc', category: 'motion' },
    { id: 'curve', name: 'Curve', category: 'motion' },
    { id: 'loop', name: 'Loop', category: 'motion' },
    { id: 'custom', name: 'Custom Path', category: 'motion' }
  ]
};

export const TRANSITION_TYPES = [
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

export const AVAILABLE_SOUNDS = [
  '[No Sound]', 'Applause', 'Click', 'Drum Roll', 'Whoosh',
  'Chime', 'Breeze', 'Camera', 'Cash Register', 'Explosion',
  'Glass', 'Laser', 'Push', 'Swoosh', 'Typewriter', 'Wind'
];

export const AVAILABLE_FONTS = [
  { name: 'Aptos', category: 'Sans Serif', popular: true },
  { name: 'Calibri', category: 'Sans Serif', popular: true },
  { name: 'Arial', category: 'Sans Serif', popular: true },
  { name: 'Segoe UI', category: 'Sans Serif', popular: true },
  { name: 'Helvetica', category: 'Sans Serif', popular: true },
  { name: 'Verdana', category: 'Sans Serif', popular: true },
  { name: 'Tahoma', category: 'Sans Serif', popular: true },
  { name: 'Trebuchet MS', category: 'Sans Serif', popular: false },
  { name: 'Montserrat', category: 'Sans Serif', popular: true },
  { name: 'Open Sans', category: 'Sans Serif', popular: true },
  { name: 'Roboto', category: 'Sans Serif', popular: true },
  { name: 'Lato', category: 'Sans Serif', popular: true },
  { name: 'Poppins', category: 'Sans Serif', popular: true },
  { name: 'Inter', category: 'Sans Serif', popular: true },
  { name: 'Source Sans Pro', category: 'Sans Serif', popular: false },
  { name: 'Ubuntu', category: 'Sans Serif', popular: false },
  { name: 'Oswald', category: 'Sans Serif', popular: false },
  { name: 'Times New Roman', category: 'Serif', popular: true },
  { name: 'Georgia', category: 'Serif', popular: true },
  { name: 'Garamond', category: 'Serif', popular: true },
  { name: 'Cambria', category: 'Serif', popular: true },
  { name: 'Merriweather', category: 'Serif', popular: true },
  { name: 'Playfair Display', category: 'Serif', popular: true },
  { name: 'Lora', category: 'Serif', popular: true },
  { name: 'Roboto Slab', category: 'Serif', popular: true },
  { name: 'Impact', category: 'Display', popular: true },
  { name: 'Bebas Neue', category: 'Display', popular: true },
  { name: 'Abril Fatface', category: 'Display', popular: true },
  { name: 'Lobster', category: 'Display', popular: true },
  { name: 'Pacifico', category: 'Display', popular: true },
  { name: 'Consolas', category: 'Monospace', popular: true },
  { name: 'Courier New', category: 'Monospace', popular: true },
  { name: 'Fira Code', category: 'Monospace', popular: true },
  { name: 'Roboto Mono', category: 'Monospace', popular: true },
  { name: 'Source Code Pro', category: 'Monospace', popular: true },
  { name: 'Comic Sans MS', category: 'Cursive', popular: false },
  { name: 'Brush Script MT', category: 'Cursive', popular: false },
  { name: 'Dancing Script', category: 'Cursive', popular: true },
  { name: 'Caveat', category: 'Cursive', popular: true }
];

export const THEME_COLORS = {
  standard: [
    '#000000', '#444444', '#666666', '#999999', '#cccccc', '#ffffff',
    '#d0312d', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6',
    '#e84342', '#f39c12', '#f7dc6f', '#27ae60', '#2980b9', '#8e44ad',
    '#c0392b', '#d35400', '#f4d03f', '#16a085', '#1f618d', '#6c3483',
  ],
};

export const LANGUAGES = [
  { code: 'ar', name: 'Arabic' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' }
];

export const RIBBON_TABS = [
  'Home', 'Insert', 'Design', 'Transitions', 'Animations',
  'Slide Show', 'Questions', 'Session', 'Review', 'View'
];