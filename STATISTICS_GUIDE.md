# ?? Statistics Feature - Biggest Drops

## Overview

The Statistics page shows songs that dropped in position compared to the previous year, ordered by the biggest drops first. This is **Statistic 1** of the Top 2000 statistics features.

---

## Features

? **Year Selection** - Select any year from 2000 to 2024  
? **Dropped Songs Only** - Only shows songs that went down in ranking  
? **Biggest Drops First** - Ordered by number of positions dropped (descending)  
? **Detailed Information** - Shows position, title, artist, release year  
? **Visual Indicators** - Red badges showing how many positions dropped  
? **Clickable Songs** - Click any song to see full details  
? **Responsive Design** - Works on desktop, tablet, and mobile  

---

## How It Works

### Backend Logic

**Endpoint:** `GET /api/songs/statistics/dropped-songs?year=2024`

**Query:**
- Joins Songs, Artist, and Top2000Entries tables
- Filters for songs where `CurrentPosition > PreviousPosition` (dropped)
- Calculates `PositionsDropped = CurrentPosition - PreviousPosition`
- Orders by `PositionsDropped DESC` (biggest drops first)

**Example Response:**
```json
[
  {
    "songId": 123,
    "titel": "Song Title",
    "artistName": "Artist Name",
    "releaseYear": 1985,
    "currentPosition": 150,
    "previousPosition": 50,
    "positionsDropped": 100,
    "imgUrl": "https://..."
  }
]
```

### Frontend Display

**Table Columns:**
1. **RANK** - Sequential numbering (1, 2, 3, ...)
2. **IMAGE** - Album cover thumbnail
3. **TITLE** - Song title (clickable link to detail page)
4. **ARTIST** - Artist name
5. **YEAR** - Release year
6. **POSITION {year}** - Current year position (red)
7. **POSITION {year-1}** - Previous year position (green)
8. **DROPPED** - Number of positions dropped (red badge with ?)

---

## API Usage

### Request

```http
GET /api/songs/statistics/dropped-songs?year=2024
```

**Parameters:**
- `year` (int, required) - Year to get statistics for (2000-2024)

### Response Success (200 OK)

```json
[
  {
    "songId": 42,
    "titel": "Example Song",
    "artistName": "Example Artist",
    "releaseYear": 1990,
    "currentPosition": 500,
    "previousPosition": 100,
    "positionsDropped": 400,
    "imgUrl": "https://example.com/cover.jpg"
  }
]
```

### Response Error (400 Bad Request)

```json
{
  "message": "Year must be between 1999 and 2024"
}
```

### Empty Result

If no songs dropped in the selected year, returns empty array: `[]`

---

## Navigation

### From Homepage
1. Click **"Statistics"** in the navigation bar
2. Or navigate to: `http://localhost:5173/statistics`

### From Statistics Page
1. Select a year from the dropdown
2. Data automatically refreshes
3. Click any song title to view details
4. Click **"Back to Homepage"** button to return

---

## File Structure

```
Backend:
??? Controllers/
?   ??? SongsController.cs
?       ??? GetDroppedSongs() endpoint
??? Models/
?   ??? DTOs/
?       ??? SongDtos.cs
?           ??? DroppedSongDto

Frontend:
??? src/
?   ??? components/
?   ?   ??? Statistics.jsx      ? Main component
?   ?   ??? Statistics.css      ? Styles
?   ??? config/
?   ?   ??? api.js              ? API_ENDPOINTS.statistics.droppedSongs()
?   ??? App.jsx                 ? Routing + Navigation
```

---

## Data Requirements

For this feature to work, you need:

1. ? **Artist table** - populated with artists
2. ? **Songs table** - populated with songs (linked to artists)
3. ? **Top2000Entries** - Must have data for:
   - The selected year (e.g., 2024)
   - The previous year (e.g., 2023)

**Example:**
- To see dropped songs for 2024, you need entries for 2023 AND 2024
- To see dropped songs for 2023, you need entries for 2022 AND 2023

---

## Usage Examples

### Typical User Flow

1. User visits `/statistics`
2. Default shows 2024 dropped songs
3. User selects "2023" from dropdown
4. Page shows songs that dropped in 2023 vs 2022
5. User clicks song title
6. Detail page opens
7. User clicks back button to return to statistics

### Year Selection

```javascript
// Years available: 2024, 2023, 2022, ..., 2000
<select value={2024} onChange={...}>
  <option value={2024}>2024</option>
  <option value={2023}>2023</option>
  ...
</select>
```

---

## Styling

### Color Scheme

- **Background:** Dark theme (#1a1a1a)
- **Title:** Red (#ff0000) - "?? Biggest Drops"
- **Current Position:** Red (#ff6666) - Lower rank
- **Previous Position:** Green (#66ff66) - Better rank
- **Drop Badge:** Red background (#ff0000) with white text

### Responsive Breakpoints

- **Desktop (>1200px):** Full table with all columns
- **Tablet (768px-1200px):** Slightly smaller fonts
- **Mobile (<768px):** Hides year and previous position columns

---

## Common Issues

### "No dropped songs found for {year}"

**Causes:**
1. No songs actually dropped that year
2. Missing data for previous year (e.g., need 2023 data to show 2024 drops)
3. Database empty

**Solution:**
1. Check database has entries for both years:
   ```sql
   SELECT Year, COUNT(*) 
   FROM Top2000Entries 
   WHERE Year IN (2023, 2024) 
   GROUP BY Year;
   ```
2. Import missing data if needed

### "Year must be between 1999 and 2024"

**Cause:** Invalid year parameter in URL

**Solution:** Use the dropdown selector instead of manually editing URL

### API Connection Error

**Cause:** Backend not running or wrong API URL

**Solution:**
1. Start backend: `dotnet run` in TemplateJwtProject folder
2. Verify URL in `src/config/api.js`
3. Check browser console for CORS errors

---

## Testing

### Manual Test Checklist

- [ ] Page loads without errors
- [ ] Default year is 2024
- [ ] Dropdown shows years 2000-2024
- [ ] Selecting a year refreshes data
- [ ] Songs are ordered by biggest drops first
- [ ] Drop badges show correct numbers (? X)
- [ ] Current position is red, previous is green
- [ ] Click song title navigates to detail page
- [ ] Back button returns to statistics page
- [ ] Responsive design works on mobile
- [ ] No data message shows if no dropped songs

### API Testing

Use `Top2000.http` or Postman:

```http
### Test Statistics - Dropped Songs 2024
GET https://localhost:7003/api/songs/statistics/dropped-songs?year=2024

### Test Statistics - Dropped Songs 2023
GET https://localhost:7003/api/songs/statistics/dropped-songs?year=2023

### Test Statistics - Invalid Year
GET https://localhost:7003/api/songs/statistics/dropped-songs?year=3000
```

---

## Future Enhancements

Potential improvements:
- [ ] Pagination for large result sets
- [ ] Filter by artist or genre
- [ ] Export to CSV/Excel
- [ ] Chart visualization (line chart of position over time)
- [ ] Compare multiple years
- [ ] Show dropped songs vs risen songs side by side
- [ ] Statistics 2: Biggest Risers
- [ ] Statistics 3: New Entries
- [ ] Statistics 4: Songs Out of List

---

## Performance

### Expected Performance
- **API Query:** ~50-200ms (depends on database size)
- **Frontend Load:** ~100-300ms
- **Data Transfer:** ~10-50KB (100-500 songs)

### Optimization Notes
- Single database query with joins (efficient)
- No pagination needed (dropped songs usually < 500)
- Image thumbnails loaded lazily
- Minimal re-renders on year change

---

## Troubleshooting

### Dropdown doesn't change data

**Solution:**
1. Check browser console for errors
2. Verify `useEffect` dependency includes `selectedYear`
3. Hard refresh page (Ctrl+Shift+R)

### Wrong order (smallest drops first)

**Solution:**
1. Check backend `orderby` clause uses `descending`
2. Verify `PositionsDropped` calculation is correct

### Missing navigation link

**Solution:**
1. Check all 3 navigation sections in `App.jsx` updated
2. Verify `Link` component imported from react-router-dom

---

## Related Documentation

- **API Integration:** `TOP2000_API_INTEGRATION.md`
- **Main README:** `README.md`
- **Song Details:** `SONG_DETAIL_GUIDE.md`
- **API Configuration:** `react/Client/API_CONFIG.md`

---

**Status: ? COMPLETE AND READY TO USE**

Navigate to `/statistics` to see songs that dropped in position!
