from __future__ import annotations
import json
from pathlib import Path
import typer
from rich import print
from .pipeline import batch_process
from .config import settings
from .ocr.backends import select_backend

def main(
    input_path: Path = typer.Option(..., "--input", "-i", help="Input image file or folder.", exists=True, file_okay=True, dir_okay=True, readable=True),
    output_path: Path = typer.Option("artifacts/out.jsonl", "--output", "-o", help="Output JSONL path."),
    ocr_backend: str = typer.Option(None, "--ocr-backend", help="OCR backend (tesseract|paddleocr|doctr)"),
):
    """
    Process a single image or a folder of images to extract prescription data.
    """
    paths = []
    if input_path.is_dir():
        for ext in ("*.png", "*.jpg", ".jpeg", ".tif", ".tiff", ".bmp"):
            paths.extend([str(p) for p in input_path.glob(ext)])
    elif input_path.is_file():
        paths = [str(input_path)]

    if not paths:
        print(f"No image files found in {input_path}")
        raise typer.Exit()

    if ocr_backend:
        settings.ocr_backend = ocr_backend
        
    results = batch_process(paths)
    
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f:
        for r in results:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
            
    print(f"Wrote {len(results)} records to {output_path}")


if __name__ == "__main__":
    typer.run(main)
