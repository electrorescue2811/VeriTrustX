import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { StaffAuth } from './StaffAuth';

interface HomeProps {
  onSelectRole: (role: Role) => void;
  onAdminLogin: () => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectRole, onAdminLogin }) => {
  const { loginAsStaff } = useApp();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'admin' | 'staff'>('admin');
  
  // Admin Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleStaffLogin = (id: string) => {
    loginAsStaff(id);
    onSelectRole(Role.STAFF);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
        onAdminLogin(); // Set logged in state in App
        onSelectRole(Role.ADMIN); // Navigate
    } else {
        setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 relative overflow-hidden flex flex-col">
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
             <div className="bg-brand-600 text-white p-2 rounded-lg">
                <i className="fas fa-fingerprint text-xl"></i>
             </div>
             <h1 className="text-xl font-bold text-slate-900 tracking-tight">VeriTrustX</h1>
        </div>
        <button 
            onClick={() => setShowLoginModal(true)}
            className="bg-white text-brand-900 font-bold py-2 px-6 rounded-full shadow-sm border border-brand-100 hover:shadow-md transition-all active:scale-95 text-sm"
        >
            SIGN IN
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center p-6 relative z-10">
        <div className="max-w-4xl mx-auto">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-bold mb-8 uppercase tracking-wider shadow-sm border border-brand-200">
                <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></span>
                <span>Secure Digital Governance</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                Identity Verified. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-800">Trust Established.</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
                VeriTrustX provides instant, secure, and paperless identity verification for NGOs. 
                Manage staff credentials, prevent fraud with AI, and ensure operational integrity.
            </p>

            <div className="flex justify-center gap-8 text-left">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white text-brand-600 shadow-sm flex items-center justify-center">
                        <i className="fas fa-check"></i>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">Instant Scan</p>
                        <p className="text-xs text-slate-500">QR Verification</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white text-brand-600 shadow-sm flex items-center justify-center">
                        <i className="fas fa-shield-alt"></i>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">Fraud Proof</p>
                        <p className="text-xs text-slate-500">AI Detection</p>
                    </div>
                </div>
            </div>
        </div>
      </main>

      {/* Footer / Scanner Link */}
      <footer className="p-6 text-center text-brand-800/60 text-sm z-10">
        <button onClick={() => onSelectRole(Role.VERIFIER)} className="hover:text-brand-600 transition-colors font-semibold">
            <i className="fas fa-qrcode mr-2"></i> Access Public Scanner
        </button>
        <p className="mt-2 text-xs opacity-70">&copy; 2024 VeriTrustX System</p>
      </footer>

      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-200/40 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none"></div>

      {/* Login Modal Portal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Portal Access</h3>
                    <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-slate-600">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100">
                    <button 
                        onClick={() => setActiveTab('admin')}
                        className={`flex-1 py-4 text-sm font-bold text-center transition-colors border-b-2 
                        ${activeTab === 'admin' ? 'border-brand-600 text-brand-600 bg-brand-50/50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                    >
                        <i className="fas fa-user-shield mr-2"></i> Admin Login
                    </button>
                    <button 
                        onClick={() => setActiveTab('staff')}
                        className={`flex-1 py-4 text-sm font-bold text-center transition-colors border-b-2 
                        ${activeTab === 'staff' ? 'border-brand-600 text-brand-600 bg-brand-50/50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                    >
                        <i className="fas fa-id-card mr-2"></i> Staff Wallet
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'admin' ? (
                        <form onSubmit={handleAdminSubmit} className="space-y-4">
                            <div className="bg-brand-50 p-3 rounded-lg text-xs text-brand-700 border border-brand-100 mb-2">
                                <i className="fas fa-info-circle mr-1"></i> Demo: Use <strong>admin@ngo.org</strong> / any pass
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                                <input 
                                    type="email" 
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="name@organization.org"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                                <input 
                                    type="password" 
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-xs text-red-500">{error}</p>}
                            <button className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-brand-200">
                                Login to Dashboard
                            </button>
                        </form>
                    ) : (
                        <StaffAuth onLogin={handleStaffLogin} />
                    )}
                </div>

            </div>
        </div>
      )}
    </div>
  );
};