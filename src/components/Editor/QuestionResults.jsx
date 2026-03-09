// src/components/Editor/QuestionResults.jsx
import React, { useState } from 'react';
import {
  Users, Clock, CheckCircle2, XCircle, BarChart3,
  Download, Share2, ArrowLeft, Trophy, Award,
  PieChart, TrendingUp, Eye, EyeOff, Filter,
  ChevronDown, ChevronUp, Search, UserCheck,
  FileText, Printer, Mail
} from 'lucide-react';

const QuestionResults = ({ questionData, responses, onClose, onNextQuestion }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sortBy, setSortBy] = useState('time');
  const [expandedStats, setExpandedStats] = useState(true);

  // حساب الإحصائيات
  const totalResponses = responses?.length || 0;
  const correctAnswerIndex = questionData?.correctAnswer;

  const optionStats = questionData?.options?.map((opt, index) => {
    const optionResponses = responses?.filter(r => r.selectedOption === index) || [];
    const count = optionResponses.length;
    const percentage = totalResponses > 0 ? (count / totalResponses) * 100 : 0;
    const isCorrect = index === correctAnswerIndex;
    
    return {
      index,
      text: opt,
      count,
      percentage,
      isCorrect,
      respondents: optionResponses
    };
  }) || [];

  const correctResponses = correctAnswerIndex !== undefined
    ? responses?.filter(r => r.selectedOption === correctAnswerIndex).length || 0
    : 0;

  const correctPercentage = totalResponses > 0 ? (correctResponses / totalResponses) * 100 : 0;

  // تصدير التقرير
  const exportReport = () => {
    const reportData = {
      question: questionData?.title,
      type: questionData?.type,
      totalResponses,
      correctResponses,
      correctPercentage,
      options: optionStats,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `question-results-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="question-results-container">
      {/* Header */}
      <div className="results-header">
        <div className="results-header-left">
          <button className="results-back-btn" onClick={onClose}>
            <ArrowLeft size={18} />
            <span>Back to Editor</span>
          </button>
          <div className="results-title">
            <h2>Question Results</h2>
            <span className="results-badge">Complete</span>
          </div>
        </div>
        <div className="results-header-right">
          <button className="results-btn" onClick={exportReport}>
            <Download size={16} />
            <span>Export Report</span>
          </button>
          <button className="results-btn primary" onClick={onNextQuestion}>
            <span>Next Question</span>
            <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
      </div>

      {/* Question Info */}
      <div className="question-info-card">
        <div className="question-info-header">
          <div className="question-type-badge">
            {questionData?.type === 'multiple-choice' && 'Multiple Choice'}
            {questionData?.type === 'true-false' && 'True / False'}
            {questionData?.type === 'quiz' && 'Quiz Mode'}
          </div>
          <div className="question-timer-info">
            <Clock size={14} />
            <span>Time: {questionData?.timer || 'No limit'}</span>
          </div>
        </div>
        <div className="question-info-content">
          <h3 className="question-text">{questionData?.title || 'Question title'}</h3>
          <div className="question-meta">
            <div className="meta-item">
              <Users size={14} />
              <span>{totalResponses} responses</span>
            </div>
            <div className="meta-item">
              <CheckCircle2 size={14} color="#10b981" />
              <span>{correctResponses} correct ({correctPercentage.toFixed(1)}%)</span>
            </div>
            <div className="meta-item">
              <XCircle size={14} color="#ef4444" />
              <span>{totalResponses - correctResponses} incorrect</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="results-tabs">
        <button 
          className={`results-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <PieChart size={14} />
          <span>Overview</span>
        </button>
        <button 
          className={`results-tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          <BarChart3 size={14} />
          <span>Detailed Analysis</span>
        </button>
        <button 
          className={`results-tab ${activeTab === 'respondents' ? 'active' : ''}`}
          onClick={() => setActiveTab('respondents')}
        >
          <Users size={14} />
          <span>Respondents</span>
        </button>
        <button 
          className={`results-tab ${activeTab === 'timing' ? 'active' : ''}`}
          onClick={() => setActiveTab('timing')}
        >
          <Clock size={14} />
          <span>Timing</span>
        </button>
      </div>

      {/* Content */}
      <div className="results-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Summary Cards */}
            <div className="summary-cards">
              <div className="summary-card">
                <div className="summary-icon blue"><Users size={20} /></div>
                <div className="summary-info">
                  <span className="summary-label">Total Responses</span>
                  <span className="summary-value">{totalResponses}</span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon green"><CheckCircle2 size={20} /></div>
                <div className="summary-info">
                  <span className="summary-label">Correct</span>
                  <span className="summary-value">{correctResponses}</span>
                  <span className="summary-percentage">({correctPercentage.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon red"><XCircle size={20} /></div>
                <div className="summary-info">
                  <span className="summary-label">Incorrect</span>
                  <span className="summary-value">{totalResponses - correctResponses}</span>
                  <span className="summary-percentage">({(100 - correctPercentage).toFixed(1)}%)</span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon orange"><TrendingUp size={20} /></div>
                <div className="summary-info">
                  <span className="summary-label">Accuracy</span>
                  <span className="summary-value">{correctPercentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Results Chart */}
            <div className="results-chart-container">
              <div className="chart-header" onClick={() => setExpandedStats(!expandedStats)}>
                <div className="chart-title">
                  <BarChart3 size={16} />
                  <span>Response Distribution</span>
                </div>
                {expandedStats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {expandedStats && (
                <div className="chart-content">
                  {optionStats.map(stat => (
                    <div key={stat.index} className="chart-item">
                      <div className="chart-item-header">
                        <div className="chart-item-label">
                          <span className="option-letter">{String.fromCharCode(65 + stat.index)}</span>
                          <span className="option-text">{stat.text}</span>
                          {stat.isCorrect && (
                            <span className="correct-badge">
                              <CheckCircle2 size={12} /> Correct
                            </span>
                          )}
                        </div>
                        <span className="chart-item-value">{stat.count} ({stat.percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="progress-bar-container">
                        <div 
                          className={`progress-bar ${stat.isCorrect ? 'correct' : ''}`}
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'respondents' && (
          <div className="respondents-tab">
            <div className="respondents-toolbar">
              <div className="search-box">
                <Search size={14} />
                <input type="text" placeholder="Search respondents..." />
              </div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                <option value="time">Sort by Time</option>
                <option value="name">Sort by Name</option>
                <option value="correct">Correct First</option>
              </select>
            </div>

            <div className="respondents-list">
              {responses?.map((response, idx) => {
                const isCorrect = response.selectedOption === correctAnswerIndex;
                return (
                  <div key={idx} className="respondent-item">
                    <div className="respondent-avatar">
                      {response.name?.charAt(0) || 'U'}
                    </div>
                    <div className="respondent-info">
                      <span className="respondent-name">{response.name || `User ${idx + 1}`}</span>
                      <span className="respondent-time">
                        <Clock size={10} /> {response.time || '2s'}
                      </span>
                    </div>
                    <div className="respondent-answer">
                      <span className="answer-letter">{String.fromCharCode(65 + response.selectedOption)}</span>
                      <span className="answer-text">{questionData?.options?.[response.selectedOption]}</span>
                    </div>
                    <div className="respondent-status">
                      {isCorrect ? (
                        <span className="status-correct"><CheckCircle2 size={14} /> Correct</span>
                      ) : (
                        <span className="status-incorrect"><XCircle size={14} /> Incorrect</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionResults;