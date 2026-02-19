import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Home } from './pages/Home';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLogin } from './pages/AdminLogin';
import { StaffWallet } from './pages/StaffWallet';
import { Verifier } from './pages/Verifier';
import { Role } from './types';

const AppContent = () => {
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
  };

  const handleExitAdmin = () => {
      setIsAdminLoggedIn(false);
      setCurrentRole(null);
  }

  const renderView = () => {
    switch (currentRole) {
      case Role.ADMIN:
        if (!isAdminLoggedIn) {
            return (
                <AdminLogin 
                    onLoginSuccess={() => {
                        handleAdminLoginSuccess();
                        // State update batching might require re-setting role or relying on re-render
                    }} 
                    onBack={() => setCurrentRole(null)} 
                />
            );
        }
        return (
            <div className="relative">
                <AdminDashboard />
                <button onClick={handleExitAdmin} className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-full shadow-lg text-sm z-50">Exit Admin</button>
            </div>
        );
      case Role.STAFF:
         return (
             <div className="relative">
                 <StaffWallet />
                 <button onClick={() => setCurrentRole(null)} className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-full shadow-lg text-sm z-50">Back to Home</button>
             </div>
         );
      case Role.VERIFIER:
         return (
             <div className="relative">
                 <Verifier />
                 <button onClick={() => setCurrentRole(null)} className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-full shadow-lg text-sm z-50">Exit Scanner</button>
             </div>
         );
      default:
        return (
            <Home 
                onSelectRole={setCurrentRole} 
                onAdminLogin={handleAdminLoginSuccess}
            />
        );
    }
  };

  return (
    <div className="antialiased">
      {renderView()}
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;