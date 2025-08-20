#!/usr/bin/env python3
"""
EasyOCR script to extract text from image 96.jpg
"""
import easyocr
from pathlib import Path
import json

def extract_text_with_easyocr(image_path: str):
    """Extract text using EasyOCR."""
    print(f"🚀 EasyOCR Text Extraction")
    print(f"📁 Image: {image_path}")
    print("=" * 60)
    
    try:
        # Initialize EasyOCR reader for English
        print("🔧 Initializing EasyOCR reader...")
        reader = easyocr.Reader(['en'], gpu=False)  # Use CPU
        
        print("📖 Processing image...")
        # Read text from image
        results = reader.readtext(image_path)
        
        print(f"\n✅ Text extraction completed!")
        print(f"📊 Found {len(results)} text regions\n")
        
        if results:
            print("📝 Extracted Text:")
            print("-" * 40)
            
            all_text = []
            for i, (bbox, text, confidence) in enumerate(results, 1):
                print(f"{i:2d}. {text}")
                print(f"    Confidence: {confidence:.3f}")
                print(f"    Position: {bbox}")
                print()
                
                # Convert numpy types to Python types for JSON serialization
                bbox_converted = [[int(point[0]), int(point[1])] for point in bbox]
                
                all_text.append({
                    "text": text,
                    "confidence": float(confidence),
                    "bbox": bbox_converted
                })
            
            # Combine all text
            combined_text = " ".join([item["text"] for item in all_text])
            print("📋 Combined Text:")
            print("-" * 40)
            print(combined_text)
            print()
            
            # Save results to JSON
            output_file = "ocr_results_96.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump({
                    "image_path": image_path,
                    "combined_text": combined_text,
                    "detailed_results": all_text,
                    "total_regions": len(results)
                }, f, indent=2, ensure_ascii=False)
            
            print(f"💾 Results saved to: {output_file}")
            
            # Analyze for medical content
            analyze_medical_content(combined_text)
            
        else:
            print("❌ No text found in the image")
            
    except Exception as e:
        print(f"❌ Error during OCR: {e}")

def analyze_medical_content(text: str):
    """Analyze extracted text for medical/prescription content."""
    print(f"\n🏥 Medical Content Analysis:")
    print("-" * 40)
    
    text_lower = text.lower()
    
    # Common medical/prescription keywords
    drug_keywords = [
        'tablet', 'capsule', 'mg', 'ml', 'gm', 'mcg', 'iu',
        'daily', 'twice', 'thrice', 'bid', 'tid', 'qid',
        'morning', 'evening', 'night', 'before', 'after', 'meals',
        'days', 'weeks', 'months', 'sos', 'prn', 'stat',
        'oral', 'topical', 'injection', 'drops', 'syrup'
    ]
    
    prescription_indicators = [
        'prescription', 'rx', 'dr.', 'doctor', 'physician',
        'patient', 'name', 'age', 'address', 'date',
        'signature', 'refill', 'pharmacy'
    ]
    
    # Check for drug-related terms
    found_drug_terms = [term for term in drug_keywords if term in text_lower]
    found_prescription_terms = [term for term in prescription_indicators if term in text_lower]
    
    print(f"💊 Drug-related terms found: {len(found_drug_terms)}")
    if found_drug_terms:
        print(f"   - {', '.join(found_drug_terms[:10])}")
    
    print(f"📋 Prescription indicators: {len(found_prescription_terms)}")
    if found_prescription_terms:
        print(f"   - {', '.join(found_prescription_terms[:10])}")
    
    # Overall assessment
    total_medical_terms = len(found_drug_terms) + len(found_prescription_terms)
    
    if total_medical_terms >= 5:
        print("✅ High confidence: This appears to be a medical prescription")
    elif total_medical_terms >= 2:
        print("⚠️  Moderate confidence: Likely medical content")
    else:
        print("❌ Low confidence: May not be a prescription")
    
    # Try to extract structured information
    extract_prescription_info(text)

def extract_prescription_info(text: str):
    """Try to extract structured prescription information."""
    print(f"\n📊 Structured Information Extraction:")
    print("-" * 40)
    
    lines = text.split('\n')
    
    potential_drugs = []
    potential_dosages = []
    potential_frequencies = []
    
    import re
    
    # Look for dosage patterns (number + unit)
    dosage_pattern = r'(\d+\.?\d*)\s*(mg|ml|gm|mcg|iu|g|l)\b'
    dosages = re.findall(dosage_pattern, text, re.IGNORECASE)
    
    # Look for frequency patterns
    freq_patterns = [
        r'\b(once|twice|thrice)\s+(daily|a day)\b',
        r'\b(bid|tid|qid|od|bd)\b',
        r'\b(\d+)\s+times?\s+(daily|a day|per day)\b'
    ]
    
    frequencies = []
    for pattern in freq_patterns:
        frequencies.extend(re.findall(pattern, text, re.IGNORECASE))
    
    # Look for duration patterns
    duration_pattern = r'(\d+)\s+(days?|weeks?|months?)\b'
    durations = re.findall(duration_pattern, text, re.IGNORECASE)
    
    print(f"💊 Dosages found: {dosages}")
    print(f"⏰ Frequencies found: {frequencies}")
    print(f"📅 Durations found: {durations}")
    
    if dosages or frequencies or durations:
        print("\n✅ Structured medical information successfully extracted!")
    else:
        print("\n⚠️  No clear structured information found")

def main():
    """Main function to run EasyOCR on image 96.jpg"""
    image_path = "data/samples/96.jpg"
    
    if not Path(image_path).exists():
        print(f"❌ Image not found: {image_path}")
        return
    
    extract_text_with_easyocr(image_path)
    
    print(f"\n" + "=" * 60)
    print("🎉 OCR Analysis Complete!")

if __name__ == "__main__":
    main()
