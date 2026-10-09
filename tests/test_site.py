"""Offline checks for public references, privacy and notebook export wiring."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import re
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from site_export import prepare_page, PLOTLY_URL


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.tags = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


class WebsiteChecks(unittest.TestCase):
    def test_public_pages_and_references(self):
        pages = [*ROOT.glob('*.html'), *ROOT.glob('output/*.html')]
        self.assertEqual(len(pages), 8)
        for path in pages:
            with self.subTest(page=path.name):
                text = path.read_text(encoding='utf-8')
                page = Page(text)
                self.assertEqual(sum(tag == 'h1' for tag, _ in page.tags), 1)
                self.assertTrue(any(tag == 'html' and a.get('lang') in ('en', 'de') for tag, a in page.tags))
                self.assertTrue(any(tag == 'title' for tag, _ in page.tags))
                self.assertEqual(text.count('class="site-footer"'), 1)
                self.assertEqual(text, prepare_page(text, plot=path.parent.name == 'output'))
                for target in ('/impressum.html', '/datenschutz.html'):
                    self.assertIn(('a', {'href': target}), page.tags)
                self.assertIn('name="referrer" content="no-referrer"', text)
                for tag, attrs in page.tags:
                    if tag == 'img': self.assertIn('alt', attrs)
                    if attrs.get('target') == '_blank':
                        self.assertIn('noopener', attrs.get('rel', ''))
                    for field in ('href', 'src'):
                        if field not in attrs: continue
                        value = urlsplit(attrs[field])
                        if value.scheme or value.netloc:
                            self.assertEqual(tag, 'a', 'Unexpected third-party resource')
                            continue
                        target = ROOT / unquote(value.path).lstrip('/') if value.path.startswith('/') else path.parent / unquote(value.path)
                        if target.is_dir(): target /= 'index.html'
                        if not value.path: target = path
                        self.assertTrue(target.is_file(), str(target))
                        if value.fragment and target.suffix == '.html':
                            target_page = Page(target.read_text(encoding='utf-8'))
                            self.assertTrue(any(a.get('id') == value.fragment for _, a in target_page.tags))

    def test_plot_dependencies_and_storage(self):
        for path in (ROOT / 'output').glob('*.html'):
            text = path.read_text(encoding='utf-8')
            self.assertEqual(text.count(f'src="{PLOTLY_URL}"'), 1)
            self.assertNotIn('https://cdn.plot.ly/', text)
            self.assertIn('Plotly.newPlot(', text)
            self.assertNotRegex(text, r'localStorage|sessionStorage|document\.cookie|sendBeacon')
        vendor = (ROOT / PLOTLY_URL.lstrip('/')).read_text(encoding='utf-8')
        self.assertNotIn('window.localStorage', vendor)
        from plotly.offline import get_plotlyjs
        upstream = get_plotlyjs()
        expected = '/* phey.app: diagnostic localStorage replaced with in-memory objects. */\n' + upstream.replace('window.localStorage', '({})')
        self.assertEqual(vendor, expected, 'Unexpected vendor modifications')

    def test_every_notebook_uses_shared_export(self):
        for path in (ROOT / 'notebooks').glob('*.ipynb'):
            notebook = json.loads(path.read_text(encoding='utf-8'))
            sources = '\n'.join(''.join(cell['source']) for cell in notebook['cells'] if cell['cell_type'] == 'code')
            self.assertIn('write_plot_page(output_file,', sources)
            self.assertIn('include_plotlyjs=False', sources)
            self.assertNotIn('include_plotlyjs="cdn"', sources)
            self.assertNotIn('output_file.write_text(', sources)

    def test_domain_and_internal_documents(self):
        self.assertEqual((ROOT / 'CNAME').read_text().strip(), 'phey.app')
        config = (ROOT / '_config.yml').read_text()
        for name in ('GOVERNANCE.md', 'GOVERNANCE_REVIEW.md', 'scripts', 'tests'):
            self.assertIn('  - ' + name, config)


if __name__ == '__main__':
    unittest.main()
