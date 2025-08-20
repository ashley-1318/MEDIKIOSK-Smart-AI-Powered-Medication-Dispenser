from __future__ import annotations
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from tempfile import NamedTemporaryFile
from pathlib import Path

from .pipeline import process_image

app = FastAPI(title="MEDIKIOSK ML v2.0")


@app.post("/extract")
async def extract(file: UploadFile = File(...)):
    name = file.filename or "upload.img"
    suffix = Path(name).suffix or ".img"
    with NamedTemporaryFile(delete=True, suffix=suffix) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp.flush()
        pres = process_image(tmp.name)
        return JSONResponse(content=pres.model_dump())


@app.get("/health")
async def health():
    return {"status": "ok"}
