import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import AddClinicModal from '../components/AddClinicModal';

const SuperAdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [districts, setDistricts] = useState([]); // <--- Now holds real data
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role'); // if stored
  localStorage.removeItem('username'); // if stored

  navigate('/login', { replace: true });
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch('http://localhost:8080/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDistricts(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* GLOBAL HEADER (Replicated for consistency) */}
      <header className="fixed top-0 inset-x-0 z-50 h-20 bg-gray-900 text-white shadow-2xl rounded-b-[2.5rem] flex items-center justify-between px-8 transition-all duration-300">
        <div className="flex items-center gap-4">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-10 w-10 object-contain bg-white rounded-full p-1 border-2 border-gray-700" 
            onError={(e) => e.target.style.display = 'none'}
          />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight leading-none text-white">ClustCare</h1>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold mt-1">Cluster Manager Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-gray-300 hidden md:block">Super Admin</span>
          <button 
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full border border-gray-700 transition-all duration-300 shadow-lg hover:shadow-gray-900/50 hover:-translate-y-0.5"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">Network Overview</h2>
            <p className="text-gray-400 mt-2 font-medium">Manage and monitor all clinic clusters efficiently.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center font-bold tracking-wide group"
          >
            <span className="mr-3 text-xl group-hover:rotate-90 transition-transform duration-300">+</span> Add New Clinic / Cluster
          </button>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
            <p className="text-gray-400 font-medium animate-pulse">Loading Network Data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {districts.map((cluster, index) => (
              <div 
                key={cluster.id || index} 
                className={`bg-white rounded-[2.5rem] p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 flex flex-col justify-between relative overflow-hidden group ${index % 2 === 0 ? 'mt-4' : 'mb-4'}`} // Staggered effect
              >
                 {/* Decorative background shape */}
                 <div className="absolute -right-8 -top-8 w-32 h-32 bg-gray-50 rounded-full group-hover:scale-150 transition-transform duration-700 z-0"></div>

                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                        <div className="p-3 bg-gray-50 rounded-2xl">
                            <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <span className="text-xs font-bold tracking-widest uppercase bg-gray-100 px-3 py-1 rounded-full text-gray-500">
                             {cluster.district}
                        </span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">{cluster.name}</h3>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium text-sm">Total Clinics</span>
                    <span className="text-3xl font-extrabold text-gray-900">
                      {cluster.clinics ? cluster.clinics.length : 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {districts.length === 0 && (
              <div className="col-span-3 text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-medium text-lg">No clusters found in the network.</p>
                <button onClick={() => setIsModalOpen(true)} className="text-gray-800 font-bold underline mt-2 hover:text-black">Get Started</button>
              </div>
            )}
          </div>
        )}
      </main>

      <AddClinicModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={fetchStats} 
      />
      
      {/* FOOTER */}
      <footer className="mt-auto text-center pb-6">
        <p className="text-gray-400 text-xs font-medium tracking-wide">
            © nullBytes Limited 2026
        </p>
      </footer>
    </div>
  );
};

export default SuperAdminDashboard;