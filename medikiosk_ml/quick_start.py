#!/usr/bin/env python3
"""
Quick Start Menu for Medical Kiosk ML System
Interactive menu to run different components of the system.
"""
import subprocess
import sys
from pathlib import Path

class MedicalKioskRunner:
    def __init__(self):
        self.python_exe = "D:/ml model for medisiok/.venv/Scripts/python.exe"
        self.base_dir = Path("D:/ml model for medisiok/medikiosk_ml")
    
    def run_command(self, command, description):
        """Run a command and handle errors."""
        print(f"\n🚀 {description}")
        print("=" * 50)
        try:
            result = subprocess.run(command, shell=True, check=True, capture_output=False)
            print(f"✅ {description} completed successfully!")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Error running {description}: {e}")
            return False
    
    def show_menu(self):
        """Display the main menu."""
        print("\n🏥 MEDICAL KIOSK ML - QUICK START MENU")
        print("=" * 60)
        print("1. 📸 Process Single Image (96.jpg example)")
        print("2. 📁 Process All Sample Images (Batch OCR)")
        print("3. 🔍 Comprehensive Medical Analysis (All 129 images)")
        print("4. 🧠 Train NER Model")
        print("5. 📊 Analyze Medical Entities")
        print("6. 🎯 Run Model Demo/Prediction")
        print("7. 🧪 Test Focal Loss Function")
        print("8. 🚀 Run Complete Pipeline (OCR + Analysis + Training)")
        print("9. 📋 View Results Summary")
        print("0. ❌ Exit")
        print("=" * 60)
    
    def process_single_image(self):
        """Process single image with detailed analysis."""
        command = f'cd "{self.base_dir}" && "{self.python_exe}" easyocr_96.py'
        return self.run_command(command, "Processing single image (96.jpg)")
    
    def batch_ocr(self):
        """Run batch OCR on all sample images."""
        command = f'cd "{self.base_dir}" && "{self.python_exe}" batch_ocr_all_samples.py'
        return self.run_command(command, "Batch OCR processing all samples")
    
    def comprehensive_analysis(self):
        """Run comprehensive medical analysis."""
        command = f'cd "{self.base_dir}" && "{self.python_exe}" comprehensive_medical_analysis.py'
        return self.run_command(command, "Comprehensive medical analysis")
    
    def train_ner_model(self):
        """Train the NER model."""
        command = f'cd "{self.base_dir}" && "{self.python_exe}" -m src.ner.training.train --data-path data/ner/annotations.jsonl --output-dir artifacts/ner_model'
        return self.run_command(command, "Training NER model")
    
    def analyze_entities(self):
        """Analyze medical entities."""
        command = f'cd "{self.base_dir}" && "{self.python_exe}" medical_entity_analysis.py'
        return self.run_command(command, "Analyzing medical entities")
    
    def run_demo(self):
        """Run model demo."""
        command = f'cd "{self.base_dir}" && "{self.python_exe}" predict_demo.py'
        return self.run_command(command, "Running model demo")
    
    def test_focal_loss(self):
        """Test focal loss function."""
        command = f'cd "{self.base_dir}" && "{self.python_exe}" test_focal_loss.py'
        return self.run_command(command, "Testing focal loss function")
    
    def run_complete_pipeline(self):
        """Run the complete pipeline."""
        print("\n🚀 Running Complete Medical Kiosk Pipeline")
        print("=" * 50)
        
        steps = [
            (self.comprehensive_analysis, "1/4: Comprehensive OCR Analysis"),
            (self.analyze_entities, "2/4: Medical Entity Analysis"),
            (self.train_ner_model, "3/4: NER Model Training"),
            (self.run_demo, "4/4: Model Demo")
        ]
        
        for i, (func, desc) in enumerate(steps):
            print(f"\n📊 Step {desc}")
            if not func():
                print(f"❌ Pipeline stopped at step {i+1}")
                return False
        
        print("\n🎉 Complete pipeline executed successfully!")
        return True
    
    def view_results(self):
        """Show results summary."""
        print("\n📊 RESULTS SUMMARY")
        print("=" * 50)
        
        # Check for key result files
        result_files = [
            ("comprehensive_analysis/master_summary.md", "📋 Master Summary"),
            ("comprehensive_analysis/comprehensive_summary.csv", "📈 Complete Data"),
            ("MEDICAL_ENTITY_ANALYSIS_REPORT.md", "🔬 Entity Analysis"),
            ("artifacts/ner_model/config.json", "🧠 Trained Model"),
            ("batch_ocr_results.json", "📁 Batch OCR Results"),
        ]
        
        for file_path, description in result_files:
            full_path = self.base_dir / file_path
            if full_path.exists():
                print(f"✅ {description}: {file_path}")
            else:
                print(f"❌ {description}: Not found")
        
        print(f"\n📁 All results are in: {self.base_dir}")
        
        # Show quick stats if comprehensive analysis exists
        summary_file = self.base_dir / "comprehensive_analysis" / "master_summary.md"
        if summary_file.exists():
            print("\n📊 Quick Stats:")
            try:
                with open(summary_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    lines = content.split('\n')
                    for line in lines[5:10]:  # Show overview lines
                        if line.strip():
                            print(f"   {line}")
            except Exception as e:
                print(f"   Could not read summary: {e}")
    
    def run(self):
        """Main runner loop."""
        while True:
            self.show_menu()
            try:
                choice = input("\n🎯 Enter your choice (0-9): ").strip()
                
                if choice == '0':
                    print("\n👋 Goodbye! Thanks for using Medical Kiosk ML!")
                    break
                elif choice == '1':
                    self.process_single_image()
                elif choice == '2':
                    self.batch_ocr()
                elif choice == '3':
                    self.comprehensive_analysis()
                elif choice == '4':
                    self.train_ner_model()
                elif choice == '5':
                    self.analyze_entities()
                elif choice == '6':
                    self.run_demo()
                elif choice == '7':
                    self.test_focal_loss()
                elif choice == '8':
                    self.run_complete_pipeline()
                elif choice == '9':
                    self.view_results()
                else:
                    print("❌ Invalid choice! Please enter a number between 0-9.")
                
                if choice != '0':
                    input("\n⏸️  Press Enter to continue...")
                    
            except KeyboardInterrupt:
                print("\n\n👋 Interrupted by user. Goodbye!")
                break
            except Exception as e:
                print(f"\n❌ Unexpected error: {e}")
                input("\n⏸️  Press Enter to continue...")

def main():
    """Main function."""
    print("🏥 Medical Kiosk ML - Quick Start")
    print("🔧 Initializing system...")
    
    runner = MedicalKioskRunner()
    runner.run()

if __name__ == "__main__":
    main()
