// src/pages/DisplayPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { EditorProvider } from '../components/Editor/EditorContext';
import SlideRenderer from '../components/Editor/SlideRenderer';
import ThemeManager from '../templates/ThemeManager';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'https://sada-api-b5qk.onrender.com/api';

// ── عداد دائري كبير للشاشة الكبيرة ───────────────────────
const BigTimer = ({ seconds, total }) => {
  const r    = 52;
  const circ = 2 * Math.PI * r;
  const fill = ((total - seconds) / total) * circ;
  const color = seconds <= 5 ? '#ef4444' : seconds <= 10 ? '#f97316' : '#10b981';
  return (
    <div style={{ position: 'relative', width: 130, height: 130 }}>
      <svg width={130} height={130} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={65} cy={65} r={r} fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" strokeWidth={8} />
        <circle cx={65} cy={65} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={fill} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke .3s', filter: `drop-shadow(0 0 8px ${color})` }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 36, fontWeight: 900, color, fontFamily: 'monospace',
          textShadow: `0 0 12px ${color}40` }}>{seconds}</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>SEC</span>
      </div>
    </div>
  );
};

// ── نتيجة السؤال على الشاشة الكبيرة ──────────────────────
const ResultsOverlay = ({ questionData, sessionId, slideId }) => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!sessionId || !slideId) return;
    const fetch_ = async () => {
      try {
        const res  = await fetch(`${API}/sessions/${sessionId}/slide-results/${slideId}`, { headers: { Accept: 'application/json' } });
        const data = await res.json();
        if (data.status) setResults(data.data);
      } catch {}
    };
    fetch_();
    const t = setInterval(fetch_, 3000);
    return () => clearInterval(t);
  }, [sessionId, slideId]);

  const options  = questionData?.options       || [];
  const correctI = questionData?.correctAnswer ?? null;
  const total    = results?.total_responses    || 0;
  const COLORS   = ['#3b82f6','#10b981','#f59e0b','#ef4444'];

  return (
    <div style={RO.overlay}>
      <div style={RO.card}>
        <div style={RO.statsRow}>
          {[
            { label: 'Answered', val: total,                        bg: '#f8fafc',  border: '#e2e8f0', color: '#1e293b' },
            { label: 'Correct ✓', val: results?.correct_count||0,  bg: '#f0fdf4',  border: '#10b981', color: '#16a34a' },
            { label: 'Wrong ✗',   val: results?.incorrect_count||0,bg: '#fef2f2',  border: '#ef4444', color: '#dc2626' },
          ].map(s => (
            <div key={s.label} style={{ flex:1, background:s.bg, border:`2px solid ${s.border}`, borderRadius:16, padding:'16px', textAlign:'center' }}>
              <span style={{ display:'block', fontSize:40, fontWeight:900, color:s.color }}>{s.val}</span>
              <span style={{ display:'block', fontSize:14, color:'#64748b', fontWeight:700, marginTop:4 }}>{s.label}</span>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {options.map((opt, i) => {
            const r     = results?.results?.find(r => r.answer_index === i);
            const count = r?.count || 0;
            const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
            const isOk  = i === correctI;
            return (
              <div key={i} style={{ position:'relative', borderRadius:16, overflow:'hidden',
                border:`2px solid ${isOk ? '#10b981' : COLORS[i%4]}`, height:72,
                background: isOk ? '#f0fdf4' : '#fff' }}>
                <div style={{ position:'absolute', top:0, left:0, height:'100%', width:`${pct}%`,
                  background: isOk ? '#10b98122' : COLORS[i%4]+'22', transition:'width .6s' }} />
                <div style={{ position:'relative', display:'flex', alignItems:'center', gap:12, padding:'0 16px', height:'100%' }}>
                  <div style={{ width:36, height:36, borderRadius:'50%',
                    background: isOk ? '#10b981' : COLORS[i%4],
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:'#fff', fontSize:16, fontWeight:900, flexShrink:0 }}>
                    {isOk ? <CheckCircle size={18} color="#fff" /> : String.fromCharCode(65+i)}
                  </div>
                  <span style={{ flex:1, fontSize:16, fontWeight:700, color:'#1e293b' }}>{opt}</span>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:28, fontWeight:900, color: isOk ? '#10b981' : '#1e293b' }}>{pct}%</div>
                    <div style={{ fontSize:13, color:'#64748b' }}>{count} votes</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ height:12, borderRadius:6, overflow:'hidden', display:'flex', gap:2 }}>
          <div style={{ flex: results?.correct_percent||0, background:'#10b981', borderRadius:'4px 0 0 4px', transition:'flex .5s', minWidth:1 }} />
          <div style={{ flex: 100-(results?.correct_percent||0), background:'#ef4444', borderRadius:'0 4px 4px 0', transition:'flex .5s', minWidth:1 }} />
        </div>
        <div style={{ textAlign:'center', fontSize:16, color:'#475569', fontWeight:700 }}>
          {results?.correct_percent||0}% answered correctly
        </div>
      </div>
    </div>
  );
};

// ── DisplaySlide ───────────────────────────────────────────
const DisplaySlide = ({ slide, themeId }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

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
    <div ref={containerRef} style={{ width:'100%', height:'100%', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'50%', left:'50%', width:960, height:540,
        transform:`translate(-50%,-50%) scale(${scale})`, transformOrigin:'center center' }}>
        <div style={{ width:960, height:540, position:'relative', overflow:'hidden', background:'#fff' }}>
          <ThemeManager themeId={themeId} />
          <SlideRenderer slide={slide} isThumbnail={true} themeId={themeId} />
        </div>
      </div>
    </div>
  );
};

// ── العداد الكبير فوق الشريحة (لشرائح الأسئلة فقط) ───────
const QuestionTimer = ({ questionData, isTimesUp }) => {
  const total    = questionData?.timer || 30;
  const [seconds, setSeconds] = useState(total);
  const timerRef = useRef(null);

  useEffect(() => {
    setSeconds(total);
    timerRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(timerRef.current); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [questionData?.timer]);

  if (isTimesUp || seconds === 0) {
    return (
      <div style={QT.timesUp}>
        <Clock size={32} color="#ef4444" />
        <span style={{ fontSize: 28, fontWeight: 900, color: '#ef4444' }}>Time's Up!</span>
      </div>
    );
  }

  return (
    <div style={QT.wrapper}>
      <BigTimer seconds={seconds} total={total} />
    </div>
  );
};

const QT = {
  wrapper:  { position:'absolute', top:16, right:16, zIndex:100 },
  timesUp:  { position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
    zIndex:100, display:'flex', flexDirection:'column', alignItems:'center', gap:8,
    background:'rgba(255,255,255,0.95)', borderRadius:20, padding:'24px 40px',
    boxShadow:'0 8px 32px rgba(239,68,68,0.3)', border:'2px solid #ef4444' },
};

// ── المحتوى الرئيسي ───────────────────────────────────────
const DisplayContent = () => {
  const { sessionId } = useParams();
  const [currentSlide,  setCurrentSlide]  = useState(null);
  const [themeId,       setThemeId]       = useState(parseInt(localStorage.getItem('current_theme')||'0'));
  const [status,        setStatus]        = useState('connecting');
  const [debugMsg,      setDebugMsg]      = useState('');
  const [showResults,   setShowResults]   = useState(false);
  const [resultSlideId, setResultSlideId] = useState(null);
  const [resultQData,   setResultQData]   = useState(null);
  const [isTimesUp,     setIsTimesUp]     = useState(false);

  const pollingRef = useRef(null);
  const sid = sessionId || localStorage.getItem('session_id_presenter');

  const isQuestion = currentSlide?.layout === 'QUESTION' || !!currentSlide?.questionData;

  const fetchCurrentSlide = useCallback(async () => {
    if (!sid) return;
    try {
      const res  = await fetch(`${API}/sessions/${sid}/current-slide`, { headers: { Accept: 'application/json' } });
      const json = await res.json();
      if (json.status && json.data?.slide) {
        const newSlide = json.data.slide;
        // شريحة جديدة → أعد العداد
        if (newSlide.id !== currentSlide?.id) {
          setIsTimesUp(false);
          setShowResults(false);
        }
        setCurrentSlide(newSlide);
        if (json.data.template_id != null) {
          const tid = parseInt(json.data.template_id);
          setThemeId(tid);
          localStorage.setItem('current_theme', tid);
        }
        setStatus('live');
      } else if (['ended','finished'].includes(json.data?.session_status)) {
        setStatus('ended'); clearInterval(pollingRef.current);
      } else {
        setStatus('waiting');
      }
      // فحص show_results
      const sRes  = await fetch(`${API}/sessions/${sid}/status`, { headers: { Accept: 'application/json' } });
      const sData = await sRes.json();
      if (sData.data?.show_results !== undefined) setShowResults(!!sData.data.show_results);
    } catch (err) { setDebugMsg(`Error: ${err.message}`); }
  }, [sid, currentSlide?.id]);

  useEffect(() => {
    if (!sid) { setStatus('no-session'); return; }
    setDebugMsg(`Session: ${sid}`);
    fetchCurrentSlide();
    pollingRef.current = setInterval(fetchCurrentSlide, 2000);
    return () => clearInterval(pollingRef.current);
  }, [sid, fetchCurrentSlide]);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'SLIDE_CHANGE')  { fetchCurrentSlide(); setShowResults(false); setIsTimesUp(false); }
      if (e.data?.type === 'THEME_CHANGE')  { setThemeId(e.data.themeId); localStorage.setItem('current_theme', e.data.themeId); }
      if (e.data?.type === 'SHOW_RESULTS')  { setShowResults(true); setResultSlideId(e.data.slideId); setResultQData(e.data.questionData); }
      if (e.data?.type === 'HIDE_RESULTS')  { setShowResults(false); }
      if (e.data?.type === 'TIMES_UP')      { setIsTimesUp(true); }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [fetchCurrentSlide]);

  if (status === 'no-session') return (
    <div style={S.overlay}><div style={S.box}>
      <span style={{ fontSize:48 }}>⚠️</span>
      <span style={S.msg}>No active session found</span>
    </div></div>
  );
  if (status === 'ended') return (
    <div style={S.overlay}><div style={S.box}>
      <span style={{ fontSize:48 }}>✅</span>
      <span style={S.msg}>Session Ended</span>
      <span style={S.sub}>Thank you!</span>
    </div></div>
  );
  if (!currentSlide) return (
    <div style={S.overlay}><div style={S.box}>
      <div style={S.spinner} />
      <span style={S.msg}>{status==='waiting'?'Waiting for presenter...':'Connecting...'}</span>
      <span style={S.sub}>{debugMsg}</span>
    </div><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>
  );

  return (
    <div style={S.slideRoot}>
      <DisplaySlide slide={currentSlide} themeId={themeId} />

      {/* عداد السؤال - يظهر فوق الشريحة */}
      {isQuestion && !showResults && (
        <QuestionTimer
          questionData={currentSlide?.questionData}
          isTimesUp={isTimesUp}
        />
      )}

      {/* نتيجة السؤال overlay */}
      {showResults && (
        <ResultsOverlay
          questionData={resultQData || currentSlide?.questionData}
          sessionId={sid}
          slideId={resultSlideId || currentSlide?.id}
        />
      )}

      <style>{`*{box-sizing:border-box;margin:0;padding:0;}body{overflow:hidden;}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

const DisplayPage = () => (
  <EditorProvider><DisplayContent /></EditorProvider>
);
export default DisplayPage;

const S = {
  overlay:   { width:'100vw', height:'100vh', background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center' },
  box:       { display:'flex', flexDirection:'column', alignItems:'center', gap:12 },
  spinner:   { width:44, height:44, border:'3px solid #334155', borderTop:'3px solid #f97316', borderRadius:'50%', animation:'spin 1s linear infinite' },
  msg:       { color:'#fff', fontSize:18, fontWeight:700, marginTop:8 },
  sub:       { color:'#64748b', fontSize:12 },
  slideRoot: { width:'100vw', height:'100vh', background:'#000', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' },
};

const RO = {
  overlay: { position:'absolute', inset:0, background:'rgba(15,23,42,.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:40, backdropFilter:'blur(4px)' },
  card:    { background:'#fff', borderRadius:24, padding:36, maxWidth:800, width:'100%', display:'flex', flexDirection:'column', gap:20, fontFamily:"'Segoe UI',sans-serif" },
  statsRow:{ display:'flex', gap:16 },
};
