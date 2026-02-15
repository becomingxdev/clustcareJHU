import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeDoctors: 0,
    todayAppointments: 0,
    pendingReports: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Authentication & Data Fetching
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Redirect if no token
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/clinic/dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401 || response.status === 403) {
            // Invalid token or wrong role
            handleLogout();
            return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-xl border border-gray-700 flex items-center gap-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <h3 className="font-bold text-lg">System Notice</h3>
            <p className="text-gray-300">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Grid - Premium Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StatCard 
          title="Total Patients" 
          value={stats.totalPatients} 
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          bgClass="bg-gray-800"
        />
        <StatCard 
          title="Active Doctors" 
          value={stats.activeDoctors} 
          icon="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          bgClass="bg-gray-900" 
        />
      </div>

      {/* Placeholder for future sections to demonstrate spacing rhythm */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm p-8 min-h-[300px] border border-gray-100 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-110"></div>
           <h3 className="relative text-2xl font-bold text-gray-800 mb-4">Clinic Activity</h3>
           <p className="relative text-gray-400">Detailed analytics visualization will appear here.</p>
        </div>
        <div className="bg-gray-900 text-white rounded-[2rem] shadow-xl p-8 min-h-[300px] relative overflow-hidden">
           <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
           <h3 className="relative text-xl font-bold mb-4">Quick Actions</h3>
           <div className="space-y-3 relative">
             <button 
               onClick={() => navigate('/clinic-dashboard/appointments')}
               className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-left transition-colors text-sm font-semibold flex items-center justify-between group"
             >
               <span>Add Appointment</span>
               <span className="text-gray-400 group-hover:text-white transition-colors">→</span>
             </button>
             <button 
               onClick={() => navigate('/clinic-dashboard/patients')}
               className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-left transition-colors text-sm font-semibold flex items-center justify-between group"
             >
               <span>Register Patient</span>
               <span className="text-gray-400 group-hover:text-white transition-colors">→</span>
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Premium Stat Card
const StatCard = ({ title, value, icon, bgClass }) => (
  <div className={`${bgClass} text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:-translate-y-1`}>
    
    {/* Abstract Background Shapes */}
    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-500"></div>
    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-black/20 rounded-full blur-xl"></div>
    
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="flex justify-between items-start">
        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
          <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} /></svg>
        </div>
        <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold tracking-widest uppercase text-gray-100 backdrop-blur-sm">
          Live Stats
        </span>
      </div>
      
      <div className="mt-8">
        <h3 className="text-5xl font-extrabold tracking-tight mb-2">{value}</h3>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;