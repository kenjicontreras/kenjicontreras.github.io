#!/usr/bin/env python3
"""Build the eight recoloured spectrogram crops from Guzman et al. 2025, Fig. 2.

Source: Guzman HM, Estevez RM, Contreras K, Poveda H, Sanchez-Galan JE, Merchan F (2025).
Front. Mar. Sci. 12:1661294, Figure 2 (CC BY 4.0). Colour ramp changed; data unchanged.

Run (from animations/binational-manatees/):
    python3 tools/build-spectrograms.py ~/Downloads/fmars-12-1661294.pdf

Needs `pdfimages` (poppler), numpy, scipy, matplotlib, Pillow.
The script extracts page 8 into a temporary directory (nothing is written next to the PDF)
and writes assets/img/spec-*.webp, assets/img/_spectrograms-sheet.png and
data/spectrograms.json.
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from matplotlib import colormaps
from PIL import Image
from scipy.spatial import cKDTree

HERE = Path(__file__).resolve().parent.parent  # animations/binational-manatees
OUT_IMG = HERE / "assets" / "img"
OUT_JSON = HERE / "data" / "spectrograms.json"

# Expected size of the embedded Figure 2 image (page 8).
FIG2_SIZE = (2896, 4393)

# Plot-area boxes in the full-resolution Fig. 2 image: (left, top, right, bottom), exclusive.
# Measured as the coloured rectangles (saturation > 40) of each panel; the inset below then
# strips the black spine and, in rows C/D, the bright 0 Hz line.
BOX_A2 = (841, 109, 1372, 954)    # Cluster 18, M13, column 2
BOX_A3 = (1590, 109, 2101, 954)   # Cluster 18, M13, column 3
BOX_B3 = (1576, 1217, 2107, 2063)  # Cluster 9, M11, column 3
BOX_B4 = (2303, 1217, 2835, 2062)  # Cluster 9, M11, column 4
BOX_C3 = (1588, 2288, 2110, 3205)  # P63, column 3
BOX_C4 = (2309, 2287, 2832, 3198)  # P63, column 4
BOX_D3 = (1596, 3397, 2119, 4315)  # P15, column 3
BOX_D4 = (2311, 3397, 2834, 4320)  # P15, column 4

# Pixels trimmed from each side of a box: left, top, right, bottom.
INSET = (5, 5, 7, 13)

OUT_SIZE = (300, 400)
WEBP_QUALITY = 82
MAX_BYTES = 30_000

# Contrast curve: energy is normalised between these percentiles of the panel, then a gamma
# is solved so that the panel's median (the noise floor) lands on NOISE_TARGET.
LO_PCT, HI_PCT = 2.0, 99.0
NOISE_TARGET = 0.14

# Spectrogram ramp from style.md (linear interpolation in RGB).
RAMP = [(0.00, "#0b2230"), (0.35, "#0a7c7e"), (0.65, "#569486"), (1.00, "#d7e26a")]

PANELS = [
    # file, box, individual, set, panel, contour
    ("spec-m13-1.webp", BOX_A2, "M13", "2024 validation (captured manatees)", "A2", "flat"),
    ("spec-m13-2.webp", BOX_A3, "M13", "2024 validation (captured manatees)", "A3", "flat"),
    ("spec-m11-1.webp", BOX_B3, "M11", "2024 validation (captured manatees)", "B3", "hill"),
    ("spec-m11-2.webp", BOX_B4, "M11", "2024 validation (captured manatees)", "B4", "hill"),
    ("spec-p63-1.webp", BOX_C3, "P63", "this study, Panama", "C3", "flat"),
    ("spec-p63-2.webp", BOX_C4, "P63", "this study, Panama", "C4", "hill"),
    ("spec-p15-1.webp", BOX_D3, "P15", "this study, Panama", "D3", "hill"),
    ("spec-p15-2.webp", BOX_D4, "P15", "this study, Panama", "D4", "flat"),
]


def hex_rgb(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], float)


def ramp_lut(n=256):
    xs = np.array([p for p, _ in RAMP])
    cs = np.array([hex_rgb(c) for _, c in RAMP])
    t = np.linspace(0, 1, n)
    return np.stack([np.interp(t, xs, cs[:, k]) for k in range(3)], 1)


VIRIDIS = colormaps["viridis"](np.linspace(0, 1, 256))[:, :3] * 255
TREE = cKDTree(VIRIDIS)
LUT = ramp_lut()


def extract_fig2(pdf, tmp):
    subprocess.run(["pdfimages", "-png", "-f", "8", "-l", "8", str(pdf), str(Path(tmp) / "fig2")],
                   check=True)
    imgs = sorted(Path(tmp).glob("fig2*.png"))
    for p in imgs:
        im = Image.open(p)
        if im.size == FIG2_SIZE:
            return im.convert("RGB")
    raise SystemExit(f"Figure 2 ({FIG2_SIZE}) not found among {imgs}")


def energy(rgb):
    """Invert viridis: nearest LUT entry -> scalar 0..1."""
    flat = rgb.reshape(-1, 3).astype(float)
    _, idx = TREE.query(flat)
    return (idx / 255.0).reshape(rgb.shape[:2])


def contrast(e):
    lo, hi = np.percentile(e, [LO_PCT, HI_PCT])
    t = np.clip((e - lo) / (hi - lo), 1e-6, 1)
    med = float(np.median(t))
    gamma = np.log(NOISE_TARGET) / np.log(med) if 0 < med < 1 else 1.0
    gamma = float(np.clip(gamma, 0.8, 3.0))
    return t ** gamma, gamma


def recolour(e):
    i = np.clip((e * 255).round().astype(int), 0, 255)
    return LUT[i].astype(np.uint8)


def crop(fig, box):
    l, t, r, b = box
    il, it, ir, ib = INSET
    return np.asarray(fig.crop((l + il, t + it, r - ir, b - ib)))


def save_webp(arr, path):
    im = Image.fromarray(arr).resize(OUT_SIZE, Image.LANCZOS)
    q = WEBP_QUALITY
    while True:
        im.save(path, "WEBP", quality=q, method=6)
        if path.stat().st_size <= MAX_BYTES or q <= 50:
            break
        q -= 4
    return q


def contact_sheet(paths, out):
    pad = 16
    w, h = OUT_SIZE
    sheet = Image.new("RGB", (pad + 2 * (w + pad), pad + 4 * (h + pad)), "#0b2230")
    for k, p in enumerate(paths):
        r, c = divmod(k, 2)
        sheet.paste(Image.open(p).convert("RGB"), (pad + c * (w + pad), pad + r * (h + pad)))
    sheet.save(out)


def main():
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    pdf = Path(sys.argv[1]).expanduser()
    OUT_IMG.mkdir(parents=True, exist_ok=True)
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        fig = extract_fig2(pdf, tmp)
    items, paths = [], []
    for fname, box, ind, sset, panel, contour in PANELS:
        e, gamma = contrast(energy(crop(fig, box)))
        path = OUT_IMG / fname
        q = save_webp(recolour(e), path)
        paths.append(path)
        print(f"{fname}: panel {panel}, gamma {gamma:.2f}, q {q}, {path.stat().st_size} B")
        items.append({"file": fname, "individual": ind, "set": sset, "panel": panel,
                      "contour": contour})
    contact_sheet(paths, OUT_IMG / "_spectrograms-sheet.png")
    OUT_JSON.write_text(json.dumps({
        "status": "Cropped and recoloured from Guzman et al. 2025, Fig. 2 (CC BY 4.0). "
                  "Colour ramp changed; data unchanged.",
        "credit": "Spectrograms: Guzman et al. 2025, Front. Mar. Sci. 12:1661294, Fig. 2, "
                  "CC BY 4.0 (recoloured).",
        "axes": {"x": "time, about 0.4 s", "y": "frequency, 0 to 48 kHz"},
        "items": items,
    }, indent=2, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
