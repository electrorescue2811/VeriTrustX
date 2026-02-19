import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StaffStatus, StaffMember } from '../types';
import { analyzeSecurityLogs } from '../services/geminiService';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { Scanner } from '../components/Scanner';

export const AdminDashboard = () => {
  const { staffList, updateStaffStatus, addStaff, verificationLogs } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedStaff, setScannedStaff] = useState<StaffMember | null>(null);
  
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Document Viewer State
  const [viewDocStaff, setViewDocStaff] = useState<StaffMember | null>(null);
  const [docType, setDocType] = useState<'LETTER' | 'CERT'>('LETTER');

  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({
    fullName: '',
    role: '',
    department: '',
    email: '',
  });

  const handleStatusToggle = (id: string, currentStatus: StaffStatus) => {
    let nextStatus = StaffStatus.ACTIVE;
    if (currentStatus === StaffStatus.ACTIVE) nextStatus = StaffStatus.SUSPENDED;
    else if (currentStatus === StaffStatus.SUSPENDED) nextStatus = StaffStatus.ACTIVE;
    else if (currentStatus === StaffStatus.EXPIRED) nextStatus = StaffStatus.ACTIVE;
    updateStaffStatus(id, nextStatus);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `NGO-${Math.floor(1000 + Math.random() * 9000)}`;
    const staff: StaffMember = {
      id,
      fullName: newStaff.fullName!,
      role: newStaff.role!,
      department: newStaff.department!,
      email: newStaff.email!,
      joinDate: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 31536000000).toISOString().split('T')[0],
      status: StaffStatus.ACTIVE,
      photoUrl: `https://picsum.photos/200/200?random=${id}`
    };
    addStaff(staff);
    setShowAddModal(false);
    setNewStaff({ fullName: '', role: '', department: '', email: '' });
  };

  const handleScan = (id: string) => {
      const staff = staffList.find(s => s.id === id);
      if (staff) {
          setScannedStaff(staff);
          setShowScanner(false);
      }
  };

  const runSecurityAudit = async () => {
    setIsAnalyzing(true);
    const insight = await analyzeSecurityLogs(verificationLogs, staffList);
    setAiInsight(insight);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-10">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
             <div className="bg-brand-600 text-white p-2 rounded-lg shadow-brand-200 shadow-md">
                <i className="fas fa-shield-alt"></i>
             </div>
             <h1 className="text-xl font-bold text-slate-800 tracking-tight">VeriTrustX <span className="text-slate-400 font-normal">Admin</span></h1>
        </div>
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setShowScanner(true)}
                className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-md flex items-center gap-2"
            >
                <i className="fas fa-qrcode"></i> Scan Staff ID
            </button>
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:block">System Status: Online</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                <i className="fas fa-bell"></i>
            </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
                { label: 'Total Staff', val: staffList.length, icon: 'fa-users', color: 'text-brand-600', bg: 'bg-brand-50' },
                { label: 'Active', val: staffList.filter(s => s.status === StaffStatus.ACTIVE).length, icon: 'fa-check-circle', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Suspended', val: staffList.filter(s => s.status === StaffStatus.SUSPENDED).length, icon: 'fa-ban', color: 'text-red-600', bg: 'bg-red-50' },
                { label: 'Scans Today', val: verificationLogs.length, icon: 'fa-qrcode', color: 'text-purple-600', bg: 'bg-purple-50' }
            ].map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-slate-800">{stat.val}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center text-xl`}>
                        <i className={`fas ${stat.icon}`}></i>
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Staff & AI */}
            <div className="lg:col-span-2 space-y-8">
                 
                 {/* AI Insight */}
                 <div className="bg-gradient-to-br from-brand-600 to-emerald-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                             <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                <i className="fas fa-robot"></i> AI Security Analysis
                             </h3>
                             <p className="text-brand-100 text-sm max-w-lg leading-relaxed">
                                {aiInsight || "System ready to analyze verification logs for anomalies, fraud patterns, and security risks."}
                             </p>
                        </div>
                        <button 
                            onClick={runSecurityAudit}
                            disabled={isAnalyzing}
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-white/10"
                        >
                             {isAnalyzing ? <i className="fas fa-spinner fa-spin"></i> : 'Run Audit'}
                        </button>
                    </div>
                 </div>

                 {/* Staff Table */}
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-bold text-lg text-slate-800">Staff Directory</h2>
                        <button 
                            onClick={() => setShowAddModal(true)}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-slate-200"
                        >
                            <i className="fas fa-plus mr-2"></i> Add Staff
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {staffList.map((staff) => (
                                    <tr key={staff.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={staff.photoUrl} className="w-9 h-9 rounded-full object-cover bg-slate-200" alt=""/>
                                                <div>
                                                    <div className="font-bold text-slate-700">{staff.fullName}</div>
                                                    <div className="text-xs text-slate-400 font-mono">{staff.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{staff.role}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                                                ${staff.status === StaffStatus.ACTIVE ? 'bg-green-100 text-green-700' : 
                                                  staff.status === StaffStatus.SUSPENDED ? 'bg-red-100 text-red-700' : 
                                                  'bg-orange-100 text-orange-700'}`}>
                                                {staff.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => { setViewDocStaff(staff); setDocType('LETTER'); }}
                                                    className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg hover:border-brand-500 hover:text-brand-600"
                                                >
                                                    <i className="fas fa-file-alt mr-1"></i> Docs
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusToggle(staff.id, staff.status)}
                                                    className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50"
                                                >
                                                    {staff.status === StaffStatus.ACTIVE ? 'Suspend' : 'Activate'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </div>
            </div>

            {/* Right Column: Logs */}
            <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Live Verification Logs</h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {verificationLogs.length === 0 && <p className="text-sm text-slate-400 italic">No scans recorded yet.</p>}
                        {verificationLogs.map((log) => {
                            const staff = staffList.find(s => s.id === log.staffId);
                            return (
                                <div key={log.id} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${log.result === 'PASS' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">
                                            {staff?.fullName || 'Unknown ID'}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Scan Result: <span className={log.result === 'PASS' ? 'text-green-600' : 'text-red-600 font-bold'}>{log.result}</span>
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-1">
                                            {new Date(log.timestamp).toLocaleTimeString()} • {log.verifierId}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Register New Staff</h3>
                    <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form onSubmit={handleAddStaff} className="space-y-4">
                    <div><label className="text-xs font-bold text-slate-500 uppercase">Full Name</label><input required className="w-full px-4 py-2 mt-1 rounded-lg border border-slate-200" value={newStaff.fullName} onChange={(e)=>setNewStaff({...newStaff, fullName: e.target.value})} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-slate-500 uppercase">Role</label><input required className="w-full px-4 py-2 mt-1 rounded-lg border border-slate-200" value={newStaff.role} onChange={(e)=>setNewStaff({...newStaff, role: e.target.value})} /></div>
                        <div><label className="text-xs font-bold text-slate-500 uppercase">Dept</label><input required className="w-full px-4 py-2 mt-1 rounded-lg border border-slate-200" value={newStaff.department} onChange={(e)=>setNewStaff({...newStaff, department: e.target.value})} /></div>
                    </div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase">Email</label><input required type="email" className="w-full px-4 py-2 mt-1 rounded-lg border border-slate-200" value={newStaff.email} onChange={(e)=>setNewStaff({...newStaff, email: e.target.value})} /></div>
                    <button className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl mt-2 hover:bg-brand-700 shadow-lg">Generate Identity</button>
                </form>
             </div>
         </div>
      )}

      {/* Admin Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                 <button onClick={() => setShowScanner(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white z-10">
                     <i className="fas fa-times text-xl"></i>
                 </button>
                 <h3 className="text-lg font-bold text-white mb-4 text-center">Scan Staff QR</h3>
                 <div className="rounded-xl overflow-hidden mb-4 border-2 border-slate-600 relative">
                     <Scanner active={true} onScan={handleScan} />
                     <div className="absolute inset-0 pointer-events-none border-4 border-brand-500/30 rounded-xl"></div>
                 </div>
                 <p className="text-center text-slate-400 text-sm">Align the QR code to verify details</p>
             </div>
        </div>
      )}

      {/* Scanned Result Modal */}
      {scannedStaff && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-fade-in-up">
                <div className="bg-brand-600 p-6 text-center relative">
                     <button onClick={() => setScannedStaff(null)} className="absolute top-4 right-4 text-white/70 hover:text-white">
                        <i className="fas fa-times text-xl"></i>
                     </button>
                     <img 
                        src={scannedStaff.photoUrl} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto mb-3 object-cover bg-slate-200"
                     />
                     <h2 className="text-xl font-bold text-white">{scannedStaff.fullName}</h2>
                     <p className="text-brand-100 text-sm">{scannedStaff.role}</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                         <div className="bg-slate-50 p-3 rounded-lg text-center">
                             <p className="text-[10px] text-slate-400 uppercase font-bold">Status</p>
                             <span className={`text-sm font-bold ${
                                scannedStaff.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'
                             }`}>{scannedStaff.status}</span>
                         </div>
                         <div className="bg-slate-50 p-3 rounded-lg text-center">
                             <p className="text-[10px] text-slate-400 uppercase font-bold">Department</p>
                             <span className="text-sm font-bold text-slate-700">{scannedStaff.department}</span>
                         </div>
                    </div>
                    
                    <div className="space-y-3">
                         <div className="flex justify-between border-b border-slate-100 pb-2">
                             <span className="text-sm text-slate-500">Staff ID</span>
                             <span className="text-sm font-mono font-bold text-slate-700">{scannedStaff.id}</span>
                         </div>
                         <div className="flex justify-between border-b border-slate-100 pb-2">
                             <span className="text-sm text-slate-500">Email</span>
                             <span className="text-sm font-medium text-slate-700">{scannedStaff.email}</span>
                         </div>
                         <div className="flex justify-between border-b border-slate-100 pb-2">
                             <span className="text-sm text-slate-500">Valid Until</span>
                             <span className="text-sm font-medium text-slate-700">{scannedStaff.validUntil}</span>
                         </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                         <button 
                            onClick={() => { setScannedStaff(null); setViewDocStaff(scannedStaff); setDocType('LETTER'); }}
                            className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-slate-800"
                         >
                            View Docs
                         </button>
                         {scannedStaff.status === 'ACTIVE' && (
                            <button 
                                onClick={() => { handleStatusToggle(scannedStaff.id, StaffStatus.ACTIVE); setScannedStaff({...scannedStaff, status: StaffStatus.SUSPENDED}); }}
                                className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg text-sm font-bold hover:bg-red-200"
                            >
                                Suspend
                            </button>
                         )}
                         {scannedStaff.status !== 'ACTIVE' && (
                             <button 
                                onClick={() => { handleStatusToggle(scannedStaff.id, scannedStaff.status); setScannedStaff({...scannedStaff, status: StaffStatus.ACTIVE}); }}
                                className="flex-1 bg-green-100 text-green-600 py-2 rounded-lg text-sm font-bold hover:bg-green-200"
                            >
                                Activate
                            </button>
                         )}
                    </div>
                </div>
            </div>
         </div>
      )}

      {/* Doc Viewer Modal */}
      {viewDocStaff && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-slate-100 rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col overflow-hidden animate-fade-in">
                  
                  {/* Modal Header */}
                  <div className="bg-white p-4 border-b border-slate-200 flex justify-between items-center">
                      <div>
                          <h3 className="font-bold text-slate-800">Document Generator</h3>
                          <p className="text-xs text-slate-500">Target: {viewDocStaff.fullName}</p>
                      </div>
                      <div className="flex gap-2">
                           <button onClick={() => window.print()} className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-slate-700"><i className="fas fa-print mr-1"></i> Print</button>
                           <button onClick={() => setViewDocStaff(null)} className="bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-sm hover:bg-slate-300"><i className="fas fa-times"></i></button>
                      </div>
                  </div>

                  {/* Doc Type Toggles */}
                  <div className="p-4 flex gap-2 justify-center bg-slate-50">
                      <button onClick={()=>setDocType('LETTER')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${docType === 'LETTER' ? 'bg-brand-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'}`}>Appointment Letter</button>
                      <button onClick={()=>setDocType('CERT')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${docType === 'CERT' ? 'bg-brand-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'}`}>Membership Cert</button>
                  </div>

                  {/* Doc Preview Area */}
                  <div className="flex-1 overflow-y-auto p-8 bg-slate-200 flex justify-center items-start">
                      
                      {/* APPOINTMENT LETTER PREVIEW */}
                      {docType === 'LETTER' && (
                         <div className="bg-white w-[210mm] min-h-[297mm] p-[20mm] shadow-xl text-slate-900 text-sm font-serif relative">
                             {/* Letter Header */}
                             <div className="flex justify-between items-end border-b-2 border-slate-800 pb-6 mb-8">
                                 <h1 className="text-3xl font-bold tracking-tight text-brand-900">VeriTrustX</h1>
                                 <div className="text-right">
                                     <p className="font-bold uppercase text-xs tracking-widest text-slate-500">Official Appointment</p>
                                     <p className="text-xs text-slate-400">Ref: {viewDocStaff.id}/HR</p>
                                 </div>
                             </div>

                             <div className="space-y-6 text-base leading-loose">
                                 <p>{viewDocStaff.joinDate}</p>
                                 <p className="font-bold">{viewDocStaff.fullName}</p>
                                 
                                 <p>Dear {viewDocStaff.fullName},</p>
                                 <p>
                                    We are pleased to formally offer you the position of <strong>{viewDocStaff.role}</strong> within the <strong>{viewDocStaff.department}</strong> department at VeriTrustX NGO.
                                 </p>
                                 <p>
                                    Your tenure begins effective {viewDocStaff.joinDate} and is valid until {viewDocStaff.validUntil}, subject to renewal based on performance and funding availability.
                                 </p>
                                 <p>
                                     Please retain this digitally verified document as proof of your engagement with our organization.
                                 </p>
                             </div>

                             <div className="mt-20 flex justify-between items-end">
                                 <div>
                                     <div className="w-40 border-t border-slate-400 pt-2">
                                         <p className="font-bold">Director of Operations</p>
                                         <p className="text-xs text-slate-500">Authorized Signatory</p>
                                     </div>
                                 </div>
                                 <div className="text-center">
                                      <div className="p-1 bg-white border border-slate-200 inline-block">
                                        <QRCodeDisplay value={`DOC:${viewDocStaff.id}`} size={80} />
                                      </div>
                                      <p className="text-[10px] mt-1 text-slate-400 uppercase tracking-wider">Digital Seal</p>
                                 </div>
                             </div>
                         </div>
                      )}

                      {/* CERTIFICATE PREVIEW */}
                      {docType === 'CERT' && (
                          <div className="bg-[#fffdf5] w-[297mm] h-[210mm] p-2 shadow-xl border-8 border-double border-brand-900 relative flex items-center justify-center">
                              <div className="w-full h-full border border-brand-900/30 p-12 flex flex-col items-center justify-center text-center relative">
                                   <div className="absolute top-8 left-8 w-24 h-24 border-t-4 border-l-4 border-brand-900 opacity-20"></div>
                                   <div className="absolute bottom-8 right-8 w-24 h-24 border-b-4 border-r-4 border-brand-900 opacity-20"></div>

                                   <h1 className="text-5xl font-serif font-bold text-brand-900 mb-2 uppercase tracking-widest">Certificate</h1>
                                   <p className="text-xl font-serif text-brand-700 uppercase tracking-[0.3em] mb-12">of Registration</p>

                                   <p className="text-lg italic text-slate-500 mb-4">This is to certify that</p>
                                   <h2 className="text-6xl font-serif font-bold text-slate-800 mb-4 font-cursive">{viewDocStaff.fullName}</h2>
                                   <div className="w-64 h-1 bg-brand-900/20 mb-8"></div>

                                   <p className="text-xl text-slate-600 max-w-2xl leading-relaxed mb-12">
                                       Has been officially verified and registered as <strong>{viewDocStaff.role}</strong> in the Department of <strong>{viewDocStaff.department}</strong> under the VeriTrustX Governance Framework.
                                   </p>

                                   <div className="flex w-full justify-between items-end px-20">
                                       <div className="text-center">
                                           <p className="font-bold text-lg">{viewDocStaff.joinDate}</p>
                                           <div className="w-40 h-px bg-slate-400 my-2"></div>
                                           <p className="text-xs uppercase text-slate-500">Date Issued</p>
                                       </div>
                                       
                                       <div className="mb-4">
                                            <div className="w-24 h-24 rounded-full bg-brand-900 text-white flex items-center justify-center shadow-lg border-4 border-yellow-500/50">
                                                <i className="fas fa-shield-alt text-4xl"></i>
                                            </div>
                                       </div>

                                       <div className="text-center">
                                           <div className="flex justify-center mb-2">
                                              <QRCodeDisplay value={viewDocStaff.id} size={64} />
                                           </div>
                                           <p className="text-xs uppercase text-slate-500">Digital ID: {viewDocStaff.id}</p>
                                       </div>
                                   </div>
                              </div>
                          </div>
                      )}

                  </div>
              </div>
          </div>
      )}

    </div>
  );
};