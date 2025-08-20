from __future__ import annotations
from typing import List, Tuple, Optional

import warnings
from . import ocr_engine

OcrResult = Tuple[List[str], float]


class TesseractBackend:
    name = "tesseract"

    def __call__(self, image_path: str) -> OcrResult:
        return ocr_engine.run_ocr(image_path)


class PaddleOCRBackend:
    name = "paddleocr"

    def __init__(self):
        try:
            from paddleocr import PaddleOCR  # type: ignore
        except Exception:  # pragma: no cover
            self.impl = None
        else:
            # Lightweight English model
            self.impl = PaddleOCR(lang="en")

    def __call__(self, image_path: str) -> OcrResult:
        if not self.impl:
            warnings.warn("PaddleOCR not installed; falling back to empty OCR result.")
            return [], 0.0
        result = self.impl.ocr(image_path)
        lines = []
        for page in result:
            for box, (text, conf) in page:
                lines.append(text)
        conf = 0.7 if lines else 0.0
        return lines, conf


class DocTRBackend:
    name = "doctr"

    def __init__(self):
        try:
            from doctr.models import ocr_predictor  # type: ignore
        except Exception:  # pragma: no cover
            self.impl = None
        else:
            self.impl = ocr_predictor(pretrained=True)

    def __call__(self, image_path: str) -> OcrResult:
        if not self.impl:
            warnings.warn("DocTR not installed; falling back to empty OCR result.")
            return [], 0.0
        doc = self.impl([image_path])
        lines = []
        for page in doc.pages:
            for block in page.blocks:
                for line in block.lines:
                    lines.append("".join([w.value for w in line.words]))
        conf = 0.7 if lines else 0.0
        return lines, conf


def select_backend(name: str):
    name = (name or "").lower()
    if name == "paddleocr":
        b = PaddleOCRBackend()
        if getattr(b, "impl", None) is None:
            warnings.warn("Selected paddleocr but it isn't available; using tesseract instead.")
            return TesseractBackend()
        return b
    if name == "doctr":
        b = DocTRBackend()
        if getattr(b, "impl", None) is None:
            warnings.warn("Selected doctr but it isn't available; using tesseract instead.")
            return TesseractBackend()
        return b
    return TesseractBackend()  # default
