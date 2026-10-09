# Plotly.js 4.1.1

Source: the bundle shipped with the existing pinned `plotly==7.1.0` Python
installation (`plotly.offline.get_plotlyjs()`), also matching the previously
embedded SWIFT export. No version upgrade or additional runtime dependency.

Upstream SHA-256 (UTF-8, LF):
`3b6e15d45dbb7fca5bd2094291e961ddc5472cd887009e6009a56dab668d721f`

Served SHA-256 (UTF-8, LF):
`971852e9eeac801316e7e2ae88bea9ae2386c76f2242068aac56e2bb891aae8a`

Privacy patch: replace exactly three `window.localStorage` references with `({})`
and prepend an explanatory comment. These references belong to optional debug
and deprecation preferences. Diagnostics use in-memory objects; persistent
preferences are no longer consulted or written. Plot code is otherwise unchanged.
`site_export.py` applies this reproducibly and fails on version/count drift.

The full bundle supports the existing 3D surface and Sankeys. It also contains
unused map/API URLs: new map/geo traces require a fresh network/privacy review.
The current plots do not activate these services. Keep upstream license notices.

MIT license: [LICENSE-plotly.txt](LICENSE-plotly.txt), retrieved from the
[versioned upstream source](https://github.com/plotly/plotly.js/blob/v4.1.1/LICENSE).
Review upstream security advisories and the patch before any version update;
rerun exports and browser checks. Do not silently replace the bundle with a CDN.
