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

      // 1. Check if response is okay BEFORE parsing JSON
      if (response.ok) {
        const data = await response.json(); // Only parse JSON if successful
        localStorage.setItem('token', data.access_token);
        
        if (data.role === 'ADMIN') {
            navigate('/super-admin');
        } else {
            navigate('/clinic-dashboard');
        }
      } else {
        // 2. If failed, read as text (incase it's a 403 html page)
        const errorText = await response.text(); 
        console.error("Server Error:", errorText); // Check Console for this!
        alert('Login failed: ' + response.status + ' ' + response.statusText);
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Cannot connect to server.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">ClustCare Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-500">Username</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-200 rounded mt-1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-500">Password</label>
            <input 
              type="password" 
              className="w-full p-2 border border-gray-200 rounded mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-500 transition">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;