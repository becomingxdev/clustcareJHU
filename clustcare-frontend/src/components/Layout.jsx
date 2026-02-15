import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const navItems = [
    { path: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { path: 'doctors', label: 'Doctors', icon: 'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z' },
    { path: 'patients', label: 'Patients', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { path: 'appointments', label: 'Appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { path: 'inventory', label: 'Inventory', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { path: 'cluster', label: 'Cluster', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      
      {/* GLOBAL HEADER */}
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
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold mt-1">Clinic Admin Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-gray-300 hidden md:block">Welcome, Admin</span>
          <button 
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full border border-gray-700 transition-all duration-300 shadow-lg hover:shadow-gray-900/50 hover:-translate-y-0.5"
          >
            Logout
          </button>
        </div>
      </header>

      {/* FLOATING SIDEBAR */}
      <aside className="fixed left-6 top-28 bottom-6 w-72 z-40 hidden md:flex flex-col">
        {/* Creative Shape Container */}
        <div className="flex-1 bg-white rounded-[2rem] shadow-xl border border-white/50 backdrop-blur-sm overflow-hidden flex flex-col p-4 relative">
          {/* Soft Shape Decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[4rem] -mr-8 -mt-8 z-0 opacity-50 pointer-events-none"></div>

          <nav className="flex-1 space-y-3 z-10 mt-4">
            {navItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`group relative flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 overflow-hidden ${
                    isActive 
                      ? 'bg-gray-900 text-white shadow-lg scale-[1.02]' 
                      : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <svg className={`w-6 h-6 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span className="font-semibold tracking-wide text-sm">{item.label}</span>
                  
                  {/* Subtle active indicator */}
                  {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>}
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-auto p-4 opacity-50 text-[10px] text-center text-gray-400 font-medium z-10">
            SECURE PORTAL v2.4
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 md:ml-[21rem] mt-28 mr-6 mb-6 flex flex-col overflow-hidden relative z-0">
        <main className="flex-1 overflow-y-auto overflow-x-hidden rounded-[2rem] bg-gray-50/50 p-1 custom-scrollbar">
          <Outlet /> 
          
          {/* GLOBAL FOOTER */}
          <footer className="mt-12 mb-4 text-center">
            <p className="text-gray-400 text-xs font-medium tracking-wide">
              © nullBytes Limited 2026
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;