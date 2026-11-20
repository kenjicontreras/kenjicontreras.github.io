#!/usr/bin/env python3
"""Digitise the nine border-crossers (B1-B9) from Guzman et al. 2025, Fig. 5 (CC BY 4.0).

Source: Guzman HM, Estevez RM, Contreras K, Poveda H, Sanchez-Galan JE, Merchan F (2025).
Front. Mar. Sci. 12:1661294, Figure 5 (bars of vocalisations per month, coloured by station),
cross-checked by eye against Figure 4 (stations over time per individual).

Run (from animations/binational-manatees/):
    python3 tools/digitise-crossings.py ~/Downloads/fmars-12-1661294.pdf

Needs `pdfimages` (poppler), numpy, scipy, Pillow. Extracts page 11 into a temp directory and
writes data/crossings.json.

How it works
- Fig. 5 uses flat ggplot colours, so every pixel is matched to the legend swatches below.
- Bars are monthly bins placed on the first day of the month; when several stations share a
  month, ggplot dodges them (narrower bars side by side), never stacks them. Each connected run of
  one station's colour is therefore one bar; its centre gives the month, its height the count.
- X calibration: the tick marks under the B9 axis. Aug 2016 at x = 270.5 px and Aug 2024 at
  x = 2026.0 px (17 ticks, every 6 months, ~109.7 px apart) -> 0.6008 px per day.
- Y calibration: per row, baseline y and pixels per vocalisation, read from the y tick marks.
"""
import json
import subprocess
import sys
import tempfile
from datetime import date, timedelta
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

HERE = Path(__file__).resolve().parent.parent
OUT_JSON = HERE / "data" / "crossings.json"

FIG5_SIZE = (2400, 3350)

# --- axis calibration (pixels in the full-resolution Fig. 5 image) ---
X_TICK_AUG2016 = 270.5   # x of the "Aug 2016" tick (2016-08-01)
X_TICK_AUG2024 = 2026.0  # x of the "Aug 2024" tick (2024-08-01)
D0, D1 = date(2016, 8, 1), date(2024, 8, 1)
PX_PER_DAY = (X_TICK_AUG2024 - X_TICK_AUG2016) / (D1 - D0).days
PLOT_X0, PLOT_X1 = 113, 2034  # x extent of the axis line

# Per row: (baseline y, pixels per vocalisation) from the y tick marks.
ROWS = {
    "B1": (288, (287.5 - 91.0) / 4),
    "B2": (642, (641.5 - 445.0) / 4),
    "B3": (996, (996.0 - 799.0) / 2),
    "B4": (1350, (1350.0 - 1218.5) / 2),
    "B5": (1704, (1704.0 - 1507.0) / 4),
    "B6": (2058, (2058.0 - 1861.5) / 14),
    "B7": (2412, (2412.0 - 2254.5) / 4),
    "B8": (2766, (2766.5 - 2569.5) / 6),
    "B9": (3120, (3120.5 - 2989.0) / 2),
}
ROW_HEIGHT = 300  # px above the baseline that belong to a row's bars
TOP_GAP = 3       # bars stop ~3 px short of their nominal height (antialiasing / baseline)

LEGEND = {  # sampled from the legend swatches
    ("CR", "S2"): (13, 71, 161), ("CR", "S3"): (25, 118, 210), ("CR", "S4"): (66, 165, 245),
    ("CR", "S6"): (100, 181, 246), ("CR", "S7"): (144, 202, 249), ("CR", "S8"): (187, 222, 251),
    ("PA", "S1"): (183, 28, 28), ("PA", "S2"): (211, 47, 47), ("PA", "S3"): (244, 67, 54),
    ("PA", "S4"): (255, 112, 67), ("PA", "S5"): (255, 152, 0),
}
COLOUR_TOL = 30  # max L1 distance to a swatch
TORTUGUERO_PACUARE = {"S6", "S7", "S8", "S9"}  # Costa Rica stations; S1-S5 are Barra del Colorado

STATUS = ("Digitised from Guzman et al. 2025, Figs. 4 and 5 (CC BY 4.0). Dates approximate to "
          "about ±2 months; replace with Supplementary Table S5 when available.")


def extract_fig5(pdf, tmp):
    subprocess.run(["pdfimages", "-png", "-f", "11", "-l", "11", str(pdf), str(Path(tmp) / "fig5")],
                   check=True)
    for p in sorted(Path(tmp).glob("fig5*.png")):
        im = Image.open(p)
        if im.size == FIG5_SIZE:
            return np.asarray(im.convert("RGB")).astype(int)
    raise SystemExit("Figure 5 not found")


def x_to_month(x):
    d = D0 + timedelta(days=(x - X_TICK_AUG2016) / PX_PER_DAY)
    # bins sit on the 1st of the month: round to the nearest month start
    if d.day > 15:
        d = (d.replace(day=1) + timedelta(days=32)).replace(day=1)
    return d.replace(day=1)


def bars_for_row(img, baseline, unit):
    top = max(0, baseline - ROW_HEIGHT)
    reg = img[top:baseline - 2, PLOT_X0:PLOT_X1]
    keys = list(LEGEND)
    cols = np.array([LEGEND[k] for k in keys])
    dist = np.abs(reg[:, :, None, :] - cols[None, None]).sum(-1)
    idx, ok = dist.argmin(-1), dist.min(-1) < COLOUR_TOL
    bars = []
    for k, (country, station) in enumerate(keys):
        count = (ok & (idx == k)).sum(0)
        lab, _ = ndimage.label(count > 2)
        for sl in ndimage.find_objects(lab):
            x0, x1 = sl[0].start, sl[0].stop
            h = float(np.median(count[x0:x1]))
            xc = PLOT_X0 + (x0 + x1 - 1) / 2
            bars.append({"date": x_to_month(xc), "country": country, "station": station,
                         "n": max(1, int(round((h + TOP_GAP) / unit))), "x": xc, "w": x1 - x0})
    bars.sort(key=lambda b: (b["date"], b["x"]))
    return bars


def months_between(a, b):
    return (b.year - a.year) * 12 + (b.month - a.month)


def ym(d):
    return d.strftime("%Y-%m")


def summarise(bid, bars):
    out = {"id": bid}
    for key, c in (("panama", "PA"), ("costaRica", "CR")):
        bs = [b for b in bars if b["country"] == c]
        out[key] = {"first": ym(bs[0]["date"]), "last": ym(bs[-1]["date"]), "events": len(bs),
                    "stations": sorted({b["station"] for b in bs}, key=lambda s: int(s[1:]))}
    first_cr = next(b for b in bars if b["country"] == "CR")
    last_pa = [b for b in bars if b["country"] == "PA" and b["date"] <= first_cr["date"]][-1]
    out["entry"] = ("Tortuguero-Pacuare" if first_cr["station"] in TORTUGUERO_PACUARE
                    else "Barra del Colorado")
    out["gapMonths"] = months_between(last_pa["date"], first_cr["date"])
    notes = []
    later_pa = [b for b in bars if b["country"] == "PA" and b["date"] > first_cr["date"]]
    if later_pa:
        notes.append(f"heard again in Panama after first reaching Costa Rica "
                     f"({ym(later_pa[0]['date'])} to {ym(later_pa[-1]['date'])}); "
                     f"gap is for the first crossing")
    if out["gapMonths"] == 0:
        notes.append("last Panama and first Costa Rica bars fall in the same month "
                     "(dodged bars), so the gap is under one month")
    if notes:
        out["note"] = "; ".join(notes)
    out["events"] = [{"date": ym(b["date"]), "country": b["country"], "station": b["station"],
                      "n": b["n"]} for b in bars]
    return out, last_pa, first_cr


def main():
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    with tempfile.TemporaryDirectory() as tmp:
        img = extract_fig5(Path(sys.argv[1]).expanduser(), tmp)
    inds, gaps = [], []
    for bid, (baseline, unit) in ROWS.items():
        bars = bars_for_row(img, baseline, unit)
        s, lp, fc = summarise(bid, bars)
        # gap in days between the two bins (both on the 1st of the month)
        gaps.append((fc["date"] - lp["date"]).days)
        inds.append(s)
        print(f"{bid}: PA {s['panama']['first']}..{s['panama']['last']} ({s['panama']['events']} bars) "
              f"CR {s['costaRica']['first']}..{s['costaRica']['last']} ({s['costaRica']['events']} bars) "
              f"gap {s['gapMonths']} mo ({ym(lp['date'])} -> {ym(fc['date'])}) entry {s['entry']}")
    print(f"gaps (days, bin to bin): {gaps}; mean {np.mean(gaps):.0f}, "
          f"min {min(gaps)}, max {max(gaps)}")
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps({"status": STATUS, "individuals": inds},
                                   indent=2, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
