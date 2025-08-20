from __future__ import annotations
import io
from fastapi.testclient import TestClient
from src.server import app


def test_health():
    client = TestClient(app)
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_extract_dummy(monkeypatch):
    # monkeypatch OCR to return a stable line
    from src.ocr import ocr_engine as ocr

    def fake_run(path: str):
        return ["Paracetamol 500 mg 1 tab TID 5 days"], 0.55

    monkeypatch.setattr(ocr, "run_ocr", fake_run)
    client = TestClient(app)
    r = client.post("/extract", files={"file": ("a.png", b"not real", "image/png")})
    assert r.status_code == 200
    data = r.json()
    assert "items" in data and isinstance(data["items"], list)
