"""Cut the drone-photo crops used on the stage from the paper's figures.

Source: Sanchez-Galan et al. 2025, Drones 9:230 (CC BY 4.0), figure images extracted with
  pdfimages -png resources/papers/sanchez-galan-2025-drones-9-230.pdf <dir>/img
usage: python3 tools/build-photos.py <dir with img-001.png and img-013.png>

Writes to assets/img/:
  pair.webp          Fig. 8A (= Fig. 18C): a mother and calf with a third manatee, and two logs
  pair-y.webp        the same crop as luminance only (the Y channel the classifier is given, §2.6)
  crop-manatee.webp  Fig. 2B, left frame: one manatee under the surface
  crop-log.webp      Fig. 2B, left frame: a floating log near it
Colours are untouched; the crops are only cut and resized.
"""
import sys, os
from PIL import Image

src = sys.argv[1]
out = os.path.join(os.path.dirname(__file__), '..', 'assets', 'img')
os.makedirs(out, exist_ok=True)

fig8 = Image.open(f'{src}/img-013.png').convert('RGB')      # 2777 x 1395, panels A | B
k = fig8.width / 1200
pair = fig8.crop(tuple(int(v * k) for v in (5, 40, 515, 550))).resize((480, 480), Image.LANCZOS)
pair.save(f'{out}/pair.webp', quality=82, method=6)
pair.convert('YCbCr').getchannel('Y').convert('RGB').save(f'{out}/pair-y.webp', quality=80, method=6)

fig2 = Image.open(f'{src}/img-001.png').convert('RGB')      # 2661 x 2398, rows A to D
w, h = fig2.size
rowB = fig2.crop((int(w * 0.05), int(h * 0.25), w, int(h * 0.5)))
rowB.crop((511, 190, 811, 490)).resize((240, 240), Image.LANCZOS).save(f'{out}/crop-manatee.webp', quality=82, method=6)
rowB.crop((859, 40, 1019, 200)).resize((240, 240), Image.LANCZOS).save(f'{out}/crop-log.webp', quality=82, method=6)
for f in sorted(os.listdir(out)):
    print(f, os.path.getsize(f'{out}/{f}'))
