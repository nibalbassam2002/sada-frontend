// src/components/Editor/groups/QuestionsGroup.js
import React from 'react';
import { useEditor } from '../EditorContext';
import {
  List, Cloud, MessageSquare, FileQuestion, Target, Award,
  Eye, EyeOff, Users, Timer, CheckCircle2, XCircle,
  Zap, Circle, Lock, Globe
} from 'lucide-react';

const QuestionsGroup = () => {
  const { 
    convertToQuestion, 
    pollSettings, 
    setPollSettings, 
    activeSlideId, 
    slides 
  } = useEditor();

  const currentSlide = slides.find(s => s.id === activeSlideId);
  const isQuestion = currentSlide?.layout === 'QUESTION';

  return (
    <>
      {/* Multiple Choice - 4 خيارات افتراضية */}
      <div className="ribbon-group">
        <div className="group-content-flex">
          <button 
            className={`btn-mega ${currentSlide?.questionType === 'multiple-choice' ? 'active' : ''}`}
            onClick={() => convertToQuestion('multiple-choice')}
            title="4 options by default"
          >
            <List size={28} color="#f59e0b" />
            <span>Multiple Choice</span>
            <small className="option-count">4 options</small>
          </button>
          <div className="mini-tools-stack">
            <button 
              className={`btn-mini-wide ${currentSlide?.questionType === 'true-false' ? 'active' : ''}`}
              onClick={() => convertToQuestion('true-false')}
            >
              <Target size={14} color="#f97316" /> 
              <span>True / False</span>
              <small className="option-badge">2 options</small>
            </button>
            <button 
              className={`btn-mini-wide ${currentSlide?.questionType === 'quiz' ? 'active' : ''}`}
              onClick={() => convertToQuestion('quiz')}
            >
              <Zap size={14} color="#eab308" /> 
              <span>Quiz Mode</span>
              <small className="points-badge">10 pts</small>
            </button>
          </div>
        </div>
        <div className="group-label">CHOICES</div>
      </div>

      <div className="v-divider-slim"></div>

      {/* Word Cloud & Open Ended */}
      <div className="ribbon-group">
        <div className="group-content-flex">
          <button 
            className={`btn-mega ${currentSlide?.questionType === 'word-cloud' ? 'active' : ''}`}
            onClick={() => convertToQuestion('word-cloud')}
          >
            <Cloud size={28} color="#3b82f6" />
            <span>Word Cloud</span>
          </button>
          <div className="mini-tools-stack">
            <button 
              className={`btn-mini-wide ${currentSlide?.questionType === 'open-ended' ? 'active' : ''}`}
              onClick={() => convertToQuestion('open-ended')}
            >
              <MessageSquare size={14} color="#10b981" /> 
              <span>Open Ended</span>
            </button>
          </div>
        </div>
        <div className="group-label">OPEN</div>
      </div>

      <div className="v-divider-slim"></div>

      {/* Privacy & Config */}
      <div className="ribbon-group">
        <div className="group-content-col">
          <button 
            className={`btn-mini-wide ${pollSettings.showResults ? 'active-tool' : ''}`}
            onClick={() => setPollSettings(p => ({...p, showResults: !p.showResults}))}
          >
            {pollSettings.showResults ? (
              <>
                <Globe size={14} color="#10b981" /> 
                <span>Public Results</span>
              </>
            ) : (
              <>
                <Lock size={14} color="#64748b" /> 
                <span>Private Results</span>
              </>
            )}
          </button>
          
          <button 
            className={`btn-mini-wide ${pollSettings.showCount ? 'active-tool' : ''}`}
            onClick={() => setPollSettings(p => ({...p, showCount: !p.showCount}))}
          >
            <Users size={14} color="#6366f1" /> 
            <span>Count: {pollSettings.showCount ? 'On' : 'Off'}</span>
          </button>
          
          <button className="btn-mini-wide">
            <Timer size={14} color="#8b5cf6" /> 
            <span>{pollSettings.timer || 30}s</span>
          </button>
        </div>
        <div className="group-label">PRIVACY</div>
      </div>

      {/* مؤشر نوع السؤال المحدد */}
      {isQuestion && (
        <div className="active-question-indicator">
          <div className="indicator-content">
            <Circle size={12} color="#f59e0b" />
            <span>Editing: </span>
            <strong>
              {currentSlide?.questionType === 'multiple-choice' ? 'Multiple Choice' :
               currentSlide?.questionType === 'true-false' ? 'True/False' :
               currentSlide?.questionType === 'quiz' ? 'Quiz Mode' :
               currentSlide?.questionType === 'word-cloud' ? 'Word Cloud' :
               currentSlide?.questionType === 'open-ended' ? 'Open Ended' : 'Question'}
            </strong>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionsGroup;