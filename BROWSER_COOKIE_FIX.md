# Browser Cookie Settings Fix Guide

## The Problem
Your backend is working correctly, but the browser is blocking cookies. This is why `Cookies received: undefined` appears in the logs.

## Quick Fixes by Browser

### Chrome / Chromium Browsers

#### Option 1: Allow All Cookies (Recommended for Testing)
1. Open Chrome Settings (`chrome://settings/` or Settings → Privacy and security)
2. Click **"Cookies and other site data"**
3. Select **"Allow all cookies"**
4. **Refresh your website** and try again

#### Option 2: Allow Specific Sites
1. Chrome Settings → Privacy and security → Cookies and other site data
2. Click **"Sites that can always use cookies"**
3. Click **"Add"**
4. Add your backend domain: `https://every-recipe-53da6eac62e6.herokuapp.com`
5. Also add your frontend domain (e.g., `https://yourfrontend.com` or `http://localhost:3000`)
6. Click **"Add"**
7. **Refresh and try again**

#### Option 3: Disable Third-Party Cookie Blocking (Temporary)
1. Chrome Settings → Privacy and security → Cookies and other site data
2. Turn **OFF** "Block third-party cookies"
3. **Refresh and try again**
4. Note: This is less secure, but needed for cross-site cookies

### Safari (Mac/iOS)

#### Mac Safari:
1. Open Safari → **Preferences** (⌘,)
2. Go to **"Privacy"** tab
3. **Uncheck** "Prevent cross-site tracking"
4. **Refresh your website** and try again

#### iOS Safari (iPhone/iPad):
1. Open **Settings** app
2. Scroll to **"Safari"**
3. Under "Privacy & Security":
   - Turn **OFF** "Prevent Cross-Site Tracking"
   - Turn **OFF** "Block All Cookies" (if enabled)
4. **Close Safari completely** and reopen
5. Try logging in again

### Firefox

1. Open Firefox Settings (about:preferences#privacy)
2. Under **"Cookies and Site Data"**:
   - Select **"Accept cookies and site data from websites"**
   - Uncheck **"Delete cookies and site data when Firefox is closed"** (if you want sessions to persist)
3. Click **"Exceptions"** button
4. Add your backend domain: `https://every-recipe-53da6eac62e6.herokuapp.com`
5. Select **"Allow"**
6. **Refresh and try again**

### Edge

1. Open Edge Settings (`edge://settings/privacy`)
2. Under **"Cookies and site permissions"**:
   - Click **"Cookies and site data"**
   - Select **"Allow all cookies"** (or "Don't block cookies")
3. **Refresh and try again**

## Common Issues

### Issue: "Prevent Cross-Site Tracking" is ON
**Solution:** Turn it OFF (required for cross-origin cookies with `SameSite=None`)

### Issue: Third-Party Cookies Blocked
**Solution:** Allow third-party cookies for your domain

### Issue: Private/Incognito Mode
**Solution:** Use regular browsing mode (private mode often blocks cookies)

### Issue: Browser Extensions
**Solution:** Disable ad blockers or privacy extensions temporarily to test

## Testing

After changing settings:

1. **Close the browser completely** (quit all windows)
2. **Reopen the browser**
3. **Clear browser cache** (optional but recommended):
   - Chrome: Settings → Privacy → Clear browsing data → Cached images and files
4. **Go to your website**
5. **Open DevTools** (F12) → Network tab
6. **Try logging in**
7. **Check the request headers** → Should see `Cookie: connect.sid=...`

## Why This Happens

When your frontend and backend are on **different domains** (cross-origin):
- Frontend: `https://yourfrontend.com` or `http://localhost:3000`
- Backend: `https://every-recipe-53da6eac62e6.herokuapp.com`

Browsers treat this as **cross-site** cookies, which requires:
1. `SameSite=None` (backend has this)
2. `Secure=true` (backend has this)
3. **Browser must allow third-party/cross-site cookies** (this is the issue)

Modern browsers block third-party cookies by default for privacy. You need to explicitly allow them for your domains.

## Quick Test

Try logging in with these settings changed. If cookies still don't work:
1. Check browser console for errors
2. Try a different browser (Chrome vs Safari vs Firefox)
3. Try on a different device
4. Check if your network/firewall is blocking cookies

