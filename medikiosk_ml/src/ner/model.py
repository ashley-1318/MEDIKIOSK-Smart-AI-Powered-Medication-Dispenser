from __future__ import annotations
from typing import Dict, List, Tuple
import re


Entity = Tuple[str, int, int, str]  # (text, start, end, label)


class RuleNer:
    """Very small rule-based baseline to enable e2e flow.
    Replace with HF model by implementing `HfNerModel` with same interface.
    """

    def __init__(self, drug_catalog: List[str] | None = None):
        self.drug_catalog = set((drug_catalog or ["Paracetamol", "Amoxicillin", "Crocin"]))
        self.freq = re.compile(r"\b(od|bd|tid|tds|hs|sos|q\d+h)\b", re.I)
        self.dose = re.compile(r"\b(\d+\s?(tab|cap|ml|mg))\b", re.I)
        self.strength = re.compile(r"\b(\d+\s?mg)\b", re.I)
        self.duration = re.compile(r"\b(\d+\s?(day|days|wk|week|weeks))\b", re.I)

    def __call__(self, text: str) -> List[Entity]:
        ents: List[Entity] = []
        # DRUG/BRAND simple match
        for drug in self.drug_catalog:
            for m in re.finditer(re.escape(drug), text, flags=re.I):
                ents.append((m.group(), m.start(), m.end(), "DRUG"))
        # Strength/Dose/Freq/Duration
        for m in self.strength.finditer(text):
            ents.append((m.group(), m.start(), m.end(), "STRENGTH"))
        for m in self.dose.finditer(text):
            ents.append((m.group(), m.start(), m.end(), "DOSE"))
        for m in self.freq.finditer(text):
            ents.append((m.group(), m.start(), m.end(), "FREQ"))
        for m in self.duration.finditer(text):
            ents.append((m.group(), m.start(), m.end(), "DURATION"))
        return ents


def spans_to_item(lines: List[str], ents: List[Entity]) -> Dict:
    text = " \n".join(lines)
    def pick(label: str) -> str:
        for t, s, e, l in ents:
            if l == label:
                return t
        return ""

    return {
        "drug_generic": pick("DRUG"),
        "drug_brand": "",
        "strength": pick("STRENGTH"),
        "dose": pick("DOSE"),
        "frequency": pick("FREQ").upper(),
        "duration": pick("DURATION"),
        "route": "",
        "instructions": "",
        "otc_or_rx": "Rx",
        "confidence": 0.6 if ents else 0.0,
        "conf": {"drug_generic": 0.6 if pick("DRUG") else 0.0}
    }
