from PIL import Image
from pathlib import Path

dirs = [
    Path(r"c:\Users\Nitro\Downloads\projeto_black\referencias"),
    Path(r"c:\Users\Nitro\Downloads\proposta-black"),
]

for d in dirs:
    print(f"=== {d} ===")
    for p in sorted(d.glob("*")):
        if p.suffix.lower() in [".png", ".jpg", ".jpeg"]:
            with Image.open(p) as im:
                print(f"  {p.name}: {im.size} ({im.mode})")
