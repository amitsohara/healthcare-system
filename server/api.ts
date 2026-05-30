import { Router } from "express";
import { db } from "./db.js";
import { processChat } from "./gemini.js";

export const apiRouter = Router();

apiRouter.get("/doctors", (req, res) => {
  res.json(db.doctors);
});

apiRouter.get("/appointments", (req, res) => {
  // Populate with doctor and patient details for the admin dashboard
  const populated = db.appointments.map(apt => ({
    ...apt,
    doctor: db.doctors.find(d => d.id === apt.doctorId),
    patient: db.patients.find(p => p.id === apt.patientId)
  }));
  res.json(populated);
});

apiRouter.post("/appointments", (req, res) => {
  const { patientName, patientPhone, doctorId, dateTime } = req.body;
  
  let patient = db.patients.find(p => p.phone === patientPhone);
  if (!patient) {
      patient = { id: `pat-${Date.now()}`, name: patientName, phone: patientPhone };
      db.patients.push(patient);
  }

  const appointment = {
      id: `apt-${Date.now()}`,
      patientId: patient.id,
      doctorId,
      dateTime,
      status: 'scheduled' as const
  };
  db.appointments.push(appointment);
  res.json(appointment);
});

apiRouter.post("/chat", async (req, res) => {
  const { message, phone } = req.body;
  if (!message || !phone) {
      res.status(400).json({ error: "Message and phone are required" });
      return;
  }
  const result = await processChat(message, phone);
  res.json(result);
});

apiRouter.get("/stats", (req, res) => {
    const scheduled = db.appointments.filter(a => a.status === 'scheduled').length;
    const completed = db.appointments.filter(a => a.status === 'completed').length;
    res.json({
        totalAppointments: db.appointments.length,
        scheduled,
        completed,
        totalDoctors: db.doctors.length,
        totalPatients: db.patients.length
    });
});
