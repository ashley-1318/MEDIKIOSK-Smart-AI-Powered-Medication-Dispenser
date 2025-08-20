from __future__ import annotations
from typing import Any

try:
    from PIL import Image, ImageFilter  # type: ignore
except Exception:  # pragma: no cover
    Image = None  # type: ignore
    ImageFilter = None  # type: ignore


def rotate(img: Any, degrees: float):
    if Image is None:
        return img
    return img.rotate(degrees, expand=True)


def blur(img: Any, radius: float = 1.0):
    if Image is None or ImageFilter is None:
        return img
    return img.filter(ImageFilter.GaussianBlur(radius))
