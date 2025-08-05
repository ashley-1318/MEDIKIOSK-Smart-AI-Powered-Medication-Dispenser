import { Medicine } from '../types/prescription';

export interface ExtractedData {
  medicines: Medicine[];
  doctorName: string;
  patientName: string;
  date: string;
}

// Medicine database for validation
const MEDICINE_DATABASE = [
  "aspirin", "amoxicillin", "omeprazole", "acetaminophen", "paracetamol",
  "lisinopril", "ibuprofen", "vitamin d", "metformin", "salbutamol",
  "amlodipine", "atorvastatin", "levothyroxine", "warfarin", "insulin",
  "albuterol", "hydrochlorothiazide", "losartan", "gabapentin", "tramadol"
];

// Medicine inventory simulation
const MEDICINE_INVENTORY = {
  "aspirin": "in_stock",
  "amoxicillin": "in_stock", 
  "omeprazole": "out_of_stock",
  "acetaminophen": "in_stock",
  "paracetamol": "in_stock",
  "lisinopril": "in_stock",
  "ibuprofen": "out_of_stock",
  "vitamin d": "in_stock",
  "metformin": "in_stock",
  "salbutamol": "in_stock",
  "amlodipine": "in_stock",
  "atorvastatin": "out_of_stock",
  "levothyroxine": "in_stock",
  "warfarin": "in_stock",
  "insulin": "in_stock",
  "albuterol": "in_stock",
  "hydrochlorothiazide": "in_stock",
  "losartan": "out_of_stock",
  "gabapentin": "in_stock",
  "tramadol": "in_stock"
};

interface ParsedMedicine {
  medicine: string;
  dosage: string | null;
  frequency: string | null;
  duration: string | null;
  status?: 'known' | 'unknown';
  availability?: string;
}

/**
 * Simulates OCR text extraction from prescription image
 * In production, this would use Tesseract.js or Google Cloud Vision API
 */
function simulateOCRExtraction(imageData: string): string {
  // Simulate realistic prescription text based on the image
  // In real implementation, this would process the actual image
  const prescriptionTexts = [
    `Dr. Sarah Johnson
Patient: Emily Davis
Date: ${new Date().toLocaleDateString()}

Rx:
Amoxicillin 500mg - take one tablet twice daily for 10 days
Paracetamol 500mg - every 6 hours as needed for pain
Omeprazole 20mg - once daily before breakfast
Vitamin D 1000 units - daily for 3 months`,
    
    `Dr. Michael Chen
Patient: Robert Smith  
Date: ${new Date().toLocaleDateString()}

Prescription:
Aspirin 100mg daily
Lisinopril 10mg once daily
Metformin 500mg twice daily with meals
Atorvastatin 20mg at bedtime`,

    `Dr. Lisa Williams
Patient: Maria Garcia
Date: ${new Date().toLocaleDateString()}

Rx:
Ibuprofen 400mg every 8 hours for pain
Salbutamol Inhaler 100mcg - 2 puffs every 4 hours
Gabapentin 300mg three times daily
Insulin 10 units before meals`
  ];

  // Return a random prescription for demo purposes
  return prescriptionTexts[Math.floor(Math.random() * prescriptionTexts.length)];
}

/**
 * Parses prescription text to extract medicine details
 * Based on your ML model's parse_prescription function
 */
function parsePrescription(text: string): ParsedMedicine[] {
  const parsedMedicines: ParsedMedicine[] = [];
  const lines = text.trim().split('\n');

  // Regex patterns from your ML model
  const medicinePattern = /^\s*([\w\s]+?)(?:\s+-\s+|\s+to\s+|\s+[:@]\s+|\s+|$)/;
  const dosagePattern = /(\d+\.?\d*\s*(?:mg|mcg|g|ml|units?|tabs?|caps?|loz?))/i;
  const frequencyPattern = /(?:once|twice|three times|four times|\d+\s*times?)\s*daily|every\s*\d+\s*(?:hours?|days?)|(?:q\d+h|bid|tid|qid|qod|qd|prn)/i;
  const durationPattern = /(?:for\s*\d+\s*(?:days?|weeks?|months?)|until\s*finished)/i;

  // Extract doctor and patient info
  let doctorName = '';
  let patientName = '';
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (lowerLine.includes('dr.') || lowerLine.includes('doctor')) {
      doctorName = line.replace(/dr\.\s*/i, '').trim();
    }
    if (lowerLine.includes('patient:')) {
      patientName = line.replace(/patient:\s*/i, '').trim();
    }
  }

  // Parse medicine lines
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Skip header lines
    if (lowerLine.includes('dr.') || lowerLine.includes('patient') || 
        lowerLine.includes('date') || lowerLine.includes('rx:') || 
        lowerLine.includes('prescription') || lowerLine.trim() === '') {
      continue;
    }

    const medicineMatch = medicinePattern.exec(lowerLine);
    const medicineName = medicineMatch?.[1]?.trim();

    if (medicineName && medicineName.length > 2) {
      const dosageMatch = dosagePattern.exec(lowerLine);
      const dosage = dosageMatch?.[1]?.trim() || null;

      const frequencyMatch = frequencyPattern.exec(lowerLine);
      const frequency = frequencyMatch?.[0]?.trim() || null;

      const durationMatch = durationPattern.exec(lowerLine);
      const duration = durationMatch?.[0]?.trim() || null;

      parsedMedicines.push({
        medicine: medicineName,
        dosage,
        frequency,
        duration
      });
    }
  }

  return parsedMedicines;
}

/**
 * Validates medicines against known database
 * Based on your ML model's validate_medicines function
 */
function validateMedicines(parsedMedicines: ParsedMedicine[]): ParsedMedicine[] {
  return parsedMedicines.map(med => ({
    ...med,
    status: MEDICINE_DATABASE.includes(med.medicine.toLowerCase()) ? 'known' : 'unknown'
  }));
}

/**
 * Maps medicines to inventory availability
 * Based on your ML model's map_to_inventory function
 */
function mapToInventory(validatedMedicines: ParsedMedicine[]): ParsedMedicine[] {
  return validatedMedicines.map(med => ({
    ...med,
    availability: med.status === 'known' 
      ? MEDICINE_INVENTORY[med.medicine.toLowerCase() as keyof typeof MEDICINE_INVENTORY] || 'availability_unknown'
      : 'unknown_medicine'
  }));
}

/**
 * Converts parsed data to the format expected by the UI
 */
function convertToUIFormat(mappedMedicines: ParsedMedicine[], doctorName: string, patientName: string): ExtractedData {
  const medicines: Medicine[] = mappedMedicines.map(med => ({
    name: med.medicine,
    dosage: med.dosage || 'Not specified',
    frequency: med.frequency || 'Not specified', 
    duration: med.duration || 'Not specified',
    available: med.availability === 'in_stock'
  }));

  return {
    medicines,
    doctorName: doctorName || 'Dr. Unknown',
    patientName: patientName || 'Patient Name',
    date: new Date().toLocaleDateString()
  };
}

/**
 * Main function to process prescription image end-to-end
 * Based on your ML model's process_prescription_image function
 */
export async function processPrescriptionImage(imageData: string): Promise<ExtractedData> {
  try {
    console.log('Starting prescription processing...');
    
    // Step 1: Extract text from image (simulated)
    console.log('Step 1: Extracting text...');
    const rawText = simulateOCRExtraction(imageData);
    console.log('Extracted text:', rawText.substring(0, 200) + '...');
    
    // Step 2: Parse prescription details
    console.log('Step 2: Parsing prescription...');
    const parsedDetails = parsePrescription(rawText);
    console.log('Parsed details:', parsedDetails);
    
    // Step 3: Validate against medicine database
    console.log('Step 3: Validating medicines...');
    const validatedDetails = validateMedicines(parsedDetails);
    console.log('Validated details:', validatedDetails);
    
    // Step 4: Map to available inventory
    console.log('Step 4: Mapping to inventory...');
    const mappedDetails = mapToInventory(validatedDetails);
    console.log('Mapped details:', mappedDetails);
    
    // Step 5: Check for alerts
    console.log('Step 5: Checking for alerts...');
    const alerts = [];
    for (const med of mappedDetails) {
      if (med.status === 'unknown') {
        alerts.push(`Unknown medicine: ${med.medicine}`);
      } else if (med.availability === 'out_of_stock') {
        alerts.push(`Out of stock: ${med.medicine}`);
      }
    }
    
    if (alerts.length > 0) {
      console.log('ALERTS:', alerts);
    }
    
    // Extract doctor and patient names from raw text
    const lines = rawText.split('\n');
    let doctorName = '';
    let patientName = '';
    
    for (const line of lines) {
      if (line.toLowerCase().includes('dr.')) {
        doctorName = line.replace(/dr\.\s*/i, '').trim();
      }
      if (line.toLowerCase().includes('patient:')) {
        patientName = line.replace(/patient:\s*/i, '').trim();
      }
    }
    
    console.log('Prescription processing completed successfully');
    return convertToUIFormat(mappedDetails, doctorName, patientName);
    
  } catch (error) {
    console.error('Error processing prescription:', error);
    throw new Error('Failed to process prescription image');
  }
}

export { MEDICINE_DATABASE, MEDICINE_INVENTORY };