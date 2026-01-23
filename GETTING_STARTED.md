# Getting Started

## What's Ready

? **Frontend** - Fully functional React app with Top 2000 design
- Located in: `react/Client/`
- Has placeholder data (20 songs)
- Matches the design from the image
- Ready to use immediately

## Quick Start - Frontend Only

### Option 1: Using the Batch File (Windows)
Double-click `start-frontend.bat`

### Option 2: Manual Start
```bash
cd react\Client
npm install
npm run dev
```

Then open: **http://localhost:5173**

That's it! You'll see the Top 2000 homepage with placeholder data.

## What You Need to Build (Backend)

The backend template is ready, but YOU need to add:

1. **Song Model** (`TemplateJwtProject/Models/Song.cs`)
2. **Database Configuration** (add DbSet to AppDbContext)
3. **Migration** (create and run)
4. **Controller** (`SongsController.cs` with API endpoints)
5. **Data** (fill your database)

### Expected API Endpoints

Your backend should provide:
- `GET /api/songs` - Returns all songs
- `GET /api/songs/featured` - Returns top 5 songs (optional)

### Data Structure

Each song should have:
```json
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
```

## Connecting Frontend to Your Backend

When your backend is ready:

1. Open `react/Client/src/App.jsx`
2. Find the comment: `/* TO CONNECT TO BACKEND API: */`
3. Follow the instructions there
4. Replace placeholder data with API calls

## Project Structure

```
??? react/Client/              ? YOUR FRONTEND (READY!)
?   ??? src/
?   ?   ??? App.jsx           ? Main component (placeholder data)
?   ?   ??? App.css           ? All styling
?   ??? package.json
?
??? TemplateJwtProject/        ? YOUR BACKEND (YOU BUILD THIS)
    ??? Models/                ? Add Song.cs here
    ??? Controllers/           ? Add SongsController.cs here
    ??? Data/AppDbContext.cs   ? Add DbSet<Song> here
```

## Tips

- Start with the frontend - it works immediately
- Build your backend at your own pace
- The frontend shows you exactly what data structure you need
- CORS is already configured (`http://localhost:5173`)

## Need Help?

- Frontend docs: `react/Client/README.md`
- Backend docs: `TemplateJwtProject/Docs/README.md`
- Main docs: `README.md`
