#!/usr/bin/env python3
"""
Image analysis script for 96.jpg using available tools
"""
import sys
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter
import numpy as np

def analyze_image(image_path: str):
    """Analyze the image and provide information about its content."""
    print(f"🖼️  Image Analysis: {image_path}")
    print("=" * 60)
    
    try:
        # Load the image
        with Image.open(image_path) as img:
            print(f"📏 Image dimensions: {img.size} (W x H)")
            print(f"🎨 Image mode: {img.mode}")
            print(f"📊 Image format: {img.format}")
            
            # Convert to RGB if necessary
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Get basic statistics
            img_array = np.array(img)
            print(f"\n📈 Color Statistics:")
            print(f"   - Mean brightness: {img_array.mean():.2f}")
            print(f"   - Min value: {img_array.min()}")
            print(f"   - Max value: {img_array.max()}")
            
            # Analyze if it's likely a document/prescription
            gray = img.convert('L')
            gray_array = np.array(gray)
            
            # Check for text-like patterns (high contrast areas)
            edges = np.std(gray_array)
            print(f"   - Edge variance: {edges:.2f}")
            
            if edges > 50:
                print("✅ High contrast detected - likely contains text")
            else:
                print("⚠️  Low contrast - text may be difficult to extract")
            
            # Check brightness levels
            mean_brightness = gray_array.mean()
            if mean_brightness > 200:
                print("✅ Good brightness for OCR")
            elif mean_brightness > 100:
                print("⚠️  Moderate brightness - may need enhancement")
            else:
                print("❌ Low brightness - likely poor OCR results")
                
            # Try to enhance the image for better visibility
            print(f"\n🔧 Image Enhancement Attempts:")
            
            # Enhance contrast
            enhancer = ImageEnhance.Contrast(img)
            enhanced = enhancer.enhance(1.5)
            print("   - Enhanced contrast")
            
            # Enhance sharpness
            enhancer = ImageEnhance.Sharpness(enhanced)
            enhanced = enhancer.enhance(1.2)
            print("   - Enhanced sharpness")
            
            # Convert to grayscale and apply threshold simulation
            gray_enhanced = enhanced.convert('L')
            gray_array = np.array(gray_enhanced)
            
            # Simple threshold to simulate OCR preprocessing
            threshold = 128
            binary = gray_array > threshold
            text_pixels = np.sum(~binary)  # Dark pixels (likely text)
            total_pixels = binary.size
            text_ratio = text_pixels / total_pixels
            
            print(f"   - Estimated text coverage: {text_ratio*100:.1f}%")
            
            if text_ratio > 0.1:
                print("✅ Significant text content detected")
            else:
                print("⚠️  Low text content detected")
                
            # Save enhanced version for manual inspection
            enhanced_path = "enhanced_96.jpg"
            enhanced.save(enhanced_path)
            print(f"💾 Enhanced image saved as: {enhanced_path}")
            
    except Exception as e:
        print(f"❌ Error analyzing image: {e}")

def provide_manual_analysis():
    """Provide manual analysis suggestions."""
    print(f"\n📋 Manual Analysis Suggestions:")
    print("=" * 40)
    print("Since OCR dependencies are not fully installed, here are alternative approaches:")
    print("\n1. 🔧 Install Tesseract OCR manually:")
    print("   - Download from: https://github.com/UB-Mannheim/tesseract/wiki")
    print("   - Install and add to system PATH")
    print("   - Common install path: C:\\Program Files\\Tesseract-OCR\\tesseract.exe")
    
    print("\n2. 🌐 Use online OCR services:")
    print("   - Google Cloud Vision API")
    print("   - Azure Computer Vision")
    print("   - AWS Textract")
    
    print("\n3. 📱 Use mobile apps:")
    print("   - Google Lens")
    print("   - Microsoft Office Lens")
    print("   - Adobe Scan")
    
    print("\n4. 🤖 Try alternative Python OCR:")
    print("   - EasyOCR (pip install easyocr)")
    print("   - TrOCR from Hugging Face")
    print("   - PaddleOCR (if compatible with Python 3.13)")

def simple_text_detection():
    """Attempt simple text detection without OCR."""
    print(f"\n🔍 Simple Text Pattern Detection:")
    print("=" * 40)
    
    image_path = "data/samples/96.jpg"
    
    try:
        with Image.open(image_path) as img:
            # Convert to grayscale
            gray = img.convert('L')
            gray_array = np.array(gray)
            
            # Find potential text regions using basic image processing
            # Look for horizontal line patterns (common in prescriptions)
            rows = gray_array.mean(axis=1)
            row_variance = np.var(rows)
            
            print(f"📊 Row variance: {row_variance:.2f}")
            
            # Find rows with significant variance (likely text)
            threshold = rows.mean() - rows.std()
            text_rows = np.where(rows < threshold)[0]
            
            if len(text_rows) > 0:
                print(f"📍 Potential text regions found at rows: {text_rows[:10]}...")
                print(f"🔢 Total text-like rows: {len(text_rows)}")
                
                # Estimate line spacing
                if len(text_rows) > 1:
                    line_spacing = np.median(np.diff(text_rows))
                    print(f"📏 Estimated line spacing: {line_spacing:.1f} pixels")
            else:
                print("❌ No clear text patterns detected")
                
    except Exception as e:
        print(f"❌ Error in text detection: {e}")

def main():
    """Main analysis function."""
    image_path = "data/samples/96.jpg"
    
    if not Path(image_path).exists():
        print(f"❌ Image not found: {image_path}")
        return
    
    print("🏥 Medical Prescription Image Analysis")
    print(f"📁 Target: {image_path}\n")
    
    # Analyze the image
    analyze_image(image_path)
    
    # Simple text detection
    simple_text_detection()
    
    # Provide manual suggestions
    provide_manual_analysis()
    
    print(f"\n" + "=" * 60)
    print("✅ Analysis completed!")
    print("\n💡 Recommendation:")
    print("   Install Tesseract OCR for full text extraction capability")
    print("   or use the enhanced image for manual review.")

if __name__ == "__main__":
    main()
