"""Frame timing of a story with and without its WebGL light layer.  usage: python3 perf.py <story-id>"""
import sys, asyncio, json
from playwright.async_api import async_playwright
BASE = 'http://localhost:4321/animations/' + sys.argv[1]
async def run(p, suffix, throttle, w=1440, h=900, dsf=2):
    b = await p.chromium.launch(args=['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'])
    ctx = await b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=dsf)
    page = await ctx.new_page()
    if throttle > 1:
        cdp = await ctx.new_cdp_session(page); await cdp.send('Emulation.setCPUThrottlingRate', {'rate': throttle})
    await page.goto(BASE + suffix, wait_until='networkidle'); await page.wait_for_timeout(1500)
    gl = await page.evaluate("!!document.querySelector('[data-scene] [data-gl]')")
    await page.evaluate("""() => { window.__f=[]; let last=performance.now(); const t=(n)=>{ window.__f.push(n-last); last=n; requestAnimationFrame(t) }; requestAnimationFrame(t) }""")
    total = await page.evaluate("document.documentElement.scrollHeight - innerHeight")
    y = 0
    while y < total:
        await page.mouse.wheel(0, 60); y += 60; await page.wait_for_timeout(16)
    await page.wait_for_timeout(500)
    f = sorted(await page.evaluate("window.__f.slice(5)"))
    n = len(f); mean = sum(f)/n
    res = dict(gl=gl, frames=n, mean_ms=round(mean,2), fps=round(1000/mean,1), p95_ms=round(f[int(n*.95)],1), p99_ms=round(f[int(n*.99)],1), over33=sum(1 for x in f if x>33.4), worst=round(f[-1],1))
    await b.close(); return res
async def main():
    async with async_playwright() as p:
        for label, suffix, thr, w, h, dsf in [('desktop SVG only', '?nogl', 1, 1440, 900, 2), ('desktop + WebGL', '', 1, 1440, 900, 2), ('4x slower CPU, SVG only', '?nogl', 4, 1440, 900, 2), ('4x slower CPU + WebGL', '', 4, 1440, 900, 2), ('phone size 4x CPU, SVG only', '?nogl', 4, 390, 844, 3), ('phone size 4x CPU + WebGL', '', 4, 390, 844, 3)]:
            print(label, json.dumps(await run(p, suffix, thr, w, h, dsf)))
asyncio.run(main())
