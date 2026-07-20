import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, User as UserIcon, Loader2, ArrowRight } from 'lucide-react';

const Login = () => {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isLogin) {
      const res = await login(username, password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.error);
      }
    } else {
      const res = await register(username, email, password, role);
      if (res.success) {
        setSuccess('Registration successful! You can now log in.');
        setIsLogin(true);
        setEmail('');
        setPassword('');
      } else {
        setError(res.error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#0f224a] px-4 select-none relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0f224a] to-[#0f224a] pointer-events-none"></div>

      {/* Main Solid White Card */}
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-slate-200 shadow-2xl relative z-10 text-slate-800">
        
        {/* Logo and Greeting */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 rounded-2xl bg-[#0f224a] text-white mb-3 shadow-md">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-black text-[#0f224a] tracking-wide">
            Odros University
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-wider text-center">
            {isLogin ? 'Sign In to Portal' : 'Create New Account'}
          </p>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-sm font-medium text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-medium text-center">
            {success}
          </div>
        )}

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
              isLogin ? 'bg-[#0f224a] text-white shadow' : 'text-slate-550 hover:text-[#0f224a]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
              !isLogin ? 'bg-[#0f224a] text-white shadow' : 'text-slate-555 hover:text-[#0f224a]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <UserIcon className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-250 focus:outline-none focus:border-[#0f224a] focus:ring-1 focus:ring-[#0f224a] text-sm text-slate-800 transition-all"
              />
            </div>
          </div>

          {/* Email Input (only for Register) */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-250 focus:outline-none focus:border-[#0f224a] focus:ring-1 focus:ring-[#0f224a] text-sm text-slate-800 transition-all"
                />
              </div>
            </div>
          )}

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-250 focus:outline-none focus:border-[#0f224a] focus:ring-1 focus:ring-[#0f224a] text-sm text-slate-800 transition-all"
              />
            </div>
          </div>

          {/* Role Select (only for Register) */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Account Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-250 focus:outline-none focus:border-[#0f224a] focus:ring-1 focus:ring-[#0f224a] text-sm text-slate-800 transition-all"
              >
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 mt-6 px-4 py-3 bg-[#0f224a] hover:bg-blue-900 text-white rounded-xl font-bold transition-all shadow-md disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;
