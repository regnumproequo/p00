# Local governance review — 9 October 2026

**Ready for code/content review, not website publication.** Work is on
`feature/minimal-governance`. No identity or address was inferred from Git metadata.

## Changes

| Files | Change |
| --- | --- |
| `impressum.html`, `datenschutz.html` | German legal notices with supplied provider/contact details. Privacy notice includes the verified WEB.DE provider and confirmed email practice; visitor-facing placeholders and internal review notices removed. No liability boilerplate. |
| `_includes/legal-footer.html`, `assets/governance.css` | Shared static legal navigation, dark styling, visible focus, reduced-motion support. |
| `index.html` | Footer, privacy-friendly referrer policy, correct English document language. |
| All five `notebooks/*.ipynb` and `output/*.html` | Local Plotly, persistent legal navigation; headings and keyboard scrolling where missing. Plot data/layout/configuration preserved. |
| `assets/vendor/plotly-4.1.1.min.js`, `LICENSE-plotly.txt`, `README.md` | Existing Plotly version hosted locally, documented diagnostic-storage patch, license and checksums. |
| `scripts/site_export.py` | Shared offline export/postprocessing, repeatable footer updates, version/patch drift checks. |
| `scripts/check_release.py`, `tests/test_site.py` | Explicit public/internal review check and five automated structural/privacy regression test groups. |
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
  The owner confirmed direct use of the WEB.DE mailbox without forwarding or
  synchronization to another provider, and deletion once enquiries are no longer
  needed. Provider details were checked against the
  [WEB.DE Impressum](https://web.de/impressum/) and
  [privacy notice](https://web.de/datenschutz/). WEB.DE describes German mailbox
  storage but also allows international transfers in its general privacy terms;
  the public notice reflects this without guaranteeing exclusively German processing.
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
- **Release:** public placeholders and review notices have been resolved or moved
  to internal documentation. Resolve the remaining account-specific hosting item,
  run `python scripts/check_release.py`, and obtain explicit owner approval. The
  check still fails intentionally for that internal item. It is a local review aid, not an enforced
  GitHub gate. `noindex` is not access control. These drafts are not a legal guarantee.

## Latest follow-up: privacy text and export repair

Both legal pages now contain completed contact information without visitor-facing
draft commentary. The privacy notice retains purpose-based deletion criteria;
no fixed mailbox or Pages log-retention duration was invented. GitHub's published
Terms identify GitHub, Inc.; its general privacy notice also identifies GitHub B.V.
The notice describes the published hosting/transfers information without asserting
an account-specific DPA or a particular controller/processor allocation.

<!-- release-review-required: Personal account under standard GitHub terms confirmed. Clarify Pages visitor-data controller/processor roles and, if applicable, how an Article 28 agreement is concluded for this account. -->

This account-specific hosting question remains a publication blocker requiring
review of the actual account agreements or clarification from GitHub. It has been
moved out of the public notice, not marked resolved. The local release check also
reads this internal marker. Remove it only after recording the review outcome.

### Hosting recheck before committing

The owner authorized the hosting review and committing/pushing this feature branch.
The published GitHub Terms of Service expressly cover Pages; the privacy statement
describes GitHub as controller for its own processing, and Pages documentation
links its visitor-IP security logging to that statement. This supports describing
GitHub's own security processing, but does not settle its role for all hosting
operations. The published DPA forms part of a Customer Agreement and defines
Online Services by reference to a written, executed agreement. Its availability
alone does not establish incorporation into this account's contract.

Sources rechecked: [Terms of Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service),
[privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement),
[Pages data collection](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection),
and [DPA](https://github.com/customer-terms/github-data-protection-agreement).
The owner confirmed this is a personal account under the standard GitHub terms,
not an employer/university account or a separate Enterprise/customer agreement.
The applicable published standard terms have therefore been identified; no
account-specific DPA was supplied or established by this review. This does not
prove either that an Article 28 agreement is unnecessary or that one is absent.
The reviewed documents do not settle the role allocation for all Pages visitor
processing. To resolve that remaining question, ask GitHub through its
[privacy support form](https://support.github.com/contact/privacy):
For this account's custom-domain Pages hosting, which entity and terms apply,
which visitor-data operations are performed as controller or processor, and,
if processing on the operator's behalf occurs, how is an Article 28 agreement
concluded? Record the answer before removing the review marker. No request has
been sent to GitHub and no account settings were changed.

The five tests pass with `.venv/Scripts/python.exe`, and footer regeneration is
current. The system Python lacks Plotly; use the existing project environment.
The release check remains blocked pending this evidence, independently of the
owner's authorization to commit and push code for review.

The Bundestag and SWIFT notebooks' export cells again call the shared writer and
use `include_plotlyjs=False`. Their newer figure/layout source and saved notebook
outputs are preserved. Existing `output/*.html` files are unchanged; regenerating
the Bundestag page will use the owner's newer sidebar layout, which differs from
the existing draggable export. No older chart implementation was restored.

Follow-up validation: five automated check groups passed, including the release
check's handling of an unresolved internal item after public draft markers are
removed. All five notebooks were executed before and after the repair in isolated
copies; figure/layout JSON is identical and saved outputs/non-export source are
unchanged. Regenerated pages retain local dependencies and legal navigation.
All eight pages of the isolated regenerated site passed headless Chrome checks
at 1280px and 390px, including rendering, keyboard focus and basic plot API
interactions, with zero third-party requests, cookies or browser-storage accesses.
The release check intentionally remains blocked by the account-specific GitHub
review item above. No commit, push, merge or deployment occurred in this follow-up.

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
