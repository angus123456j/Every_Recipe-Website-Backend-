# Frontend Cookie Configuration Fix

## The Problem
The backend is saving sessions correctly, but the browser isn't sending the session cookie back on subsequent requests. This is why `checkAuthStatus` shows `userinfo undefined`.

## The Solution: Frontend Must Send Credentials

### For Fetch API:
```javascript
fetch('https://your-backend.herokuapp.com/auth/confirmSignUp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // ← THIS IS CRITICAL!
  body: JSON.stringify({
    username: '...',
    confirmationcode: '...',
    password: '...'
  })
});
```

### For Axios:
```javascript
axios.post('https://your-backend.herokuapp.com/auth/confirmSignUp', {
  username: '...',
  confirmationcode: '...',
  password: '...'
}, {
  withCredentials: true // ← THIS IS CRITICAL!
});
```

### For All API Calls:
**EVERY request to your backend must include credentials:**
- Login: `credentials: 'include'`
- Check Auth Status: `credentials: 'include'`
- Create Recipe: `credentials: 'include'`
- ALL requests!

## Browser Settings
- Make sure third-party cookies are NOT blocked
- Chrome: Settings → Privacy → Cookies → Allow all cookies (or at least allow your domain)
- Safari: Preferences → Privacy → Uncheck "Prevent cross-site tracking"

## Testing
1. Open DevTools → Network tab
2. Make a request to your backend
3. Check the Request Headers → Should see `Cookie: connect.sid=...`
4. If no Cookie header → Frontend isn't sending credentials!

