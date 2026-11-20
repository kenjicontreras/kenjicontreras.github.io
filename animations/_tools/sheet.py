"""Join screenshots into one contact sheet.  usage: python3 sheet.py <dir> <name,name,...> <out.png> [columns]"""
import sys
from PIL import Image
d, names, out = sys.argv[1], sys.argv[2].split(','), sys.argv[3]
cols = int(sys.argv[4]) if len(sys.argv) > 4 else 2
ims = [Image.open(f'{d}/{n}.png').convert('RGB') for n in names]
tw = 1560 // cols; th = int(tw * ims[0].height / ims[0].width)
ims = [im.resize((tw, th)) for im in ims]
rows = (len(ims) + cols - 1) // cols
W = Image.new('RGB', (tw * cols, th * rows), 'white')
for i, im in enumerate(ims): W.paste(im, ((i % cols) * tw, (i // cols) * th))
W.save(out)
