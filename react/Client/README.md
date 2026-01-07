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
- ? **Responsive Design** - Works on desktop, tablet, and mobile
- ? **Placeholder Data** - 20 pre-loaded songs (easily replaceable)

## Connecting to Backend API

When you're ready to connect to your SQL database:

1. **Open `src/App.jsx`**

2. **Replace the placeholder data section** with:

```javascript
import { useState, useEffect } from 'react'

function App() {
  const [songs, setSongs] = useState([]);
  const [featuredSongs, setFeaturedSongs] = useState([]);
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
      setFeaturedSongs(data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  // ...rest of component
}
```

3. **Expected API Response Format:**

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

## Customization

### Colors
Edit `src/App.css` to change the color scheme:
- Primary: `#ff0000` (red)
- Background: `#1a1a1a` (dark gray)

### Placeholder Data
Edit the `PLACEHOLDER_SONGS` array in `src/App.jsx` to change the demo data.

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Tech Stack

- React 19.2.0
- Vite 7.2.4
- Pure CSS (no frameworks)
