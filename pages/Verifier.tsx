import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Scanner } from '../components/Scanner';
import { StaffMember, StaffStatus, VerificationLog } from '../types';
import { MOCK_STAFF } from '../constants';

export const Verifier = () => {
  const { staffList, logVerification, currentUser } = useApp();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [result, setResult] = useState<StaffMember | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  // Initialize or retrieve unique device ID
  const [deviceId] = useState(() => {
    const stored = localStorage.getItem('verifier_device_id');
    if (stored) return stored;
    const newId = `DEVICE-${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem('verifier_device_id', newId);
    return newId;
  });

  const handleScan = (id: string) => {
    if (!isScanning) return;
    
    // Simulate lookup
    const staff = staffList.find(s => s.id === id);
    setScannedData(id);
    setResult(staff || null);
    setIsScanning(false);

    // Create log
    if (staff) {
        const log: VerificationLog = {
            id: crypto.randomUUID(),
            staffId: staff.id,
            timestamp: new Date().toISOString(),
            statusAtScan: staff.status,
            // Use logged in user ID if available, otherwise device ID
            verifierId: currentUser?.id || deviceId,
            result: staff.status === StaffStatus.ACTIVE ? 'PASS' : 'FAIL'
        };
        logVerification(log);
    }
  };

  const resetScan = () => {
    setScannedData(null);
    setResult(null);
    setIsScanning(true);
  };

  // Demo helper to simulate scanning without camera
  const demoScan = (staffId: string) => {
    handleScan(staffId);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
            <i className="fas fa-shield-alt text-brand-500 text-xl"></i>
            <h1 className="font-bold text-lg tracking-wide">VeriTrustX Scanner</h1>
        </div>
        <div className="text-xs font-mono text-white/50">
            ID: {currentUser?.id || deviceId}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full">
        
        {isScanning ? (
            <>
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-light mb-2">Ready to Verify</h2>
                    <p className="text-white/60 text-sm">Align the staff QR code within the frame.</p>
                </div>

                <div className="mb-8">
                    <Scanner active={true} onScan={handleScan} />
                </div>

                {/* Demo Controls for Prototype */}
                <div className="mt-auto bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="text-xs text-brand-400 uppercase font-bold mb-3 tracking-wider">Demo Simulation Controls</p>
                    <div className="grid grid-cols-2 gap-2">
                        {MOCK_STAFF.map(s => (
                             <button 
                                key={s.id}
                                onClick={() => demoScan(s.id)}
                                className="text-xs bg-white/10 hover:bg-white/20 py-2 px-3 rounded text-left truncate transition-colors"
                             >
                                <span className="block font-bold">{s.fullName}</span>
                                <span className={`text-[10px] ${s.status === 'ACTIVE' ? 'text-green-400' : 'text-red-400'}`}>{s.status}</span>
                             </button>
                        ))}
                        <button 
                            onClick={() => demoScan("INVALID-ID")}
                            className="text-xs bg-red-900/30 hover:bg-red-900/50 py-2 px-3 rounded text-left text-red-300 transition-colors border border-red-900/50"
                        >
                            <span className="block font-bold">Fake ID</span>
                            <span className="text-[10px]">Simulation</span>
                        </button>
                    </div>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
                {/* Result Card */}
                <div className={`
                    w-full bg-white rounded-2xl shadow-2xl overflow-hidden text-slate-900
                    ${!result ? 'border-4 border-red-500' : result.status === StaffStatus.ACTIVE ? 'border-4 border-green-500' : 'border-4 border-orange-500'}
                `}>
                    
                    {/* Status Header */}
                    <div className={`p-6 text-center text-white
                        ${!result ? 'bg-red-600' : result.status === StaffStatus.ACTIVE ? 'bg-green-600' : 'bg-orange-500'}
                    `}>
                        <div className="text-6xl mb-2">
                            {!result ? <i className="fas fa-times-circle"></i> : 
                             result.status === StaffStatus.ACTIVE ? <i className="fas fa-check-circle"></i> : 
                             <i className="fas fa-exclamation-triangle"></i>}
                        </div>
                        <h2 className="text-3xl font-bold uppercase tracking-widest">
                            {!result ? 'FAKE / INVALID' : result.status}
                        </h2>
                        <p className="text-white/80 text-sm mt-1">
                             {!result ? 'Identity not found in database' : 'Verification Complete'}
                        </p>
                    </div>

                    {/* Details */}
                    {result && (
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <img src={result.photoUrl} className="w-20 h-20 rounded-lg object-cover bg-slate-200" alt="Staff" />
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">{result.fullName}</h3>
                                    <p className="text-slate-500 font-medium">{result.role}</p>
                                    <p className="text-xs text-slate-400 mt-1">ID: {result.id}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500">Department</span>
                                    <span className="font-semibold text-slate-800">{result.department}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500">Valid Until</span>
                                    <span className="font-semibold text-slate-800">{result.validUntil}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {!result && (
                        <div className="p-6 text-center text-slate-600">
                             <p>The scanned QR code {scannedData} does not match any active record.</p>
                             <p className="mt-4 font-bold text-red-600">Report this incident immediately.</p>
                        </div>
                    )}

                    <div className="p-4 bg-slate-50">
                        <button 
                            onClick={resetScan}
                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg active:scale-95"
                        >
                            Scan Next
                        </button>
                    </div>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};