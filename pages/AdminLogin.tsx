import React, { useState } from 'react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
        // Hardcoded password check as requested
        if (password === 'Aman@12') {
            onLoginSuccess();
        } else {
            setError("Invalid credentials. Please check password.");
            setIsLoading(false);
        }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100 animate-fade-in-up">
        
        {/* Header */}
        <div className="text-center mb-8">
            <div className="inline-block p-3 bg-brand-50 text-brand-600 rounded-xl mb-4 border border-brand-100">
                <i className="fas fa-user-shield text-3xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Admin Portal</h2>
            <p className="text-slate-500 text-sm">Secure Access Required</p>
        </div>

        {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                <i className="fas fa-exclamation-circle"></i> {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none transition-all"
                    placeholder="admin@ngo.org"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none transition-all"
                    placeholder="••••••••"
                />
            </div>

            <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200 disabled:opacity-50 flex justify-center items-center gap-2"
            >
                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Login'}
            </button>
        </form>

        <button onClick={onBack} className="w-full mt-6 text-sm text-slate-400 hover:text-slate-600">
            Cancel and go back
        </button>
      </div>
    </div>
  );
};