import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        navigate('/super-admin'); 
      } else {
        alert('Login failed: ' + (data.message || 'Invalid credentials'));
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Cannot connect to server.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden font-sans">
      
      {/* MEDICAL PATTERN BACKGROUND */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="medical-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
             <path d="M20 50h60M50 20v60" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-900" />
             <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-900" />
             <path d="M80 80l10-10 10 10m-10-10v20" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-900" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#medical-pattern)" />
        </svg>
      </div>

      {/* Floating Gradient Blob */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gray-200 rounded-full blur-3xl opacity-30 z-0"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-gray-300 rounded-full blur-3xl opacity-30 z-0"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 p-10 relative overflow-hidden">
           
           <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gray-900 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                 <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain filter invert" onError={(e) => e.target.style.display = 'none'} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Welcome Back</h2>
              <p className="text-gray-500 font-medium mt-2">Sign in to your dashboard</p>
           </div>

           <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-3">Username</label>
                 <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all duration-300 shadow-inner"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-3">Password</label>
                 <input 
                    type="password" 
                    className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all duration-300 shadow-inner"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                 />
              </div>

              <button 
                 type="submit" 
                 className="w-full mt-4 bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold tracking-wide shadow-xl transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-95 flex items-center justify-center gap-2 group"
              >
                 <span>Secure Login</span>
                 <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
           </form>
           
           <div className="mt-8 text-center border-t border-gray-100 pt-6">
              <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
                 SECURE ENCRYPTED CONNECTION
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;