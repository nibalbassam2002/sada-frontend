// src/components/Editor/groups/QuestionsGroup.jsx

import React from 'react';
import { useEditor } from '../EditorContext';
import {
  List, Cloud, MessageSquare, Target, Zap,
  Timer, Globe, Lock, Users, Eye
} from 'lucide-react';

const QUESTION_TYPES = [
  { type: 'multiple-choice', label: 'Multiple Choice', icon: <List size={20} color="#f59e0b" />, sub: '4 options' },
  { type: 'true-false',      label: 'True / False',    icon: <Target size={20} color="#f97316" />, sub: '2 options' },
  { type: 'quiz',            label: 'Quiz',             icon: <Zap size={20} color="#eab308" />,   sub: '+ points' },
  { type: 'word-cloud',      label: 'Word Cloud',       icon: <Cloud size={20} color="#3b82f6" />, sub: 'open' },
  { type: 'open-ended',      label: 'Open Ended',       icon: <MessageSquare size={20} color="#10b981" />, sub: 'text' },
];

const TIMER_PRESETS = [0, 10, 15, 20, 30, 45, 60, 90, 120];

const QuestionsGroup = () => {
  const {
    convertToQuestion,
    pollSettings, setPollSettings,
    activeSlideId, slides,
  } = useEditor();

  const currentSlide = slides.find(s => s.id === activeSlideId);
  const isQuestion   = currentSlide?.layout === 'QUESTION';
  const qType        = currentSlide?.questionType;
  const qData        = currentSlide?.questionData || {};
  const timer        = pollSettings.timer ?? 30;
  const showResults  = qData.show_results || 'presenter';
  const isPrivate    = pollSettings.isPrivate || false;

  return (
    <>
      {/* ══ نوع السؤال ══════════════════════════════════ */}
      <div className="ribbon-group">
        <div className="group-content-flex" style={{ gap: 4 }}>
          {QUESTION_TYPES.map(({ type, label, icon, sub }) => (
            <button
              key={type}
              className={`btn-mega ${qType === type ? 'active' : ''}`}
              onClick={() => convertToQuestion(type)}
              title={label}
              style={{
                minWidth: 72,
                background: qType === type ? '#fff7ed' : 'transparent',
                border: qType === type ? '1.5px solid #f97316' : '1.5px solid transparent',
                borderRadius: 8,
                padding: '6px 8px',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 3,
                transition: 'all .15s',
              }}
            >
              {icon}
              <span style={{ fontSize: 11, fontWeight: 700, color: qType === type ? '#f97316' : '#475569' }}>
                {label}
              </span>
              <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 500 }}>{sub}</span>
            </button>
          ))}
        </div>
        <div className="group-label">QUESTION TYPE</div>
      </div>

      <div className="v-divider-slim" />

      {/* ══ التوقيت ══════════════════════════════════════ */}
      <div className="ribbon-group">
        <div className="group-content-col" style={{ gap: 5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Timer size={13} color="#8b5cf6" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>Timer</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, maxWidth: 160 }}>
            {TIMER_PRESETS.map(t => (
              <button
                key={t}
                onClick={() => setPollSettings(p => ({ ...p, timer: t }))}
                style={{
                  padding: '2px 7px', fontSize: 10, fontWeight: 700,
                  borderRadius: 20, cursor: 'pointer',
                  background: timer === t ? '#8b5cf6' : '#f1f5f9',
                  color: timer === t ? '#fff' : '#64748b',
                  border: timer === t ? '1px solid #8b5cf6' : '1px solid #e2e8f0',
                  transition: 'all .15s',
                }}
              >
                {t === 0 ? '∞' : `${t}s`}
              </button>
            ))}
          </div>
        </div>
        <div className="group-label">TIMING</div>
      </div>

      <div className="v-divider-slim" />

      {/* ══ النتائج والخصوصية ════════════════════════════ */}
      <div className="ribbon-group">
        <div className="group-content-col" style={{ gap: 5 }}>

          {/* من يرى النتائج */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '.06em' }}>
              RESULTS
            </span>
            <div style={{ display: 'flex', gap: 3 }}>
              {[
                { val: 'presenter', icon: <Eye size={11} />, label: 'Me only' },
                { val: 'everyone',  icon: <Globe size={11} />, label: 'Everyone' },
                { val: 'after_answer', icon: <Users size={11} />, label: 'After answer' },
              ].map(({ val, icon, label }) => {
                const active = showResults === val;
                return (
                  <button
                    key={val}
                    onClick={() => {
                      const updSlides = slides.map(s =>
                        s.id === activeSlideId
                          ? { ...s, questionData: { ...s.questionData, show_results: val } }
                          : s
                      );
                    }}
                    style={{
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: 2,
                      padding: '4px 7px', fontSize: 9, fontWeight: 700,
                      borderRadius: 6, cursor: 'pointer',
                      background: active ? '#f0fdf4' : '#f8fafc',
                      color: active ? '#10b981' : '#64748b',
                      border: active ? '1px solid #10b981' : '1px solid #e2e8f0',
                      transition: 'all .15s',
                    }}
                  >
                    {icon}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* خصوصية */}
          <label style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 11, fontWeight: 600, color: '#64748b',
            cursor: 'pointer',
          }}>
            <div style={{
              width: 14, height: 14, borderRadius: 4,
              border: `2px solid ${isPrivate ? '#6366f1' : '#d1d5db'}`,
              background: isPrivate ? '#6366f1' : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
              onClick={() => setPollSettings(p => ({ ...p, isPrivate: !p.isPrivate }))}
            >
              {isPrivate && <span style={{ color: '#fff', fontSize: 9, fontWeight: 900 }}>✓</span>}
            </div>
            <Lock size={11} color={isPrivate ? '#6366f1' : '#94a3b8'} />
            Anonymous
          </label>
        </div>
        <div className="group-label">RESULTS & PRIVACY</div>
      </div>

      {/* ══ مؤشر نوع السؤال ══════════════════════════════ */}
      {isQuestion && (
        <>
          <div className="v-divider-slim" />
          <div className="ribbon-group">
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 4, padding: '0 8px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#fff7ed', border: '1px solid #fed7aa',
                borderRadius: 20, padding: '4px 12px',
                fontSize: 12, fontWeight: 700, color: '#f97316',
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f97316', display: 'inline-block' }} />
                {QUESTION_TYPES.find(q => q.type === qType)?.label || 'Question'}
              </div>
              {timer > 0 && (
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>
                  ⏱ {timer}s · {showResults === 'presenter' ? '🔒 Private' : '🌐 Public'}
                </div>
              )}
            </div>
            <div className="group-label">STATUS</div>
          </div>
        </>
      )}
    </>
  );
};

export default QuestionsGroup;
