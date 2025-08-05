export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  available: boolean;
}

export interface ExtractedData {
  medicines: Medicine[];
  doctorName: string;
  patientName: string;
  date: string;
}

export interface ParsedMedicine {
  medicine: string;
  dosage: string | null;
  frequency: string | null;
  duration: string | null;
  status?: 'known' | 'unknown';
  availability?: string;
}