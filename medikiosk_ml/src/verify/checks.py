from __future__ import annotations
from typing import Dict, List

INVENTORY = {
    ("Paracetamol", "500 mg"): True,
}
SCHEDULE_RX = {"Paracetamol": "OTC", "Amoxicillin": "Rx"}


def check_stock(item: Dict) -> bool:
    key = (item.get("drug_generic", ""), item.get("strength", ""))
    return INVENTORY.get(key, False)


def policy_class(item: Dict) -> str:
    return SCHEDULE_RX.get(item.get("drug_generic", ""), "Rx")


def dose_sane(item: Dict) -> bool:
    # Simplified; plug real rules later
    freq = item.get("frequency", "").lower()
    if "q1h" in freq or "q0" in freq:
        return False
    return True


def needs_review(item: Dict, thr: float = 0.85) -> bool:
    conf = item.get("conf", {})
    keys = ["drug_generic", "strength", "frequency", "duration"]
    return any(conf.get(k, 0.0) < thr for k in keys)


def verify_item(item: Dict) -> Dict:
    out = {
        "in_stock": check_stock(item),
        "dose_within_guidelines": dose_sane(item),
        "policy_flags": []  # populate with strings
    }
    if policy_class(item) == "Rx" and item.get("otc_or_rx") == "OTC":
        out["policy_flags"].append("RX_REQUIRED")
    return out
