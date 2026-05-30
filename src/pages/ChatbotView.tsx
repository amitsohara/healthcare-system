import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Stethoscope } from 'lucide-react';

interface Msg {
   role: 'user' | 'assistant';
   text: string;
   actionDetails?: any;
}

export function ChatbotView() {
  const [messages, setMessages] = useState<Msg[]>([
     { role: 'assistant', text: 'Namaste! I am the AuraHealthcare Assistant. How can I help you today? You can describe your symptoms or ask to book an appointment.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Hardcoded phone for demo purposes
  const DEMO_PHONE = '9876543210';

  useEffect(() => {
     if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
     }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Msg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
       const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input, phone: DEMO_PHONE })
       });
       
       const data = await res.json();
       setMessages(prev => [...prev, { role: 'assistant', text: data.reply, actionDetails: data.actionDetails }]);
    } catch (e) {
       console.error(e);
       setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I am having trouble connecting to the server right now." }]);
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
       <div className="w-full max-w-4xl bg-white shadow-sm border border-slate-200 flex flex-col h-[85vh] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 px-5 py-4 flex items-center justify-between text-white">
             <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded flex items-center justify-center">
                   <Bot className="text-white h-5 w-5" />
                </div>
                <div>
                   <h2 className="font-bold text-sm tracking-wide">AI Triage & Booking Engine</h2>
                   <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-widest">Natural Language UI</p>
                </div>
             </div>
             <div className="flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400">ONLINE</span>
             </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50" ref={scrollRef}>
             {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`flex max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 ${m.role === 'user' ? 'bg-slate-200 ml-3' : 'bg-blue-600 mr-3'}`}>
                         {m.role === 'user' ? <User size={14} className="text-slate-600" /> : <span className="text-white text-xs font-bold">AI</span>}
                      </div>
                      <div className={`p-4 text-sm leading-relaxed ${
                         m.role === 'user' 
                            ? 'bg-slate-900 text-white rounded-lg rounded-tr-none' 
                            : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-lg rounded-tl-none'
                      }`}>
                         {m.text}
                         {m.actionDetails && m.actionDetails.type === 'booking' && (
                            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-sm">
                               <div className="font-bold text-emerald-700 mb-1">APPOINTMENT CONFIRMED</div>
                               <div className="text-emerald-600 text-xs">ID: {m.actionDetails.appointment.id}</div>
                            </div>
                         )}
                         {m.actionDetails && m.actionDetails.type === 'recommendation' && (
                            <div className="mt-4 flex items-center p-3 bg-amber-50 rounded border border-amber-200 text-sm font-medium text-amber-800">
                               <Stethoscope className="mr-2 h-4 w-4" />
                               Routed to {m.actionDetails.recommended_department}
                            </div>
                         )}
                      </div>
                   </div>
                </div>
             ))}
             {loading && (
                <div className="flex justify-start">
                   <div className="bg-white border border-slate-200 p-3 shadow-sm rounded-lg rounded-tl-none flex space-x-2 items-center ml-11">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse"></div>
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                   </div>
                </div>
             )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200">
             <div className="relative flex items-center">
                <input 
                   type="text" 
                   value={input}
                   onChange={e => setInput(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleSend()}
                   placeholder="E.g. I have a severe headache since morning..."
                   className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
                />
                <button 
                   onClick={handleSend}
                   disabled={loading || !input.trim()}
                   className="absolute right-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm"
                >
                   <Send size={16} />
                </button>
             </div>
             <div className="text-center mt-3 text-[10px] text-slate-400 uppercase tracking-widest font-bold flex justify-center items-center space-x-4">
                 <span>Powered by Gemini</span>
                 <span>•</span>
                 <span>Multi-language Base</span>
             </div>
          </div>
       </div>
    </div>
  );
}
