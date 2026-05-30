export interface Doctor {
  id: string;
  name: string;
  department: string;
  qualification: string;
  experience: string;
  languages: string[];
  fees: number;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  dateTime: string;
  status: 'scheduled' | 'cancelled' | 'completed';
}

export const db = {
  doctors: [
    {
      id: "doc-1",
      name: "Dr. Sharma",
      department: "Cardiology",
      qualification: "MD, DM Cardiology",
      experience: "15 years",
      languages: ["English", "Hindi"],
      fees: 1500
    },
    {
      id: "doc-2",
      name: "Dr. Patel",
      department: "Neurology",
      qualification: "MD, DM Neurology",
      experience: "10 years",
      languages: ["English", "Hindi", "Gujarati"],
      fees: 1200
    },
    {
      id: "doc-3",
      name: "Dr. Gupta",
      department: "Dermatology",
      qualification: "MD Dermatology",
      experience: "8 years",
      languages: ["English", "Hindi"],
      fees: 800
    },
    {
      id: "doc-4",
      name: "Dr. Joshi",
      department: "Pediatrics",
      qualification: "MD Pediatrics",
      experience: "12 years",
      languages: ["English", "Marathi", "Hindi"],
      fees: 1000
    },
    {
      id: "doc-5",
      name: "Dr. Verma",
      department: "General Physician",
      qualification: "MBBS, MD Medicine",
      experience: "20 years",
      languages: ["English", "Hindi"],
      fees: 600
    }
  ] as Doctor[],
  patients: [
    {
      id: "pat-1",
      name: "Amit Kumar",
      phone: "9876543210"
    }
  ] as Patient[],
  appointments: [] as Appointment[]
};
