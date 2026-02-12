# Specification

## Summary
**Goal:** Hide the PWA install/download button once the app is installed, while keeping it available when installation is possible and not yet completed.

**Planned changes:**
- Update the existing install/download entry point to detect when the app is already installed (e.g., running in standalone mode) and avoid rendering the button in that state, including on subsequent visits.
- Listen for the browser `appinstalled` event so the install/download button disappears immediately after a successful installation (no refresh required).
- Ensure the install/download entry point remains visible when installation is unavailable or the user dismisses the prompt.
- Add/extend i18n strings (pt-BR and en) for the install/download entry point label and any helper text, sourcing all user-visible text from the i18n dictionary.

**User-visible outcome:** Users see an “Install app” (or pt-BR equivalent) option only when the app is not installed; after installation it disappears immediately and stays hidden on later visits without flicker.
