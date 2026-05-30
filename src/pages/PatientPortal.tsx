import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Clock } from 'lucide-react';

export function PatientPortal() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => setDoctors(data));
  }, []);

  const filteredDoctors = doctors.filter(d => 
    d.department.toLowerCase().includes(search.toLowerCase()) || 
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
       <div className="mb-8 pt-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Find a Specialist</h2>
          <p className="text-slate-500 mt-1 text-sm">Book an appointment with our world-class healthcare professionals.</p>
          
          <div className="mt-6 relative max-w-md">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
             </div>
             <input 
                type="text" 
                placeholder="Search by specialty or doctor name..." 
                className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm leading-5 bg-white shadow-sm placeholder-slate-400 focus:outline-none flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
             />
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
          {filteredDoctors.map(doctor => (
             <div key={doctor.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">{doctor.name}</h3>
                      <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mt-1">{doctor.department}</p>
                   </div>
                </div>

                <div className="mt-4 space-y-2 flex-1">
                   <div className="flex items-center text-slate-600 text-xs font-medium">
                      <Clock className="w-4 h-4 mr-2" strokeWidth={2} />
                      {doctor.experience} Experience
                   </div>
                   <div className="flex items-center text-slate-600 text-xs font-medium">
                      <MapPin className="w-4 h-4 mr-2" strokeWidth={2} />
                      Speaks {doctor.languages.join(', ')}
                   </div>
                </div>
                
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                   <div className="text-slate-900 font-bold">
                      ₹{doctor.fees}
                   </div>
                   <button className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 text-xs rounded-lg transition-colors flex items-center">
                      <Calendar className="w-3 h-3 mr-1.5" />
                      Book
                   </button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
}
