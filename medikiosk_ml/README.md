# MEDIKIOSK ML v2.0 (Starter)

Minimal, runnable scaffold for an OCR→NER→Post→Verify pipeline with a FHIR-like JSON output.

## Features

- Simple OCR wrapper (Tesseract by default) with hook points for PaddleOCR/DocTR/TrOCR/Donut.
- Lightweight NER mock (rule + patterns) with clear interfaces to swap in DeBERTa.
- Post-processing: brand→generic mapping, unit normalization, confidence gating.
- Verification: inventory + policy checks (mock), safety gates.
- CLI: run on images folder and emit JSON.
- Tests: smoke test for end-to-end output contract.

## Quickstart

1. Create a venv and install deps:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Run the pipeline on sample data (place images in `data/samples`):

```powershell
python -m src.cli run --input data/samples --output artifacts/out.jsonl
```

Optional: select OCR backend

```powershell
python -m src.cli run --input data/samples --ocr-backend paddleocr
# or via env var (PowerShell)
$env:OCR_BACKEND = "doctr"; python -m src.cli run --input data/samples
```

Install PaddleOCR (optional, Windows):

```powershell
pip install -r requirements-ocr-extras.txt
```

If installation fails (likely on Python 3.13), create a Python 3.11 venv just for OCR:

```powershell
py -3.11 -m venv .venv311
. .\.venv311\Scripts\Activate.ps1
python -m pip install -U pip
pip install -r requirements.txt
pip install -r requirements-ocr-extras.txt
```

Then run CLI with PaddleOCR in that venv.

3. Run tests:

```powershell
pytest -q
```

## Swap-in better models

- OCR: install PaddleOCR/DocTR and implement `src/ocr/backends.py` adapters.
- NER: fine-tune DeBERTa and implement `HfNerModel` in `src/ner/model.py`.
- Layout: plug a YOLOv8n-doc model into `src/ocr/layout.py` for region guidance.
- Quantization/ONNX: export NER to ONNX and enable INT8 in `src/deploy/onnx_infer.py`.

## Output Contract (FHIR-friendly)

See `src/schema.py` — matches the structure described in the plan.

## Run the API server

```powershell
python -m uvicorn src.server:app --reload --port 8000
```

Docker:

```powershell
docker build -t medikiosk-ml:latest .
docker run -p 8000:8000 medikiosk-ml:latest
```
