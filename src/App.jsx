import React from 'react';
import './App.css';
import logo from './assets/logo.png';
import { 
  Presentation, Users, Radio, BarChart3, 
  ChevronLeft, ChevronRight, Settings, Layout,
  Smartphone, Plus, Zap, ShieldCheck, Download, 
  Globe, Sparkles 
} from 'lucide-react';
import { Twitter, Linkedin, Instagram, Mail } from 'lucide-react';

const App = () => {
  return (
    <div className="main-wrapper">
      
      {/* 1. Navbar */}
      <nav className="navbar">
        <img src={logo} alt="SADA" style={{height: '60px'}} />
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="/login" className="btn-login-outline">Login</a>
          <button className="btn-primary">Get Started Free</button>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="hero-section">
        <div className="hero-text-content">
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 800, fontSize: '12px', marginBottom: '15px'}}>
            <Radio size={16} /> 100% FREE INTERACTIVE PLATFORM
          </div>
          
          <h1 className="hero-title">
            Make presentations <br/> <span>unforgettable.</span>
          </h1>
          
          <p className="hero-desc">
            The simplest way to engage your audience with live polls, Q&As, and real-time feedback. Designed for modern presenters.
          </p>

          <div className="join-container">
            <input type="text" placeholder="Enter session code (e.g. 123456)" />
            <button className="btn-primary" style={{borderRadius: '12px'}}>Join Session</button>
          </div>
          
          <div style={{fontSize: '13px', color: '#94a3b8', fontWeight: 600, marginTop: '10px'}}>
              Trusted by 10,000+ presenters worldwide
          </div>
        </div>

        <div className="presentation-visual">
          <div className="screen-mockup">
            <div style={{position: 'absolute', top: '20px', right: '20px', background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '10px', fontWeight: 900}}> LIVE</div>
            <div className="slide-body">
               <div style={{marginBottom: '25px'}}>
                  <span style={{fontSize: '10px', fontWeight: 900, color: 'var(--primary)'}}>MULTIPLE CHOICE</span>
                  <h3 style={{fontSize: '20px', fontWeight: 800, marginTop: '5px'}}>How would you rate this?</h3>
               </div>
               <div className="result-row">
                  <div className="result-info"><span>Excellent</span><span>72%</span></div>
                  <div className="progress-track"><div className="progress-fill" style={{width: '72%'}}></div></div>
               </div>
               <div className="result-row">
                  <div className="result-info" style={{opacity: 0.6}}><span>Good</span><span>18%</span></div>
                  <div className="progress-track"><div className="progress-fill" style={{width: '18%', opacity: 0.3}}></div></div>
               </div>
            </div>
            <div className="slide-footer">
               <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                  <div className="nav-btn"><ChevronLeft size={16}/></div>
                  <span style={{fontSize: '11px', fontWeight: 800, color: '#64748b'}}>Slide 2 / 12</span>
                  <div className="nav-btn"><ChevronRight size={16}/></div>
               </div>
               <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: '#64748b'}}>
                     <Users size={16} color="var(--primary)" /> 1,248
                  </div>
                  <Settings size={16} color="#cbd5e1" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Process Section */}
      <section id="how" className="process-section">
        <h2 style={{fontSize: '42px', fontWeight: 800, letterSpacing: '-1.5px'}}>Experience seamless interaction</h2>
        <p style={{color: 'var(--slate)', fontSize: '18px', marginTop: '10px'}}>Connecting presenters and audiences in real-time.</p>

        <div className="process-grid">
          <div className="step-card">
            <div className="feature-icon-box" style={{background: '#fff7ed'}}>
              <Layout size={28} />
            </div>
            <h3 style={{fontSize: '24px', fontWeight: 800, marginBottom: '10px'}}>For Presenters</h3>
            <p style={{color: 'var(--slate)', fontSize: '15px'}}>Everything you need to lead an engaging session.</p>
            <div className="steps-list">
              <div className="step-item"><div className="step-dot">1</div><span>Create slides & interactive questions.</span></div>
              <div className="step-item"><div className="step-dot">2</div><span>Go live and get your unique session code.</span></div>
              <div className="step-item"><div className="step-dot">3</div><span>Watch results update live as people vote.</span></div>
            </div>
            <div style={{marginTop: '25px', color: 'var(--primary)', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'}}>
              Start Hosting <Plus size={16} />
            </div>
          </div>

          <div className="step-card">
            <div className="feature-icon-box" style={{background: '#eff6ff', color: '#3b82f6'}}>
              <Users size={28} />
            </div>
            <h3 style={{fontSize: '24px', fontWeight: 800, marginBottom: '10px'}}>For Participants</h3>
            <p style={{color: 'var(--slate)', fontSize: '15px'}}>Quick access for your audience, no apps required.</p>
            <div className="steps-list">
              <div className="step-item"><div className="step-dot">1</div><span>Visit sada.io on any mobile browser.</span></div>
              <div className="step-item"><div className="step-dot">2</div><span>Enter the code shared by the host.</span></div>
              <div className="step-item"><div className="step-dot">3</div><span>Join the live session and start interacting.</span></div>
            </div>
            <div style={{marginTop: '25px', color: '#3b82f6', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'}}>
              Join Session <Smartphone size={16} />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bento Features Grid */}
      <section id="features" className="features-section">
        <div style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto'}}>
          <span style={{color: 'var(--primary)', fontWeight: 800, fontSize: '12px', letterSpacing: '2px'}}>CORE CAPABILITIES</span>
          <h2 style={{fontSize: '38px', fontWeight: 800, marginTop: '10px'}}>Engineered for impact.</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card large">
             <div className="feature-icon-box"><Sparkles size={22} /></div>
             <h4 style={{fontSize: '20px', fontWeight: 800}}>Interactive AI Generation</h4>
             <p style={{color: 'var(--slate)', fontSize: '15px', marginTop: '10px'}}>
               Automatically generate poll questions and slide content using our smart AI assistant. Save hours of preparation.
             </p>
          </div>
          <div className="feature-card">
             <div className="feature-icon-box"><Zap size={22} /></div>
             <h4 style={{fontWeight: 800}}>Instant Results</h4>
             <p style={{color: 'var(--slate)', fontSize: '14px', marginTop: '8px'}}>Zero latency feedback across any device.</p>
          </div>
          <div className="feature-card">
             <div className="feature-icon-box"><Download size={22} /></div>
             <h4 style={{fontWeight: 800}}>Pro Analytics</h4>
             <p style={{color: 'var(--slate)', fontSize: '14px', marginTop: '8px'}}>Export reports to PDF or Excel with ease.</p>
          </div>
          <div className="feature-card large" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)', borderColor: '#e0f2fe'}}>
             <div className="feature-icon-box" style={{color: '#0ea5e9'}}><ShieldCheck size={22} /></div>
             <h4 style={{fontSize: '20px', fontWeight: 800}}>Enterprise Security</h4>
             <p style={{color: 'var(--slate)', fontSize: '15px', marginTop: '10px'}}>
               Your data is fully encrypted and sessions are private. Industry-standard protocols for your safety.
             </p>
          </div>
        </div>
      </section>

      {/* 5. Premium CTA */}
      <section className="cta-wrapper">
        <div className="premium-cta">
          <div className="cta-glow"></div>
          <h2 style={{position: 'relative'}}>Make your next session <br/> unforgettable.</h2>
          <p style={{position: 'relative'}}>Join 10,000+ presenters worldwide who trust SADA for their interactive needs.</p>
          <div style={{position: 'relative', display: 'flex', gap: '15px', justifyContent: 'center'}}>
             <button className="btn-primary" style={{padding: '16px 40px', fontSize: '15px'}}>Create My First Session</button>
             <button style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '16px 40px', borderRadius: '14px', fontWeight: 700, cursor: 'pointer'}}>Watch Video</button>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
       <footer className="footer-modern">
        <div className="footer-grid">
          
          {/* العمود الأول: البراند */}
          <div className="footer-brand">
            <img src={logo} alt="SADA" style={{height: '38px'}} />
            <p>Empowering presenters to create unforgettable interactive experiences worldwide.</p>
            <div className="social-links">
              <a href="#" className="social-icon"><Twitter size={18} /></a>
              <a href="#" className="social-icon"><Linkedin size={18} /></a>
              <a href="#" className="social-icon"><Instagram size={18} /></a>
            </div>
          </div>

          {/* العمود الثاني: المنتج */}
          <div>
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-links-list">
              <li><a href="#features">Features</a></li>
              <li><a href="#how">How it works</a></li>
              <li><a href="#">Templates</a></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </div>

          {/* العمود الثالث: الدعم */}
          <div>
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links-list">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Community</a></li>
              <li><a href="#">Best Practices</a></li>
              <li><a href="#">API Docs</a></li>
            </ul>
          </div>

          {/* العمود الرابع: الشركة */}
          <div>
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links-list">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* الجزء السفلي الأخير */}
        <div className="footer-bottom">
          <div className="footer-bottom-text">
            © 2024 SADA Interactive. Designed with passion for better presentations.
          </div>
          <div style={{display: 'flex', gap: '20px'}}>
             <div style={{display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#94a3b8', fontWeight: 700}}>
                <Mail size={14} /> support@sada.io
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;