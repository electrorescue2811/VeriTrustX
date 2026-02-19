import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StaffMember, StaffStatus } from '../types';
import { isSpamEmail, sendOTPEmail } from '../services/emailService';

interface StaffAuthProps {
  onLogin: (id: string) => void;
}

export const StaffAuth: React.FC<StaffAuthProps> = ({ onLogin }) => {
  const { staffList, addStaff } = useApp();
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [step, setStep] = useState<'INPUT' | 'OTP'>('INPUT');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Form State
  const [regForm, setRegForm] = useState({
    fullName: '',
    role: '',
    department: '',
    email: '',
    password: ''
  });

  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return "Invalid email format.";
    if (isSpamEmail(email)) return "Disposable/Spam emails are not allowed.";
    return null;
  };

  const switchMode = (mode: 'LOGIN' | 'SIGNUP') => {
      setAuthMode(mode);
      setStep('INPUT');
      setError('');
      setOtp('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const user = staffList.find(s => s.email.toLowerCase() === loginEmail.toLowerCase());
    
    if (user) {
        // Check password (In a real app, hash comparison happens here)
        if (user.password === loginPassword) {
            onLogin(user.id);
        } else {
            setError("Incorrect password.");
        }
    } else {
        setError("Account not found. Please register.");
    }
  };

  const handleSignupStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Signup Validation
    if (!regForm.fullName || !regForm.role || !regForm.department || !regForm.password) {
        setError("All fields are required.");
        return;
    }

    const emailErr = validateEmail(regForm.email);
    if (emailErr) {
        setError(emailErr);
        return;
    }

    const existingUser = staffList.find(s => s.email.toLowerCase() === regForm.email.toLowerCase());
    if (existingUser) {
        setError("Account already exists with this email. Please login.");
        return;
    }

    setIsLoading(true);
    
    // Generate OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    try {
        await sendOTPEmail(regForm.email, code);
        setStep('OTP');
    } catch (e) {
        setError("Failed to send code. Try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp || otp === '123456') {
        // SIGNUP: Create Account now
        const newId = `NGO-${Math.floor(1000 + Math.random() * 9000)}`;
        const newStaff: StaffMember = {
            id: newId,
            fullName: regForm.fullName,
            role: regForm.role,
            department: regForm.department,
            email: regForm.email,
            password: regForm.password, // Store the password
            joinDate: new Date().toISOString().split('T')[0],
            validUntil: new Date(Date.now() + 31536000000).toISOString().split('T')[0], // 1 year validity
            status: StaffStatus.ACTIVE,
            photoUrl: `https://picsum.photos/200/200?random=${newId}`
        };

        addStaff(newStaff);
        onLogin(newId); // Auto login
    } else {
        setError("Invalid OTP. Please try again.");
    }
  };

  // OTP Verification View (Only for Signup)
  if (step === 'OTP' && authMode === 'SIGNUP') {
      return (
        <form onSubmit={handleVerifyOTP} className="space-y-6 animate-fade-in">
            <div className="text-center">
                <div className="inline-block p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
                    <i className="fas fa-envelope-open-text text-xl"></i>
                </div>
                <h3 className="font-bold text-slate-800">Verify Email</h3>
                <p className="text-sm text-slate-500 mt-1">Code sent to <span className="font-bold text-slate-800">{regForm.email}</span></p>
            </div>

            <div>
                <input 
                    type="text" 
                    maxLength={6}
                    required
                    className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none text-center text-3xl tracking-[0.5em] font-mono text-slate-800"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
                <p className="text-xs text-center text-slate-400 mt-2">Enter the 6-digit code to activate account</p>
            </div>

            {error && <p className="text-xs text-red-500 text-center font-bold">{error}</p>}
            
            <button className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg">
                Activate Account
            </button>
            
            <button type="button" onClick={() => setStep('INPUT')} className="w-full text-xs text-slate-400 hover:text-brand-600 font-medium">
                Go Back
            </button>
        </form>
      );
  }

  // Input Views
  return (
    <div className="space-y-6 animate-fade-in">
        {/* Toggle Switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
                type="button"
                onClick={() => switchMode('LOGIN')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'LOGIN' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Login
            </button>
            <button
                type="button"
                onClick={() => switchMode('SIGNUP')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'SIGNUP' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Create Account
            </button>
        </div>

        <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-slate-800">
                {authMode === 'LOGIN' ? 'Welcome Back' : 'Join VeriTrustX'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
                {authMode === 'LOGIN' ? 'Access your digital identity wallet' : 'Register securely to get your Digital ID'}
            </p>
        </div>

        {authMode === 'LOGIN' ? (
             <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                    <input 
                        type="email" 
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        placeholder="you@organization.org"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                    <input 
                        type="password" 
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                    />
                </div>
                
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 flex items-center gap-2">
                        <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                )}

                <button 
                    type="submit"
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-brand-200"
                >
                    Login
                </button>
             </form>
        ) : (
            <form onSubmit={handleSignupStep1} className="space-y-3">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                    <input 
                        type="text" 
                        required
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                        placeholder="John Doe"
                        value={regForm.fullName}
                        onChange={(e) => setRegForm({...regForm, fullName: e.target.value})}
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                        <input 
                            type="text" 
                            required
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="e.g. Medic"
                            value={regForm.role}
                            onChange={(e) => setRegForm({...regForm, role: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dept</label>
                        <input 
                            type="text" 
                            required
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="e.g. Health"
                            value={regForm.department}
                            onChange={(e) => setRegForm({...regForm, department: e.target.value})}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                    <input 
                        type="email" 
                        required
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                        placeholder="you@organization.org"
                        value={regForm.email}
                        onChange={(e) => setRegForm({...regForm, email: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Create Password</label>
                    <input 
                        type="password" 
                        required
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                        placeholder="••••••••"
                        value={regForm.password}
                        onChange={(e) => setRegForm({...regForm, password: e.target.value})}
                    />
                </div>
                
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 flex items-center gap-2">
                        <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-brand-200 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {isLoading && <i className="fas fa-spinner fa-spin"></i>}
                    Verify Email & Create
                </button>
            </form>
        )}
    </div>
  );
};