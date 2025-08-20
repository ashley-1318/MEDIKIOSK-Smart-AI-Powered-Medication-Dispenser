# MEDIKIOSK ML API

Start server:

```powershell
python -m uvicorn src.server:app --reload --port 8000
```

Extract:

```bash
curl -F "file=@/path/to/image.jpg" http://localhost:8000/extract
```

Notes:

- OCR backends: tesseract by default; swap via `src/ocr/backends.py`.
- Layout detector stub at `src/ocr/layout.py`.
- Outputs FHIR-like JSON defined in `src/schema.py`.
