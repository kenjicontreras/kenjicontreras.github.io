"""Screenshot every step of a story preview page.

usage: python3 shots.py <story-id> <outdir> <width> <height> [--reduce] [--fractions 0.97,0.5] [--suffix '?nogl'] [--stage]

Writes s0.png (top of page) and s1.png … sN.png (each step, scrolled to the given fraction of the
step; several fractions give s3_50.png and so on). `--reduce` emulates reduced motion.
`--stage` captures only the stage element at 2x, with GPU flags so the WebGL layer renders.
The dev server must be running (npx astro dev --background).
"""
import sys, asyncio, os
from playwright.async_api import async_playwright

a = sys.argv[1:]
def opt(name, default=None, flag=False):
    if name not in a: return False if flag else default
    i = a.index(name)
    if flag: del a[i]; return True
    v = a[i + 1]; del a[i:i + 2]; return v
reduce = opt('--reduce', flag=True); stage = opt('--stage', flag=True)
fractions = [float(x) for x in opt('--fractions', '0.97').split(',')]
suffix = opt('--suffix', '')
story, out, w, h = a[0], a[1], int(a[2]), int(a[3])
URL = f'http://localhost:4321/animations/{story}{suffix}'
os.makedirs(out, exist_ok=True)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] if stage else [])
        ctx = await b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=2 if stage else 1,
                                  reduced_motion='reduce' if reduce else 'no-preference')
        page = await ctx.new_page()
        errs = []
        page.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: errs.append(str(e)))
        await page.goto(URL, wait_until='networkidle')
        await page.wait_for_timeout(900)
        print('light layer on:', await page.evaluate("!!document.querySelector('[data-scene] [data-gl]')"))
        await page.screenshot(path=f'{out}/s0.png')
        n = await page.evaluate("document.querySelectorAll('[data-step-item]').length")
        for i in range(n):
            for f in fractions:
                await page.evaluate("""([i,f]) => { const s=document.querySelectorAll('[data-step-item]')[i]; const sec=s.closest('[data-story]');
                  const a=parseFloat(getComputedStyle(sec).getPropertyValue('--story-anchor'))||0.6;
                  window.scrollTo(0, s.getBoundingClientRect().top+scrollY+s.offsetHeight*f-innerHeight*a) }""", [i, f])
                await page.wait_for_timeout(1200)
                tag = f's{i + 1}' + ('' if len(fractions) == 1 else f'_{int(f * 100):02d}')
                if stage:
                    await (await page.query_selector('[data-scene] svg')).evaluate_handle('e => e.parentElement')
                    el = await page.evaluate_handle("document.querySelector('[data-scene] svg').parentElement")
                    await el.as_element().screenshot(path=f'{out}/{tag}.png')
                else:
                    await page.screenshot(path=f'{out}/{tag}.png')
        print('ERRORS', errs[:6]) if errs else print('no console errors')
        await b.close()
asyncio.run(main())
