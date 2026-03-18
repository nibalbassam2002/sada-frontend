// src/pages/SessionPage.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Users, Copy, Check,
  Maximize, Minimize, Wifi, Clock, Radio,
  BarChart2, Square, Monitor
} from 'lucide-react';
import QRCode from 'react-qr-code';
import ScaledSlide from '../components/Session/ScaledSlide';
import { EditorProvider, useEditor } from '../components/Editor/EditorContext';

const API = 'https://sada-api-b5qk.onrender.com/api';

const SessionContent = () => {
  const { id: presentationId } = useParams();
  const navigate = useNavigate();

  const { slides, currentSlideIndex, nextSlide, prevSlide, isLoading, title } = useEditor();

  const sessionCode = localStorage.getItem('session_code') || '';
  const sessionId   = localStorage.getItem('session_id_presenter') || null;
  const joinUrl     = `${window.location.origin}/join/${sessionCode}`;
  const formatted   = sessionCode ? `${sessionCode.slice(0,3)} ${sessionCode.slice(3)}` : '— — —';

  const [participants, setParticipants] = useState([]);
  const [elapsed,      setElapsed]      = useState(0);
  const [copiedCode,   setCopiedCode]   = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const displayRef   = useRef(null);
  const containerRef = useRef(null);
  const pollingRef   = useRef(null);
  const prevIndexRef = useRef(currentSlideIndex);

  // Timer
  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // Poll participants
  useEffect(() => {
    if (!sessionId) return;
    const poll = async () => {
      try {
        const res = await fetch(`${API}/sessions/${sessionId}/participants`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, Accept: 'application/json' }
        });
        const data = await res.json();
        if (data.status) setParticipants(data.data.participants || []);
      } catch {}
    };
    poll();
    pollingRef.current = setInterval(poll, 3000);
    return () => clearInterval(pollingRef.current);
  }, [sessionId]);

  // Send slide change
  useEffect(() => {
    if (!sessionId) return;
    if (prevIndexRef.current === currentSlideIndex) return;
    prevIndexRef.current = currentSlideIndex;
    const slide = slides[currentSlideIndex];
    if (!slide) return;
    fetch(`${API}/sessions/${sessionId}/slide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`, Accept: 'application/json' },
      body: JSON.stringify({ slide_id: slide.id }),
    }).catch(() => {});

    // Sync display window if open
    if (displayRef.current && !displayRef.current.closed) {
      try { displayRef.current.postMessage({ type: 'SLIDE_CHANGE', index: currentSlideIndex }, '*'); } catch {}
    }
  }, [currentSlideIndex, sessionId, slides]);

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      if (['ArrowRight', 'Space', 'PageDown'].includes(e.key)) { e.preventDefault(); nextSlide(); }
      if (['ArrowLeft', 'PageUp'].includes(e.key))             { e.preventDefault(); prevSlide(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextSlide, prevSlide]);

  // Fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  // Open display window (شاشة البروجكتور)
  const openDisplay = () => {
    const url = `/display/${presentationId}`;
    const w = window.open(url, 'sada-display', 'width=1280,height=720');
    displayRef.current = w;
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(sessionCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleEnd = async () => {
    if (!window.confirm('End the current session?')) return;
    try {
      await fetch(`${API}/sessions/${sessionId}/end`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, Accept: 'application/json' }
      });
    } catch {}
    localStorage.removeItem('session_active');
    localStorage.removeItem('session_id_presenter');
    localStorage.removeItem('session_code');
    if (displayRef.current && !displayRef.current.closed) displayRef.current.close();
    navigate(`/editor/${presentationId}`);
  };

  const currentSlide = slides[currentSlideIndex];
  const isQuestion   = currentSlide?.layout === 'QUESTION';

  if (isLoading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
        height:'100vh', background:'#0f172a', color:'#fff', fontSize:18 }}>
        Loading session...
      </div>
    );
  }

  return (
    <div ref={containerRef} style={S.root}>

      {/* TOP BAR */}
      <header style={S.topBar}>
        <div style={S.codeSection}>
          <div style={S.liveDot} />
          <span style={S.liveLabel}>LIVE</span>
          <div style={S.codeBox}>
            <span style={S.codeVal}>{formatted}</span>
            <button style={S.iconBtn} onClick={handleCopyCode}>
              {copiedCode ? <Check size={14} color="#10b981" /> : <Copy size={14} color="#f97316" />}
            </button>
          </div>
          <span style={S.joinLink}>sada.app/join</span>
        </div>

        <div style={S.centerSection}>
          <span style={S.titleText}>{title || 'Presentation'}</span>
          <span style={S.slideCounter}>{currentSlideIndex + 1} / {slides.length}</span>
        </div>

        <div style={S.rightSection}>
          <div style={S.timerBox}>
            <Clock size={13} color="#94a3b8" />
            <span style={{ fontFamily:'monospace', fontSize:13, color:'#94a3b8' }}>{formatTime(elapsed)}</span>
          </div>
          {/* زر شاشة البروجكتور */}
          <button style={{ ...S.iconBtnGhost, gap: 6, fontSize: 12, color: '#94a3b8' }} onClick={openDisplay} title="Open Display Screen">
            <Monitor size={15} />
            Display
          </button>
          <button style={S.iconBtnGhost} onClick={toggleFullscreen} title="Fullscreen">
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
          <button style={S.endBtn} onClick={handleEnd}>
            <Square size={14} fill="#dc2626" color="#dc2626" />
            End
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main style={S.main}>

        {/* Slide area */}
        <div style={S.slideArea}>
          <button style={{ ...S.navBtn, left: 16, opacity: currentSlideIndex === 0 ? 0.3 : 1 }}
            onClick={prevSlide} disabled={currentSlideIndex === 0}>
            <ChevronLeft size={28} />
          </button>

          <div style={S.slideWrapper}>
            {currentSlide && <ScaledSlide slide={currentSlide} />}
          </div>

          <button style={{ ...S.navBtn, right: 16, opacity: currentSlideIndex === slides.length - 1 ? 0.3 : 1 }}
            onClick={nextSlide} disabled={currentSlideIndex === slides.length - 1}>
            <ChevronRight size={28} />
          </button>

          <div style={S.slideStrip}>
            {slides.map((s, i) => (
              <div key={s.id} style={{
                ...S.stripDot,
                background: i === currentSlideIndex ? '#f97316' : i < currentSlideIndex ? '#fed7aa' : '#334155',
                width: i === currentSlideIndex ? 20 : 8,
              }} />
            ))}
          </div>
        </div>

        {/* Right panel */}
        <aside style={S.panel}>
          <div style={S.panelSection}>
            <div style={S.panelTitle}><Radio size={14} color="#f97316" />Scan to Join</div>
            <div style={S.qrBox}>
              <QRCode value={joinUrl} size={140} bgColor="#ffffff" fgColor="#1e293b" level="M" />
            </div>
            <div style={S.qrCode}>{formatted}</div>
          </div>

          <div style={S.divider} />

          <div style={S.panelSection}>
            <div style={S.panelTitle}>
              <Users size={14} color="#f97316" />
              Participants
              <span style={S.countBadge}>{participants.length}</span>
            </div>
            <div style={S.participantList}>
              {participants.length === 0 ? (
                <div style={{ fontSize:12, color:'#475569', textAlign:'center', padding:'12px 0' }}>
                  Waiting for participants...
                </div>
              ) : (
                participants.slice(0, 8).map((p, i) => (
                  <div key={p.id || i} style={S.participantRow}>
                    <div style={{ ...S.avatar, background: COLORS[i % COLORS.length] }}>
                      {(p.nickname || p.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <span style={S.participantName}>{p.nickname || p.name || 'Anonymous'}</span>
                  </div>
                ))
              )}
              {participants.length > 8 && (
                <div style={{ fontSize:11, color:'#94a3b8', textAlign:'center' }}>
                  +{participants.length - 8} more
                </div>
              )}
            </div>
          </div>

          <div style={S.divider} />

          <div style={S.panelSection}>
            <div style={S.panelTitle}><BarChart2 size={14} color="#f97316" />Current Slide</div>
            <div style={{ fontSize:12, color:'#64748b', lineHeight:1.6 }}>
              <div>Type: <strong style={{ color:'#e2e8f0' }}>{isQuestion ? 'Question' : 'Content'}</strong></div>
              <div>Slide: <strong style={{ color:'#e2e8f0' }}>{currentSlideIndex + 1} of {slides.length}</strong></div>
              {isQuestion && (
                <div style={{ marginTop:8, padding:'6px 10px', background:'#f9731620',
                  borderRadius:8, color:'#f97316', fontSize:11, fontWeight:600 }}>
                  Question — participants can answer
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop:'auto', display:'flex', alignItems:'center',
            gap:6, fontSize:11, color:'#10b981', padding:'0 4px' }}>
            <Wifi size={12} color="#10b981" />Connected
          </div>
        </aside>
      </main>

      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        * { box-sizing: border-box; }
        body { margin: 0; overflow: hidden; }
      `}</style>
    </div>
  );
};

const COLORS = ['#f97316','#3b82f6','#10b981','#8b5cf6','#ef4444','#f59e0b','#06b6d4','#ec4899'];

const SessionPage = () => (
  <EditorProvider>
    <SessionContent />
  </EditorProvider>
);

export default SessionPage;

const S = {
  root: { display:'flex', flexDirection:'column', height:'100dvh', background:'#0f172a', fontFamily:"'Segoe UI',sans-serif", color:'#e2e8f0', overflow:'hidden' },
  topBar: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 20px', background:'#1e293b', borderBottom:'1px solid #334155', gap:16, flexShrink:0, height:56 },
  codeSection: { display:'flex', alignItems:'center', gap:10, flexShrink:0 },
  liveDot: { width:8, height:8, borderRadius:'50%', background:'#ef4444', animation:'livePulse 1.4s infinite', flexShrink:0 },
  liveLabel: { fontSize:11, fontWeight:800, color:'#ef4444', letterSpacing:'.1em' },
  codeBox: { display:'flex', alignItems:'center', gap:6, background:'#fff7ed', borderRadius:8, padding:'4px 10px' },
  codeVal: { fontSize:16, fontWeight:900, color:'#ea580c', fontFamily:'monospace', letterSpacing:3 },
  joinLink: { fontSize:12, color:'#64748b', fontWeight:600 },
  centerSection: { flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2, minWidth:0 },
  titleText: { fontSize:15, fontWeight:700, color:'#f1f5f9', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  slideCounter: { fontSize:11, color:'#64748b', fontWeight:600 },
  rightSection: { display:'flex', alignItems:'center', gap:10, flexShrink:0 },
  timerBox: { display:'flex', alignItems:'center', gap:5, background:'#0f172a', borderRadius:8, padding:'4px 10px' },
  iconBtn: { background:'none', border:'none', cursor:'pointer', padding:4, display:'flex', alignItems:'center' },
  iconBtnGhost: { background:'none', border:'1px solid #334155', borderRadius:8, cursor:'pointer', padding:'5px 8px', color:'#94a3b8', display:'flex', alignItems:'center' },
  endBtn: { display:'flex', alignItems:'center', gap:6, background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'5px 12px', color:'#dc2626', fontSize:13, fontWeight:700, cursor:'pointer' },
  main: { flex:1, display:'flex', overflow:'hidden' },
  slideArea: { flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', padding:'16px 70px', overflow:'hidden' },
  slideWrapper: { width:'100%', maxWidth:960, aspectRatio:'16/9', background:'#fff', borderRadius:12, overflow:'hidden', boxShadow:'0 25px 60px rgba(0,0,0,.5)', position:'relative' },
  navBtn: { position:'absolute', top:'50%', transform:'translateY(-50%)', background:'#1e293b', border:'1px solid #334155', borderRadius:10, width:44, height:44, display:'flex', alignItems:'center', justifyContent:'center', color:'#e2e8f0', cursor:'pointer', zIndex:10, transition:'all .2s' },
  slideStrip: { position:'absolute', bottom:10, display:'flex', alignItems:'center', gap:5 },
  stripDot: { height:8, borderRadius:4, transition:'all .3s' },
  panel: { width:260, flexShrink:0, background:'#1e293b', borderLeft:'1px solid #334155', display:'flex', flexDirection:'column', gap:0, overflowY:'auto', padding:'16px 14px' },
  panelSection: { display:'flex', flexDirection:'column', gap:10 },
  panelTitle: { display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.08em' },
  divider: { height:1, background:'#334155', margin:'14px 0' },
  qrBox: { background:'#fff', borderRadius:12, padding:10, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #f97316' },
  qrCode: { textAlign:'center', fontSize:16, fontWeight:900, color:'#f97316', fontFamily:'monospace', letterSpacing:4 },
  countBadge: { marginLeft:'auto', background:'#f97316', color:'#fff', borderRadius:20, fontSize:11, fontWeight:800, padding:'1px 8px', minWidth:22, textAlign:'center' },
  participantList: { display:'flex', flexDirection:'column', gap:6 },
  participantRow: { display:'flex', alignItems:'center', gap:8 },
  avatar: { width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#fff', flexShrink:0 },
  participantName: { fontSize:13, color:'#cbd5e1', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
};
