# Local governance review — 9 October 2026

**Ready for code/content review, not website publication.** Work is on
`feature/minimal-governance`. No identity or address was inferred from Git metadata.

## Changes

| Files | Change |
| --- | --- |
| `impressum.html`, `datenschutz.html` | German legal notices; Impressum simplified to supplied provider/contact details, privacy notice still contains draft placeholders and review notices. No liability boilerplate. |
| `_includes/legal-footer.html`, `assets/governance.css` | Shared static legal navigation, dark styling, visible focus, reduced-motion support. |
| `index.html` | Footer, privacy-friendly referrer policy, correct English document language. |
| All five `notebooks/*.ipynb` and `output/*.html` | Local Plotly, persistent legal navigation; headings and keyboard scrolling where missing. Plot data/layout/configuration preserved. |
| `assets/vendor/plotly-4.1.1.min.js`, `LICENSE-plotly.txt`, `README.md` | Existing Plotly version hosted locally, documented diagnostic-storage patch, license and checksums. |
| `scripts/site_export.py` | Shared offline export/postprocessing, repeatable footer updates, version/patch drift checks. |
| `scripts/check_release.py`, `tests/test_site.py` | Explicit draft check and four automated structural/privacy regression tests. |
| `GOVERNANCE.md`, `README.md`, `.gitignore`, `_config.yml` | Maintenance instructions; ignore local verification artifacts; exclude internal material from Jekyll output. No hosting-account or workflow changes. |

## Initial audit and privacy result

Architecture: one landing page using `style.css`, five standalone HTML plots with
inline styles, five generating notebooks, and `assets/bundestag_sankey.js` embedded
by its notebook. No framework, server, deployment workflow, `_config.yml` or
`.nojekyll` existed. `CNAME` contains `phey.app`. `requirements.txt` is the pinned
Python/Jupyter development environment, not browser dependencies.

Four plots requested `cdn.plot.ly/plotly-4.1.1.min.js`; the SWIFT page embedded the
same library. The full bundle contains optional persistent diagnostic settings
and unused map/API endpoints. The current traces are scatter, Sankey and a 3D
surface, not maps. No site-written cookies/storage, tracking, analytics, remote
fonts, forms, newsletters, videos, widgets or third-party API calls were found.
Source links lead to Bundeswahlleiterin, Tagesschau and Wahlrecht.de; notebook
research links are citations, not browser integrations. No sales, payments,
sponsorship, affiliate links, donations or paid-service offers were found.

The implementation shares a local Plotly bundle and replaces its three
`window.localStorage` references with in-memory objects. Existing figures and
controls are preserved. No new framework, consent platform or runtime dependency.
All 16 local browser scenarios showed **zero external requests, cookies or
JavaScript cookie/localStorage/sessionStorage accesses**. Built-in HTTP caching
remains. There is no identified consent-requiring optional terminal access under
[§ 25 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html); no banner is added.
Review again before adding maps, analytics, embeds or persistent preferences.

GitHub Pages still logs visitor IP addresses for security, including visitors
without GitHub accounts ([Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection)).
The [GitHub privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)
names GitHub, Inc. and GitHub B.V., international processing, SCCs and DPF, but
does not give a Pages-specific log-retention period. Its general descriptions do
not establish this account's contract, roles or safeguards. The published
[DPA](https://github.com/customer-terms/github-data-protection-agreement) forms
part of a customer agreement; its applicability was not established. These are
explicit review items in the privacy draft, not invented assurances.

## Legal assessment and publication blockers

- **Identity:** provider name, street address and contact email have been supplied
  in both notices; retain them and confirm their accuracy before publication.
  The privacy notice still contains draft markers. Confirm the email provider, recipients,
  possible transfers and deletion practice. Nothing personal has been published.
- **Impressum:** a public scientific site is not safely assumed to be exclusively
  personal/family use. The draft follows [§ 18(1) MStV](https://www.gesetze-bayern.de/Content/Document/MStV-18).
  [§ 5 DDG](https://www.gesetze-im-internet.de/ddg/__5.html) depends on the actual
  business/economic context; non-commercial labeling alone is not decisive.
  If applicable, check whether the contact channel meets the rapid/direct
  communication requirement and whether any further provider details apply.
- **Editorial assumption:** at the owner's instruction, the current personal
  academic projects and data visualizations are provisionally treated as not
  journalistic-editorial under § 18(2) MStV. The current election page presents
  a visualization with methodological notes and source citations; the visible
  content review found no clear contradiction to that assumption. The Impressum's
  legal assessments, review notices and editorial-responsibility placeholder
  have been removed. Reassess if actual content or editorial activity changes;
  flag a contradiction for review before omitting required provider information.
- **Privacy:** the draft covers controller, hosting/access data, purposes,
  Article 6(1)(f) interests, recipients/transfers, retention uncertainty, email,
  browser technologies, rights/objection and complaints. Resolve the hosting
  items above before release. No individual research records or indirect
  collection were identified in the aggregate/synthetic datasets; Article 14
  needs reassessment if that changes. [Articles 12–14 guidance](https://www.datenschutzkonferenz-online.de/media/kp/dsk_kpnr_10.pdf).
- **Accessibility:** no covered consumer service or contracting flow was found
  under [§§ 1–2 BFSG](https://www.gesetze-im-internet.de/bfsg/BJNR297010021.html).
  On the stated private operation, no public-body role is established either.
  A formal statutory accessibility declaration is not indicated by these facts;
  reassess for commercial/consumer services or institutional operation.
- **Release:** replace placeholders, resolve/remove review notices, run
  `python scripts/check_release.py`, and obtain explicit owner approval. The
  check currently fails intentionally. It is a local review aid, not an enforced
  GitHub gate. `noindex` is not access control. These drafts are not a legal guarantee.

## Verification and limits

- **Pass:** four automated test groups covering all eight pages, local references,
  footer links, titles/languages/headings, local Plotly, exact vendor patch,
  notebook wiring, CNAME and internal-document exclusions. Footer refresh is idempotent.
- **Pass:** executed all code cells of all five notebooks in a separate copy,
  suppressing only notebook display calls. Regenerated data/layout/configuration
  match existing exports and the original user-modified baseline; local assets,
  styling and legal navigation survive regeneration. User notebook outputs untouched.
- **Pass:** headless Chrome, fresh profile, eight pages at 1280px and 390px.
  No page overflow, JavaScript exceptions, missing referenced resources or
  third-party requests. Plotly rendered all plots, including WebGL; camera,
  Sankey node-position and axis API updates succeeded. Real Tab input reaches
  legal links with visible focus. Screenshots reviewed for mobile legal content
  and election chart plus desktop 3D plot. Optional absent favicon is excluded
  from resource failures.
- **Pass:** new footer/link/warning text contrast against their backgrounds is
  12.16:1 / 10.58:1 / 13.95:1. Semantic main/footer/navigation, meaningful links,
  document languages and headings checked. No informative image elements need alt text.
- **Pass:** HTTPS returns 200 with certificate validation; HTTP redirects to HTTPS.
  No Set-Cookie response header observed. DNS resolves to GitHub Pages' four
  documented IPv4 addresses. `CNAME` unchanged. Public repository API confirms
  `has_pages: true`, default branch `main` and public visibility.
- **Pass with limits:** obvious-secret scan of tracked files and 89 unique blobs
  across all 48 locally reachable commits found no candidates. Additional checks
  covered 30 historical notebook versions' source/output assignments. No values
  were printed. This is a heuristic review, not proof that no secret exists.
- **Dependency review:** no version upgrades; the existing Python pins remain.
  Upstream [security guidance](https://github.com/plotly/plotly.js/blob/master/SECURITY.md)
  reviewed; the [prototype-pollution advisory](https://github.com/advisories/GHSA-wjc4-73q6-gv3m)
  affects versions below 2.25.2, not the installed 4.1.1. This was not a full
  transitive CVE audit. Keep data inputs trusted and review future updates.
- **Not verified:** authenticated Pages source/build/HTTPS settings (Pages API
  returned 404 without authorization), domain ownership verification, account
  2FA/protections, Jekyll build (Ruby/Bundler absent), other browsers, physical
  touch devices, screen-reader equivalence or every Plotly mode. Headless tests
  are local; production still has the old implementation. Recommend checking 2FA,
  Pages source `main`, HTTPS enforcement and domain verification before release.
- Initial browser setup was unavailable; isolated local Chrome provided the
  fallback. The first focus assertion used programmatic focus and was corrected
  to real Tab input; all 16 scenarios then passed. No product defect was hidden.

## Git state at the initial handoff

The implementation was left on `feature/minimal-governance`, with `main` at
`c6dfd8a953e8e64df60a1c89aa60d997048d4cd4`. The original staged parabola notebook
and HTML changes were preserved byte-for-byte in the index; governance edits
were unstaged and new files untracked. No commit, stash, reset, push, merge,
account-setting change, deployment or publication occurred during implementation.
Local test scripts, JSON results and screenshots remain in ignored
`.governance-review/` for inspection.

The owner subsequently authorized adding, committing and pushing the feature
branch, including the existing parabola layout changes. This authorization does
not include merging into `main` or deploying the unresolved legal drafts.
