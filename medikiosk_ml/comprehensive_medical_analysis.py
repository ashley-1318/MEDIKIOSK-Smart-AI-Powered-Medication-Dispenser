#!/usr/bin/env python3
"""
Comprehensive Medical Analysis for All Sample Images
Generates detailed medical content analysis for each sample image like the 96.jpg example.
"""
import easyocr
import json
import re
from pathlib import Path
from typing import Dict, List, Tuple
import time

class ComprehensiveMedicalAnalyzer:
    def __init__(self):
        """Initialize the comprehensive medical analyzer."""
        self.reader = None
        
    def initialize_ocr(self):
        """Initialize EasyOCR reader."""
        print("🔧 Initializing EasyOCR reader...")
        self.reader = easyocr.Reader(['en'], gpu=False)
        print("✅ EasyOCR reader initialized")
    
    def extract_structured_info(self, text: str) -> Dict:
        """Extract structured medical information from text."""
        # Dosage extraction
        dosage_pattern = r'(\d+\.?\d*)\s*(mg|ml|gm|mcg|iu|g|l)\b'
        dosages = re.findall(dosage_pattern, text, re.IGNORECASE)
        
        # Frequency extraction
        freq_patterns = [
            r'\b(once|twice|thrice)\s+(daily|a day)\b',
            r'\b(bid|tid|qid|od|bd|tds|qds)\b',
            r'\b(\d+)\s+times?\s+(daily|a day|per day)\b'
        ]
        
        frequencies = []
        for pattern in freq_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    frequencies.append(' '.join(match))
                else:
                    frequencies.append(match)
        
        # Duration extraction
        duration_pattern = r'(\d+)\s+(days?|weeks?|months?|years?)\b'
        durations = re.findall(duration_pattern, text, re.IGNORECASE)
        
        return {
            'dosages': dosages,
            'frequencies': frequencies,
            'durations': durations
        }
    
    def analyze_medical_content(self, text: str) -> Dict:
        """Analyze text for medical content like the 96.jpg example."""
        text_lower = text.lower()
        
        # Medical keywords
        drug_keywords = [
            'tablet', 'capsule', 'mg', 'ml', 'gm', 'mcg', 'iu', 'g', 'l',
            'daily', 'twice', 'thrice', 'bid', 'tid', 'qid', 'od', 'bd',
            'morning', 'evening', 'night', 'before', 'after', 'meals',
            'days', 'weeks', 'months', 'sos', 'prn', 'stat', 'po', 'oral',
            'topical', 'injection', 'drops', 'syrup', 'cream', 'ointment'
        ]
        
        prescription_indicators = [
            'prescription', 'rx', 'dr.', 'doctor', 'physician', 'md',
            'patient', 'name', 'age', 'address', 'date', 'dob',
            'signature', 'refill', 'pharmacy', 'clinic', 'hospital', 'allergies'
        ]
        
        # Count occurrences
        found_drug_keywords = [term for term in drug_keywords if term in text_lower]
        found_prescription_indicators = [term for term in prescription_indicators if term in text_lower]
        
        # Calculate confidence
        total_medical_terms = len(found_drug_keywords) + len(found_prescription_indicators)
        
        if total_medical_terms >= 5:
            confidence = "High"
        elif total_medical_terms >= 2:
            confidence = "Moderate"
        else:
            confidence = "Low"
        
        return {
            'drug_keywords': found_drug_keywords,
            'prescription_indicators': found_prescription_indicators,
            'total_medical_terms': total_medical_terms,
            'confidence': confidence,
            'is_medical': confidence in ["High", "Moderate"]
        }
    
    def process_single_image(self, image_path: str) -> Dict:
        """Process a single image and return comprehensive analysis."""
        try:
            # Ensure OCR reader is initialized
            if self.reader is None:
                self.initialize_ocr()
            if self.reader is None:
                raise RuntimeError("EasyOCR reader failed to initialize.")
            # Extract text using OCR
            results = self.reader.readtext(image_path)
            
            # Convert results to serializable format
            extracted_data = []
            for bbox, text, confidence in results:
                bbox_converted = [[int(point[0]), int(point[1])] for point in bbox]
                extracted_data.append({
                    "text": text,
                    "confidence": float(confidence),
                    "bbox": bbox_converted
                })
            
            # Combine all text
            combined_text = " ".join([item["text"] for item in extracted_data])
            
            # Analyze medical content
            medical_analysis = self.analyze_medical_content(combined_text)
            
            # Extract structured information
            structured_info = self.extract_structured_info(combined_text)
            
            return {
                "image_path": image_path,
                "success": True,
                "combined_text": combined_text,
                "detailed_results": extracted_data,
                "total_regions": len(results),
                "avg_confidence": sum(item["confidence"] for item in extracted_data) / len(extracted_data) if extracted_data else 0.0,
                "medical_analysis": medical_analysis,
                "structured_info": structured_info
            }
            
        except Exception as e:
            return {
                "image_path": image_path,
                "success": False,
                "error": str(e),
                "combined_text": "",
                "detailed_results": [],
                "total_regions": 0,
                "avg_confidence": 0.0,
                "medical_analysis": {},
                "structured_info": {}
            }
    
    def generate_detailed_report(self, result: Dict, image_name: str) -> str:
        """Generate detailed report for a single image like the 96.jpg example."""
        report = []
        
        report.append(f"🏥 MEDICAL ANALYSIS FOR {image_name.upper()}")
        report.append("=" * 60)
        
        if result["success"]:
            report.append(f"✅ OCR Status: SUCCESS")
            report.append(f"📊 Text Regions Found: {result['total_regions']}")
            report.append(f"🎯 Average Confidence: {result['avg_confidence']:.1f}%")
            report.append("")
            
            report.append("📋 Combined Text:")
            report.append("-" * 40)
            report.append(result["combined_text"])
            report.append("")
            
            # Medical content analysis
            medical = result["medical_analysis"]
            report.append("🏥 Medical Content Analysis:")
            report.append("-" * 40)
            report.append(f"💊 Drug-related terms found: {len(medical.get('drug_keywords', []))}")
            if medical.get('drug_keywords'):
                report.append(f"   - {', '.join(medical['drug_keywords'][:10])}")
            
            report.append(f"📋 Prescription indicators: {len(medical.get('prescription_indicators', []))}")
            if medical.get('prescription_indicators'):
                report.append(f"   - {', '.join(medical['prescription_indicators'][:10])}")
            
            confidence = medical.get('confidence', 'Unknown')
            if medical.get('is_medical', False):
                report.append(f"✅ {confidence} confidence: This appears to be a medical prescription")
            else:
                report.append(f"⚠️ {confidence} confidence: This may not be a medical prescription")
            
            report.append("")
            
            # Structured information
            structured = result["structured_info"]
            report.append("📊 Structured Information Extraction:")
            report.append("-" * 40)
            
            if structured.get('dosages'):
                report.append(f"💊 Dosages found: {structured['dosages']}")
            else:
                report.append("💊 Dosages found: None")
            
            if structured.get('frequencies'):
                report.append(f"⏰ Frequencies found: {structured['frequencies']}")
            else:
                report.append("⏰ Frequencies found: None")
            
            if structured.get('durations'):
                report.append(f"📅 Durations found: {structured['durations']}")
            else:
                report.append("📅 Durations found: None")
            
            if any([structured.get('dosages'), structured.get('frequencies'), structured.get('durations')]):
                report.append("")
                report.append("✅ Structured medical information successfully extracted!")
            else:
                report.append("")
                report.append("⚠️ Limited structured medical information found")
            
        else:
            report.append(f"❌ OCR Status: FAILED")
            report.append(f"🚫 Error: {result.get('error', 'Unknown error')}")
        
        report.append("")
        report.append("💾 Results saved to: ocr_results_{}.json".format(image_name.replace('.jpg', '')))
        report.append("")
        
        return "\n".join(report)
    
    def process_all_samples(self):
        """Process all sample images and generate comprehensive reports."""
        print("🏥 COMPREHENSIVE MEDICAL ANALYSIS - ALL SAMPLES")
        print("=" * 60)
        
        # Initialize OCR
        self.initialize_ocr()
        
        # Get all image files
        samples_dir = Path("data/samples")
        image_files = sorted(list(samples_dir.glob("*.jpg")))
        
        print(f"📁 Found {len(image_files)} images to process")
        print("-" * 40)
        
        all_results = []
        summary_data = []
        
        start_time = time.time()
        
        # Create output directories
        output_dir = Path("comprehensive_analysis")
        output_dir.mkdir(exist_ok=True)
        
        individual_reports_dir = output_dir / "individual_reports"
        individual_reports_dir.mkdir(exist_ok=True)
        
        json_results_dir = output_dir / "json_results"
        json_results_dir.mkdir(exist_ok=True)
        
        # Process each image
        for i, image_path in enumerate(image_files, 1):
            image_name = image_path.name
            print(f"🔍 Processing {i}/{len(image_files)}: {image_name}")
            
            # Process the image
            result = self.process_single_image(str(image_path))
            all_results.append(result)
            
            # Generate detailed report
            detailed_report = self.generate_detailed_report(result, image_name)
            
            # Save individual report
            report_filename = f"analysis_{image_name.replace('.jpg', '')}.md"
            with open(individual_reports_dir / report_filename, 'w', encoding='utf-8') as f:
                f.write(detailed_report)
            
            # Save individual JSON result
            json_filename = f"ocr_results_{image_name.replace('.jpg', '')}.json"
            with open(json_results_dir / json_filename, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
            
            # Create summary entry
            medical_analysis = result.get("medical_analysis", {})
            structured_info = result.get("structured_info", {})
            
            summary_data.append({
                'image': image_name,
                'success': result["success"],
                'text_regions': result["total_regions"],
                'avg_confidence': round(result["avg_confidence"], 1),
                'medical_confidence': medical_analysis.get('confidence', 'Unknown'),
                'is_medical': medical_analysis.get('is_medical', False),
                'drug_terms': len(medical_analysis.get('drug_keywords', [])),
                'prescription_terms': len(medical_analysis.get('prescription_indicators', [])),
                'dosages_found': len(structured_info.get('dosages', [])),
                'frequencies_found': len(structured_info.get('frequencies', [])),
                'durations_found': len(structured_info.get('durations', [])),
                'text_preview': result["combined_text"][:150] + "..." if len(result["combined_text"]) > 150 else result["combined_text"]
            })
            
            # Show status
            if result["success"]:
                medical_status = medical_analysis.get('confidence', 'Unknown')
                print(f"   ✅ OCR Success - Medical: {medical_status}")
            else:
                print(f"   ❌ OCR Failed: {result.get('error', 'Unknown')}")
            
            # Progress update every 25 images
            if i % 25 == 0:
                elapsed = time.time() - start_time
                avg_time = elapsed / i
                remaining = (len(image_files) - i) * avg_time
                print(f"   📊 Progress: {i}/{len(image_files)} ({i/len(image_files)*100:.1f}%) - ETA: {remaining/60:.1f} min")
        
        # Save comprehensive results
        self.save_comprehensive_results(all_results, summary_data, output_dir)
        
        # Generate master summary
        self.generate_master_summary(summary_data, output_dir)
        
        end_time = time.time()
        total_time = end_time - start_time
        
        print(f"\n🎉 COMPREHENSIVE ANALYSIS COMPLETE!")
        print(f"⏱️  Total processing time: {total_time/60:.1f} minutes")
        print(f"📁 Results saved in: comprehensive_analysis/")
        print(f"   📑 Individual reports: individual_reports/")
        print(f"   📊 JSON results: json_results/")
        print(f"   📋 Summary files: master_summary.md, comprehensive_summary.csv")
    
    def save_comprehensive_results(self, all_results: List[Dict], summary_data: List[Dict], output_dir: Path):
        """Save comprehensive results to files."""
        # Save complete results as JSON
        with open(output_dir / "all_comprehensive_results.json", 'w', encoding='utf-8') as f:
            json.dump(all_results, f, indent=2, ensure_ascii=False)
        
        # Save summary as CSV
        import csv
        with open(output_dir / "comprehensive_summary.csv", 'w', newline='', encoding='utf-8') as f:
            if summary_data:
                writer = csv.DictWriter(f, fieldnames=summary_data[0].keys())
                writer.writeheader()
                writer.writerows(summary_data)
    
    def generate_master_summary(self, summary_data: List[Dict], output_dir: Path):
        """Generate master summary report."""
        total_images = len(summary_data)
        successful_ocr = sum(1 for item in summary_data if item['success'])
        medical_prescriptions = sum(1 for item in summary_data if item['is_medical'])
        
        summary_text = []
        summary_text.append("🏥 COMPREHENSIVE MEDICAL ANALYSIS - MASTER SUMMARY")
        summary_text.append("=" * 70)
        summary_text.append("")
        summary_text.append(f"📊 OVERVIEW")
        summary_text.append("-" * 30)
        summary_text.append(f"Total Images Processed: {total_images}")
        summary_text.append(f"Successful OCR: {successful_ocr} ({successful_ocr/total_images*100:.1f}%)")
        summary_text.append(f"Medical Prescriptions: {medical_prescriptions} ({medical_prescriptions/total_images*100:.1f}%)")
        summary_text.append("")
        
        # Medical confidence breakdown
        confidence_counts = {}
        for item in summary_data:
            conf = item['medical_confidence']
            confidence_counts[conf] = confidence_counts.get(conf, 0) + 1
        
        summary_text.append(f"📋 MEDICAL CONFIDENCE BREAKDOWN")
        summary_text.append("-" * 40)
        for confidence, count in confidence_counts.items():
            percentage = (count / total_images) * 100
            summary_text.append(f"{confidence}: {count} ({percentage:.1f}%)")
        summary_text.append("")
        
        # Top medical findings
        total_dosages = sum(item['dosages_found'] for item in summary_data)
        total_frequencies = sum(item['frequencies_found'] for item in summary_data)
        total_durations = sum(item['durations_found'] for item in summary_data)
        
        summary_text.append(f"💊 STRUCTURED MEDICAL DATA EXTRACTED")
        summary_text.append("-" * 40)
        summary_text.append(f"Total Dosages Found: {total_dosages}")
        summary_text.append(f"Total Frequencies Found: {total_frequencies}")
        summary_text.append(f"Total Durations Found: {total_durations}")
        summary_text.append("")
        
        # Sample high-quality prescriptions
        high_quality = [item for item in summary_data if item['is_medical'] and item['dosages_found'] > 0]
        high_quality.sort(key=lambda x: x['dosages_found'] + x['frequencies_found'] + x['durations_found'], reverse=True)
        
        summary_text.append(f"🌟 TOP QUALITY PRESCRIPTIONS (with structured data)")
        summary_text.append("-" * 50)
        for i, item in enumerate(high_quality[:10], 1):
            total_entities = item['dosages_found'] + item['frequencies_found'] + item['durations_found']
            summary_text.append(f"{i:2d}. {item['image']} - {total_entities} entities ({item['medical_confidence']} confidence)")
        
        summary_text.append("")
        summary_text.append("📁 DETAILED RESULTS LOCATION")
        summary_text.append("-" * 30)
        summary_text.append("individual_reports/ - Detailed analysis for each image")
        summary_text.append("json_results/ - Machine-readable JSON for each image")
        summary_text.append("comprehensive_summary.csv - Complete data table")
        summary_text.append("all_comprehensive_results.json - Complete JSON dataset")
        
        # Save master summary
        with open(output_dir / "master_summary.md", 'w', encoding='utf-8') as f:
            f.write('\n'.join(summary_text))

def main():
    """Main function to run comprehensive analysis."""
    analyzer = ComprehensiveMedicalAnalyzer()
    analyzer.process_all_samples()

if __name__ == "__main__":
    main()
