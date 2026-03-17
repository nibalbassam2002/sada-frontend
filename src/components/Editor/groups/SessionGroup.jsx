// src/components/Editor/groups/SessionGroup.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Square, Users, Copy, Check,
  ExternalLink, MessageSquare, Trophy, User, Loader2
} from 'lucide-react';
import { useEditor } from '../EditorContext';
import LobbyView from '../../LiveSession/LobbyView';
import api from '../../../api/axios';

const SessionGroup = () => {
  const { title, showToast, currentSlideIndex, slides } = useEditor();
  const presentationId = window.location.pathname.split('/').pop();

  const [sessionType,     setSessionType]     = useState('in_person');
  const [requireName,     setRequireName]     = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [allowChat,       setAllowChat]       = useState(false);

  const [sessionActive, setSessionActive] = useState(
    () => localStorage.getItem('session_active') === 'true'
  );
  const [sessionId, setSessionId] = useState(
    () => localStorage.getItem('session_id_presenter') || null
  );
  const [sessionCode, setSessionCode] = useState(
    () => localStorage.getItem('session_code') || ''
  );
  const [participants, setParticipants] = useState([]);
  const [copiedCode,   setCopiedCode]   = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [showLobby,    setShowLobby]    = useState(false);

  const pollingRef   = useRef(null);
  const prevIndexRef = useRef(currentSlideIndex);
  const formatted    = sessionCode
    ? `${sessionCode.slice(0, 3)} ${sessionCode.slice(3)}`
    : '';

  useEffect(() => {
    if (!sessionActive || !sessionId) return;
    const fetchP = async () => {
      try {
        const res = await api.get(`/sessions/${sessionId}/participants`);
        if (res.data.status) setParticipants(res.data.data.participants || []);
      } catch {}
    };
    fetchP();
    pollingRef.current = setInterval(fetchP, 3000);
    return () => clearInterval(pollingRef.current);
  }, [sessionActive, sessionId]);

  useEffect(() => {
    if (!sessionActive || !sessionId) return;
    if (prevIndexRef.current === currentSlideIndex) return;
    prevIndexRef.current = currentSlideIndex;
    const slide = slides[currentSlideIndex];
    if (!slide) return;
    api.post(`/sessions/${sessionId}/slide`, { slide_id: slide.id }).catch(() => {});
  }, [currentSlideIndex, sessionActive, sessionId, slides]);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const res = await api.post(
        `/presentations/${presentationId}/sessions/start`,
        { session_settings: { session_type: sessionType, require_name: requireName,
            show_leaderboard: showLeaderboard, allow_chat: allowChat } }
      );
      if (res.data.status) {
        const { session_id, access_code } = res.data.data;
        localStorage.setItem('session_active',       'true');
        localStorage.setItem('session_id_presenter', String(session_id));
        localStorage.setItem('session_code',         access_code);
        setSessionId(session_id);
        setSessionCode(access_code);
        setSessionActive(true);
        setShowLobby(true);
        showToast('Session started!');
      }
    } catch { showToast('Failed to start session.'); }
    finally  { setIsLoading(false); }
  };

  const handleLaunch = async () => {
    // أغلق اللوبي فوراً — بدون انتظار الـ API
    setShowLobby(false);
    showToast('Presentation started!');
    try { await api.post(`/sessions/${sessionId}/launch`); } catch {}
  };

  const handleEnd = async () => {
    if (!window.confirm('End the current session?')) return;
    try {
      await api.post(`/sessions/${sessionId}/end`);
      clearInterval(pollingRef.current);
      localStorage.removeItem('session_active');
      localStorage.removeItem('session_id_presenter');
      localStorage.removeItem('session_code');
      setSessionActive(false);
      setShowLobby(false);
      setSessionId(null);
      setSessionCode('');
      setParticipants([]);
      showToast('Session ended');
    } catch { showToast('Failed to end session.'); }
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(sessionCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // BEFORE SESSION
  if (!sessionActive) {
    return (
      <>
        <div className="ribbon-group">
          <div className="group-content-flex">
            <button className="btn-mega" onClick={handleStart} disabled={isLoading} style={S.startBtn}>
              {isLoading
                ? <Loader2 size={22} color="white" style={{ animation: 'spin .7s linear infinite' }} />
                : <Play size={26} fill="white" color="white" />}
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
                {isLoading ? 'Starting...' : 'Start Session'}
              </span>
            </button>
          </div>
          <div className="group-label">Control</div>
        </div>
        <div className="v-divider-slim" />
        <div className="ribbon-group">
          <div className="group-content-col" style={{ gap: 6 }}>
            {['in_person', 'online'].map((type) => (
              <label key={type} style={S.optionRow} onClick={() => setSessionType(type)}>
                <div style={{ ...S.radioCircle,
                  borderColor: sessionType === type ? '#f97316' : '#d1d5db',
                  background:  sessionType === type ? '#f97316' : 'transparent' }}>
                  {sessionType === type && <div style={S.radioDot} />}
                </div>
                <span style={S.optionLabel}>{type === 'in_person' ? 'In-Person' : 'Online'}</span>
              </label>
            ))}
          </div>
          <div className="group-label">Session Type</div>
        </div>
        <div className="v-divider-slim" />
        <div className="ribbon-group">
          <div className="group-content-col" style={{ gap: 4 }}>
            {[
              { state: requireName,     setter: setRequireName,     icon: <User size={13} color="#64748b" />,          label: 'Require Name' },
              { state: showLeaderboard, setter: setShowLeaderboard, icon: <Trophy size={13} color="#64748b" />,        label: 'Leaderboard' },
              { state: allowChat,       setter: setAllowChat,       icon: <MessageSquare size={13} color="#64748b" />, label: 'Chat' },
            ].map(({ state, setter, icon, label }) => (
              <label key={label} style={S.checkRow} onClick={() => setter(!state)}>
                <div style={{ ...S.checkbox,
                  borderColor: state ? '#f97316' : '#d1d5db',
                  background:  state ? '#f97316' : '#fff' }}>
                  {state && <Check size={10} color="#fff" strokeWidth={3} />}
                </div>
                {icon}
                <span style={S.checkLabel}>{label}</span>
              </label>
            ))}
          </div>
          <div className="group-label">Settings</div>
        </div>
      </>
    );
  }

  // DURING SESSION
  return (
    <>
      <div className="ribbon-group">
        <div className="group-content-flex" style={{ gap: 8, alignItems: 'center' }}>
          <div style={S.liveBadge}><span style={S.liveDot} />LIVE</div>
          <div style={S.codeBox}>
            <span style={S.codeVal}>{formatted}</span>
            <button style={S.iconBtn} onClick={handleCopyCode}>
              {copiedCode ? <Check size={13} color="#10b981" /> : <Copy size={13} color="#f97316" />}
            </button>
          </div>
        </div>
        <div className="group-label">Join Code</div>
      </div>
      <div className="v-divider-slim" />
      <div className="ribbon-group">
        <div className="group-content-col" style={{ gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={15} color="#f97316" />
            <span style={{ fontSize: 20, fontWeight: 900, color: '#f97316', fontFamily: 'monospace' }}>
              {participants.length}
            </span>
            <span style={{ fontSize: 11, color: '#64748b' }}>participants</span>
          </div>
          <button className="btn-mini-wide" onClick={() => setShowLobby(true)}
            style={{ color: '#f97316', fontWeight: 600, fontSize: 11 }}>
            <ExternalLink size={12} /> Open Lobby
          </button>
        </div>
        <div className="group-label">Participants</div>
      </div>
      <div className="v-divider-slim" />
      <div className="ribbon-group">
        <div className="group-content-flex">
          <button className="btn-mega" onClick={handleEnd} style={S.endBtn}>
            <Square size={22} fill="#dc2626" color="#dc2626" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626' }}>End Session</span>
          </button>
        </div>
        <div className="group-label">Control</div>
      </div>

      {showLobby && (
        <LobbyView
          sessionCode={sessionCode}
          sessionTitle={title || 'Presentation'}
          sessionType={sessionType}
          participants={participants}
          onStart={handleLaunch}
          onClose={() => setShowLobby(false)}
        />
      )}
    </>
  );
};

const S = {
  startBtn: { background: 'linear-gradient(135deg,#f97316,#ea580c)', border: 'none', borderRadius: 10, padding: '6px 16px', minWidth: 95, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, boxShadow: '0 4px 12px rgba(249,115,22,.3)' },
  endBtn:   { background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 10, padding: '6px 14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 80 },
  optionRow:   { display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' },
  optionLabel: { fontSize: 12, color: '#374151', userSelect: 'none' },
  radioCircle: { width: 14, height: 14, borderRadius: '50%', border: '2px solid', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s', flexShrink: 0 },
  radioDot:    { width: 5, height: 5, borderRadius: '50%', background: '#fff' },
  checkRow:    { display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none' },
  checkbox:    { width: 14, height: 14, borderRadius: 4, border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s', flexShrink: 0, cursor: 'pointer' },
  checkLabel:  { fontSize: 12, color: '#374151' },
  liveBadge:   { display: 'flex', alignItems: 'center', gap: 5, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 20, padding: '3px 8px', fontSize: 10, fontWeight: 800, color: '#dc2626', letterSpacing: '.08em', flexShrink: 0 },
  liveDot:     { width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'livePulse 1.4s infinite' },
  codeBox:     { display: 'flex', alignItems: 'center', gap: 5, background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: 8, padding: '4px 10px' },
  codeVal:     { fontSize: 17, fontWeight: 900, color: '#ea580c', fontFamily: 'monospace', letterSpacing: 3 },
  iconBtn:     { background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' },
};

export default SessionGroup;
