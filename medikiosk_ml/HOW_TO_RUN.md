# 🏥 Medical Kiosk ML - Complete Running Guide

## 📋 Quick Start Guide

### 🔧 Prerequisites

```bash
# Ensure you're in the project directory
cd "D:\ml model for medisiok\medikiosk_ml"

# Activate the virtual environment
& "D:/ml model for medisiok/.venv/Scripts/Activate.ps1"
```

---

## 🚀 Available Commands & Scripts

### 1. 🏥 **OCR Processing**

#### **Single Image OCR (96.jpg example)**

```bash
& "D:/ml model for medisiok/.venv/Scripts/python.exe" easyocr_96.py
```

- Processes single image with detailed medical analysis
- Generates: `ocr_results_96.json`, analysis reports

#### **Batch OCR - All Sample Images**

```bash
& "D:/ml model for medisiok/.venv/Scripts/python.exe" batch_ocr_all_samples.py
```

- Processes all 129 sample images
- Generates: `batch_ocr_results.json`, `medical_prescriptions.json`, `ocr_summary.csv`

#### **Comprehensive Medical Analysis**

```bash
& "D:/ml model for medisiok/.venv/Scripts/python.exe" comprehensive_medical_analysis.py
```

- Complete analysis with detailed reports for each image
- Generates: `comprehensive_analysis/` folder with individual reports

---

### 2. 🧠 **NER Model Training**

#### **Train the Medical NER Model**

```bash
& "D:/ml model for medisiok/.venv/Scripts/python.exe" -m src.ner.training.train --data-path data/ner/annotations.jsonl --output-dir artifacts/ner_model
```

- Trains DistilBERT model for medical entity recognition
- Uses focal loss for class imbalance handling
- Saves model to: `artifacts/ner_model/`

#### **Test Focal Loss Implementation**

```bash
& "D:/ml model for medisiok/.venv/Scripts/python.exe" test_focal_loss.py
```

- Validates focal loss function
- Tests tensor operations and gradient flow

---

### 3. 📊 **Medical Entity Analysis**

#### **Extract Medical Entities from OCR Results**

```bash
& "D:/ml model for medisiok/.venv/Scripts/python.exe" medical_entity_analysis.py
```

- Analyzes extracted text for medical entities
- Generates: `MEDICAL_ENTITY_ANALYSIS_REPORT.md`, CSV files

---

### 4. 🎯 **Model Inference & Demo**

#### **Run Model Predictions**

```bash
& "D:/ml model for medisiok/.venv/Scripts/python.exe" predict_demo.py
```

- Loads trained model and runs predictions
- Tests model on sample medical text

#### **Demo Output Generation**

```bash
& "D:/ml model for medisiok/.venv/Scripts/python.exe" demo_output.py
```

- Demonstrates complete pipeline
- OCR → NER → Entity extraction

---

## 📁 Output Files & Locations

### **OCR Results**

```
📊 Single Image:
- ocr_results_96.json
- OCR_OUTPUT_SUMMARY_96.md

📊 Batch Processing:
- batch_ocr_results.json (complete results)
- medical_prescriptions.json (medical only)
- ocr_summary.csv (summary table)

📊 Comprehensive Analysis:
comprehensive_analysis/
├── individual_reports/
│   ├── analysis_1.md
│   ├── analysis_96.md
│   └── ... (129 files)
├── json_results/
│   ├── ocr_results_1.json
│   └── ... (129 files)
├── master_summary.md
└── comprehensive_summary.csv
```

### **Model Training**

```
📊 Model Artifacts:
artifacts/ner_model/
├── config.json
├── pytorch_model.bin
├── tokenizer.json
└── training_args.bin

📊 Training Output:
- Training logs and metrics
- Model evaluation results
```

### **Entity Analysis**

```
📊 Medical Entity Reports:
- MEDICAL_ENTITY_ANALYSIS_REPORT.md
- medical_entity_statistics.csv
- prescription_entity_analysis.csv
- detailed_medical_entities.json
```

---

## 🎯 Common Use Cases

### **Case 1: Process New Medical Images**

```bash
# 1. Add images to data/samples/
# 2. Run comprehensive analysis
& "D:/ml model for medisiok/.venv/Scripts/python.exe" comprehensive_medical_analysis.py

# 3. Extract medical entities
& "D:/ml model for medisiok/.venv/Scripts/python.exe" medical_entity_analysis.py
```

### **Case 2: Train/Retrain NER Model**

```bash
# 1. Ensure training data is in data/ner/annotations.jsonl
# 2. Train the model
& "D:/ml model for medisiok/.venv/Scripts/python.exe" -m src.ner.training.train --data-path data/ner/annotations.jsonl --output-dir artifacts/ner_model

# 3. Test the trained model
& "D:/ml model for medisiok/.venv/Scripts/python.exe" predict_demo.py
```

### **Case 3: Complete Pipeline Run**

```bash
# 1. OCR Processing
& "D:/ml model for medisiok/.venv/Scripts/python.exe" comprehensive_medical_analysis.py

# 2. Entity Analysis
& "D:/ml model for medisiok/.venv/Scripts/python.exe" medical_entity_analysis.py

# 3. Model Training
& "D:/ml model for medisiok/.venv/Scripts/python.exe" -m src.ner.training.train --data-path data/ner/annotations.jsonl --output-dir artifacts/ner_model

# 4. Demo/Testing
& "D:/ml model for medisiok/.venv/Scripts/python.exe" demo_output.py
```

---

## 🔧 Configuration & Customization

### **OCR Settings**

- Edit `comprehensive_medical_analysis.py` to modify:
  - Medical keyword dictionaries
  - Confidence thresholds
  - Output formats

### **NER Training Parameters**

- Edit `src/ner/training/train.py` to modify:
  - Learning rate
  - Batch size
  - Number of epochs
  - Model architecture

### **Focal Loss Parameters**

- Edit `src/ner/focal_loss.py` to adjust:
  - Gamma value (focus parameter)
  - Alpha values (class weights)
  - Ignore index handling

---

## 📊 Monitoring & Logs

### **Check Training Progress**

```bash
# Monitor training logs
Get-Content artifacts/ner_model/training_logs.txt -Wait

# Check model performance
& "D:/ml model for medisiok/.venv/Scripts/python.exe" -c "
import json
with open('artifacts/ner_model/trainer_state.json') as f:
    state = json.load(f)
    print(f'Best metric: {state.get(\"best_metric\", \"N/A\")}')
"
```

### **OCR Processing Status**

- Individual reports show processing status
- CSV files contain success/failure statistics
- JSON files include error details

---

## 🚨 Troubleshooting

### **Common Issues**

#### **Memory Errors (Large Images)**

```bash
# Some large images may fail with memory errors
# Check comprehensive_summary.csv for failed images
# Consider image compression or splitting
```

#### **Model Training Issues**

```bash
# If training fails, check:
# 1. Data format in annotations.jsonl
# 2. GPU/CPU availability
# 3. Memory constraints
```

#### **OCR Accuracy Issues**

```bash
# For poor OCR results:
# 1. Check image quality
# 2. Adjust EasyOCR confidence thresholds
# 3. Consider preprocessing images
```

---

## ⚡ Performance Tips

### **Faster Processing**

- Use GPU for model training: Install CUDA-compatible PyTorch
- Batch process images in smaller groups
- Use multiprocessing for parallel OCR

### **Better Accuracy**

- Preprocess images (contrast, noise reduction)
- Use higher resolution images
- Validate and clean training data

---

## 📞 Quick Reference Commands

```bash
# Environment Setup
& "D:/ml model for medisiok/.venv/Scripts/Activate.ps1"
cd "D:\ml model for medisiok\medikiosk_ml"

# Complete Pipeline
& "D:/ml model for medisiok/.venv/Scripts/python.exe" comprehensive_medical_analysis.py
& "D:/ml model for medisiok/.venv/Scripts/python.exe" medical_entity_analysis.py
& "D:/ml model for medisiok/.venv/Scripts/python.exe" -m src.ner.training.train --data-path data/ner/annotations.jsonl --output-dir artifacts/ner_model

# Quick OCR Test
& "D:/ml model for medisiok/.venv/Scripts/python.exe" easyocr_96.py

# Model Demo
& "D:/ml model for medisiok/.venv/Scripts/python.exe" predict_demo.py
```

---

🎉 **Your Medical Kiosk ML System is Ready to Run!**

Choose the appropriate command based on what you want to accomplish. All scripts are designed to work independently or as part of the complete pipeline.
