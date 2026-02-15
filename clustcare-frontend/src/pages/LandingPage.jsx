import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
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
      
      {/* Header */}
      <nav className="absolute top-0 inset-x-0 p-6 z-20 flex justify-between items-center max-w-7xl mx-auto w-full">
         <div className="flex items-center gap-3">
             <img src="/logo.png" alt="Logo" className="w-12 h-12 bg-white rounded-xl shadow-lg p-2 object-contain" />
             <span className="text-xl font-bold tracking-tight text-gray-800">ClustCare</span>
         </div>
         <Link to="/login" className="px-6 py-2 bg-white text-gray-900 font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-100">
            Access Portal
         </Link>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 w-full max-w-5xl px-6 py-12 flex flex-col items-center text-center">
         <div className="inline-block px-4 py-1.5 rounded-full bg-gray-900/5 border border-gray-900/10 mb-8 backdrop-blur-sm">
             <span className="text-xs font-bold tracking-widest uppercase text-gray-600">Enterprise Healthcare Solutions</span>
         </div>
         
         <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
            Manage Clinics <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">Without Limits.</span>
         </h1>
         
         <p className="max-w-2xl text-xl text-gray-500 font-medium leading-relaxed mb-12">
            The all-in-one platform for decentralized healthcare administration. 
            Connect doctors, patients, and districts in one seamless ecosystem.
         </p>
         
         {/* Registration Card */}
         <div className="w-full max-w-3xl bg-white/60 backdrop-blur-md rounded-[3rem] p-10 border border-white/50 shadow-2xl relative overflow-hidden group hover:bg-white/80 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-900/5 rounded-bl-[3rem] -mr-8 -mt-8 z-0"></div>
            
            <div className="relative z-10">
               <h2 className="text-2xl font-bold text-gray-800 mb-2">Join the Network</h2>
               <p className="text-gray-500 mb-8">Registration is restricted to authorized credentials.</p>
               
               <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  <div className="flex-1 text-right border-r border-gray-200 pr-6 hidden md:block">
                     <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Super Admin</span>
                     <span className="text-gray-800 font-semibold">For license validation</span>
                  </div>
                  
                  <a href="mailto:superadmin@solveit.brave" className="flex items-center gap-4 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-black transition-all hover:-translate-y-1">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                     <span>superadmin@solveit.brave</span>
                  </a>
               </div>
            </div>
         </div>
      </main>
      
      <footer className="absolute bottom-6 text-center text-xs text-gray-400 font-semibold tracking-wide">
         © 2026 ClustCare Systems. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;