import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/register', formData);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const pageTitle = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
      <Link to="/" style={{ color: 'inherit', display: 'flex', textDecoration: 'none' }}>
        <ArrowLeft size={24} strokeWidth={2.5} />
      </Link>
      <span>Create Account</span>
    </div>
  );

  return (
    <AuthLayout title={pageTitle} subtitle="Start your interactive journey for free">
      <form className="main-form" onSubmit={handleRegister} style={{ marginTop: '24px' }}>

        {error && <div className="error-msg">{error}</div>}

        <div className="input-group">
          <label>Full Name</label>
          <div className="input-field">
            <User size={18} />
            <input
              type="text"
              placeholder="John Doe"
              required
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Email Address</label>
          <div className="input-field">
            <Mail size={18} />
            <input
              type="email"
              placeholder="name@company.com"
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Password</label>
          <div className="input-field">
            <Lock size={18} />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Min 8 characters"
              required
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <div className="eye-icon" onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
            </div>
          </div>
        </div>

        <div className="input-group">
          <label>Confirm Password</label>
          <div className="input-field">
            <ShieldCheck size={18} />
            <input
              type={showConfirmPass ? "text" : "password"}
              placeholder="Repeat your password"
              required
              onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
            />
            <div className="eye-icon" onClick={() => setShowConfirmPass(!showConfirmPass)}>
              {showConfirmPass ? <EyeOff size={17} /> : <Eye size={17} />}
            </div>
          </div>
        </div>

        <div className="terms-container">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            I agree to the{' '}
            <a href="#" style={{ color: '#f59e0b', fontWeight: '700', textDecoration: 'none' }}>
              Terms of Service
            </a>
          </label>
        </div>

        <button type="submit" className="btn-auth-submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
          {!loading && <ArrowRight size={18} />}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterForm;
