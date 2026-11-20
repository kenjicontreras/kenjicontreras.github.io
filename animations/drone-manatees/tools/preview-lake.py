"""Draw data/lake.json as an SVG on the story's dark palette and render it to data/_lake-preview.png,
to compare by eye with Figs 1, 12 and 13 of the paper.

usage: python3 tools/preview-lake.py
Needs the Python package `playwright` with its Chromium (as animations/_tools/render-svg.py does).
Also writes data/_lake-preview.svg.
"""
import os, json, asyncio
from playwright.async_api import async_playwright

here = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data')
d = json.load(open(os.path.join(here, 'lake.json')))
W, H = d['viewBox']

parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W * 2}" height="{H * 2}">',
         f'<rect width="{W}" height="{H}" fill="#16302b"/>',
         f'<path d="{d["lake"]}" fill="#1c4744" fill-rule="evenodd" stroke="#3d6e66" stroke-width=".3"/>']
if d['canal']:
    parts.append(f'<path d="{d["canal"]}" fill="#1c4744" fill-rule="evenodd" stroke="#3d6e66" stroke-width=".3"/>')
for p in d['polygons']:
    parts.append(f'<path d="{p["d"]}" fill="none" stroke="#eaf3ee" stroke-width=".5" opacity=".85"/>')
    parts.append(f'<text x="{p["cx"]}" y="{p["cy"] + 1.6}" font-size="4.5" fill="#9fd0ff" '
                 f'text-anchor="middle" font-family="system-ui">{p["id"]}</text>')
for s in d['sequences']:
    sw = 'stroke="#ffd18a" stroke-width=".4"' if s['set'] == 'test' else ''
    if s['found']:
        parts.append(f'<circle cx="{s["x"]}" cy="{s["y"]}" r="2.2" fill="#c4832a" {sw}/>')
    else:
        parts.append(f'<circle cx="{s["x"]}" cy="{s["y"]}" r="2.2" fill="none" stroke="#fff" stroke-width=".8"/>')
names = {'lake': 'Gatún Lake', 'caribbean': 'Caribbean Sea', 'gatunLocks': 'Gatún locks',
         'gamboa': 'Gamboa', 'barroColorado': 'Barro Colorado'}
for k, (x, y) in d['labels'].items():
    parts.append(f'<circle cx="{x}" cy="{y}" r="1" fill="#f66"/>'
                 f'<text x="{x}" y="{y - 3}" font-size="9" fill="#eaf3ee" text-anchor="middle" '
                 f'font-family="system-ui">{names[k]}</text>')
k5 = d['scale5km']
parts.append(f'<path d="M40 570h{k5}" stroke="#eaf3ee" stroke-width="2"/>'
             f'<text x="40" y="564" font-size="9" fill="#eaf3ee" font-family="system-ui">5 km</text>')
n_tr = sum(s['set'] == 'train' for s in d['sequences']); n_te = len(d['sequences']) - n_tr
parts.append(f'<text x="790" y="590" font-size="8" fill="#9bb" text-anchor="end" font-family="system-ui">'
             f'train dots {n_tr} (plain) · test dots {n_te} (gold rim) · hollow = not detected</text>')
parts.append('</svg>')
svg = '\n'.join(parts)
open(os.path.join(here, '_lake-preview.svg'), 'w').write(svg)


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': W * 2, 'height': H * 2})
        await pg.set_content(f'<body style="margin:0">{svg}</body>')
        await pg.screenshot(path=os.path.join(here, '_lake-preview.png'))
        await b.close()
asyncio.run(main())
print('wrote', os.path.join(here, '_lake-preview.png'))
