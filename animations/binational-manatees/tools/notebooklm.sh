#!/bin/zsh
# Grounding and reference material from NotebookLM for the binational-manatees story.
# Requires: `notebooklm login` (once). Run from the project root:
#   zsh animations/binational-manatees/tools/notebooklm.sh [paper-2025.pdf] [paper-2024.pdf]
# Only the two open-access papers are uploaded. Infographic generation can be
# rate-limited by Google; re-run the last block later if it fails.
set -e
OUT="animations/binational-manatees/assets/notebooklm"
P25="${1:-$HOME/Downloads/fmars-12-1661294.pdf}"
P24="${2:-$HOME/Downloads/Unsupervised_identification_of_Greater_Caribbean_m.pdf}"
mkdir -p "$OUT"

NB=$(notebooklm create "Binational manatees: landing page story" --json | python3 -c 'import sys,json; print(json.load(sys.stdin)["id"])')
echo "notebook $NB" | tee "$OUT/notebook-id.txt"
for f in "$P25" "$P24"; do
  SID=$(notebooklm source add "$f" --notebook "$NB" --json | python3 -c 'import sys,json; print(json.load(sys.stdin)["source_id"])')
  notebooklm source wait "$SID" -n "$NB" --timeout 600
done

# 1. Fact check: one question per row of brief.md's fact sheet
notebooklm ask "For the 2025 residency paper, give with exact numbers and the section they come from: files analysed per country and in total; hours per country; number of vocalisations entering clustering per country; clusters before and after fusion; presumed individuals per country and their call counts; individuals detected in both countries; mean and maximum residence time per country; mean, minimum and maximum time between detections in the two countries; corridor length per country, number of protected areas, Ramsar sites and rivers. Also state the corridor AREA figures exactly as printed and whether they are internally consistent." --notebook "$NB" --json > "$OUT/fact-check.json"

# 2. Key figures as a table, and the structure of the argument
notebooklm generate data-table "Key quantitative results of the 2025 Panama and Costa Rica residency study: metric, value, unit, country, section of the paper" --notebook "$NB" --json > "$OUT/.task-table.json" || true
notebooklm generate mind-map --notebook "$NB" || true

# 3. Plain-language explainer for non-technical clients
notebooklm generate report --format custom --append "Write a 400-word explainer for business readers with no science background. Eight short sections: who the animals are, why they are endangered, the acoustic fingerprint, the method step by step, what was discovered, when they travel, the proposed corridor, what people can do. One number per section. Explain the machine learning in everyday words and say why it was hard. No jargon, no hype." --notebook "$NB" --json > "$OUT/.task-report.json" || true

# 4. Infographics for mood reference (may be rate-limited)
for style in professional editorial; do
  notebooklm generate infographic "From 1,931,079 underwater recordings to nine manatees that crossed the Panama and Costa Rica border: recordings, calls found, individuals identified by voice, border-crossers, proposed 984 km corridor. Calm palette: deep navy, teal, sage green, cream." --orientation landscape --detail concise --style $style --notebook "$NB" --retry 2 --json >> "$OUT/.task-infographics.json" || true
done

echo "Started. When 'notebooklm artifact list --notebook $NB' shows completed, download with:"
echo "  notebooklm download data-table $OUT/key-figures.csv -n $NB"
echo "  notebooklm download mind-map $OUT/mind-map.json -n $NB"
echo "  notebooklm download report $OUT/explainer.md -n $NB"
echo "  notebooklm download infographic --all $OUT -n $NB"
