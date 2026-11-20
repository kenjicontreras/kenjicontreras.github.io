"""Render SVG assets to one PNG contact sheet, to look at them before use.

usage: python3 render-svg.py <out.png> <background> <file.svg> [<file.svg> ...] [--color '#hex']

Each file is shown large (360 px wide) and small (64 px wide) on the background colour (a CSS
colour or gradient). `--color` sets `currentColor` for single-colour art (default #e9f3f4).
Needs the Python package `playwright` with its Chromium installed.
"""
import sys, asyncio, os
from playwright.async_api import async_playwright

args = sys.argv[1:]
color = '#e9f3f4'
if '--color' in args:
    i = args.index('--color'); color = args[i + 1]; del args[i:i + 2]
out, background, files = args[0], args[1], args[2:]
cells = ''
for k, f in enumerate(files):
    svg = open(f).read()
    # keep ids unique when the same file is shown twice
    small = svg.replace('id="', f'id="s{k}-').replace('url(#', f'url(#s{k}-').replace('href="#', f'href="#s{k}-')
    cells += f'''<figure><div class="big">{svg}</div><div class="small">{small}</div>
      <figcaption>{os.path.basename(f)} · {os.path.getsize(f) / 1024:.1f} KB</figcaption></figure>'''
html = f'''<body style="margin:0;padding:20px;background:{background};color:{color};font:13px system-ui">
<style>body{{display:flex;flex-wrap:wrap;gap:24px;width:1480px}} figure{{margin:0;width:460px}}
.big{{width:360px;display:inline-block;vertical-align:top}} .small{{width:64px;display:inline-block;vertical-align:top;margin-left:16px}}
svg{{width:100%;height:auto;display:block}} figcaption{{margin-top:6px;opacity:.8}}</style>{cells}</body>'''

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1520, 'height': 400})
        await pg.set_content(html)
        await pg.screenshot(path=out, full_page=True)
        await b.close()
asyncio.run(main())
