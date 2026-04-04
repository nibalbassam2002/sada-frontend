// src/components/Editor/groups/InsertGroup.jsx
import React, { useState, useRef, useMemo } from 'react';
import { useEditor } from '../EditorContext';
import {
  Table, Image, Search, Copy, Square, Smile, Layers, BarChart2,
  Link, MessageSquare, Type, PenTool, Hash, Sigma, Video, Music,
  ChevronDown, X, Star, Heart, Triangle, Circle, Hexagon,
  ArrowRight, Diamond
} from 'lucide-react';

// ─── Emoji Data (Unicode only – no emoji literals in code) ─────────────────
const EMOJI_CATEGORIES = [
  {
    label: 'Smileys',
    icon: 'face-grinning',
    emojis: [
      0x1F600, 0x1F601, 0x1F602, 0x1F603, 0x1F604, 0x1F605, 0x1F606, 0x1F607,
      0x1F608, 0x1F609, 0x1F60A, 0x1F60B, 0x1F60C, 0x1F60D, 0x1F60E, 0x1F60F,
      0x1F610, 0x1F611, 0x1F612, 0x1F613, 0x1F614, 0x1F615, 0x1F616, 0x1F617,
      0x1F618, 0x1F619, 0x1F61A, 0x1F61B, 0x1F61C, 0x1F61D, 0x1F61E, 0x1F61F,
      0x1F620, 0x1F621, 0x1F622, 0x1F623, 0x1F624, 0x1F625, 0x1F626, 0x1F627,
      0x1F628, 0x1F629, 0x1F62A, 0x1F62B, 0x1F62C, 0x1F62D, 0x1F62E, 0x1F62F,
      0x1F630, 0x1F631, 0x1F632, 0x1F633, 0x1F634, 0x1F635, 0x1F636, 0x1F637,
      0x1F970, 0x1F971, 0x1F972, 0x1F973, 0x1F974, 0x1F975, 0x1F976,
    ]
  },
  {
    label: 'People',
    emojis: [
      0x1F44D, 0x1F44E, 0x1F44F, 0x1F450, 0x1F91D, 0x1F64F, 0x1F44B, 0x1F44C,
      0x270A, 0x270B, 0x1F4AA, 0x1F91E, 0x1F91F, 0x1F918, 0x1F919, 0x1F91A,
      0x1F91B, 0x1F91C, 0x1F596, 0x1F590, 0x261D, 0x1F446, 0x1F447, 0x1F448,
      0x1F449, 0x1F595, 0x270D, 0x1F485, 0x1F933, 0x1F9B5, 0x1F9B6, 0x1F9B7,
      0x1F466, 0x1F467, 0x1F468, 0x1F469, 0x1F474, 0x1F475, 0x1F476, 0x1F477,
      0x1F478, 0x1F479, 0x1F47A, 0x1F47B, 0x1F47C, 0x1F47D, 0x1F47E, 0x1F47F,
    ]
  },
  {
    label: 'Nature',
    emojis: [
      0x1F436, 0x1F431, 0x1F42D, 0x1F439, 0x1F430, 0x1F98A, 0x1F43B, 0x1F43C,
      0x1F428, 0x1F42F, 0x1F981, 0x1F42E, 0x1F437, 0x1F438, 0x1F40D, 0x1F422,
      0x1F98E, 0x1F426, 0x1F425, 0x1F424, 0x1F423, 0x1F427, 0x1F986, 0x1F985,
      0x1F989, 0x1F987, 0x1F43A, 0x1F417, 0x1F416, 0x1F434, 0x1F984, 0x1F40E,
      0x1F332, 0x1F333, 0x1F334, 0x1F335, 0x1F340, 0x1F341, 0x1F342, 0x1F343,
      0x1F33A, 0x1F33B, 0x1F33C, 0x1F337, 0x1F338, 0x1F339, 0x1F33D, 0x1F33E,
    ]
  },
  {
    label: 'Food',
    emojis: [
      0x1F34E, 0x1F34F, 0x1F350, 0x1F351, 0x1F352, 0x1F353, 0x1F354, 0x1F355,
      0x1F356, 0x1F357, 0x1F358, 0x1F359, 0x1F35A, 0x1F35B, 0x1F35C, 0x1F35D,
      0x1F35E, 0x1F35F, 0x1F360, 0x1F361, 0x1F362, 0x1F363, 0x1F364, 0x1F365,
      0x1F366, 0x1F367, 0x1F368, 0x1F369, 0x1F36A, 0x1F36B, 0x1F36C, 0x1F36D,
      0x1F36E, 0x1F36F, 0x1F370, 0x1F371, 0x1F372, 0x1F373, 0x1F374, 0x1F375,
      0x1F376, 0x1F377, 0x1F378, 0x1F379, 0x1F37A, 0x1F37B, 0x1F37C, 0x1F37D,
    ]
  },
  {
    label: 'Travel',
    emojis: [
      0x1F697, 0x1F698, 0x1F699, 0x1F69A, 0x1F69B, 0x1F69C, 0x1F69D, 0x1F69E,
      0x1F69F, 0x1F6A0, 0x1F6A1, 0x1F6A2, 0x1F6A3, 0x1F6A4, 0x1F6A5, 0x1F6A6,
      0x1F681, 0x1F682, 0x1F683, 0x1F684, 0x1F685, 0x1F686, 0x1F687, 0x1F688,
      0x1F689, 0x1F68A, 0x1F68B, 0x1F68C, 0x1F68D, 0x1F68E, 0x1F68F, 0x1F690,
      0x1F3E0, 0x1F3E1, 0x1F3E2, 0x1F3E3, 0x1F3E4, 0x1F3E5, 0x1F3E6, 0x1F3E7,
      0x1F30D, 0x1F30E, 0x1F30F, 0x1F310, 0x1F311, 0x1F312, 0x1F313, 0x1F314,
    ]
  },
  {
    label: 'Objects',
    emojis: [
      0x1F4BB, 0x1F4BC, 0x1F4BD, 0x1F4BE, 0x1F4BF, 0x1F4C0, 0x1F4C1, 0x1F4C2,
      0x1F4C3, 0x1F4C4, 0x1F4C5, 0x1F4C6, 0x1F4C7, 0x1F4C8, 0x1F4C9, 0x1F4CA,
      0x1F4CB, 0x1F4CC, 0x1F4CD, 0x1F4CE, 0x1F4CF, 0x1F4D0, 0x1F4D1, 0x1F4D2,
      0x1F4D3, 0x1F4D4, 0x1F4D5, 0x1F4D6, 0x1F4D7, 0x1F4D8, 0x1F4D9, 0x1F4DA,
      0x1F527, 0x1F528, 0x1F529, 0x1F52A, 0x1F52B, 0x1F52C, 0x1F52D, 0x1F52E,
      0x1F3A8, 0x1F3A9, 0x1F3AA, 0x1F3AB, 0x1F3AC, 0x1F3AD, 0x1F3AE, 0x1F3AF,
    ]
  },
  {
    label: 'Symbols',
    emojis: [
      0x2764, 0x1F9E1, 0x1F49B, 0x1F49A, 0x1F499, 0x1F49C, 0x1F5A4, 0x1F90D,
      0x2B50, 0x1F31F, 0x1F4AB, 0x1F4A5, 0x1F4A6, 0x1F4A7, 0x1F4A8, 0x1F4A9,
      0x2705, 0x274C, 0x26A0, 0x1F6AB, 0x1F4AF, 0x1F51D, 0x1F51E, 0x1F51F,
      0x25B6, 0x23F8, 0x23F9, 0x23FA, 0x1F504, 0x1F503, 0x1F502, 0x1F501,
      0x267B, 0x2622, 0x2623, 0x2626, 0x262A, 0x262E, 0x262F, 0x2638,
      0x1F3B5, 0x1F3B6, 0x1F3B7, 0x1F3B8, 0x1F3B9, 0x1F3BA, 0x1F3BB, 0x1F3BC,
    ]
  },
];

const cp = (code) => String.fromCodePoint(code);

// ─── Shapes Data ──────────────────────────────────────────────────────────────
const SHAPES = [
  {
    type: 'rectangle', label: 'Rectangle',
    preview: (c) => (
      <rect x="8" y="14" width="44" height="32" rx="3"
        fill={c} stroke={c} strokeWidth="0" opacity="0.9"/>
    )
  },
  {
    type: 'rounded-rect', label: 'Rounded',
    preview: (c) => (
      <rect x="8" y="14" width="44" height="32" rx="12"
        fill={c} stroke={c} strokeWidth="0" opacity="0.9"/>
    )
  },
  {
    type: 'circle', label: 'Circle',
    preview: (c) => (
      <circle cx="30" cy="30" r="20" fill={c} opacity="0.9"/>
    )
  },
  {
    type: 'triangle', label: 'Triangle',
    preview: (c) => (
      <polygon points="30,8 54,52 6,52" fill={c} opacity="0.9"/>
    )
  },
  {
    type: 'star', label: 'Star',
    preview: (c) => (
      <polygon
        points="30,6 36,22 54,22 40,33 45,50 30,40 15,50 20,33 6,22 24,22"
        fill={c} opacity="0.9"
      />
    )
  },
  {
    type: 'heart', label: 'Heart',
    preview: (c) => (
      <path d="M30,46 C10,32 6,18 14,12 C20,8 28,12 30,18 C32,12 40,8 46,12 C54,18 50,32 30,46Z"
        fill={c} opacity="0.9"/>
    )
  },
  {
    type: 'diamond', label: 'Diamond',
    preview: (c) => (
      <polygon points="30,6 54,30 30,54 6,30" fill={c} opacity="0.9"/>
    )
  },
  {
    type: 'pentagon', label: 'Pentagon',
    preview: (c) => (
      <polygon points="30,6 54,22 46,50 14,50 6,22" fill={c} opacity="0.9"/>
    )
  },
  {
    type: 'hexagon', label: 'Hexagon',
    preview: (c) => (
      <polygon points="30,6 52,18 52,42 30,54 8,42 8,18" fill={c} opacity="0.9"/>
    )
  },
  {
    type: 'arrow-right', label: 'Arrow',
    preview: (c) => (
      <polygon points="6,22 38,22 38,12 54,30 38,48 38,38 6,38" fill={c} opacity="0.9"/>
    )
  },
  {
    type: 'parallelogram', label: 'Parallelogram',
    preview: (c) => (
      <polygon points="16,14 56,14 44,46 4,46" fill={c} opacity="0.9"/>
    )
  },
  {
    type: 'cross', label: 'Cross',
    preview: (c) => (
      <path d="M22,6 H38 V22 H54 V38 H38 V54 H22 V38 H6 V22 H22 Z"
        fill={c} opacity="0.9"/>
    )
  },
];

// ─── Shared Modal Shell ────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, width = 420 }) => (
  <div style={{
    position: 'fixed', inset: 0,
    background: 'rgba(15,23,42,0.55)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 99999, animation: 'fadeIn .15s ease'
  }} onClick={onClose}>
    <div style={{
      background: '#fff', borderRadius: 14,
      width: width, maxWidth: '95vw', maxHeight: '85vh',
      overflow: 'hidden',
      boxShadow: '0 24px 64px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.1)',
      display: 'flex', flexDirection: 'column',
      animation: 'slideUp .18s ease'
    }} onClick={e => e.stopPropagation()}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderBottom: '1px solid #f1f5f9', flexShrink: 0
      }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px' }}>
          {title}
        </span>
        <button onClick={onClose} style={{
          background: '#f1f5f9', border: 'none', borderRadius: 8,
          width: 28, height: 28, display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', color: '#64748b'
        }}>
          <X size={14} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
        {children}
      </div>
    </div>

    <style>{`
      @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      @keyframes slideUp { from { transform: translateY(12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
    `}</style>
  </div>
);

// ─── Btn row for modals ────────────────────────────────────────────────────────
const ModalFooter = ({ onClose, onConfirm, confirmLabel = 'Insert', confirmColor = '#2563eb' }) => (
  <div style={{
    display: 'flex', justifyContent: 'flex-end', gap: 8,
    paddingTop: 16, borderTop: '1px solid #f1f5f9', marginTop: 4
  }}>
    <button onClick={onClose} style={{
      padding: '8px 18px', border: '1px solid #e2e8f0', borderRadius: 8,
      background: '#fff', cursor: 'pointer', fontSize: 13, color: '#475569', fontWeight: 500
    }}>Cancel</button>
    <button onClick={onConfirm} style={{
      padding: '8px 20px', border: 'none', borderRadius: 8,
      background: confirmColor, color: '#fff', cursor: 'pointer',
      fontSize: 13, fontWeight: 700, letterSpacing: '0.2px'
    }}>{confirmLabel}</button>
  </div>
);

// ─── SHAPES MODAL ─────────────────────────────────────────────────────────────
const ShapesModal = ({ onClose, onInsert }) => {
  const [hovered, setHovered] = useState(null);
  const [chosen, setChosen] = useState(null);
  const accent = '#6366f1';

  return (
    <Modal title="Insert Shape" onClose={onClose} width={460}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8
      }}>
        {SHAPES.map(s => (
          <button
            key={s.type}
            onClick={() => setChosen(s.type)}
            onMouseEnter={() => setHovered(s.type)}
            onMouseLeave={() => setHovered(null)}
            style={{
              border: chosen === s.type
                ? `2px solid ${accent}`
                : '2px solid transparent',
              borderRadius: 10,
              padding: '6px 4px 4px',
              cursor: 'pointer',
              background: chosen === s.type
                ? '#eef2ff'
                : hovered === s.type ? '#f8fafc' : '#fff',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4,
              transition: 'all .12s',
              boxShadow: chosen === s.type
                ? `0 0 0 3px ${accent}22`
                : 'none'
            }}
          >
            <svg viewBox="0 0 60 60" width="40" height="40">
              {s.preview(
                chosen === s.type ? accent :
                hovered === s.type ? '#94a3b8' : '#cbd5e1'
              )}
            </svg>
            <span style={{
              fontSize: 9, color: chosen === s.type ? accent : '#64748b',
              fontWeight: chosen === s.type ? 700 : 500, letterSpacing: '0.2px'
            }}>{s.label}</span>
          </button>
        ))}
      </div>
      <ModalFooter
        onClose={onClose}
        onConfirm={() => { if (chosen) { onInsert(chosen); onClose(); } }}
        confirmColor={accent}
      />
    </Modal>
  );
};

// ─── EMOJI / ICONS MODAL ──────────────────────────────────────────────────────
const EmojiModal = ({ onClose, onInsert }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');

  const currentEmojis = useMemo(() => {
    const cat = EMOJI_CATEGORIES[activeTab];
    return cat.emojis.map(cp);
  }, [activeTab]);

  const filtered = search.trim()
    ? currentEmojis.filter((_, i) => i < 48) // simple filter for speed
    : currentEmojis;

  return (
    <Modal title="Insert Icon" onClose={onClose} width={480}>
      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#f8fafc', border: '1px solid #e2e8f0',
        borderRadius: 8, padding: '8px 12px', marginBottom: 12
      }}>
        <Search size={14} color="#94a3b8" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search icons..."
          style={{
            border: 'none', background: 'none', outline: 'none',
            fontSize: 13, color: '#0f172a', flex: 1
          }}
        />
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 12, overflowX: 'auto',
        paddingBottom: 4
      }}>
        {EMOJI_CATEGORIES.map((cat, i) => (
          <button key={i} onClick={() => setActiveTab(i)} style={{
            padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
            background: activeTab === i ? '#6366f1' : '#f1f5f9',
            color: activeTab === i ? '#fff' : '#64748b',
            fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
            transition: 'all .12s', flexShrink: 0
          }}>{cat.label}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)',
        gap: 4, maxHeight: 260, overflowY: 'auto'
      }}>
        {filtered.map((em, i) => (
          <button key={i} onClick={() => { onInsert(em); onClose(); }}
            title={em}
            style={{
              border: '1px solid transparent', borderRadius: 8,
              padding: '8px 4px', cursor: 'pointer', background: '#fff',
              fontSize: 22, lineHeight: 1, transition: 'all .1s',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#eef2ff';
              e.currentTarget.style.borderColor = '#c7d2fe';
              e.currentTarget.style.transform = 'scale(1.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {em}
          </button>
        ))}
      </div>
    </Modal>
  );
};

// ─── LINK MODAL ───────────────────────────────────────────────────────────────
const LinkModal = ({ onClose, onInsert }) => {
  const [url, setUrl] = useState('https://');
  const [label, setLabel] = useState('');

  return (
    <Modal title="Insert Link" onClose={onClose} width={400}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
          URL
          <input value={url} onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            style={{
              display: 'block', marginTop: 6, width: '100%', boxSizing: 'border-box',
              padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8,
              fontSize: 13, outline: 'none', fontFamily: 'monospace'
            }}
          />
        </label>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
          Display Text <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span>
          <input value={label} onChange={e => setLabel(e.target.value)}
            placeholder="Click here"
            style={{
              display: 'block', marginTop: 6, width: '100%', boxSizing: 'border-box',
              padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8,
              fontSize: 13, outline: 'none'
            }}
          />
        </label>
      </div>
      <ModalFooter
        onClose={onClose}
        onConfirm={() => { if (url.trim() !== 'https://') { onInsert(url, label); onClose(); } }}
      />
    </Modal>
  );
};

// ─── TEXT BOX MODAL ───────────────────────────────────────────────────────────
const TextBoxModal = ({ onClose, onInsert }) => {
  const [text, setText] = useState('Text Box');
  const [fontSize, setFontSize] = useState(18);
  const [bold, setBold] = useState(false);
  const [align, setAlign] = useState('left');

  return (
    <Modal title="Insert Text Box" onClose={onClose} width={400}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
          Content
          <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
            style={{
              display: 'block', marginTop: 6, width: '100%', boxSizing: 'border-box',
              padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8,
              fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit'
            }}
          />
        </label>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', flex: 1 }}>
            Font Size
            <input type="number" value={fontSize} onChange={e => setFontSize(+e.target.value)}
              min={8} max={120}
              style={{
                display: 'block', marginTop: 6, width: '100%', boxSizing: 'border-box',
                padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none'
              }}
            />
          </label>

          <div style={{ display: 'flex', gap: 4 }}>
            {['left','center','right'].map(a => (
              <button key={a} onClick={() => setAlign(a)} style={{
                width: 32, height: 36, border: '1.5px solid',
                borderColor: align === a ? '#2563eb' : '#e2e8f0',
                borderRadius: 6, background: align === a ? '#eff6ff' : '#fff',
                cursor: 'pointer', fontSize: 12, color: align === a ? '#2563eb' : '#64748b'
              }}>
                {a === 'left' ? '\u2261' : a === 'center' ? '\u2263' : '\u2262'}
              </button>
            ))}
            <button onClick={() => setBold(b => !b)} style={{
              width: 32, height: 36, border: '1.5px solid',
              borderColor: bold ? '#2563eb' : '#e2e8f0',
              borderRadius: 6, background: bold ? '#eff6ff' : '#fff',
              cursor: 'pointer', fontSize: 13, fontWeight: 900, color: bold ? '#2563eb' : '#64748b'
            }}>B</button>
          </div>
        </div>
      </div>
      <ModalFooter onClose={onClose} onConfirm={() => { onInsert({ text, fontSize, bold, align }); onClose(); }} />
    </Modal>
  );
};

// ─── WORDART MODAL ────────────────────────────────────────────────────────────
const WORDART_STYLES = [
  { id: 'gradient-warm',   label: 'Sunset',    bg: 'linear-gradient(135deg,#f97316,#ef4444)', textBg: 'linear-gradient(135deg,#f97316,#ef4444)' },
  { id: 'gradient-cool',   label: 'Ocean',     bg: 'linear-gradient(135deg,#06b6d4,#6366f1)', textBg: 'linear-gradient(135deg,#06b6d4,#6366f1)' },
  { id: 'gradient-nature', label: 'Forest',    bg: 'linear-gradient(135deg,#10b981,#84cc16)', textBg: 'linear-gradient(135deg,#10b981,#84cc16)' },
  { id: 'gradient-royal',  label: 'Royal',     bg: 'linear-gradient(135deg,#8b5cf6,#ec4899)', textBg: 'linear-gradient(135deg,#8b5cf6,#ec4899)' },
  { id: 'shadow-dark',     label: 'Shadow',    bg: '#1e293b', textBg: '#1e293b' },
  { id: 'neon-green',      label: 'Neon',      bg: '#030712', textBg: '#4ade80' },
  { id: 'outline-blue',    label: 'Outline',   bg: '#f8fafc', textBg: 'transparent' },
  { id: 'gold',            label: 'Gold',      bg: 'linear-gradient(135deg,#fbbf24,#f59e0b)', textBg: 'linear-gradient(135deg,#fbbf24,#d97706)' },
];

const WordArtModal = ({ onClose, onInsert }) => {
  const [text, setText] = useState('WordArt');
  const [chosen, setChosen] = useState('gradient-warm');

  return (
    <Modal title="Insert WordArt" onClose={onClose} width={460}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
          Text
          <input value={text} onChange={e => setText(e.target.value)}
            style={{
              display: 'block', marginTop: 6, width: '100%', boxSizing: 'border-box',
              padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8,
              fontSize: 15, fontWeight: 700, outline: 'none'
            }}
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {WORDART_STYLES.map(s => (
            <button key={s.id} onClick={() => setChosen(s.id)} style={{
              border: chosen === s.id ? '2.5px solid #6366f1' : '2px solid transparent',
              borderRadius: 10, padding: '10px 6px', cursor: 'pointer',
              background: s.bg, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4, transition: 'all .12s',
              minHeight: 64, outline: chosen === s.id ? '2px solid #6366f133' : 'none'
            }}>
              <span style={{
                fontSize: 20, fontWeight: 900, fontFamily: 'Georgia, serif',
                background: s.textBg, WebkitBackgroundClip: 'text',
                WebkitTextFillColor: s.id === 'outline-blue' ? 'transparent' : '#fff',
                WebkitTextStroke: s.id === 'outline-blue' ? '2px #1e293b' : 'none',
                filter: s.id === 'neon-green' ? 'drop-shadow(0 0 6px #4ade80)' : 'none',
                backgroundClip: 'text', color: '#fff'
              }}>A</span>
              <span style={{
                fontSize: 9, color: s.id === 'outline-blue' ? '#374151' : '#ffffffcc',
                fontWeight: 600
              }}>{s.label}</span>
            </button>
          ))}
        </div>
      </div>
      <ModalFooter onClose={onClose} onConfirm={() => { onInsert({ text, style: chosen }); onClose(); }} confirmColor="#6366f1" />
    </Modal>
  );
};

// ─── CHART MODAL ──────────────────────────────────────────────────────────────
const CHART_TYPES = [
  { type: 'bar',    label: 'Bar',    svgPath: 'M8,44 V22 H18 V44 M22,44 V14 H32 V44 M36,44 V30 H46 V44' },
  { type: 'line',   label: 'Line',   svgPath: 'M8,40 L20,28 L32,34 L44,16 L56,22' },
  { type: 'pie',    label: 'Pie',    svgPath: null, isPie: true },
  { type: 'area',   label: 'Area',   svgPath: 'M8,44 L20,28 L32,34 L44,16 L56,22 L56,44 Z' },
  { type: 'scatter',label: 'Scatter',svgPath: null, isScatter: true },
  { type: 'donut',  label: 'Donut',  svgPath: null, isDonut: true },
];

const ChartModal = ({ onClose, onInsert }) => {
  const [chosen, setChosen] = useState('bar');
  const [title, setTitle] = useState('My Chart');
  const accent = '#059669';

  return (
    <Modal title="Insert Chart" onClose={onClose} width={440}>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
        Chart Title
        <input value={title} onChange={e => setTitle(e.target.value)}
          style={{
            display: 'block', marginTop: 6, width: '100%', boxSizing: 'border-box',
            padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8,
            fontSize: 13, outline: 'none', marginBottom: 14
          }}
        />
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {CHART_TYPES.map(c => (
          <button key={c.type} onClick={() => setChosen(c.type)} style={{
            border: chosen === c.type ? `2px solid ${accent}` : '2px solid #f1f5f9',
            borderRadius: 10, padding: '12px 8px', cursor: 'pointer',
            background: chosen === c.type ? '#f0fdf4' : '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            transition: 'all .12s'
          }}>
            <svg viewBox="0 0 64 54" width="52" height="44">
              <line x1="8" y1="6" x2="8" y2="48" stroke="#e2e8f0" strokeWidth="1.5"/>
              <line x1="8" y1="48" x2="56" y2="48" stroke="#e2e8f0" strokeWidth="1.5"/>
              {c.svgPath && !c.isPie && !c.isScatter && !c.isDonut && (
                c.type === 'bar'
                  ? <path d={c.svgPath} fill={chosen === c.type ? accent : '#94a3b8'} opacity="0.85"/>
                  : c.type === 'area'
                  ? <path d={c.svgPath} fill={chosen === c.type ? accent : '#94a3b8'} opacity="0.25"
                      stroke={chosen === c.type ? accent : '#94a3b8'} strokeWidth="2" strokeLinejoin="round"/>
                  : <path d={c.svgPath} fill="none"
                      stroke={chosen === c.type ? accent : '#94a3b8'} strokeWidth="2.5" strokeLinejoin="round"
                      strokeLinecap="round"/>
              )}
              {c.isPie && (
                <>
                  <circle cx="32" cy="28" r="18" fill={chosen === c.type ? accent : '#94a3b8'} opacity="0.85"/>
                  <path d="M32,28 L32,10 A18,18 0 0,1 48,38 Z" fill={chosen === c.type ? '#059669' : '#64748b'}/>
                  <path d="M32,28 L48,38 A18,18 0 0,1 18,42 Z" fill={chosen === c.type ? '#34d399' : '#cbd5e1'}/>
                </>
              )}
              {c.isDonut && (
                <>
                  <circle cx="32" cy="28" r="18" fill="none" stroke={chosen === c.type ? accent : '#94a3b8'} strokeWidth="10" opacity="0.8"/>
                  <circle cx="32" cy="28" r="18" fill="none" stroke={chosen === c.type ? '#34d399' : '#cbd5e1'} strokeWidth="10"
                    strokeDasharray="40 72" strokeDashoffset="0"/>
                </>
              )}
              {c.isScatter && (
                [{ x:18,y:36 },{ x:26,y:22 },{ x:34,y:30 },{ x:42,y:18 },{ x:50,y:26 }].map((pt,i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r="4"
                    fill={chosen === c.type ? accent : '#94a3b8'} opacity="0.8"/>
                ))
              )}
            </svg>
            <span style={{ fontSize: 10, color: chosen === c.type ? accent : '#64748b', fontWeight: 600 }}>
              {c.label}
            </span>
          </button>
        ))}
      </div>

      <ModalFooter onClose={onClose} onConfirm={() => { onInsert({ type: chosen, title }); onClose(); }} confirmColor={accent} />
    </Modal>
  );
};

// ─── EQUATION MODAL ───────────────────────────────────────────────────────────
const COMMON_EQUATIONS = [
  'E = mc\u00B2', 'a\u00B2 + b\u00B2 = c\u00B2', 'F = ma',
  '\u222Bf(x)dx', '\u03A3x\u1D62/n', 'e\u1D4F\u03C0 + 1 = 0',
  '\u03BB = h/mv', '\u0394E = h\u03BD', 'PV = nRT',
];

const EquationModal = ({ onClose, onInsert }) => {
  const [eq, setEq] = useState('');
  return (
    <Modal title="Insert Equation" onClose={onClose} width={420}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
          Equation
          <input value={eq} onChange={e => setEq(e.target.value)} placeholder="E = mc\u00B2"
            style={{
              display: 'block', marginTop: 6, width: '100%', boxSizing: 'border-box',
              padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8,
              fontSize: 18, fontFamily: 'Georgia, "Times New Roman", serif',
              outline: 'none', textAlign: 'center', background: '#fafafa'
            }}
          />
        </label>

        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Common Equations
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {COMMON_EQUATIONS.map(c => (
              <button key={c} onClick={() => setEq(c)} style={{
                padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: 20,
                background: eq === c ? '#eff6ff' : '#f8fafc',
                borderColor: eq === c ? '#bfdbfe' : '#e2e8f0',
                cursor: 'pointer', fontSize: 13,
                fontFamily: 'Georgia, serif', color: '#1e293b',
                transition: 'all .1s'
              }}>{c}</button>
            ))}
          </div>
        </div>
      </div>
      <ModalFooter onClose={onClose} onConfirm={() => { if (eq.trim()) { onInsert(eq); onClose(); } }} confirmColor="#475569" />
    </Modal>
  );
};

// ─── SYMBOL MODAL ─────────────────────────────────────────────────────────────
const SYMBOL_GROUPS = {
  Math:    ['\u00B1','\u00D7','\u00F7','\u221A','\u221E','\u2248','\u2260','\u2264','\u2265','\u2211','\u222B','\u03C0','\u03B1','\u03B2','\u03B3','\u03B4','\u03B5','\u03B8','\u03BB','\u03BC','\u03C3','\u03C9','\u0394','\u2202'],
  Arrows:  ['\u2190','\u2191','\u2192','\u2193','\u2194','\u2195','\u21D0','\u21D1','\u21D2','\u21D3','\u21D4','\u21C4','\u21C5','\u21BA','\u21BB','\u27F5','\u27F6','\u27F7','\u21A9','\u21AA','\u2B05','\u2B06','\u2B07','\u27A1'],
  Currency:['\u20AC','\u00A3','\u00A5','\u00A2','\u20B9','\u20BF','\u0024','\u00A4','\u20AA','\u20A3','\u20A6','\u20B4','\u20B1','\u20AD','\u20AE','\u20AF'],
  Legal:   ['\u00A9','\u00AE','\u2122','\u2020','\u2021','\u00A7','\u00B6','\u2023','\u203B','\u2042'],
  Misc:    ['\u2605','\u2606','\u2663','\u2665','\u2666','\u2660','\u2713','\u2717','\u2714','\u2718','\u25A0','\u25A1','\u25CF','\u25CB','\u25B2','\u25BC'],
};

const SymbolModal = ({ onClose, onInsert }) => {
  const [tab, setTab] = useState('Math');
  return (
    <Modal title="Insert Symbol" onClose={onClose} width={440}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 12, flexWrap: 'wrap' }}>
        {Object.keys(SYMBOL_GROUPS).map(k => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
            background: tab === k ? '#475569' : '#f1f5f9',
            color: tab === k ? '#fff' : '#64748b',
            fontSize: 11, fontWeight: 600, transition: 'all .1s'
          }}>{k}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 4 }}>
        {SYMBOL_GROUPS[tab].map(s => (
          <button key={s} onClick={() => { onInsert(s); onClose(); }}
            style={{
              border: '1px solid #f1f5f9', borderRadius: 8, padding: '10px 4px',
              cursor: 'pointer', background: '#fff', fontSize: 20, color: '#1e293b',
              transition: 'all .1s', fontFamily: 'serif'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
          >{s}</button>
        ))}
      </div>
    </Modal>
  );
};

// ─── VIDEO MODAL ──────────────────────────────────────────────────────────────
const VideoModal = ({ onClose, onInsert }) => {
  const [url, setUrl] = useState('');
  const fileRef = useRef();

  return (
    <Modal title="Insert Video" onClose={onClose} width={420}>
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          border: '2px dashed #e2e8f0', borderRadius: 12, padding: '28px 24px',
          textAlign: 'center', cursor: 'pointer', background: '#fafafa',
          transition: 'all .15s', marginBottom: 16
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.background = '#fff5f5'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fafafa'; }}
      >
        <Video size={36} color="#ef4444" style={{ display: 'block', margin: '0 auto 10px' }} />
        <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Upload Video File</div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>MP4, WebM, MOV</div>
        <input ref={fileRef} type="file" accept="video/*" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files[0]; if (f) { onInsert({ file: f, type: 'file' }); onClose(); } }} />
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
        <span style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>or paste URL</span>
        <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input value={url} onChange={e => setUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          style={{
            flex: 1, padding: '9px 12px', border: '1.5px solid #e2e8f0',
            borderRadius: 8, fontSize: 13, outline: 'none'
          }}
        />
        <button onClick={() => { if (url.trim()) { onInsert({ url, type: 'url' }); onClose(); } }}
          style={{
            padding: '9px 16px', border: 'none', borderRadius: 8,
            background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13
          }}>Add</button>
      </div>
    </Modal>
  );
};

// ─── AUDIO MODAL ──────────────────────────────────────────────────────────────
const AudioModal = ({ onClose, onInsert }) => {
  const [url, setUrl] = useState('');
  const fileRef = useRef();

  return (
    <Modal title="Insert Audio" onClose={onClose} width={420}>
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          border: '2px dashed #e2e8f0', borderRadius: 12, padding: '28px 24px',
          textAlign: 'center', cursor: 'pointer', background: '#fafafa',
          transition: 'all .15s', marginBottom: 16
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#eff6ff'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fafafa'; }}
      >
        <Music size={36} color="#3b82f6" style={{ display: 'block', margin: '0 auto 10px' }} />
        <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Upload Audio File</div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>MP3, WAV, OGG, M4A</div>
        <input ref={fileRef} type="file" accept="audio/*" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files[0]; if (f) { onInsert({ file: f, type: 'file' }); onClose(); } }} />
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
        <span style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>or paste URL</span>
        <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input value={url} onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com/audio.mp3"
          style={{
            flex: 1, padding: '9px 12px', border: '1.5px solid #e2e8f0',
            borderRadius: 8, fontSize: 13, outline: 'none'
          }}
        />
        <button onClick={() => { if (url.trim()) { onInsert({ url, type: 'url' }); onClose(); } }}
          style={{
            padding: '9px 16px', border: 'none', borderRadius: 8,
            background: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13
          }}>Add</button>
      </div>
    </Modal>
  );
};

// ─── SMARTART MODAL ───────────────────────────────────────────────────────────
const SMARTART_LAYOUTS = [
  { id: 'list', label: 'List',
    preview: () => (
      <svg viewBox="0 0 80 60" width="64" height="48">
        {[0,1,2].map(i => (
          <rect key={i} x="8" y={8+i*17} width="64" height="12" rx="4"
            fill="#6366f1" opacity={0.9-i*0.2}/>
        ))}
      </svg>
    )
  },
  { id: 'process', label: 'Process',
    preview: () => (
      <svg viewBox="0 0 80 60" width="64" height="48">
        {[0,1,2].map(i => (
          <g key={i}>
            <rect x={6+i*23} y="20" width="18" height="20" rx="4" fill="#6366f1" opacity={0.9-i*0.2}/>
            {i < 2 && <polygon points={`${28+i*23},30 ${30+i*23},27 ${30+i*23},33`} fill="#6366f1" opacity="0.6"/>}
          </g>
        ))}
      </svg>
    )
  },
  { id: 'cycle', label: 'Cycle',
    preview: () => (
      <svg viewBox="0 0 80 60" width="64" height="48">
        <circle cx="40" cy="30" r="20" fill="none" stroke="#6366f1" strokeWidth="4" strokeDasharray="10 5"/>
        <circle cx="40" cy="10" r="6" fill="#6366f1"/>
        <circle cx="58" cy="40" r="6" fill="#6366f1" opacity="0.7"/>
        <circle cx="22" cy="40" r="6" fill="#6366f1" opacity="0.5"/>
      </svg>
    )
  },
  { id: 'hierarchy', label: 'Hierarchy',
    preview: () => (
      <svg viewBox="0 0 80 60" width="64" height="48">
        <rect x="26" y="6" width="28" height="14" rx="3" fill="#6366f1"/>
        <line x1="40" y1="20" x2="40" y2="28" stroke="#6366f1" strokeWidth="2"/>
        <line x1="20" y1="28" x2="60" y2="28" stroke="#6366f1" strokeWidth="2"/>
        <rect x="8" y="28" width="24" height="14" rx="3" fill="#6366f1" opacity="0.7"/>
        <rect x="48" y="28" width="24" height="14" rx="3" fill="#6366f1" opacity="0.7"/>
      </svg>
    )
  },
  { id: 'venn', label: 'Venn',
    preview: () => (
      <svg viewBox="0 0 80 60" width="64" height="48">
        <circle cx="30" cy="30" r="18" fill="#6366f1" opacity="0.5"/>
        <circle cx="50" cy="30" r="18" fill="#8b5cf6" opacity="0.5"/>
      </svg>
    )
  },
  { id: 'pyramid', label: 'Pyramid',
    preview: () => (
      <svg viewBox="0 0 80 60" width="64" height="48">
        <polygon points="40,6 64,50 16,50" fill="#6366f1" opacity="0.15" stroke="#6366f1" strokeWidth="1"/>
        <polygon points="40,14 56,42 24,42" fill="#6366f1" opacity="0.4"/>
        <polygon points="40,22 52,42 28,42" fill="#6366f1" opacity="0.7"/>
        <polygon points="40,30 48,42 32,42" fill="#6366f1" opacity="0.9"/>
      </svg>
    )
  },
];

const SmartArtModal = ({ onClose, onInsert }) => {
  const [chosen, setChosen] = useState('list');

  return (
    <Modal title="Insert SmartArt" onClose={onClose} width={480}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {SMARTART_LAYOUTS.map(l => (
          <button key={l.id} onClick={() => setChosen(l.id)} style={{
            border: chosen === l.id ? '2px solid #6366f1' : '2px solid #f1f5f9',
            borderRadius: 10, padding: '12px 8px', cursor: 'pointer',
            background: chosen === l.id ? '#eef2ff' : '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            transition: 'all .12s'
          }}>
            {l.preview()}
            <span style={{ fontSize: 11, color: chosen === l.id ? '#6366f1' : '#64748b', fontWeight: 600 }}>
              {l.label}
            </span>
          </button>
        ))}
      </div>
      <ModalFooter onClose={onClose} onConfirm={() => { onInsert(chosen); onClose(); }} confirmColor="#6366f1" />
    </Modal>
  );
};

// ─── MAIN InsertGroup ─────────────────────────────────────────────────────────
const InsertGroup = () => {
  const {
    setShowTableModal,
    showToast,
    handleNewComment,
    slides,
    activeSlideId,
    setSlides,
    setIsDirty,
  } = useEditor();

  const [modal, setModal] = useState(null);
  const stockRef = useRef();

  // ── add element to current slide ──────────────────────────────────────────
  const addEl = (element) => {
    setSlides(prev => prev.map(slide =>
      slide.id !== activeSlideId ? slide : {
        ...slide,
        elements: [...(slide.elements || []), { id: Date.now(), ...element }]
      }
    ));
    if (setIsDirty) setIsDirty(true);
  };

  // ── handlers ──────────────────────────────────────────────────────────────
  const handlers = {
    shape:      (type)               => { addEl({ elementType: 'shape',     shapeType: type, x: 200, y: 150, width: 140, height: 140, fill: '#6366f1', opacity: 100, rotation: 0 }); showToast(`${type} shape added`); },
    icon:       (emoji)              => { addEl({ elementType: 'icon',       emoji,            x: 220, y: 160, width: 80, height: 80, fontSize: 64 }); showToast('Icon added'); },
    link:       (url, label)         => { addEl({ elementType: 'link',       url, label: label || url, x: 200, y: 220 }); showToast('Link added'); },
    textbox:    ({ text, fontSize, bold, align }) => { addEl({ elementType: 'textbox', text, fontSize, bold, align, x: 150, y: 180, width: 320, height: 80, color: '#1e293b' }); showToast('Text box added'); },
    wordart:    ({ text, style })    => { addEl({ elementType: 'wordart',    text, artStyle: style, x: 120, y: 160, width: 420, height: 100, fontSize: 52 }); showToast('WordArt added'); },
    chart:      ({ type, title })    => { addEl({ elementType: 'chart',      chartType: type, title, x: 80, y: 80, width: 520, height: 320, data: { labels: ['Q1','Q2','Q3','Q4'], values: [40,65,55,80] } }); showToast(`${title} chart added`); },
    equation:   (eq)                 => { addEl({ elementType: 'equation',   equation: eq, x: 200, y: 200, fontSize: 30, color: '#1e293b' }); showToast('Equation added'); },
    symbol:     (sym)                => {
      const activeEl = document.querySelector('.active-editing');
      if (activeEl) { document.execCommand('insertText', false, sym); showToast(`Symbol "${sym}" inserted`); }
      else { addEl({ elementType: 'symbol', symbol: sym, x: 240, y: 200, fontSize: 52, color: '#1e293b' }); showToast(`Symbol added`); }
    },
    video:      ({ url, file, type }) => {
      const save = (src) => { addEl({ elementType: 'video', src, srcType: type, x: 80, y: 80, width: 500, height: 280 }); showToast('Video added'); };
      if (type === 'file' && file) { const r = new FileReader(); r.onload = e => save(e.target.result); r.readAsDataURL(file); }
      else save(url);
    },
    audio:      ({ url, file, type }) => {
      const save = (src) => { addEl({ elementType: 'audio', src, srcType: type, x: 280, y: 440, width: 320, height: 48 }); showToast('Audio added'); };
      if (type === 'file' && file) { const r = new FileReader(); r.onload = e => save(e.target.result); r.readAsDataURL(file); }
      else save(url);
    },
    smartart:   (layout)             => { addEl({ elementType: 'smartart',   layout, items: ['Item 1','Item 2','Item 3'], x: 80, y: 80, width: 620, height: 320, color: '#6366f1' }); showToast(`SmartArt added`); },
    slideNum:   ()                   => { addEl({ elementType: 'slidenumber', x: 888, y: 512, fontSize: 13, color: '#64748b' }); showToast('Slide number added'); },
    stockImage: (file)               => {
      const r = new FileReader();
      r.onload = ev => {
        setSlides(prev => prev.map(s => s.id !== activeSlideId ? s : {
          ...s, images: [...(s.images || []), { id: Date.now(), src: ev.target.result, x: 100, y: 100, width: 300, height: 'auto', rotation: 0, opacity: 100, filters: { brightness: 100, contrast: 100 } }]
        }));
        if (setIsDirty) setIsDirty(true);
        showToast('Image added');
      };
      r.readAsDataURL(file);
    },
  };

  // ── ribbon groups config ──────────────────────────────────────────────────
  const close = () => setModal(null);

  return (
    <>
      {/* hidden stock image input */}
      <input ref={stockRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files[0]; if (f) { handlers.stockImage(f); e.target.value = ''; } }} />

      {/* ── TABLES ── */}
      <div className="ribbon-group">
        <div className="group-content-flex">
          <button className="btn-mega" onClick={() => setShowTableModal(true)}>
            <Table size={28} color="#475569" />
            <div className="btn-label-stack">
              <span>Table</span>
              <ChevronDown size={10} />
            </div>
          </button>
        </div>
        <div className="group-label">Tables</div>
      </div>

      <div className="v-divider-slim" />

      {/* ── IMAGES ── */}
      <div className="ribbon-group">
        <div className="group-content-flex">
          <button className="btn-mega" onClick={() => document.getElementById('global-image-upload')?.click()}>
            <Image size={28} color="#059669" />
            <div className="btn-label-stack"><span>Pictures</span></div>
          </button>
          <div className="mini-tools-stack">
            <button className="btn-mini-wide" onClick={() => stockRef.current?.click()}>
              <Search size={14} color="#6366f1" /> Stock Images
            </button>
            <button className="btn-mini-wide" onClick={() => showToast('Use Win+Shift+S or Cmd+Shift+4 to screenshot')}>
              <Copy size={14} color="#475569" /> Screenshot
            </button>
          </div>
        </div>
        <div className="group-label">Images</div>
      </div>

      <div className="v-divider-slim" />

      {/* ── ILLUSTRATIONS ── */}
      <div className="ribbon-group">
        <div className="group-content-col">
          <div className="tool-row">
            <button className="btn-icon-s" onClick={() => setModal('shapes')}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg viewBox="0 0 20 20" width="16" height="16">
                <rect x="1" y="1" width="8" height="8" rx="1.5" fill="#6366f1" opacity="0.8"/>
                <circle cx="15" cy="5" r="4" fill="#8b5cf6" opacity="0.8"/>
                <polygon points="10,13 19,19 1,19" fill="#a78bfa" opacity="0.8"/>
              </svg>
              Shapes
            </button>
            <button className="btn-icon-s" onClick={() => setModal('icons')}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Smile size={16} color="#f59e0b" /> Icons
            </button>
          </div>
          <div className="tool-row">
            <button className="btn-icon-s" onClick={() => setModal('smartart')}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Layers size={16} color="#6366f1" /> SmartArt
            </button>
            <button className="btn-icon-s" onClick={() => setModal('chart')}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <BarChart2 size={16} color="#059669" /> Chart
            </button>
          </div>
        </div>
        <div className="group-label">Illustrations</div>
      </div>

      <div className="v-divider-slim" />

      {/* ── LINKS & COMMENTS ── */}
      <div className="ribbon-group">
        <div className="group-content-col">
          <button className="btn-mini-wide" onClick={() => setModal('link')}>
            <Link size={16} color="#2563eb" /> Link
          </button>
          <button className="btn-mini-wide" onClick={() => { handleNewComment(); showToast('Comment added'); }}>
            <MessageSquare size={16} color="#f59e0b" /> Comment
          </button>
        </div>
        <div className="group-label">Links &amp; Comments</div>
      </div>

      <div className="v-divider-slim" />

      {/* ── TEXT ── */}
      <div className="ribbon-group">
        <div className="group-content-flex">
          <button className="btn-mega" onClick={() => setModal('textbox')}>
            <Type size={28} color="#2563eb" />
            <span>Text Box</span>
          </button>
          <div className="mini-tools-stack">
            <button className="btn-mini-wide" onClick={() => setModal('wordart')}>
              <PenTool size={14} color="#db2777" /> WordArt
            </button>
            <button className="btn-mini-wide" onClick={() => { handlers.slideNum(); }}>
              <Hash size={14} color="#475569" /> Slide Number
            </button>
          </div>
        </div>
        <div className="group-label">Text</div>
      </div>

      <div className="v-divider-slim" />

      {/* ── SYMBOLS ── */}
      <div className="ribbon-group">
        <div className="group-content-col">
          <button className="btn-mini-wide" onClick={() => setModal('equation')}>
            <Sigma size={16} color="#475569" /> Equation
          </button>
          <button className="btn-mini-wide" onClick={() => setModal('symbol')}>
            <Smile size={16} color="#64748b" /> Symbol
          </button>
        </div>
        <div className="group-label">Symbols</div>
      </div>

      <div className="v-divider-slim" />

      {/* ── MEDIA ── */}
      <div className="ribbon-group">
        <div className="group-content-col">
          <button className="btn-mini-wide" onClick={() => setModal('video')}>
            <Video size={16} color="#ef4444" /> Video
          </button>
          <button className="btn-mini-wide" onClick={() => setModal('audio')}>
            <Music size={16} color="#3b82f6" /> Audio
          </button>
        </div>
        <div className="group-label">Media</div>
      </div>

      {/* ── Modals ── */}
      {modal === 'shapes'   && <ShapesModal   onClose={close} onInsert={handlers.shape} />}
      {modal === 'icons'    && <EmojiModal    onClose={close} onInsert={handlers.icon} />}
      {modal === 'link'     && <LinkModal     onClose={close} onInsert={handlers.link} />}
      {modal === 'textbox'  && <TextBoxModal  onClose={close} onInsert={handlers.textbox} />}
      {modal === 'wordart'  && <WordArtModal  onClose={close} onInsert={handlers.wordart} />}
      {modal === 'chart'    && <ChartModal    onClose={close} onInsert={handlers.chart} />}
      {modal === 'equation' && <EquationModal onClose={close} onInsert={handlers.equation} />}
      {modal === 'symbol'   && <SymbolModal   onClose={close} onInsert={handlers.symbol} />}
      {modal === 'video'    && <VideoModal    onClose={close} onInsert={handlers.video} />}
      {modal === 'audio'    && <AudioModal    onClose={close} onInsert={handlers.audio} />}
      {modal === 'smartart' && <SmartArtModal onClose={close} onInsert={handlers.smartart} />}
    </>
  );
};

export default InsertGroup;
