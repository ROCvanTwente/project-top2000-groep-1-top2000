# Top 2000 API Integration - Setup Guide

## ? What Was Done

### Backend (.NET 10)

1. **Created Models:**
   - `Song.cs` - Song entity with title, artist, year, images
   - `Artist.cs` - Artist entity with name and bio
   - `Top2000Entry.cs` - Historical positions per year
   - `SongDtos.cs` - DTOs for API responses with pagination

2. **Updated AppDbContext:**
   - Added DbSets for Songs, Artist, Top2000Entries
   - Configured relationships and table mappings
   - Added composite key for Top2000Entry (SongId, Year)

3. **Created SongsController:**
   - `GET /api/songs?page=1&pageSize=50` - Paginated song list
   - `GET /api/songs/by-title/{title}` - Get song by title (for URL slugs)
   - `GET /api/songs/{id}` - Get song by ID
   - `GET /api/songs/{id}/history` - Get song history
   
   Features:
   - Automatic position change calculation (previous year vs current)
   - Last 5 years of history (2020-2024)
   - 50 songs per page
   - Full pagination metadata

### Frontend (React + Vite)

1. **Updated App.jsx:**
   - API integration with `https://localhost:7003/api/songs`
   - Pagination with Previous/Next buttons
   - Page numbers (smart pagination: 1 ... 5 6 7 ... 40)
   - Featured Top 5 (only on page 1)
   - Loading and error states
   - Auto-scroll to top on page change

2. **Updated SongDetail.jsx:**
   - API integration with `/api/songs/by-title/{slug}`
   - Real-time data from database
   - Historical chart (last 5 years)
   - YouTube link support
   - Lyrics display (if available)
   - Position change indicators

3. **Updated App.css:**
   - Pagination styles
   - Active page highlight
   - Disabled button states
   - Responsive design for mobile

## ?? How to Run

### 1. Start the Backend

```bash
cd TemplateJwtProject
dotnet run
```

API will run on: `https://localhost:7003`

### 2. Start the Frontend

```bash
cd react/Client
npm run dev
```

Frontend will run on: `http://localhost:5173`

### 3. Open in Browser

Navigate to: `http://localhost:5173`

## ?? Database Requirements

Make sure your database has data:

1. **Artist table** - Must have artists
2. **Songs table** - Must have songs linked to artists
3. **Top2000Entries** - Must have entries for year 2024 (and preferably 2020-2023 for history)

### Check Your Data

Run this SQL to verify:

```sql
-- Check if you have data
SELECT COUNT(*) FROM Artist;
SELECT COUNT(*) FROM Songs;
SELECT COUNT(*) FROM Top2000Entries WHERE Year = 2024;

-- Check top 10 songs for 2024
SELECT TOP 10 
    t.Position,
    s.Titel,
    a.Name as Artist,
    s.ReleaseYear
FROM Top2000Entries t
JOIN Songs s ON t.SongId = s.SongId
JOIN Artist a ON s.ArtistId = a.ArtistId
WHERE t.Year = 2024
ORDER BY t.Position;
```

## ?? Configuration

### Update Most Recent Year

If you need to change the year from 2024 to another year:

**Backend:** `TemplateJwtProject/Controllers/SongsController.cs`
```csharp
private const int MostRecentYear = 2024; // Change this
```

**Frontend:** `react/Client/src/App.jsx`
```javascript
<h2 className="section-title">TOP 2000 2024</h2> // Update display year
```

### Change Page Size

**Frontend:** `react/Client/src/App.jsx`
```javascript
const pageSize = 50; // Change to 25, 100, etc.
```

## ?? Features Implemented

### Homepage
- ? **Featured Top 5** - Large cards for top 5 songs (page 1 only)
- ? **Paginated Table** - 50 songs per page
- ? **Position Changes** - Green ? for up, Red ? for down
- ? **Clickable Titles** - Click song title to see details
- ? **Clickable Albums** - Click featured album to see details
- ? **Smart Pagination** - Page numbers with ellipsis (1 ... 5 6 7 ... 40)
- ? **Loading States** - Shows "Loading Top 2000..."
- ? **Error Handling** - Retry button if API fails

### Detail Page
- ? **Song Information** - Title, artist, year, position
- ? **Album Cover** - Large image with position badge
- ? **Position Badge** - Red circle with current position (#1)
- ? **Meta Information** - Current/previous position, change
- ? **Spotify Link** - Green button to search on Spotify
- ? **YouTube Link** - Red button (if URL exists in database)
- ? **History Chart** - Bar chart of last 5 years positions
- ? **Song Info Section** - All details in one place
- ? **Lyrics** - Displayed if available in database
- ? **Back Button** - Returns to homepage

### Navigation
- ? **URL Slugs** - `/song/bohemian-rhapsody` format
- ? **React Router** - Clean URLs without hash
- ? **Browser Back** - Works as expected

## ?? Troubleshooting

### "Failed to load songs"

**Problem:** Frontend can't connect to API

**Solutions:**
1. Make sure backend is running: `dotnet run` in TemplateJwtProject folder
2. Check API URL: Should be `https://localhost:7003`
3. Check CORS: Should allow `http://localhost:5173`
4. Check certificate: Trust the development certificate

```bash
dotnet dev-certs https --trust
```

### "Song not found"

**Problem:** No data in Top2000Entries for year 2024

**Solution:** Check your database has entries for 2024:

```sql
SELECT Year, COUNT(*) as SongCount 
FROM Top2000Entries 
GROUP BY Year 
ORDER BY Year DESC;
```

If missing, insert the data from `top2000_script.sql`

### Empty History Chart

**Problem:** No historical data for previous years

**Solution:** You need data for years 2020-2024. If you only have 2024, the chart will only show 1 bar.

### Images Not Loading

**Problem:** `ImgUrl` field is NULL or invalid

**Solutions:**
1. Add image URLs to your database
2. Or images will show placeholder (?? icon)

## ?? Next Steps

Now that the basic integration is working, you can:

1. **Add Real Images** - Update ImgUrl in Songs table
2. **Add YouTube Links** - Update Youtube field in Songs table
3. **Add Lyrics** - Update Lyrics field in Songs table
4. **Import Historical Data** - Add entries for 2020-2023
5. **Add Search** - Create search endpoint and UI
6. **Add Filters** - Filter by artist, year, etc.
7. **Add Authentication** - Use JWT for favorite songs, voting, etc.

## ?? Security Notes

Currently the Songs API is **public** (no authentication). If you want to protect it:

1. Add `[Authorize]` attribute to SongsController
2. Update frontend to send JWT token
3. Handle 401 errors and redirect to login

## ?? API Documentation

### GET /api/songs

**Parameters:**
- `page` (int, default: 1) - Page number
- `pageSize` (int, default: 50, max: 100) - Songs per page

**Response:**
```json
{
  "songs": [
    {
      "songId": 1,
      "titel": "Bohemian Rhapsody",
      "artistName": "Queen",
      "releaseYear": 1975,
      "currentPosition": 1,
      "previousPosition": 1,
      "positionChange": 0,
      "imgUrl": "https://..."
    }
  ],
  "currentPage": 1,
  "totalPages": 40,
  "totalSongs": 2000,
  "pageSize": 50
}
```

### GET /api/songs/by-title/{title}

**Parameters:**
- `title` (string) - Song title (URL encoded, spaces can be hyphens)

**Response:**
```json
{
  "songId": 1,
  "titel": "Bohemian Rhapsody",
  "artistName": "Queen",
  "releaseYear": 1975,
  "currentPosition": 1,
  "previousPosition": 1,
  "positionChange": 0,
  "imgUrl": "https://...",
  "lyrics": "Is this the real life...",
  "youtube": "https://youtube.com/...",
  "history": [
    { "year": 2020, "position": 1 },
    { "year": 2021, "position": 1 },
    { "year": 2022, "position": 1 },
    { "year": 2023, "position": 1 },
    { "year": 2024, "position": 1 }
  ]
}
```

---

**Everything is ready! Just make sure:**
1. ? Backend is running on `https://localhost:7003`
2. ? Frontend is running on `http://localhost:5173`
3. ? Database has data in Artist, Songs, and Top2000Entries tables
4. ? Top2000Entries has data for year 2024

**Happy coding! ??**
