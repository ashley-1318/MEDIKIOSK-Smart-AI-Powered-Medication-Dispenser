from __future__ import annotations
from pydantic import BaseModel
import os


class Settings(BaseModel):
    ocr_backend: str = os.getenv("OCR_BACKEND", "tesseract")


settings = Settings()
