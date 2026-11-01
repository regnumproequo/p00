
# p00 — Project Instructions

## Notebook-first plot workflow

- Jupyter notebooks in `notebooks/` are the source of truth for all plots.
- Make all plot-specific changes in the relevant notebook, including data processing, geometry, styling, labels, hover behavior, controls, and exported page layout.
- Keep plot-specific browser callbacks and export templates in the notebook so the implementation remains transparent and available on GitHub.
- Running the notebook must generate the finished HTML export in `output/`, which phey.app uses.
- Never manually patch generated plot HTML or implement plot changes exclusively in external JavaScript files.
- Shared website infrastructure, CSS, navigation, and legal components may be maintained separately.
- Before publishing, regenerate the export from its notebook and verify that the visualization and its interactions work correctly.

## Project structure

- Treat the repository root as the base directory for all file paths.
- Keep notebooks in `notebooks/` and generated HTML files in `output/`.
- Never create nested directories such as `notebooks/notebooks/` or `notebooks/output/`.
- Preserve existing file naming conventions and directory structure.
- When editing a notebook on disk, warn the user to reload its open VS Code tab before running or saving it, to prevent conflicting versions.

## Git workflow

- Work directly on `main`. Do not create or switch branches unless explicitly requested.
- Before committing, verify that the notebook source and its corresponding generated HTML export are consistent.
- When asked to commit a visualization, include both its notebook and generated export.
- Never commit or push without user authorization.
