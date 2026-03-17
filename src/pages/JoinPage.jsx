import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, User, Wifi, Users, Radio } from 'lucide-react';
import api from '../api/axios';
import logo from '../assets/logo.png';

const PHASES = {
  CODE:       'code',
  NAME:       'name',
  WAITING:    'waiting',    // انتظار المقدم يبدأ
  PRESENTING: 'presenting', // المقدم يشرح شريحة عادية
  QUESTION:   'question',   // شريحة سؤال
  RESULT:     'result',     // نتيجة الإجابة
};

const OPTION_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
const OPTION_SHAPES = ['◆', '●', '▲', '■'];

// ── 6 خانات الكود ─────────────────────────────────────────
const CodeBoxes = ({ value, onChange }) => {
  const refs = useRef([]);
  const handleChange = (i, e) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    const arr   = value.padEnd(6, ' ').split('');
    arr[i]      = digit || ' ';
    onChange(arr.join('').trimEnd());
    if (digit && i < 5) refs.current[i + 1]?.focus();
  };
  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      const arr = value.padEnd(6, ' ').split('');
      if (!arr[i]?.trim() && i > 0) { refs.current[i - 1]?.focus(); return; }
      arr[i] = ' ';
      onChange(arr.join('').trimEnd());
    }
  };
  const handlePaste = (e) => {
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(p);
    setTimeout(() => refs.current[Math.min(p.length, 5)]?.focus(), 0);
    e.preventDefault();
  };
  return (
    <div style={S.codeRow}>
      {[0,1,2,3,4,5].map((i) => (
        <React.Fragment key={i}>
          {i === 3 && <span style={S.codeSep}>–</span>}
          <input
            ref={(el) => (refs.current[i] = el)}
            type="text" inputMode="numeric" maxLength={1}
            value={value[i]?.trim() || ''}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            style={{ ...S.codeBox,
              borderColor: value[i]?.trim() ? '#f97316' : '#e2e8f0',
              background:  value[i]?.trim() ? '#fff7ed' : '#f8fafc',
              color:       value[i]?.trim() ? '#ea580c' : '#94a3b8',
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

// ── مؤقت دائري ────────────────────────────────────────────
const CircleTimer = ({ seconds, total }) => {
  const r    = 32;
  const circ = 2 * Math.PI * r;
  const fill = ((total - seconds) / total) * circ;
  const color = seconds <= 5 ? '#ef4444' : seconds <= 10 ? '#f97316' : '#10b981';
  return (
    <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
      <svg width={80} height={80} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={40} cy={40} r={r} fill="none" stroke="#f1f5f9" strokeWidth={6} />
        <circle cx={40} cy={40} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={fill} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke .3s' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 20, fontWeight: 900, color, fontFamily: 'monospace' }}>
        {seconds}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
//  الصفحة الرئيسية
// ════════════════════════════════════════════════════════════
const JoinPage = () => {
  const { code: urlCode } = useParams();
  const navigate          = useNavigate();

  const [phase,        setPhase]        = useState(PHASES.CODE);
  const [code,         setCode]         = useState('');
  const [name,         setName]         = useState('');
  const [error,        setError]        = useState('');
  const [isLoading,    setIsLoading]    = useState(false);
  const [sessionInfo,  setSessionInfo]  = useState(null);
  const [sessionId,    setSessionId]    = useState(null);
  const [currentSlide, setCurrentSlide] = useState(null);

  // Question state
  const [selected,  setSelected]  = useState(null);
  const [answered,  setAnswered]  = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft,  setTimeLeft]  = useState(30);
  const [score,     setScore]     = useState(0);

  const pollingRef = useRef(null);
  const timerRef   = useRef(null);
  const [deviceToken] = useState(
    () => localStorage.getItem('device_token') || crypto.randomUUID()
  );

  useEffect(() => {
    localStorage.setItem('device_token', deviceToken);
  }, [deviceToken]);

  // منع المستخدم المسجّل من دخول صفحة الانضمام
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/dashboard');
  }, []);

  // كود من URL
  useEffect(() => {
    if (urlCode) {
      const clean = urlCode.replace(/\D/g, '').slice(0, 6);
      setCode(clean);
      if (clean.length === 6) verifyCode(clean);
    }
  }, [urlCode]);

  const cleanCode = code.replace(/\s/g, '');

  // ── Polling — بعد الانضمام ────────────────────────────
  useEffect(() => {
    if (!sessionId || phase === PHASES.CODE || phase === PHASES.NAME) return;

    const poll = async () => {
      try {
        const res = await api.get(`/sessions/${sessionId}/status`);
        if (!res.data.status) return;

        const { session_status, current_slide_id, is_voting_open } = res.data.data;

        // الجلسة انتهت
        if (session_status === 'finished') {
          clearInterval(pollingRef.current);
          setPhase(PHASES.WAITING);
          return;
        }

        // الجلسة بدأت — جلب بيانات الشريحة الحالية
        if (session_status === 'active' && current_slide_id) {
          try {
            const slideRes = await api.get(`/sessions/${sessionId}/current-slide`);
            if (slideRes.data.status) {
              const slide = slideRes.data.data;
              setCurrentSlide(slide);

              if (slide.category === 'interaction') {
                if (phase !== PHASES.QUESTION && !answered) {
                  setSelected(null);
                  setAnswered(false);
                  setIsCorrect(null);
                  setPhase(PHASES.QUESTION);
                }
              } else {
                if (phase !== PHASES.PRESENTING && phase !== PHASES.RESULT) {
                  setPhase(PHASES.PRESENTING);
                }
              }
            }
          } catch {}
        } else if (session_status === 'waiting' && phase !== PHASES.WAITING) {
          setPhase(PHASES.WAITING);
        }
      } catch {}
    };

    pollingRef.current = setInterval(poll, 2000);
    return () => clearInterval(pollingRef.current);
  }, [sessionId, phase, answered]);

  // ── مؤقت السؤال ─────────────────────────────────────
  useEffect(() => {
    if (phase !== PHASES.QUESTION || answered) return;
    const limit = currentSlide?.settings?.timer || 30;
    setTimeLeft(limit);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleAnswer(null); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, currentSlide]);

  // ── التحقق من الكود ──────────────────────────────────
  const verifyCode = async (codeToCheck) => {
    setIsLoading(true); setError('');
    try {
      const res = await api.get(`/sessions/${codeToCheck}/info`);
      if (res.data.status) {
        setSessionInfo(res.data.data);
        setPhase(PHASES.NAME);
      } else {
        setError('Invalid or expired code. Please try again.');
      }
    } catch {
      setError('Invalid or expired code. Please try again.');
    } finally { setIsLoading(false); }
  };

  // ── الانضمام ─────────────────────────────────────────
  const handleJoin = async () => {
    if (sessionInfo?.require_name && !name.trim()) {
      setError('Please enter your name to continue.'); return;
    }
    setIsLoading(true); setError('');
    try {
      const res = await api.post('/sessions/join', {
        code:         cleanCode,
        nickname:     name.trim() || 'Anonymous',
        device_token: deviceToken,
      });
      if (res.data.status) {
        setSessionId(res.data.data.session_id);
        localStorage.setItem('participant_id', res.data.data.participant_id);
        localStorage.setItem('session_id',     res.data.data.session_id);
        setPhase(PHASES.WAITING);
      } else {
        setError(res.data.message || 'Failed to join.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join.');
    } finally { setIsLoading(false); }
  };

  // ── الإجابة على السؤال ───────────────────────────────
  const handleAnswer = async (optionIndex) => {
    if (answered) return;
    clearInterval(timerRef.current);
    setAnswered(true);
    setSelected(optionIndex);

    // TODO: إرسال الإجابة للـ API
    // await api.post('/responses', { session_id: sessionId, slide_id: currentSlide.id, answer: optionIndex });

    const correctIdx = currentSlide?.content?.correct_answer ?? 0;
    const correct    = optionIndex === correctIdx;
    setIsCorrect(correct);
    if (correct) setScore(s => s + Math.max(100, (timeLeft || 0) * 10));

    setTimeout(() => setPhase(PHASES.RESULT), 1800);
  };

  // ── RENDER ───────────────────────────────────────────
  return (
    <div style={S.root}>
      {/* Logo */}
      <div style={S.logo}>
        <img src={logo} alt="SADA" style={{ height: 48, cursor: 'pointer' }}
          onClick={() => navigate('/')} />
      </div>

      {/* ══ [1] الكود ══════════════════════════════════ */}
      {phase === PHASES.CODE && (
        <div style={S.card}>
          <h1 style={S.title}>Enter Session Code</h1>
          <p style={S.sub}>Get the code from the presenter or scan the QR</p>
          <CodeBoxes value={code} onChange={(v) => { setCode(v); setError(''); }} />
          {error && <p style={S.errBox}>{error}</p>}
          <button style={{ ...S.btnP, opacity: cleanCode.length < 6 || isLoading ? 0.5 : 1 }}
            onClick={() => verifyCode(cleanCode)}
            disabled={cleanCode.length < 6 || isLoading}>
            {isLoading ? <><span style={S.spin} /> Checking...</> : <>Next <ChevronRight size={18} /></>}
          </button>
          <p style={S.hint}>Or open <strong>sada.app/join</strong> and enter the code</p>
        </div>
      )}

      {/* ══ [2] الاسم ══════════════════════════════════ */}
      {phase === PHASES.NAME && (
        <div style={S.card}>
          <div style={S.sessionBanner}>
            <strong style={{ color: '#92400e', fontSize: 13 }}>
              {sessionInfo?.presentation_title}
            </strong>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#b45309', marginTop: 5 }}>
              <Users size={13} color="#f97316" />
              <span>{sessionInfo?.participants_count} participants</span>
              <span style={S.codePill}>{cleanCode.slice(0,3)} {cleanCode.slice(3)}</span>
            </div>
          </div>
          <h1 style={S.title}>
            {sessionInfo?.require_name ? 'What is your name?' : 'Add a nickname (optional)'}
          </h1>
          <p style={S.sub}>
            {sessionInfo?.require_name ? 'This session requires your name' : 'You can join anonymously'}
          </p>
          <div style={{ position: 'relative', width: '100%' }}>
            <User size={18} color="#94a3b8"
              style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="e.g. Ahmed, Student123..."
              value={name} onChange={(e) => { setName(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              style={S.nameInput} autoFocus maxLength={30} />
          </div>
          {error && <p style={S.errBox}>{error}</p>}
          <button
            style={{ ...S.btnP, opacity: (sessionInfo?.require_name && !name.trim()) || isLoading ? 0.5 : 1 }}
            onClick={handleJoin} disabled={(sessionInfo?.require_name && !name.trim()) || isLoading}>
            {isLoading ? <><span style={S.spin} /> Joining...</> : <>Join Session <ChevronRight size={18} /></>}
          </button>
          {!sessionInfo?.require_name && (
            <button style={S.btnBack} onClick={handleJoin}>Join anonymously</button>
          )}
          <button style={S.btnBack} onClick={() => { setPhase(PHASES.CODE); setError(''); }}>
            ← Change code
          </button>
        </div>
      )}

      {/* ══ [3] Waiting ════════════════════════════════ */}
      {phase === PHASES.WAITING && (
        <div style={S.card}>
          <div style={S.pulseWrap}>
            {[90,65,42].map((size, i) => (
              <div key={i} style={{ position: 'absolute', width: size, height: size,
                borderRadius: '50%', border: '3px solid #f97316',
                animation: `ringPulse 2s ease-out ${i*.5}s infinite` }} />
            ))}
            <Radio size={26} color="#f97316" style={{ zIndex: 1 }} />
          </div>
          <h1 style={S.title}>You're in!</h1>
          {name && <div style={S.nameBadge}>Welcome, <strong>{name}</strong></div>}
          <p style={S.sub}>Waiting for the presenter to start…</p>
          <div style={S.sessionInfo}>
            <Users size={14} color="#f97316" />
            <span>Code: <strong style={{ color: '#ea580c', fontFamily: 'monospace' }}>
              {cleanCode.slice(0,3)} {cleanCode.slice(3)}
            </strong></span>
            <Wifi size={14} color="#10b981" />
            <span style={{ color: '#10b981' }}>Connected</span>
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            {[0,1,2].map((i) => <span key={i} style={{ ...S.dot, animationDelay: `${i*.3}s` }} />)}
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', lineHeight: 1.6 }}>
            Don't close this page — it will update automatically
          </p>
        </div>
      )}

      {/* ══ [4] Presenting — شريحة عادية ══════════════ */}
      {phase === PHASES.PRESENTING && (
        <div style={S.card}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>
            <Radio size={48} color="#f97316" />
          </div>
          <h1 style={S.title}>Presenter is talking…</h1>
          <p style={S.sub}>
            {currentSlide?.content?.title || 'Follow along on the main screen'}
          </p>
          <div style={S.sessionInfo}>
            <Wifi size={14} color="#10b981" />
            <span style={{ color: '#10b981' }}>Live</span>
            <Users size={14} color="#64748b" />
            <span style={{ color: '#64748b' }}>Stay on this page</span>
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            {[0,1,2].map((i) => <span key={i} style={{ ...S.dot, animationDelay: `${i*.3}s` }} />)}
          </div>
          <p style={{ fontSize: 11, color: '#cbd5e1', textAlign: 'center' }}>
            A question will appear here automatically
          </p>
        </div>
      )}

      {/* ══ [5] Question — سؤال ════════════════════════ */}
      {phase === PHASES.QUESTION && currentSlide && (
        <div style={{ width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
            background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
            <CircleTimer seconds={timeLeft} total={currentSlide?.settings?.timer || 30} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>
                {currentSlide.type === 'true_false' ? 'True or False' : 'Multiple Choice'}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f97316' }}>
                Score: {score}
              </div>
            </div>
          </div>

          {/* نص السؤال */}
          <div style={{ background: '#fff', borderRadius: 18, padding: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,.06)' }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#1e293b',
              textAlign: 'center', lineHeight: 1.5 }}>
              {currentSlide.content?.title || currentSlide.content?.question}
            </p>
          </div>

          {/* الخيارات */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {(currentSlide.content?.options || []).map((opt, i) => {
              const isSel  = selected === i;
              const show   = answered;
              const isAns  = i === (currentSlide.content?.correct_answer ?? 0);
              let bg = OPTION_COLORS[i % 4];
              if (show) bg = isAns ? '#10b981' : isSel ? '#ef4444' : '#94a3b8';
              return (
                <button key={i} style={{ padding: '16px 12px', borderRadius: 14, border: 'none',
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: bg, color: '#fff', fontWeight: 700, cursor: 'pointer',
                  transition: 'all .18s', boxShadow: '0 4px 12px rgba(0,0,0,.14)',
                  fontFamily: "inherit", minHeight: 64,
                  opacity: show && !isAns && !isSel ? .45 : 1,
                  transform: isSel ? 'scale(.96)' : 'scale(1)' }}
                  onClick={() => handleAnswer(i)} disabled={answered}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{OPTION_SHAPES[i % 4]}</span>
                  <span style={{ flex: 1, fontSize: 14, lineHeight: 1.3 }}>{opt}</span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13,
              color: '#64748b', background: '#f8fafc', border: '1px solid #e2e8f0',
              borderRadius: 12, padding: '10px 16px', justifyContent: 'center' }}>
              <span style={S.spin2} /> Waiting for results…
            </div>
          )}
        </div>
      )}

      {/* ══ [6] Result ═════════════════════════════════ */}
      {phase === PHASES.RESULT && (
        <div style={S.card}>
          <div style={{ fontSize: 54 }}>{isCorrect ? '🎉' : '😅'}</div>
          <h1 style={{ ...S.title, color: isCorrect ? '#10b981' : '#ef4444' }}>
            {isCorrect ? 'Correct!' : 'Wrong answer'}
          </h1>
          {isCorrect && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7,
              background: '#fefce8', border: '1px solid #fef08a', borderRadius: 20,
              padding: '7px 18px', fontSize: 16, fontWeight: 900, color: '#ca8a04' }}>
              +{Math.max(100, (timeLeft||0)*10)} points
            </div>
          )}
          <div style={{ fontSize: 14, color: '#475569' }}>
            Total score: <strong style={{ color: '#f97316' }}>{score}</strong>
          </div>
          <div style={{ width: '100%', padding: '11px 14px', background: '#f0fdf4',
            border: '1px solid #bbf7d0', borderRadius: 12, display: 'flex',
            flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>Correct answer:</span>
            <span style={{ fontWeight: 800, color: '#16a34a', fontSize: 15 }}>
              {currentSlide?.content?.options?.[currentSlide?.content?.correct_answer ?? 0]}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 7 }}>
              {[0,1,2].map((i) => <span key={i} style={{ ...S.dot, animationDelay: `${i*.3}s` }} />)}
            </div>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>
              Waiting for the next question…
            </span>
          </div>
        </div>
      )}

      <p style={{ marginTop: 24, fontSize: 11, color: '#cbd5e1' }}>
        Powered by <strong>SADA</strong> · sada.app
      </p>

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        input:focus{outline:none!important;border-color:#f97316!important;
          box-shadow:0 0 0 3px rgba(249,115,22,.15)!important;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes ringPulse{0%{transform:scale(.85);opacity:.9;}100%{transform:scale(1.7);opacity:0;}}
        @keyframes dotBounce{0%,80%,100%{transform:scale(.5);opacity:.4;}40%{transform:scale(1.2);opacity:1;}}
        @keyframes spin{to{transform:rotate(360deg);}}
      `}</style>
    </div>
  );
};

const S = {
  root: {
    minHeight: '100dvh',
    background: 'linear-gradient(160deg,#fff7ed 0%,#ffffff 50%,#fff7ed 100%)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '70px 16px 32px',
    fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif",
  },
  logo: { position: 'fixed', top: 16, left: 20, zIndex: 10 },
  card: {
    width: '100%', maxWidth: 400, background: '#fff', borderRadius: 24,
    padding: '36px 28px',
    boxShadow: '0 20px 60px rgba(249,115,22,.1),0 4px 20px rgba(0,0,0,.06)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
    animation: 'fadeUp .4s ease',
  },
  title: { fontSize: 22, fontWeight: 900, color: '#1e293b', textAlign: 'center', lineHeight: 1.3 },
  sub:   { fontSize: 14, color: '#94a3b8', textAlign: 'center', lineHeight: 1.6 },
  codeRow: { display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0' },
  codeBox: { width: 46, height: 58, borderRadius: 12, border: '2.5px solid',
    textAlign: 'center', fontSize: 24, fontWeight: 900, fontFamily: 'monospace',
    transition: 'all .2s', cursor: 'text' },
  codeSep: { fontSize: 22, color: '#e2e8f0', fontWeight: 700 },
  nameInput: { width: '100%', padding: '14px 48px 14px 16px', borderRadius: 14,
    border: '2px solid #e2e8f0', fontSize: 15, color: '#1e293b', background: '#f8fafc',
    fontFamily: 'inherit', transition: 'border .2s' },
  btnP: { width: '100%', padding: '14px', borderRadius: 14, border: 'none',
    background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff',
    fontSize: 15, fontWeight: 800, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    boxShadow: '0 6px 20px rgba(249,115,22,.3)', fontFamily: 'inherit' },
  btnBack: { background: 'none', border: 'none', color: '#94a3b8', fontSize: 13,
    fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' },
  errBox: { width: '100%', padding: '9px 14px', background: '#fef2f2',
    border: '1px solid #fecaca', borderRadius: 10, fontSize: 13, color: '#dc2626', textAlign: 'center' },
  hint: { fontSize: 12, color: '#94a3b8', textAlign: 'center' },
  spin: { display: 'inline-block', width: 15, height: 15,
    border: '2.5px solid rgba(255,255,255,.35)', borderTopColor: '#fff',
    borderRadius: '50%', animation: 'spin .7s linear infinite' },
  spin2: { display: 'inline-block', width: 13, height: 13,
    border: '2px solid #e2e8f0', borderTopColor: '#f97316',
    borderRadius: '50%', animation: 'spin .7s linear infinite' },
  sessionBanner: { width: '100%', padding: '11px 14px', background: '#fff7ed',
    border: '1px solid #fed7aa', borderRadius: 12 },
  codePill: { background: '#f97316', color: '#fff', borderRadius: 20,
    padding: '1px 8px', fontWeight: 700, fontFamily: 'monospace', marginRight: 'auto' },
  nameBadge: { background: '#f0fdf4', border: '1px solid #bbf7d0',
    borderRadius: 20, padding: '6px 18px', fontSize: 15, fontWeight: 700, color: '#16a34a' },
  sessionInfo: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b',
    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12,
    padding: '8px 14px', flexWrap: 'wrap', justifyContent: 'center' },
  pulseWrap: { position: 'relative', width: 90, height: 90,
    display: 'flex', alignItems: 'center', justifyContent: 'center' },
  dot: { width: 9, height: 9, borderRadius: '50%', background: '#f97316',
    display: 'inline-block', animation: 'dotBounce 1.4s infinite' },
};

export default JoinPage;
