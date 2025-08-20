#!/usr/bin/env python3
"""
Simple OCR script to extract text from image 96.jpg
"""
import sys
from pathlib import Path

# Add src to path
sys.path.append(str(Path(__file__).parent / "src"))

from src.ocr.backends import select_backend, TesseractBackend, PaddleOCRBackend
from src.ocr.ocr_engine import run_ocr

def test_ocr_backends(image_path: str):
    """Test different OCR backends on the image."""
    print(f"🔍 Extracting text from: {image_path}")
    print("=" * 60)
    
    # Test Tesseract
    print("\n📄 Tesseract OCR:")
    print("-" * 30)
    try:
        tesseract_backend = TesseractBackend()
        lines, conf = tesseract_backend(image_path)
        print(f"Confidence: {conf}")
        print("Extracted text:")
        if lines:
            for i, line in enumerate(lines, 1):
                print(f"  {i}: {line}")
        else:
            print("  No text extracted")
    except Exception as e:
        print(f"  Error: {e}")
    
    # Test PaddleOCR
    print("\n🚀 PaddleOCR:")
    print("-" * 30)
    try:
        paddle_backend = PaddleOCRBackend()
        lines, conf = paddle_backend(image_path)
        print(f"Confidence: {conf}")
        print("Extracted text:")
        if lines:
            for i, line in enumerate(lines, 1):
                print(f"  {i}: {line}")
        else:
            print("  No text extracted")
    except Exception as e:
        print(f"  Error: {e}")
    
    # Raw tesseract function
    print("\n🔧 Raw Tesseract:")
    print("-" * 30)
    try:
        lines, conf = run_ocr(image_path)
        print(f"Confidence: {conf}")
        print("Extracted text:")
        if lines:
            for i, line in enumerate(lines, 1):
                print(f"  {i}: {line}")
        else:
            print("  No text extracted")
    except Exception as e:
        print(f"  Error: {e}")

def test_with_cv2_direct(image_path: str):
    """Test OCR with direct CV2 and Tesseract calls."""
    print("\n🖼️  Direct CV2 + Tesseract:")
    print("-" * 30)
    
    try:
        import cv2
        import pytesseract
        
        # Load image
        img = cv2.imread(image_path)
        if img is None:
            print("  Error: Could not load image")
            return
        
        print(f"  Image loaded: {img.shape}")
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Apply threshold
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
        
        # OCR with different configs
        configs = [
            "--oem 3 --psm 6",  # Default
            "--oem 3 --psm 3",  # Fully automatic page segmentation
            "--oem 3 --psm 4",  # Assume a single column of text
            "--oem 3 --psm 8",  # Treat as single word
            "--oem 3 --psm 13", # Raw line. Treat as single text line
        ]
        
        for i, config in enumerate(configs):
            print(f"\n  Config {i+1}: {config}")
            try:
                text = pytesseract.image_to_string(thresh, config=config)
                lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
                if lines:
                    for j, line in enumerate(lines, 1):
                        print(f"    {j}: {line}")
                else:
                    print("    No text found")
            except Exception as e:
                print(f"    Error: {e}")
                
    except ImportError as e:
        print(f"  Missing dependency: {e}")
    except Exception as e:
        print(f"  Error: {e}")

def main():
    """Main function to test OCR on image 96.jpg"""
    image_path = "data/samples/96.jpg"
    
    if not Path(image_path).exists():
        print(f"❌ Image not found: {image_path}")
        return
    
    print(f"🏥 Medical Prescription OCR Analysis")
    print(f"📁 Image: {image_path}")
    
    # Test all OCR methods
    test_ocr_backends(image_path)
    test_with_cv2_direct(image_path)
    
    print("\n" + "=" * 60)
    print("✅ OCR analysis completed!")

if __name__ == "__main__":
    main()
