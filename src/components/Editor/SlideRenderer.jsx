// src/components/Editor/SlideRenderer.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useEditor } from './EditorContext';
import { LAYOUT_TYPES } from './EditorConstants';
import ThemeManager from '../../templates/ThemeManager';
import { Cloud, MessageSquare, CheckCircle2, XCircle } from 'lucide-react';

// ─── Thumbnail Element (preview only - no interaction) ───────────────────────
const ThumbnailElement = ({ el }) => {
  const x = el.x || 0, y = el.y || 0;
  const w = el.width || 80, h = el.height || 80;
  const opacity = (el.opacity ?? 100) / 100;
  const base = {
    position: 'absolute', left: x, top: y, width: w, height: h,
    opacity, pointerEvents: 'none', userSelect: 'none', overflow: 'hidden',
    transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
  };
  const fill = el.fill || '#6366f1';

  if (el.elementType === 'shape') {
    if (el.shapeType === 'circle')   return <div style={{ ...base, borderRadius: '50%', background: fill }} />;
    if (el.shapeType === 'triangle') return <div style={{ ...base, background: 'none', width: 0, height: 0, borderLeft: `${w/2}px solid transparent`, borderRight: `${w/2}px solid transparent`, borderBottom: `${h}px solid ${fill}` }} />;
    if (el.shapeType === 'diamond')  return <div style={{ ...base, background: fill, transform: 'rotate(45deg)', borderRadius: 2 }} />;
    return <div style={{ ...base, background: fill, borderRadius: el.shapeType === 'rounded-rect' ? 8 : 3 }} />;
  }
  if (el.elementType === 'icon')
    return <div style={{ ...base, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.max(10, Math.min(w,h) * 0.65) }}>{el.emoji}</div>;
  if (el.elementType === 'textbox')
    return <div style={{ ...base, fontSize: Math.max(5,(el.fontSize||18)*0.32), fontWeight: el.bold?700:400, color: el.color||'#1e293b', padding: '2px 4px', lineHeight: 1.3, wordBreak: 'break-word' }}>{el.text}</div>;
  if (el.elementType === 'wordart')
    return <div style={{ ...base, display:'flex', alignItems:'center', justifyContent:'center', fontSize: Math.max(8,(el.fontSize||52)*0.25), fontWeight:900, fontFamily:'Georgia,serif', color:'#6366f1' }}>{el.text}</div>;
  if (el.elementType === 'equation')
    return <div style={{ ...base, fontSize: Math.max(5,(el.fontSize||28)*0.32), fontStyle:'italic', fontFamily:'Georgia,serif', color: el.color||'#1e293b', display:'flex', alignItems:'center' }}>{el.equation}</div>;
  if (el.elementType === 'symbol')
    return <div style={{ ...base, fontSize: Math.max(8,(el.fontSize||52)*0.28), display:'flex', alignItems:'center', justifyContent:'center', color: el.color||'#1e293b', fontFamily:'serif' }}>{el.symbol}</div>;
  if (el.elementType === 'link')
    return <div style={{ ...base, fontSize:6, color:'#2563eb', textDecoration:'underline', whiteSpace:'nowrap', textOverflow:'ellipsis' }}>{el.label||el.url}</div>;
  if (el.elementType === 'video')
    return <div style={{ ...base, background:'#0f172a', borderRadius:3, display:'flex', alignItems:'center', justifyContent:'center' }}><div style={{ width:0, height:0, borderTop:'6px solid transparent', borderBottom:'6px solid transparent', borderLeft:'10px solid #fff' }}/></div>;
  if (el.elementType === 'audio')
    return <div style={{ ...base, background:'#3b82f6', borderRadius:20, display:'flex', alignItems:'center', justifyContent:'center', gap:1, padding:'0 4px' }}>{[3,5,3,4,2].map((bh,i)=><div key={i} style={{ width:2, height:bh, background:'#fff', borderRadius:1 }}/>)}</div>;
  if (el.elementType === 'chart')
    return <div style={{ ...base, background:'#fff', border:'1px solid #e2e8f0', borderRadius:3, display:'flex', alignItems:'flex-end', gap:2, padding:3 }}>{(el.data?.values||[40,65,55,80]).map((v,i)=><div key={i} style={{ flex:1, height:`${(v/100)*70}%`, background:'#059669', borderRadius:1 }}/>)}</div>;
  if (el.elementType === 'smartart') return <div style={{ ...base, background:'#6366f155', borderRadius:4 }}/>;
  if (el.elementType === 'slidenumber') return <div style={{ ...base, fontSize:6, color:'#64748b' }}>#</div>;
  return null;
};

// ─── Styles object ────────────────────────────────────────────────────────────
const QS = {
  wrapper: (isThumbnail) => ({
    position: 'absolute', inset: 0, zIndex: 5,
    display: 'flex', flexDirection: 'column',
    padding: isThumbnail ? '8px 10px' : '24px 32px',
    gap: isThumbnail ? '6px' : '16px',
    boxSizing: 'border-box',
  }),
};

// ─── Component ────────────────────────────────────────────────────────────────
const SlideRenderer = ({ slide, onAnswerSelected, isThumbnail = false }) => {
  const {
    setSlides, slides, activeSlideId,
    selectedField, setSelectedField,
    selectedFont, currentTheme,
    animations, clipboard, setIsDirty,
  } = useEditor();

  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult]         = useState(false);
  const [pointsEarned, setPointsEarned]     = useState(0);

  useEffect(() => {
    if (!isThumbnail) {
      setSelectedOption(null);
      setShowResult(false);
      setPointsEarned(0);
    }
  }, [slide?.id, isThumbnail]);

  if (!slide) return null;

  const liveSlide = isThumbnail
    ? slide
    : (slides.find(s => s.id === slide.id) || slide);

  const themeId      = currentTheme ?? 0;
  const questionData = liveSlide.questionData || {};
  const appearance   = questionData.appearance || {
    accentColor: '#f59e0b', showLetters: true,
    fontSize: 'medium', cardStyle: 'curved', layoutMode: 'grid',
  };
  const accentColor       = appearance.accentColor || '#f59e0b';
  const options           = questionData.options    || [];
  const correctAnswer     = questionData.correctAnswer;
  const pointsPerQuestion = questionData.points     || 10;

  const handleFieldBlur = useCallback((field, newText) => {
    if (isThumbnail) return;
    setSlides(prev => prev.map(s => s.id === liveSlide.id ? { ...s, [field]: newText } : s));
    if (setIsDirty) setIsDirty(true);
  }, [isThumbnail, liveSlide.id, setSlides, setIsDirty]);

  const renderBoxLocal = useCallback((field, placeholder, className = '', extraStyle = {}) => {
    const content    = liveSlide[field]            || '';
    const fieldStyle = liveSlide[`${field}Style`] || {};
    const isActive   = !isThumbnail && selectedField === field;
    const elementId  = `element-${liveSlide.id}-${field}`;
    const defaultSize = isThumbnail
      ? (field === 'title' ? '13px' : '9px')
      : (field === 'title' ? '36px' : '18px');

    return (
      <div
        id={elementId}
        key={`${liveSlide.id}-${field}`}
        className={`editable-box ${className} ${isActive ? 'active-editing' : ''} ${isThumbnail ? 'thumbnail-box' : ''}`}
        contentEditable={!isThumbnail}
        suppressContentEditableWarning
        spellCheck="false"
        data-placeholder={isThumbnail ? '' : placeholder}
        data-has-content={content.trim() !== ''}
        style={{
          fontFamily:     fieldStyle.fontFamily    || selectedFont || 'Calibri, sans-serif',
          fontSize:       fieldStyle.fontSize      ? `${fieldStyle.fontSize}px` : defaultSize,
          color:          fieldStyle.color         || '#1e293b',
          fontWeight:     fieldStyle.fontWeight    || (field === 'title' ? '700' : '400'),
          fontStyle:      fieldStyle.fontStyle     || 'normal',
          textDecoration: fieldStyle.textDecoration|| 'none',
          textAlign:      fieldStyle.textAlign     || (field === 'title' ? 'center' : 'left'),
          lineHeight:     fieldStyle.lineHeight    || '1.4',
          pointerEvents:  isThumbnail ? 'none' : 'auto',
          width:          '100%',
          minHeight:      isThumbnail ? 'auto' : '40px',
          padding:        isThumbnail ? '1px 4px' : '6px 10px',
          border:         isThumbnail ? 'none' : (isActive ? `1px dashed ${accentColor}88` : '1px dashed transparent'),
          borderRadius:   '4px',
          outline:        'none',
          cursor:         isThumbnail ? 'default' : 'text',
          wordBreak:      'break-word',
          userSelect:     isThumbnail ? 'none' : 'text',
          boxSizing:      'border-box',
          ...extraStyle,
        }}
        onFocus={() => { if (!isThumbnail) setSelectedField(field); }}
        onBlur={(e) => {
          if (!isThumbnail) {
            const t = e.target.innerText;
            if (t !== content) handleFieldBlur(field, t);
          }
        }}
        onKeyDown={(e) => {
          if (!isThumbnail && e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); e.target.blur();
          }
        }}
        onClick={(e) => {
          if (!isThumbnail) {
            if (clipboard?.isPainterActive) clipboard.applyFormat(e);
            e.stopPropagation();
          }
        }}
      >
        {content}
      </div>
    );
  }, [liveSlide, isThumbnail, selectedField, selectedFont, accentColor, clipboard, handleFieldBlur, setSelectedField]);

  const handleOptionClick = (idx) => {
    if (isThumbnail || showResult) return;
    setSelectedOption(idx);
    const isCorrect = idx === correctAnswer;
    if (isCorrect) setPointsEarned(pointsPerQuestion);
    setShowResult(true);
    if (onAnswerSelected) onAnswerSelected({ option: idx, isCorrect, points: isCorrect ? pointsPerQuestion : 0 });
  };

  const getCustomBackground = () => {
    if (!liveSlide.background) return {};
    const { type, value, transparency } = liveSlide.background;
    return {
      background: type === 'image' ? `url(${value}) center/cover no-repeat` : value,
      opacity: transparency ? transparency / 100 : 1,
    };
  };

  const renderImages = () => liveSlide.images?.map(img => (
    <img key={img.id} src={img.src} alt="" style={{
      position: 'absolute',
      left: `${img.x}px`, top: `${img.y}px`,
      width: `${img.width}px`,
      height: img.height === 'auto' ? 'auto' : `${img.height}px`,
      transform: `rotate(${img.rotation || 0}deg)`,
      opacity: (img.opacity || 100) / 100,
      filter: `brightness(${img.filters?.brightness || 100}%) contrast(${img.filters?.contrast || 100}%)`,
      pointerEvents: 'none', maxWidth: 'none', userSelect: 'none',
    }} />
  ));

  const renderTables = () => liveSlide.tables?.map(table => (
    <table key={table.id} style={{
      position: 'absolute',
      left: `${table.x}px`, top: `${table.y}px`,
      width: `${table.width}px`, height: `${table.height}px`,
      borderCollapse: 'collapse',
      border: `1px solid ${table.style?.borderColor || '#ccc'}`,
      backgroundColor: table.style?.fill || '#fff',
      pointerEvents: 'none',
      fontSize: isThumbnail ? '7px' : '12px',
    }}>
      <tbody>
        {[...Array(table.rows || 2)].map((_, r) => (
          <tr key={r}>
            {[...Array(table.cols || 2)].map((_, c) => (
              <td key={c} style={{
                border: `1px solid ${table.style?.borderColor || '#ccc'}`,
                padding: isThumbnail ? '1px' : '4px',
                textAlign: 'center',
              }}>
                {table.data?.[`${r}-${c}`] || ''}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ));

  const P = isThumbnail ? '12px' : '48px';
  const G = isThumbnail ? '8px'  : '24px';

  // ── QUESTION layout ────────────────────────────────────────────────────────
  const renderQuestionLayout = () => {
    const qType      = liveSlide.questionType;
    const layoutMode = appearance.layoutMode || 'grid';
    const cardStyle  = appearance.cardStyle  || 'curved';
    const isTF       = qType === 'true-false';
    const hasChoices = ['multiple-choice', 'quiz', 'true-false'].includes(qType);
    const visibleOptions = isThumbnail ? options.slice(0, 4) : options;
    const cardRadius =
      cardStyle === 'sharp'   ? '4px' :
      cardStyle === 'rounded' ? (isThumbnail ? '20px' : '40px') :
      (isThumbnail ? '6px' : '12px');

    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: isThumbnail ? '8px 10px' : '32px 40px',
        gap: isThumbnail ? '6px' : '20px',
        boxSizing: 'border-box',
      }}>
        <div style={{ width: '100%', flexShrink: 0 }}>
          {renderBoxLocal('title', 'Enter your question here...', 'q-main-title', {
            fontSize: liveSlide.titleStyle?.fontSize ? `${liveSlide.titleStyle.fontSize}px` : (isThumbnail ? '11px' : '26px'),
            fontWeight: '700', textAlign: 'center', lineHeight: '1.3', width: '100%', minHeight: 'unset',
          })}
        </div>

        {hasChoices && visibleOptions.length > 0 && (
          <div style={{
            width: '100%',
            maxWidth: isThumbnail ? '100%' : (layoutMode === 'list' ? '600px' : '820px'),
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: layoutMode === 'list' ? '1fr' : 'repeat(2, 1fr)',
            gap: isThumbnail ? '5px' : '12px',
          }}>
            {visibleOptions.map((opt, i) => {
              const isOk  = correctAnswer === i;
              const isSel = selectedOption === i;
              let bg = '#ffffff', borderColor = `${accentColor}55`;
              if (isTF) { bg = i===0?'#f0fdf4':'#fef2f2'; borderColor = i===0?'#10b981':'#ef4444'; }
              else if (isSel && showResult) { bg = isOk?'#f0fdf4':'#fef2f2'; borderColor = isOk?'#10b981':'#ef4444'; }
              return (
                <div key={`${liveSlide.id}-opt-${i}`} onClick={() => handleOptionClick(i)} style={{
                  display: 'flex', alignItems: 'center', gap: isThumbnail?'5px':'12px',
                  padding: isThumbnail?'5px 8px':'13px 16px',
                  background: bg, border: `2px solid ${borderColor}`, borderRadius: cardRadius,
                  cursor: isThumbnail?'default':'pointer', transition: 'all 0.18s',
                  boxShadow: isThumbnail?'none':'0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden',
                }}>
                  {appearance.showLetters !== false && (
                    <div style={{
                      width: isThumbnail?'16px':'28px', height: isThumbnail?'16px':'28px',
                      borderRadius: '50%', background: isTF?(i===0?'#10b981':'#ef4444'):accentColor,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      flexShrink:0, color:'#fff', fontSize:isThumbnail?'8px':'13px', fontWeight:'700',
                    }}>
                      {isTF
                        ? (i===0 ? <CheckCircle2 size={isThumbnail?9:15} color="white"/> : <XCircle size={isThumbnail?9:15} color="white"/>)
                        : String.fromCharCode(65+i)}
                    </div>
                  )}
                  <div style={{
                    flex:1, fontSize:isThumbnail?'9px':'15px',
                    fontWeight:isTF?'700':'500',
                    color:isTF?(i===0?'#059669':'#dc2626'):'#1e293b',
                    overflow:'hidden', whiteSpace:isThumbnail?'nowrap':'normal',
                    textOverflow:'ellipsis', lineHeight:1.3,
                  }}>
                    {isThumbnail && opt.length>18 ? opt.substring(0,16)+'…' : opt}
                  </div>
                  {!isThumbnail && isSel && showResult && (
                    <div style={{ marginLeft:'auto', fontSize:'13px', fontWeight:'700', color:isOk?'#059669':'#dc2626' }}>
                      {isOk ? `+${pointsEarned}pts` : '✗'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {qType==='word-cloud' && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', opacity:0.35 }}>
            <Cloud size={isThumbnail?22:70} color={accentColor}/>
          </div>
        )}

        {qType==='open-ended' && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:isThumbnail?'4px':'12px', opacity:0.4 }}>
            <MessageSquare size={isThumbnail?22:60} color={accentColor}/>
            {!isThumbnail && (
              <div style={{ width:'70%', height:'48px', background:'#f1f5f9', borderRadius:'8px', border:`2px dashed ${accentColor}44` }}/>
            )}
          </div>
        )}
      </div>
    );
  };

  // ── layout selector ────────────────────────────────────────────────────────
  const renderLayout = () => {
    switch (liveSlide.layout) {
      case LAYOUT_TYPES.TITLE_SLIDE:
        return (
          <div style={{ position:'absolute', inset:0, zIndex:5, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:P, gap:isThumbnail?'4px':'14px' }}>
            {renderBoxLocal('title','Click to add title','',{ fontSize:liveSlide.titleStyle?.fontSize?`${liveSlide.titleStyle.fontSize}px`:(isThumbnail?'16px':'48px'), fontWeight:'700', textAlign:'center', lineHeight:'1.2' })}
            {renderBoxLocal('subtitle','Click to add subtitle','',{ fontSize:liveSlide.subtitleStyle?.fontSize?`${liveSlide.subtitleStyle.fontSize}px`:(isThumbnail?'9px':'22px'), fontWeight:'400', textAlign:'center', opacity:0.8 })}
          </div>
        );
      case LAYOUT_TYPES.SECTION_HEADER:
        return (
          <div style={{ position:'absolute', inset:0, zIndex:5, display:'flex', flexDirection:'column', alignItems:'flex-start', justifyContent:'center', padding:P }}>
            {renderBoxLocal('title','Section title','section-header-title',{ fontSize:liveSlide.titleStyle?.fontSize?`${liveSlide.titleStyle.fontSize}px`:(isThumbnail?'15px':'38px'), fontWeight:'700' })}
          </div>
        );
      case LAYOUT_TYPES.TITLE_AND_CONTENT:
        return (
          <div style={{ position:'absolute', inset:0, zIndex:5, display:'flex', flexDirection:'column', padding:P, gap:G }}>
            {renderBoxLocal('title','Click to add title','content-title',{ fontSize:liveSlide.titleStyle?.fontSize?`${liveSlide.titleStyle.fontSize}px`:(isThumbnail?'13px':'30px'), fontWeight:'700' })}
            <div style={{ flex:1, overflow:'hidden' }}>
              {renderBoxLocal('content','Click to add text','content-body',{ height:'100%', fontSize:liveSlide.contentStyle?.fontSize?`${liveSlide.contentStyle.fontSize}px`:(isThumbnail?'9px':'17px'), textAlign:'left', padding:isThumbnail?'4px 6px':'14px 18px' })}
            </div>
          </div>
        );
      case LAYOUT_TYPES.TWO_CONTENT:
        return (
          <div style={{ position:'absolute', inset:0, zIndex:5, display:'flex', flexDirection:'column', padding:P, gap:G }}>
            {renderBoxLocal('title','Click to add title','two-column-title',{ fontSize:liveSlide.titleStyle?.fontSize?`${liveSlide.titleStyle.fontSize}px`:(isThumbnail?'13px':'28px'), fontWeight:'700', textAlign:'center' })}
            <div style={{ display:'flex', flex:1, gap:isThumbnail?'6px':'24px' }}>
              <div style={{ flex:1 }}>{renderBoxLocal('leftContent','Click to add text','column-left',{ flex:1, fontSize:liveSlide.contentStyle?.fontSize?`${liveSlide.contentStyle.fontSize}px`:(isThumbnail?'8px':'16px'), textAlign:'left' })}</div>
              <div style={{ width:'1px', background:'#e2e8f0', flexShrink:0 }}/>
              <div style={{ flex:1 }}>{renderBoxLocal('rightContent','Click to add text','column-right',{ flex:1, fontSize:liveSlide.contentStyle?.fontSize?`${liveSlide.contentStyle.fontSize}px`:(isThumbnail?'8px':'16px'), textAlign:'left' })}</div>
            </div>
          </div>
        );
      case LAYOUT_TYPES.COMPARISON:
        return (
          <div style={{ position:'absolute', inset:0, zIndex:5, display:'flex', flexDirection:'column', padding:P, gap:G }}>
            {renderBoxLocal('title','Click to add title','comparison-title',{ fontSize:liveSlide.titleStyle?.fontSize?`${liveSlide.titleStyle.fontSize}px`:(isThumbnail?'13px':'28px'), fontWeight:'700', textAlign:'center' })}
            <div style={{ display:'flex', flex:1, gap:isThumbnail?'6px':'24px' }}>
              <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
                <div style={{ fontSize:isThumbnail?'8px':'16px', fontWeight:'600', color:'#4f46e5', marginBottom:isThumbnail?'3px':'10px', borderBottom:'2px solid #4f46e5', paddingBottom:isThumbnail?'2px':'6px' }}>
                  {isThumbnail?'أ':'المقارنة الأولى'}
                </div>
                {renderBoxLocal('leftContent','نص المقارنة','comparison-content',{ flex:1, fontSize:isThumbnail?'8px':'15px', textAlign:'right' })}
              </div>
              <div style={{ width:'1px', background:'#e2e8f0', flexShrink:0 }}/>
              <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
                <div style={{ fontSize:isThumbnail?'8px':'16px', fontWeight:'600', color:accentColor, marginBottom:isThumbnail?'3px':'10px', borderBottom:`2px solid ${accentColor}`, paddingBottom:isThumbnail?'2px':'6px' }}>
                  {isThumbnail?'ب':'المقارنة الثانية'}
                </div>
                {renderBoxLocal('rightContent','نص المقارنة','comparison-content',{ flex:1, fontSize:isThumbnail?'8px':'15px', textAlign:'right' })}
              </div>
            </div>
          </div>
        );
      case 'QUESTION':
        return renderQuestionLayout();
      default:
        return <div style={{ position:'absolute', inset:0, zIndex:5 }}/>;
    }
  };

  // ── slide surface ──────────────────────────────────────────────────────────
  return (
    <div
      className={`powerpoint-slide-surface${isThumbnail?' is-thumbnail':''}`}
      style={{
        width: '960px', height: '540px',
        position: 'relative', overflow: 'hidden',
        ...(liveSlide.background ? getCustomBackground() : {}),
      }}
    >
      <ThemeManager themeId={themeId} />
      {renderLayout()}

      {!!liveSlide.images?.length && (
        <div style={{ position:'absolute', inset:0, zIndex:20, pointerEvents:'none' }}>
          {renderImages()}
        </div>
      )}

      {!!liveSlide.tables?.length && (
        <div style={{ position:'absolute', inset:0, zIndex:25, pointerEvents:'none' }}>
          {renderTables()}
        </div>
      )}

      {/* العناصر في الـ thumbnail فقط — الـ canvas الحقيقي يستخدم ElementsLayer */}
      {isThumbnail && liveSlide.elements?.length > 0 && (
        <div style={{ position:'absolute', inset:0, zIndex:30, pointerEvents:'none' }}>
          {liveSlide.elements.map(el => (
            <ThumbnailElement key={el.id} el={el} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SlideRenderer;
