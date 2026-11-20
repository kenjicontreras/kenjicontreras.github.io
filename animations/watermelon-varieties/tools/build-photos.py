"""Cut the variety photos used on the stage from Fig. 1 of the paper.

Source: Contreras, Henry, Cáceres-Hernández, Sanchez-Galan 2022, IEEE ISIE (© 2022 IEEE; reused by
the first author). Figure images extracted with
  pdfimages -png resources/papers/contreras-2022-ieee-isie-watermelon.pdf <dir>/m
usage: python3 tools/build-photos.py <dir with m-000.png (image) and m-001.png (its mask)>

Writes to assets/img/:
  var-anna.webp, var-joya.webp, var-quetzali.webp      the fruits of each variety, transparent background
  patch-anna.webp, patch-joya.webp, patch-quetzali.webp one rind patch each, reduced to 40 × 40 pixels
                                                         (the size the networks were given, §II-B)
Colours are untouched; the images are only cut and resized.
"""
import sys, os
from PIL import Image

src = sys.argv[1]
out = os.path.join(os.path.dirname(__file__), '..', 'assets', 'img')
os.makedirs(out, exist_ok=True)

fig = Image.open(f'{src}/m-000.png').convert('RGB')          # 3211 x 1343
fig.putalpha(Image.open(f'{src}/m-001.png').convert('L'))     # soft mask: black background removed
k = fig.width / 1600                                          # crops below were measured at 1600 px wide
box = lambda *v: tuple(int(x * k) for x in v)

groups = {'anna': (70, 60, 492, 352), 'joya': (540, 64, 978, 356), 'quetzali': (1024, 54, 1518, 356)}
for name, b in groups.items():
    im = fig.crop(box(*b))
    im.thumbnail((440, 440), Image.LANCZOS)
    im.save(f'{out}/var-{name}.webp', quality=84, method=6)

patches = {'anna': (150, 514, 260, 620), 'joya': (726, 524, 832, 628), 'quetzali': (1246, 524, 1338, 616)}
for name, b in patches.items():
    im = fig.crop(box(*b)).convert('RGB').resize((40, 40), Image.BOX)
    im.save(f'{out}/patch-{name}.webp', lossless=True)
for f in sorted(os.listdir(out)):
    print(f, os.path.getsize(f'{out}/{f}'))
