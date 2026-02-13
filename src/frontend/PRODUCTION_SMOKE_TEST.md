# Production Smoke Test Checklist

Run this checklist after every production deployment to verify core functionality.

## Test Environment

- **URL**: [Production canister URL]
- **Browser**: Chrome/Firefox/Safari (test on primary browser)
- **Network**: IC Mainnet
- **Date**: [Test date]
- **Tester**: [Your name]
- **Version**: [App version/draft number]

## Pre-Test Setup

1. Open browser DevTools (F12)
2. Go to Console tab
3. Clear console logs
4. Go to Network tab
5. Enable "Preserve log"

## Test Cases

### 1. Landing Page Load

**Steps:**
1. Navigate to production URL
2. Wait for page to fully load

**Expected Results:**
- [ ] Page loads within 3 seconds
- [ ] No console errors (red messages)
- [ ] Header with logo and navigation visible
- [ ] Hero section with title and CTA visible
- [ ] Footer with attribution link visible
- [ ] Language switcher works (toggle between PT/EN)

**On Failure:**
- Screenshot the page
- Copy all console errors
- Check Network tab for failed requests
- Note: Error type, error message, stack trace

---

### 2. Internet Identity Authentication

**Steps:**
1. Click "Login" button in header
2. Complete Internet Identity flow
3. Return to application
4. Verify logged-in state
5. Click "Logout" button
6. Verify logged-out state

**Expected Results:**
- [ ] Login button triggers II authentication
- [ ] II window opens successfully
- [ ] After authentication, user returns to app
- [ ] Login button changes to "Logout"
- [ ] User profile is loaded (or profile setup modal appears for new users)
- [ ] Logout clears session and returns to landing page
- [ ] No console errors during auth flow

**On Failure:**
- Note which step failed
- Copy console errors
- Check Network tab for failed API calls
- Screenshot error state

---

### 3. Profile Setup (First-Time Users Only)

**Steps:**
1. If profile setup modal appears after login
2. Enter a name
3. Click save

**Expected Results:**
- [ ] Modal appears for new users
- [ ] Name input accepts text
- [ ] Save button works
- [ ] Modal closes after save
- [ ] User can proceed to studio

**On Failure:**
- Screenshot modal
- Copy console errors
- Note validation issues

---

### 4. Studio Navigation

**Steps:**
1. After login, navigate to `/studio` route
2. Verify studio page loads

**Expected Results:**
- [ ] Studio page loads successfully
- [ ] Page title "Mastering Studio" visible
- [ ] Upload section visible
- [ ] No console errors
- [ ] Projects panel visible on right side

**On Failure:**
- Check if route exists
- Copy console errors
- Screenshot blank/error state

---

### 5. Audio Upload

**Steps:**
1. Click "Upload Audio" button
2. Select a test WAV or MP3 file (< 50MB)
3. Wait for upload to complete

**Expected Results:**
- [ ] File picker opens
- [ ] File uploads successfully
- [ ] Audio metadata displays (duration, sample rate, channels)
- [ ] Success toast appears
- [ ] No console errors
- [ ] Preset selection section appears

**Test Files:**
- Use a known-good WAV file (e.g., 44.1kHz, stereo, < 5MB)
- Test with both WAV and MP3 formats

**On Failure:**
- Note file format and size
- Copy console errors (especially Web Audio API errors)
- Check Network tab for upload failures
- Screenshot error message

---

### 6. Preset Application

**Steps:**
1. After audio upload, click a preset (e.g., "Clean")
2. Wait for preset to apply
3. Try a different preset (e.g., "Warm")

**Expected Results:**
- [ ] Preset button highlights when selected
- [ ] Success toast shows "Preset applied: [name]"
- [ ] No console errors
- [ ] Playback controls appear
- [ ] New project entry appears in Projects panel

**On Failure:**
- Note which preset failed
- Copy console errors
- Check for Web Audio API errors
- Screenshot error state

---

### 7. Audio Playback

**Steps:**
1. Click "Original" playback mode
2. Click "Play" button
3. Verify audio plays
4. Click "Pause" button
5. Switch to "Mastered" mode
6. Click "Play" again

**Expected Results:**
- [ ] Original audio plays
- [ ] Pause stops playback
- [ ] Mastered audio plays with preset applied
- [ ] Playback mode buttons toggle correctly
- [ ] No console errors during playback
- [ ] No audio glitches or distortion

**On Failure:**
- Note which mode failed
- Copy console errors
- Check for Web Audio API errors
- Note if audio plays but with issues (glitches, silence, etc.)

---

### 8. WAV Export

**Steps:**
1. After applying a preset, click "Export WAV" button
2. Wait for export progress to complete
3. Verify file downloads

**Expected Results:**
- [ ] Export button shows progress
- [ ] Progress bar animates from 0% to 100%
- [ ] WAV file downloads automatically
- [ ] Success toast appears
- [ ] Downloaded file has correct naming: `[original]_mastered.wav`
- [ ] No console errors during export

**Test Downloaded File:**
- [ ] File size is reasonable (not 0 bytes)
- [ ] File opens in audio player
- [ ] Audio plays correctly

**On Failure:**
- Copy console errors
- Note at what percentage export failed
- Check if file downloaded but is corrupted
- Screenshot error message

---

### 9. Projects Panel Update

**Steps:**
1. After creating projects (via preset application)
2. Check Projects panel on right side
3. Verify project entries appear

**Expected Results:**
- [ ] Projects panel shows list of projects
- [ ] Each project shows: track name, preset, date
- [ ] Date formatting is correct for locale
- [ ] Preset names are localized
- [ ] Delete button works (if tested)
- [ ] No console errors

**On Failure:**
- Screenshot projects panel
- Copy console errors
- Check Network tab for API failures
- Note if data is missing or incorrect

---

### 10. Reference Track (Optional)

**Steps:**
1. Upload a reference track
2. Enable loudness matching
3. Switch to "Reference" playback mode
4. Play reference audio

**Expected Results:**
- [ ] Reference file uploads successfully
- [ ] Loudness matching toggle works
- [ ] Reference playback mode available
- [ ] Reference audio plays
- [ ] No console errors

**On Failure:**
- Copy console errors
- Note which step failed

---

## Post-Test Summary

### Overall Result
- [ ] **PASS** - All critical tests passed
- [ ] **PASS WITH WARNINGS** - Minor issues found
- [ ] **FAIL** - Critical issues found, rollback recommended

### Issues Found

| Test Case | Severity | Description | Screenshot/Logs |
|-----------|----------|-------------|-----------------|
| | | | |

### Console Errors Summary

