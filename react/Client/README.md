# Top 2000 Frontend

React-based frontend voor de Top 2000 applicatie met placeholder data.

## Quick Start

```bash
cd react/Client
npm install
npm run dev
```

Open browser: `http://localhost:5173`

## Features

- ? **Featured Albums Section** - Top 5 songs with album covers
- ? **Songs Table** - Complete list with position changes
- ? **Song Detail Pages** - Individual page for each song with:
  - Large album cover
  - Position history chart
  - Album information
  - Spotify link
- ? **React Router Navigation** - Clean URLs like `/song/bohemian-rhapsody`
- ? **Responsive Design** - Works on desktop, tablet, and mobile
- ? **Placeholder Data** - 20 pre-loaded songs (easily replaceable)

## Navigation

- **Homepage**: Click the logo or navigate to `/`
- **Song Details**: Click on any song title in the table or featured albums
- **Back Button**: Return to homepage from detail pages

## Connecting to Backend API

When you're ready to connect to your SQL database:

### Homepage Songs

1. **Open `src/App.jsx`**

2. **Replace the placeholder data section** with:

```javascript
import { useState, useEffect } from 'react'

function App() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await fetch('YOUR_API_URL/api/songs');
      const data = await response.json();
      setSongs(data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  // ...rest of component
}
```

### Song Detail Page

1. **Open `src/components/SongDetail.jsx`**

2. **Replace the data fetching** with:

```javascript
const [song, setSong] = useState(null);
const [history, setHistory] = useState([]);

useEffect(() => {
  fetchSongDetail();
}, [slug]);

const fetchSongDetail = async () => {
  try {
    const response = await fetch(`YOUR_API_URL/api/songs/slug/${slug}`);
    const data = await response.json();
    setSong(data);
    
    // Fetch history
    const historyResponse = await fetch(`YOUR_API_URL/api/songs/${data.id}/history`);
    const historyData = await historyResponse.json();
    setHistory(historyData);
  } catch (error) {
    console.error('Error fetching song details:', error);
  }
};
```

## Expected API Response Format

### GET /api/songs
```json
[
  {
    "id": 1,
    "title": "Song Title",
    "artist": "Artist Name",
    "year": 2020,
    "currentPosition": 1,
    "previousPosition": 2,
    "positionChange": 1,
    "albumCoverUrl": "https://..."
  }
]
```

### GET /api/songs/slug/:slug
```json
{
  "id": 1,
  "title": "Song Title",
  "artist": "Artist Name",
  "year": 2020,
  "currentPosition": 1,
  "previousPosition": 2,
  "positionChange": 1,
  "albumCoverUrl": "https://...",
  "albumName": "Album Name"
}
```

### GET /api/songs/:id/history
```json
[
  { "year": 2021, "position": 5 },
  { "year": 2022, "position": 3 },
  { "year": 2023, "position": 2 },
  { "year": 2024, "position": 1 },
  { "year": 2025, "position": 1 }
]
```

## Data Structure

Each song should have:
- `id` - Unique identifier
- `title` - Song title
- `artist` - Artist/band name
- `year` - Release year
- `currentPosition` - Current ranking
- `previousPosition` - Last year's position (null if new entry)
- `positionChange` - Position change (positive = moved up)
- `albumCoverUrl` - Image URL (null for placeholder)
- `albumName` - (Optional) Album title

## URL Structure

The app uses clean URLs:
- `/` - Homepage with song list
- `/song/bohemian-rhapsody` - Detail page for Bohemian Rhapsody
- `/song/hotel-california` - Detail page for Hotel California

Song slugs are automatically generated from titles (lowercase, special characters removed).

## Customization

### Colors
Edit `src/App.css` and `src/components/SongDetail.css` to change the color scheme:
- Primary: `#ff0000` (red)
- Background: `#1a1a1a` (dark gray)

### Placeholder Data
Edit the `PLACEHOLDER_SONGS` array in `src/App.jsx` to change the demo data.

### Historical Data
Edit `getHistoricalData()` in `src/components/SongDetail.jsx` for demo history.

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Tech Stack

- React 19.2.0
- React Router DOM 7.1.1
- Vite 7.2.4
- Pure CSS (no frameworks)

## File Structure

```
src/
??? App.jsx                      # Main app with routing
??? App.css                      # Homepage styles
??? components/
?   ??? SongDetail.jsx          # Detail page component
?   ??? SongDetail.css          # Detail page styles
??? main.jsx                     # Entry point
??? index.css                    # Global styles
