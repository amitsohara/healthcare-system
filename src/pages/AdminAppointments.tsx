import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

export function AdminAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/appointments')
      .then(res => res.json())
      .then(data => setAppointments(data));
  }, []);

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-6">
      <div className="pt-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Appointments Registry</h2>
        <p className="text-slate-500 mt-1 text-sm">Manage scheduled OPD visits and track no-shows.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Patient Name</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Doctor</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Department</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                   No appointments found. Use the Patient Portal or AI Assistant to book one.
                </td>
              </tr>
            ) : appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 text-sm">{apt.patient?.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{apt.patient?.phone}</div>
                </td>
                <td className="px-6 py-4 font-bold text-slate-700 text-sm">{apt.doctor?.name}</td>
                <td className="px-6 py-4">
                  <span className="text-[11px] text-blue-600 font-bold uppercase tracking-widest">{apt.doctor?.department}</span>
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm font-medium">
                  {apt.dateTime ? format(new Date(apt.dateTime), "PPp") : "N/A"}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-200">
                    {apt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
