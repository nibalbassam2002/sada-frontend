import React from 'react';
import { 
  Plus, 
  PlayCircle, 
  Download, 
  Clock, 
  Trophy, 
  MessageSquare, 
  BarChart3, 
  Sparkles, 
  Smartphone, 
  ChevronRight, 
  Users, 
  MousePointer2, 
  Activity, 
  Star,
  ArrowRight // تم إضافة هذه الأيقونة هنا لحل مشكلة الشاشة البيضاء
} from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-wrapper fade-in">
      
      {/* 1. Command Bar - Quick Actions */}
      <div className="command-bar">
        <div className="action-card primary">
          <div className="icon-box"><Plus size={20} /></div>
          <div className="action-info">
            <h5>New Presentation</h5>
            <p>Design from scratch</p>
          </div>
        </div>
        <div className="action-card secondary">
          <div className="icon-box"><PlayCircle size={20} /></div>
          <div className="action-info">
            <h5>Start Live Session</h5>
            <p>Get instant join code</p>
          </div>
        </div>
        <div className="action-card report">
          <div className="icon-box"><Download size={20} /></div>
          <div className="action-info">
            <h5>Export Analytics</h5>
            <p>Last session report</p>
          </div>
        </div>
      </div>

      {/* 2. Key Performance Indicators (6 KPIs) */}
      <div className="kpi-strip">
        <div className="kpi-item"><span>Presentations</span><h3>42</h3></div>
        <div className="kpi-item"><span>Live Sessions</span><h3>128</h3></div>
        <div className="kpi-item"><span>Total Audience</span><h3>12,482</h3></div>
        <div className="kpi-item"><span>Total Answers</span><h3>45.1k</h3></div>
        <div className="kpi-item"><span>Engagement</span><h3>94%</h3></div>
        <div className="kpi-item"><span>Avg Rating</span><h3>4.9/5</h3></div>
      </div>

      {/* 3. Bento Grid - Organized Content */}
      <div className="bento-layout">
        
        {/* Recent Sessions */}
        <div className="bento-card">
          <div className="card-head">
            <h4><Clock size={18} color="#6366f1" /> Recent Sessions</h4>
            <button className="link-btn">View All</button>
          </div>
          <div className="session-rows">
             {[
               { title: "Weekly Tech Sync", date: "Today, 10:00 AM", users: 142, eng: "98%" },
               { title: "Product Roadmap Q3", date: "Yesterday", users: 85, eng: "92%" },
               { title: "UI/UX Feedback", date: "24 Feb 2024", users: 210, eng: "95%" }
             ].map((item, index) => (
               <div key={index} className="row-item">
                 <div className="row-main">
                    <h5>{item.title}</h5>
                    <p>{item.date} • {item.users} Participants</p>
                 </div>
                 <div className="row-stat">
                    <span className="stat-val">{item.eng}</span>
                    <span className="stat-lbl">ENGAGEMENT</span>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Audience Activity */}
        <div className="bento-card">
          <div className="card-head">
            <h4><Activity size={18} color="#10b981" /> Audience Activity</h4>
          </div>
          <div className="activity-metrics">
             <div className="metric-box">
                <div className="metric-info"><span>Questions Asked</span><span>850</span></div>
                <div className="bar-track"><div className="bar-fill blue" style={{ width: '70%' }}></div></div>
             </div>
             <div className="metric-box">
                <div className="metric-info"><span>Participation Rate</span><span>92%</span></div>
                <div className="bar-track"><div className="bar-fill green" style={{ width: '92%' }}></div></div>
             </div>
             <div className="best-type-box">
                <span className="tiny-label">MOST ACTIVE TYPE</span>
                <h5 style={{fontSize: '14px', marginTop: '5px', fontWeight: 700}}>Multiple Choice Polls (65%)</h5>
             </div>
          </div>
        </div>

        {/* Top Highlight Card */}
        <div className="bento-card top-highlight">
           <div className="card-head">
              <h4><Trophy size={18} color="#f59e0b" /> Best Performing Session</h4>
           </div>
           <div className="highlight-content" style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
              <div className="award-icon" style={{width: '60px', height: '60px', borderRadius: '16px', background: '#fff7ed', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <BarChart3 size={28} />
              </div>
              <div className="highlight-info">
                 <h5 style={{fontSize: '16px', fontWeight: 700}}>Digital Marketing 101</h5>
                 <p style={{fontSize: '13px', color: '#64748b', marginTop: '4px'}}>4.2k Lifetime Answers • 99% Satisfaction</p>
              </div>
           </div>
        </div>

      

      </div>
    </div>
  );
};

export default Dashboard;