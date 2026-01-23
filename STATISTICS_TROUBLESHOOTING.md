# ?? Statistics Page - Error Troubleshooting

## Error: "Failed to load statistics"

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages with more details

The error should now show more information like:
- `Failed to load statistics: Year must be between 2000 and 2024`
- `Failed to load statistics: HTTP 500: Internal Server Error`
- `Failed to load statistics: Error retrieving statistics: ...`

---

### Step 2: Test API Directly

Open `TemplateJwtProject/Top2000.http` and run:

```http
### Test Statistics - 2024
GET https://localhost:7003/api/songs/statistics/dropped-songs?year=2024
```

**Expected Response:**
- ? **200 OK** with array of songs
- ? **400 Bad Request** - Invalid year
- ? **500 Internal Server Error** - Database issue

---

### Step 3: Check Database

Run the diagnostic script: `TemplateJwtProject/Migrations/diagnostics_statistics.sql`

```sql
-- Check which years you have data for
SELECT Year, COUNT(*) as SongCount
FROM Top2000Entries
GROUP BY Year
ORDER BY Year DESC;
```

**What you need:**
- ? 2024: ~2000 songs
- ? 2023: ~2000 songs

**If missing:**
- Import data using `top2000_script.sql`

---

## Common Issues & Solutions

### Issue 1: No Data for 2023 or 2024

**Symptom:** Empty array `[]` or "No dropped songs found"

**Check:**
```sql
SELECT Year, COUNT(*) FROM Top2000Entries WHERE Year IN (2023, 2024) GROUP BY Year;
```

**Solution:**
1. Import your Top 2000 data
2. Make sure you have entries for BOTH 2023 AND 2024
3. To show 2024 dropped songs, you MUST have 2023 data to compare against

---

### Issue 2: Year Validation Error

**Symptom:** `Year must be between 2000 and 2024`

**Cause:** Frontend trying to fetch data for invalid year (like 1999)

**Solution:**
1. ? Already fixed! Year dropdown now starts at 2000
2. Restart backend: Stop (Ctrl+C) and run `dotnet run`
3. Hard refresh frontend: Ctrl+Shift+R

---

### Issue 3: Backend Not Running

**Symptom:** `Failed to fetch` or `Network error`

**Check:**
```bash
# Is backend running?
curl https://localhost:7003/api/songs
```

**Solution:**
```bash
cd TemplateJwtProject
dotnet run
```

Should show: `Now listening on: https://localhost:7003`

---

### Issue 4: CORS Error

**Symptom:** Console shows: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
Check `appsettings.Development.json`:
```json
{
  "CorsSettings": {
    "AllowedOrigins": [
      "http://localhost:5173"
    ]
  }
}
```

---

### Issue 5: Wrong Year Constant

**Symptom:** Works for some years but not 2024

**Check:** `TemplateJwtProject/Controllers/SongsController.cs`
```csharp
private const int MostRecentYear = 2024; // Should match your latest data
```

**Solution:**
1. Update `MostRecentYear` to match your latest year
2. Restart backend

---

## Step-by-Step Debugging

### 1. Test Backend API
```bash
# Terminal
curl https://localhost:7003/api/songs/statistics/dropped-songs?year=2024
```

**If this works:** Frontend issue
**If this fails:** Backend issue

### 2. Check Browser Console
```javascript
// You should see:
Fetching statistics from: https://localhost:7003/api/songs/statistics/dropped-songs?year=2024
Statistics data received: 123 songs
```

### 3. Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for `dropped-songs` request
5. Check Status (200, 400, 500)
6. Check Response body

### 4. Verify Database
```sql
-- Should return > 0
SELECT COUNT(*) FROM Top2000Entries WHERE Year = 2024;
SELECT COUNT(*) FROM Top2000Entries WHERE Year = 2023;

-- Should return songs that dropped
SELECT COUNT(*) 
FROM Top2000Entries t2024
JOIN Top2000Entries t2023 ON t2024.SongId = t2023.SongId
WHERE t2024.Year = 2024 
  AND t2023.Year = 2023 
  AND t2024.Position > t2023.Position;
```

---

## Quick Fixes

### Backend Changes Applied ?

1. ? **Year validation fixed** - Now 2000-2024 (was 1999-2024)
2. ? **Better error messages** - Shows actual error from API
3. ? **Try-catch added** - Handles database errors gracefully
4. ? **Console logging** - Shows what's being fetched

### Frontend Changes Applied ?

1. ? **Better error handling** - Shows actual error message
2. ? **Console logging** - Shows fetch URL and results
3. ? **Year dropdown** - Starts at 2000 (was starting at 2000 but with old validation)

---

## What to Do Now

### 1. Restart Backend
```bash
# Stop current backend (Ctrl+C)
cd TemplateJwtProject
dotnet run
```

### 2. Hard Refresh Frontend
- Press `Ctrl + Shift + R` in browser
- Or clear cache and reload

### 3. Check Console
- Open DevTools (F12)
- Go to Console tab
- Look for the detailed error message

### 4. Check Database
Run `diagnostics_statistics.sql` to verify your data

---

## Expected Console Output

### Success ?
```
Fetching statistics from: https://localhost:7003/api/songs/statistics/dropped-songs?year=2024
Statistics data received: 456 songs
```

### No Data (but working) ??
```
Fetching statistics from: https://localhost:7003/api/songs/statistics/dropped-songs?year=2024
Statistics data received: 0 songs
```

### Error ?
```
Fetching statistics from: https://localhost:7003/api/songs/statistics/dropped-songs?year=2024
API Error: Year must be between 2000 and 2024
Error fetching dropped songs: Year must be between 2000 and 2024
```

---

## Still Not Working?

1. **Check backend console** - Any errors when starting?
2. **Check database connection** - Can you see songs on homepage?
3. **Test other endpoints** - Does `/api/songs` work?
4. **Share console error** - Copy exact error message from browser console

---

## Contact Info

If you're still stuck, provide:
1. ? Browser console error (full message)
2. ? Result of diagnostics_statistics.sql
3. ? Backend console output
4. ? Which year you're trying to view

This will help diagnose the exact issue!
