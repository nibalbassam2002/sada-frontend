// src/components/LiveSession/LobbyView.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'react-qr-code';
import {
  Users, Play, Maximize, Minimize, Smartphone,
  X, Copy, Check, Wifi, Clock, Zap
} from 'lucide-react';
import { useEditor } from '../Editor/EditorContext';
import '../../styles/LobbyView.css';

// ── Avatar Colors ──────────────────────────────────────────
const AVATAR_COLORS = [
  { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
  { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  { bg: '#fdf4ff', text: '#9333ea', border: '#e9d5ff' },
  { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' },
  { bg: '#f0fdfa', text: '#0d9488', border: '#99f6e4' },
  { bg: '#fefce8', text: '#ca8a04', border: '#fef08a' },
  { bg: '#fdf2f8', text: '#db2777', border: '#fbcfe8' },
];

const getAvatarColor = (index) => AVATAR_COLORS[index % AVATAR_COLORS.length];

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

// ════════════════════════════════════════════════════════════
// QR Copy as PNG Component
// ════════════════════════════════════════════════════════════
const QRCopyImageButton = ({ joinUrl, sessionCode }) => {
  const [state, setState] = useState('idle'); // idle | copying | done | error
  const hiddenRef = useRef(null);

  const handleCopy = async () => {
    setState('copying');
    try {
      const svgEl = hiddenRef.current?.querySelector('svg');
      if (!svgEl) throw new Error('no svg');

      const svgStr = new XMLSerializer().serializeToString(svgEl);
      const blob = new Blob([svgStr], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = async () => {
          const size = 340;
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = size;
          const ctx = canvas.getContext('2d');

          // White Background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, size, size);

          // QR in center with padding
          ctx.drawImage(img, 20, 16, size - 40, size - 50);

          // Code under QR in orange
          ctx.fillStyle = '#f97316';
          ctx.font = 'bold 24px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(sessionCode, size / 2, size - 10);

          URL.revokeObjectURL(url);

          canvas.toBlob(async (pngBlob) => {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': pngBlob }),
              ]);
              setState('done');
            } catch {
              // fallback: copy URL
              await navigator.clipboard.writeText(joinUrl);
              setState('done');
            }
            setTimeout(() => setState('idle'), 2500);
            resolve();
          }, 'image/png');
        };
        img.onerror = reject;
        img.src = url;
      });
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 2000);
    }
  };

  return (
    <>
      {/* Hidden QR for canvas drawing */}
      <div ref={hiddenRef} className="lobby-qr-hidden">
        <QRCode value={joinUrl} size={300} bgColor="#ffffff" fgColor="#1e293b" />
      </div>

      <button onClick={handleCopy} className="lobby-qr-copy-btn">
        {state === 'idle' && <><Copy size={15} /> Copy QR as Image</>}
        {state === 'copying' && <><span className="lobby-spinner" /> Copying...</>}
        {state === 'done' && <><Check size={15} color="#10b981" /> Copied! ✓</>}
        {state === 'error' && <><Copy size={15} /> Copy Link</>}
      </button>
    </>
  );
};

// ════════════════════════════════════════════════════════════
// Main Component
// ════════════════════════════════════════════════════════════
const LobbyView = ({
  sessionCode = '552109',
  sessionTitle = 'Presentation Title',
  participants = [],
  onStart,
  onClose,
  sessionType = 'in_person',
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [newJoined, setNewJoined] = useState(null);
  const prevCountRef = useRef(participants.length);
  const containerRef = useRef(null);

  const joinUrl = `${window.location.origin}/join/${sessionCode}`;
  const formattedCode = sessionCode.replace(/(\d{3})(\d{3})/, '$1 $2');

  // ── Timer ──────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // ── New Join Notification ──────────────────────────────
  useEffect(() => {
    if (participants.length > prevCountRef.current) {
      const last = participants[participants.length - 1];
      setNewJoined(typeof last === 'string' ? last : last?.name || 'New Participant');
      setTimeout(() => setNewJoined(null), 3000);
    }
    prevCountRef.current = participants.length;
  }, [participants]);

  // ── Fullscreen ──────────────────────────────────────────
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  // ── Copy Code ───────────────────────────────────────────
  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(sessionCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div ref={containerRef} className="lobby-root" dir="ltr">

      {/* ══ HEADER ════════════════════════════════════════ */}
      <header className="lobby-header">

        {/* Join Code */}
        <div className="lobby-code-box">
          <span className="lobby-code-label">Join Code</span>
          <div className="lobby-code-digits">
            {formattedCode.split('').map((ch, i) =>
              ch === ' '
                ? <span key={i} className="lobby-code-digit space" />
                : <span key={i} className="lobby-code-digit">{ch}</span>
            )}
          </div>
          <button className="lobby-icon-btn" onClick={handleCopyCode} title="Copy Code">
            {copiedCode
              ? <Check size={16} color="#10b981" />
              : <Copy size={16} color="#f97316" />}
          </button>
        </div>

        {/* Join Link */}
        <div className="lobby-join-link">
          <Smartphone size={16} color="#f97316" />
          <span className="lobby-join-link-text">sada.app/join</span>
        </div>

        {/* Title + LIVE */}
        <div className="lobby-title-area">
          <div className="lobby-live-badge">
            <span className="lobby-live-dot" />
            LIVE
          </div>
          <span className="lobby-title-text">{sessionTitle}</span>
        </div>

        {/* Timer + Close */}
        <div className="lobby-header-actions">
          <div className="lobby-timer">
            <Clock size={14} color="#94a3b8" />
            <span>{formatTime(elapsed)}</span>
          </div>
          <button className="lobby-close-btn" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>
      </header>

      {/* ══ MAIN ══════════════════════════════════════════ */}
      <main className="lobby-main">

        {/* ── QR Panel ── */}
        <aside className="lobby-qr-panel">
          <div className="lobby-qr-inner">

            <div className="lobby-qr-title">Scan to Join</div>
            <div className="lobby-qr-subtitle">
              Or enter the code at <strong>sada.app/join</strong>
            </div>

            {/* QR Code */}
            <div className="lobby-qr-wrapper">
              <div className="lobby-qr-frame">
                <QRCode
                  value={joinUrl}
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#1e293b"
                  level="M"
                />
              </div>
            </div>

            {/* Copy as Image Button */}
            <QRCopyImageButton joinUrl={joinUrl} sessionCode={formattedCode} />

            {/* Waiting Status */}
            <div className="lobby-waiting-badge">
              <span className="lobby-waiting-pulse" />
              <Users size={16} />
              <span>
                {participants.length > 0
                  ? `${participants.length} waiting to start`
                  : 'Waiting for participants...'}
              </span>
            </div>

            {/* Session Type */}
            <div className="lobby-session-type-badge">
              {sessionType === 'online' ? 'Online' : 'In Person'}
            </div>
          </div>
        </aside>

        {/* ── Participants Panel ── */}
        <section className="lobby-participants-panel">

          <div className="lobby-participants-header">
            <div className="lobby-participants-title">
              <Users size={20} color="#f97316" />
              <span>Participants</span>
              <span className="lobby-count-badge">{participants.length}</span>
            </div>
            {participants.length > 0 && (
              <span className="lobby-participants-hint">Connected Now</span>
            )}
          </div>

          {/* Join Notification */}
          {newJoined && (
            <div className="lobby-join-notif">
              <Zap size={14} color="#f97316" />
              <span><strong>{newJoined}</strong> just joined!</span>
            </div>
          )}

          {/* Participants or Empty State */}
          {participants.length === 0 ? (
            <div className="lobby-empty-state">
              <div className="lobby-empty-title">No participants yet</div>
              <div className="lobby-empty-hint">
                Share the join code with your audience
              </div>
            </div>
          ) : (
            <div className="lobby-grid">
              {participants.map((p, i) => {
                const color = getAvatarColor(i);
                const name = typeof p === 'string' ? p : (p.nickname || p.name || '?');
                return (
                  <div
                    key={i}
                    className="lobby-card"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div
                      className="lobby-avatar"
                      style={{
                        background: color.bg,
                        color: color.text,
                        border: `2px solid ${color.border}`,
                      }}
                    >
                      {getInitials(name)}
                    </div>
                    <span className="lobby-card-name">{name}</span>
                    <div
                      className="lobby-online-dot"
                      style={{ background: color.text }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* ══ FOOTER ════════════════════════════════════════ */}
      <footer className="lobby-footer">
        <button className="lobby-fullscreen-btn" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
        </button>


        <button className="lobby-start-btn" onClick={onStart}>
          <Play size={20} fill="white" />
          Start Session
        </button>
      </footer>

    </div>
  );
};

export default LobbyView;