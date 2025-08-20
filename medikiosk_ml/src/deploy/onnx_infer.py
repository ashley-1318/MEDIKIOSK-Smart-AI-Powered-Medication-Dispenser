# Placeholder for ONNX runtime inference; implement when exporting NER/OCR models.
from __future__ import annotations
from typing import Any


def infer_onnx(model_path: str, inputs: Any) -> Any:
    raise NotImplementedError("Add onnxruntime.InferenceSession when ready.")
