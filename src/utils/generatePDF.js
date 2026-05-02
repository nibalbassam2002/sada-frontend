export const generatePDF = (report, sessionId) => {
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
        .badge-correct { background: #dcfce7; color: #16a34a; padding: 2px 10px; border-radius: 20px; font-weight: 700; font-size: 12px; }
        .badge-wrong { background: #fee2e2; color: #dc2626; padding: 2px 10px; border-radius: 20px; font-weight: 700; font-size: 12px; }
        .badge-none { background: #f1f5f9; color: #64748b; padding: 2px 10px; border-radius: 20px; font-weight: 700; font-size: 12px; }
        .participation-bar-wrap { margin: 16px 0; }
        .participation-label { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 6px; }
        .participation-bar { height: 10px; background: #e2e8f0; border-radius: 5px; overflow: hidden; }
        .participation-fill { height: 100%; background: linear-gradient(90deg,#f97316,#ea580c); border-radius: 5px; }
        .footer { margin-top: 48px; text-align: center; color: #94a3b8; font-size: 12px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
        @media print { body { padding: 20px; font-size: 13px; } .question-card { page-break-inside: avoid; } .section { page-break-inside: avoid; } }
      </style>
    </head>
    <body>
      <div class="cover">
        <div class="logo">SADA</div>
        <h1>Full Session Report</h1>
        <div class="meta">
          <div><strong>Presentation:</strong> ${report.presentation_title || 'N/A'}</div>
          <div><strong>Session ID:</strong> #${sessionId}</div>
          <div><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
          <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Overview</div>
        <div class="stats-grid">
          <div class="stat-box blue"><div class="stat-num">${report.total_participants}</div><div class="stat-label">Participants</div></div>
          <div class="stat-box orange"><div class="stat-num">${report.total_questions}</div><div class="stat-label">Questions</div></div>
          <div class="stat-box green"><div class="stat-num">${report.leaderboard?.length > 0 ? report.leaderboard[0].total_points : 0}</div><div class="stat-label">Top Score</div></div>
          <div class="stat-box purple"><div class="stat-num">${report.leaderboard?.length > 0 ? report.leaderboard[0].correct_answers : 0}</div><div class="stat-label">Top Correct</div></div>
        </div>
      </div>

      ${report.leaderboard?.length > 0 ? `
      <div class="section">
        <div class="section-title">Full Leaderboard</div>
        <table class="leaderboard-table">
          <thead><tr><th>Rank</th><th>Participant</th><th>Total Points</th><th>Correct</th><th>Wrong</th></tr></thead>
          <tbody>
            ${report.leaderboard.map((p, i) => `
              <tr>
                <td class="rank-cell">${['🥇','🥈','🥉'][i] || '#' + (i+1)}</td>
                <td class="name-cell">${p.nickname}</td>
                <td class="pts-cell">${p.total_points} pts</td>
                <td class="correct-cell">${p.correct_answers} ✓</td>
                <td class="wrong-cell">${(p.total_answers||0)-(p.correct_answers||0) > 0 ? (p.total_answers||0)-(p.correct_answers||0)+' ✗' : '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>` : ''}

      ${report.slide_stats?.length > 0 ? `
      <div class="section">
        <div class="section-title">Questions Detail</div>
        ${report.slide_stats.map((s, i) => {
          const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
          const color = pct >= 60 ? '#10b981' : pct >= 30 ? '#f97316' : '#ef4444';
          const wrong = (s.total||0) - (s.correct||0);
          const noAnswer = Math.max(0, (report.total_participants||0) - (s.total||0));
          const participationPct = report.total_participants > 0 ? Math.round((s.total/report.total_participants)*100) : 0;
          return `
            <div class="question-card">
              <div class="question-header">
                <div class="question-num">Question ${i+1}</div>
                <div class="question-text">${s.question_text || s.title || 'Question ' + (i+1)}</div>
              </div>
              <div class="question-body">
                <div class="question-stats">
                  <div class="q-stat"><div class="q-stat-num">${s.total||0}</div><div class="q-stat-label">Answered</div></div>
                  <div class="q-stat" style="border-color:#10b981;background:#f0fdf4"><div class="q-stat-num" style="color:#10b981">${s.correct||0}</div><div class="q-stat-label">Correct ✓</div></div>
                  <div class="q-stat" style="border-color:#ef4444;background:#fef2f2"><div class="q-stat-num" style="color:#ef4444">${wrong}</div><div class="q-stat-label">Wrong ✗</div></div>
                  <div class="q-stat" style="border-color:#94a3b8;background:#f8fafc"><div class="q-stat-num" style="color:#94a3b8">${noAnswer}</div><div class="q-stat-label">No Answer</div></div>
                </div>
                <div class="participation-bar-wrap">
                  <div class="participation-label"><span>Participation rate</span><span style="font-weight:800;color:${color}">${pct}% correct · ${participationPct}% participated</span></div>
                  <div class="participation-bar"><div class="participation-fill" style="width:${pct}%;background:${color}"></div></div>
                </div>
                ${s.options?.length > 0 ? `<div style="margin-top:12px">${s.options.map((opt,oi) => {
                  const optCount = opt.count||0;
                  const optPct = s.total > 0 ? Math.round((optCount/s.total)*100) : 0;
                  const letter = String.fromCharCode(65+oi);
                  return `<div class="option-row ${opt.is_correct?'correct':''}">
                    <div class="option-fill" style="width:${optPct}%"></div>
                    <div class="option-letter">${opt.is_correct?'✓':letter}</div>
                    <div class="option-text">${opt.text||opt}</div>
                    <div class="option-count">${optCount}</div>
                    <div class="option-pct">(${optPct}%)</div>
                  </div>`;
                }).join('')}</div>` : ''}
                ${s.responses?.length > 0 ? `
                  <div style="margin-top:16px">
                    <div style="font-size:13px;font-weight:800;color:#475569;margin-bottom:8px;text-transform:uppercase">Individual Responses</div>
                    <table class="answers-table">
                      <thead><tr><th>#</th><th>Participant</th><th>Answer</th><th>Result</th><th>Time</th><th>Points</th></tr></thead>
                      <tbody>${s.responses.map((r,ri) => `
                        <tr>
                          <td style="color:#94a3b8;font-size:12px">${ri+1}</td>
                          <td style="font-weight:700">${r.nickname||'Anonymous'}</td>
                          <td>${r.answer_value||r.answer||'—'}</td>
                          <td>${r.is_correct===true?'<span class="badge-correct">✓ Correct</span>':r.is_correct===false?'<span class="badge-wrong">✗ Wrong</span>':'<span class="badge-none">— No Answer</span>'}</td>
                          <td style="color:#64748b">${r.time_taken>0?r.time_taken+'s':'—'}</td>
                          <td style="font-weight:800;color:#f97316">${r.points>0?r.points+' pts':'—'}</td>
                        </tr>`).join('')}
                      </tbody>
                    </table>
                  </div>` : '<div style="text-align:center;color:#94a3b8;padding:16px;font-size:13px">No individual responses recorded</div>'}
              </div>
            </div>`;
        }).join('')}
      </div>` : ''}

      <div class="footer">Generated by <strong style="color:#f97316">SADA</strong> · sada.app · ${new Date().toLocaleDateString()}</div>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  setTimeout(() => { win?.print(); }, 800);
  setTimeout(() => URL.revokeObjectURL(url), 8000);
};