# Project instructions

## Notebook-first plot workflow

- The Jupyter notebooks in `notebooks/` are the source of truth for every plot.
- Make all plot changes in the relevant notebook, including data processing,
  geometry, styling, labels, hover behavior, controls, and exported page layout.
- Keep plot-specific browser callbacks and export templates in the notebook so
  the implementation is transparent and available to readers on GitHub.
- Running the notebook must generate the finished plot export in `output/`,
  which the website at phey.app uses. Never manually patch generated HTML or
  implement a plot change only in an external JavaScript file.
- Regenerate exports by running the updated notebook. Before committing,
  verify that a fresh run reproduces the exported plot and its interactions.
- Shared infrastructure such as the Plotly dependency and legal footer may
  remain shared; it must not replace the notebook as the plot's source of truth.
- When editing a notebook on disk, tell the user to reload its open VS Code tab
  before running or saving it, so an older editor copy cannot undo the changes.

## Git workflow

- Work directly on `main`. Keep `main` as the only local and remote branch.
- When asked to commit and push, include the notebook source and its matching
  generated export, and validate them before pushing.
