"""Scroll a story to its end and back, and report which layers are visible at each stop.

usage: python3 scrollback.py <story-id> <layer,layer,...>

Prints, at the end and at 90 % of each earlier step, the active step and whether each named
layer (data-l) is visible. Compare the lines with a forward pass: a layer that stays visible
after scrolling back was not restored by the timeline.
"""
import sys, asyncio, json
from playwright.async_api import async_playwright
story, layers = sys.argv[1], sys.argv[2].split(',')
import os
URL = f"http://localhost:4321{'/es' if os.environ.get('LANG_PAGE') == 'es' else ''}/animations/{story}"
STATE = """(layers) => { const v=(n)=>{const e=document.querySelector(`[data-l="${n}"]`); if(!e) return null; const c=getComputedStyle(e); return c.visibility!=='hidden' && +c.opacity>0.05};
 const o={step:document.querySelector('[data-scene]').dataset.step}; layers.forEach(n=>o[n]=v(n)); return o }"""
async def goto(page, i, f):
    await page.evaluate("""([i,f]) => { const s=document.querySelectorAll('[data-step-item]')[i]; const sec=s.closest('[data-story]');
      const a=parseFloat(getComputedStyle(sec).getPropertyValue('--story-anchor'))||0.6;
      window.scrollTo(0, s.getBoundingClientRect().top+scrollY+s.offsetHeight*f-innerHeight*a) }""", [i, f])
    await page.wait_for_timeout(1300)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); page = await b.new_page(viewport={'width': 1440, 'height': 900}); errs = []
        page.on('pageerror', lambda e: errs.append(str(e)))
        await page.goto(URL, wait_until='networkidle'); await page.wait_for_timeout(500)
        n = await page.evaluate("document.querySelectorAll('[data-step-item]').length")
        fwd = []
        for i in range(n):
            await goto(page, i, 0.9); fwd.append(await page.evaluate(STATE, layers))
        ok = True
        for i in range(n - 2, -1, -1):
            await goto(page, i, 0.9); back = await page.evaluate(STATE, layers)
            same = back == fwd[i]; ok = ok and same
            print(f'step {i + 1}:', 'restored' if same else f'DIFFERS forward={json.dumps(fwd[i])} back={json.dumps(back)}')
        print('all steps restore' if ok else 'SOME STEPS DIFFER', '· page errors:', errs)
        await b.close()
asyncio.run(main())
