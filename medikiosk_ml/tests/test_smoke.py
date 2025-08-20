from __future__ import annotations
from pathlib import Path
from src.pipeline import batch_process, process_image


def test_smoke_no_images(tmp_path: Path):
    # With no images, batch_process should return empty list
    res = batch_process([])
    assert isinstance(res, list)
    assert len(res) == 0


def test_process_image_with_fake_ocr(monkeypatch, tmp_path: Path):
    img = tmp_path / "dummy.png"
    img.write_bytes(b"not_an_image")

    from src.ocr import ocr_engine as ocr

    def fake_run(path: str):
        return ["Paracetamol 500 mg 1 tab TID 5 days"], 0.55

    monkeypatch.setattr(ocr, "run_ocr", fake_run)
    pres = process_image(str(img))
    assert pres.items, "Should produce at least one item"
    item = pres.items[0]
    assert item.drug_generic.lower().startswith("paracetamol")
