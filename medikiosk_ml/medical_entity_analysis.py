#!/usr/bin/env python3
"""
Medical Entity Analysis Script
Analyzes the medical prescriptions extracted from OCR to identify and categorize medical entities.
"""
import json
import re
from collections import defaultdict, Counter
from pathlib import Path
import csv
from typing import Dict, List, Set, Tuple
import pandas as pd

class MedicalEntityAnalyzer:
    def __init__(self):
        # Enhanced medical dictionaries
        self.drug_names = {
            # Common medications
            'paracetamol', 'acetaminophen', 'aspirin', 'ibuprofen', 'diclofenac',
            'amoxicillin', 'azithromycin', 'ciprofloxacin', 'doxycycline', 'cephalexin',
            'metformin', 'insulin', 'glipizide', 'glyburide',
            'omeprazole', 'ranitidine', 'pantoprazole', 'lansoprazole',
            'amlodipine', 'atenolol', 'metoprolol', 'lisinopril', 'losartan',
            'atorvastatin', 'simvastatin', 'lovastatin',
            'ferrous', 'iron', 'calcium', 'vitamin', 'folic', 'cyanocobalamin',
            'prednisolone', 'hydrocortisone', 'dexamethasone',
            'loratadine', 'cetirizine', 'diphenhydramine',
            'salbutamol', 'montelukast', 'budesonide',
            'warfarin', 'heparin', 'clopidogrel',
            'furosemide', 'hydrochlorothiazide', 'spironolactone',
            'digoxin', 'propranolol', 'verapamil',
            'crocin', 'combiflam', 'volini', 'moov', 'betnovate'
        }
        
        self.dosage_forms = {
            'tablet', 'tablets', 'tab', 'tabs', 'capsule', 'capsules', 'cap', 'caps',
            'syrup', 'syrups', 'suspension', 'liquid', 'drops', 'drop',
            'injection', 'injections', 'inj', 'cream', 'ointment', 'gel',
            'lotion', 'spray', 'inhaler', 'powder', 'granules',
            'suppository', 'pessary', 'enema', 'patch', 'film'
        }
        
        self.dosage_units = {
            'mg', 'milligram', 'milligrams', 'gm', 'gram', 'grams', 'g',
            'mcg', 'microgram', 'micrograms', 'μg',
            'ml', 'milliliter', 'milliliters', 'l', 'liter', 'liters',
            'iu', 'units', 'unit', 'u', '%', 'percent'
        }
        
        self.frequency_terms = {
            'daily', 'once', 'twice', 'thrice', 'qd', 'bid', 'tid', 'qid',
            'od', 'bd', 'tds', 'qds', 'sos', 'prn', 'stat', 'ac', 'pc',
            'morning', 'afternoon', 'evening', 'night', 'bedtime',
            'hourly', 'hours', 'times', 'per day', 'weekly', 'monthly'
        }
        
        self.duration_terms = {
            'days', 'day', 'weeks', 'week', 'months', 'month', 'years', 'year'
        }
        
        self.route_terms = {
            'oral', 'po', 'topical', 'iv', 'im', 'sc', 'sublingual', 'rectal',
            'vaginal', 'nasal', 'ocular', 'otic', 'dermal', 'inhalation'
        }
        
        self.medical_specialties = {
            'cardiology', 'neurology', 'pediatrics', 'gynecology', 'orthopedics',
            'dermatology', 'psychiatry', 'endocrinology', 'gastroenterology',
            'pulmonology', 'nephrology', 'oncology', 'ophthalmology', 'ent',
            'general', 'internal', 'surgery', 'anesthesia'
        }
        
        self.doctor_titles = {
            'dr', 'doctor', 'prof', 'professor', 'md', 'mbbs', 'ms', 'phd',
            'consultant', 'specialist', 'surgeon', 'physician'
        }
        
        self.hospital_indicators = {
            'hospital', 'clinic', 'medical', 'center', 'healthcare', 'nursing',
            'dispensary', 'pharmacy', 'polyclinic', 'institute', 'foundation'
        }

    def load_prescription_data(self, file_path: str) -> List[Dict]:
        """Load medical prescriptions from JSON file."""
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def extract_entities_from_text(self, text: str) -> Dict[str, List[str]]:
        """Extract medical entities from prescription text."""
        text_lower = text.lower()
        entities = {
            'drugs': [],
            'dosages': [],
            'frequencies': [],
            'durations': [],
            'routes': [],
            'doctors': [],
            'hospitals': [],
            'specialties': []
        }
        
        # Extract drug names
        for drug in self.drug_names:
            if drug in text_lower:
                entities['drugs'].append(drug)
        
        # Extract dosages with units
        dosage_pattern = r'(\d+\.?\d*)\s*(mg|ml|gm|mcg|iu|g|l|%|units?)\b'
        dosages = re.findall(dosage_pattern, text, re.IGNORECASE)
        entities['dosages'] = [f"{dose} {unit}" for dose, unit in dosages]
        
        # Extract frequencies
        freq_patterns = [
            r'\b(once|twice|thrice)\s+(daily|a day)\b',
            r'\b(bid|tid|qid|od|bd|tds|qds)\b',
            r'\b(\d+)\s+times?\s+(daily|a day|per day)\b',
            r'\b(morning|afternoon|evening|night)\b'
        ]
        
        for pattern in freq_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    entities['frequencies'].append(' '.join(match))
                else:
                    entities['frequencies'].append(match)
        
        # Extract durations
        duration_pattern = r'(\d+)\s+(days?|weeks?|months?)\b'
        durations = re.findall(duration_pattern, text, re.IGNORECASE)
        entities['durations'] = [f"{num} {period}" for num, period in durations]
        
        # Extract routes
        for route in self.route_terms:
            if route in text_lower:
                entities['routes'].append(route)
        
        # Extract doctor names (simplified pattern)
        doctor_pattern = r'\b(dr\.?|doctor)\s+([a-z]+(?:\s+[a-z]+)*)\b'
        doctors = re.findall(doctor_pattern, text, re.IGNORECASE)
        entities['doctors'] = [f"{title} {name}" for title, name in doctors]
        
        # Extract hospital/clinic names
        hospital_pattern = r'\b([a-z]+(?:\s+[a-z]+)*)\s+(hospital|clinic|medical center)\b'
        hospitals = re.findall(hospital_pattern, text, re.IGNORECASE)
        entities['hospitals'] = [f"{name} {type_}" for name, type_ in hospitals]
        
        # Extract specialties
        for specialty in self.medical_specialties:
            if specialty in text_lower:
                entities['specialties'].append(specialty)
        
        return entities

    def analyze_all_prescriptions(self, prescriptions: List[Dict]) -> Dict:
        """Analyze all prescriptions and aggregate entity statistics."""
        all_entities = {
            'drugs': Counter(),
            'dosages': Counter(),
            'frequencies': Counter(),
            'durations': Counter(),
            'routes': Counter(),
            'doctors': Counter(),
            'hospitals': Counter(),
            'specialties': Counter()
        }
        
        prescription_analyses = []
        
        for prescription in prescriptions:
            text = prescription.get('combined_text', '')
            image_path = prescription.get('image_path', '')
            
            entities = self.extract_entities_from_text(text)
            
            # Count entities
            for entity_type, entity_list in entities.items():
                for entity in entity_list:
                    all_entities[entity_type][entity.lower()] += 1
            
            # Store individual prescription analysis
            prescription_analyses.append({
                'image': Path(image_path).name,
                'entities_found': sum(len(entity_list) for entity_list in entities.values()),
                'entities': entities,
                'text_preview': text[:200] + "..." if len(text) > 200 else text
            })
        
        return {
            'aggregated_entities': all_entities,
            'prescription_analyses': prescription_analyses,
            'total_prescriptions': len(prescriptions)
        }

    def generate_entity_report(self, analysis_results: Dict) -> str:
        """Generate a comprehensive entity analysis report."""
        report = []
        report.append("🏥 MEDICAL ENTITY ANALYSIS REPORT")
        report.append("=" * 60)
        
        aggregated = analysis_results['aggregated_entities']
        total_prescriptions = analysis_results['total_prescriptions']
        
        report.append(f"\n📊 OVERVIEW")
        report.append("-" * 30)
        report.append(f"Total Prescriptions Analyzed: {total_prescriptions}")
        
        # Top entities by category
        for entity_type, counter in aggregated.items():
            if counter:
                report.append(f"\n🔸 TOP {entity_type.upper()} ({len(counter)} unique)")
                report.append("-" * 40)
                for entity, count in counter.most_common(10):
                    percentage = (count / total_prescriptions) * 100
                    report.append(f"  {entity:<20} | {count:>3} | {percentage:>5.1f}%")
        
        # Prescription complexity analysis
        report.append(f"\n📋 PRESCRIPTION COMPLEXITY ANALYSIS")
        report.append("-" * 40)
        
        entity_counts = [analysis['entities_found'] for analysis in analysis_results['prescription_analyses']]
        if entity_counts:
            avg_entities = sum(entity_counts) / len(entity_counts)
            max_entities = max(entity_counts)
            min_entities = min(entity_counts)
            
            report.append(f"Average entities per prescription: {avg_entities:.1f}")
            report.append(f"Maximum entities in single prescription: {max_entities}")
            report.append(f"Minimum entities in single prescription: {min_entities}")
        
        # Most complex prescriptions
        complex_prescriptions = sorted(
            analysis_results['prescription_analyses'],
            key=lambda x: x['entities_found'],
            reverse=True
        )[:5]
        
        report.append(f"\n📑 MOST COMPLEX PRESCRIPTIONS")
        report.append("-" * 40)
        for i, prescription in enumerate(complex_prescriptions, 1):
            report.append(f"{i}. {prescription['image']} ({prescription['entities_found']} entities)")
            report.append(f"   Preview: {prescription['text_preview']}")
            report.append("")
        
        return "\n".join(report)

    def save_detailed_analysis(self, analysis_results: Dict, output_dir: str = "."):
        """Save detailed analysis to multiple files."""
        output_path = Path(output_dir)
        
        # Save entity statistics as CSV
        entity_stats = []
        for entity_type, counter in analysis_results['aggregated_entities'].items():
            for entity, count in counter.items():
                entity_stats.append({
                    'entity_type': entity_type,
                    'entity': entity,
                    'count': count,
                    'percentage': (count / analysis_results['total_prescriptions']) * 100
                })
        
        df_stats = pd.DataFrame(entity_stats)
        df_stats.to_csv(output_path / 'medical_entity_statistics.csv', index=False)
        
        # Save prescription-level analysis
        prescription_data = []
        for analysis in analysis_results['prescription_analyses']:
            prescription_data.append({
                'image': analysis['image'],
                'total_entities': analysis['entities_found'],
                'drugs_count': len(analysis['entities']['drugs']),
                'dosages_count': len(analysis['entities']['dosages']),
                'frequencies_count': len(analysis['entities']['frequencies']),
                'durations_count': len(analysis['entities']['durations']),
                'text_preview': analysis['text_preview']
            })
        
        df_prescriptions = pd.DataFrame(prescription_data)
        df_prescriptions.to_csv(output_path / 'prescription_entity_analysis.csv', index=False)
        
        # Save detailed entities as JSON
        with open(output_path / 'detailed_medical_entities.json', 'w', encoding='utf-8') as f:
            # Convert Counter objects to regular dicts for JSON serialization
            serializable_data = {
                'aggregated_entities': {k: dict(v) for k, v in analysis_results['aggregated_entities'].items()},
                'prescription_analyses': analysis_results['prescription_analyses'],
                'total_prescriptions': analysis_results['total_prescriptions']
            }
            json.dump(serializable_data, f, indent=2, ensure_ascii=False)

def main():
    """Main function to run medical entity analysis."""
    print("🏥 Starting Medical Entity Analysis...")
    
    # Initialize analyzer
    analyzer = MedicalEntityAnalyzer()
    
    # Load prescription data
    prescription_file = "medical_prescriptions.json"
    if not Path(prescription_file).exists():
        print(f"❌ Error: {prescription_file} not found!")
        return
    
    print(f"📄 Loading prescriptions from {prescription_file}...")
    prescriptions = analyzer.load_prescription_data(prescription_file)
    print(f"✅ Loaded {len(prescriptions)} prescriptions")
    
    # Analyze entities
    print("🔍 Analyzing medical entities...")
    analysis_results = analyzer.analyze_all_prescriptions(prescriptions)
    
    # Generate report
    print("📊 Generating analysis report...")
    report = analyzer.generate_entity_report(analysis_results)
    
    # Save report
    with open("MEDICAL_ENTITY_ANALYSIS_REPORT.md", 'w', encoding='utf-8') as f:
        f.write(report)
    
    # Save detailed analysis files
    print("💾 Saving detailed analysis files...")
    analyzer.save_detailed_analysis(analysis_results)
    
    # Display report
    print("\n" + report)
    
    print("\n✅ Analysis complete! Files generated:")
    print("   - MEDICAL_ENTITY_ANALYSIS_REPORT.md")
    print("   - medical_entity_statistics.csv")
    print("   - prescription_entity_analysis.csv")
    print("   - detailed_medical_entities.json")

if __name__ == "__main__":
    main()
