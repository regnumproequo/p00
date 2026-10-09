# phey.app maintenance

Personal, non-commercial research, interactive visualizations and experiments;
static HTML/CSS/JavaScript hosted on GitHub Pages at `phey.app`. Python/Jupyter
generates five Plotly pages in `output/`. No application server or visitor database.

## Privacy

- GitHub Pages receives connection data and logs visitor IPs for security. Keep
  the hosting entity, contractual roles, transfer safeguards and retention under
  review; do not infer an Article 28 agreement from GitHub's generic DPA.
- No analytics, advertising, forms, newsletters, browser storage or tracking.
  Plotly is served locally; its optional persistent diagnostics are disabled.
  Existing source citations are links, not embeds. New maps/embeds can change this.
- No consent banner for this implementation. Reassess § 25 TDDDG and GDPR before
  adding storage, analytics, APIs or third-party resources; prefer removing them.
- Contact email uses WEB.DE directly, without forwarding or additional provider
  sync. Delete enquiries once no longer needed, subject to applicable retention
  duties; this practice was confirmed by the owner. Review changes to this setup.
  Publish aggregate/synthetic research data only after checking disclosure rights.

## GDPR — GitHub Pages Hosting

The [BayLDA guidance of 16 May 2019](https://www.lda.bayern.de/media/veroeffentlichungen/FAQ_Hosting_keine_Auftragsverarbeitung.pdf)
treats purely static hosting without user tracking or personal page-access data
flowing to the operator as outside Article 28 commissioned processing. Required
IP processing for the host's security does not alone establish that relationship.

The repository review confirms static HTML/CSS/JavaScript, local Plotly and
offline notebook generation; no server-side accounts, personalized backend,
analytics, tracking, forms, embeds or visitor-log collection/integration were
found. Prior browser checks of all eight pages at two widths found no external
requests, cookies or browser-storage accesses. GitHub documents visitor-IP
security logging; no mechanism providing personal Pages access logs to the
operator was identified in the repository or reviewed Pages documentation.
Authenticated account settings and provider-internal processing were not inspected.

On this evidence, a separate Article 28 AVV is provisionally not considered
necessary for the current basic Pages hosting configuration, subject to actual
technical and contractual arrangements. This is an application of general
guidance, not BayLDA approval of GitHub or a compliance guarantee. Reassess if
tracking, visitor-log access, server-side features or hosting arrangements change;
email enquiries remain a separate processing activity.

## Security and dependencies

- Never store credentials in HTML, notebooks, outputs or Git. Keep secrets outside
  the repository; rotate suspected exposures immediately, including historical ones.
- Keep GitHub 2FA enabled; review access and branch protections. Keep Pages on
  `main`, enforce HTTPS and verify domain ownership in GitHub. Check DNS on hosting changes.
- Python pins are development dependencies. Review updates/advisories, regenerate
  plots, and test them before updating. Plotly.js 4.1.1 comes from Plotly.py 7.1.0;
  provenance, license and the diagnostic-storage patch are in `assets/vendor/README.md`.
- External links use a no-referrer policy. Do not add remote fonts, scripts or
  widgets without reviewing network behavior and updating the privacy notice.

## Maintenance and release

Develop on feature branches; this review is on `feature/minimal-governance`.
Notebook export cells call `scripts/site_export.py`; change the shared footer in
`_includes/legal-footer.html` and run `python scripts/site_export.py` to refresh
existing pages. Run `python -m unittest discover -s tests` and
`python scripts/site_export.py --check` after exports or layout changes.

Keep contact data accurate. Review both legal pages when content, email, hosting,
monetization or dependencies change. Confirm legal links on every page, mobile
layout and plot interactions. Legal-page placeholders are completed and the
hosting review is provisionally resolved on the basis above. Review
[GOVERNANCE_REVIEW.md](GOVERNANCE_REVIEW.md), then run
`python scripts/check_release.py`. This local check is not a GitHub deployment gate.
Only after explicit owner approval may changes be committed, pushed or merged into
`main`, which is the intended production Pages source. No deployment is part of this task.

This is internal maintenance documentation, excluded from the Jekyll site; a public
GitHub repository can still expose its source. It is not a compliance guarantee.
