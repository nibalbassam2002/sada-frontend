import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronRight, User, Wifi, Users, Radio,
  CheckCircle2, XCircle, PartyPopper, Frown,
  Star, Trophy, Clock, Target
} from 'lucide-react';
import api from '../api/axios';
import logo from '../assets/logo.png';

const PHASES = {
  CODE:       'code',
  NAME:       'name',
  WAITING:    'waiting',
  PRESENTING: 'presenting',
  QUESTION:   'question',
  RESULT:     'result',
};

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

// ── بطاقة خيار - نفس تصميم SlideRenderer ─────────────────
const OptionCard = ({ opt, index, appearance, isSelected, isAnswered, isCorrect, isTF, onClick }) => {
  const accentColor = appearance?.accentColor || '#f59e0b';
  const cardStyle   = appearance?.cardStyle   || 'curved';
  const showLetters = appearance?.showLetters !== false;

  const cardRadius =
    cardStyle === 'sharp'   ? '4px'  :
    cardStyle === 'rounded' ? '28px' : '12px';

  let bg = '#ffffff', borderColor = `${accentColor}55`, textColor = '#1e293b';

  if (isTF) {
    bg          = index === 0 ? '#f0fdf4' : '#fef2f2';
    borderColor = index === 0 ? '#10b981' : '#ef4444';
    textColor   = index === 0 ? '#059669' : '#dc2626';
  }

  if (isAnswered) {
    if (isCorrect)       { bg = '#f0fdf4'; borderColor = '#10b981'; }
    else if (isSelected) { bg = '#fef2f2'; borderColor = '#ef4444'; }
    else                 { bg = '#f8fafc'; borderColor = '#e2e8f0'; }
  }

  const badgeBg = isTF ? (index === 0 ? '#10b981' : '#ef4444') : accentColor;

  return (
    <button onClick={onClick} disabled={isAnswered} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px', background: bg,
      border: `2px solid ${borderColor}`, borderRadius: cardRadius,
      cursor: isAnswered ? 'default' : 'pointer', transition: 'all 0.18s',
      width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      fontFamily: 'inherit',
      transform: isSelected && !isAnswered ? 'scale(0.97)' : 'scale(1)',
      opacity: isAnswered && !isCorrect && !isSelected ? 0.5 : 1,
    }}>
      {showLetters && (
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: isAnswered ? (isCorrect ? '#10b981' : isSelected ? '#ef4444' : '#94a3b8') : badgeBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, color: '#fff', fontSize: 15, fontWeight: 800,
        }}>
          {isTF
            ? (index === 0 ? <CheckCircle2 size={18} color="white" /> : <XCircle size={18} color="white" />)
            : String.fromCharCode(65 + index)}
        </div>
      )}
      <span style={{
        flex: 1, fontSize: 15, fontWeight: isTF ? 700 : 600,
        color: isAnswered ? (isCorrect ? '#059669' : isSelected ? '#dc2626' : '#94a3b8') : textColor,
        textAlign: 'right', lineHeight: 1.4,
      }}>{opt}</span>
      {isAnswered && (isCorrect
        ? <CheckCircle2 size={20} color="#10b981" />
        : isSelected ? <XCircle size={20} color="#ef4444" /> : null)}
    </button>
  );
};

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
  const [lastSlideId,  setLastSlideId]  = useState(null);

  const [selected,   setSelected]   = useState(null);
  const [answered,   setAnswered]   = useState(false);
  const [isCorrect,  setIsCorrect]  = useState(null);
  const [timeLeft,   setTimeLeft]   = useState(30);
  const [score,      setScore]      = useState(0);
  const [timesUp,    setTimesUp]    = useState(false); // انتهى الوقت بدون إجابة

  const pollingRef  = useRef(null);
  const timerRef    = useRef(null);
  const answeredRef = useRef(false);

  const [deviceToken] = useState(
    () => localStorage.getItem('device_token') || crypto.randomUUID()
  );
  useEffect(() => { localStorage.setItem('device_token', deviceToken); }, [deviceToken]);
  useEffect(() => { const t = localStorage.getItem('token'); if (t) navigate('/dashboard'); }, []);
  useEffect(() => {
    if (urlCode) {
      const clean = urlCode.replace(/\D/g, '').slice(0, 6);
      setCode(clean);
      if (clean.length === 6) verifyCode(clean);
    }
  }, [urlCode]);

  const cleanCode = code.replace(/\s/g, '');

  // ── Polling ──────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId || phase === PHASES.CODE || phase === PHASES.NAME) return;
    const poll = async () => {
      try {
        const res   = await api.get(`/sessions/${sessionId}/current-slide`);
        if (!res.data.status) return;
        const slide   = res.data.data.slide || res.data.data;
        const slideId = slide?.id;
        if (slideId && slideId !== lastSlideId) {
          setLastSlideId(slideId);
          setCurrentSlide(slide);
          setSelected(null); setAnswered(false);
          answeredRef.current = false;
          setIsCorrect(null); setTimesUp(false);
          if (slide.layout === 'QUESTION' || slide.questionData) setPhase(PHASES.QUESTION);
          else if (phase !== PHASES.RESULT) setPhase(PHASES.PRESENTING);
        }
        const statusRes = await api.get(`/sessions/${sessionId}/status`);
        if (statusRes.data.data?.session_status === 'finished') {
          clearInterval(pollingRef.current); setPhase(PHASES.WAITING);
        }
      } catch {}
    };
    pollingRef.current = setInterval(poll, 2000);
    return () => clearInterval(pollingRef.current);
  }, [sessionId, phase, lastSlideId]);

  // ── مؤقت السؤال ─────────────────────────────────────────
  useEffect(() => {
    if (phase !== PHASES.QUESTION || answeredRef.current) return;
    const limit = currentSlide?.questionData?.timer || 30;
    setTimeLeft(limit); setTimesUp(false);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (!answeredRef.current) {
            setTimesUp(true);
            handleAnswer(null);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, currentSlide?.id]);

  const verifyCode = async (c) => {
    setIsLoading(true); setError('');
    try {
      const res = await api.get(`/sessions/${c}/info`);
      if (res.data.status) { setSessionInfo(res.data.data); setPhase(PHASES.NAME); }
      else setError('Invalid or expired code.');
    } catch { setError('Invalid or expired code.'); }
    finally { setIsLoading(false); }
  };

  const handleJoin = async () => {
    if (sessionInfo?.require_name && !name.trim()) { setError('Please enter your name.'); return; }
    setIsLoading(true); setError('');
    try {
      const res = await api.post('/sessions/join', { code: cleanCode, nickname: name.trim() || 'Anonymous', device_token: deviceToken });
      if (res.data.status) {
        setSessionId(res.data.data.session_id);
        localStorage.setItem('participant_id', res.data.data.participant_id);
        localStorage.setItem('session_id',     res.data.data.session_id);
        setPhase(PHASES.WAITING);
      } else setError(res.data.message || 'Failed to join.');
    } catch (err) { setError(err.response?.data?.message || 'Failed to join.'); }
    finally { setIsLoading(false); }
  };

  const handleAnswer = async (optionIndex) => {
    if (answeredRef.current) return;
    clearInterval(timerRef.current);
    answeredRef.current = true; setAnswered(true); setSelected(optionIndex);
    try {
      await api.post(`/sessions/${sessionId}/answer`, {
        slide_id:       currentSlide?.id,
        answer_index:   optionIndex,
        answer_value:   optionIndex !== null ? (currentSlide?.questionData?.options?.[optionIndex] || '') : null,
        device_token:   deviceToken,
        participant_id: localStorage.getItem('participant_id'),
        time_taken:     (currentSlide?.questionData?.timer || 30) - timeLeft,
      });
    } catch {}
    const correctIdx = currentSlide?.questionData?.correctAnswer ?? null;
    const correct    = optionIndex !== null && optionIndex === correctIdx;
    setIsCorrect(correct);
    if (correct) setScore(s => s + Math.max(100, (timeLeft || 0) * 10));
    setTimeout(() => setPhase(PHASES.RESULT), 1800);
  };

  const getOptions    = () => currentSlide?.questionData?.options        || [];
  const getQuestion   = () => currentSlide?.questionData?.title          || currentSlide?.title || '';
  const getCorrectIdx = () => currentSlide?.questionData?.correctAnswer  ?? null;
  const getTimer      = () => currentSlide?.questionData?.timer          || 30;
  const getAppearance = () => currentSlide?.questionData?.appearance     || {};
  const getShowCorrect= () => currentSlide?.questionData?.show_correct   || 'after_timer'; // after_timer | manual | never
  const isTF          = (currentSlide?.questionType || 'multiple-choice') === 'true-false';

  // هل نعرض الإجابة الصحيحة؟
  const shouldShowCorrect = getShowCorrect() !== 'never';

  return (
    <div style={S.root}>
      <div style={S.logo}>
        <img src={logo} alt="SADA" style={{ height: 48, cursor: 'pointer' }} onClick={() => navigate('/')} />
      </div>

      {/* [1] CODE */}
      {phase === PHASES.CODE && (
        <div style={S.card}>
          <h1 style={S.title}>Enter Session Code</h1>
          <p style={S.sub}>Get the code from the presenter or scan the QR</p>
          <CodeBoxes value={code} onChange={(v) => { setCode(v); setError(''); }} />
          {error && <p style={S.errBox}>{error}</p>}
          <button style={{ ...S.btnP, opacity: cleanCode.length < 6 || isLoading ? 0.5 : 1 }}
            onClick={() => verifyCode(cleanCode)} disabled={cleanCode.length < 6 || isLoading}>
            {isLoading ? <><span style={S.spin} /> Checking...</> : <>Next <ChevronRight size={18} /></>}
          </button>
          <p style={S.hint}>Or open <strong>sada.app/join</strong></p>
        </div>
      )}

      {/* [2] NAME */}
      {phase === PHASES.NAME && (
        <div style={S.card}>
          <div style={S.sessionBanner}>
            <strong style={{ color: '#92400e', fontSize: 13 }}>{sessionInfo?.presentation_title}</strong>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#b45309', marginTop: 5 }}>
              <Users size={13} color="#f97316" />
              <span>{sessionInfo?.participants_count} participants</span>
              <span style={S.codePill}>{cleanCode.slice(0,3)} {cleanCode.slice(3)}</span>
            </div>
          </div>
          <h1 style={S.title}>{sessionInfo?.require_name ? 'What is your name?' : 'Add a nickname (optional)'}</h1>
          <div style={{ position: 'relative', width: '100%' }}>
            <User size={18} color="#94a3b8" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="e.g. Ahmed, Student123..."
              value={name} onChange={(e) => { setName(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              style={S.nameInput} autoFocus maxLength={30} />
          </div>
          {error && <p style={S.errBox}>{error}</p>}
          <button style={{ ...S.btnP, opacity: (sessionInfo?.require_name && !name.trim()) || isLoading ? 0.5 : 1 }}
            onClick={handleJoin} disabled={(sessionInfo?.require_name && !name.trim()) || isLoading}>
            {isLoading ? <><span style={S.spin} /> Joining...</> : <>Join Session <ChevronRight size={18} /></>}
          </button>
          {!sessionInfo?.require_name && <button style={S.btnBack} onClick={handleJoin}>Join anonymously</button>}
          <button style={S.btnBack} onClick={() => { setPhase(PHASES.CODE); setError(''); }}>← Change code</button>
        </div>
      )}

      {/* [3] WAITING */}
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
            <span>Code: <strong style={{ color: '#ea580c', fontFamily: 'monospace' }}>{cleanCode.slice(0,3)} {cleanCode.slice(3)}</strong></span>
            <Wifi size={14} color="#10b981" />
            <span style={{ color: '#10b981' }}>Connected</span>
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            {[0,1,2].map((i) => <span key={i} style={{ ...S.dot, animationDelay: `${i*.3}s` }} />)}
          </div>
        </div>
      )}

      {/* [4] PRESENTING */}
      {phase === PHASES.PRESENTING && (
        <div style={S.card}>
          <Radio size={48} color="#f97316" />
          <h1 style={S.title}>Presenter is talking…</h1>
          <p style={S.sub}>Follow along on the main screen</p>
          <div style={S.sessionInfo}>
            <Wifi size={14} color="#10b981" />
            <span style={{ color: '#10b981' }}>Live</span>
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            {[0,1,2].map((i) => <span key={i} style={{ ...S.dot, animationDelay: `${i*.3}s` }} />)}
          </div>
          <p style={{ fontSize: 11, color: '#cbd5e1', textAlign: 'center' }}>A question will appear here automatically</p>
        </div>
      )}

      {/* [5] QUESTION */}
      {phase === PHASES.QUESTION && currentSlide && (() => {
        const appearance  = getAppearance();
        const accentColor = appearance.accentColor || '#f59e0b';
        const layoutMode  = appearance.layoutMode  || 'grid';
        const options     = getOptions();
        return (
          <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* المؤقت */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
              background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
              <CircleTimer seconds={timeLeft} total={getTimer()} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>
                  {isTF ? 'True or False' : 'Multiple Choice'}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: accentColor }}>
                  <Trophy size={13} style={{ marginLeft: 4, verticalAlign: 'middle' }} />
                  Score: {score}
                </div>
              </div>
            </div>
            {/* السؤال */}
            <div style={{ background: '#fff', borderRadius: 18, padding: '20px 24px',
              boxShadow: '0 4px 16px rgba(0,0,0,.06)', borderTop: `4px solid ${accentColor}` }}>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#1e293b', textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
                {getQuestion()}
              </p>
            </div>
            {/* الخيارات */}
            <div style={{ display: 'grid', gridTemplateColumns: layoutMode === 'list' ? '1fr' : '1fr 1fr', gap: 10 }}>
              {options.map((opt, i) => (
                <OptionCard key={i} opt={opt} index={i} appearance={appearance}
                  isSelected={selected === i} isAnswered={answered}
                  isCorrect={answered && i === getCorrectIdx()}
                  isTF={isTF} onClick={() => handleAnswer(i)} />
              ))}
            </div>
            {answered && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13,
                color: '#64748b', background: '#f8fafc', border: '1px solid #e2e8f0',
                borderRadius: 12, padding: '10px 16px', justifyContent: 'center' }}>
                <span style={S.spin2} /> Waiting for results…
              </div>
            )}
          </div>
        );
      })()}

      {/* [6] RESULT - بأيقونات بدل إيموجي */}
      {phase === PHASES.RESULT && (
        <div style={S.card}>
          {timesUp ? (
            // انتهى الوقت بدون إجابة
            <>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#fff7ed',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={36} color="#f97316" />
              </div>
              <h1 style={{ ...S.title, color: '#f97316' }}>Time's Up!</h1>
              <p style={{ fontSize: 14, color: '#94a3b8' }}>You didn't answer in time</p>
            </>
          ) : isCorrect ? (
            // إجابة صحيحة
            <>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0fdf4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 0 8px #dcfce7' }}>
                <CheckCircle2 size={40} color="#10b981" />
              </div>
              <h1 style={{ ...S.title, color: '#10b981' }}>Correct!</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7,
                background: '#fefce8', border: '1px solid #fef08a', borderRadius: 20,
                padding: '7px 18px', fontSize: 16, fontWeight: 900, color: '#ca8a04' }}>
                <Star size={16} color="#ca8a04" fill="#ca8a04" />
                +{Math.max(100, (timeLeft||0)*10)} points
              </div>
            </>
          ) : (
            // إجابة خاطئة
            <>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#fef2f2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 0 8px #fee2e2' }}>
                <XCircle size={40} color="#ef4444" />
              </div>
              <h1 style={{ ...S.title, color: '#ef4444' }}>Wrong Answer</h1>
            </>
          )}

          {/* النقاط الإجمالية */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 14, color: '#475569', background: '#f8fafc',
            border: '1px solid #e2e8f0', borderRadius: 12, padding: '8px 16px' }}>
            <Trophy size={15} color="#f97316" />
            Total score: <strong style={{ color: '#f97316' }}>{score}</strong>
          </div>

          {/* الإجابة الصحيحة - حسب إعداد show_correct */}
          {shouldShowCorrect && getCorrectIdx() !== null && (
            <div style={{ width: '100%', padding: '12px 16px', background: '#f0fdf4',
              border: '1px solid #bbf7d0', borderRadius: 12,
              display: 'flex', alignItems: 'center', gap: 8 }}>
              <Target size={16} color="#16a34a" />
              <div>
                <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>Correct answer</span>
                <span style={{ fontWeight: 800, color: '#16a34a', fontSize: 15 }}>
                  {getOptions()[getCorrectIdx()]}
                </span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 7 }}>
              {[0,1,2].map((i) => <span key={i} style={{ ...S.dot, animationDelay: `${i*.3}s` }} />)}
            </div>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>Waiting for the next question…</span>
          </div>
        </div>
      )}

      <p style={{ marginTop: 24, fontSize: 11, color: '#cbd5e1' }}>
        Powered by <strong>SADA</strong> · sada.app
      </p>

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        input:focus{outline:none!important;border-color:#f97316!important;box-shadow:0 0 0 3px rgba(249,115,22,.15)!important;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes ringPulse{0%{transform:scale(.85);opacity:.9;}100%{transform:scale(1.7);opacity:0;}}
        @keyframes dotBounce{0%,80%,100%{transform:scale(.5);opacity:.4;}40%{transform:scale(1.2);opacity:1;}}
        @keyframes spin{to{transform:rotate(360deg);}}
      `}</style>
    </div>
  );
};

const S = {
  root: { minHeight: '100dvh', background: 'linear-gradient(160deg,#fff7ed 0%,#ffffff 50%,#fff7ed 100%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '70px 16px 32px', fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif" },
  logo: { position: 'fixed', top: 16, left: 20, zIndex: 10 },
  card: { width: '100%', maxWidth: 400, background: '#fff', borderRadius: 24, padding: '36px 28px',
    boxShadow: '0 20px 60px rgba(249,115,22,.1),0 4px 20px rgba(0,0,0,.06)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, animation: 'fadeUp .4s ease' },
  title: { fontSize: 22, fontWeight: 900, color: '#1e293b', textAlign: 'center', lineHeight: 1.3 },
  sub:   { fontSize: 14, color: '#94a3b8', textAlign: 'center', lineHeight: 1.6 },
  codeRow: { display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0' },
  codeBox: { width: 46, height: 58, borderRadius: 12, border: '2.5px solid',
    textAlign: 'center', fontSize: 24, fontWeight: 900, fontFamily: 'monospace', transition: 'all .2s', cursor: 'text' },
  codeSep: { fontSize: 22, color: '#e2e8f0', fontWeight: 700 },
  nameInput: { width: '100%', padding: '14px 48px 14px 16px', borderRadius: 14,
    border: '2px solid #e2e8f0', fontSize: 15, color: '#1e293b', background: '#f8fafc',
    fontFamily: 'inherit', transition: 'border .2s' },
  btnP: { width: '100%', padding: '14px', borderRadius: 14, border: 'none',
    background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', fontSize: 15, fontWeight: 800,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
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
