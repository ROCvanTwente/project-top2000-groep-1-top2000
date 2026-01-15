# ?? API Configuration Guide

## Quick Start - Change API URL in ONE Place

**To change the API URL for your entire React app:**

1. Open `react/Client/src/config/api.js`
2. Change the `API_BASE_URL` on line 7:
   ```javascript
   export const API_BASE_URL = 'https://localhost:7003/api';
   ```
3. Save the file
4. Restart your dev server (`npm run dev`)

**That's it!** All API calls across the entire app will use the new URL.

---

## ?? File Structure

```
react/Client/
??? src/
?   ??? config/
?   ?   ??? api.js          ? ?? CHANGE API URL HERE
?   ??? App.jsx              ? Imports from api.js
?   ??? components/
?       ??? SongDetail.jsx   ? Imports from api.js
??? .env.example             ?? Optional environment variables
??? vite.config.js
```

---

## ?? How It Works

### Before (Multiple hardcoded URLs ?)
```javascript
// App.jsx
const API_BASE_URL = 'https://localhost:7003/api';

// SongDetail.jsx
const API_BASE_URL = 'https://localhost:7003/api';
```
**Problem:** Need to update 2+ files when URL changes

### After (Single source of truth ?)
```javascript
// api.js
export const API_BASE_URL = 'https://localhost:7003/api';

// App.jsx
import API_BASE_URL from './config/api';

// SongDetail.jsx
import API_BASE_URL from '../config/api';
```
**Solution:** Update ONE file and it changes everywhere!

---

## ?? Environment-Specific URLs (Optional)

For different environments (development, staging, production), you can use environment variables:

### 1. Update `api.js`:
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7003/api';
```

### 2. Create `.env.development`:
```env
VITE_API_BASE_URL=https://localhost:7003/api
```

### 3. Create `.env.production`:
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### 4. Vite automatically loads the right file:
- `npm run dev` ? uses `.env.development`
- `npm run build` ? uses `.env.production`

---

## ?? Available Endpoints

The `api.js` file also exports pre-configured endpoints:

```javascript
import { API_ENDPOINTS } from './config/api';

// Use pre-built endpoints
const response = await fetch(API_ENDPOINTS.songs.list);
const song = await fetch(API_ENDPOINTS.songs.byTitle('bohemian-rhapsody'));
```

**Available endpoints:**
- `API_ENDPOINTS.songs.list` ? `/api/songs`
- `API_ENDPOINTS.songs.byTitle(title)` ? `/api/songs/by-title/{title}`
- `API_ENDPOINTS.songs.byId(id)` ? `/api/songs/{id}`
- `API_ENDPOINTS.songs.history(id)` ? `/api/songs/{id}/history`
- `API_ENDPOINTS.auth.login` ? `/api/auth/login`
- `API_ENDPOINTS.auth.register` ? `/api/auth/register`
- `API_ENDPOINTS.auth.refresh` ? `/api/auth/refresh-token`

---

## ?? Deployment Scenarios

### Local Development
```javascript
// api.js
export const API_BASE_URL = 'https://localhost:7003/api';
```

### Testing on Network
```javascript
// api.js
export const API_BASE_URL = 'https://192.168.1.100:7003/api';
```

### Production
```javascript
// api.js
export const API_BASE_URL = 'https://api.top2000.com/api';
```

### Using Docker
```javascript
// api.js
export const API_BASE_URL = 'http://backend:80/api';
```

---

## ? Checklist

When changing API URL:

- [ ] Update `src/config/api.js` (line 7)
- [ ] Restart dev server (`Ctrl+C` then `npm run dev`)
- [ ] Clear browser cache if needed (`Ctrl+Shift+R`)
- [ ] Update backend CORS settings if needed

### Backend CORS Configuration

Don't forget to add your frontend URL to backend CORS!

**File:** `TemplateJwtProject/appsettings.Development.json`
```json
{
  "CorsSettings": {
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://localhost:5173",
      "http://yourdomain.com",
      "https://yourdomain.com"
    ]
  }
}
```

---

## ?? Troubleshooting

### "Failed to load songs"
1. Check if backend is running
2. Verify URL in `api.js` is correct
3. Check browser console for CORS errors
4. Verify backend CORS allows your frontend URL

### Changes not taking effect
1. Restart dev server (`Ctrl+C` ? `npm run dev`)
2. Hard refresh browser (`Ctrl+Shift+R`)
3. Check if you saved `api.js`

### CORS errors
1. Add frontend URL to backend `appsettings.Development.json`
2. Restart backend after CORS changes
3. Check if URL includes protocol (`https://` or `http://`)

---

## ?? Related Files

- **API Config:** `react/Client/src/config/api.js`
- **Frontend Code:** `react/Client/src/App.jsx`, `react/Client/src/components/SongDetail.jsx`
- **Backend CORS:** `TemplateJwtProject/appsettings.Development.json`
- **Backend URL:** `TemplateJwtProject/Properties/launchSettings.json`

---

## ?? Best Practices

1. ? **Always use the imported URL** - Never hardcode API URLs in components
2. ? **Use environment variables for production** - Keeps sensitive URLs out of code
3. ? **Document URL changes** - Update this guide when adding new endpoints
4. ? **Test after changes** - Always verify API calls work after URL changes
5. ? **Keep backend CORS in sync** - Update allowed origins when frontend URL changes

---

**Now you have ONE place to change the API URL for your entire React application! ??**
