import React, { useState, useEffect } from 'react';
import {
  Plus, PlayCircle, Download, Clock, Trophy,
  BarChart3, Activity, Users, Loader2, AlertCircle,
  TrendingUp, Layers, CheckCircle2, Timer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { generatePDF } from '../utils/generatePDF';
import '../styles/Dashboard.css';

// ── AnimatedBar ───────────────────────────────────────────
const AnimatedBar = ({ percent, color }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(percent), 300);
    return () => clearTimeout(t);
  }, [percent]);
  return (
    <div className="bar-track">
      <div className={`bar-fill ${color}`} style={{ width: `${width}%`, transition: 'width 1s ease-in-out' }} />
    </div>
  );
};

// ── KpiCounter ────────────────────────────────────────────
const KpiCounter = ({ target, suffix = '' }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target && target !== 0) return;
    const num = typeof target === 'string' ? parseFloat(target.replace(/[^0-9.]/g, '')) : target;
    if (isNaN(num)) { setVal(target); return; }
    let start = 0;
    const steps = 40;
    const inc = num / steps;
    const timer = setInterval(() => {
      start += inc;
      if (start >= num) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start).toLocaleString('en-US') + suffix);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <h3>{val}</h3>;
};

// ── ExportModal ───────────────────────────────────────────
const ExportModal = ({ onClose }) => {
  const [presentations, setPresentations] = useState([]);
  const [sessions,      setSessions]      = useState([]);
  const [presId,        setPresId]        = useState('');
  const [sessionId,     setSessionId]     = useState('');
  const [sessionInfo,   setSessionInfo]   = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [loadingSess,   setLoadingSess]   = useState(false);
  const [err,           setErr]           = useState('');

  useEffect(() => {
    api.get('/presentations')
      .then(res => {
        const list = (res.data.data || []).filter(p => (p.sessions_count || 0) > 0);
        setPresentations(list);
      })
      .catch(() => setErr('Failed to load presentations'));
  }, []);

  const handlePresChange = async (id) => {
    setPresId(id);
    setSessionId('');
    setSessionInfo(null);
    setSessions([]);
    setErr('');
    if (!id) return;
    setLoadingSess(true);
    try {
      const res = await api.get(`/presentations/${id}/sessions`);
      setSessions(res.data.data || []);
    } catch {
      setErr('Failed to load sessions');
    } finally {
      setLoadingSess(false);
    }
  };

  const handleSessionChange = (sid) => {
    setSessionId(sid);
    const s = sessions.find(s => String(s.session_id) === String(sid));
    setSessionInfo(s || null);
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }) : '—';

  const statusColor = (st) => {
    if (st === 'active')   return '#10b981';
    if (st === 'waiting')  return '#6366f1';
    if (st === 'finished') return '#94a3b8';
    return '#f59e0b';
  };

  const handleExport = async () => {
    if (!sessionId) { setErr('Please select a session'); return; }
    setLoading(true);
    setErr('');
    try {
      const res = await api.get(`/sessions/${sessionId}/report`);
      if (!res.data.status) throw new Error(res.data.message || 'Failed');
      generatePDF(res.data.data, sessionId);
      onClose();
    } catch (e) {
      setErr(e.message || 'Could not generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: 28,
        width: '100%', maxWidth: 460,
        fontFamily: "'Segoe UI', sans-serif",
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20, paddingBottom:16, borderBottom:'1px solid #f1f5f9' }}>
          <div style={{ width:38, height:38, borderRadius:10, background:'#fff7ed', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Download size={18} color="#f97316" />
          </div>
          <div>
            <p style={{ margin:0, fontWeight:700, fontSize:15, color:'#1e293b' }}>Export Analytics</p>
            <p style={{ margin:0, fontSize:12, color:'#94a3b8' }}>Select a presentation and session</p>
          </div>
          <button onClick={onClose} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', fontSize:18, color:'#94a3b8' }}>✕</button>
        </div>

        {/* Presentation Select */}
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:'#64748b', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'.05em' }}>
            Presentation
          </label>
          <select
            value={presId}
            onChange={e => handlePresChange(e.target.value)}
            style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1.5px solid #e2e8f0', fontSize:14, color:'#1e293b', background:'#f8fafc' }}
          >
            <option value="">— Select presentation —</option>
            {presentations.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          {presentations.length === 0 && (
            <p style={{ fontSize:12, color:'#94a3b8', marginTop:4 }}>No presentations with sessions found</p>
          )}
        </div>

        {/* Session Select */}
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:'#64748b', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'.05em' }}>
            Session
          </label>
          <select
            value={sessionId}
            onChange={e => handleSessionChange(e.target.value)}
            disabled={!presId || loadingSess}
            style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1.5px solid #e2e8f0', fontSize:14, color:'#1e293b', background: presId ? '#f8fafc' : '#f1f5f9' }}
          >
            <option value="">
              {loadingSess ? 'Loading sessions...' : presId ? '— Select session —' : '— Select presentation first —'}
            </option>
            {sessions.map(s => (
              <option key={s.session_id} value={s.session_id}>
                Session #{s.session_id} · {s.status} · {s.participants_count} participants · {fmt(s.created_at)}
              </option>
            ))}
          </select>
        </div>

        {/* Session Info */}
        {sessionInfo && (
          <div style={{ background:'#f8fafc', borderRadius:10, padding:'12px 14px', marginBottom:14, border:'1px solid #e2e8f0' }}>
            <div style={{ display:'flex', gap:20, flexWrap:'wrap', fontSize:13 }}>
              <div>
                <span style={{ color:'#94a3b8', fontSize:11, display:'block', marginBottom:2 }}>STATUS</span>
                <span style={{ fontWeight:700, fontSize:12, padding:'2px 10px', borderRadius:20, color:'#fff', background: statusColor(sessionInfo.status) }}>
                  {sessionInfo.status}
                </span>
              </div>
              <div>
                <span style={{ color:'#94a3b8', fontSize:11, display:'block', marginBottom:2 }}>PARTICIPANTS</span>
                <span style={{ fontWeight:700, color:'#1e293b' }}>{sessionInfo.participants_count}</span>
              </div>
              <div>
                <span style={{ color:'#94a3b8', fontSize:11, display:'block', marginBottom:2 }}>DATE</span>
                <span style={{ fontWeight:600, color:'#475569', fontSize:12 }}>{fmt(sessionInfo.created_at)}</span>
              </div>
              {sessionInfo.ended_at && (
                <div>
                  <span style={{ color:'#94a3b8', fontSize:11, display:'block', marginBottom:2 }}>ENDED</span>
                  <span style={{ fontWeight:600, color:'#475569', fontSize:12 }}>{fmt(sessionInfo.ended_at)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {err && <p style={{ color:'#ef4444', fontSize:13, marginBottom:12 }}>{err}</p>}

        {/* Buttons */}
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:'10px', borderRadius:10, border:'1.5px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontSize:13, fontWeight:600, cursor:'pointer' }}>
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={loading || !sessionId}
            style={{
              flex:2, padding:'10px', borderRadius:10, border:'none',
              background: !sessionId ? '#fed7aa' : 'linear-gradient(135deg,#f97316,#ea580c)',
              color:'#fff', fontSize:13, fontWeight:700,
              cursor: sessionId ? 'pointer' : 'not-allowed',
              display:'flex', alignItems:'center', justifyContent:'center', gap:6,
            }}
          >
            <Download size={14} />
            {loading ? 'Generating...' : 'Export PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Dashboard ─────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const [stats,       setStats]       = useState(null);
  const [sessions,    setSessions]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [showExport,  setShowExport]  = useState(false);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const presRes = await api.get('/presentations');
      const presentations = presRes.data.data || [];

      setStats({
        presentations: presentations.length,
        sessions:      presentations.reduce((s, p) => s + (p.sessions_count     || 0), 0),
        audience:      presentations.reduce((s, p) => s + (p.total_participants || 0), 0),
      });

      const recentPres = presentations.filter(p => p.sessions_count > 0).slice(0, 5);
      const sessionRows = [];

      for (const pres of recentPres) {
        try {
          const sRes = await api.get(`/presentations/${pres.id}/current`);
          if (sRes.data.data) {
            sessionRows.push({
              title:        pres.title,
              date:         pres.created_at,
              participants: sRes.data.data.participants_count || 0,
              status:       sRes.data.data.status,
            });
          }
        } catch (_) {}
        if (sessionRows.length >= 3) break;
      }

      if (sessionRows.length === 0) {
        presentations.slice(0, 3).forEach(p => {
          sessionRows.push({
            title:        p.title,
            date:         p.created_at,
            participants: p.total_participants || 0,
            status:       p.status,
          });
        });
      }

      setSessions(sessionRows);
    } catch {
      setError('تعذّر تحميل البيانات. تأكدي من الاتصال.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d    = new Date(dateStr);
    const now  = new Date();
    const diff = Math.floor((now - d) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  };

  const statusColor = (status) => {
    if (status === 'active')   return '#10b981';
    if (status === 'waiting')  return '#6366f1';
    if (status === 'finished') return '#94a3b8';
    return '#f59e0b';
  };

  if (loading) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:12, color:'#94a3b8' }}>
      <Loader2 size={36} style={{ animation:'spin 1s linear infinite' }} />
      <p style={{ fontSize:14, fontWeight:600 }}>Loading dashboard…</p>
    </div>
  );

  if (error) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:12, color:'#ef4444' }}>
      <AlertCircle size={36} />
      <p style={{ fontSize:14, fontWeight:600 }}>{error}</p>
      <button onClick={fetchDashboard} style={{ padding:'10px 24px', background:'#f59e0b', color:'white', border:'none', borderRadius:12, fontWeight:700, cursor:'pointer' }}>
        إعادة المحاولة
      </button>
    </div>
  );

  const bestPres = sessions.reduce((best, s) => (!best || s.participants > best.participants ? s : best), null);

  return (
    <div className="dashboard-wrapper fade-in">

      {showExport && <ExportModal onClose={() => setShowExport(false)} />}

      {/* Command Bar */}
      <div className="command-bar">
        <div className="action-card primary" onClick={() => navigate('/dashboard/presentations')}>
          <div className="icon-box"><Plus size={20} /></div>
          <div className="action-info"><h5>New Presentation</h5><p>Design from scratch</p></div>
        </div>
        <div className="action-card secondary" onClick={() => navigate('/dashboard/presentations')}>
          <div className="icon-box"><PlayCircle size={20} /></div>
          <div className="action-info"><h5>Start Live Session</h5><p>Get instant join code</p></div>
        </div>
        {/* ✅ الزر المحدّث */}
        <div className="action-card report" onClick={() => setShowExport(true)} style={{ cursor:'pointer' }}>
          <div className="icon-box"><Download size={20} /></div>
          <div className="action-info"><h5>Export Analytics</h5><p>Choose session & export</p></div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="kpi-strip">
        <div className="kpi-item">
          <span><Layers size={12} style={{ display:'inline', marginRight:4 }} />PRESENTATIONS</span>
          <KpiCounter target={stats?.presentations ?? 0} />
        </div>
        <div className="kpi-item">
          <span><PlayCircle size={12} style={{ display:'inline', marginRight:4 }} />LIVE SESSIONS</span>
          <KpiCounter target={stats?.sessions ?? 0} />
        </div>
        <div className="kpi-item">
          <span><Users size={12} style={{ display:'inline', marginRight:4 }} />TOTAL AUDIENCE</span>
          <KpiCounter target={stats?.audience ?? 0} />
        </div>
        <div className="kpi-item">
          <span><TrendingUp size={12} style={{ display:'inline', marginRight:4 }} />AVG / SESSION</span>
          <h3>{stats?.sessions > 0 ? Math.round((stats.audience / stats.sessions) * 10) / 10 : 0}</h3>
        </div>
        <div className="kpi-item">
          <span><CheckCircle2 size={12} style={{ display:'inline', marginRight:4 }} />WITH AUDIENCE</span>
          <h3>{stats?.presentations > 0 ? Math.round((sessions.filter(s => s.participants > 0).length / Math.max(sessions.length, 1)) * 100) + '%' : '0%'}</h3>
        </div>
        <div className="kpi-item">
          <span><Timer size={12} style={{ display:'inline', marginRight:4 }} />ACTIVE NOW</span>
          <h3 style={{ color: sessions.some(s => s.status === 'active') ? '#10b981' : '#94a3b8' }}>
            {sessions.filter(s => s.status === 'active').length}
          </h3>
        </div>
      </div>

      {/* Bento Layout */}
      <div className="bento-layout">

        <div className="bento-card">
          <div className="card-head">
            <h4><Clock size={18} color="#6366f1" /> Recent Presentations</h4>
            <button className="link-btn" onClick={() => navigate('/dashboard/presentations')}>View All</button>
          </div>
          {sessions.length === 0 ? (
            <div style={{ textAlign:'center', padding:'40px 0', color:'#94a3b8' }}>
              <Layers size={40} strokeWidth={1} style={{ marginBottom:12, opacity:0.4 }} />
              <p style={{ fontSize:13, fontWeight:600 }}>No presentations yet</p>
              <button onClick={() => navigate('/dashboard/presentations')} style={{ marginTop:12, padding:'8px 20px', background:'#f59e0b', color:'white', border:'none', borderRadius:10, fontWeight:700, fontSize:13, cursor:'pointer' }}>
                Create First
              </button>
            </div>
          ) : (
            <div className="session-rows">
              {sessions.map((item, i) => (
                <div key={i} className="row-item">
                  <div className="row-main">
                    <h5>{item.title}</h5>
                    <p style={{ display:'flex', alignItems:'center', gap:6 }}>
                      {formatDate(item.date)}
                      {item.participants > 0 && <><Users size={11} /> {item.participants} Participants</>}
                      <span style={{ display:'inline-block', padding:'1px 8px', borderRadius:20, fontSize:10, fontWeight:700, color:'white', background:statusColor(item.status), marginLeft:4 }}>
                        {item.status}
                      </span>
                    </p>
                  </div>
                  <div className="row-stat">
                    <span className="stat-val">{item.participants}</span>
                    <span className="stat-lbl">PARTICIPANTS</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bento-card">
          <div className="card-head">
            <h4><Activity size={18} color="#10b981" /> Overview</h4>
          </div>
          <div className="activity-metrics">
            <div className="metric-box">
              <div className="metric-info"><span>Presentations Created</span><span>{stats?.presentations ?? 0}</span></div>
              <AnimatedBar percent={Math.min((stats?.presentations ?? 0) * 5, 100)} color="blue" />
            </div>
            <div className="metric-box">
              <div className="metric-info"><span>Sessions Launched</span><span>{stats?.sessions ?? 0}</span></div>
              <AnimatedBar percent={Math.min((stats?.sessions ?? 0) * 3, 100)} color="green" />
            </div>
            <div className="best-type-box">
              <span className="tiny-label">TOTAL AUDIENCE REACHED</span>
              <h5 style={{ fontSize:'22px', marginTop:'8px', fontWeight:800, color:'#f59e0b' }}>
                {(stats?.audience ?? 0).toLocaleString('en-US')}
                <span style={{ fontSize:13, fontWeight:600, color:'#94a3b8', marginLeft:6 }}>participants</span>
              </h5>
            </div>
          </div>
        </div>

        <div className="bento-card top-highlight">
          <div className="card-head">
            <h4><Trophy size={18} color="#f59e0b" /> Best Performing</h4>
          </div>
          {bestPres ? (
            <div className="highlight-content">
              <div className="award-icon"><BarChart3 size={28} /></div>
              <div className="highlight-info">
                <h5>{bestPres.title}</h5>
                <p>{bestPres.participants} Participants{bestPres.participants > 0 && ' • Most Engaged'}</p>
                <span style={{ display:'inline-block', marginTop:6, padding:'3px 12px', background:'#fff7ed', color:'#f59e0b', borderRadius:20, fontSize:11, fontWeight:700 }}>
                  🏆 Top Presentation
                </span>
              </div>
            </div>
          ) : (
            <div style={{ color:'#94a3b8', fontSize:13, textAlign:'center', padding:'20px 0' }}>
              No data yet — start your first session!
            </div>
          )}
        </div>

      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Dashboard;