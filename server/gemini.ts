import { GoogleGenAI, Type } from "@google/genai";
import { db } from "./db.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function processChat(message: string, patientPhone: string) {
  // If the user hasn't set an API key, we handle gracefully
  if (!process.env.GEMINI_API_KEY) {
      return {
          reply: "I am unable to process your request because the AI is not configured. Please add GEMINI_API_KEY to your environment variables.",
          actionDetails: null
      };
  }

  // Find or create patient
  let patient = db.patients.find(p => p.phone === patientPhone);
  if (!patient) {
      patient = { id: `pat-${Date.now()}`, name: "Unknown", phone: patientPhone };
      db.patients.push(patient);
  }

  const systemInstruction = `You are a helpful AI Hospital Receptionist for a hospital in India.
Your job is to understand the patient's symptoms or request, map them to the correct hospital department, and help them book an appointment.
You can understand English, Hindi, and Marathi. Please reply in the same language the user uses.

If you understand their intent, extract the relevant structured information using the tools.
Do not provide medical advice. If they mention symptoms, reply with:
"Based on your symptoms, I recommend seeing a specialist from the [Department]. However, please note this is only department guidance and not medical advice."

Available Departments: Cardiology, Neurology, Dermatology, Pediatrics, General Physician, Orthopedics.

If they want to book an appointment, ask for a preferred date and time if it's missing, otherwise use the structured tool.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction,
        tools: [{
          functionDeclarations: [
            {
              name: "book_appointment",
              description: "Book an appointment for a patient. Call this only when you know the requested department, date, and time.",
              parameters: {
                type: Type.OBJECT,
                properties: {
                  department: { type: Type.STRING, description: "The hospital department (e.g. Cardiology, Dermatology)" },
                  datetime: { type: Type.STRING, description: "ISO string of the requested appointment date and time" }
                },
                required: ["department", "datetime"]
              }
            },
            {
              name: "get_department_recommendation",
              description: "Get the recommended department based on symptoms",
              parameters: {
                type: Type.OBJECT,
                properties: {
                  symptoms: { type: Type.STRING, description: "The symptoms described by the patient" },
                  recommended_department: { type: Type.STRING, description: "The mapped hospital department" }
                },
                required: ["symptoms", "recommended_department"]
              }
            }
          ]
        }],
        temperature: 0.2
      }
    });

    const funcCall = response.functionCalls?.[0];
    
    if (funcCall && funcCall.name === "book_appointment") {
        const { department, datetime } = funcCall.args as any;
        const doctor = db.doctors.find(d => d.department.toLowerCase() === department.toLowerCase());
        
        if (!doctor) {
            return {
                reply: `Sorry, we currently don't have a doctor available for ${department}.`,
                actionDetails: null
            };
        }

        const appointment = {
            id: `apt-${Date.now()}`,
            patientId: patient.id,
            doctorId: doctor.id,
            dateTime: datetime,
            status: 'scheduled' as const
        };
        db.appointments.push(appointment);

        return {
            reply: `Your appointment is booked with ${doctor.name} (${doctor.department}) on ${new Date(datetime).toLocaleString()}.`,
            actionDetails: { type: 'booking', appointment }
        };
    } else if (funcCall && funcCall.name === "get_department_recommendation") {
        const { recommended_department } = funcCall.args as any;
        return {
            reply: `Based on your symptoms, I recommend seeing a specialist in the ${recommended_department} department. This is only department guidance and not medical advice. Would you like to book an appointment?`,
            actionDetails: { type: 'recommendation', recommended_department }
        };
    }

    return {
        reply: response.text || "I'm sorry, I didn't quite understand. Could you please rephrase?",
        actionDetails: null
    };

  } catch (error) {
    console.error("Gemini AI Error:", error);
    return {
        reply: "I am currently experiencing technical difficulties. Please call the reception.",
        actionDetails: null
    };
  }
}
