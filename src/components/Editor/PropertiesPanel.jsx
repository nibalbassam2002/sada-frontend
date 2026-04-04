// src/components/Editor/PropertiesPanel.jsx

import React, { useState } from 'react';
import {
  Sparkles, Plus, Trash2, CheckCircle2, Circle,
  ChevronDown, ChevronUp, Clock, Eye, EyeOff,
  Globe, Lock, Award, Palette, Grid, List,
  Timer, AlertCircle, Info, Minus,
  Plus as PlusIcon, Settings2, Sliders, XCircle
} from 'lucide-react';
import { useEditor } from './EditorContext';

// ── Section header ─────────────────────────────────────────
const Section = ({ icon, title, badge, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={SS.section}>
      <div style={SS.sectionHeader} onClick={() => setOpen(!open)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#f97316' }}>{icon}</span>
          <span style={SS.sectionTitle}>{title}</span>
          {badge && <span style={SS.badge}>{badge}</span>}
        </div>
        {open ? <ChevronUp size={13} color="#94a3b8" /> : <ChevronDown size={13} color="#94a3b8" />}
      </div>
      {open && <div style={SS.sectionBody}>{children}</div>}
    </div>
  );
};

// ── Row ────────────────────────────────────────────────────
const Row = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
    <span style={SS.label}>{label}</span>
    {children}
  </div>
);

// ── PropertiesPanel ────────────────────────────────────────
const PropertiesPanel = () => {
  const {
    activeSlideId, slides, setSlides, setIsDirty,
    selectedField, setSelectedField,
    updateQuestionData, toggleCorrectAnswer,
    pollSettings, setPollSettings,
    showToast,
  } = useEditor();

  const currentSlide    = slides.find(s => s.id === activeSlideId);
  const isQuestion      = currentSlide?.layout === 'QUESTION';
  const qType           = currentSlide?.questionType;
  const qData           = currentSlide?.questionData || {};
  const options         = qData.options || [];
  const correctAnswer   = qData.correctAnswer;
  const appearance      = qData.appearance || {};
  const accentColor     = appearance.accentColor || '#f59e0b';
  const isTF            = qType === 'true-false';
  const hasChoices      = ['multiple-choice', 'quiz', 'true-false'].includes(qType);

  // ── helpers ──────────────────────────────────────────────
  const updateAppearance = (updates) =>
    updateQuestionData({ appearance: { ...appearance, ...updates } });

  const addOption = () => {
    if (isTF) return showToast('True/False options are fixed');
    if (options.length >= 10) return showToast('Maximum 10 options');
    updateQuestionData({ options: [...options, `Option ${options.length + 1}`] });
  };

  const removeOption = (i) => {
    if (isTF) return;
    if (options.length <= 2) return showToast('Minimum 2 options');
    const newOpts = options.filter((_, idx) => idx !== i);
    let newCorrect = correctAnswer;
    if (correctAnswer === i) newCorrect = null;
    else if (correctAnswer > i) newCorrect = correctAnswer - 1;
    updateQuestionData({ options: newOpts, correctAnswer: newCorrect });
  };

  const updateOption = (i, val) => {
    if (isTF) return;
    const newOpts = [...options];
    newOpts[i] = val;
    updateQuestionData({ options: newOpts });
  };

  // ── Empty state ──────────────────────────────────────────
  if (!isQuestion) {
    return (
      <aside style={SS.root}>
        <div style={SS.header}>
          <Sliders size={13} color="#f97316" />
          <span style={SS.headerTitle}>PROPERTIES</span>
        </div>
        <div style={SS.empty}>
          <Sparkles size={32} color="#e2e8f0" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>No Question Selected</span>
          <span style={{ fontSize: 11, color: '#cbd5e1', textAlign: 'center' }}>
            Convert a slide to a Question to see properties
          </span>
        </div>
      </aside>
    );
  }

  return (
    <aside style={SS.root}>
      {/* Header */}
      <div style={SS.header}>
        <Sliders size={13} color="#f97316" />
        <span style={SS.headerTitle}>QUESTION PROPERTIES</span>
        {selectedField && (
          <button style={SS.clearBtn} onClick={() => setSelectedField(null)}>
            <XCircle size={13} />
          </button>
        )}
      </div>



      <div style={{ overflowY: 'auto', flex: 1 }}>

        {/* ══ الخيارات ══════════════════════════════════ */}
        {hasChoices && (
          <Section icon={<CheckCircle2 size={13} />} title="ANSWER CHOICES" badge={`${options.length}/10`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {options.map((opt, i) => {
                const isCorrect = correctAnswer === i;
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 8px',
                    background: isCorrect ? '#f0fdf4' : '#f8fafc',
                    border: `1.5px solid ${isCorrect ? '#10b981' : '#e2e8f0'}`,
                    borderRadius: 8, transition: 'all .15s',
                  }}>
                    {/* حرف الخيار */}
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: isTF
                        ? (i === 0 ? '#10b981' : '#ef4444')
                        : accentColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 900, color: '#fff', flexShrink: 0,
                    }}>
                      {isTF
                        ? (i === 0 ? '✓' : '✗')
                        : String.fromCharCode(65 + i)}
                    </div>

                    {/* نص الخيار */}
                    <input
                      type="text"
                      value={opt}
                      readOnly={isTF}
                      onChange={e => updateOption(i, e.target.value)}
                      style={{
                        flex: 1, border: 'none', background: 'transparent',
                        fontSize: 12, fontWeight: 500, color: '#1e293b',
                        outline: 'none', cursor: isTF ? 'default' : 'text',
                      }}
                    />

                    {/* زر الإجابة الصحيحة */}
                    <button
                      onClick={() => toggleCorrectAnswer(i)}
                      title={isCorrect ? 'Correct answer' : 'Mark as correct'}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                    >
                      {isCorrect
                        ? <CheckCircle2 size={16} color="#10b981" />
                        : <Circle size={16} color="#d1d5db" />}
                    </button>

                    {/* حذف */}
                    {!isTF && (
                      <button
                        onClick={() => removeOption(i)}
                        disabled={options.length <= 2}
                        style={{
                          background: 'none', border: 'none',
                          cursor: options.length <= 2 ? 'not-allowed' : 'pointer',
                          padding: 2, opacity: options.length <= 2 ? .3 : 1,
                        }}
                      >
                        <Trash2 size={12} color="#ef4444" />
                      </button>
                    )}
                  </div>
                );
              })}

              {/* إضافة خيار */}
              {!isTF && options.length < 10 && (
                <button onClick={addOption} style={SS.addBtn}>
                  <Plus size={13} /> Add Option
                </button>
              )}

              {isTF && (
                <div style={SS.infoBox}>
                  <Info size={11} /> True/False options are fixed. Click ✓ to mark correct.
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ══ Quiz نقاط ══════════════════════════════════ */}
        {qType === 'quiz' && (
          <Section icon={<Award size={13} />} title="QUIZ SETTINGS">
            <Row label="Points per correct answer">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  onClick={() => updateQuestionData({ points: Math.max(1, (qData.points || 10) - 5) })}
                  style={SS.counterBtn}
                >
                  <Minus size={12} />
                </button>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#f97316', minWidth: 30, textAlign: 'center' }}>
                  {qData.points || 10}
                </span>
                <button
                  onClick={() => updateQuestionData({ points: Math.min(100, (qData.points || 10) + 5) })}
                  style={SS.counterBtn}
                >
                  <PlusIcon size={12} />
                </button>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>pts</span>
              </div>
            </Row>
          </Section>
        )}

        {/* ══ إعدادات الإجابة ════════════════════════════ */}
        <Section icon={<Eye size={13} />} title="ANSWER SETTINGS">
          <Row label="Show correct answer">
            <select
              value={qData.show_correct || 'after_timer'}
              onChange={e => updateQuestionData({ show_correct: e.target.value })}
              style={SS.select}
            >
              <option value="after_timer">After timer ends</option>
              <option value="manual">Manually (I decide)</option>
              <option value="never">Never</option>
            </select>
          </Row>

          <Row label="Show results to">
            <div style={{ display: 'flex', gap: 4 }}>
              {[
                { val: 'presenter',    label: 'Me only',      color: '#6366f1' },
                { val: 'everyone',     label: 'Everyone',     color: '#10b981' },
                { val: 'after_answer', label: 'After answer', color: '#f97316' },
              ].map(({ val, label, color }) => {
                const active = (qData.show_results || 'presenter') === val;
                return (
                  <button
                    key={val}
                    onClick={() => updateQuestionData({ show_results: val })}
                    style={{
                      flex: 1, padding: '5px 2px', fontSize: 10,
                      fontWeight: 700, borderRadius: 6, cursor: 'pointer',
                      background: active ? color + '18' : '#f8fafc',
                      color: active ? color : '#94a3b8',
                      border: `1.5px solid ${active ? color : '#e2e8f0'}`,
                      transition: 'all .15s',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </Row>
        </Section>

        {/* ══ المظهر ══════════════════════════════════════ */}
        {hasChoices && (
          <Section icon={<Palette size={13} />} title="VISUAL STYLE" defaultOpen={false}>

            {/* لون */}
            <Row label="Accent color">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: accentColor, cursor: 'pointer',
                  border: '2px solid #e2e8f0', position: 'relative', overflow: 'hidden',
                }}>
                  <input
                    type="color" value={accentColor}
                    onChange={e => updateAppearance({ accentColor: e.target.value })}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '200%', height: '200%' }}
                  />
                </div>
                {['#f59e0b','#ef4444','#3b82f6','#10b981','#8b5cf6','#f97316'].map(c => (
                  <div
                    key={c}
                    onClick={() => updateAppearance({ accentColor: c })}
                    style={{
                      width: 20, height: 20, borderRadius: '50%', background: c,
                      cursor: 'pointer', border: accentColor === c ? '2px solid #1e293b' : '2px solid transparent',
                      transition: 'border .15s',
                    }}
                  />
                ))}
              </div>
            </Row>

            {/* شكل الكروت */}
            <Row label="Card shape">
              <div style={{ display: 'flex', gap: 4 }}>
                {[
                  { val: 'sharp',   label: 'Sharp' },
                  { val: 'curved',  label: 'Curved' },
                  { val: 'rounded', label: 'Pill' },
                ].map(({ val, label }) => {
                  const active = (appearance.cardStyle || 'curved') === val;
                  return (
                    <button
                      key={val}
                      onClick={() => updateAppearance({ cardStyle: val })}
                      style={{
                        flex: 1, padding: '5px 4px', fontSize: 10, fontWeight: 700,
                        borderRadius: val === 'sharp' ? 2 : val === 'pill' ? 20 : 6,
                        cursor: 'pointer',
                        background: active ? '#fff7ed' : '#f8fafc',
                        color: active ? '#f97316' : '#64748b',
                        border: `1.5px solid ${active ? '#f97316' : '#e2e8f0'}`,
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </Row>

            {/* Layout */}
            <Row label="Layout">
              <div style={{ display: 'flex', gap: 4 }}>
                {[
                  { val: 'grid', icon: <Grid size={12} />, label: 'Grid' },
                  { val: 'list', icon: <List size={12} />, label: 'List' },
                ].map(({ val, icon, label }) => {
                  const active = (appearance.layoutMode || 'grid') === val;
                  return (
                    <button
                      key={val}
                      onClick={() => updateAppearance({ layoutMode: val })}
                      style={{
                        flex: 1, padding: '5px', fontSize: 10, fontWeight: 700,
                        borderRadius: 6, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                        background: active ? '#fff7ed' : '#f8fafc',
                        color: active ? '#f97316' : '#64748b',
                        border: `1.5px solid ${active ? '#f97316' : '#e2e8f0'}`,
                      }}
                    >
                      {icon} {label}
                    </button>
                  );
                })}
              </div>
            </Row>

            {/* حروف A B C */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 11, color: '#475569', fontWeight: 600 }}>
              <div
                onClick={() => updateAppearance({ showLetters: !appearance.showLetters })}
                style={{
                  width: 14, height: 14, borderRadius: 4, cursor: 'pointer',
                  border: `2px solid ${appearance.showLetters !== false ? '#f97316' : '#d1d5db'}`,
                  background: appearance.showLetters !== false ? '#f97316' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {appearance.showLetters !== false && <span style={{ color: '#fff', fontSize: 9, fontWeight: 900 }}>✓</span>}
              </div>
              Show A, B, C labels
            </label>
          </Section>
        )}

      </div>

      {/* Footer stats */}
      <div style={SS.footer}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#64748b' }}>
          <CheckCircle2 size={11} /> 0 responses
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#64748b' }}>
          <Timer size={11} /> {pollSettings.timer > 0 ? `${pollSettings.timer}s` : 'No timer'}
        </span>
      </div>
    </aside>
  );
};

// ── Styles ──────────────────────────────────────────────────
const SS = {
  root: {
    width: 260, flexShrink: 0,
    background: '#fff',
    borderLeft: '1px solid #e2e8f0',
    display: 'flex', flexDirection: 'column',
    height: '100%', overflow: 'hidden',
    fontFamily: "'Segoe UI', sans-serif",
  },
  header: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '10px 12px 6px',
    borderBottom: '1px solid #f1f5f9',
    flexShrink: 0,
  },
  headerTitle: { fontSize: 11, fontWeight: 800, color: '#475569', letterSpacing: '.08em' },
  clearBtn: { marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' },
  empty: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: 24,
  },
  section: { borderBottom: '1px solid #f1f5f9' },
  sectionHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '8px 12px', cursor: 'pointer',
    userSelect: 'none',
    ':hover': { background: '#f8fafc' },
  },
  sectionTitle: { fontSize: 11, fontWeight: 800, color: '#475569', letterSpacing: '.06em' },
  sectionBody: { padding: '4px 12px 12px' },
  badge: {
    background: '#f1f5f9', color: '#64748b',
    borderRadius: 20, padding: '1px 7px',
    fontSize: 10, fontWeight: 700,
  },
  label: { fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '.06em', textTransform: 'uppercase' },
  select: {
    width: '100%', padding: '6px 8px', fontSize: 12, fontWeight: 600,
    border: '1.5px solid #e2e8f0', borderRadius: 8,
    background: '#f8fafc', color: '#1e293b',
    cursor: 'pointer', outline: 'none',
  },
  addBtn: {
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '6px 10px', fontSize: 11, fontWeight: 700,
    border: '1.5px dashed #e2e8f0', borderRadius: 8,
    background: '#f8fafc', color: '#64748b', cursor: 'pointer',
    width: '100%', justifyContent: 'center',
    transition: 'all .15s',
  },
  infoBox: {
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '6px 10px', fontSize: 10, color: '#64748b',
    background: '#f8fafc', border: '1px solid #e2e8f0',
    borderRadius: 8,
  },
  counterBtn: {
    width: 26, height: 26, borderRadius: 6,
    border: '1.5px solid #e2e8f0', background: '#f8fafc',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '8px 12px',
    borderTop: '1px solid #f1f5f9',
    flexShrink: 0,
    background: '#fafafa',
  },
};

export default PropertiesPanel;
