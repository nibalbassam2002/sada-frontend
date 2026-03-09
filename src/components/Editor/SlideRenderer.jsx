// src/components/Editor/SlideRenderer.js
import React, { useState } from 'react';
import { useEditor } from './EditorContext';
import { LAYOUT_TYPES } from './EditorConstants';
import {
  Cloud,
  MessageSquare,
  BarChart3,
  CheckCircle2,
  Circle,
  XCircle,
  Zap,
  Award,
  Clock
} from 'lucide-react';

const SlideRenderer = ({ slide, onAnswerSelected }) => {
  const { renderBox, slides, activeSlideId } = useEditor();
  
  // حالة للإجابة المحددة والنتيجة
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  if (!slide) return null;

  const currentSlide = slides.find(s => s.id === activeSlideId);
  const questionData = slide.questionData || {};
  const appearance = questionData.appearance || {
    layoutMode: 'grid',
    theme: 'light',
    accentColor: '#f59e0b',
    showLetters: true,
    fontSize: 'medium',
    cardStyle: 'curved'
  };
  const options = questionData.options || [];
  const correctAnswer = questionData.correctAnswer;
  
  // جلب النقاط من questionData (القيمة الافتراضية 10)
  const pointsPerQuestion = questionData.points || 10;
  const showCorrectImmediately = questionData.showCorrectImmediately !== false;
  const showPoints = questionData.showPoints !== false;

  // دالة لتحديد حجم الخط
  const getFontSizeClass = () => {
    switch(appearance.fontSize) {
      case 'small': return 'font-size-small';
      case 'large': return 'font-size-large';
      default: return 'font-size-medium';
    }
  };

  // دالة عند اختيار إجابة
  const handleOptionClick = (optionIndex) => {
    if (showResult) return; // منع الاختيار بعد ظهور النتيجة
    
    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === correctAnswer;
    
    if (isCorrect) {
      setPointsEarned(pointsPerQuestion);
    }
    
    setShowResult(true);
    
    // إرسال النتيجة للمقدم
    if (onAnswerSelected) {
      onAnswerSelected({
        option: optionIndex,
        isCorrect,
        points: isCorrect ? pointsPerQuestion : 0
      });
    }
  };

  switch (slide.layout) {
    case LAYOUT_TYPES.TITLE_SLIDE:
      return (
        <div className="title-slide-layout">
          {renderBox('title', 'Click to add title', 'title-slide-main')}
          {renderBox('subtitle', 'Click to add subtitle', 'title-slide-sub')}
        </div>
      );

    case LAYOUT_TYPES.SECTION_HEADER:
      return (
        <div className="section-header-layout">
          {renderBox('title', 'Section title', 'section-header-title')}
        </div>
      );

    case LAYOUT_TYPES.TITLE_AND_CONTENT:
      return (
        <div className="title-content-layout">
          {renderBox('title', 'Click to add title', 'content-title')}
          {renderBox('content', 'Click to add text', 'content-body')}
        </div>
      );

    case LAYOUT_TYPES.TWO_CONTENT:
      return (
        <div className="two-column-layout">
          {renderBox('title', 'Click to add title', 'two-column-title')}
          <div className="two-column-container">
            {renderBox('leftContent', 'Click to add content to left column', 'column-left')}
            {renderBox('rightContent', 'Click to add content to right column', 'column-right')}
          </div>
        </div>
      );

    case LAYOUT_TYPES.COMPARISON:
      return (
        <div className="comparison-layout">
          {renderBox('title', 'Click to add title', 'comparison-title')}
          <div className="comparison-container">
            <div className="comparison-column">
              <div className="comparison-header">Left</div>
              {renderBox('leftContent', 'Click to add', 'comparison-content')}
            </div>
            <div className="comparison-column">
              <div className="comparison-header">Right</div>
              {renderBox('rightContent', 'Click to add', 'comparison-content')}
            </div>
          </div>
        </div>
      );

    case 'QUESTION':
      return (
        <div className={`question-page-wrapper theme-${appearance.theme}`}>
          {/* شريط علوي يوضح نوع السؤال مع النقاط الفعلية */}
          <div className="question-type-header">
            <div className="question-type-badge">
              {slide.questionType === 'multiple-choice' && (
                <>
                  <Circle size={14} />
                  <span>Multiple Choice</span>
                </>
              )}
              {slide.questionType === 'quiz' && (
                <>
                  <Zap size={14} color="#f59e0b" />
                  <span>Quiz Mode</span>
                  <span className="quiz-points">{pointsPerQuestion} points</span>
                </>
              )}
              {slide.questionType === 'true-false' && (
                <>
                  <CheckCircle2 size={14} />
                  <span>True / False</span>
                </>
              )}
              {slide.questionType === 'word-cloud' && (
                <>
                  <Cloud size={14} />
                  <span>Word Cloud</span>
                </>
              )}
              {slide.questionType === 'open-ended' && (
                <>
                  <MessageSquare size={14} />
                  <span>Open Ended</span>
                </>
              )}
            </div>
          </div>

          {/* رأس السؤال */}
          <div className="q-header-container">
            {renderBox('title', 'أدخل السؤال هنا...', `q-main-title ${getFontSizeClass()}`)}
          </div>

          <div className="question-visual-content">
            {/* عرض الخيارات مع إمكانية النقر */}
            {(slide.questionType === 'multiple-choice' || slide.questionType === 'quiz' || slide.questionType === 'true-false') ? (
              <div
                className={`q-options-grid mode-${appearance.layoutMode}`}
                style={{ '--accent': appearance.accentColor, gap: appearance.gap || '20px' }}
              >
                {options.map((opt, i) => {
                  const isCorrect = correctAnswer === i;
                  const isTrueFalse = slide.questionType === 'true-false';
                  const isSelected = selectedOption === i;
                  
                  return (
                    <div
                      key={i}
                      onClick={() => handleOptionClick(i)}
                      className={`q-option-card shape-${appearance.cardStyle} 
                        ${isCorrect ? 'is-correct-card' : ''} 
                        ${isTrueFalse ? 'true-false-card' : ''}
                        ${isSelected ? 'selected' : ''}
                        ${showResult && isSelected ? (isCorrect ? 'correct-selected' : 'incorrect-selected') : ''}
                        ${!showResult ? 'clickable' : ''}`}
                      style={isTrueFalse ? {
                        background: i === 0 ? '#f0fdf4' : '#fef2f2',
                        borderColor: i === 0 ? '#10b981' : '#ef4444'
                      } : {}}
                    >
                      {appearance.showLetters && (
                        <div
                          className="q-badge"
                          style={isTrueFalse ? {
                            background: i === 0 ? '#10b981' : '#ef4444',
                            color: 'white'
                          } : {}}
                        >
                          {isTrueFalse ? (
                            i === 0 ? 
                              <CheckCircle2 size={16} color="white" /> : 
                              <XCircle size={16} color="white" />
                          ) : (
                            <span>{String.fromCharCode(65 + i)}</span>
                          )}
                        </div>
                      )}

                      <div
                        className="q-option-text"
                        style={isTrueFalse ? {
                          color: i === 0 ? '#059669' : '#dc2626',
                          fontWeight: '600'
                        } : {}}
                      >
                        {opt}
                      </div>

                      {/* عرض علامة الإجابة الصحيحة للمقدم */}
                      {isCorrect && !showResult && (
                        <div className="q-correct-icon-wrapper">
                          <CheckCircle2 size={20} color="#10b981" />
                        </div>
                      )}

                      {/* عرض النتيجة الفورية للمستخدم */}
                      {showResult && isSelected && (
                        <div className={`result-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                          {isCorrect ? (
                            <>
                              <CheckCircle2 size={16} />
                              <span>✓ Correct!</span>
                              {showPoints && <span className="points">+{pointsEarned}</span>}
                            </>
                          ) : (
                            <>
                              <XCircle size={16} />
                              <span>✗ Incorrect</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* Word Cloud */}
            {slide.questionType === 'word-cloud' && (
              <div className="placeholder-full-view">
                <Cloud size={100} color={appearance.accentColor} strokeWidth={1} opacity={0.4} />
                <p className="placeholder-info">ستظهر سحابة الكلمات هنا</p>
              </div>
            )}

            {/* Open Ended */}
            {slide.questionType === 'open-ended' && (
              <div className="placeholder-full-view">
                <MessageSquare size={100} color={appearance.accentColor} strokeWidth={1} opacity={0.4} />
                <p className="placeholder-info">سيتم عرض إجابات الجمهور هنا</p>
              </div>
            )}
          </div>
        </div>
      );

    default:
      return <div className="blank-slide-layout"></div>;
  }
};

export default SlideRenderer;