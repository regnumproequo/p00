# phey.app

Personal academic projects, research and interactive Plotly visualizations.
Static HTML, CSS and JavaScript hosted through GitHub Pages at https://phey.app.

## Development

Use the Python environment in `requirements.txt` to run the notebooks. Their
exports go to `output/`; `site_export.py` keeps Plotly local and adds the shared
legal footer. After changing the footer, run `python site_export.py`. Check
existing exports with `python site_export.py --check`.

Preview from the repository root with
`python -m http.server 8000 --bind 127.0.0.1` so absolute links and assets resolve.
See [GOVERNANCE.md](GOVERNANCE.md) for privacy, security and maintenance guidance.

Develop on feature branches. Review before merging into `main`, which publishes
the production website through GitHub Pages.
