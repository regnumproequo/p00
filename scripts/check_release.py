"""Check public draft markers and unresolved internal publication review items."""
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
review = (root / 'GOVERNANCE_REVIEW.md').read_text(encoding='utf-8')
pending = re.findall(r'<!-- release-review-required:\s*(.*?)\s*-->', review, re.S)
if pending:
    raise SystemExit('RELEASE BLOCKED: internal review pending: ' + '; '.join(pending))
print('No draft or internal review markers remain. Owner review and explicit release approval are still required.')
