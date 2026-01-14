# Song Detail Pages - Quick Reference

## What Was Added

? **React Router** - For URL navigation
? **Song Detail Component** - Full-page song details
? **Clickable Song Titles** - Navigate to detail pages
? **Back Button** - Return to homepage
? **Placeholder History Data** - Position charts over time

## Files Created

1. **`react/Client/src/components/SongDetail.jsx`**
   - Main detail page component
   - Displays song info, album cover, history chart
   - Includes Spotify link

2. **`react/Client/src/components/SongDetail.css`**
   - All styling for detail page
   - Red/black Top 2000 theme
   - Responsive design

## Files Modified

1. **`react/Client/src/App.jsx`**
   - Added React Router
   - Made song titles clickable
   - Created routes for homepage and detail pages

2. **`react/Client/src/App.css`**
   - Added `.song-title-link` styling
   - Hover effects for clickable titles

3. **`react/Client/package.json`**
   - Added `react-router-dom` dependency

## How It Works

### Navigation Flow

```
Homepage (/)
    ?
    ?? Click Featured Album ? /song/bohemian-rhapsody
    ?
    ?? Click Song Title ? /song/hotel-california
                              ?
                              ?? Click Back Button ? / (Homepage)
```

### URL Structure

Song titles are converted to slugs:
- "Bohemian Rhapsody" ? `/song/bohemian-rhapsody`
- "Hotel California" ? `/song/hotel-california`
- "Stairway to Heaven" ? `/song/stairway-to-heaven`

### Data Flow (Placeholder)

```javascript
// Homepage: PLACEHOLDER_SONGS array in App.jsx
const songs = [...]; // 20 songs

// Detail Page: Finds song by slug from same array
const song = songs.find(s => slug matches title);

// History: Hardcoded example data
const history = [
  { year: 2021, position: 3 },
  { year: 2022, position: 2 },
  // ...
];
```

## Detail Page Features

### 1. Header Section
- Large album cover (400x400px)
- Position badge (#1, #2, etc.)
- Song title (large, red)
- Artist name (gray)

### 2. Meta Information
- Release year
- Current position (highlighted in red)
- Previous position
- Position change with color:
  - Green ? for moved up
  - Red ? for moved down
  - Gray – for no change

### 3. Actions
- **Spotify Button** (green)
  - Opens Spotify search for the song
  - Opens in new tab

### 4. Position History Chart
- Bar chart showing last 5 years
- Current year highlighted in red
- Others in gray
- Position numbers on bars

### 5. Album Information
- Release year
- Artist name
- Song title
- (Ready for more fields when you add them)

## Customization Guide

### Change Spotify Link Behavior

**File:** `src/components/SongDetail.jsx` (line ~60)

```javascript
// Current: Opens Spotify search
const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(song.title + ' ' + song.artist)}`;

// Option: Direct Spotify URL (if you have Spotify IDs in database)
const spotifyUrl = `https://open.spotify.com/track/${song.spotifyId}`;
```

### Add More Historical Years

**File:** `src/components/SongDetail.jsx` (line ~10)

```javascript
const getHistoricalData = (songId) => {
  return [
    { year: 2020, position: 5 },
    { year: 2021, position: 3 },
    { year: 2022, position: 2 },
    { year: 2023, position: 1 },
    { year: 2024, position: 1 },
    { year: 2025, position: 1 }
  ];
};
```

### Change Colors

**File:** `src/components/SongDetail.css`

```css
/* Primary red color */
.song-detail-title { color: #ff0000; }

/* Spotify button color */
.spotify-button { background-color: #1db954; }

/* Position badge */
.song-position-badge { background-color: #ff0000; }
```

### Add More Album Info Fields

**File:** `src/components/SongDetail.jsx` (line ~120)

```javascript
<div className="album-info-item">
  <span className="info-label">Album Name:</span>
  <span className="info-value">{song.albumName || 'Unknown'}</span>
</div>
<div className="album-info-item">
  <span className="info-label">Genre:</span>
  <span className="info-value">{song.genre || 'Unknown'}</span>
</div>
```

## Backend Integration Checklist

When connecting to your API:

### Required Backend Endpoints

- [ ] `GET /api/songs` - List all songs
- [ ] `GET /api/songs/:id` - Get song by ID
- [ ] `GET /api/songs/slug/:slug` - Get song by slug (recommended)
- [ ] `GET /api/songs/:id/history` - Get position history

### Database Fields Needed

**Songs Table:**
- [x] Id
- [x] Title
- [x] Artist
- [x] Year
- [x] CurrentPosition
- [x] PreviousPosition
- [x] PositionChange
- [x] AlbumCoverUrl
- [ ] AlbumName (optional)
- [ ] SpotifyId (optional)
- [ ] Genre (optional)

**History Table (New):**
- [ ] Id
- [ ] SongId (foreign key)
- [ ] Year
- [ ] Position

### Example Backend Models

```csharp
// Song.cs
public class Song
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Artist { get; set; }
    public int Year { get; set; }
    public int CurrentPosition { get; set; }
    public int? PreviousPosition { get; set; }
    public int? PositionChange { get; set; }
    public string? AlbumCoverUrl { get; set; }
    public string? AlbumName { get; set; }
    public string? SpotifyId { get; set; }
    
    // Navigation property
    public ICollection<SongHistory> History { get; set; }
}

// SongHistory.cs
public class SongHistory
{
    public int Id { get; set; }
    public int SongId { get; set; }
    public int Year { get; set; }
    public int Position { get; set; }
    
    public Song Song { get; set; }
}
```

### Example Controller Endpoints

```csharp
// SongsController.cs

[HttpGet("slug/{slug}")]
public async Task<ActionResult<SongDto>> GetSongBySlug(string slug)
{
    var song = await _context.Songs
        .FirstOrDefaultAsync(s => s.Title.ToLower().Replace(" ", "-") == slug);
    
    if (song == null)
        return NotFound();
    
    return Ok(song);
}

[HttpGet("{id}/history")]
public async Task<ActionResult<IEnumerable<HistoryDto>>> GetHistory(int id)
{
    var history = await _context.SongHistory
        .Where(h => h.SongId == id)
        .OrderBy(h => h.Year)
        .ToListAsync();
    
    return Ok(history);
}
```

## Testing

### Test the Detail Page

1. **Start the frontend:**
   ```bash
   cd react/Client
   npm run dev
   ```

2. **Navigate to homepage:** `http://localhost:5173`

3. **Click any song title** in the table

4. **You should see:**
   - URL changes to `/song/song-name`
   - Detail page loads
   - Back button works

5. **Test featured albums:**
   - Click on any featured album card
   - Should navigate to detail page

### Verify Features

- [ ] Song titles are clickable (hover shows underline)
- [ ] Featured albums are clickable (hover shows lift effect)
- [ ] Detail page shows correct song info
- [ ] Back button returns to homepage
- [ ] Spotify button opens in new tab
- [ ] History chart displays properly
- [ ] Responsive on mobile (test in DevTools)

## Troubleshooting

### "Cannot read property of undefined" error

**Cause:** Song not found by slug

**Fix:** Check the slug format in the URL matches the song title transformation

### Page is blank when clicking song

**Cause:** Routing not set up correctly

**Fix:** Make sure `BrowserRouter` wraps the entire app in `App.jsx`

### Back button doesn't work

**Cause:** Using `<a>` instead of `<button>` with `navigate()`

**Fix:** Already implemented correctly with React Router's `useNavigate()`

### Styles not loading on detail page

**Cause:** CSS file not imported

**Fix:** Check `import './SongDetail.css'` is at the top of `SongDetail.jsx`

## Next Steps

Possible enhancements:

1. **Add Loading States**
   - Show spinner while fetching song details
   - Skeleton loading for history chart

2. **Add Error Handling**
   - Display message if song not found
   - Retry button for failed API calls

3. **Enhanced History**
   - Line chart instead of bar chart
   - Tooltips on hover
   - Filter by year range

4. **Social Sharing**
   - Share song on Twitter/Facebook
   - Copy link to clipboard

5. **Related Songs**
   - Show similar songs by artist
   - Show songs from same year

6. **User Interactions**
   - Favorite button
   - Rating system
   - Comments section

---

**Everything is set up and ready to use!** Just run `npm run dev` in the `react/Client` folder and start clicking on songs! ??
