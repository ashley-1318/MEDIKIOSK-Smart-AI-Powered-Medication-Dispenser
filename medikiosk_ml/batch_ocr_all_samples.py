#!/usr/bin/env python3
"""
Batch OCR processing script for all sample images in the medical kiosk dataset.
This will process all images and generate comprehensive output analysis.
"""
import easyocr
import json
import time
from pathlib import Path
from typing import List, Dict, Any
import re
from collections import defaultdict
import csv

def initialize_ocr():
    """Initialize EasyOCR reader."""
    print("🔧 Initializing EasyOCR reader...")
    reader = easyocr.Reader(['en'], gpu=False)
    print("✅ EasyOCR reader initialized")
    return reader

def extract_text_from_image(reader, image_path: str) -> Dict[str, Any]:
    """Extract text from a single image."""
    try:
        results = reader.readtext(image_path)
        
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
        
        return {
            "image_path": image_path,
            "success": True,
            "combined_text": combined_text,
            "detailed_results": extracted_data,
            "total_regions": len(results),
            "avg_confidence": sum(item["confidence"] for item in extracted_data) / len(extracted_data) if extracted_data else 0.0
        }
        
    except Exception as e:
        return {
            "image_path": image_path,
            "success": False,
            "error": str(e),
            "combined_text": "",
            "detailed_results": [],
            "total_regions": 0,
            "avg_confidence": 0.0
        }

def analyze_medical_content(text: str) -> Dict[str, Any]:
    """Analyze text for medical content."""
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
        'signature', 'refill', 'pharmacy', 'clinic', 'hospital'
    ]
    
    # Drug names (common ones)
    drug_names = [
        'paracetamol', 'aspirin', 'ibuprofen', 'amoxicillin', 'azithromycin',
        'metformin', 'insulin', 'omeprazole', 'amlodipine', 'atorvastatin',
        'ferrous', 'iron', 'calcium', 'vitamin', 'antibiotic', 'crocin'
    ]
    
    # Count occurrences
    found_drug_keywords = [term for term in drug_keywords if term in text_lower]
    found_prescription_indicators = [term for term in prescription_indicators if term in text_lower]
    found_drug_names = [term for term in drug_names if term in text_lower]
    
    # Extract structured information using regex
    dosage_pattern = r'(\d+\.?\d*)\s*(mg|ml|gm|mcg|iu|g|l)\b'
    dosages = re.findall(dosage_pattern, text, re.IGNORECASE)
    
    freq_patterns = [
        r'\b(once|twice|thrice)\s+(daily|a day)\b',
        r'\b(bid|tid|qid|od|bd)\b',
        r'\b(\d+)\s+times?\s+(daily|a day|per day)\b'
    ]
    
    frequencies = []
    for pattern in freq_patterns:
        frequencies.extend(re.findall(pattern, text, re.IGNORECASE))
    
    duration_pattern = r'(\d+)\s+(days?|weeks?|months?)\b'
    durations = re.findall(duration_pattern, text, re.IGNORECASE)
    
    # Calculate confidence
    total_medical_terms = len(found_drug_keywords) + len(found_prescription_indicators) + len(found_drug_names)
    
    if total_medical_terms >= 5:
        confidence = "high"
    elif total_medical_terms >= 2:
        confidence = "moderate"
    else:
        confidence = "low"
    
    return {
        "drug_keywords": found_drug_keywords,
        "prescription_indicators": found_prescription_indicators,
        "drug_names": found_drug_names,
        "dosages": dosages,
        "frequencies": frequencies,
        "durations": durations,
        "total_medical_terms": total_medical_terms,
        "confidence": confidence,
        "is_prescription": confidence in ["high", "moderate"]
    }

def process_all_images():
    """Process all sample images."""
    print("🏥 Medical Kiosk - Batch OCR Processing")
    print("=" * 60)
    
    # Initialize OCR
    reader = initialize_ocr()
    
    # Get all image files
    samples_dir = Path("data/samples")
    image_files = sorted(list(samples_dir.glob("*.jpg")))
    
    print(f"📁 Found {len(image_files)} images to process")
    print("-" * 40)
    
    all_results = []
    medical_prescriptions = []
    processing_stats = {
        "total_images": len(image_files),
        "successful_ocr": 0,
        "failed_ocr": 0,
        "medical_prescriptions": 0,
        "total_text_regions": 0,
        "processing_time": 0
    }
    
    start_time = time.time()
    
    # Process each image
    for i, image_path in enumerate(image_files, 1):
        print(f"🔍 Processing {i}/{len(image_files)}: {image_path.name}")
        
        # Extract text
        ocr_result = extract_text_from_image(reader, str(image_path))
        
        if ocr_result["success"]:
            processing_stats["successful_ocr"] += 1
            processing_stats["total_text_regions"] += ocr_result["total_regions"]
            
            # Analyze medical content
            medical_analysis = analyze_medical_content(ocr_result["combined_text"])
            ocr_result["medical_analysis"] = medical_analysis
            
            if medical_analysis["is_prescription"]:
                processing_stats["medical_prescriptions"] += 1
                medical_prescriptions.append(ocr_result)
                print(f"   ✅ Medical prescription detected (confidence: {medical_analysis['confidence']})")
            else:
                print(f"   ⚠️  Non-medical content (confidence: {medical_analysis['confidence']})")
        else:
            processing_stats["failed_ocr"] += 1
            print(f"   ❌ OCR failed: {ocr_result.get('error', 'Unknown error')}")
        
        all_results.append(ocr_result)
        
        # Progress update every 10 images
        if i % 10 == 0:
            elapsed = time.time() - start_time
            avg_time = elapsed / i
            remaining = (len(image_files) - i) * avg_time
            print(f"   📊 Progress: {i}/{len(image_files)} ({i/len(image_files)*100:.1f}%) - ETA: {remaining/60:.1f} min")
    
    end_time = time.time()
    processing_stats["processing_time"] = end_time - start_time
    
    # Save results
    save_results(all_results, medical_prescriptions, processing_stats)
    
    # Generate summary
    generate_summary(processing_stats, medical_prescriptions)

def save_results(all_results: List[Dict], medical_prescriptions: List[Dict], stats: Dict):
    """Save processing results to files."""
    print("\n💾 Saving results...")
    
    # Save complete results
    with open("batch_ocr_results.json", 'w', encoding='utf-8') as f:
        json.dump({
            "processing_stats": stats,
            "all_results": all_results
        }, f, indent=2, ensure_ascii=False)
    
    # Save medical prescriptions only
    with open("medical_prescriptions.json", 'w', encoding='utf-8') as f:
        json.dump(medical_prescriptions, f, indent=2, ensure_ascii=False)
    
    # Save CSV summary
    csv_data = []
    for result in all_results:
        csv_data.append({
            "image": Path(result["image_path"]).name,
            "success": result["success"],
            "text_regions": result["total_regions"],
            "avg_confidence": result["avg_confidence"],
            "is_medical": result.get("medical_analysis", {}).get("is_prescription", False),
            "medical_confidence": result.get("medical_analysis", {}).get("confidence", "unknown"),
            "combined_text": result["combined_text"][:100] + "..." if len(result["combined_text"]) > 100 else result["combined_text"]
        })
    
    with open("ocr_summary.csv", 'w', newline='', encoding='utf-8') as f:
        if csv_data:
            writer = csv.DictWriter(f, fieldnames=csv_data[0].keys())
            writer.writeheader()
            writer.writerows(csv_data)
    
    print("✅ Results saved to:")
    print("   - batch_ocr_results.json (complete results)")
    print("   - medical_prescriptions.json (medical content only)")
    print("   - ocr_summary.csv (summary table)")

def generate_summary(stats: Dict, medical_prescriptions: List[Dict]):
    """Generate and display processing summary."""
    print(f"\n📊 PROCESSING SUMMARY")
    print("=" * 60)
    
    print(f"📁 Total images processed: {stats['total_images']}")
    print(f"✅ Successful OCR: {stats['successful_ocr']} ({stats['successful_ocr']/stats['total_images']*100:.1f}%)")
    print(f"❌ Failed OCR: {stats['failed_ocr']} ({stats['failed_ocr']/stats['total_images']*100:.1f}%)")
    print(f"🏥 Medical prescriptions found: {stats['medical_prescriptions']} ({stats['medical_prescriptions']/stats['total_images']*100:.1f}%)")
    print(f"📝 Total text regions extracted: {stats['total_text_regions']}")
    print(f"⏱️  Total processing time: {stats['processing_time']/60:.1f} minutes")
    print(f"📈 Average time per image: {stats['processing_time']/stats['total_images']:.1f} seconds")
    
    if medical_prescriptions:
        print(f"\n🏥 MEDICAL PRESCRIPTIONS ANALYSIS")
        print("-" * 40)
        
        # Analyze medical prescriptions
        drug_names = defaultdict(int)
        dosage_units = defaultdict(int)
        frequencies = defaultdict(int)
        
        for prescription in medical_prescriptions:
            medical_data = prescription["medical_analysis"]
            
            # Count drug names
            for drug in medical_data["drug_names"]:
                drug_names[drug] += 1
            
            # Count dosage units
            for dosage, unit in medical_data["dosages"]:
                dosage_units[unit] += 1
            
            # Count frequencies
            for freq_data in medical_data["frequencies"]:
                if isinstance(freq_data, tuple) and len(freq_data) > 0:
                    frequencies[freq_data[0]] += 1
        
        print(f"📊 Most common drug names: {dict(list(drug_names.most_common(5)))}")
        print(f"📊 Most common dosage units: {dict(list(dosage_units.most_common(5)))}")
        print(f"📊 Most common frequencies: {dict(list(frequencies.most_common(5)))}")
        
        # Show sample prescriptions
        print(f"\n📋 SAMPLE PRESCRIPTIONS:")
        print("-" * 40)
        for i, prescription in enumerate(medical_prescriptions[:3], 1):
            image_name = Path(prescription["image_path"]).name
            text_preview = prescription["combined_text"][:150]
            confidence = prescription["medical_analysis"]["confidence"]
            print(f"{i}. {image_name} (confidence: {confidence})")
            print(f"   Text: {text_preview}...")
            print()
    
    print("🎉 Batch processing completed successfully!")

def main():
    """Main function."""
    try:
        process_all_images()
    except KeyboardInterrupt:
        print("\n⚠️  Processing interrupted by user")
    except Exception as e:
        print(f"\n❌ Error during processing: {e}")

if __name__ == "__main__":
    main()
