import React from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { LayoutDashboard, Users, MessageSquare, CalendarPlus, HeartPulse } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Layout() {
  const location = useLocation();

  const navItems = [
    { name: 'Command Center', path: '/', icon: LayoutDashboard },
    { name: 'Appointments', path: '/admin/appointments', icon: Users },
    { name: 'Patient Portal', path: '/patient', icon: CalendarPlus },
    { name: 'AI Assistant', path: '/bot', icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">A</div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Aura Healthcare AI</h1>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Enterprise OPD Automation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex bg-slate-100 rounded-md p-1 space-x-0.5">
            <button className="px-3 py-1 text-xs font-semibold bg-white shadow-sm rounded border-slate-200">EN</button>
            <button className="px-3 py-1 text-xs font-semibold text-slate-500">HI</button>
            <button className="px-3 py-1 text-xs font-semibold text-slate-500">MR</button>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold">Dr. Vikram Adani</p>
              <p className="text-[10px] text-blue-600 font-bold uppercase">Chief Medical Officer</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm"></div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 shrink-0">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "p-3 rounded-lg flex items-center gap-3 font-medium transition-colors",
                    isActive 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Icon size={20} className={cn(isActive ? "text-blue-700" : "text-slate-600")} strokeWidth={2} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
          
          <div className="mt-auto">
            <div className="p-4 bg-slate-900 rounded-xl text-white">
              <p className="text-xs text-slate-400 mb-1">AI AGENT STATUS</p>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-semibold">All Systems Operational</span>
              </div>
              <div className="text-[10px] space-y-2">
                <div className="flex justify-between"><span>WhatsApp Bot</span><span className="text-emerald-400">Online</span></div>
                <div className="flex justify-between"><span>Voice IVR</span><span className="text-emerald-400">Online</span></div>
                <div className="flex justify-between"><span>NLP Engine</span><span className="text-emerald-400">Online</span></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
