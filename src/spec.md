# Specification

## Summary
**Goal:** Fix runtime errors when playing or exporting audio in Mastering Studio by making the playback and export chains work with both mono and stereo source files.

**Planned changes:**
- Update the realtime playback audio graph to detect the loaded buffer’s channel count and avoid creating/using stereo-width splitter/merger nodes when the source is mono.
- Update the offline/export rendering chain to match the source buffer’s channel count and bypass stereo-only processing paths for mono sources.
- Ensure stereo sources continue to use stereo-width processing when enabled by the preset, without runtime errors.

**User-visible outcome:** Users can press Play and export mastered WAV files successfully for both mono (1-channel) and stereo (2-channel) audio without runtime exceptions or console errors.
