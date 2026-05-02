import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronRight, User, Wifi, Users, Radio,
  CheckCircle2, XCircle, Trophy, Clock
} from 'lucide-react';
import api from '../api/axios';
import logo from '../assets/logo.png';

const PHASES = {
  CODE: 'code',
  NAME: 'name',
  WAITING: 'waiting',
  PRESENTING: 'presenting',
  QUESTION: 'question',
  ENDED: 'ended',
};

// ── 6 خانات الكود ─────────────────────────────────────────
const CodeBoxes = ({ value, onChange }) => {
  const refs = useRef([]);
  const handleChange = (i, e) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    const arr = value.padEnd(6, ' ').split('');
    arr[i] = digit || ' ';
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
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <React.Fragment key={i}>
          {i === 3 && <span style={S.codeSep}>–</span>}
          <input
            ref={(el) => (refs.current[i] = el)}
            type="text" inputMode="numeric" maxLength={1}
            value={value[i]?.trim() || ''}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            style={{
              ...S.codeBox,
              borderColor: value[i]?.trim() ? '#f97316' : '#e2e8f0',
              background: value[i]?.trim() ? '#fff7ed' : '#f8fafc',
              color: value[i]?.trim() ? '#ea580c' : '#94a3b8',
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

// ── مؤقت دائري ────────────────────────────────────────────
const CircleTimer = ({ seconds, total }) => {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? Math.max(0, seconds / total) : 0;
  const offset = (1 - pct) * circ;
  const color = seconds <= 5 ? '#ef4444' : seconds <= 10 ? '#f97316' : '#10b981';
  return (
    <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
      <svg width={80} height={80} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={40} cy={40} r={r} fill="none" stroke="#f1f5f9" strokeWidth={6} />
        <circle cx={40} cy={40} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke .3s' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 20, fontWeight: 900, color, fontFamily: 'monospace',
      }}>
        {seconds}
      </div>
    </div>
  );
};

// ── بطاقة خيار ────────────────────────────────────────────
const OptionCard = ({ opt, index, appearance, isAnswered, isTF, onClick }) => {
  const accentColor = appearance?.accentColor || '#f59e0b';
  const cardStyle = appearance?.cardStyle || 'curved';
  const showLetters = appearance?.showLetters !== false;
  const cardRadius =
    cardStyle === 'sharp' ? '4px' :
      cardStyle === 'rounded' ? '28px' : '12px';

  let bg = '#ffffff', borderColor = `${accentColor}55`, textColor = '#1e293b';
  if (isTF) {
    bg = index === 0 ? '#f0fdf4' : '#fef2f2';
    borderColor = index === 0 ? '#10b981' : '#ef4444';
    textColor = index === 0 ? '#059669' : '#dc2626';
  }
  const badgeBg = isTF ? (index === 0 ? '#10b981' : '#ef4444') : accentColor;

  return (
    <button onClick={(e) => { e.preventDefault(); onClick(index); }} disabled={isAnswered} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px', background: bg,
      border: `2px solid ${borderColor}`, borderRadius: cardRadius,
      cursor: isAnswered ? 'default' : 'pointer', transition: 'all 0.18s',
      width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      fontFamily: 'inherit', opacity: isAnswered ? 0.5 : 1,
    }}>
      {showLetters && (
        <div style={{
          width: 36, height: 36, borderRadius: '50%', background: badgeBg,
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
        color: textColor, textAlign: 'right', lineHeight: 1.4,
      }}>{opt}</span>
    </button>
  );
};

// ════════════════════════════════════════════════════════════
const JoinPage = () => {
  const { code: urlCode } = useParams();
  const navigate = useNavigate();

  const [phase, setPhase] = useState(PHASES.CODE);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [lastSlideId, setLastSlideId] = useState(null);

  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const timeLeftRef = useRef(30);
  const [timesUp, setTimesUp] = useState(false);

  const pollingRef = useRef(null);
  const timerRef = useRef(null);
  const answeredRef = useRef(false);
  const timerStarted = useRef(false);
  const totalDuration = useRef(30);
  const sessionIdRef = useRef(null);
  const currentSlideRef = useRef(null);

  useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);
  useEffect(() => { currentSlideRef.current = currentSlide; }, [currentSlide]);

  // ── localStorage helpers ───────────────────────────────
  const getAnsweredSlides = () => {
    try { return JSON.parse(localStorage.getItem('answered_slides') || '{}'); }
    catch { return {}; }
  };

  const markSlideAnswered = (slideId, answerIndex) => {
    const obj = getAnsweredSlides();
    const key = `${sessionIdRef.current}_${slideId}`;
    obj[key] = { answerIndex, timestamp: Date.now() };
    localStorage.setItem('answered_slides', JSON.stringify(obj));
  };

  const hasAnsweredSlide = (slideId) => {
    const key = `${sessionIdRef.current}_${slideId}`;
    return !!getAnsweredSlides()[key];
  };

  const [deviceToken] = useState(
    () => localStorage.getItem('device_token') || crypto.randomUUID()
  );

  useEffect(() => { localStorage.setItem('device_token', deviceToken); }, [deviceToken]);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) navigate('/dashboard');
  }, []);

  useEffect(() => {
    if (urlCode) {
      const clean = urlCode.replace(/\D/g, '').slice(0, 6);
      setCode(clean);
      if (clean.length === 6) verifyCode(clean);
    }
  }, [urlCode]);

  const cleanCode = code.replace(/\s/g, '');

  // ── handleAnswer ────────────────────────────────────────
  const handleAnswer = useCallback(async (optionIndex) => {
    if (answeredRef.current) return;
    clearInterval(timerRef.current);
    answeredRef.current = true;
    setAnswered(true);

    const activeSid = sessionIdRef.current;
    const activeSlide = currentSlideRef.current;

    if (activeSlide?.id) {
      markSlideAnswered(activeSlide.id, optionIndex);
    }

    try {
      await api.post(`/sessions/${activeSid}/answer`, {
        slide_id: String(activeSlide?.id),
        answer_index: optionIndex !== null && optionIndex !== undefined
          ? parseInt(optionIndex)
          : null,
        answer_value: optionIndex !== null
          ? (activeSlide?.questionData?.options?.[optionIndex] || '')
          : null,
        device_token: deviceToken,
        time_taken: totalDuration.current - timeLeftRef.current,
      });
    } catch (err) {
      console.error('Answer submission failed:', err);
    }

    setPhase(PHASES.WAITING);
  }, [deviceToken]);

  // ── جلب الوقت من السيرفر وتشغيل التايمر ──────────────
  const fetchAndStartTimer = useCallback(async (sid) => {
    if (timerStarted.current) return;

    try {
      const res = await api.get(`/sessions/${sid}/user-remaining-time`, {
        params: { device_token: deviceToken }
      });

      if (!res.data.status || !res.data.data) return;
      const data = res.data.data;

      if (!data.is_active || data.remaining_seconds <= 0) {
        if (!answeredRef.current) handleAnswer(null);
        return;
      }

      const remaining = data.remaining_seconds;
      totalDuration.current = data.user_duration || 30;
      timerStarted.current = true;

      setTimeLeft(remaining);
      timeLeftRef.current = remaining;
      setTimesUp(false);

      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          const next = t <= 1 ? 0 : t - 1;
          timeLeftRef.current = next;
          if (next === 0) {
            clearInterval(timerRef.current);
            if (!answeredRef.current) {
              setTimesUp(true);
              handleAnswer(null);
            }
          }
          return next;
        });
      }, 1000);

    } catch {
      if (!timerStarted.current) {
        const fallback = currentSlideRef.current?.questionData?.timer || 30;
        totalDuration.current = fallback;
        timerStarted.current = true;
        setTimeLeft(fallback);
        timeLeftRef.current = fallback;
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setTimeLeft(t => {
            const next = t <= 1 ? 0 : t - 1;
            timeLeftRef.current = next;
            if (next === 0) {
              clearInterval(timerRef.current);
              if (!answeredRef.current) {
                setTimesUp(true);
                handleAnswer(null);
              }
            }
            return next;
          });
        }, 1000);
      }
    }
  }, [deviceToken, handleAnswer]);

  // ── Polling الشريحة الحالية ──────────────────────────
  useEffect(() => {
    if (!sessionId || phase === PHASES.CODE || phase === PHASES.NAME) return;

    const poll = async () => {
      try {
        const res = await api.get(`/sessions/${sessionId}/current-slide`);
        if (!res.data.status) return;

        const slideData = res.data.data;
        const slide = slideData.slide || slideData;
        // ✅ السطر الصحيح — بدون تكرار
        const slideId = slide?.id;
        const questionInfo = slideData.question_info || null;

        if (slideId && slideId !== lastSlideId) {
          clearInterval(timerRef.current);
          timerStarted.current = false;
          answeredRef.current = false;

          setLastSlideId(slideId);
          setCurrentSlide(slide);
          setTimesUp(false);
          setAnswered(false);

          const alreadyAnswered = hasAnsweredSlide(slideId);
          const isQ = slide.layout === 'QUESTION' || !!slide.questionData;

          if (isQ) {
            if (alreadyAnswered || questionInfo?.is_active === false) {
              answeredRef.current = true;
              setAnswered(true);
              setPhase(PHASES.WAITING);
            } else {
              setPhase(PHASES.QUESTION);
              fetchAndStartTimer(sessionId);
            }
          } else {
            setPhase(PHASES.PRESENTING);
          }

        } else if (slideId && slideId === lastSlideId) {
          const isQ = slide?.layout === 'QUESTION' || !!slide?.questionData;
          if (isQ && questionInfo?.is_active === false && phase === PHASES.QUESTION) {
            clearInterval(timerRef.current);
            if (!answeredRef.current) {
              answeredRef.current = true;
              setAnswered(true);
            }
            setPhase(PHASES.WAITING);
          }
        }

        // تحقق من انتهاء الجلسة
        const statusRes = await api.get(`/sessions/${sessionId}/status`);
        if (statusRes.data.data?.session_status === 'finished') {
          clearInterval(pollingRef.current);
          clearInterval(timerRef.current);
          localStorage.removeItem('answered_slides');
          setPhase(PHASES.ENDED);
        }
      } catch { }
    };

    poll();
    pollingRef.current = setInterval(poll, 2000);
    return () => clearInterval(pollingRef.current);
  }, [sessionId, phase, lastSlideId, fetchAndStartTimer]);

  useEffect(() => {
    return () => {
      clearInterval(pollingRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

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
      const res = await api.post('/sessions/join', {
        code: cleanCode,
        nickname: name.trim() || 'Anonymous',
        device_token: deviceToken,
      });
      if (res.data.status) {
        setSessionId(res.data.data.session_id);
        localStorage.setItem('participant_id', res.data.data.participant_id);
        localStorage.setItem('session_id', res.data.data.session_id);
        localStorage.removeItem('answered_slides');
        setPhase(PHASES.WAITING);
      } else setError(res.data.message || 'Failed to join.');
    } catch (err) { setError(err.response?.data?.message || 'Failed to join.'); }
    finally { setIsLoading(false); }
  };

  const getOptions = () => currentSlide?.questionData?.options || [];
  const getQuestion = () => currentSlide?.questionData?.title || currentSlide?.title || '';
  const getAppearance = () => currentSlide?.questionData?.appearance || {};
  const isTF = (currentSlide?.questionType || 'multiple-choice') === 'true-false';

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
          <button
            style={{ ...S.btnP, opacity: cleanCode.length < 6 || isLoading ? 0.5 : 1 }}
            onClick={() => verifyCode(cleanCode)}
            disabled={cleanCode.length < 6 || isLoading}>
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
              <span style={S.codePill}>{cleanCode.slice(0, 3)} {cleanCode.slice(3)}</span>
            </div>
          </div>
          <h1 style={S.title}>{sessionInfo?.require_name ? 'What is your name?' : 'Add a nickname (optional)'}</h1>
          <div style={{ position: 'relative', width: '100%' }}>
            <User size={18} color="#94a3b8" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text" placeholder="e.g. Ahmed, Student123..."
              value={name} onChange={(e) => { setName(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              style={S.nameInput} autoFocus maxLength={30}
            />
          </div>
          {error && <p style={S.errBox}>{error}</p>}
          <button
            style={{ ...S.btnP, opacity: (sessionInfo?.require_name && !name.trim()) || isLoading ? 0.5 : 1 }}
            onClick={handleJoin}
            disabled={(sessionInfo?.require_name && !name.trim()) || isLoading}>
            {isLoading ? <><span style={S.spin} /> Joining...</> : <>Join Session <ChevronRight size={18} /></>}
          </button>
          {!sessionInfo?.require_name && (
            <button style={S.btnBack} onClick={handleJoin}>Join anonymously</button>
          )}
          <button style={S.btnBack} onClick={() => { setPhase(PHASES.CODE); setError(''); }}>← Change code</button>
        </div>
      )}

      {/* [3] WAITING */}
      {phase === PHASES.WAITING && (
        <div style={S.card}>
          <div style={S.pulseWrap}>
            {[90, 65, 42].map((size, i) => (
              <div key={i} style={{
                position: 'absolute', width: size, height: size,
                borderRadius: '50%', border: '3px solid #f97316',
                animation: `ringPulse 2s ease-out ${i * .5}s infinite`,
              }} />
            ))}
            <Radio size={26} color="#f97316" style={{ zIndex: 1 }} />
          </div>

          <h1 style={S.title}>You're in!</h1>
          {name && <div style={S.nameBadge}>Welcome, <strong>{name}</strong></div>}

          {currentSlide?.id && hasAnsweredSlide(currentSlide.id) ? (
            <div style={S.answeredBanner}>
              <CheckCircle2 size={18} color="#16a34a" />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#15803d' }}>Answer submitted!</div>
                <div style={{ fontSize: 12, color: '#16a34a', marginTop: 2 }}>Waiting for next question…</div>
              </div>
            </div>
          ) : (
            <p style={S.sub}>Waiting for the next question…</p>
          )}

          <div style={S.sessionInfo}>
            <Users size={14} color="#f97316" />
            <span>Code: <strong style={{ color: '#ea580c', fontFamily: 'monospace' }}>
              {cleanCode.slice(0, 3)} {cleanCode.slice(3)}
            </strong></span>
            <Wifi size={14} color="#10b981" />
            <span style={{ color: '#10b981' }}>Connected</span>
          </div>

          <div style={{ display: 'flex', gap: 7 }}>
            {[0, 1, 2].map((i) => <span key={i} style={{ ...S.dot, animationDelay: `${i * .3}s` }} />)}
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
            {[0, 1, 2].map((i) => <span key={i} style={{ ...S.dot, animationDelay: `${i * .3}s` }} />)}
          </div>
          <p style={{ fontSize: 11, color: '#cbd5e1', textAlign: 'center' }}>
            A question will appear here automatically
          </p>
        </div>
      )}

      {/* [5] QUESTION */}
      {phase === PHASES.QUESTION && currentSlide && (() => {
        const appearance = getAppearance();
        const accentColor = appearance.accentColor || '#f59e0b';
        const layoutMode = appearance.layoutMode || 'grid';
        const options = getOptions();
        return (
          <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
              background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,.06)',
            }}>
              <CircleTimer seconds={Math.max(0, timeLeft)} total={totalDuration.current} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>
                  {isTF ? 'True or False' : 'Multiple Choice'}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: accentColor }}>
                  <Trophy size={13} style={{ marginLeft: 4, verticalAlign: 'middle' }} />
                  Answer the question
                </div>
              </div>
            </div>

            <div style={{
              background: '#fff', borderRadius: 18, padding: '20px 24px',
              boxShadow: '0 4px 16px rgba(0,0,0,.06)', borderTop: `4px solid ${accentColor}`,
            }}>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#1e293b', textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
                {getQuestion()}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: layoutMode === 'list' ? '1fr' : '1fr 1fr',
              gap: 10,
            }}>
              {options.map((opt, i) => (
                <OptionCard
                  key={i} opt={opt} index={i} appearance={appearance}
                  isAnswered={answered} isTF={isTF}
                  onClick={() => handleAnswer(i)}
                />
              ))}
            </div>

            {timesUp && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12,
                padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 14, fontWeight: 700, color: '#dc2626',
              }}>
                <Clock size={18} color="#dc2626" />
                Time's up! Moving on…
              </div>
            )}
          </div>
        );
      })()}

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
      {/* [6] ENDED */}
{phase === PHASES.ENDED && (
  <div style={S.card}>
    <div style={{
      width: 80, height: 80, borderRadius: '50%',
      background: 'linear-gradient(135deg,#f97316,#ea580c)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 8,
    }}>
      <Trophy size={36} color="#fff" />
    </div>
    <h1 style={S.title}>Session Ended</h1>
    <p style={S.sub}>Thank you for participating!</p>
    <div style={{
      width: '100%', padding: '16px',
      background: 'linear-gradient(135deg,#fff7ed,#ffedd5)',
      border: '1px solid #fed7aa', borderRadius: 16,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 13, color: '#92400e', fontWeight: 600 }}>
         Great job! See you next time.
      </div>
    </div>
    <button style={S.btnP} onClick={() => navigate('/')}>
      Back to Home <ChevronRight size={18} />
    </button>
  </div>
)}
    </div>
  );
};

const S = {
  root: {
    minHeight: '100dvh',
    background: 'linear-gradient(160deg,#fff7ed 0%,#ffffff 50%,#fff7ed 100%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '70px 12px 32px', fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif",
  },
  logo: { position: 'fixed', top: 16, left: 20, zIndex: 10 },
  card: {
    width: '100%', maxWidth: 400, background: '#fff', borderRadius: 24, padding: '32px 20px',
    boxShadow: '0 20px 60px rgba(249,115,22,.1),0 4px 20px rgba(0,0,0,.06)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
    animation: 'fadeUp .4s ease',
  },
  title: { fontSize: 22, fontWeight: 900, color: '#1e293b', textAlign: 'center', lineHeight: 1.3 },
  sub: { fontSize: 14, color: '#94a3b8', textAlign: 'center', lineHeight: 1.6 },
  codeRow: { display: 'flex', alignItems: 'center', gap: 4, margin: '4px 0' },
  codeBox: {
    width: 'clamp(36px, 11vw, 46px)', height: 'clamp(48px, 13vw, 58px)', borderRadius: 12, border: '2.5px solid',
    textAlign: 'center', fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: 900,
    fontFamily: 'monospace', transition: 'all .2s', cursor: 'text',
  },
  codeSep: { fontSize: 'clamp(16px, 4vw, 22px)', color: '#e2e8f0', fontWeight: 700 },
  nameInput: {
    width: '100%', padding: '14px 48px 14px 16px', borderRadius: 14,
    border: '2px solid #e2e8f0', fontSize: 15, color: '#1e293b',
    background: '#f8fafc', fontFamily: 'inherit', transition: 'border .2s',
  },
  btnP: {
    width: '100%', padding: '14px', borderRadius: 14, border: 'none',
    background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff',
    fontSize: 15, fontWeight: 800, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    boxShadow: '0 6px 20px rgba(249,115,22,.3)', fontFamily: 'inherit',
  },
  btnBack: {
    background: 'none', border: 'none', color: '#94a3b8',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    textDecoration: 'underline', fontFamily: 'inherit',
  },
  errBox: {
    width: '100%', padding: '9px 14px', background: '#fef2f2',
    border: '1px solid #fecaca', borderRadius: 10,
    fontSize: 13, color: '#dc2626', textAlign: 'center',
  },
  hint: { fontSize: 12, color: '#94a3b8', textAlign: 'center' },
  spin: {
    display: 'inline-block', width: 15, height: 15,
    border: '2.5px solid rgba(255,255,255,.35)', borderTopColor: '#fff',
    borderRadius: '50%', animation: 'spin .7s linear infinite',
  },
  sessionBanner: {
    width: '100%', padding: '11px 14px', background: '#fff7ed',
    border: '1px solid #fed7aa', borderRadius: 12,
  },
  codePill: {
    background: '#f97316', color: '#fff', borderRadius: 20,
    padding: '1px 8px', fontWeight: 700, fontFamily: 'monospace', marginRight: 'auto',
  },
  nameBadge: {
    background: '#f0fdf4', border: '1px solid #bbf7d0',
    borderRadius: 20, padding: '6px 18px',
    fontSize: 15, fontWeight: 700, color: '#16a34a',
  },
  answeredBanner: {
    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 16px', background: '#f0fdf4',
    border: '1px solid #bbf7d0', borderRadius: 14,
  },
  sessionInfo: {
    display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b',
    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12,
    padding: '8px 14px', flexWrap: 'wrap', justifyContent: 'center',
  },
  pulseWrap: {
    position: 'relative', width: 90, height: 90,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  dot: {
    width: 9, height: 9, borderRadius: '50%', background: '#f97316',
    display: 'inline-block', animation: 'dotBounce 1.4s infinite',
  },
};

export default JoinPage;
