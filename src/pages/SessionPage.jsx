import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Users, Copy, Check,
  Maximize, Minimize, Clock, Radio,
  BarChart2, Square, Monitor, Eye, EyeOff,
  CheckCircle, XCircle, Download, Trophy, ArrowRight, AlertCircle
} from 'lucide-react';
import QRCode from 'react-qr-code';
import ScaledSlide from '../components/Session/ScaledSlide';
import { EditorProvider, useEditor } from '../components/Editor/EditorContext';


const API = 'https://sada-api-b5qk.onrender.com/api';

// ══════════════════════════════════════════════════════════
// generatePDF
// ══════════════════════════════════════════════════════════
const generatePDF = (report, sessionId) => {
  const html = `
    <!DOCTYPE html>
    <html dir="ltr">
    <head>
      <meta charset="UTF-8">
      <title>Session Report - SADA</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1e293b; background: #fff; font-size: 14px; }
        
        .cover { text-align: center; padding: 60px 0 40px; border-bottom: 3px solid #f97316; margin-bottom: 40px; }
        .cover .logo { font-size: 48px; font-weight: 900; color: #f97316; margin-bottom: 8px; }
        .cover h1 { font-size: 32px; font-weight: 900; color: #1e293b; margin-bottom: 12px; }
        .cover .meta { font-size: 14px; color: #64748b; line-height: 2; }
        
        .section { margin-bottom: 40px; }
        .section-title { font-size: 18px; font-weight: 900; color: #1e293b; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #f1f5f9; display: flex; align-items: center; gap: 8px; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
        .stat-box { border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; }
        .stat-box.blue { border-color: #3b82f6; background: #eff6ff; }
        .stat-box.orange { border-color: #f97316; background: #fff7ed; }
        .stat-box.green { border-color: #10b981; background: #f0fdf4; }
        .stat-box.purple { border-color: #8b5cf6; background: #f5f3ff; }
        .stat-num { font-size: 36px; font-weight: 900; line-height: 1; }
        .blue .stat-num { color: #3b82f6; }
        .orange .stat-num { color: #f97316; }
        .green .stat-num { color: #10b981; }
        .purple .stat-num { color: #8b5cf6; }
        .stat-label { font-size: 12px; color: #64748b; margin-top: 6px; font-weight: 700; text-transform: uppercase; }
        
        .leaderboard-table { width: 100%; border-collapse: collapse; }
        .leaderboard-table th { background: #f8fafc; padding: 10px 14px; text-align: left; font-size: 12px; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; }
        .leaderboard-table td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; }
        .leaderboard-table tr:first-child td { background: #fff7ed; }
        .leaderboard-table tr:nth-child(2) td { background: #f8fafc; }
        .rank-cell { font-size: 20px; width: 40px; }
        .name-cell { font-weight: 700; color: #1e293b; }
        .pts-cell { font-weight: 900; color: #f97316; font-size: 16px; }
        .correct-cell { color: #10b981; font-weight: 700; }
        .wrong-cell { color: #ef4444; font-weight: 700; }
        
        .question-card { border: 2px solid #e2e8f0; border-radius: 16px; margin-bottom: 24px; overflow: hidden; page-break-inside: avoid; }
        .question-header { background: #f8fafc; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; }
        .question-num { font-size: 12px; font-weight: 800; color: #f97316; text-transform: uppercase; margin-bottom: 4px; }
        .question-text { font-size: 18px; font-weight: 800; color: #1e293b; line-height: 1.4; }
        .question-body { padding: 16px 20px; }
        .question-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 16px; }
        .q-stat { text-align: center; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .q-stat-num { font-size: 22px; font-weight: 900; }
        .q-stat-label { font-size: 10px; color: #64748b; font-weight: 700; margin-top: 2px; }
        
        .option-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 10px; margin-bottom: 8px; border: 1.5px solid #e2e8f0; position: relative; overflow: hidden; }
        .option-row.correct { border-color: #10b981; background: #f0fdf4; }
        .option-fill { position: absolute; top: 0; left: 0; height: 100%; background: #10b98115; }
        .option-letter { width: 32px; height: 32px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; flex-shrink: 0; position: relative; }
        .option-row.correct .option-letter { background: #10b981; color: white; }
        .option-text { flex: 1; font-weight: 600; position: relative; }
        .option-count { font-weight: 900; font-size: 16px; position: relative; }
        .option-row.correct .option-count { color: #10b981; }
        .option-pct { font-size: 12px; color: #64748b; position: relative; margin-left: 4px; }
        
        .answers-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        .answers-table th { background: #f8fafc; padding: 8px 12px; text-align: left; font-size: 12px; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; }
        .answers-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
        .answers-table tr:hover td { background: #fafafa; }
        .badge-correct { background: #dcfce7; color: #16a34a; padding: 2px 10px; border-radius: 20px; font-weight: 700; font-size: 12px; }
        .badge-wrong { background: #fee2e2; color: #dc2626; padding: 2px 10px; border-radius: 20px; font-weight: 700; font-size: 12px; }
        .badge-none { background: #f1f5f9; color: #64748b; padding: 2px 10px; border-radius: 20px; font-weight: 700; font-size: 12px; }
        
        .participation-bar-wrap { margin: 16px 0; }
        .participation-label { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 6px; }
        .participation-bar { height: 10px; background: #e2e8f0; border-radius: 5px; overflow: hidden; }
        .participation-fill { height: 100%; background: linear-gradient(90deg,#f97316,#ea580c); border-radius: 5px; }
        
        .footer { margin-top: 48px; text-align: center; color: #94a3b8; font-size: 12px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
        
        @media print {
          body { padding: 20px; font-size: 13px; }
          .question-card { page-break-inside: avoid; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>

      <!-- COVER -->
      <div class="cover">
        <div class="logo">SADA</div>
        <h1> Full Session Report</h1>
        <div class="meta">
          <div><strong>Presentation:</strong> ${report.presentation_title || 'N/A'}</div>
          <div><strong>Session ID:</strong> #${sessionId}</div>
          <div><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
          <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</div>
        </div>
      </div>

      <!-- OVERVIEW STATS -->
      <div class="section">
        <div class="section-title"> Overview</div>
        <div class="stats-grid">
          <div class="stat-box blue">
            <div class="stat-num">${report.total_participants}</div>
            <div class="stat-label"> Participants</div>
          </div>
          <div class="stat-box orange">
            <div class="stat-num">${report.total_questions}</div>
            <div class="stat-label"> Questions</div>
          </div>
          <div class="stat-box green">
            <div class="stat-num">${report.leaderboard?.length > 0 ? report.leaderboard[0].total_points : 0}</div>
            <div class="stat-label"> Top Score</div>
          </div>
          <div class="stat-box purple">
            <div class="stat-num">${report.leaderboard?.length > 0 ? report.leaderboard[0].correct_answers : 0}</div>
            <div class="stat-label"> Top Correct</div>
          </div>
        </div>
      </div>

      <!-- LEADERBOARD -->
      ${report.leaderboard?.length > 0 ? `
      <div class="section">
        <div class="section-title"> Full Leaderboard</div>
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Participant</th>
              <th>Total Points</th>
              <th>Correct</th>
              <th>Wrong</th>
            </tr>
          </thead>
          <tbody>
            ${report.leaderboard.map((p, i) => `
              <tr>
                <td class="rank-cell">${['🥇','🥈','🥉'][i] || `#${i+1}`}</td>
                <td class="name-cell">${p.nickname}</td>
                <td class="pts-cell">${p.total_points} pts</td>
                <td class="correct-cell">${p.correct_answers} ✓</td>
                <td class="wrong-cell">${(p.total_answers || 0) - (p.correct_answers || 0) > 0 ? (p.total_answers || 0) - (p.correct_answers || 0) + ' ✗' : '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      <!-- QUESTIONS DETAIL -->
      ${report.slide_stats?.length > 0 ? `
      <div class="section">
        <div class="section-title"> Questions Detail</div>
        ${report.slide_stats.map((s, i) => {
          const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
          const color = pct >= 60 ? '#10b981' : pct >= 30 ? '#f97316' : '#ef4444';
          const wrong = (s.total || 0) - (s.correct || 0);
          const noAnswer = Math.max(0, (report.total_participants || 0) - (s.total || 0));
          const participationPct = report.total_participants > 0 ? Math.round((s.total / report.total_participants) * 100) : 0;

          return `
            <div class="question-card">
              <div class="question-header">
                <div class="question-num">Question ${i+1}</div>
                <div class="question-text">${s.question_text || s.title || `Question ${i+1}`}</div>
              </div>
              <div class="question-body">
                <div class="question-stats">
                  <div class="q-stat" style="border-color:#e2e8f0">
                    <div class="q-stat-num" style="color:#1e293b">${s.total || 0}</div>
                    <div class="q-stat-label">Answered</div>
                  </div>
                  <div class="q-stat" style="border-color:#10b981;background:#f0fdf4">
                    <div class="q-stat-num" style="color:#10b981">${s.correct || 0}</div>
                    <div class="q-stat-label">Correct ✓</div>
                  </div>
                  <div class="q-stat" style="border-color:#ef4444;background:#fef2f2">
                    <div class="q-stat-num" style="color:#ef4444">${wrong}</div>
                    <div class="q-stat-label">Wrong ✗</div>
                  </div>
                  <div class="q-stat" style="border-color:#94a3b8;background:#f8fafc">
                    <div class="q-stat-num" style="color:#94a3b8">${noAnswer}</div>
                    <div class="q-stat-label">No Answer</div>
                  </div>
                </div>

                <div class="participation-bar-wrap">
                  <div class="participation-label">
                    <span>Participation rate</span>
                    <span style="font-weight:800;color:${color}">${pct}% correct · ${participationPct}% participated</span>
                  </div>
                  <div class="participation-bar">
                    <div class="participation-fill" style="width:${pct}%;background:${color}"></div>
                  </div>
                </div>

                ${s.options?.length > 0 ? `
                  <div style="margin-top:12px">
                    ${s.options.map((opt, oi) => {
                      const optCount = opt.count || 0;
                      const optPct = s.total > 0 ? Math.round((optCount / s.total) * 100) : 0;
                      const isCorrect = opt.is_correct;
                      const letter = String.fromCharCode(65 + oi);
                      return `
                        <div class="option-row ${isCorrect ? 'correct' : ''}">
                          <div class="option-fill" style="width:${optPct}%"></div>
                          <div class="option-letter">${isCorrect ? '✓' : letter}</div>
                          <div class="option-text">${opt.text || opt}</div>
                          <div class="option-count">${optCount}</div>
                          <div class="option-pct">(${optPct}%)</div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                ` : ''}

                ${s.responses?.length > 0 ? `
                  <div style="margin-top:16px">
                    <div style="font-size:13px;font-weight:800;color:#475569;margin-bottom:8px;text-transform:uppercase">Individual Responses</div>
                    <table class="answers-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Participant</th>
                          <th>Answer</th>
                          <th>Result</th>
                          <th>Time</th>
                          <th>Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${s.responses.map((r, ri) => `
                          <tr>
                            <td style="color:#94a3b8;font-size:12px">${ri+1}</td>
                            <td style="font-weight:700">${r.nickname || 'Anonymous'}</td>
                            <td>${r.answer_value || r.answer || '—'}</td>
                            <td>
                              ${r.is_correct === true
                                ? '<span class="badge-correct">✓ Correct</span>'
                                : r.is_correct === false
                                  ? '<span class="badge-wrong">✗ Wrong</span>'
                                  : '<span class="badge-none">— No Answer</span>'}
                            </td>
                            <td style="color:#64748b">${r.time_taken > 0 ? r.time_taken + 's' : '—'}</td>
                            <td style="font-weight:800;color:#f97316">${r.points > 0 ? r.points + ' pts' : '—'}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                ` : '<div style="text-align:center;color:#94a3b8;padding:16px;font-size:13px">No individual responses recorded</div>'}
              </div>
            </div>
          `;
        }).join('')}
      </div>
      ` : ''}

      <div class="footer">
        Generated by <strong style="color:#f97316">SADA</strong> · sada.app · ${new Date().toLocaleDateString()}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  setTimeout(() => { win?.print(); }, 800);
  setTimeout(() => URL.revokeObjectURL(url), 8000);
};

// QuestionResultPanel

const QuestionResultPanel = ({ sessionId, slideId, questionData, onNext, onReveal, isRevealed }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);

  const fetchResults = useCallback(async () => {
    if (!sessionId || !slideId) return;
    try {
      const res  = await fetch(`${API}/sessions/${sessionId}/question-report/${slideId}`, {
        headers: { Accept: 'application/json' }
      });
      const data = await res.json();
      if (data.status) setResults(data.data);
    } catch {}
    setLoading(false);
  }, [sessionId, slideId]);

  useEffect(() => {
    fetchResults();
    pollRef.current = setInterval(fetchResults, 3000);
    return () => clearInterval(pollRef.current);
  }, [fetchResults]);

  const options  = questionData?.options || [];
  const correctI = questionData?.correct_answer ?? questionData?.correctAnswer ?? null;
  const stats    = results?.stats;
  const typeStats = stats?.type_stats || [];

  return (
    <div style={RS.root}>
      <div style={RS.header}>
        <BarChart2 size={16} color="#f97316"/>
        <span style={RS.headerTitle}>QUESTION RESULTS</span>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', color:'#64748b', fontSize:13, padding:16 }}>Loading...</div>
      ) : stats ? (
        <>
          <div style={RS.statsRow}>
            {[
              { label:'Answered', val: stats.total_responses ?? 0,  bg:'#0f172a', border:'#334155', color:'#f1f5f9' },
              { label:'Correct',  val: stats.correct_count   ?? 0,  bg:'#f0fdf4', border:'#bbf7d0', color:'#16a34a' },
              { label:'Wrong',    val: stats.wrong_count     ?? 0,  bg:'#fef2f2', border:'#fecaca', color:'#dc2626' },
            ].map(s => (
              <div key={s.label} style={{ ...RS.statBox, background:s.bg, border:`1px solid ${s.border}` }}>
                <span style={{ ...RS.statNum, color:s.color }}>{s.val}</span>
                <span style={RS.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          <div style={RS.percentBar}>
            <div style={{ ...RS.percentFill, width:`${stats.correct_percent || 0}%` }}/>
          </div>
          <div style={{ textAlign:'center', fontSize:11, color:'#64748b', marginBottom:8 }}>
            {stats.correct_percent || 0}% answered correctly
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
            {options.map((opt, i) => {
              const statItem = typeStats.find(s => s.index === i);
              const count    = statItem?.count   ?? 0;
              const pct      = statItem?.percent ?? 0;
              const isOk     = statItem?.is_correct ?? (i === correctI);
              const text     = typeof opt === 'object' ? (opt.text ?? '') : opt;

              return (
                <div key={i} style={RS.optionRow}>
                  <div style={{
                    ...RS.optionBar,
                    background: isOk ? '#f0fdf4' : '#f8fafc',
                    border: `1px solid ${isOk ? '#10b981' : '#e2e8f0'}`
                  }}>
                    <div style={{ ...RS.optionFill, width:`${pct}%`, background: isOk ? '#10b98133' : '#f9731620' }}/>
                    <div style={RS.optionContent}>
                      {isOk
                        ? <CheckCircle size={13} color="#10b981"/>
                        : <XCircle size={13} color="#ef4444" style={{ opacity:0.4 }}/>}
                      <span style={{ fontSize:12, fontWeight:600, color:'#1e293b', flex:1 }}>{text}</span>
                      <span style={{ fontSize:12, fontWeight:800, color: isOk ? '#10b981' : '#94a3b8' }}>
                        {count} <span style={{ fontWeight:400 }}>({pct}%)</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div style={{ textAlign:'center', color:'#94a3b8', fontSize:12 }}>No responses yet</div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:12 }}>
        <button onClick={onReveal} style={{
          ...RS.btn,
          background: isRevealed ? '#f1f5f9' : 'linear-gradient(135deg,#f97316,#ea580c)',
          color:      isRevealed ? '#64748b'  : '#fff',
          border:     isRevealed ? '1px solid #e2e8f0' : 'none',
        }}>
          {isRevealed ? <><EyeOff size={14}/> Hide from Display</> : <><Eye size={14}/> Show on Display</>}
        </button>
        <button onClick={onNext} style={{ ...RS.btn, background:'#1e293b', color:'#fff' }}>
          <ArrowRight size={14}/> Next Slide
        </button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// FinalReport
// ══════════════════════════════════════════════════════════
const FinalReport = ({ sessionId, presentationId, onClose }) => {
  const [report,  setReport]  = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch(`${API}/sessions/${sessionId}/report`, {
          headers: { Authorization:`Bearer ${localStorage.getItem('token')}`, Accept:'application/json' }
        });
        const data = await res.json();
        if (data.status) setReport(data.data);
      } catch {}
      setLoading(false);
    };
    load();
  }, [sessionId]);

  if (loading) return (
    <div style={FR.overlay}><div style={FR.card}>
      <div style={FR.spinner}/>
      <p style={{ color:'#64748b', marginTop:12 }}>Generating report...</p>
    </div></div>
  );

  if (!report) return null;

  return (
    <div style={FR.overlay}>
      <div style={FR.card}>
        <div style={FR.cardHeader}>
          <Trophy size={20} color="#f97316"/>
          <span style={FR.cardTitle}>Session Report</span>
          <button style={FR.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={FR.statsGrid}>
          {[
            { label:'Participants', value:report.total_participants, color:'#3b82f6' },
            { label:'Questions',   value:report.total_questions,    color:'#f97316' },
          ].map(s => (
            <div key={s.label} style={{ ...FR.statBox, borderColor:s.color+'40' }}>
              <span style={{ ...FR.statNum, color:s.color }}>{s.value}</span>
              <span style={FR.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {report.leaderboard?.length > 0 && (
          <div style={FR.section}>
            <div style={FR.sectionTitle}><Trophy size={13} color="#f97316"/> Leaderboard</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {report.leaderboard.slice(0,5).map((p,i) => (
                <div key={i} style={FR.leaderRow}>
                  <span style={{ ...FR.rank, background:i===0?'#fef08a':i===1?'#e2e8f0':'#fed7aa' }}>{i+1}</span>
                  <span style={{ flex:1, fontSize:13, fontWeight:600, color:'#1e293b' }}>{p.nickname}</span>
                  <span style={{ fontSize:13, fontWeight:800, color:'#f97316' }}>{p.total_points} pts</span>
                  <span style={{ fontSize:11, color:'#64748b' }}>{p.correct_answers} ✓</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {report.slide_stats?.length > 0 && (
          <div style={FR.section}>
            <div style={FR.sectionTitle}><BarChart2 size={13} color="#f97316"/> Questions Summary</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {report.slide_stats.map((s,i) => {
                const pct = s.total > 0 ? Math.round((s.correct/s.total)*100) : 0;
                return (
                  <div key={i} style={FR.qRow}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:'#475569' }}>Q{i+1}</span>
                      <span style={{ fontSize:11, color:'#64748b' }}>{s.total} responses · {pct}% correct</span>
                    </div>
                    <div style={FR.bar}>
                      <div style={{ ...FR.barFill, width:`${pct}%`, background:pct>=60?'#10b981':pct>=30?'#f97316':'#ef4444' }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display:'flex', gap:10, marginTop:8 }}>
          {/* ✅ التعديل: زر PDF بدل JSON */}
          <button onClick={() => generatePDF(report, sessionId)} style={FR.downloadBtn}>
            <Download size={15}/> Download PDF
          </button>
          <button onClick={() => navigate(`/editor/${presentationId}`)} style={FR.backBtn}>Back to Editor</button>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// SessionContent
// ══════════════════════════════════════════════════════════
const SessionContent = () => {
  const { id: presentationId } = useParams();
  const navigate = useNavigate();

  const { slides, currentSlideIndex, nextSlide, prevSlide, isLoading, title, currentTheme } = useEditor();

  const sessionCode = localStorage.getItem('session_code') || '';
  const [sessionId] = useState(() => localStorage.getItem('session_id_presenter') || null);
  const joinUrl     = `${window.location.origin}/join/${sessionCode}`;
  const formatted   = sessionCode ? `${sessionCode.slice(0,3)} ${sessionCode.slice(3)}` : '— — —';

  const [participants,      setParticipants]      = useState([]);
  const [elapsed,           setElapsed]           = useState(0);
  const [copiedCode,        setCopiedCode]        = useState(false);
  const [isFullscreen,      setIsFullscreen]      = useState(false);
  const [showResults,       setShowResults]       = useState(false);
  const [isRevealed,        setIsRevealed]        = useState(false);
  const [showReport,        setShowReport]        = useState(false);
  const [isQuestionExpired, setIsQuestionExpired] = useState(false);

  const displayRef   = useRef(null);
  const containerRef = useRef(null);
  const pollingRef   = useRef(null);

  const currentSlide = slides[currentSlideIndex];
  const isQuestion   = currentSlide?.layout === 'QUESTION' || !!currentSlide?.questionData;

  // ── elapsed timer ────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (s) =>
    `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  // ── polling: حالة السؤال فقط (بدون عداد) ────────────────
  const fetchQuestionStatus = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res  = await fetch(`${API}/sessions/${sessionId}/current-slide`, {
        headers: { Authorization:`Bearer ${localStorage.getItem('token')}`, Accept:'application/json' }
      });
      const data = await res.json();
      if (data.status && data.data?.question_info) {
        const qi = data.data.question_info;
        setIsQuestionExpired(!qi.is_active);
      }
    } catch {}
  }, [sessionId]);

  // ── عند تغيير الشريحة ────────────────────────────────────
  useEffect(() => {
    if (!sessionId) return;
    const slide = slides[currentSlideIndex];
    if (!slide) return;

    localStorage.setItem('current_theme', currentTheme ?? 0);

    setShowResults(false);
    setIsRevealed(false);
    setIsQuestionExpired(false);

    fetch(`${API}/sessions/${sessionId}/slide`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        Accept: 'application/json',
      },
      body: JSON.stringify({ slide_id: slide.id, template_id: currentTheme }),
    }).then(async res => {
      const data = await res.json();
      if (data.data?.is_expired) {
        setIsQuestionExpired(true);
      }
    }).catch(() => {});

    fetch(`${API}/sessions/${sessionId}/hide-results`, {
      method: 'POST',
      headers: { Authorization:`Bearer ${localStorage.getItem('token')}`, Accept:'application/json' },
    }).catch(() => {});

    if (displayRef.current && !displayRef.current.closed) {
      try {
        displayRef.current.postMessage({ type:'SLIDE_CHANGE', index:currentSlideIndex }, '*');
        displayRef.current.postMessage({ type:'HIDE_RESULTS' }, '*');
      } catch {}
    }
  }, [currentSlideIndex, sessionId, slides, currentTheme]);

  // ── polling للمشاركين ────────────────────────────────────
  useEffect(() => {
    if (!sessionId) return;
    const poll = async () => {
      try {
        const res  = await fetch(`${API}/sessions/${sessionId}/participants`, {
          headers: { Authorization:`Bearer ${localStorage.getItem('token')}`, Accept:'application/json' }
        });
        const data = await res.json();
        if (data.status) setParticipants(data.data.participants || []);
      } catch {}
    };
    poll();
    pollingRef.current = setInterval(poll, 3000);
    return () => clearInterval(pollingRef.current);
  }, [sessionId]);

  // ── polling لحالة السؤال كل 3 ثواني ─────────────────────
  useEffect(() => {
    if (!sessionId || !isQuestion) return;
    fetchQuestionStatus();
    const t = setInterval(fetchQuestionStatus, 3000);
    return () => clearInterval(t);
  }, [sessionId, isQuestion, fetchQuestionStatus]);

  // ── keyboard navigation ──────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (['ArrowRight','Space','PageDown'].includes(e.key)) { e.preventDefault(); nextSlide(); }
      if (['ArrowLeft','PageUp'].includes(e.key))            { e.preventDefault(); prevSlide(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextSlide, prevSlide]);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  const openDisplay = () => {
    const w = window.open(`/display/${sessionId}`, 'sada-display', 'width=1280,height=720');
    displayRef.current = w;
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(sessionCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCloseQuestion = async () => {
    if (!window.confirm('Close this question? Participants will no longer be able to answer.')) return;
    try {
      const res  = await fetch(`${API}/sessions/${sessionId}/close-question`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.status) {
        setIsQuestionExpired(true);
        setShowResults(true);

        if (displayRef.current && !displayRef.current.closed) {
          displayRef.current.postMessage({ type: 'QUESTION_EXPIRED' }, '*');
          displayRef.current.postMessage({
            type: 'SHOW_RESULTS',
            slideId: currentSlide?.id,
          }, '*');
        }

        await fetch(`${API}/sessions/${sessionId}/reveal-results`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setIsRevealed(true);
      }
    } catch {
      alert('Failed to close question. Please try again.');
    }
  };

  // ── كشف/إخفاء النتائج ────────────────────────────────────
  const handleRevealResults = async () => {
    const next = !isRevealed;
    setIsRevealed(next);
    const endpoint = next ? 'reveal-results' : 'hide-results';
    await fetch(`${API}/sessions/${sessionId}/${endpoint}`, {
      method: 'POST',
      headers: { Authorization:`Bearer ${localStorage.getItem('token')}`, Accept:'application/json' },
    }).catch(() => {});
    if (displayRef.current && !displayRef.current.closed) {
      try {
        displayRef.current.postMessage({
          type: next ? 'SHOW_RESULTS' : 'HIDE_RESULTS',
          slideId: currentSlide?.id,
          questionData: currentSlide?.questionData,
        }, '*');
      } catch {}
    }
  };

  // ── إنهاء الجلسة ─────────────────────────────────────────
  const handleEnd = async () => {
    if (!window.confirm('End the current session?')) return;
    clearInterval(pollingRef.current);
    try {
      await fetch(`${API}/sessions/${sessionId}/end`, {
        method: 'POST',
        headers: { Authorization:`Bearer ${localStorage.getItem('token')}`, Accept:'application/json' },
      });
    } catch {}
    localStorage.removeItem('session_active');
    localStorage.removeItem('session_id_presenter');
    localStorage.removeItem('session_code');
    if (displayRef.current && !displayRef.current.closed) displayRef.current.close();
    setShowReport(true);
  };

  if (isLoading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0f172a', color:'#fff', fontSize:18 }}>
      Loading session...
    </div>
  );

  return (
    <div ref={containerRef} style={S.root}>

      {showReport && (
        <FinalReport
          sessionId={sessionId}
          presentationId={presentationId}
          onClose={() => navigate(`/editor/${presentationId}`)}
        />
      )}

      {/* TOP BAR */}
      <header style={S.topBar}>
        <div style={S.codeSection}>
          <div style={S.liveDot}/>
          <span style={S.liveLabel}>LIVE</span>
          <div style={S.codeBox}>
            <span style={S.codeVal}>{formatted}</span>
            <button style={S.iconBtn} onClick={handleCopyCode}>
              {copiedCode ? <Check size={14} color="#10b981"/> : <Copy size={14} color="#f97316"/>}
            </button>
          </div>
          <span style={S.joinLink}>sada.app/join</span>
        </div>

        <div style={S.centerSection}>
          <span style={S.titleText}>{title || 'Presentation'}</span>
          <span style={S.slideCounter}>{currentSlideIndex+1} / {slides.length}</span>
        </div>

        <div style={S.rightSection}>
          <div style={S.timerBox}>
            <Clock size={13} color="#94a3b8"/>
            <span style={{ fontFamily:'monospace', fontSize:13, color:'#94a3b8' }}>{formatTime(elapsed)}</span>
          </div>

          {isQuestion && !isQuestionExpired && (
            <button onClick={handleCloseQuestion} style={{ ...S.iconBtnGhost, gap:6, fontSize:12, color:'#dc2626', borderColor:'#dc2626' }}>
              <Square size={14} color="#dc2626"/> End Question
            </button>
          )}

          {isQuestion && isQuestionExpired && (
            <button
              style={{ ...S.iconBtnGhost, gap:6, fontSize:12, color:isRevealed?'#10b981':'#94a3b8', borderColor:isRevealed?'#10b981':'#334155' }}
              onClick={() => { setShowResults(true); handleRevealResults(); }}
            >
              {isRevealed ? <><EyeOff size={14}/> Hide Results</> : <><Eye size={14}/> Show Results</>}
            </button>
          )}

          <button style={{ ...S.iconBtnGhost, gap:6, fontSize:12, color:'#94a3b8' }} onClick={openDisplay}>
            <Monitor size={15}/> Display
          </button>
          <button style={S.iconBtnGhost} onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize size={16}/> : <Maximize size={16}/>}
          </button>
          <button style={S.endBtn} onClick={handleEnd}>
            <Square size={14} fill="#dc2626" color="#dc2626"/> End
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main style={S.main}>
        <div style={S.slideArea}>
          <button style={{ ...S.navBtn, left:16, opacity:currentSlideIndex===0?0.3:1 }}
            onClick={prevSlide} disabled={currentSlideIndex===0}>
            <ChevronLeft size={28}/>
          </button>

          <div style={S.slideOuter}>
            <div style={S.slideWrapper}>
              {currentSlide && <ScaledSlide slide={currentSlide} themeId={currentTheme}/>}
            </div>

            {isQuestion && isQuestionExpired && (
              <div style={{
                position: 'absolute', bottom: 16, left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(239,68,68,0.95)',
                borderRadius: 12, padding: '8px 20px',
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(239,68,68,0.3)',
                whiteSpace: 'nowrap',
              }}>
                <AlertCircle size={16} color="#fff"/>
                <span style={{ color:'#fff', fontSize:13, fontWeight:700 }}>Question Closed</span>
              </div>
            )}
          </div>

          <button style={{ ...S.navBtn, right:16, opacity:currentSlideIndex===slides.length-1?0.3:1 }}
            onClick={nextSlide} disabled={currentSlideIndex===slides.length-1}>
            <ChevronRight size={28}/>
          </button>

          <div style={S.slideStrip}>
            {slides.map((s,i) => (
              <div key={s.id} style={{
                ...S.stripDot,
                background: i===currentSlideIndex?'#f97316':i<currentSlideIndex?'#fed7aa':'#334155',
                width: i===currentSlideIndex?20:8,
              }}/>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <aside style={S.panel}>
          {isQuestion && showResults ? (
            <QuestionResultPanel
              sessionId={sessionId}
              slideId={currentSlide?.id}
              questionData={currentSlide?.questionData}
              isRevealed={isRevealed}
              onReveal={handleRevealResults}
              onNext={nextSlide}
            />
          ) : (
            <>
              <div style={S.panelSection}>
                <div style={S.panelTitle}><Radio size={14} color="#f97316"/>Scan to Join</div>
                <div style={S.qrBox}>
                  <QRCode value={joinUrl} size={140} bgColor="#ffffff" fgColor="#1e293b" level="M"/>
                </div>
                <div style={S.qrCode}>{formatted}</div>
              </div>

              <div style={S.divider}/>

              <div style={S.panelSection}>
                <div style={S.panelTitle}>
                  <Users size={14} color="#f97316"/> Participants
                  <span style={S.countBadge}>{participants.length}</span>
                </div>
                <div style={S.participantList}>
                  {participants.length === 0 ? (
                    <div style={{ fontSize:12, color:'#475569', textAlign:'center', padding:'12px 0' }}>
                      Waiting for participants...
                    </div>
                  ) : (
                    participants.slice(0,8).map((p,i) => (
                      <div key={p.id||i} style={S.participantRow}>
                        <div style={{ ...S.avatar, background:COLORS[i%COLORS.length] }}>
                          {(p.nickname||p.name||'?').charAt(0).toUpperCase()}
                        </div>
                        <span style={S.participantName}>{p.nickname||p.name||'Anonymous'}</span>
                      </div>
                    ))
                  )}
                  {participants.length > 8 && (
                    <div style={{ fontSize:11, color:'#94a3b8', textAlign:'center' }}>
                      +{participants.length-8} more
                    </div>
                  )}
                </div>
              </div>

              <div style={S.divider}/>

              {/* Current Slide Info */}
              <div style={S.panelSection}>
                <div style={S.panelTitle}><BarChart2 size={14} color="#f97316"/>Current Slide</div>
                <div style={{ fontSize:12, color:'#64748b', lineHeight:1.6 }}>
                  <div>Type: <strong style={{ color:'#e2e8f0' }}>{isQuestion ? 'Question' : 'Content'}</strong></div>
                  <div>Slide: <strong style={{ color:'#e2e8f0' }}>{currentSlideIndex+1} of {slides.length}</strong></div>

                  {isQuestion && !isQuestionExpired && (
                    <div style={{ marginTop:8, padding:'6px 10px', background:'#f9731620', borderRadius:8, color:'#f97316', fontSize:11, fontWeight:600 }}>
                      ● Question active
                    </div>
                  )}
                  {isQuestion && isQuestionExpired && (
                    <div style={{ marginTop:8, padding:'6px 10px', background:'#fef2f2', borderRadius:8, color:'#dc2626', fontSize:11, fontWeight:600 }}>
                      🔒 Question closed
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <div style={{ marginTop:'auto', display:'flex', alignItems:'center', gap:6, fontSize:11, color:'#10b981', padding:'0 4px' }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'#10b981', display:'inline-block' }}/>
            Connected
          </div>
        </aside>
      </main>

      <style>{`
        @keyframes livePulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
        *{box-sizing:border-box;}
        body{margin:0;overflow:hidden;}
      `}</style>
    </div>
  );
};

const COLORS = ['#f97316','#3b82f6','#10b981','#8b5cf6','#ef4444','#f59e0b','#06b6d4','#ec4899'];

const SessionPage = () => (
  <EditorProvider><SessionContent /></EditorProvider>
);
export default SessionPage;

// ── Styles ────────────────────────────────────────────────
const S = {
  root:           { display:'flex', flexDirection:'column', height:'100dvh', background:'#0f172a', fontFamily:"'Segoe UI',sans-serif", color:'#e2e8f0', overflow:'hidden' },
  topBar:         { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 20px', background:'#1e293b', borderBottom:'1px solid #334155', gap:16, flexShrink:0, height:56 },
  codeSection:    { display:'flex', alignItems:'center', gap:10, flexShrink:0 },
  liveDot:        { width:8, height:8, borderRadius:'50%', background:'#ef4444', animation:'livePulse 1.4s infinite', flexShrink:0 },
  liveLabel:      { fontSize:11, fontWeight:800, color:'#ef4444', letterSpacing:'.1em' },
  codeBox:        { display:'flex', alignItems:'center', gap:6, background:'#fff7ed', borderRadius:8, padding:'4px 10px' },
  codeVal:        { fontSize:16, fontWeight:900, color:'#ea580c', fontFamily:'monospace', letterSpacing:3 },
  joinLink:       { fontSize:12, color:'#64748b', fontWeight:600 },
  centerSection:  { flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2, minWidth:0 },
  titleText:      { fontSize:15, fontWeight:700, color:'#f1f5f9', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  slideCounter:   { fontSize:11, color:'#64748b', fontWeight:600 },
  rightSection:   { display:'flex', alignItems:'center', gap:10, flexShrink:0 },
  timerBox:       { display:'flex', alignItems:'center', gap:5, background:'#0f172a', borderRadius:8, padding:'4px 10px' },
  iconBtn:        { background:'none', border:'none', cursor:'pointer', padding:4, display:'flex', alignItems:'center' },
  iconBtnGhost:   { background:'none', border:'1px solid #334155', borderRadius:8, cursor:'pointer', padding:'5px 8px', color:'#94a3b8', display:'flex', alignItems:'center' },
  endBtn:         { display:'flex', alignItems:'center', gap:6, background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'5px 12px', color:'#dc2626', fontSize:13, fontWeight:700, cursor:'pointer' },
  main:           { flex:1, display:'flex', overflow:'hidden' },
  slideArea:      { flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', padding:'16px 70px', overflow:'hidden' },
  slideOuter:     { width:'100%', maxWidth:960, aspectRatio:'16/9', position:'relative' },
  slideWrapper:   { width:'100%', height:'100%', background:'#fff', borderRadius:12, boxShadow:'0 25px 60px rgba(0,0,0,.5)', position:'relative', overflow:'hidden', pointerEvents:'none', userSelect:'none' },
  navBtn:         { position:'absolute', top:'50%', transform:'translateY(-50%)', background:'#1e293b', border:'1px solid #334155', borderRadius:10, width:44, height:44, display:'flex', alignItems:'center', justifyContent:'center', color:'#e2e8f0', cursor:'pointer', zIndex:10, transition:'all .2s' },
  slideStrip:     { position:'absolute', bottom:10, display:'flex', alignItems:'center', gap:5 },
  stripDot:       { height:8, borderRadius:4, transition:'all .3s' },
  panel:          { width:260, flexShrink:0, background:'#1e293b', borderLeft:'1px solid #334155', display:'flex', flexDirection:'column', gap:0, overflowY:'auto', padding:'16px 14px' },
  panelSection:   { display:'flex', flexDirection:'column', gap:10 },
  panelTitle:     { display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.08em' },
  divider:        { height:1, background:'#334155', margin:'14px 0' },
  qrBox:          { background:'#fff', borderRadius:12, padding:10, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #f97316' },
  qrCode:         { textAlign:'center', fontSize:16, fontWeight:900, color:'#f97316', fontFamily:'monospace', letterSpacing:4 },
  countBadge:     { marginLeft:'auto', background:'#f97316', color:'#fff', borderRadius:20, fontSize:11, fontWeight:800, padding:'1px 8px', minWidth:22, textAlign:'center' },
  participantList:{ display:'flex', flexDirection:'column', gap:6 },
  participantRow: { display:'flex', alignItems:'center', gap:8 },
  avatar:         { width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#fff', flexShrink:0 },
  participantName:{ fontSize:13, color:'#cbd5e1', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
};

const RS = {
  root:         { display:'flex', flexDirection:'column', gap:8 },
  header:       { display:'flex', alignItems:'center', gap:6, marginBottom:4 },
  headerTitle:  { fontSize:11, fontWeight:800, color:'#94a3b8', letterSpacing:'.08em' },
  statsRow:     { display:'flex', gap:6 },
  statBox:      { flex:1, borderRadius:8, padding:'8px 4px', textAlign:'center' },
  statNum:      { display:'block', fontSize:20, fontWeight:900 },
  statLabel:    { display:'block', fontSize:10, color:'#64748b', fontWeight:600 },
  percentBar:   { height:6, background:'#334155', borderRadius:4, overflow:'hidden', marginTop:4 },
  percentFill:  { height:'100%', background:'linear-gradient(90deg,#10b981,#34d399)', borderRadius:4, transition:'width .5s' },
  optionRow:    { display:'flex', flexDirection:'column' },
  optionBar:    { position:'relative', borderRadius:8, overflow:'hidden', height:36 },
  optionFill:   { position:'absolute', top:0, left:0, height:'100%', transition:'width .5s', borderRadius:8 },
  optionContent:{ position:'relative', display:'flex', alignItems:'center', gap:6, padding:'0 8px', height:'100%' },
  btn:          { display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'8px 12px', borderRadius:8, border:'none', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit' },
};

const FR = {
  overlay:    { position:'fixed', inset:0, background:'rgba(0,0,0,.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 },
  card:       { background:'#fff', borderRadius:20, padding:28, maxWidth:520, width:'100%', maxHeight:'90vh', overflowY:'auto', display:'flex', flexDirection:'column', gap:16, fontFamily:"'Segoe UI',sans-serif" },
  cardHeader: { display:'flex', alignItems:'center', gap:8, paddingBottom:12, borderBottom:'1px solid #f1f5f9' },
  cardTitle:  { flex:1, fontSize:18, fontWeight:900, color:'#1e293b' },
  closeBtn:   { background:'none', border:'none', cursor:'pointer', fontSize:18, color:'#94a3b8' },
  statsGrid:  { display:'flex', gap:12 },
  statBox:    { flex:1, border:'1.5px solid', borderRadius:12, padding:'14px', textAlign:'center' },
  statNum:    { display:'block', fontSize:28, fontWeight:900 },
  statLabel:  { display:'block', fontSize:12, color:'#64748b', fontWeight:600, marginTop:2 },
  section:    { display:'flex', flexDirection:'column', gap:10 },
  sectionTitle:{ display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:800, color:'#475569', letterSpacing:'.06em', textTransform:'uppercase' },
  leaderRow:  { display:'flex', alignItems:'center', gap:8, padding:'8px 10px', background:'#f8fafc', borderRadius:8 },
  rank:       { width:22, height:22, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#1e293b', flexShrink:0 },
  qRow:       { background:'#f8fafc', borderRadius:8, padding:'10px 12px' },
  bar:        { height:6, background:'#e2e8f0', borderRadius:4, overflow:'hidden' },
  barFill:    { height:'100%', borderRadius:4, transition:'width .5s' },
  downloadBtn:{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'10px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#f97316,#ea580c)', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer' },
  backBtn:    { flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'10px', borderRadius:10, border:'1px solid #e2e8f0', background:'#f8fafc', color:'#475569', fontSize:13, fontWeight:700, cursor:'pointer' },
  spinner:    { width:36, height:36, border:'3px solid #f1f5f9', borderTop:'3px solid #f97316', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto' },
};
