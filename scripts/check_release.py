"""Fail closed while local legal drafts still contain review markers."""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
drafts = []
for name in ('impressum.html', 'datenschutz.html'):
    text = (root / name).read_text(encoding='utf-8')
    if re.search(r'data-review-required|class="placeholder"|\[[A-ZÄÖÜ][^\]]+\]', text):
        drafts.append(name)
if drafts:
    raise SystemExit('RELEASE BLOCKED: resolve personal/legal/hosting review items in ' + ', '.join(drafts))
print('No draft markers remain. Owner review and explicit release approval are still required.')
