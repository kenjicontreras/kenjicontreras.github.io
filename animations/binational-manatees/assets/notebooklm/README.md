# NotebookLM outputs

**Status: not generated yet.** The `notebooklm` CLI was not logged in when the story was built
(`notebooklm status` → "Not logged in"). Nothing in the animation depends on these files: they are
grounding and reference material.

To generate them:

```bash
notebooklm login                                   # opens a browser, once
zsh animations/binational-manatees/tools/notebooklm.sh
```

The script creates a notebook with the two open-access papers as sources (the Instagram slides are
not uploaded), then asks the fact-check questions and starts the generations below. Prompts are in
the script, so every output can be reproduced.

| Output | File | Use |
|---|---|---|
| Fact-check answers with citations | `fact-check.json` | Confirms every row of `brief.md` |
| Key figures table | `key-figures.csv` | Cross-check for `content.ts` |
| Mind map | `mind-map.json` | Story structure reference |
| Plain-language explainer | `explainer.md` | Copy alternatives for non-technical readers |
| Infographics (2, landscape) | `infographic-1.png`, `infographic-2.png` | Mood reference; candidate static poster |

What NotebookLM is not used for: the moving parts. Its images are flat PNGs with the text baked in,
so they cannot be layered, recoloured or animated. Those are the SVGs in `assets/svg/` and the
figure crops in `assets/img/`.
