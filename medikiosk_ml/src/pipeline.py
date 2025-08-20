from __future__ import annotations
from typing import Dict, List
from .schema import Prescription, Item, Verification
from .config import settings
from .ocr.backends import select_backend
from .ner.model import RuleNer, spans_to_item
from .post.normalize import normalize_item
from .verify.checks import verify_item


def process_image(path: str) -> Prescription:
    ocr = select_backend(settings.ocr_backend)
    lines, ocr_conf = ocr(path)
    text = "\n".join(lines)
    ner = RuleNer()
    ents = ner(text)
    item_dict = spans_to_item(lines, ents)
    item_dict.setdefault("conf", {})
    item_dict["conf"]["ocr"] = ocr_conf
    item_dict = normalize_item(item_dict)
    ver = verify_item(item_dict)
    pres = Prescription()
    pres.items = [Item(**item_dict)] if item_dict else []
    pres.verification = Verification(**ver)
    return pres


def batch_process(paths: List[str]) -> List[Dict]:
    out: List[Dict] = []
    for p in paths:
        pres = process_image(p)
        out.append(pres.model_dump())
    return out
