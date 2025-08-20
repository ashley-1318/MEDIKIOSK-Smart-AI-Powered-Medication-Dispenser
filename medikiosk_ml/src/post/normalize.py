from __future__ import annotations
from typing import Dict
import re

BRAND_TO_GENERIC = {
    "CROCIN": ("Paracetamol", "500 mg"),
}
ALIASES = {
    "PCM": "Paracetamol",
}


def normalize_item(item: Dict) -> Dict:
    brand = item.get("drug_brand") or item.get("drug_generic")
    if brand:
        key = brand.upper()
        if key in BRAND_TO_GENERIC:
            g, default_strength = BRAND_TO_GENERIC[key]
            item["drug_generic"] = g
            if not item.get("strength"):
                item["strength"] = default_strength
    # Alias expansion
    gen = item.get("drug_generic", "")
    if gen.upper() in ALIASES:
        item["drug_generic"] = ALIASES[gen.upper()]
    # Dose normalization
    dose = item.get("dose", "")
    dose = dose.lower().replace("tablets", "tab").replace("tablet", "tab")
    dose = dose.replace("capsules", "cap").replace("capsule", "cap")
    dose = re.sub(r"(\d+)\s*(mg|ml)", r"\1 \2", dose)
    item["dose"] = dose
    return item
