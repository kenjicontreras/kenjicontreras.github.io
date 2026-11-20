"""Digitise the Gatun Lake map data for the drone-manatees story from the paper's figures.

Source: Sanchez-Galan et al. 2025, Drones 9:230 (CC BY 4.0). Figure images extracted with
  pdfimages -png resources/papers/sanchez-galan-2025-drones-9-230.pdf <dir>/img
  img-000.png  Fig. 1   lake, 44 survey polygons (red, blue ids), lon/lat ticks every 1'
  img-021.png  Fig. 12  30 training sequences (blue = manatees detected, red = not), ticks every 30"
  img-023.png  Fig. 13  15 test sequences, same colours, ticks every 30"

usage: python3 tools/build-lake.py [<dir with the three PNGs>]
writes data/lake.json (see the shape at the bottom of this file).
Then run tools/preview-lake.py to draw data/_lake-preview.png and compare it with the figures.

Everything is in one stage frame: 800 x 600, the lake of Fig. 1 fitted with 40 units of padding,
north up, Fig. 1's own aspect (Fig. 1 is plain lon/lat with the same pixels per minute on both
axes, so the stage is too). Figs 12 and 13 are georeferenced from their own ticks and mapped into
the stage through lon/lat.

All pixel numbers below are full-resolution pixels of the PNGs. Things read off the figures by eye
(tick anchors, the polygon id table, cut lines, label spots) are marked HAND.
"""
import sys, os, json
import numpy as np
import cv2
from scipy import ndimage as nd

SRC = sys.argv[1] if len(sys.argv) > 1 else \
    '/private/tmp/claude-501/-Users-kenjicontreras/a2171612-298d-4924-8c50-cac8d0eb6fc8/scratchpad/papers/drone'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'lake.json')

STAGE_W, STAGE_H, PAD = 800, 600, 40
LAKE_EPS = 0.55        # approxPolyDP tolerance for the shoreline, stage units (bigger = smaller file)
POLY_EPS = 0.35        # same for the survey polygons
MIN_RING = 6.0         # drop islands / lake fragments smaller than this many square stage units
DEBUG = os.environ.get('LAKE_DEBUG')   # a folder: write intermediate masks there
SMOOTH = 2             # px radius of the open/close that removes 1-2 px shoreline whiskers


def load(name):
    im = cv2.imread(os.path.join(SRC, name))
    if im is None:
        sys.exit(f'cannot read {name} in {SRC}')
    return im.astype(np.int16)


# ---------------------------------------------------------------------------------------------
# 1. Georeferencing from the frame ticks
# ---------------------------------------------------------------------------------------------
def frame_box(gray):
    """The map frame: the rows / columns that are dark over more than half the image."""
    d = gray < 80
    H, W = d.shape
    rows = np.where(d.sum(1) > W * 0.5)[0]
    cols = np.where(d.sum(0) > H * 0.5)[0]
    # keep the lines of the inner frame (not a black page border, which is full width)
    rows = rows[d[rows].sum(1) < W - 2]
    cols = cols[d[:, cols].sum(0) < H - 2]
    return cols.min(), cols.max(), rows.min(), rows.max()


def ticks(gray, box, side):
    """Centres of the short tick marks just outside the frame (bottom or right side)."""
    x0, x1, y0, y1 = box
    if side == 'bottom':
        line = gray[y1 + 10, x0:x1 + 1] < 100
        base = x0
    else:
        line = gray[y0:y1 + 1, x1 + 10] < 100
        base = y0
    lab, n = nd.label(line)
    return np.array([base + np.mean(np.where(lab == i)[0]) for i in range(1, n + 1)])


def fit_axis(found, anchor_px, anchor_val, step_val):
    """Least-squares px -> degrees from detected ticks. HAND: one tick (anchor_px, read from its
    label) and the tick interval step_val (degrees). The other ticks are numbered from it."""
    found = np.sort(found)
    spacing = np.median(np.diff(found))
    keep = np.abs((found - anchor_px) / spacing - np.round((found - anchor_px) / spacing)) < 0.15
    found = found[keep]
    k = np.round((found - anchor_px) / spacing)
    vals = anchor_val + k * step_val
    a, b = np.polyfit(found, vals, 1)      # deg = a * px + b
    return a, b


def georef(im, lon_anchor, lat_anchor, step):
    g = cv2.cvtColor(im.astype(np.uint8), cv2.COLOR_BGR2GRAY)
    box = frame_box(g)
    ax, bx = fit_axis(ticks(g, box, 'bottom'), *lon_anchor, step)
    ay, by = fit_axis(ticks(g, box, 'right'), *lat_anchor, -step)   # latitude falls downward
    return box, (ax, bx, ay, by)


def dm(d, m=0.0):
    return d + m / 60.0


# HAND: anchor tick px and its labelled value, read off the tick labels.
FIG1 = load('img-000.png')
F1_BOX, F1_GEO = georef(FIG1, (343, -dm(80, 4)), (121, dm(9, 20)), 1 / 60)     # 1' ticks
#   Fig 1: tick at x=343 is 80°4'W, tick at y=121 is 9°20'N; one tick per minute (112 px)
FIG12 = load('img-021.png')
F12_BOX, F12_GEO = georef(FIG12, (200, -dm(80, 4)), (168, dm(9, 14)), 0.5 / 60)  # 30" ticks
FIG13 = load('img-023.png')
F13_BOX, F13_GEO = georef(FIG13, (479, -dm(79, 53)), (753.5, dm(9, 17)), 0.5 / 60)


def px_to_lonlat(geo, x, y):
    ax, bx, ay, by = geo
    return ax * x + bx, ay * y + by


# ---------------------------------------------------------------------------------------------
# 2. Lake water mask from Fig. 1
# ---------------------------------------------------------------------------------------------
def lake_masks():
    im = FIG1
    mn, mx = im.min(2), im.max(2)
    white = mn > 235                                           # water (and the sea, and canals)
    landc = (mn >= 188) & (mx <= 220) & (mx - mn < 10)         # flat grey #cccccc = land / islands
    # anti-aliased edges of black text are grey too: only trust land where a 3x3 block is grey
    land = cv2.erode(landc.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    known = white | land
    # Every other pixel (black shoreline, red polygon lines, blue numbers, black text, grey
    # outlines) takes the class of the nearest known pixel: text and numbers on water become
    # water, red lines across land stay land, the shoreline splits down the middle.
    _, (iy, ix) = nd.distance_transform_edt(~known, return_indices=True)
    water = white[iy, ix]

    x0, x1, y0, y1 = F1_BOX
    inside = np.zeros_like(water)
    inside[y0 + 4:y1 - 3, x0 + 4:x1 - 3] = True
    inside[2040:, 2480:] = False          # HAND: the inset map (bottom right)
    water &= inside
    # HAND: the Gatun lock chambers join the lake to the Caribbean approach channel. Cut the
    # white water north of the dam line (y < 558) around the locks.
    water[:558, 1100:1460] = False

    lab, _ = nd.label(water)
    body = lab == lab[1100, 1500]         # HAND: a point in open water near the "Gatun Lake" label
    body |= _small_holes(body)            # leftover text counters / dots in the water
    # HAND: the lake / canal split. East of Gamboa (x >= 2450) the water is the canal channel
    # (Gamboa reach and Culebra Cut toward Miraflores).
    CUT = 2450
    lake = body.copy(); lake[:, CUT:] = False
    canal = body.copy(); canal[:, :CUT] = False
    # keep the largest piece of each (the cut can leave crumbs)
    lake = _largest(lake)
    canal = _largest(canal)
    cv2.imwrite(os.path.join(DEBUG, 'lake-mask.png'), (lake * 255 + canal * 128).astype(np.uint8)[::3, ::3]) if DEBUG else None
    return lake, canal


def _small_holes(m, max_area=400):
    """Holes in a mask that are small (text counters, dots): returned so they can be filled."""
    holes = nd.binary_fill_holes(m) & ~m
    lab, n = nd.label(holes)
    if n == 0:
        return holes
    area = nd.sum(holes, lab, range(1, n + 1))
    small = np.zeros(n + 1, bool); small[1:] = area < max_area
    return small[lab]


def _largest(m):
    lab, n = nd.label(m)
    if n == 0:
        return m
    area = nd.sum(m, lab, range(1, n + 1))
    return lab == (np.argmax(area) + 1)


def smooth(m, r=SMOOTH):
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, k)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, k)
    return m


# ---------------------------------------------------------------------------------------------
# 3. Stage frame
# ---------------------------------------------------------------------------------------------
LAKE, CANAL = lake_masks()
ys, xs = np.where(LAKE)
BX0, BX1, BY0, BY1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
S = min((STAGE_W - 2 * PAD) / (BX1 - BX0), (STAGE_H - 2 * PAD) / (BY1 - BY0))
OX = (STAGE_W - S * (BX1 - BX0)) / 2 - S * BX0
OY = (STAGE_H - S * (BY1 - BY0)) / 2 - S * BY0


def f1_to_stage(x, y):
    return OX + S * np.asarray(x, float), OY + S * np.asarray(y, float)


# lon/lat <-> stage through Fig. 1's tick fit:  px = (deg - b) / a
ax1, bx1, ay1, by1 = F1_GEO
KX = S / ax1                      # stage units per degree of longitude
KY = -S / ay1                     # stage units per degree of latitude (y grows southward)
LON0 = bx1 + ax1 * (-OX / S)      # lon at stage x = 0
LAT0 = by1 + ay1 * (-OY / S)      # lat at stage y = 0


def lonlat_to_stage(lon, lat):
    return (lon - LON0) * KX, (LAT0 - lat) * KY


def r1(v):
    return float(round(float(v), 1))


def ring_str(pts):
    """'M x y x y ... Z' (coordinates after the first pair are implicit line-tos)."""
    out = []
    prev = None
    for x, y in pts:
        p = (round(float(x), 1), round(float(y), 1))
        if p == prev:
            continue
        out.append(f'{p[0]:g} {p[1]:g}')
        prev = p
    return 'M' + ' '.join(out) + 'Z'


def mask_to_path(m, eps, min_area):
    """All rings of a mask (outer boundaries and holes) as one path, in stage units."""
    cs, _ = cv2.findContours(m.astype(np.uint8), cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    rings = []
    for c in cs:
        p = c.reshape(-1, 2).astype(np.float32)
        sx, sy = f1_to_stage(p[:, 0] + 0.5, p[:, 1] + 0.5)
        sp = np.stack([sx, sy], 1).astype(np.float32).reshape(-1, 1, 2)
        if abs(cv2.contourArea(sp)) < min_area:
            continue
        ap = cv2.approxPolyDP(sp, eps, True).reshape(-1, 2)
        if len(ap) < 3:
            continue
        rings.append(ring_str(ap))
    return ''.join(rings), len(rings)


lake_path, lake_rings = mask_to_path(smooth(LAKE), LAKE_EPS, MIN_RING)
canal_path, _ = mask_to_path(smooth(CANAL), LAKE_EPS, MIN_RING)

# ---------------------------------------------------------------------------------------------
# 4. The 44 survey polygons (red outlines in Fig. 1)
# ---------------------------------------------------------------------------------------------
# HAND: where each blue id number sits in Fig. 1 (full px, read from the figure). Each is snapped
# to the nearest detected blue text cluster.
ID_SPOTS = {
    1: (2175, 629), 2: (2094, 668), 3: (1985, 218), 4: (1924, 309), 5: (1930, 403),
    6: (1933, 469), 7: (1974, 533), 8: (1908, 546), 9: (1711, 524), 10: (1785, 523),
    11: (1802, 616), 12: (1893, 630), 13: (1896, 682), 14: (1945, 721), 15: (1832, 736),
    16: (1898, 770), 17: (1810, 826), 18: (1843, 940), 19: (1926, 1087), 20: (1632, 1312),
    21: (1669, 1467), 22: (1820, 1481), 23: (2027, 1795), 24: (1874, 1784), 25: (1886, 1855),
    26: (1809, 1962), 27: (1901, 1979), 28: (1727, 1975), 29: (1116, 2117), 30: (1088, 2187),
    31: (984, 2007), 32: (870, 2045), 33: (886, 2212), 34: (806, 2008), 35: (737, 1970),
    36: (671, 2126), 37: (561, 2190), 38: (267, 2159), 39: (334, 2099), 40: (446, 2024),
    41: (504, 1899), 42: (562, 1729), 43: (1013, 1582), 44: (1143, 1359),
}


def survey_polygons():
    im = FIG1
    b, g, r = im[..., 0], im[..., 1], im[..., 2]
    red = (r > 150) & (g < 120) & (b < 120)
    blue = (b > 150) & (r < 120) & (b - g > 40)
    red[2040:, 2480:] = False; blue[2040:, 2480:] = False         # inset

    # blue number clusters -> snap the HAND table to them
    bl, n = nd.label(cv2.dilate(blue.astype(np.uint8), np.ones((5, 13), np.uint8)))
    cents = np.array(nd.center_of_mass(blue, bl, range(1, n + 1)))[:, ::-1]   # (x, y)
    sizes = nd.sum(blue, bl, range(1, n + 1))
    cents = cents[sizes > 40]
    spots = {}
    for i, (x, y) in ID_SPOTS.items():
        d = np.hypot(cents[:, 0] - x, cents[:, 1] - y)
        spots[i] = tuple(cents[np.argmin(d)]) if d.min() < 30 else (x, y)

    # Barrier = red lines, plus blue digits that touch a red line (a number drawn over the
    # outline, e.g. 38, would otherwise leave a gap). Close 5 px gaps.
    near_red = cv2.dilate(red.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0
    bar = (red | (blue & near_red)).astype(np.uint8)
    bar = cv2.morphologyEx(bar, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    bar = cv2.dilate(bar, np.ones((3, 3), np.uint8))
    lab, n = nd.label(bar == 0)
    area = nd.sum(np.ones_like(lab), lab, range(1, n + 1))
    outside = int(np.argmax(area)) + 1

    # each id owns the enclosed region under its number (or the nearest one if the number
    # sits on a line)
    regions = lab.copy(); regions[(lab == outside)] = 0
    regions[np.isin(regions, np.where(area < 40)[0] + 1)] = 0
    _, (iy, ix) = nd.distance_transform_edt(regions == 0, return_indices=True)
    owner = {}
    for i, (x, y) in spots.items():
        x, y = int(round(x)), int(round(y))
        owner.setdefault(int(regions[iy[y, x], ix[y, x]]), []).append(i)
    clash = {k: v for k, v in owner.items() if len(v) > 1}
    if clash:
        print('WARNING: ids sharing one region:', clash)
    ids = np.zeros(n + 1, int)
    for k, v in owner.items():
        ids[k] = v[0]
    idmap = ids[regions]

    # Unclaimed enclosed fragments (where outlines overlap, e.g. around 12-15) join the
    # neighbouring polygon they share most border with.
    frag_lab, nf = nd.label((regions > 0) & (idmap == 0))
    for f in range(1, nf + 1):
        fm = frag_lab == f
        ring = cv2.dilate(fm.astype(np.uint8), np.ones((11, 11), np.uint8)) > 0
        nb = idmap[ring & ~fm]; nb = nb[nb > 0]
        if len(nb):
            idmap[fm] = np.bincount(nb).argmax()

    polys = []
    for i in sorted(ID_SPOTS):
        m = (idmap == i).astype(np.uint8)
        m = cv2.dilate(m, np.ones((5, 5), np.uint8))       # grow to the middle of the red line
        m = nd.binary_fill_holes(m).astype(np.uint8)
        m = _largest(m).astype(np.uint8)
        cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        c = max(cs, key=cv2.contourArea).reshape(-1, 2).astype(np.float32)
        sx, sy = f1_to_stage(c[:, 0] + 0.5, c[:, 1] + 0.5)
        sp = np.stack([sx, sy], 1).astype(np.float32).reshape(-1, 1, 2)
        ap = cv2.approxPolyDP(sp, POLY_EPS, True)
        mo = cv2.moments(ap)
        cx, cy = mo['m10'] / mo['m00'], mo['m01'] / mo['m00']
        polys.append({'id': i, 'd': ring_str(ap.reshape(-1, 2)), 'cx': r1(cx), 'cy': r1(cy)})
    return polys


POLYS = survey_polygons()

# ---------------------------------------------------------------------------------------------
# 5. Sequence dots in Figs 12 and 13
# ---------------------------------------------------------------------------------------------
# HAND: boxes to ignore (legend swatches, inset map with its red frame), full px x0, y0, x1, y1
F12_SKIP = [(3530, 2960, 4734, 3660), (250, 600, 520, 1080)]
F13_SKIP = [(3600, 3000, 4817, 3748), (3650, 300, 3950, 760)]


def dots(im, skip):
    b, g, r = im[..., 0], im[..., 1], im[..., 2]
    found = []
    for colour, m in (('blue', (b > 180) & (r < 100) & (b - g > 60)),
                      ('red', (r > 180) & (g < 120) & (b < 120))):
        for x0, y0, x1, y1 in skip:
            m[y0:y1, x0:x1] = False
        lab, n = nd.label(m)
        comps = []
        for i, sl in enumerate(nd.find_objects(lab)):
            ys, xs = np.where(lab[sl] == i + 1)
            if len(xs) < 300:
                continue
            comps.append((xs + sl[1].start, ys + sl[0].start))
        found.append((colour, comps))
    # one dot's area = median of all components (most dots are isolated)
    areas = [len(c[0]) for _, cs in found for c in cs]
    a1 = float(np.median(areas))
    out = []
    for colour, cs in found:
        for xs, ys in cs:
            # overlapping dots: the union is smaller than k whole dots, so count up
            # (1.18 dots of area -> 2 dots). Fully stacked dots cannot be seen and are lost.
            k = max(1, int(np.ceil(len(xs) / a1 - 0.1)))
            if k == 1:
                out.append((colour, xs.mean(), ys.mean()))
                continue
            pts = np.stack([xs, ys], 1).astype(np.float32)
            crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 50, 0.1)
            _, _, centres = cv2.kmeans(pts, k, None, crit, 8, cv2.KMEANS_PP_CENTERS)
            for x, y in centres:
                out.append((colour, x, y))
    return out, a1


SEQS = []
counts = {}
for set_, im, geo, skip in (('train', FIG12, F12_GEO, F12_SKIP), ('test', FIG13, F13_GEO, F13_SKIP)):
    ds, a1 = dots(im, skip)
    for colour, x, y in ds:
        lon, lat = px_to_lonlat(geo, x, y)
        sx, sy = lonlat_to_stage(lon, lat)
        SEQS.append({'set': set_, 'found': colour == 'blue', 'x': r1(sx), 'y': r1(sy)})
    counts[set_] = (sum(c == 'blue' for c, _, _ in ds), sum(c == 'red' for c, _, _ in ds), a1)

# ---------------------------------------------------------------------------------------------
# 6. Labels and scale
# ---------------------------------------------------------------------------------------------
def f1pt(x, y):
    sx, sy = f1_to_stage(x, y)
    return [r1(sx), r1(sy)]


def f12pt(x, y):
    return [r1(v) for v in lonlat_to_stage(*px_to_lonlat(F12_GEO, x, y))]


# HAND: text centres as placed in the figures (full px)
LABELS = {
    'lake': f1pt(1485, 1089),          # "Gatun Lake", Fig. 1
    'caribbean': f1pt(339, 441),       # "Caribbean Sea", Fig. 1
    'gatunLocks': f1pt(1310, 548),     # the Gatun / Agua Clara lock chambers at the dam, Fig. 1
    'gamboa': f1pt(2355, 1568),        # the Gamboa dot, Fig. 1
    'barroColorado': f12pt(3292, 1257),  # "Barro Colorado" on the island, Fig. 12
}

# 5 km: the scale bar in Fig. 1 (black bar, bottom centre)
g1 = cv2.cvtColor(FIG1.astype(np.uint8), cv2.COLOR_BGR2GRAY)
bar = (g1 < 60)[2240:2340, 1800:2300]
bl, n = nd.label(bar)
area = nd.sum(bar, bl, range(1, n + 1))
sl = nd.find_objects(bl)[int(np.argmax(area))]
bar_px = sl[1].stop - sl[1].start
SCALE5 = r1(S * bar_px)
# cross-check: 5 km of latitude is 5 / 1.852 = 2.70 minutes
check = 5 / 1.852 / 60 * KY

data = {
    'status': 'digitised from Figs 1, 12 and 13 of Sanchez-Galan et al. 2025 '
              '(Drones 9:230, CC BY 4.0); positions approximate',
    'viewBox': [STAGE_W, STAGE_H],
    'projection': {
        'note': 'plain lon/lat as in the figures (same scale on both axes, north up): '
                'x = (lon - lon0) * kx, y = (lat0 - lat) * ky; lon west-negative',
        'lon0': round(LON0, 5), 'lat0': round(LAT0, 5), 'kx': r1(KX), 'ky': r1(KY),
    },
    'lake': lake_path,
    'canal': canal_path,
    'polygons': POLYS,
    'labels': LABELS,
    'scale5km': SCALE5,
    'sequences': SEQS,
}
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, 'w') as fh:
    json.dump(data, fh, separators=(',', ':'))

print(f'lake.json {os.path.getsize(OUT) / 1024:.1f} KB  lake path {len(lake_path) / 1024:.1f} KB '
      f'({lake_rings} rings)  canal {len(canal_path) / 1024:.1f} KB')
print(f'scale {S:.5f} stage/px  lake px bbox x {BX0}-{BX1} y {BY0}-{BY1}')
print('projection', data['projection'])
print(f'polygons {len(POLYS)}  scale5km {SCALE5} (lat check {check:.1f})')
for k, (bl_, rd, a1) in counts.items():
    print(f'{k}: {bl_} found, {rd} missed (one dot = {a1:.0f} px)')
print('labels', LABELS)
