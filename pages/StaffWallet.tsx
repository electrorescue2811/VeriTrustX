import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { StaffStatus } from '../types';

export const StaffWallet = () => {
  const { currentUser, logout } = useApp();
  const [activeTab, setActiveTab] = useState<'ID' | 'LETTER' | 'CERT'>('ID');
  const [showFullQR, setShowFullQR] = useState(false);

  if (!currentUser) return <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-500">Please login to view wallet.</div>;

  const isActive = currentUser.status === StaffStatus.ACTIVE;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pb-24 relative overflow-hidden">
      {/* Top Decoration */}
      <div className="bg-brand-900 h-32 w-full absolute top-0 rounded-b-[3rem] shadow-xl z-0"></div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-6 flex justify-between items-center text-white mb-4">
        <div>
            <h1 className="text-2xl font-bold">My Wallet</h1>
            <p className="text-brand-200 text-xs">Digital Identity System</p>
        </div>
        <button onClick={logout} className="bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm transition-colors">
            <i className="fas fa-sign-out-alt text-sm"></i>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="relative z-10 px-4 mb-6">
        <div className="bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-lg flex justify-between">
            {['ID', 'LETTER', 'CERT'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${
                        activeTab === tab 
                        ? 'bg-brand-600 text-white shadow-md transform scale-105' 
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    {tab === 'ID' && 'ID Card'}
                    {tab === 'LETTER' && 'Appointment'}
                    {tab === 'CERT' && 'Certificate'}
                </button>
            ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 px-4 flex-1 overflow-y-auto">
        
        {/* ID CARD VIEW */}
        {activeTab === 'ID' && (
             <div className="animate-fade-in-up flex flex-col items-center">
                {/* 
                   Redesigned Card:
                   - Smaller/Visible: constrained maxWidth (max-w-xs)
                   - Colors: Yellow, Red, Brown mix
                */}
                <div className={`
                    relative w-full max-w-[300px] aspect-[0.7] rounded-2xl shadow-2xl overflow-hidden 
                    bg-gradient-to-br from-yellow-400 via-red-600 to-amber-900 
                    text-white p-5 flex flex-col justify-between 
                    transition-transform duration-500 hover:scale-[1.02] 
                    border-[3px] border-yellow-500/50
                `}>
                    {/* Artistic overlay */}
                     <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-2xl"></div>
                     <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/20 rounded-full -ml-16 -mb-16 blur-2xl"></div>
                     
                     {/* Card Header */}
                     <div className="z-10 flex flex-col items-center mt-2">
                         <div className="bg-white/20 p-2 rounded-full mb-2 backdrop-blur-sm">
                            <i className="fas fa-globe text-2xl text-white drop-shadow-md"></i>
                         </div>
                         <h3 className="font-bold tracking-widest text-lg uppercase drop-shadow-md">VeriTrustX</h3>
                         <div className={`px-3 py-1 mt-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/30 backdrop-blur-sm border border-white/20`}>
                            {currentUser.status}
                        </div>
                     </div>

                     {/* Profile */}
                     <div className="z-10 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-yellow-300 to-red-500 shadow-lg mb-3">
                            <img src={currentUser.photoUrl} className="w-full h-full rounded-full object-cover border-2 border-white" alt="Profile" />
                        </div>
                        <h2 className="text-xl font-bold leading-tight drop-shadow-sm">{currentUser.fullName}</h2>
                        <p className="text-sm text-yellow-100 font-medium">{currentUser.role}</p>
                     </div>

                     {/* ID & QR */}
                     <div className="z-10 bg-white/10 backdrop-blur-sm rounded-xl p-3 flex justify-between items-center border border-white/10">
                         <div className="text-left">
                            <p className="text-[9px] text-yellow-200 uppercase tracking-wider mb-1">Member ID</p>
                            <p className="text-xs font-mono font-bold">{currentUser.id}</p>
                            <p className="text-[9px] text-yellow-200 uppercase tracking-wider mt-1">Exp: {currentUser.validUntil}</p>
                         </div>
                         <div className="bg-white p-1 rounded shadow-sm">
                             <QRCodeDisplay value={currentUser.id} size={42} />
                         </div>
                     </div>
                </div>

                <p className="text-xs text-slate-400 mt-4 text-center px-8">
                    This digital ID is property of VeriTrustX. Show to authorized verifier upon request.
                </p>
             </div>
        )}

        {/* APPOINTMENT LETTER VIEW */}
        {activeTab === 'LETTER' && (
            <div className="animate-fade-in bg-white p-6 rounded-xl shadow-md border border-slate-200 text-slate-800 relative">
                <div className="border-b-2 border-slate-100 pb-4 mb-4 flex justify-between items-end">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">APPOINTMENT LETTER</h2>
                        <p className="text-xs text-slate-500">Ref: {currentUser.id}/HR/2024</p>
                    </div>
                    <div className="text-right">
                         <div className="text-brand-600 font-bold text-sm">VeriTrustX NGO</div>
                         <div className="text-[10px] text-slate-400">Global Humanitarian Aid</div>
                    </div>
                </div>
                
                <div className="space-y-4 text-sm leading-relaxed text-justify font-serif">
                    <p><strong>Date:</strong> {currentUser.joinDate}</p>
                    <p><strong>To:</strong> {currentUser.fullName}</p>
                    
                    <p className="mt-4">
                        Dear {currentUser.fullName},
                    </p>
                    <p>
                        We are pleased to offer you the position of <strong>{currentUser.role}</strong> in the <strong>{currentUser.department}</strong> department at VeriTrustX.
                    </p>
                    <p>
                        Your appointment is effective from {currentUser.joinDate}. You will report directly to the Department Head and are expected to adhere to our code of conduct.
                    </p>
                    <p>
                        This digital document serves as official proof of your employment and role within the organization.
                    </p>
                </div>

                <div className="mt-8 pt-4 flex justify-between items-end">
                    <div>
                        <div className="h-12 w-32 bg-contain bg-no-repeat mb-2" style={{backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png)'}}></div>
                        <div className="border-t border-slate-300 w-32 pt-1">
                            <p className="text-xs font-bold">Director of HR</p>
                        </div>
                    </div>
                    <div className="text-center">
                         <QRCodeDisplay value={`VERITRUST-DOC:${currentUser.id}`} size={64} />
                         <p className="text-[9px] text-slate-400 mt-1 uppercase">Official Seal</p>
                    </div>
                </div>
            </div>
        )}

        {/* CERTIFICATE VIEW */}
        {activeTab === 'CERT' && (
            <div className="animate-fade-in bg-[#fffdf5] p-1 rounded-xl shadow-lg border-4 border-double border-brand-900 relative">
                <div className="border border-brand-900/20 p-4 rounded-lg h-full flex flex-col items-center text-center relative overflow-hidden">
                    {/* Watermark */}
                    <i className="fas fa-certificate text-[150px] text-brand-900/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></i>
                    
                    <div className="z-10 w-full">
                        <div className="mb-6">
                            <i className="fas fa-award text-4xl text-yellow-500 mb-2"></i>
                            <h2 className="text-2xl font-serif font-bold text-brand-900 uppercase tracking-widest">Certificate</h2>
                            <p className="text-xs font-serif text-brand-700 uppercase tracking-widest">of Membership</p>
                        </div>
                        
                        <p className="text-sm text-slate-500 italic mb-2">This certifies that</p>
                        <h1 className="text-2xl font-bold text-slate-800 font-serif mb-1">{currentUser.fullName}</h1>
                        <div className="h-px w-32 bg-brand-900/30 mx-auto mb-4"></div>
                        
                        <p className="text-xs text-slate-600 mb-6 px-4 leading-relaxed">
                            Is a duly registered and active member of VeriTrustX designated as <strong>{currentUser.role}</strong>. This certification confirms identity and authority.
                        </p>

                        <div className="flex justify-between items-center w-full px-2 mt-4">
                            <div className="text-left">
                                <p className="text-xs text-slate-400">Valid Until</p>
                                <p className="text-sm font-bold text-brand-800">{currentUser.validUntil}</p>
                            </div>
                            <QRCodeDisplay value={currentUser.id} size={60} />
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Floating QR Button */}
      <button 
        onClick={() => setShowFullQR(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-brand-500 hover:scale-110 transition-all z-50 ring-4 ring-brand-600/30"
      >
        <i className="fas fa-qrcode text-2xl"></i>
      </button>

      {/* Full Screen QR Modal */}
      {showFullQR && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center relative">
                <button 
                    onClick={() => setShowFullQR(false)}
                    className="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200"
                >
                    <i className="fas fa-times"></i>
                </button>
                
                <h3 className="text-xl font-bold text-slate-800 mb-1">Identity Verification</h3>
                <p className="text-sm text-slate-400 mb-6">Show this code to the scanner</p>
                
                <div className="bg-slate-900 p-4 rounded-xl shadow-inner inline-block">
                    <QRCodeDisplay value={currentUser.id} size={200} />
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-sm font-mono bg-slate-50 py-2 px-4 rounded-full mx-auto w-fit">
                    <i className="fas fa-hashtag text-xs"></i>
                    {currentUser.id}
                </div>
            </div>
        </div>
      )}

    </div>
  );
};