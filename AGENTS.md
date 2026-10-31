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

## Agent tool usage and editing

- When a file path is known, read that file directly. Do not search for it.
- For questions about an existing file, inspect its actual contents before answering.
- Use filesystem search only when the relevant file or location is unknown.
- Use only tools and parameters available in the current harness.
- If a tool call fails, inspect the error and change strategy rather than repeating the same call.
- For Jupyter notebooks, prefer notebook-aware reading and editing tools over directly rewriting .ipynb JSON.
- Before modifying an open notebook, preserve unsaved editor changes and avoid conflicting writes to disk.
- Make the smallest change necessary to fulfill the request. Preserve unrelated code and outputs.
- After editing, verify the affected code and report what was changed and what was actually tested.
- Never overwrite, delete, reset, commit, or push unrelated changes without explicit authorization.
  