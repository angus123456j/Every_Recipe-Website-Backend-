# Debugging Checklist: Why Signup Works for You But Not Your Friend

## 1. CORS Origin Check MOST LIKELY ISSUE
- [ ] Are you both accessing the frontend from the SAME URL?
  - You: `http://localhost:3000` or `https://yourdomain.com`?
  - Friend: `http://localhost:3000` or `https://yourdomain.com`?
- [ ] Check Heroku config vars: `CLIENT_URL` must match where your friend is accessing from
- [ ] If friend is on different URL → CORS will block all requests

## 2. Frontend Code Check
- [ ] Is your friend's frontend code updated?
- [ ] Does friend's frontend send `password` with `/auth/confirmSignUp`?
  - Check Network tab → confirmSignUp request → Request Payload
  - Should include: `{username, confirmationcode, password}`

## 3. Browser/Environment Check
- [ ] Same browser? (Chrome vs Safari vs Firefox)
- [ ] Friend using privacy/incognito mode?
- [ ] Cookie blockers/extensions installed?
- [ ] Friend on VPN or different network?

## 4. HTTPS vs HTTP
- [ ] Are you both on HTTPS? (Cookies require secure connection)
- [ ] If friend on HTTP localhost → cookies won't save

## 5. Check Heroku Logs
When friend tries to sign up, look for:
- `"Has password: false"` → Frontend not sending password
- CORS errors → Origin mismatch
- `"Session save error"` → Cookie issue

