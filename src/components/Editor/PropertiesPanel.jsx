// src/components/Editor/PropertiesPanel.jsx
import React, { useState } from 'react';
import {
  Sparkles, Plus, Trash2, HelpCircle, Palette,
  Settings2, ChevronRight, Info, XCircle,
  CheckCircle2, Circle, Copy,
  Grid, List, AlignJustify, Sun, Moon,
  Eye, EyeOff, Clock, Users, Lock,
  ChevronDown, ChevronUp, Sliders,
  Type, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight,
  Image, Square, Layers, RotateCw,
  Download, Share2, BarChart3, PieChart,
  TrendingUp, Filter, Search, Award,
  Globe, Shield, Bell, Zap, Cloud,
  MessageSquare, Target, Minus, Plus as PlusIcon
} from 'lucide-react';
import { useEditor } from './EditorContext';

const PropertiesPanel = () => {
  const {
    activeSlideId,
    slides,
    selectedField,
    setSelectedField,
    updateQuestionData,
    toggleCorrectAnswer,
    showToast,
    pollSettings,
    setPollSettings,
    handleExportResults,
    handleShareQuestion,
    handleCopyQuestionId
  } = useEditor();

  const [expandedSections, setExpandedSections] = useState({
    content: true,
    appearance: true,
    timing: true,
    privacy: true,
    quiz: true,
    advanced: false
  });

  const currentSlide = slides.find(s => s.id === activeSlideId);
  const isQuestionLayout = currentSlide?.layout === 'QUESTION';

  const questionData = currentSlide?.questionData || {};
  const appearance = questionData.appearance || {
    layoutMode: 'grid',
    theme: 'light',
    accentColor: '#f59e0b',
    showLetters: true,
    fontSize: 'medium',
    cardStyle: 'curved'
  };

  const totalOptions = questionData.options?.length || 0;

  const addOption = () => {
    const currentOptions = questionData.options || [];
    if (currentSlide?.questionType === 'true-false') {
      showToast("True/False options are fixed");
      return;
    }
    if (currentOptions.length >= 10) {
      showToast("Maximum 10 options allowed");
      return;
    }
    updateQuestionData({ options: [...currentOptions, `Option ${currentOptions.length + 1}`] });
  };

  const removeOption = (index) => {
    const currentOptions = questionData.options || [];
    if (currentSlide?.questionType === 'true-false') {
      showToast("True/False options cannot be removed");
      return;
    }
    if (currentOptions.length <= 2) {
      showToast("Minimum 2 options required");
      return;
    }
    const newOptions = currentOptions.filter((_, i) => i !== index);
    let newCorrectAnswer = questionData.correctAnswer;
    if (questionData.correctAnswer === index) {
      newCorrectAnswer = null;
    } else if (questionData.correctAnswer > index) {
      newCorrectAnswer = questionData.correctAnswer - 1;
    }
    updateQuestionData({ options: newOptions, correctAnswer: newCorrectAnswer });
  };

  const updateOptionText = (index, text) => {
    const currentOptions = [...(questionData.options || [])];
    if (currentSlide?.questionType === 'true-false') {
      showToast("True/False options cannot be edited");
      return;
    }
    currentOptions[index] = text;
    updateQuestionData({ options: currentOptions });
  };

  const updateTimer = (seconds) => {
    setPollSettings(prev => ({ ...prev, timer: Math.max(0, Math.min(300, seconds)) }));
  };

  const updateQuizPoints = (points) => {
    updateQuestionData({ points: Math.max(1, Math.min(100, points)) });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getQuestionTypeIcon = () => {
    switch (currentSlide?.questionType) {
      case 'multiple-choice': return <List size={18} />;
      case 'true-false': return <Target size={18} />;
      case 'quiz': return <Zap size={18} />;
      case 'word-cloud': return <Cloud size={18} />;
      case 'open-ended': return <MessageSquare size={18} />;
      default: return <HelpCircle size={18} />;
    }
  };

  if (!isQuestionLayout) {
    return (
      <aside className="properties-panel-sidebar">
        <div className="properties-header">
          <div className="properties-header-left">
            <Sliders size={14} className="properties-icon" />
            <span className="properties-title">PROPERTIES</span>
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-icon"><Sparkles size={32} /></div>
          <h3 className="empty-title">No Question Selected</h3>
          <p className="empty-description">Convert a slide to Question to see properties</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="properties-panel-sidebar">
      <div className="properties-header">
        <div className="properties-header-left">
          <Sliders size={14} className="properties-icon" />
          <span className="properties-title">QUESTION PROPERTIES</span>
        </div>
        {selectedField && (
          <button className="properties-clear-btn" onClick={() => setSelectedField(null)}>
            <XCircle size={14} />
          </button>
        )}
      </div>

      <div className="properties-scroll-area">
        {/* نوع السؤال مع أيقونة */}
        <div className="question-type-banner">
          
          <span className="question-type-name">
            {currentSlide?.questionType === 'multiple-choice' ? 'Multiple Choice' :
             currentSlide?.questionType === 'true-false' ? 'True / False' :
             currentSlide?.questionType === 'quiz' ? 'Quiz Mode' :
             currentSlide?.questionType === 'word-cloud' ? 'Word Cloud' :
             currentSlide?.questionType === 'open-ended' ? 'Open Ended' : 'Question'}
          </span>
          
        </div>

        {/* قسم الخيارات */}
        {(currentSlide?.questionType === 'multiple-choice' || 
          currentSlide?.questionType === 'quiz' || 
          currentSlide?.questionType === 'true-false') && (
          <div className="properties-section">
            <div className="section-header" onClick={() => toggleSection('content')}>
              <div className="section-header-left">
                <HelpCircle size={14} className="section-icon" />
                <span className="section-title">ANSWER CHOICES</span>
                <span className="options-count">{totalOptions}/10</span>
              </div>
              {expandedSections.content ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
            
            {expandedSections.content && (
              <div className="section-content compact">
                <div className="options-container compact">
                  {questionData.options?.map((opt, i) => {
                    const isCorrect = questionData.correctAnswer === i;
                    const isTrueFalse = currentSlide?.questionType === 'true-false';
                    
                    return (
                      <div key={i} className={`option-item compact ${isCorrect ? 'correct' : ''}`}>
                        <div className="option-content compact">
                          <button 
                            className={`correct-toggle-btn small ${isCorrect ? 'active' : ''}`}
                            onClick={() => toggleCorrectAnswer(i)}
                            title={isCorrect ? "Correct Answer" : "Mark as Correct"}
                          >
                            {isCorrect ? 
                              <CheckCircle2 size={16} color="#10b981" /> : 
                              <Circle size={16} color="#94a3b8" />
                            }
                          </button>
                          
                          <input 
                            type="text"
                            defaultValue={opt}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => updateOptionText(i, e.target.value)}
                            placeholder={isTrueFalse ? (i === 0 ? 'True' : 'False') : `Enter option ${i+1}...`}
                            className={`option-input compact ${isTrueFalse ? (i === 0 ? 'true-option' : 'false-option') : ''}`}
                            readOnly={isTrueFalse}
                          />
                          
                          {!isTrueFalse && (
                            <button 
                              className="option-control-btn small delete"
                              onClick={() => removeOption(i)}
                              disabled={totalOptions <= 2}
                              title="Remove option"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {currentSlide?.questionType !== 'true-false' && totalOptions < 10 && (
                  <button className="add-option-btn compact" onClick={addOption}>
                    <Plus size={14} />
                    <span>Add Option</span>
                  </button>
                )}

                {currentSlide?.questionType === 'true-false' && (
                  <div className="info-message compact">
                    <Info size={12} />
                    <span>True/False options are fixed. Click <CheckCircle2 size={10} color="#10b981" /> to mark correct answer.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* قسم Quiz Mode - نقاط ونتائج فورية */}
        {currentSlide?.questionType === 'quiz' && (
          <div className="properties-section">
            <div className="section-header" onClick={() => toggleSection('quiz')}>
              <div className="section-header-left">
                <Award size={14} className="section-icon" />
                <span className="section-title">QUIZ SETTINGS</span>
              </div>
              {expandedSections.quiz ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
            
            {expandedSections.quiz && (
              <div className="section-content">
                {/* نقاط السؤال */}
                <div className="property-row">
                  <label className="property-label">Points per question</label>
                  <div className="points-control">
                    <button 
                      className="points-btn"
                      onClick={() => updateQuizPoints((questionData.points || 10) - 5)}
                    >
                      <Minus size={14} />
                    </button>
                    <input 
                      type="number"
                      min="1"
                      max="100"
                      value={questionData.points || 10}
                      onChange={(e) => updateQuizPoints(parseInt(e.target.value) || 10)}
                      className="points-input"
                    />
                    <button 
                      className="points-btn"
                      onClick={() => updateQuizPoints((questionData.points || 10) + 5)}
                    >
                      <PlusIcon size={14} />
                    </button>
                    <span className="points-unit">points</span>
                  </div>
                </div>


                {/* خيارات العرض الفوري */}
                <div className="quiz-options">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={questionData.showCorrectImmediately !== false}
                      onChange={(e) => updateQuestionData({ showCorrectImmediately: e.target.checked })}
                    />
                    <span>Show correct answer immediately</span>
                  </label>

                  <label className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={questionData.showPoints !== false}
                      onChange={(e) => updateQuestionData({ showPoints: e.target.checked })}
                    />
                    <span>Show points earned</span>
                  </label>

                  <label className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={questionData.showLeaderboard || false}
                      onChange={(e) => updateQuestionData({ showLeaderboard: e.target.checked })}
                    />
                    <span>Show leaderboard after quiz</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* قسم المظهر */}
        <div className="properties-section">
          <div className="section-header" onClick={() => toggleSection('appearance')}>
            <div className="section-header-left">
              <Palette size={14} className="section-icon" />
              <span className="section-title">VISUAL STYLE</span>
            </div>
            {expandedSections.appearance ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
          
          {expandedSections.appearance && (
            <div className="section-content">
              {/* Layout Mode */}
              {(currentSlide?.questionType === 'multiple-choice' || 
                currentSlide?.questionType === 'quiz' || 
                currentSlide?.questionType === 'true-false') && (
                <div className="property-row">
                  <label className="property-label">Layout</label>
                  <div className="layout-buttons">
                    <button 
                      className={`layout-btn ${appearance.layoutMode === 'grid' ? 'active' : ''}`}
                      onClick={() => updateQuestionData({ appearance: { ...appearance, layoutMode: 'grid' } })}
                    >
                      <Grid size={14} /> Grid
                    </button>
                    <button 
                      className={`layout-btn ${appearance.layoutMode === 'list' ? 'active' : ''}`}
                      onClick={() => updateQuestionData({ appearance: { ...appearance, layoutMode: 'list' } })}
                    >
                      <List size={14} /> List
                    </button>
                  </div>
                </div>
              )}

              {/* Accent Color */}
              <div className="property-row">
                <label className="property-label">Accent Color</label>
                <div className="color-palette-container">
                  <div className="custom-color-picker compact">
                    <div className="custom-color-preview small" style={{ backgroundColor: appearance.accentColor }}>
                      <input 
                        type="color" 
                        value={appearance.accentColor} 
                        onChange={(e) => updateQuestionData({ appearance: { ...appearance, accentColor: e.target.value } })}
                        className="color-input-hidden"
                        title="Choose custom color"
                      />
                    </div>
                    <span className="custom-color-label small">Custom Color</span>
                    <span className="custom-color-value small">{appearance.accentColor}</span>
                  </div>
                </div>
              </div>

              {/* Card Shape */}
              {(currentSlide?.questionType === 'multiple-choice' || 
                currentSlide?.questionType === 'quiz' || 
                currentSlide?.questionType === 'true-false') && (
                <div className="property-row">
                  <label className="property-label">Card Shape</label>
                  <select 
                    value={appearance.cardStyle}
                    onChange={(e) => updateQuestionData({ appearance: { ...appearance, cardStyle: e.target.value } })}
                    className="property-select"
                  >
                    <option value="sharp">Sharp Corners</option>
                    <option value="curved">Curved Corners</option>
                    <option value="rounded">Rounded</option>
                  </select>
                </div>
              )}

              {/* Show Letters */}
              {(currentSlide?.questionType === 'multiple-choice' || 
                currentSlide?.questionType === 'quiz' || 
                currentSlide?.questionType === 'true-false') && (
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={appearance.showLetters}
                    onChange={(e) => updateQuestionData({ appearance: { ...appearance, showLetters: e.target.checked } })}
                  />
                  <span>Show A, B, C indicators</span>
                </label>
              )}
            </div>
          )}
        </div>

        {/* قسم التوقيت */}
        <div className="properties-section">
          <div className="section-header" onClick={() => toggleSection('timing')}>
            <div className="section-header-left">
              <Clock size={14} className="section-icon" />
              <span className="section-title">TIMING</span>
            </div>
            <div className="section-header-right">
              <span className="timing-summary">
                {pollSettings.timer > 0 ? `${pollSettings.timer}s` : 'No limit'}
              </span>
              {expandedSections.timing ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </div>
          
          {expandedSections.timing && (
            <div className="section-content">
              <div className="timing-preset-row">
                <button 
                  className={`timing-pill ${pollSettings.timer === 0 ? 'active' : ''}`}
                  onClick={() => updateTimer(0)}
                >
                  Off
                </button>
                <button 
                  className={`timing-pill ${pollSettings.timer === 15 ? 'active' : ''}`}
                  onClick={() => updateTimer(15)}
                >
                  15s
                </button>
                <button 
                  className={`timing-pill ${pollSettings.timer === 30 ? 'active' : ''}`}
                  onClick={() => updateTimer(30)}
                >
                  30s
                </button>
                <button 
                  className={`timing-pill ${pollSettings.timer === 60 ? 'active' : ''}`}
                  onClick={() => updateTimer(60)}
                >
                  60s
                </button>
                <button 
                  className={`timing-pill ${pollSettings.timer === 90 ? 'active' : ''}`}
                  onClick={() => updateTimer(90)}
                >
                  90s
                </button>
                <button 
                  className={`timing-pill ${pollSettings.timer === 120 ? 'active' : ''}`}
                  onClick={() => updateTimer(120)}
                >
                  120s
                </button>
              </div>

              <div className="custom-timer-compact">
                <div className="custom-timer-header">
                  <Clock size={12} />
                  <span>Custom timer</span>
                </div>
                <div className="custom-timer-control">
                  <input 
                    type="range" 
                    min="0" 
                    max="300" 
                    step="5"
                    value={pollSettings.timer || 0}
                    onChange={(e) => updateTimer(parseInt(e.target.value))}
                    className="timer-slider"
                  />
                  <div className="timer-value-box">
                    <input 
                      type="number" 
                      min="0" 
                      max="300" 
                      value={pollSettings.timer || 0}
                      onChange={(e) => updateTimer(parseInt(e.target.value) || 0)}
                      className="timer-number-input"
                    />
                    <span className="timer-unit">sec</span>
                  </div>
                </div>
              </div>

              <div className="timer-status-simple">
                <div className={`status-badge ${pollSettings.timer > 0 ? 'active' : 'inactive'}`}>
                  {pollSettings.timer > 0 ? (
                    <>
                      <Bell size={12} />
                      <span>Auto-submit in {pollSettings.timer}s</span>
                    </>
                  ) : (
                    <>
                      <Clock size={12} />
                      <span>No time limit</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* قسم الخصوصية */}
        <div className="properties-section">
          <div className="section-header" onClick={() => toggleSection('privacy')}>
            <div className="section-header-left">
              <Lock size={14} className="section-icon" />
              <span className="section-title">PRIVACY</span>
            </div>
            {expandedSections.privacy ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
          
          {expandedSections.privacy && (
            <div className="section-content">
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={pollSettings.isPrivate || false}
                  onChange={(e) => setPollSettings(prev => ({ ...prev, isPrivate: e.target.checked }))}
                />
                <Shield size={14} />
                <span>Anonymous responses</span>
              </label>
              
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={pollSettings.showCount || false}
                  onChange={(e) => setPollSettings(prev => ({ ...prev, showCount: e.target.checked }))}
                />
                <Eye size={14} />
                <span>Show response count</span>
              </label>
            </div>
          )}
        </div>

        {/* قسم متقدم */}
        <div className="properties-section">
          <div className="section-header" onClick={() => toggleSection('advanced')}>
            <div className="section-header-left">
              <Settings2 size={14} className="section-icon" />
              <span className="section-title">ADVANCED</span>
            </div>
            <div className="section-header-right">
              <span className="question-id-mini">Q{activeSlideId}</span>
              {expandedSections.advanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </div>
          
          {expandedSections.advanced && (
            <div className="section-content">
              <button 
                className="advanced-action-btn primary"
                onClick={handleExportResults}
                title="Export results as JSON file"
              >
                <div className="advanced-action-icon">
                  <Download size={16} />
                </div>
                <div className="advanced-action-content">
                  <span className="advanced-action-title">Export Results</span>
                  <span className="advanced-action-desc">Save responses as JSON</span>
                </div>
                <ChevronRight size={14} className="advanced-action-arrow" />
              </button>

              <button 
                className="advanced-action-btn"
                onClick={handleShareQuestion}
                title="Copy question link to clipboard"
              >
                <div className="advanced-action-icon">
                  <Share2 size={16} />
                </div>
                <div className="advanced-action-content">
                  <span className="advanced-action-title">Share Question</span>
                  <span className="advanced-action-desc">Copy link to this question</span>
                </div>
                <ChevronRight size={14} className="advanced-action-arrow" />
              </button>

              <div className="question-id-container">
                <div className="question-id-label">
                  <Globe size={12} />
                  <span>Question ID:</span>
                </div>
                <div className="question-id-value">
                  <code>Q{activeSlideId}</code>
                  <button 
                    className="copy-id-btn"
                    onClick={handleCopyQuestionId}
                    title="Copy Question ID"
                  >
                    <Copy size={12} />
                  </button>
                </div>
              </div>

              <div className="question-metadata">
                <div className="metadata-item">
                  <span className="metadata-key">Type:</span>
                  <span className="metadata-value">
                    {currentSlide?.questionType === 'multiple-choice' ? 'Multiple Choice' :
                     currentSlide?.questionType === 'true-false' ? 'True/False' :
                     currentSlide?.questionType === 'quiz' ? 'Quiz Mode' :
                     currentSlide?.questionType === 'word-cloud' ? 'Word Cloud' :
                     currentSlide?.questionType === 'open-ended' ? 'Open Ended' : 'Question'}
                  </span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-key">Options:</span>
                  <span className="metadata-value">{totalOptions}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-key">Points:</span>
                  <span className="metadata-value">{questionData.points || 10} each</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-key">Created:</span>
                  <span className="metadata-value">{new Date(activeSlideId).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="properties-footer">
        <div className="footer-stat">
          <Users size={12} />
          <span>0 responses</span>
        </div>
        <div className="footer-stat">
          <Clock size={12} />
          <span>{pollSettings.timer > 0 ? `${pollSettings.timer}s` : 'No timer'}</span>
        </div>
        <div className="footer-stat">
          {pollSettings.isPrivate ? <Shield size={12} /> : <Globe size={12} />}
        </div>
      </div>
    </aside>
  );
};

export default PropertiesPanel;