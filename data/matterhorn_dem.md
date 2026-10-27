# Matterhorn elevation crop

`matterhorn_dem.npz` is the unresampled source crop used by
[`20261004_parabola_3d.ipynb`](../notebooks/20261004_parabola_3d.ipynb).
The historic filename now produces the Matterhorn topography.

Source: [Copernicus DEM GLO-30 on AWS](https://registry.opendata.aws/copernicus-dem/),
2021 release, accessed 25 October 2026. The archive contains:

- `elevation_m`: 164 ? 235 float32 surface elevations, metres relative to EGM2008.
- `latitude`: WGS84 pixel-centre latitudes, north to south.
- `longitude`: WGS84 pixel-centre longitudes, west to east.
- `provenance`: JSON with dataset identity, source URLs, access date, attribution,
  and SHA-256 hashes of the original GeoTIFF tiles.

Source tiles are `Copernicus_DSM_COG_10_N45_00_E007_00_DEM` and
`Copernicus_DSM_COG_10_N46_00_E007_00_DEM`. The notebook reads their georeferencing,
checks the join, and crops them without resampling. Its later plotting step
bilinearly resamples the crop. Set `REFRESH_DATA = True` in that notebook to
rebuild the archive. Full downloads are cached in ignored `.cache/terrain/`.
Normal runs use the archive offline.

The bundled crop and displayed map now cover 5 ? 5 km around the summit.
The notebook bilinearly samples the crop to a 281 ? 281 display grid.

This is a digital surface model, not a survey of the summit. The displayed grid
peaks at roughly 4,330 m; the separate 4,478 m marker is a reference elevation.
The model has not been raised or warped to match it.

Produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence
and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA;
all rights reserved.

[Dataset and licence](https://dataspace.copernicus.eu/explore-data/data-collections/copernicus-contributing-missions/collections-description/COP-DEM).
