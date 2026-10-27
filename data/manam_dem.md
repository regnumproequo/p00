# Manam elevation and bathymetry crop

`manam_dem.npz` is the unresampled source crop used by
[`20261027_typology_3d.ipynb`](../notebooks/20261027_typology_3d.ipynb). The archive contains:

- `elevation_m`: 521 x 521 int16 elevations in metres, including offshore depths.
- `latitude`: WGS84 post latitudes, north to south.
- `longitude`: WGS84 post longitudes, west to east.
- `provenance`: JSON with source identity, URLs, access date, attribution, and
  the SHA-256 hashes of both source tiles.

Source: adjacent Mapzen Elevation Tiles (Skadi) HGT tiles `S05E144` and
`S05E145`, distributed as public objects on AWS. Mapzen's global terrain data
combine SRTM land elevations with ETOPO1 ocean bathymetry. The HGT tiles are
sampled at 1 arc-second, but ETOPO1 bathymetry has only 1 arc-minute source
resolution; finer sampling does not add seafloor detail. Set `REFRESH_DATA = True`
in the notebook to download both source tiles and rebuild the archive. Full
tiles are cached in ignored `.cache/terrain/`; normal runs use this archive offline.

The notebook plots a 16 x 16 km region bilinearly sampled to 601 x 601 points
for smoother display; this does not add detail beyond the source data.
Its blue overlay shows the 0 m sea-level surface above the bathymetry. This is
not a nautical chart or a volcanic hazard map.

SRTM data courtesy of the U.S. Geological Survey. Global ETOPO1 terrain data
courtesy of the U.S. National Oceanic and Atmospheric Administration. See
[Mapzen's terrain data-source notes](https://github.com/tilezen/joerd/blob/master/docs/data-sources.md)
and [attribution](https://github.com/tilezen/joerd/blob/master/docs/attribution.md).
