from __future__ import annotations
from typing import List, Dict, Tuple
from rapidfuzz.distance import Levenshtein


def cer(ref: str, hyp: str) -> float:
    if not ref:
        return 0.0 if not hyp else 1.0
    dist = Levenshtein.distance(ref, hyp)
    return dist / max(1, len(ref))


def wer(ref: str, hyp: str) -> float:
    r = ref.split()
    h = hyp.split()
    dist = Levenshtein.distance(r, h)
    return dist / max(1, len(r))


def field_accuracy(pred: str, truth: str) -> float:
    return float(pred.strip().lower() == truth.strip().lower())


def f1_counts(pred_labels: List[str], true_labels: List[str]) -> Tuple[int, int, int]:
    # Simple exact-match counts per label list
    tp = sum(1 for p, t in zip(pred_labels, true_labels) if p == t)
    fp = sum(1 for p, t in zip(pred_labels, true_labels) if p != t)
    fn = fp
    return tp, fp, fn


def evaluate_items(pred_items: List[Dict], true_items: List[Dict]) -> Dict[str, float]:
    fields = ["drug_generic", "strength", "frequency", "duration"]
    accs = []
    for f in fields:
        pa = [str(p.get(f, "")) for p in pred_items]
        ta = [str(t.get(f, "")) for t in true_items]
        acc = sum(1 for p, t in zip(pa, ta) if p.strip().lower() == t.strip().lower()) / max(1, len(ta))
        accs.append(acc)
    return {"field_acc_mean": sum(accs)/len(accs) if accs else 0.0}
