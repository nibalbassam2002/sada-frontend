// src/components/Editor/Elements/ElementsLayer.jsx
import React, { useState, useRef, useCallback } from 'react';
import { useEditor } from '../EditorContext';

// ─── Shape SVG paths ──────────────────────────────────────────────────────────
const getShapePath = (type, w, h) => {
  switch (type) {
    case 'rectangle':
      return `M 0 0 H ${w} V ${h} H 0 Z`;
    case 'rounded-rect':
      return `M 16 0 H ${w - 16} Q ${w} 0 ${w} 16 V ${h - 16} Q ${w} ${h} ${w - 16} ${h} H 16 Q 0 ${h} 0 ${h - 16} V 16 Q 0 0 16 0 Z`;
    case 'circle':
      return null; // نستخدم circle مباشرة
    case 'triangle':
      return `M ${w / 2} 0 L ${w} ${h} L 0 ${h} Z`;
    case 'star': {
      const cx = w / 2, cy = h / 2;
      const r1 = Math.min(w, h) / 2, r2 = r1 * 0.4;
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const ang = (i * Math.PI / 5) - Math.PI / 2;
        const r = i % 2 === 0 ? r1 : r2;
        pts.push(`${cx + r * Math.cos(ang)},${cy + r * Math.sin(ang)}`);
      }
      return `M ${pts.join(' L ')} Z`;
    }
    case 'heart':
      return `M ${w/2},${h*0.85} C ${w*0.1},${h*0.6} 0,${h*0.3} ${w*0.15},${h*0.18} C ${w*0.3},${h*0.06} ${w/2},${h*0.2} ${w/2},${h*0.35} C ${w/2},${h*0.2} ${w*0.7},${h*0.06} ${w*0.85},${h*0.18} C ${w},${h*0.3} ${w*0.9},${h*0.6} ${w/2},${h*0.85} Z`;
    case 'diamond':
      return `M ${w/2} 0 L ${w} ${h/2} L ${w/2} ${h} L 0 ${h/2} Z`;
    case 'pentagon': {
      const cx = w/2, cy = h/2, r = Math.min(w,h)/2;
      const pts = [0,1,2,3,4].map(i => {
        const a = (i * 2 * Math.PI / 5) - Math.PI / 2;
        return `${cx + r*Math.cos(a)},${cy + r*Math.sin(a)}`;
      });
      return `M ${pts.join(' L ')} Z`;
    }
    case 'hexagon': {
      const cx = w/2, cy = h/2, r = Math.min(w,h)/2;
      const pts = [0,1,2,3,4,5].map(i => {
        const a = i * Math.PI / 3;
        return `${cx + r*Math.cos(a)},${cy + r*Math.sin(a)}`;
      });
      return `M ${pts.join(' L ')} Z`;
    }
    case 'arrow-right': {
      const ah = h * 0.35, ay = h * 0.325;
      return `M 0 ${ay} H ${w*0.6} V ${ay-ah} L ${w} ${h/2} L ${w*0.6} ${ay+h*0.35} V ${ay+h*0.325} H 0 Z`;
    }
    case 'parallelogram':
      return `M ${w*0.2} 0 H ${w} L ${w*0.8} ${h} H 0 Z`;
    case 'cross': {
      const t = w * 0.28;
      return `M ${t} 0 H ${w-t} V ${t} H ${w} V ${h-t} H ${w-t} V ${h} H ${t} V ${h-t} H 0 V ${t} H ${t} Z`;
    }
    default:
      return `M 0 0 H ${w} V ${h} H 0 Z`;
  }
};

// ─── WordArt gradient styles ──────────────────────────────────────────────────
const WORDART_STYLES = {
  'gradient-warm':   { bg: 'linear-gradient(135deg,#f97316,#ef4444)', stroke: 'none' },
  'gradient-cool':   { bg: 'linear-gradient(135deg,#06b6d4,#6366f1)', stroke: 'none' },
  'gradient-nature': { bg: 'linear-gradient(135deg,#10b981,#84cc16)', stroke: 'none' },
  'gradient-royal':  { bg: 'linear-gradient(135deg,#8b5cf6,#ec4899)', stroke: 'none' },
  'shadow-dark':     { bg: '#1e293b', stroke: 'none' },
  'neon-green':      { bg: '#4ade80', stroke: 'none', glow: '#4ade80' },
  'outline-blue':    { bg: 'transparent', stroke: '2px #1e293b' },
  'gold':            { bg: 'linear-gradient(135deg,#fbbf24,#d97706)', stroke: 'none' },
};

// ─── Single Element Visual ────────────────────────────────────────────────────
const ElementVisual = ({ el }) => {
  const w = el.width  || 120;
  const h = el.height || 120;

  if (el.elementType === 'shape') {
    const fill = el.fill || '#6366f1';
    if (el.shapeType === 'circle') {
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }}>
          <ellipse cx={w/2} cy={h/2} rx={w/2} ry={h/2} fill={fill}
            filter="drop-shadow(0 2px 6px rgba(0,0,0,0.18))" />
        </svg>
      );
    }
    const path = getShapePath(el.shapeType, w, h);
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }}>
        <path d={path} fill={fill} filter="drop-shadow(0 2px 6px rgba(0,0,0,0.18))" />
      </svg>
    );
  }

  if (el.elementType === 'icon') {
    return (
      <div style={{
        width: w, height: h,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: el.fontSize || 64, lineHeight: 1,
        userSelect: 'none'
      }}>
        {el.emoji}
      </div>
    );
  }

  if (el.elementType === 'textbox') {
    return (
      <div style={{
        width: w, minHeight: h,
        fontSize: el.fontSize || 18,
        fontWeight: el.bold ? 700 : 400,
        fontStyle: el.italic ? 'italic' : 'normal',
        textDecoration: [
          el.underline ? 'underline' : '',
          el.strikethrough ? 'line-through' : ''
        ].filter(Boolean).join(' ') || 'none',
        textAlign: el.align || 'left',
        color: el.color || '#1e293b',
        lineHeight: el.lineHeight || 1.4,
        padding: '8px 12px',
        border: 'none',
        borderRadius: 4,
        background: 'transparent',
        boxSizing: 'border-box',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        {el.text || ''}
      </div>
    );
  }

  if (el.elementType === 'wordart') {
    const s = WORDART_STYLES[el.artStyle] || WORDART_STYLES['gradient-warm'];
    const isOutline = el.artStyle === 'outline-blue';
    const isNeon    = el.artStyle === 'neon-green';
    return (
      <div style={{
        width: w, height: h,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        userSelect: 'none',
      }}>
        <span style={{
          fontSize: el.fontSize || 52,
          fontWeight: 900,
          fontFamily: 'Georgia, "Times New Roman", serif',
          background: s.bg,
          WebkitBackgroundClip: isOutline ? undefined : 'text',
          WebkitTextFillColor: isOutline ? 'transparent' : '#fff',
          WebkitTextStroke: isOutline ? s.stroke : 'none',
          backgroundClip: isOutline ? undefined : 'text',
          filter: isNeon ? 'drop-shadow(0 0 12px #4ade80)' : 'none',
          letterSpacing: '-1px',
          lineHeight: 1.1,
          whiteSpace: 'nowrap',
        }}>
          {el.text}
        </span>
      </div>
    );
  }

  if (el.elementType === 'equation') {
    return (
      <div style={{
        width: w, height: h,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: el.fontSize || 28,
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontStyle: 'italic',
        color: el.color || '#1e293b',
        background: 'rgba(248,250,252,0.8)',
        border: '1px solid #e2e8f0',
        borderRadius: 6,
        padding: '4px 12px',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}>
        {el.equation}
      </div>
    );
  }

  if (el.elementType === 'symbol') {
    return (
      <div style={{
        width: w, height: h,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: el.fontSize || 52,
        fontFamily: 'serif',
        color: el.color || '#1e293b',
        userSelect: 'none',
      }}>
        {el.symbol}
      </div>
    );
  }

  if (el.elementType === 'slidenumber') {
    return (
      <div style={{
        fontSize: el.fontSize || 13,
        color: el.color || '#64748b',
        background: 'rgba(248,250,252,0.8)',
        border: '1px dashed #cbd5e1',
        borderRadius: 4,
        padding: '2px 8px',
        userSelect: 'none',
      }}>
        # Slide
      </div>
    );
  }

  if (el.elementType === 'link') {
    return (
      <div style={{
        width: w,
        fontSize: 15,
        color: '#2563eb',
        textDecoration: 'underline',
        fontWeight: 500,
        background: 'rgba(239,246,255,0.8)',
        border: '1px dashed #bfdbfe',
        borderRadius: 4,
        padding: '4px 10px',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        🔗 {el.label || el.url}
      </div>
    );
  }

  if (el.elementType === 'video') {
    const isYT = el.src?.includes('youtube') || el.src?.includes('youtu.be');
    const vidId = isYT && el.src.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];
    return (
      <div style={{ width: w, height: h, borderRadius: 6, overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        {isYT ? (
          <iframe
            src={`https://www.youtube.com/embed/${vidId}`}
            width={w} height={h}
            style={{ border: 'none', display: 'block' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen title="Video"
          />
        ) : (
          <video src={el.src} controls style={{ width: '100%', height: '100%', background: '#000', display: 'block' }} />
        )}
      </div>
    );
  }

  if (el.elementType === 'audio') {
    return (
      <div style={{
        width: w, borderRadius: 12, overflow: 'hidden',
        background: 'linear-gradient(135deg,#eff6ff,#dbeafe)',
        border: '1px solid #bfdbfe',
        padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 2px 8px rgba(59,130,246,0.15)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', background: '#3b82f6',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <div style={{ width:0, height:0, borderTop:'7px solid transparent',
            borderBottom:'7px solid transparent', borderLeft:'12px solid #fff', marginLeft: 3 }} />
        </div>
        <audio src={el.src} controls style={{ flex: 1, height: 32 }} />
      </div>
    );
  }

  if (el.elementType === 'chart') {
    const data    = el.data || { labels: ['Q1','Q2','Q3','Q4'], values: [40,65,55,80] };
    const color   = '#059669';
    const maxVal  = Math.max(...data.values, 1);
    const cw = w, ch = h;
    const padL = 36, padB = 28, padT = 36, padR = 12;
    const plotW = cw - padL - padR;
    const plotH = ch - padT - padB;
    const bw    = plotW / data.values.length;

    return (
      <div style={{ width: w, height: h, background: '#fff', borderRadius: 10,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', textAlign: 'center', padding: '10px 0 0' }}>
          {el.title}
        </div>
        <svg width={cw} height={ch - 30} viewBox={`0 0 ${cw} ${ch - 30}`}>
          <line x1={padL} y1={padT} x2={padL} y2={padT+plotH} stroke="#e2e8f0" strokeWidth={1}/>
          <line x1={padL} y1={padT+plotH} x2={padL+plotW} y2={padT+plotH} stroke="#e2e8f0" strokeWidth={1}/>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map(v => (
            <line key={v} x1={padL} y1={padT + plotH - v*plotH}
              x2={padL+plotW} y2={padT + plotH - v*plotH}
              stroke="#f1f5f9" strokeWidth={1} strokeDasharray="4 3" />
          ))}

          {el.chartType === 'bar' && data.values.map((v, i) => {
            const bh = (v / maxVal) * plotH;
            return (
              <g key={i}>
                <rect x={padL + i*bw + bw*0.15} y={padT + plotH - bh}
                  width={bw*0.7} height={bh} fill={color} rx={4} opacity="0.85"/>
                <text x={padL + i*bw + bw/2} y={padT+plotH+16}
                  textAnchor="middle" fontSize={11} fill="#64748b">{data.labels[i]}</text>
              </g>
            );
          })}

          {el.chartType === 'line' && (() => {
            const pts = data.values.map((v, i) => [
              padL + i * (plotW / (data.values.length - 1)),
              padT + plotH - (v / maxVal) * plotH
            ]);
            return (
              <>
                <polyline points={pts.map(p => p.join(',')).join(' ')}
                  fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
                {pts.map(([px, py], i) => (
                  <circle key={i} cx={px} cy={py} r={5} fill="#fff" stroke={color} strokeWidth={2.5}/>
                ))}
                {data.labels.map((l, i) => (
                  <text key={i} x={padL + i*(plotW/(data.values.length-1))} y={padT+plotH+16}
                    textAnchor="middle" fontSize={11} fill="#64748b">{l}</text>
                ))}
              </>
            );
          })()}

          {el.chartType === 'area' && (() => {
            const pts = data.values.map((v, i) => [
              padL + i * (plotW / (data.values.length - 1)),
              padT + plotH - (v / maxVal) * plotH
            ]);
            const areaD = `M ${pts[0][0]},${padT+plotH} ` + pts.map(p => `L ${p[0]},${p[1]}`).join(' ') + ` L ${pts[pts.length-1][0]},${padT+plotH} Z`;
            return (
              <>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.4"/>
                    <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
                  </linearGradient>
                </defs>
                <path d={areaD} fill="url(#areaGrad)"/>
                <polyline points={pts.map(p => p.join(',')).join(' ')}
                  fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round"/>
              </>
            );
          })()}

          {el.chartType === 'pie' && (() => {
            const total = data.values.reduce((a, b) => a + b, 0);
            const colors = [color, '#34d399', '#6ee7b7', '#a7f3d0'];
            let angle = -Math.PI / 2;
            const cx = cw/2, cy = (ch-30)/2 + 10, r = Math.min(cw, ch-30) * 0.35;
            return data.values.map((v, i) => {
              const slice = (v / total) * 2 * Math.PI;
              const x1 = cx + r*Math.cos(angle), y1 = cy + r*Math.sin(angle);
              angle += slice;
              const x2 = cx + r*Math.cos(angle), y2 = cy + r*Math.sin(angle);
              const large = slice > Math.PI ? 1 : 0;
              return (
                <path key={i} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
                  fill={colors[i % colors.length]} stroke="#fff" strokeWidth={2}/>
              );
            });
          })()}

          {el.chartType === 'donut' && (() => {
            const total = data.values.reduce((a, b) => a + b, 0);
            const colors = [color, '#34d399', '#6ee7b7', '#a7f3d0'];
            let angle = -Math.PI / 2;
            const cx = cw/2, cy = (ch-30)/2 + 10;
            const r = Math.min(cw, ch-30) * 0.35, inner = r * 0.55;
            return data.values.map((v, i) => {
              const slice = (v / total) * 2 * Math.PI;
              const x1o = cx+r*Math.cos(angle), y1o = cy+r*Math.sin(angle);
              const x1i = cx+inner*Math.cos(angle), y1i = cy+inner*Math.sin(angle);
              angle += slice;
              const x2o = cx+r*Math.cos(angle), y2o = cy+r*Math.sin(angle);
              const x2i = cx+inner*Math.cos(angle), y2i = cy+inner*Math.sin(angle);
              const large = slice > Math.PI ? 1 : 0;
              return (
                <path key={i}
                  d={`M ${x1o} ${y1o} A ${r} ${r} 0 ${large} 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${inner} ${inner} 0 ${large} 0 ${x1i} ${y1i} Z`}
                  fill={colors[i % colors.length]} stroke="#fff" strokeWidth={2}/>
              );
            });
          })()}

          {el.chartType === 'scatter' && data.values.map((v, i) => {
            const px = padL + (i / (data.values.length-1)) * plotW;
            const py = padT + plotH - (v / maxVal) * plotH;
            return <circle key={i} cx={px} cy={py} r={6} fill={color} opacity="0.8"/>;
          })}
        </svg>
      </div>
    );
  }

  if (el.elementType === 'smartart') {
    const items  = el.items || ['Item 1', 'Item 2', 'Item 3'];
    const accent = el.color || '#6366f1';

    if (el.layout === 'process') {
      return (
        <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', gap: 0 }}>
          {items.map((item, i) => (
            <React.Fragment key={i}>
              <div style={{
                flex: 1, height: h * 0.5, background: accent,
                opacity: 1 - i * 0.15, borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, color: '#fff', fontWeight: 600, textAlign: 'center', padding: '0 12px',
                userSelect: 'none',
              }}>{item}</div>
              {i < items.length - 1 && (
                <div style={{ width: 0, height: 0, flexShrink: 0,
                  borderTop: `${h*0.25}px solid transparent`, borderBottom: `${h*0.25}px solid transparent`,
                  borderLeft: `18px solid ${accent}`, opacity: 1 - i * 0.15, zIndex: 1 }} />
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }

    if (el.layout === 'hierarchy') {
      const nW = 100, nH = 36, cx = w/2;
      return (
        <div style={{ width: w, height: h, position: 'relative' }}>
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <rect x={cx-nW/2} y={8} width={nW} height={nH} rx={6} fill={accent}/>
            <text x={cx} y={8+nH/2+1} textAnchor="middle" dominantBaseline="middle" fontSize={13} fill="#fff" fontWeight="700">
              {items[0]}
            </text>
            {items.slice(1).map((item, i) => {
              const count = items.length - 1;
              const bx = w * (i+1) / (count+1), by = 8+nH+40;
              return (
                <g key={i}>
                  <line x1={cx} y1={8+nH} x2={bx} y2={by} stroke={`${accent}88`} strokeWidth={2}/>
                  <rect x={bx-nW/2} y={by} width={nW} height={nH} rx={6} fill={accent} opacity="0.75"/>
                  <text x={bx} y={by+nH/2+1} textAnchor="middle" dominantBaseline="middle" fontSize={12} fill="#fff" fontWeight="600">
                    {item}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      );
    }

    if (el.layout === 'cycle') {
      const cx = w/2, cy = h/2, r = Math.min(w,h)*0.32, br = 28;
      return (
        <div style={{ width: w, height: h, position: 'relative' }}>
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={`${accent}44`} strokeWidth={4} strokeDasharray="8 4"/>
            {items.map((item, i) => {
              const ang = (i * 2*Math.PI / items.length) - Math.PI/2;
              const bx = cx + r*Math.cos(ang), by = cy + r*Math.sin(ang);
              return (
                <g key={i}>
                  <circle cx={bx} cy={by} r={br} fill={accent} opacity={0.9 - i*0.15}/>
                  <text x={bx} y={by+1} textAnchor="middle" dominantBaseline="middle" fontSize={11} fill="#fff" fontWeight="700">
                    {item.slice(0,6)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      );
    }

    if (el.layout === 'venn') {
      const r = Math.min(w,h)*0.36;
      return (
        <div style={{ width: w, height: h }}>
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <circle cx={w*0.38} cy={h/2} r={r} fill={accent} opacity="0.45"/>
            <circle cx={w*0.62} cy={h/2} r={r} fill="#8b5cf6" opacity="0.45"/>
            <text x={w*0.28} y={h/2} textAnchor="middle" dominantBaseline="middle" fontSize={13} fill="#fff" fontWeight="700">{items[0]}</text>
            <text x={w*0.72} y={h/2} textAnchor="middle" dominantBaseline="middle" fontSize={13} fill="#fff" fontWeight="700">{items[1]||'B'}</text>
          </svg>
        </div>
      );
    }

    if (el.layout === 'pyramid') {
      const levels = items.length;
      return (
        <div style={{ width: w, height: h }}>
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            {items.map((item, i) => {
              const ratio = (i+1)/levels, prevR = i/levels;
              const x1 = w/2-(w/2)*ratio, x2 = w/2+(w/2)*ratio;
              const y1 = h*prevR, y2 = h*ratio;
              const x1p = w/2-(w/2)*prevR, x2p = w/2+(w/2)*prevR;
              const d = `M ${x1p} ${y1} L ${x2p} ${y1} L ${x2} ${y2} L ${x1} ${y2} Z`;
              return (
                <g key={i}>
                  <path d={d} fill={accent} opacity={0.4+i*0.18} stroke="#fff" strokeWidth={1}/>
                  <text x={w/2} y={(y1+y2)/2+1} textAnchor="middle" dominantBaseline="middle"
                    fontSize={12+i} fill="#fff" fontWeight="700">{item.slice(0,10)}</text>
                </g>
              );
            })}
          </svg>
        </div>
      );
    }

    // Default: List
    return (
      <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', gap: 8, padding: 12, boxSizing: 'border-box' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            flex: 1, background: accent, opacity: 1 - i*0.12, borderRadius: 6,
            display: 'flex', alignItems: 'center', padding: '0 14px',
            fontSize: 13, color: '#fff', fontWeight: 600, userSelect: 'none',
          }}>{item}</div>
        ))}
      </div>
    );
  }

  return null;
};

// ─── Resize Handle ────────────────────────────────────────────────────────────
const ResizeHandle = ({ position, onMouseDown }) => {
  const isCorner  = ['nw','ne','sw','se'].includes(position);
  const isSide    = ['n','s','e','w'].includes(position);
  const cursors   = { nw:'nw-resize', n:'n-resize', ne:'ne-resize', e:'e-resize', se:'se-resize', s:'s-resize', sw:'sw-resize', w:'w-resize' };

  const posStyle = {
    nw: { top: -5, left: -5 },
    n:  { top: -5, left: '50%', transform: 'translateX(-50%)' },
    ne: { top: -5, right: -5 },
    e:  { top: '50%', right: -5, transform: 'translateY(-50%)' },
    se: { bottom: -5, right: -5 },
    s:  { bottom: -5, left: '50%', transform: 'translateX(-50%)' },
    sw: { bottom: -5, left: -5 },
    w:  { top: '50%', left: -5, transform: 'translateY(-50%)' },
  };

  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: 'absolute',
        ...posStyle[position],
        width:  isCorner ? 10 : (position === 'n' || position === 's' ? 10 : 6),
        height: isCorner ? 10 : (position === 'e' || position === 'w' ? 10 : 6),
        background: '#2563eb',
        border: '2px solid #fff',
        borderRadius: isCorner ? 3 : 2,
        cursor: cursors[position],
        zIndex: 101,
      }}
    />
  );
};

// ─── Main ElementsLayer ───────────────────────────────────────────────────────
const ElementsLayer = () => {
  const {
    slides,
    activeSlideId,
    setSlides,
    setIsDirty,
    selectedElementId, setSelectedElementId,
    syncFormattingFromElement,
    applyFontSizeToElement,
    fontSize, handleFontSizeChange,
    selectedFont,
  } = useEditor();

  const [selectedId, setSelectedId] = useState(null);
  const [editingId,  setEditingId]  = useState(null);

  // ── ربط التحديد بالـ Context لتفعيل خصائص الـ Home ────────────────────────
  const selectElement = (id) => {
    setSelectedId(id);
    setSelectedElementId(id);
    if (id && syncFormattingFromElement) {
      const slide = slides.find(s => s.id === activeSlideId);
      const el = slide?.elements?.find(e => e.id === id);
      if (el) syncFormattingFromElement(el);
    }
  };

  const deselectElement = () => {
    setSelectedId(null);
    setSelectedElementId(null);
  };

  const currentSlide = slides.find(s => s.id === activeSlideId);
  const elements     = currentSlide?.elements || [];

  // ── update one element ───────────────────────────────────────────────────
  const updateEl = (id, updates) => {
    setSlides(prev => prev.map(slide => {
      if (slide.id !== activeSlideId) return slide;
      return {
        ...slide,
        elements: slide.elements.map(el => el.id === id ? { ...el, ...updates } : el)
      };
    }));
    if (setIsDirty) setIsDirty(true);
  };

  // ── delete element ───────────────────────────────────────────────────────
  const deleteEl = (id) => {
    setSlides(prev => prev.map(slide => {
      if (slide.id !== activeSlideId) return slide;
      return { ...slide, elements: slide.elements.filter(el => el.id !== id) };
    }));
    if (selectedId === id) setSelectedId(null);
    if (setIsDirty) setIsDirty(true);
  };

  // ── drag ─────────────────────────────────────────────────────────────────
  const startDrag = (e, el) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    // نحسب الـ scale من الـ slide canvas
    const canvas = document.querySelector('.slide-canvas-inner');
    const rect   = canvas?.getBoundingClientRect();
    const scale  = rect ? rect.width / 960 : 1;

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startElX    = el.x;
    const startElY    = el.y;

    const onMove = (ev) => {
      const dx = (ev.clientX - startMouseX) / scale;
      const dy = (ev.clientY - startMouseY) / scale;
      updateEl(el.id, { x: startElX + dx, y: startElY + dy });
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  // ── resize ────────────────────────────────────────────────────────────────
  const startResize = (e, el, handle) => {
    e.preventDefault();
    e.stopPropagation();

    const canvas = document.querySelector('.slide-canvas-inner');
    const rect   = canvas?.getBoundingClientRect();
    const scale  = rect ? rect.width / 960 : 1;

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const origX = el.x, origY = el.y;
    const origW = el.width  || 120;
    const origH = el.height || 120;

    const onMove = (ev) => {
      const dx = (ev.clientX - startMouseX) / scale;
      const dy = (ev.clientY - startMouseY) / scale;
      let nx = origX, ny = origY, nw = origW, nh = origH;

      if (handle.includes('e'))  nw = Math.max(40, origW + dx);
      if (handle.includes('s'))  nh = Math.max(40, origH + dy);
      if (handle.includes('w')) { nw = Math.max(40, origW - dx); nx = origX + (origW - nw); }
      if (handle.includes('n')) { nh = Math.max(40, origH - dy); ny = origY + (origH - nh); }

      updateEl(el.id, { x: nx, y: ny, width: nw, height: nh });
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  // ── rotate ────────────────────────────────────────────────────────────────
  const startRotate = (e, el) => {
    e.preventDefault();
    e.stopPropagation();

    const canvas = document.querySelector('.slide-canvas-inner');
    const rect   = canvas?.getBoundingClientRect();
    const scale  = rect ? rect.width / 960 : 1;

    const cx = rect.left + (el.x + (el.width||120)/2) * scale;
    const cy = rect.top  + (el.y + (el.height||120)/2) * scale;

    const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
    const origRot    = el.rotation || 0;

    const onMove = (ev) => {
      const curAngle = Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180 / Math.PI;
      updateEl(el.id, { rotation: (origRot + curAngle - startAngle + 360) % 360 });
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  // ── keyboard delete ───────────────────────────────────────────────────────
  React.useEffect(() => {
    const onKey = (e) => {
      // لو في textbox بيُكتب فيه، ما نتدخل
      if (editingId) return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        const active = document.activeElement;
        const isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.contentEditable === 'true');
        if (!isTyping) { e.preventDefault(); deleteEl(selectedId); }
      }
      if (e.key === 'Escape') { setEditingId(null); deselectElement(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, editingId]);

  // ── deselect on canvas click ──────────────────────────────────────────────
  React.useEffect(() => {
    const onCanvasClick = (e) => {
      if (!e.target.closest('[data-element-id]')) { deselectElement(); }
    };
    document.addEventListener('mousedown', onCanvasClick);
    return () => document.removeEventListener('mousedown', onCanvasClick);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none' }}>
      {elements.map(el => {
        const isSelected = selectedId === el.id;
        const w = el.width  || 120;
        const h = el.height || 120;
        const rotation = el.rotation || 0;
        const opacity  = (el.opacity ?? 100) / 100;

        return (
          <div
            key={el.id}
            data-element-id={el.id}
            style={{
              position: 'absolute',
              left: el.x, top: el.y,
              width: w, height: h,
              transform: rotation ? `rotate(${rotation}deg)` : undefined,
              opacity,
              pointerEvents: 'auto',
              cursor: 'move',
              // selection ring
              outline: isSelected ? '2px solid #2563eb' : '2px solid transparent',
              outlineOffset: 2,
              borderRadius: 2,
              // subtle hover
              transition: 'outline .1s',
              userSelect: 'none',
            }}
            onClick={(e) => { e.stopPropagation(); selectElement(el.id); }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (el.elementType === 'textbox') {
                setEditingId(el.id);
                selectElement(el.id);
              }
            }}
            onMouseDown={(e) => {
              // لا نبدأ drag لو الضغطة على أحد الـ handles
              if (e.target.closest('[data-handle]')) return;
              startDrag(e, el);
            }}
          >
        {/* ── Visual content ── */}
            {el.elementType === 'textbox' && editingId === el.id ? (
              /* ── Inline Textbox Editor ── */
              <div
                contentEditable
                suppressContentEditableWarning
                spellCheck={false}
                autoFocus
                style={{
                  width: '100%', minHeight: h,
                  fontSize: el.fontSize || 18,
                  fontWeight: el.bold ? 700 : 400,
                  textAlign: el.align || 'left',
                  color: el.color || '#1e293b',
                  lineHeight: 1.4,
                  padding: '8px 12px',
                  border: '2px solid #2563eb',
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.95)',
                  boxSizing: 'border-box',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  outline: 'none',
                  cursor: 'text',
                  userSelect: 'text',
                  pointerEvents: 'auto',
                }}
                onMouseDown={e => e.stopPropagation()}
                onClick={e => e.stopPropagation()}
                onBlur={e => {
                  const newText = e.currentTarget.innerText;
                  updateEl(el.id, { text: newText });
                  setEditingId(null);
                }}
                onKeyDown={e => {
                  // Escape = إنهاء التحرير
                  if (e.key === 'Escape') {
                    e.currentTarget.blur();
                  }
                  e.stopPropagation();
                }}
              >
                {el.text || ''}
              </div>
            ) : (
              <div style={{
                width: '100%', height: '100%',
                // الفيديو والأوديو يحتاجان pointerEvents للتحكم بالـ controls
                pointerEvents: (el.elementType === 'video' || el.elementType === 'audio') ? 'auto' : 'none'
              }}
                onMouseDown={e => {
                  // نمنع الـ drag لما المستخدم يتفاعل مع controls الميديا
                  if (el.elementType === 'video' || el.elementType === 'audio') {
                    e.stopPropagation();
                  }
                }}
              >
                <ElementVisual el={el} />
              </div>
            )}

            {/* ── Controls (only when selected) ── */}
            {isSelected && (
              <>
                {/* Resize handles - 8 اتجاهات */}
                {['nw','n','ne','e','se','s','sw','w'].map(handle => (
                  <div key={handle} data-handle={handle}>
                    <ResizeHandle
                      position={handle}
                      onMouseDown={(e) => startResize(e, el, handle)}
                    />
                  </div>
                ))}

                {/* Rotate handle */}
                <div
                  data-handle="rotate"
                  onMouseDown={(e) => startRotate(e, el)}
                  title="Rotate"
                  style={{
                    position: 'absolute',
                    top: -34,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 22,
                    height: 22,
                    background: '#2563eb',
                    border: '2px solid #fff',
                    borderRadius: '50%',
                    cursor: 'grab',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 900,
                    zIndex: 102,
                    boxShadow: '0 2px 6px rgba(37,99,235,0.4)',
                    userSelect: 'none',
                  }}
                >
                  ↻
                </div>

                {/* Rotation line */}
                <div style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 1,
                  height: 12,
                  background: '#2563ebaa',
                  zIndex: 100,
                }} />

                {/* Delete button */}
                <button
                  data-handle="delete"
                  onClick={(e) => { e.stopPropagation(); deleteEl(el.id); }}
                  title="Delete"
                  style={{
                    position: 'absolute',
                    top: -12,
                    right: -12,
                    width: 22,
                    height: 22,
                    background: '#ef4444',
                    color: '#fff',
                    border: '2px solid #fff',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 900,
                    lineHeight: 1,
                    zIndex: 102,
                    boxShadow: '0 2px 6px rgba(239,68,68,0.4)',
                    padding: 0,
                  }}
                >
                  ×
                </button>

                {/* Info bar: أبعاد + زاوية */}
                <div style={{
                  position: 'absolute',
                  bottom: -28,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#1e293bcc',
                  color: '#fff',
                  fontSize: 10,
                  padding: '2px 8px',
                  borderRadius: 10,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 100,
                  letterSpacing: '0.3px',
                }}>
                  {el.elementType === 'textbox'
                    ? `Double-click to edit  •  ${Math.round(w)} × ${Math.round(h)}`
                    : `${Math.round(w)} × ${Math.round(h)}${rotation ? `  ${Math.round(rotation)}°` : ''}`
                  }
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ElementsLayer;
