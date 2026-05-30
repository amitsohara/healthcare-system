import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from './components/Layout';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminAppointments } from './pages/AdminAppointments';
import { PatientPortal } from './pages/PatientPortal';
import { ChatbotView } from './pages/ChatbotView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="admin/appointments" element={<AdminAppointments />} />
          <Route path="patient" element={<PatientPortal />} />
          <Route path="bot" element={<ChatbotView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
