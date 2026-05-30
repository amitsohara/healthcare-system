import React, { useEffect, useState } from 'react';

interface Stats {
  totalAppointments: number;
  scheduled: number;
  completed: number;
  totalDoctors: number;
  totalPatients: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  const statCards = [
    { label: "Total Doctors", value: stats?.totalDoctors || 0, trend: "Active", progress: "100%", trendClass: "text-emerald-600" },
    { label: "Today's Appointments", value: stats?.scheduled || 0, trend: "+12%", progress: "70%", trendClass: "text-emerald-600" },
    { label: "Queue Efficiency", value: "18m", trend: "-4m", progress: "60%", trendClass: "text-amber-600" },
    { label: "Total Patients", value: stats?.totalPatients || 0, trend: "Stable", progress: "40%", trendClass: "text-emerald-600" },
  ];

  return (
    <div className="grid grid-cols-12 grid-rows-[auto_1fr] gap-6 h-full">
      {/* Stat Cards */}
      {statCards.map((stat, i) => (
        <div key={i} className="col-span-12 md:col-span-6 lg:col-span-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black">{stat.value}</span>
            <span className={`text-xs font-bold ${stat.trendClass}`}>{stat.trend}</span>
          </div>
          {stat.progress && (
            <div className="h-1 w-full bg-slate-100 rounded-full mt-3">
              <div className="h-1 bg-blue-600 rounded-full" style={{ width: stat.progress }}></div>
            </div>
          )}
        </div>
      ))}

      {/* Main Visual Section */}
      <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Live AI Traffic & Routing</h3>
          <div className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full">LIVE FEED</div>
        </div>
        <div className="flex-1 p-6 relative overflow-hidden">
          <div className="grid grid-cols-3 h-full gap-8">
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase mb-4">Incoming Symptom (NLP)</p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm border-l-4 border-l-blue-500">
                <p className="font-medium">"Severe chest pain and sweating"</p>
                <p className="text-[10px] text-slate-400 mt-1">Source: Voice Call | HI-EN Mixed</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm border-l-4 border-l-emerald-500">
                <p className="font-medium">"Child having 102F fever"</p>
                <p className="text-[10px] text-slate-400 mt-1">Source: WhatsApp | Marathi</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm border-l-4 border-l-slate-400 opacity-60">
                <p className="font-medium">"Regular checkup for skin rash"</p>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center relative py-12">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg z-10">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div className="absolute w-px h-full bg-slate-100 left-1/2 -translate-x-1/2"></div>
              <p className="mt-4 text-[11px] font-bold text-blue-600 uppercase tracking-widest bg-white relative z-10 px-2">AI Router</p>
            </div>

            <div className="space-y-4 text-right">
              <p className="text-xs font-bold text-slate-400 uppercase mb-4">Department Assignment</p>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                <p className="font-bold text-red-700">EMERGENCY / CARDIOLOGY</p>
                <p className="text-[10px] text-red-500">Routing to Dr. Sharma (Triage Level 1)</p>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm">
                <p className="font-bold text-emerald-700">PEDIATRICS</p>
                <p className="text-[10px] text-emerald-500">Suggesting 2:30 PM Slot today</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm opacity-60">
                <p className="font-bold text-slate-700">DERMATOLOGY</p>
                <p className="text-[10px] text-slate-500">Finding Next Available Slot</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500">
          <strong>Note:</strong> Routing is for department guidance only and does not constitute medical diagnosis.
        </div>
      </div>

      {/* Right Column */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col min-h-[300px]">
          <div className="p-4 border-b border-slate-100">
             <h3 className="font-bold text-slate-800">WhatsApp Flow Live</h3>
          </div>
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0"></div>
              <div className="bg-slate-50 p-2 rounded-lg rounded-tl-none">
                <p className="text-[11px] text-slate-400 mb-1">Amit R. (98200XXXXX)</p>
                <p className="text-xs">"I need to book a dentist for Saturday morning."</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className="bg-blue-600 text-white p-2 rounded-lg rounded-tr-none max-w-[80%]">
                <p className="text-xs">Sure Amit. Dr. Mehra is available at 10:30 AM or 11:15 AM. Which works for you?</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-[10px]">AI</div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0"></div>
              <div className="bg-slate-50 p-2 rounded-lg rounded-tl-none">
                <p className="text-xs uppercase font-bold text-emerald-600 text-[9px] mb-0.5">Confirmed</p>
                <p className="text-xs">"10:30 works. Confirming now."</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5 text-white">
          <p className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-widest">Queue Intelligence</p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium">Cardiology</span>
                <span className="text-xs font-mono text-emerald-400">12 min wait</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full"><div className="w-[40%] bg-emerald-400 h-1.5 rounded-full"></div></div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium">Pediatrics</span>
                <span className="text-xs font-mono text-amber-400">45 min wait</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full"><div className="w-[85%] bg-amber-400 h-1.5 rounded-full"></div></div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium">Diagnostic-A</span>
                <span className="text-xs font-mono text-emerald-400">5 min wait</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full"><div className="w-[15%] bg-emerald-400 h-1.5 rounded-full"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
