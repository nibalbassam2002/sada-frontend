import React, { useState, useEffect } from 'react';
import {
  User, Mail, Lock, Save, Loader2, AlertCircle,
  CheckCircle2, Eye, EyeOff, Settings
} from 'lucide-react';
import api from '../api/axios';

const Preferences = () => {
  const [profile, setProfile]     = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPwd, setShowPwd]     = useState({ current: false, new: false, confirm: false });
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [hasPassword, setHasPassword]   = useState(true);

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPwd, setLoadingPwd]         = useState(false);
  const [msgProfile, setMsgProfile] = useState({ text: '', type: '' });
  const [msgPwd, setMsgPwd]         = useState({ text: '', type: '' });

 useEffect(() => {
  const loadUser = async () => {
    try {
      const res = await api.get('/user');
      const user = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      setProfile({ name: user.name || '', email: user.email || '' });
      const isGoogle = !!user.google_id;
      setIsGoogleUser(isGoogle);
      setHasPassword(!isGoogle);
    } catch {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setProfile({ name: user.name || '', email: user.email || '' });
      const isGoogle = !!user.google_id;
      setIsGoogleUser(isGoogle);
      setHasPassword(!isGoogle);
    }
  };
  loadUser();
}, []);

  const showMsg = (setter, text, type = 'success') => {
    setter({ text, type });
    setTimeout(() => setter({ text: '', type: '' }), 4000);
  };

  const handleSaveProfile = async () => {
    if (!profile.name.trim()) {
      showMsg(setMsgProfile, 'Name is required.', 'error'); return;
    }
    try {
      setLoadingProfile(true);
      await api.put('/user/profile', { name: profile.name, email: profile.email });
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...user, ...profile }));
      showMsg(setMsgProfile, 'Profile updated successfully!');
    } catch (err) {
      showMsg(setMsgProfile, err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (hasPassword && !passwords.current) {
      showMsg(setMsgPwd, 'Current password is required.', 'error'); return;
    }
    if (!passwords.new || !passwords.confirm) {
      showMsg(setMsgPwd, 'Please fill all fields.', 'error'); return;
    }
    if (passwords.new !== passwords.confirm) {
      showMsg(setMsgPwd, 'Passwords do not match.', 'error'); return;
    }
    if (passwords.new.length < 8) {
      showMsg(setMsgPwd, 'Password must be at least 8 characters.', 'error'); return;
    }
    try {
      setLoadingPwd(true);
      if (!hasPassword) {
        // مسجّل بقوقل وما عنده كلمة سر → set password
        await api.post('/user/set-password', {
          password:              passwords.new,
          password_confirmation: passwords.confirm,
        });
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...user, has_password: true }));
        setHasPassword(true);
        showMsg(setMsgPwd, 'Password set! You can now login with email too 🎉');
      } else {
        await api.put('/user/password', {
          current_password:      passwords.current,
          password:              passwords.new,
          password_confirmation: passwords.confirm,
        });
        showMsg(setMsgPwd, 'Password changed successfully!');
      }
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      showMsg(setMsgPwd, err.response?.data?.message || 'Failed. Please try again.', 'error');
    } finally {
      setLoadingPwd(false);
    }
  };

  const strengthLevel = (pwd) => {
    if (!pwd) return 0;
    if (pwd.length < 6) return 1;
    if (pwd.length < 10) return 2;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return 4;
    return 3;
  };
  const strengthColor = ['#f1f5f9','#ef4444','#f59e0b','#3b82f6','#10b981'];
  const strengthLabel = ['','Weak','Medium','Good','Strong'];
  const togglePwd = (f) => setShowPwd(p => ({ ...p, [f]: !p[f] }));

  return (
    <div style={S.wrapper}>
      <div style={S.header}>
        <h1 style={S.title}>
          <Settings size={22} color="#f59e0b" style={{ marginRight: 10 }} />
          Preferences
        </h1>
        <p style={S.subtitle}>Manage your account information</p>
      </div>

      <div style={S.grid}>

        {/* ── Profile Card ── */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={S.iconBox}><User size={18} color="#6366f1" /></div>
            <div>
              <h3 style={S.cardTitle}>Profile Information</h3>
              <p style={S.cardSub}>Update your name and email address</p>
            </div>
          </div>

          {isGoogleUser && (
            <div style={S.googleBadge}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width={16} alt="G" />
              Signed in with Google
            </div>
          )}

          <div style={S.cardBody}>
            <div style={S.field}>
              <label style={S.label}>Full Name</label>
              <div style={S.inputWrap}>
                <User size={15} color="#94a3b8" style={S.inputIcon} />
                <input style={S.input} value={profile.name}
                  onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your name" />
              </div>
            </div>

            <div style={S.field}>
              <label style={S.label}>Email Address</label>
              <div style={{ ...S.inputWrap, background: isGoogleUser ? '#f8fafc' : '#fcfcfd' }}>
                <Mail size={15} color="#94a3b8" style={S.inputIcon} />
                <input style={{ ...S.input, color: isGoogleUser ? '#94a3b8' : '#1e293b' }}
                  type="email" value={profile.email}
                  onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                  placeholder="your@email.com"
                  disabled={isGoogleUser} />
              </div>
              {isGoogleUser && (
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5, fontWeight: 600 }}>
                  Email is managed by Google.
                </p>
              )}
            </div>

            {msgProfile.text && (
              <div style={{ ...S.msg, ...(msgProfile.type === 'error' ? S.msgError : S.msgSuccess) }}>
                {msgProfile.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                {msgProfile.text}
              </div>
            )}

            <button style={S.btnSave} onClick={handleSaveProfile} disabled={loadingProfile}>
              {loadingProfile
                ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
                : <><Save size={15} /> Save Changes</>}
            </button>
          </div>
        </div>

        {/* ── Password Card ── */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={{ ...S.iconBox, background: '#fef3c7' }}><Lock size={18} color="#f59e0b" /></div>
            <div>
              <h3 style={S.cardTitle}>{hasPassword ? 'Change Password' : 'Set a Password'}</h3>
              <p style={S.cardSub}>
                {hasPassword ? 'Keep your account secure' : 'Add a password to also login with email'}
              </p>
            </div>
          </div>

          <div style={S.cardBody}>

            {/* Banner for Google users without password */}
            {isGoogleUser && !hasPassword && (
              <div style={S.infoBanner}>
                <span style={{ fontSize: 18 }}>🔑</span>
                <span>You're signed in with Google only. Set a password to also login with your email & password.</span>
              </div>
            )}

            {/* Current password — only if already has one */}
            {hasPassword && (
              <div style={S.field}>
                <label style={S.label}>Current Password</label>
                <div style={S.inputWrap}>
                  <Lock size={15} color="#94a3b8" style={S.inputIcon} />
                  <input style={S.input}
                    type={showPwd.current ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                    placeholder="••••••••" />
                  <button style={S.eyeBtn} onClick={() => togglePwd('current')}>
                    {showPwd.current ? <EyeOff size={15} color="#94a3b8" /> : <Eye size={15} color="#94a3b8" />}
                  </button>
                </div>
              </div>
            )}

            <div style={S.field}>
              <label style={S.label}>{hasPassword ? 'New Password' : 'Password'}</label>
              <div style={S.inputWrap}>
                <Lock size={15} color="#94a3b8" style={S.inputIcon} />
                <input style={S.input}
                  type={showPwd.new ? 'text' : 'password'}
                  value={passwords.new}
                  onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))}
                  placeholder="Min. 8 characters" />
                <button style={S.eyeBtn} onClick={() => togglePwd('new')}>
                  {showPwd.new ? <EyeOff size={15} color="#94a3b8" /> : <Eye size={15} color="#94a3b8" />}
                </button>
              </div>
              {passwords.new && (
                <div style={S.strengthWrap}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{
                      ...S.strengthBar,
                      background: strengthLevel(passwords.new) >= i ? strengthColor[strengthLevel(passwords.new)] : '#f1f5f9'
                    }} />
                  ))}
                  <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                    {strengthLabel[strengthLevel(passwords.new)]}
                  </span>
                </div>
              )}
            </div>

            <div style={S.field}>
              <label style={S.label}>Confirm Password</label>
              <div style={{ ...S.inputWrap, borderColor: passwords.confirm && passwords.confirm !== passwords.new ? '#ef4444' : '#f1f5f9' }}>
                <Lock size={15} color="#94a3b8" style={S.inputIcon} />
                <input style={S.input}
                  type={showPwd.confirm ? 'text' : 'password'}
                  value={passwords.confirm}
                  onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  placeholder="Repeat password" />
                <button style={S.eyeBtn} onClick={() => togglePwd('confirm')}>
                  {showPwd.confirm ? <EyeOff size={15} color="#94a3b8" /> : <Eye size={15} color="#94a3b8" />}
                </button>
              </div>
              {passwords.confirm && passwords.confirm !== passwords.new && (
                <p style={{ fontSize: 11, color: '#ef4444', marginTop: 5, fontWeight: 600 }}>Passwords don't match</p>
              )}
            </div>

            {msgPwd.text && (
              <div style={{ ...S.msg, ...(msgPwd.type === 'error' ? S.msgError : S.msgSuccess) }}>
                {msgPwd.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                {msgPwd.text}
              </div>
            )}

            <button style={S.btnSave} onClick={handleChangePassword} disabled={loadingPwd}>
              {loadingPwd
                ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> {hasPassword ? 'Updating…' : 'Setting…'}</>
                : <><Lock size={15} /> {hasPassword ? 'Update Password' : 'Set Password'}</>}
            </button>
          </div>
        </div>

      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

const S = {
  wrapper:     { padding: '10px 0', maxWidth: 900, margin: '0 auto' },
  header:      { marginBottom: 32 },
  title:       { fontSize: 24, fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center' },
  subtitle:    { fontSize: 13, color: '#94a3b8', marginTop: 6, fontWeight: 600 },
  grid:        { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 },
  card:        { background: 'white', borderRadius: 24, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,.04)' },
  cardHeader:  { display: 'flex', alignItems: 'center', gap: 14, padding: '22px 24px', borderBottom: '1px solid #f8fafc' },
  iconBox:     { width: 44, height: 44, borderRadius: 14, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardTitle:   { fontSize: 15, fontWeight: 800, color: '#1e293b', margin: 0 },
  cardSub:     { fontSize: 12, color: '#94a3b8', margin: '3px 0 0', fontWeight: 600 },
  cardBody:    { padding: '24px' },
  googleBadge: { display: 'flex', alignItems: 'center', gap: 8, margin: '12px 24px 0', padding: '8px 14px', background: '#f8fafc', borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#64748b', border: '1px solid #f1f5f9' },
  infoBanner:  { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 18, lineHeight: 1.6 },
  field:       { marginBottom: 18 },
  label:       { display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 7 },
  inputWrap:   { display: 'flex', alignItems: 'center', border: '1.5px solid #f1f5f9', borderRadius: 14, background: '#fcfcfd', padding: '0 14px' },
  inputIcon:   { flexShrink: 0, marginRight: 8 },
  input:       { flex: 1, border: 'none', outline: 'none', fontSize: 14, padding: '12px 0', background: 'transparent', color: '#1e293b', fontFamily: 'inherit' },
  eyeBtn:      { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' },
  strengthWrap:{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 },
  strengthBar: { height: 4, flex: 1, borderRadius: 10, transition: 'background .3s' },
  btnSave:     { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: 14, fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 8, fontFamily: 'inherit' },
  msg:         { display: 'flex', alignItems: 'center', gap: 7, padding: '10px 14px', borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: 14 },
  msgSuccess:  { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
  msgError:    { background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' },
};

export default Preferences;
