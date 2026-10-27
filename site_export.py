"""Small, offline postprocessor shared by every notebook export.

Run this file after changing shared page chrome, or --check before review. It
never executes notebooks or publishes anything. Plot data and event handlers
are kept.
"""
from pathlib import Path
import argparse
import re

ROOT = Path(__file__).resolve().parent
VERSION = "4.1.1"
PLOTLY_URL = f"/assets/vendor/plotly-{VERSION}.min.js"
HEAD = '<meta name="referrer" content="no-referrer">\n  <link rel="stylesheet" href="/assets/governance.css">'
FAVICON = '<link rel="icon" href="/assets/landing/mark.svg" type="image/svg+xml">'
START = "<!-- legal-footer:start -->"
END = "<!-- legal-footer:end -->"
BRAND = """<a class="site-brand" href="/" aria-label="phey.app home">
  <svg viewBox="0 0 40 44" fill="none" aria-hidden="true"><path d="M20 2 37 12v20L20 42 3 32V12Z M20 2v20m17-10L20 22 3 12m17 10v20M3 32l17-10 17 10" stroke="currentColor" stroke-width="1.4"/></svg>
  <span class="site-brand-copy"><span class="site-brand-name">phey.app</span><span class="site-brand-tagline">Ideas into perspective</span></span>
</a>"""


def vendor_plotly():
    """Use the installed, pinned Plotly bundle; no CDN or download at export."""
    from plotly.offline import get_plotlyjs

    source = get_plotlyjs()
    if f"plotly.js v{VERSION}\n" not in source:
        raise RuntimeError("Plotly version changed: review the vendor update before exporting.")
    # The full upstream bundle reads/writes localStorage for debug/deprecation
    # preferences. Keep these optional diagnostics in memory, never on disk.
    if source.count("window.localStorage") != 3:
        raise RuntimeError("Plotly storage code changed: review the privacy patch.")
    source = source.replace("window.localStorage", "({})")
    source = "/* phey.app: diagnostic localStorage replaced with in-memory objects. */\n" + source
    target = ROOT / PLOTLY_URL.lstrip("/")
    target.parent.mkdir(parents=True, exist_ok=True)
    if not target.exists() or target.read_text(encoding="utf-8") != source:
        target.write_text(source, encoding="utf-8", newline="\n")


def prepare_page(document, *, plot=False):
    if not re.search(r'<link\b[^>]*\brel=["\'](?:shortcut )?icon["\']', document, re.I):
        document = document.replace('</head>', f'  {FAVICON}\n</head>', 1)
    if not re.search(r'<header\b[^>]*class="[^"]*\bsite-header\b', document):
        if 'class="site-brand"' not in document:
            document = re.sub(r'(<body\b[^>]*>)', lambda m: m[0] + '\n  ' + BRAND.replace('\n', '\n  '), document, count=1)
    if plot:
        # Migrate old CDN and inline exports without touching figure JSON.
        document = re.sub(r'<script\b[^>]*src="https://cdn\.plot\.ly/[^">]+"[^>]*>\s*</script>', '', document)
        document = re.sub(r'<script\b[^>]*>\s*/\*\*\s*\n\* plotly\.js.*?</script>', '', document, flags=re.S)
        if PLOTLY_URL not in document:
            document = document.replace('</head>', f'  <script src="{PLOTLY_URL}"></script>\n</head>')
        if not re.search(r'<h1\b', document):
            title = re.search(r'<title>(.*?)</title>', document, re.S).group(1).split(' | ')[0]
            document = re.sub(r'(<a\b[^>]*href="../index.html"[^>]*>.*?</a>)',
                              lambda m: m[0] + '\n      <h1 class="page-heading">' + title + '</h1>',
                              document, count=1)
        # Wide Sankeys intentionally scroll; make that area keyboard reachable.
        document = re.sub(r'<div class="(plot-scroll|scroll)">',
                          r'<div class="\1" tabindex="0" role="region" aria-label="Scrollable chart">', document)
    if '/assets/governance.css' not in document:
        document = document.replace('</head>', f'  {HEAD}\n</head>')
    footer = START + '\n' + (ROOT / '_includes/legal-footer.html').read_text(encoding='utf-8').strip() + '\n' + END
    if START in document:
        document = re.sub(re.escape(START) + r'.*?' + re.escape(END), lambda _: footer, document, flags=re.S)
    else:
        document = document.replace('</body>', footer + '\n</body>')
    return document


def write_plot_page(path, document):
    vendor_plotly()
    Path(path).write_text(prepare_page(document, plot=True), encoding='utf-8', newline='\n')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Check generated navigation without writing')
    args = parser.parse_args()
    if not args.check:
        vendor_plotly()
    stale = []
    for path in [*ROOT.glob('*.html'), *ROOT.glob('output/*.html')]:
        original = path.read_text(encoding='utf-8')
        expected = prepare_page(original, plot=path.parent.name == 'output')
        if original != expected:
            stale.append(str(path.relative_to(ROOT)))
            if not args.check:
                path.write_text(expected, encoding='utf-8', newline='\n')
    if args.check and stale:
        raise SystemExit('Run python site_export.py to update: ' + ', '.join(stale))
    print('Legal navigation is current.' if args.check else 'Updated local pages and Plotly bundle.')


if __name__ == '__main__':
    main()
