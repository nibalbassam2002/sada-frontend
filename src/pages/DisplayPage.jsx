import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { EditorProvider } from '../components/Editor/EditorContext';
import SlideRenderer from '../components/Editor/SlideRenderer';
import ThemeManager from '../templates/ThemeManager';
import {
  CheckCircle, XCircle, Users, Clock, Award, BarChart2, AlertCircle
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'https://sada-api-b5qk.onrender.com/api';

const QuestionExpiredMessage = () => (
  <div style={{
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 50,
    background: 'rgba(15,23,42,0.75)',
    backdropFilter: 'blur(4px)',
  }}>
    <div style={{
      background: '#fff',
      borderRadius: 24,
      padding: '48px 64px',
      textAlign: 'center',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      border: '3px solid #ef4444',
      maxWidth: 520,
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: '#fef2f2', border: '3px solid #ef4444',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <XCircle size={36} color="#ef4444" />
      </div>
      <h2 style={{
        fontSize: 32, fontWeight: 900, color: '#1e293b',
        margin: '0 0 12px', lineHeight: 1.2,
      }}>
        This Question Has Ended
      </h2>
      <p style={{ fontSize: 16, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
        This question is already closed and cannot be reopened.
      </p>
    </div>
  </div>
);

const ReportOverlay = ({ children }) => (
  <div style={{
    position: 'absolute', inset: 0,
    background: 'rgba(15,23,42,0.92)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100, padding: 40,
    backdropFilter: 'blur(6px)',
    overflowY: 'auto',
  }}>
    <div style={{
      background: '#fff', borderRadius: 28,
      padding: '36px 40px', maxWidth: 860, width: '100%',
      boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
      fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif",
    }}>
      {children}
    </div>
  </div>
);

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const OptionsChart = ({ options, correctIndex, total }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
    {options.map((opt, i) => {
      const count = opt.count ?? 0;
      const pct = opt.percent ?? (total > 0 ? Math.round((count / total) * 100) : 0);
      const isOk = opt.is_correct ?? (i === correctIndex);
      const text = opt.text ?? (typeof opt === 'string' ? opt : '');
      const color = isOk ? '#10b981' : COLORS[i % COLORS.length];

      return (
        <div key={i} style={{
          position: 'relative', borderRadius: 16, overflow: 'hidden',
          border: `2px solid ${isOk ? '#10b981' : color}`,
          height: 80, background: isOk ? '#f0fdf4' : '#fff',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${pct}%`, background: `${color}22`, transition: 'width 0.8s ease',
          }} />
          <div style={{
            position: 'relative', display: 'flex',
            alignItems: 'center', gap: 12, padding: '0 16px', height: '100%',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, color: '#fff', fontSize: 16, fontWeight: 900,
            }}>
              {isOk ? <CheckCircle size={20} color="#fff" /> : String.fromCharCode(65 + i)}
            </div>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{text}</span>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: isOk ? '#10b981' : '#1e293b' }}>{pct}%</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{count} votes</div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const TextAnswers = ({ answers }) => {
  if (!answers?.length) return null;
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
        Open Answers ({answers.length})
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {answers.map((a, i) => (
          <div key={i} style={{
            background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: 12, padding: '8px 14px', fontSize: 14, color: '#334155',
          }}>
            <span style={{ fontWeight: 700, color: '#f97316', marginRight: 6 }}>{a.nickname}:</span>
            {a.answer}
          </div>
        ))}
      </div>
    </div>
  );
};

const RatingChart = ({ data }) => {
  const dist = data.distribution || [];
  const max = Math.max(...dist.map(d => d.count), 1);
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 40, fontWeight: 900, color: '#f97316' }}>{data.average}</span>
        <span style={{ fontSize: 16, color: '#64748b' }}>/ 5 average rating</span>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 80 }}>
        {dist.map(d => (
          <div key={d.rating} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: '100%', background: '#f97316', borderRadius: '4px 4px 0 0',
              height: `${Math.round((d.count / max) * 64)}px`,
              minHeight: d.count > 0 ? 4 : 0, transition: 'height 0.6s',
            }} />
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>{'⭐'.repeat(d.rating)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Leaderboard = ({ entries }) => {
  const MEDALS = ['🥇', '🥈', '🥉'];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Award size={18} color="#f97316" />
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0 }}>Top Performers</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {entries.map((e, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 16px', borderRadius: 12,
            background: i === 0 ? '#fff7ed' : '#f8fafc',
            border: `1px solid ${i === 0 ? '#fed7aa' : '#e2e8f0'}`,
          }}>
            <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>{MEDALS[i] || `#${i + 1}`}</span>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{e.nickname}</span>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#f97316' }}>{e.points} pts</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{e.time_taken > 0 ? `${e.time_taken}s` : '—'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuestionReport = ({ sessionId, slideId }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId || !slideId) return;
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(`${API}/sessions/${sessionId}/question-report/${slideId}`, { headers: { Accept: 'application/json' } });
        const json = await res.json();
        if (active && json.status) setReport(json.data);
      } catch { }
      finally { if (active) setLoading(false); }
    };
    load();
    const t = setInterval(load, 5000);
    return () => { active = false; clearInterval(t); };
  }, [sessionId, slideId]);

  if (loading) return (
    <ReportOverlay>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, margin: '0 auto', border: '3px solid #f1f5f9', borderTop: '3px solid #f97316', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: 16, fontSize: 16, color: '#64748b' }}>Loading results...</p>
      </div>
    </ReportOverlay>
  );

  if (!report) return null;

  const { question, stats, leaderboard } = report;
  const type = question?.type || 'mcq';

  return (
    <ReportOverlay>
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#f0fdf4', border: '1px solid #10b981',
          borderRadius: 30, padding: '6px 18px', marginBottom: 14,
        }}>
          <BarChart2 size={16} color="#10b981" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>Question Results</span>
        </div>

        {/* السؤال + الإجابة الصحيحة جنبه */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#1e293b', margin: 0, lineHeight: 1.3 }}>
            {question?.text}
          </h2>
          {question?.correct_answer && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#dcfce7', border: '2px solid #16a34a',
              borderRadius: 20, padding: '4px 14px',
              fontSize: 15, fontWeight: 800, color: '#15803d',
              whiteSpace: 'nowrap',
            }}>
              <CheckCircle size={16} color="#16a34a" />
              {question.correct_answer}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Answered', val: stats.total_responses, bg: '#f8fafc', border: '#e2e8f0', color: '#1e293b', icon: <Users size={18} color="#64748b" /> },
          { label: 'Correct ✓', val: stats.correct_count ?? '—', bg: '#f0fdf4', border: '#10b981', color: '#16a34a', icon: <CheckCircle size={18} color="#10b981" /> },
          { label: 'Wrong ✗', val: stats.wrong_count ?? '—', bg: '#fef2f2', border: '#ef4444', color: '#dc2626', icon: <XCircle size={18} color="#ef4444" /> },
          {
            label: 'No Answer',
            val: stats.no_answer_count ?? 0,
            bg: '#fafafa',
            border: '#94a3b8',
            color: '#475569',
            icon: <AlertCircle size={18} color="#94a3b8" />
          },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `2px solid ${s.border}`, borderRadius: 16, padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 6 }}>
          <span>Participation rate</span>
          <span style={{ fontWeight: 700 }}>{stats.participation_rate}%</span>
        </div>
        <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${stats.participation_rate}%`, background: 'linear-gradient(90deg,#f97316,#ea580c)', borderRadius: 4, transition: 'width 0.8s' }} />
        </div>
      </div>

      {(type === 'mcq' || type === 'true_false') && (
        <>

          <OptionsChart
            options={stats.type_stats?.length > 0 ? stats.type_stats : (question.options || []).map((opt, i) => ({
              text: typeof opt === 'object' ? opt.text : opt,
              count: 0,
              percent: 0,
              is_correct: i === question.correct_index,
            }))}
            correctIndex={question.correct_index}
            total={stats.total_responses}
          />
        </>
      )}

      {(type === 'text' || type === 'open') && <TextAnswers answers={stats.type_stats} />}
      {type === 'rating' && stats.type_stats && <RatingChart data={stats.type_stats} />}
      {leaderboard?.length > 0 && <Leaderboard entries={leaderboard} />}
    </ReportOverlay>
  );
};

const ScaledSlide = ({ slide, themeId }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const resolvedThemeId = (themeId && themeId !== 0) ? themeId : parseInt(localStorage.getItem('current_theme') || '0');

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setScale(Math.min(width / 960, height / 540));
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', pointerEvents: 'none', userSelect: 'none' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: 960, height: 540, transform: `translate(-50%,-50%) scale(${scale})`, transformOrigin: 'center center', pointerEvents: 'none', userSelect: 'none' }}>
        <div style={{ width: 960, height: 540, position: 'relative', overflow: 'hidden', background: '#fff', pointerEvents: 'none', userSelect: 'none' }}>
          <ThemeManager themeId={resolvedThemeId} />
          <SlideRenderer slide={slide} isThumbnail={false} isReadOnly={true} themeId={resolvedThemeId} />
        </div>
      </div>
    </div>
  );
};

const DisplayContent = () => {
  const { sessionId } = useParams();

  const [currentSlide, setCurrentSlide] = useState(null);
  const [themeId, setThemeId] = useState(parseInt(localStorage.getItem('current_theme') || '0'));
  const [status, setStatus] = useState('connecting');
  const [isQuestionExpired, setIsQuestionExpired] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportSlideId, setReportSlideId] = useState(null);

  const pollingRef = useRef(null);
  const lastSlideId = useRef(null);
  const sid = sessionId || localStorage.getItem('session_id_presenter');
  const isQuestion = currentSlide?.layout === 'QUESTION' || !!currentSlide?.questionData;

  const fetchSlide = useCallback(async () => {
    if (!sid) return;
    try {
      const res = await fetch(`${API}/sessions/${sid}/current-slide`, { headers: { Accept: 'application/json' } });
      const json = await res.json();

      let activeSlideId = lastSlideId.current;

      if (json.status && json.data?.slide) {
        const newSlide = json.data.slide;
        activeSlideId = newSlide.id;

        if (newSlide.id !== lastSlideId.current) {
          lastSlideId.current = newSlide.id;
          setIsQuestionExpired(false);
          setShowReport(false);
          setReportSlideId(null);
        }

        setCurrentSlide(newSlide);
        setStatus('live');

        if (json.data.question_info) {
          setIsQuestionExpired(!json.data.question_info.is_active);
        }

        if (json.data.template_id != null) {
          const tid = parseInt(json.data.template_id);
          setThemeId(tid);
          localStorage.setItem('current_theme', tid);
        }
      } else {
        setStatus('waiting');
      }

      const sRes = await fetch(`${API}/sessions/${sid}/status`, { headers: { Accept: 'application/json' } });
      const sData = await sRes.json();

      if (sData.data?.session_status === 'finished') {
        setStatus('ended');
        clearInterval(pollingRef.current);
        return;
      }

      if (sData.data?.show_results) {
        setShowReport(true);
        if (activeSlideId) {
          setReportSlideId(activeSlideId);
        }
      } else {
        setShowReport(false);
        setReportSlideId(null);
      }
    } catch { }
  }, [sid]);

  useEffect(() => {
    if (!sid) { setStatus('no-session'); return; }
    fetchSlide();
    pollingRef.current = setInterval(fetchSlide, 2500);
    return () => clearInterval(pollingRef.current);
  }, [sid]);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'SLIDE_CHANGE') {
        fetchSlide();
        setIsQuestionExpired(false);
        setShowReport(false);
        setReportSlideId(null);
      }
      if (e.data?.type === 'THEME_CHANGE') {
        setThemeId(e.data.themeId);
        localStorage.setItem('current_theme', e.data.themeId);
      }
      if (e.data?.type === 'QUESTION_EXPIRED') setIsQuestionExpired(true);
      if (e.data?.type === 'SHOW_RESULTS') {
        setShowReport(true);
        setReportSlideId(e.data.slideId || lastSlideId.current);
      }
      if (e.data?.type === 'HIDE_RESULTS') setShowReport(false);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [fetchSlide]);

  if (status === 'no-session') return <Screen><Msg icon="⚠️" title="No active session" /></Screen>;
  if (status === 'ended') return <Screen><Msg icon="✅" title="Session Ended" sub="Thank you!" /></Screen>;
  if (!currentSlide) return (
    <Screen>
      <div style={{ width: 44, height: 44, border: '3px solid #334155', borderTop: '3px solid #f97316', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <span style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginTop: 16 }}>
        {status === 'waiting' ? 'Waiting for presenter...' : 'Connecting...'}
      </span>
    </Screen>
  );

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>

      <ScaledSlide slide={currentSlide} themeId={themeId} />

      {isQuestion && isQuestionExpired && !showReport && (
        <QuestionExpiredMessage />
      )}

      {showReport && (
        <QuestionReport sessionId={sid} slideId={reportSlideId ?? currentSlide?.id} />
      )}

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow: hidden; }
        @keyframes spin { to { transform: rotate(360deg) } }
        [contenteditable] { pointer-events: none !important; user-select: none !important; cursor: default !important; }
      `}</style>
    </div>
  );
};

const Screen = ({ children }) => (
  <div style={{ width: '100vw', height: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
    {children}
  </div>
);

const Msg = ({ icon, title, sub }) => (
  <>
    <span style={{ fontSize: 48 }}>{icon}</span>
    <span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{title}</span>
    {sub && <span style={{ color: '#64748b', fontSize: 14 }}>{sub}</span>}
  </>
);

const DisplayPage = () => (
  <EditorProvider><DisplayContent /></EditorProvider>
);

export default DisplayPage;
