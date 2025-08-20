from __future__ import annotations
from typing import List, Tuple, Optional

try:
    import cv2  # type: ignore
except Exception:  # pragma: no cover
    cv2 = None  # type: ignore

try:
    import pytesseract  # type: ignore
except Exception:  # pragma: no cover
    pytesseract = None  # type: ignore


OcrResult = Tuple[List[str], float]


def tesseract_ocr(image_bgr) -> OcrResult:
    if cv2 is None or pytesseract is None:
        return [], 0.0
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
    cfg = "--oem 3 --psm 6"
    text = pytesseract.image_to_string(gray, config=cfg)
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    conf = 0.6 if lines else 0.0
    return lines, conf


def run_ocr(image_path: str) -> OcrResult:
    if cv2 is None:
        return [], 0.0
    img = cv2.imread(image_path)
    if img is None:
        return [], 0.0
    return tesseract_ocr(img)
