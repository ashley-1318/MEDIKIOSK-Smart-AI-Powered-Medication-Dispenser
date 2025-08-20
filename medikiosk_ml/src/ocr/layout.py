from __future__ import annotations
from typing import Dict, List, Tuple

# Placeholder layout detector for header, patient, meds, signature regions
# Plug YOLOv8n-doc here later.

Region = Tuple[int, int, int, int]  # x1,y1,x2,y2


def detect_regions(image_path: str) -> Dict[str, List[Region]]:
    # Stub returns a single page-wide meds region
    return {
        "header": [],
        "patient": [],
        "meds": [(0, 0, 1000, 1000)],
        "signature": []
    }
