import React, { useState, useEffect } from 'react';
import {
  Archive as ArchiveIcon, RotateCcw, Loader2, AlertCircle,
  LayoutGrid, Users, Monitor, Clock, Search, Inbox
} from 'lucide-react';
import api from '../api/axios';

const Archive = () => {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');
  const [search, setSearch]               = useState('');
  const [unarchiving, setUnarchiving]     = useState(null);

  useEffect(() => { fetchArchived(); }, []);

  const fetchArchived = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/presentations');
      const all = res.data.data || [];
      setPresentations(all.filter(p => p.status === 'archived'));
    } catch {
      setError('Failed to load archived presentations.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnarchive = async (id) => {
    setUnarchiving(id);
    try {
      await api.patch(`/presentations/${id}/archive`);
      setPresentations(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Failed to unarchive.');
    } finally {
      setUnarchiving(null);
    }
  };

  const filtered = presentations.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Loading ── */
  if (loading) return (
    <div style={styles.center}>
      <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#f59e0b' }} />
      <p style={styles.mutedText}>Loading archive…</p>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div style={{ ...styles.center, color: '#ef4444' }}>
      <AlertCircle size={36} />
      <p style={{ fontSize: 14, fontWeight: 600 }}>{error}</p>
      <button onClick={fetchArchived} style={styles.btnPrimary}>Retry</button>
    </div>
  );

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            <ArchiveIcon size={22} color="#f59e0b" style={{ marginRight: 10 }} />
            Archive
          </h1>
          <p style={styles.subtitle}>{presentations.length} archived presentation{presentations.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Search */}
        <div style={styles.searchBox}>
          <Search size={15} color="#94a3b8" />
          <input
            style={styles.searchInput}
            placeholder="Search archived…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div style={styles.center}>
          <Inbox size={52} strokeWidth={1.2} color="#cbd5e1" />
          <p style={{ ...styles.mutedText, marginTop: 12 }}>
            {search ? 'No results found.' : 'No archived presentations yet.'}
          </p>
        </div>
      )}

      {/* Grid */}
      <div style={styles.grid}>
        {filtered.map(p => (
          <div key={p.id} style={styles.card}>
            {/* Top strip */}
            <div style={styles.cardStrip}>
              <span style={styles.archivedBadge}>Archived</span>
            </div>

            <div style={{ padding: '18px 20px' }}>
              <h3 style={styles.cardTitle}>{p.title}</h3>

              {/* Stats */}
              <div style={styles.statsRow}>
                <div style={styles.statPill}>
                  <LayoutGrid size={12} />
                  <span>{p.slides_count ?? 0} Slides</span>
                </div>
                <div style={styles.statPill}>
                  <Monitor size={12} />
                  <span>{p.sessions_count ?? 0} Sessions</span>
                </div>
                <div style={styles.statPill}>
                  <Users size={12} />
                  <span>{p.total_participants ?? 0} Users</span>
                </div>
              </div>

              <div style={styles.dateRow}>
                <Clock size={11} color="#94a3b8" />
                <span style={styles.dateText}>Created: {p.created_at}</span>
              </div>

              {/* Unarchive Button */}
              <button
                style={styles.btnUnarchive}
                onClick={() => handleUnarchive(p.id)}
                disabled={unarchiving === p.id}
              >
                {unarchiving === p.id
                  ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  : <RotateCcw size={14} />}
                {unarchiving === p.id ? 'Restoring…' : 'Restore'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

const styles = {
  wrapper:      { padding: '10px 0', maxWidth: 1300, margin: '0 auto', animation: 'fadeIn .5s ease' },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 },
  title:        { fontSize: 24, fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center' },
  subtitle:     { fontSize: 13, color: '#94a3b8', marginTop: 6, fontWeight: 600 },
  searchBox:    { display: 'flex', alignItems: 'center', gap: 8, background: 'white', border: '1px solid #f1f5f9', borderRadius: 14, padding: '10px 16px', width: 260 },
  searchInput:  { border: 'none', outline: 'none', fontSize: 13, width: '100%', color: '#1e293b', background: 'transparent' },
  grid:         { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 },
  card:         { background: 'white', borderRadius: 20, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.04)', transition: 'transform .2s, box-shadow .2s' },
  cardStrip:    { background: '#f8fafc', padding: '10px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center' },
  archivedBadge:{ fontSize: 10, fontWeight: 800, color: '#94a3b8', background: '#f1f5f9', padding: '3px 10px', borderRadius: 20, letterSpacing: .5 },
  cardTitle:    { fontSize: 15, fontWeight: 800, color: '#1e293b', margin: '0 0 14px' },
  statsRow:     { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 },
  statPill:     { display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#64748b', background: '#f8fafc', padding: '4px 10px', borderRadius: 20 },
  dateRow:      { display: 'flex', alignItems: 'center', gap: 5, marginBottom: 16 },
  dateText:     { fontSize: 11, color: '#94a3b8', fontWeight: 600 },
  btnUnarchive: { display: 'flex', alignItems: 'center', gap: 7, width: '100%', justifyContent: 'center', padding: '10px', background: '#fff7ed', color: '#f59e0b', border: '1.5px solid #fed7aa', borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all .2s' },
  btnPrimary:   { padding: '10px 24px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: 'pointer', marginTop: 12 },
  center:       { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: 8, color: '#94a3b8' },
  mutedText:    { fontSize: 14, fontWeight: 600, color: '#94a3b8' },
};

export default Archive;
