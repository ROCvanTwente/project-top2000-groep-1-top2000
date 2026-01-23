# Top 2000 Project

Top 2000 application met ASP.NET Core backend en React frontend.

## Frontend (React)

The frontend is ready to use with placeholder data.

### Quick Start

```bash
cd react/Client
npm install
npm run dev
```

Open: `http://localhost:5173`

### Features
- ? Top 2000 homepage with featured albums
- ? Songs table with position changes
- ? Responsive design
- ? 20 songs placeholder data
- ? Ready to connect to API

**See `react/Client/README.md` for API integration instructions.**

## Backend (ASP.NET Core)

The backend template is set up with JWT authentication.

### Your Tasks
1. Create your Song model in `TemplateJwtProject/Models/`
2. Add DbSet to `AppDbContext.cs`
3. Create migration: `dotnet ef migrations add AddSongs`
4. Update database: `dotnet ef database update`
5. Create SongsController with API endpoints
6. Fill database with your data

The frontend expects this data structure:
```csharp
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
}
```

### Running Backend
```bash
cd TemplateJwtProject
dotnet run
```

API will be available at: `https://localhost:7003`

## Project Structure

```
project-top2000-groep-1-top2000/
??? react/Client/              # React Frontend (ready to use)
?   ??? src/
?   ?   ??? App.jsx           # Main component with placeholder data
?   ?   ??? App.css           # Styling
?   ?   ??? ...
?   ??? README.md             # Frontend documentation
?
??? TemplateJwtProject/        # ASP.NET Core Backend (template)
    ??? Controllers/           # Add your SongsController here
    ??? Models/                # Add your Song model here
    ??? Data/
    ?   ??? AppDbContext.cs   # Add your DbSet here
    ??? ...
```

## Development Workflow

1. **Start Frontend:**
   ```bash
   cd react/Client
   npm run dev
   ```
   - Frontend runs on port 5173
   - Shows placeholder data
   - Fully functional UI

2. **Build Backend:**
   - Create models
   - Add controllers
   - Setup database
   - Create API endpoints

3. **Connect Frontend to Backend:**
   - Update `src/App.jsx` (instructions in file)
   - Replace placeholder data with API calls
   - Done!

## Notes

- Frontend is **ready to use** with visual placeholder data
- Backend is a **template** - you build the Song functionality
- CORS is already configured for `http://localhost:5173`
- JWT authentication is already set up if needed

For detailed documentation:
- Frontend: `react/Client/README.md`
- Backend: `TemplateJwtProject/Docs/README.md`
