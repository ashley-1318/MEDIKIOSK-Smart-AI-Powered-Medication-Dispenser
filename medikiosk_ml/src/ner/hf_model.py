from __future__ import annotations
from typing import List, Dict

try:
    from transformers import AutoTokenizer, AutoModelForTokenClassification  # type: ignore
    import torch  # type: ignore
except Exception:  # pragma: no cover
    AutoTokenizer = None  # type: ignore
    AutoModelForTokenClassification = None  # type: ignore
    torch = None  # type: ignore


class HfNerModel:
    def __init__(self, model_name: str, id2label: Dict[int, str]):
        self.id2label = id2label
        self.tok = None
        self.model = None
        if AutoTokenizer is not None and AutoModelForTokenClassification is not None:
            self.tok = AutoTokenizer.from_pretrained(model_name)
            self.model = AutoModelForTokenClassification.from_pretrained(
                model_name, num_labels=len(id2label)
            )
            try:
                self.model.eval()
            except Exception:
                pass

    def __call__(self, text: str):
        if self.tok is None or self.model is None or torch is None:
            return []
        inputs = self.tok(text, return_tensors="pt")
        with torch.inference_mode():
            out = self.model(**inputs).logits.argmax(-1)[0].tolist()
        # Placeholder: return empty until mapped with offsets
        return []
