import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../api/axios'; // تأكدي من مسار ملف الأكسيوس

const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password // لارافيل يطلب التأكيد عادةً
      });
      localStorage.setItem('token', response.data.access_token);
      alert('تم إنشاء الحساب بنجاح!');
      window.location.href = '/dashboard'; // توجيه للوحة التحكم لاحقاً
    } catch (err) {
      setError(err.response?.data?.message || 'خطأ في عملية التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Start your interactive journey for free">
      <form className="main-form" onSubmit={handleRegister}>
        {error && <div style={{color: 'red', fontSize: '12px', marginBottom: '10px'}}>{error}</div>}
        
        <div className="input-group">
          <label>Full Name</label>
          <div className="input-field">
            <User size={18} />
            <input 
              type="text" 
              placeholder="John Doe" 
              required 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Password</label>
          <div className="input-field">
            <Lock size={18} />
            <input 
              type="password" 
              placeholder="Min 8 characters" 
              required
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
        </div>

        <button type="submit" className="btn-auth-submit" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : 'Sign Up'} <ArrowRight size={18} />
        </button>
      </form>
      <p className="auth-footer">Already have an account? <a href="/login">Sign in</a></p>
    </AuthLayout>
  );
};

export default RegisterForm;