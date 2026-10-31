# Landing-page assets

All runtime assets are local. No remote fonts, image embeds, analytics, cookies,
or browser storage are required by the landing page.

## NASA imagery

- `earth-map.png`: NASA/Goddard Space Flight Center Scientific Visualization
  Studio, [Blue Marble](https://svs.gsfc.nasa.gov/2915/).
  [Original 2048 × 1024 texture](https://svs.gsfc.nasa.gov/vis/a000000/a002900/a002915/bluemarble-2048.png).
- `earth-poster.jpg`: a 1000 × 1000 JPEG of the
  [Eastern Hemisphere image](https://svs.gsfc.nasa.gov/vis/a000000/a002900/a002915/bluemarble-east-4096.png)
  from the same source. This is the fallback when JavaScript or WebGL is unavailable.
- Blue Marble data credit: Reto Stöckli (NASA/GSFC), NASA's Earth Observatory.
  The decorative globe uses historical imagery, not live observations.
- `angkor-ruins.jpg`: Angkor, Cambodia, acquired by Terra/ASTER on February 17, 2004.
  Image by Jesse Allen, NASA Earth Observatory; data courtesy of
  NASA/GSFC/METI/ERSDAC/JAROS and the U.S./Japan ASTER Science Team.
  [Source and caption](https://science.nasa.gov/earth/earth-observatory/angkor-ruins-4995/).
  [NASA image](https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/4000/4995/aster_angorwat_17feb04_15m.jpg).
  Stored locally as the NASA-served 1280 × 1280 JPEG; the teaser uses the existing
  centered landscape crop in CSS.
- `river-delta.jpg` (previous teaser): NASA astronaut photography, ISS063-E-002730, April 23, 2020.
  [Source and caption](https://www.nasa.gov/image-article/rhine-meuse-scheldt-river-delta-netherlands/).
  [Original photo](https://www.nasa.gov/wp-content/uploads/2023/03/iss063e002730.jpg).
  Re-encoded as JPEG at its original 1041 × 694 dimensions.

The sources are credited on the landing page. No endorsement is implied.

## Project previews

These JPEGs were captured from the existing notebook-generated HTML exports,
using their local Plotly renderer at 1200 × 828 pixels. They are static previews,
not independent implementations of the plots. Clicking a preview opens its
original interactive export.

| Preview | Source export in `output/` |
| --- | --- |
| `rivers.jpg` | `20261023_german_rivers_sankey.html` |
| `gravity.jpg` | `20261018_gravity.html` |
| `tesseract.jpg` | `20261017_tesseract.html` |
| `elections.jpg` | `20261008_bundestagswahl_sankey.html` |
| `manam.jpg` | `20261027_typology_3d.html` |
| `matterhorn.jpg` | `20261004_parabola_3d.html` (now Matterhorn terrain; historic URL retained) |
| `line-plot.jpg` | `20261003_plot.html` |
| `angkor-water.jpg` | `20261031_angkor_water_system.html` |
| `angkor-hydraulic-city.jpg` | `20261031_angkor_hydraulic_city.html` |

To refresh a preview, first run its source notebook, serve the repository root
locally, open the export, and capture the returned data URL from:

```js
await Plotly.toImage(document.querySelector('.plotly-graph-div'), {
  format: 'jpeg', width: 1200, height: 828, scale: 1
});
```

Do not recreate chart geometry in landing-page scripts or patch generated plots.
The collection count and text in `index.html` should be updated when projects
are added or removed.

`mark.svg` and `stars.svg` are original decorative site graphics. The page
layout lives in `index.html` and `assets/landing.css`; the navigation and
decorative globe live in `assets/landing.js`. The existing `style.css` continues
to style the legal pages.
