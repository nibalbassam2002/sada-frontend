// src/components/Editor/SlideRenderer.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useEditor } from './EditorContext';
import { LAYOUT_TYPES } from './EditorConstants';
import ThemeManager from '../../templates/ThemeManager'; // ثيماتك الأصلية
import {
  Cloud, MessageSquare, CheckCircle2, Circle, XCircle, Zap
} from 'lucide-react';

const SlideRenderer = ({ slide, onAnswerSelected, isThumbnail = false }) => {
  const {
    setSlides, slides, activeSlideId,
    selectedField, setSelectedField,
    selectedFont, currentTheme,
    animations, clipboard, setIsDirty,
  } = useEditor();

  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult,     setShowResult]     = useState(false);
  const [pointsEarned,   setPointsEarned]   = useState(0);

  useEffect(() => {
    if (!isThumbnail) {
      setSelectedOption(null);
      setShowResult(false);
      setPointsEarned(0);
    }
  }, [slide?.id, isThumbnail]);

  if (!slide) return null;

  // بيانات الشريحة الحية
  const liveSlide = isThumbnail
    ? slide
    : (slides.find(s => s.id === slide.id) || slide);

  const themeId = currentTheme ?? 0;

  // بيانات السؤال
  const questionData      = liveSlide.questionData || {};
  const appearance        = questionData.appearance || {
    accentColor: '#f59e0b', showLetters: true,
    fontSize: 'medium', cardStyle: 'curved'
  };
  const accentColor       = appearance.accentColor || '#f59e0b';
  const options           = questionData.options    || [];
  const correctAnswer     = questionData.correctAnswer;
  const pointsPerQuestion = questionData.points     || 10;

  // ── حفظ عند blur ─────────────────────────────────
  const handleFieldBlur = useCallback((field, newText) => {
    if (isThumbnail) return;
    setSlides(prev =>
      prev.map(s => s.id === liveSlide.id ? { ...s, [field]: newText } : s)
    );
    if (setIsDirty) setIsDirty(true);
  }, [isThumbnail, liveSlide.id, setSlides, setIsDirty]);

  // ── renderBox المحلي ──────────────────────────────
  const renderBoxLocal = useCallback((field, placeholder, className = '', extraStyle = {}) => {
    const content    = liveSlide[field]             || '';
    const fieldStyle = liveSlide[`${field}Style`]  || {};
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
          fontSize:       fieldStyle.fontSize       ? `${fieldStyle.fontSize}px` : defaultSize,
          color:          fieldStyle.color          || '#1e293b',
          fontWeight:     fieldStyle.fontWeight     || (field === 'title' ? '700' : '400'),
          fontStyle:      fieldStyle.fontStyle      || 'normal',
          textDecoration: fieldStyle.textDecoration || 'none',
          textAlign:      fieldStyle.textAlign      || (field === 'title' ? 'center' : 'left'),
          lineHeight:     fieldStyle.lineHeight     || '1.4',
          marginTop:      fieldStyle.marginTop,
          marginBottom:   fieldStyle.marginBottom,
          pointerEvents:  isThumbnail ? 'none' : 'auto',
          width:          '100%',
          minHeight:      isThumbnail ? 'auto' : '40px',
          padding:        isThumbnail ? '1px 4px' : '6px 10px',
          border:         isThumbnail
            ? 'none'
            : (isActive ? `1px dashed ${accentColor}88` : '1px dashed transparent'),
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

  // ── اختيار الإجابة ────────────────────────────────
  const handleOptionClick = (idx) => {
    if (isThumbnail || showResult) return;
    setSelectedOption(idx);
    const isCorrect = idx === correctAnswer;
    if (isCorrect) setPointsEarned(pointsPerQuestion);
    setShowResult(true);
    if (onAnswerSelected) {
      onAnswerSelected({ option: idx, isCorrect, points: isCorrect ? pointsPerQuestion : 0 });
    }
  };

  // ── خلفية مخصصة (لو المستخدم غيّر الخلفية يدوياً) ─
  const getCustomBackground = () => {
    if (!liveSlide.background) return {};
    const { type, value, transparency } = liveSlide.background;
    return {
      background: type === 'image' ? `url(${value}) center/cover no-repeat` : value,
      opacity: transparency ? transparency / 100 : 1,
    };
  };

  // ── الصور ─────────────────────────────────────────
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

  // ── الجداول ───────────────────────────────────────
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

  // ── padding و gap ─────────────────────────────────
  const P = isThumbnail ? '12px' : '48px';
  const G = isThumbnail ? '8px'  : '24px';

  // ── التخطيطات — كلها بـ zIndex: 5 فوق ThemeManager ─
  const renderLayout = () => {
    switch (liveSlide.layout) {

      // ══ TITLE SLIDE ══
      case LAYOUT_TYPES.TITLE_SLIDE:
        return (
          <div style={{
            position: 'absolute', inset: 0,
            zIndex: 5,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: P, gap: isThumbnail ? '4px' : '14px',
          }}>
            {renderBoxLocal('title', 'Click to add title', '', {
              fontSize: liveSlide.titleStyle?.fontSize
                ? `${liveSlide.titleStyle.fontSize}px`
                : (isThumbnail ? '16px' : '48px'),
              fontWeight: '700', textAlign: 'center', lineHeight: '1.2',
              borderBottom: 'none',      // ✅ إلغاء أي خط سفلي من CSS خارجي
              textDecoration: 'none',
              paddingBottom: '0',
            })}
            {renderBoxLocal('subtitle', 'Click to add subtitle', '', {
              fontSize: liveSlide.subtitleStyle?.fontSize
                ? `${liveSlide.subtitleStyle.fontSize}px`
                : (isThumbnail ? '9px' : '22px'),
              fontWeight: '400', textAlign: 'center', opacity: 0.8,
              borderBottom: 'none',
            })}
          </div>
        );

      // ══ SECTION HEADER ══
      case LAYOUT_TYPES.SECTION_HEADER:
        return (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5,
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-start', justifyContent: 'center',
            padding: P,
          }}>
            {renderBoxLocal('title', 'Section title', 'section-header-title', {
              fontSize: liveSlide.titleStyle?.fontSize
                ? `${liveSlide.titleStyle.fontSize}px`
                : (isThumbnail ? '15px' : '38px'),
              fontWeight: '700',
              borderBottom: 'none',
            })}
          </div>
        );

      // ══ TITLE AND CONTENT ══
      case LAYOUT_TYPES.TITLE_AND_CONTENT:
        return (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5,
            display: 'flex', flexDirection: 'column',
            padding: P, gap: G,
          }}>
            {renderBoxLocal('title', 'Click to add title', 'content-title', {
              fontSize: liveSlide.titleStyle?.fontSize
                ? `${liveSlide.titleStyle.fontSize}px`
                : (isThumbnail ? '13px' : '30px'),
              fontWeight: '700',
              borderBottom: 'none',
            })}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              {renderBoxLocal('content', 'Click to add text', 'content-body', {
                height: '100%',
                fontSize: liveSlide.contentStyle?.fontSize
                  ? `${liveSlide.contentStyle.fontSize}px`
                  : (isThumbnail ? '9px' : '17px'),
                textAlign: 'left',
                padding: isThumbnail ? '4px 6px' : '14px 18px',
              })}
            </div>
          </div>
        );

      // ══ TWO CONTENT ══
      case LAYOUT_TYPES.TWO_CONTENT:
        return (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5,
            display: 'flex', flexDirection: 'column',
            padding: P, gap: G,
          }}>
            {renderBoxLocal('title', 'Click to add title', 'two-column-title', {
              fontSize: liveSlide.titleStyle?.fontSize
                ? `${liveSlide.titleStyle.fontSize}px`
                : (isThumbnail ? '13px' : '28px'),
              fontWeight: '700', textAlign: 'center',
              borderBottom: 'none',
            })}
            <div style={{ display: 'flex', flex: 1, gap: isThumbnail ? '6px' : '24px' }}>
              {/* العمود الأيسر */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {renderBoxLocal('leftContent', 'Click to add text', 'column-left', {
                  flex: 1,
                  fontSize: liveSlide.contentStyle?.fontSize
                    ? `${liveSlide.contentStyle.fontSize}px`
                    : (isThumbnail ? '8px' : '16px'),
                  textAlign: 'left',
                })}
              </div>
              {/* فاصل عمودي بسيط */}
              <div style={{
                width: isThumbnail ? '1px' : '1px',
                background: '#e2e8f0',
                flexShrink: 0,
              }} />
              {/* العمود الأيمن */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {renderBoxLocal('rightContent', 'Click to add text', 'column-right', {
                  flex: 1,
                  fontSize: liveSlide.contentStyle?.fontSize
                    ? `${liveSlide.contentStyle.fontSize}px`
                    : (isThumbnail ? '8px' : '16px'),
                  textAlign: 'left',
                })}
              </div>
            </div>
          </div>
        );

      // ══ COMPARISON ══
      case LAYOUT_TYPES.COMPARISON:
        return (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5,
            display: 'flex', flexDirection: 'column',
            padding: P, gap: G,
          }}>
            {renderBoxLocal('title', 'Click to add title', 'comparison-title', {
              fontSize: liveSlide.titleStyle?.fontSize
                ? `${liveSlide.titleStyle.fontSize}px`
                : (isThumbnail ? '13px' : '28px'),
              fontWeight: '700', textAlign: 'center',
              borderBottom: 'none',
            })}
            <div style={{ display: 'flex', flex: 1, gap: isThumbnail ? '6px' : '24px' }}>
              {/* الجانب الأول */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontSize: isThumbnail ? '8px' : '16px', fontWeight: '600',
                  color: '#4f46e5', marginBottom: isThumbnail ? '3px' : '10px',
                  borderBottom: `2px solid #4f46e5`,
                  paddingBottom: isThumbnail ? '2px' : '6px',
                }}>
                  {isThumbnail ? 'أ' : 'المقارنة الأولى'}
                </div>
                {renderBoxLocal('leftContent', 'نص المقارنة', 'comparison-content', {
                  flex: 1,
                  fontSize: isThumbnail ? '8px' : '15px',
                  textAlign: 'right',
                })}
              </div>
              {/* فاصل */}
              <div style={{ width: '1px', background: '#e2e8f0', flexShrink: 0 }} />
              {/* الجانب الثاني */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontSize: isThumbnail ? '8px' : '16px', fontWeight: '600',
                  color: accentColor, marginBottom: isThumbnail ? '3px' : '10px',
                  borderBottom: `2px solid ${accentColor}`,
                  paddingBottom: isThumbnail ? '2px' : '6px',
                }}>
                  {isThumbnail ? 'ب' : 'المقارنة الثانية'}
                </div>
                {renderBoxLocal('rightContent', 'نص المقارنة', 'comparison-content', {
                  flex: 1,
                  fontSize: isThumbnail ? '8px' : '15px',
                  textAlign: 'right',
                })}
              </div>
            </div>
          </div>
        );

      // ══ QUESTION ══
      case 'QUESTION':
        return (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5,
            display: 'flex', flexDirection: 'column',
            padding: isThumbnail ? '8px 10px' : '28px 36px',
            gap: isThumbnail ? '6px' : '18px',
          }}>
            {!isThumbnail && liveSlide.questionType && (
              <div style={{ display: 'inline-flex' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '5px 14px', borderRadius: '30px',
                  background: `${accentColor}18`, color: accentColor,
                  fontSize: '13px', fontWeight: '600',
                }}>
                  {liveSlide.questionType === 'multiple-choice' && <><Circle size={13}/><span>Multiple Choice</span></>}
                  {liveSlide.questionType === 'quiz' && (
                    <><Zap size={13}/><span>Quiz</span>
                    <span style={{ background: accentColor, color: '#fff', borderRadius: '10px', padding: '1px 8px', fontSize: '11px' }}>
                      {pointsPerQuestion} pts
                    </span></>
                  )}
                  {liveSlide.questionType === 'true-false'  && <><CheckCircle2 size={13}/><span>True / False</span></>}
                  {liveSlide.questionType === 'word-cloud'  && <><Cloud size={13}/><span>Word Cloud</span></>}
                  {liveSlide.questionType === 'open-ended'  && <><MessageSquare size={13}/><span>Open Ended</span></>}
                </div>
              </div>
            )}
            {renderBoxLocal('title', 'Enter your question here...', 'q-main-title', {
              fontSize: liveSlide.titleStyle?.fontSize
                ? `${liveSlide.titleStyle.fontSize}px`
                : (isThumbnail ? '12px' : '26px'),
              fontWeight: '700', textAlign: 'center',
            })}
            {(liveSlide.questionType === 'multiple-choice' ||
              liveSlide.questionType === 'quiz'           ||
              liveSlide.questionType === 'true-false') && options.length > 0 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: isThumbnail ? '4px' : '12px', flex: 1,
                }}>
                  {options.slice(0, isThumbnail ? 2 : options.length).map((opt, i) => {
                    const isTF   = liveSlide.questionType === 'true-false';
                    const isOk   = correctAnswer === i;
                    const isSel  = selectedOption === i;
                    const cardBg = isTF
                      ? (i === 0 ? '#f0fdf4' : '#fef2f2')
                      : (isSel && showResult ? (isOk ? '#f0fdf4' : '#fef2f2') : '#ffffff');
                    const cardBorder = isTF
                      ? (i === 0 ? '#10b981' : '#ef4444')
                      : (isSel && showResult ? (isOk ? '#10b981' : '#ef4444') : `${accentColor}44`);
                    return (
                      <div key={`${liveSlide.id}-opt-${i}`} onClick={() => handleOptionClick(i)} style={{
                        position: 'relative', display: 'flex', alignItems: 'center',
                        gap: isThumbnail ? '4px' : '10px',
                        padding: isThumbnail ? '4px 6px' : '12px 14px',
                        background: cardBg, border: `2px solid ${cardBorder}`,
                        borderRadius: appearance.cardStyle === 'sharp' ? '3px'
                          : appearance.cardStyle === 'rounded' ? (isThumbnail ? '20px' : '40px')
                          : (isThumbnail ? '6px' : '12px'),
                        cursor: isThumbnail ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        minHeight: isThumbnail ? '22px' : '60px',
                        boxShadow: !isThumbnail ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                      }}>
                        {appearance.showLetters && (
                          <div style={{
                            width: isThumbnail ? '16px' : '26px',
                            height: isThumbnail ? '16px' : '26px',
                            borderRadius: '50%',
                            background: isTF ? (i === 0 ? '#10b981' : '#ef4444') : accentColor,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, color: '#fff',
                            fontSize: isThumbnail ? '8px' : '13px', fontWeight: '700',
                          }}>
                            {isTF
                              ? (i === 0 ? <CheckCircle2 size={isThumbnail?9:14} color="white"/>
                                         : <XCircle     size={isThumbnail?9:14} color="white"/>)
                              : String.fromCharCode(65 + i)}
                          </div>
                        )}
                        <div style={{
                          flex: 1, fontSize: isThumbnail ? '8px' : '14px',
                          color: isTF ? (i === 0 ? '#059669' : '#dc2626') : '#1e293b',
                          fontWeight: isTF ? '600' : '400',
                          overflow: 'hidden',
                          textOverflow: isThumbnail ? 'ellipsis' : 'unset',
                          whiteSpace: isThumbnail ? 'nowrap' : 'normal',
                        }}>
                          {isThumbnail && opt.length > 12 ? opt.substring(0, 10) + '…' : opt}
                        </div>
                        {!isThumbnail && isOk && !showResult && (
                          <CheckCircle2 size={15} color="#10b981"
                            style={{ position: 'absolute', top: '8px', right: '10px' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
                {isThumbnail && options.length > 2 && (
                  <div style={{ textAlign: 'center', fontSize: '7px', color: '#94a3b8', marginTop: '2px' }}>
                    +{options.length - 2} more
                  </div>
                )}
              </div>
            )}
            {liveSlide.questionType === 'word-cloud' && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.35 }}>
                <Cloud size={isThumbnail ? 22 : 70} color={accentColor} />
              </div>
            )}
            {liveSlide.questionType === 'open-ended' && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.35 }}>
                <MessageSquare size={isThumbnail ? 22 : 70} color={accentColor} />
              </div>
            )}
          </div>
        );

      // ══ BLANK ══
      default:
        return <div style={{ position: 'absolute', inset: 0, zIndex: 5 }} />;
    }
  };

  // ══════════════════════════════════════════════════
  // الـ Slide Surface
  // ══════════════════════════════════════════════════
  return (
    <div
      className={`powerpoint-slide-surface${isThumbnail ? ' is-thumbnail' : ''}`}
      style={{
        width: '960px', height: '540px',
        position: 'relative', overflow: 'hidden',
        // خلفية مخصصة فقط لو المستخدم غيّرها — وإلا ThemeManager يتحكم
        ...(liveSlide.background ? getCustomBackground() : {}),
      }}
    >
      {/*
        ① ThemeManager: zIndex=1, pointerEvents=none
           — يبقى خلف كل شيء ولا يمنع النقر
      */}
      <ThemeManager themeId={themeId} />

      {/*
        ② المحتوى: zIndex=5
           — يظهر فوق الثيم دائماً
      */}
      {renderLayout()}

      {/* ③ الصور: zIndex=20 */}
      {!!liveSlide.images?.length && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }}>
          {renderImages()}
        </div>
      )}

      {/* ④ الجداول: zIndex=25 */}
      {!!liveSlide.tables?.length && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 25, pointerEvents: 'none' }}>
          {renderTables()}
        </div>
      )}
    </div>
  );
};

export default SlideRenderer;
