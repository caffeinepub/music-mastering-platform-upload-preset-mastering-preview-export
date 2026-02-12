# Specification

## Summary
**Goal:** Add app-wide internationalization with Portuguese (pt-BR) as the default language and a runtime switch to English (en) across all user-facing UI.

**Planned changes:**
- Introduce an i18n system with a global language provider/hook to manage the active locale across all pages and components.
- Add a language switch control in the global header (Landing and Studio) that clearly indicates the current language and updates text immediately.
- Localize all user-facing strings (Landing, Mastering Studio UI, Help/FAQ, authentication UI, profile setup modal, project list panel, toast/error messages, and empty/error states).
- Persist the selected language across refreshes (e.g., local storage or a persisted URL parameter).
- Localize preset display strings (name/description) without changing preset keys/identifiers or breaking existing project rendering.
- Use active locale for date/time formatting in the projects list (pt-BR vs en-US behavior).

**User-visible outcome:** The app loads in Portuguese by default, and users can switch between Portuguese and English from the header without reloading; the choice persists and all UI text (including toasts and preset labels) updates to the selected language.
