using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TemplateJwtProject.Data;
using TemplateJwtProject.Models.DTOs;
using System.Linq;

namespace TemplateJwtProject.Controllers;

[ApiController]
[Produces("application/json")]
[Route("api/songs")]
public class SongsController : ControllerBase
{
    private readonly AppDbContext _context;
    private const int MostRecentYear = 2024; // Update this to current Top 2000 year

    public SongsController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get paginated list of songs from most recent Top 2000
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PaginatedSongsDto>> GetSongs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 50;

        // Get songs with their current year positions
        var query = from song in _context.Songs
                    join artist in _context.Artist on song.ArtistId equals artist.ArtistId
                    join currentEntry in _context.Top2000Entries
                        on song.SongId equals currentEntry.SongId
                    where currentEntry.Year == MostRecentYear
                    orderby currentEntry.Position
                    select new
                    {
                        song.SongId,
                        song.Titel,
                        ArtistName = artist.Name,
                        song.ReleaseYear,
                        song.ImgUrl,
                        CurrentPosition = currentEntry.Position,
                        PreviousEntry = _context.Top2000Entries
                            .Where(e => e.SongId == song.SongId && e.Year == MostRecentYear - 1)
                            .Select(e => (int?)e.Position)
                            .FirstOrDefault()
                    };

        var totalSongs = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalSongs / (double)pageSize);

        var songs = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new SongDto
            {
                SongId = x.SongId,
                Titel = x.Titel,
                ArtistName = x.ArtistName,
                ReleaseYear = x.ReleaseYear,
                CurrentPosition = x.CurrentPosition,
                PreviousPosition = x.PreviousEntry,
                PositionChange = x.PreviousEntry.HasValue
                    ? x.PreviousEntry.Value - x.CurrentPosition
                    : null,
                ImgUrl = x.ImgUrl
            })
            .ToListAsync();

        return Ok(new PaginatedSongsDto
        {
            Songs = songs,
            CurrentPage = page,
            TotalPages = totalPages,
            TotalSongs = totalSongs,
            PageSize = pageSize
        });
    }

    /// <summary>
    /// Get song by title (slug format)
    /// </summary>
    [HttpGet("by-title/{title}")]
    public async Task<ActionResult<SongDetailDto>> GetSongByTitle(string title)
    {
        // Convert URL slug back to title format
        var decodedTitle = Uri.UnescapeDataString(title).Replace("-", " ");

        var song = await _context.Songs
            .Include(s => s.Artist)
            .Include(s => s.Entries)
            .FirstOrDefaultAsync(s => s.Titel.ToLower() == decodedTitle.ToLower());

        if (song == null)
        {
            return NotFound(new { message = "Song not found" });
        }

        // Get current position
        var currentEntry = song.Entries.FirstOrDefault(e => e.Year == MostRecentYear);
        if (currentEntry == null)
        {
            return NotFound(new { message = "Song not in most recent Top 2000" });
        }

        // Get previous position
        var previousEntry = song.Entries.FirstOrDefault(e => e.Year == MostRecentYear - 1);

        // Get last 5 years of history
        var history = song.Entries
            .Where(e => e.Year >= MostRecentYear - 4 && e.Year <= MostRecentYear)
            .OrderBy(e => e.Year)
            .Select(e => new HistoryEntryDto
            {
                Year = e.Year,
                Position = e.Position
            })
            .ToList();

        var songDetail = new SongDetailDto
        {
            SongId = song.SongId,
            Titel = song.Titel,
            ArtistName = song.Artist.Name,
            ReleaseYear = song.ReleaseYear,
            CurrentPosition = currentEntry.Position,
            PreviousPosition = previousEntry?.Position,
            PositionChange = previousEntry != null
                ? previousEntry.Position - currentEntry.Position
                : null,
            ImgUrl = song.ImgUrl,
            Lyrics = song.Lyrics,
            Youtube = song.Youtube,
            History = history
        };

        return Ok(songDetail);
    }

    /// <summary>
    /// Get song by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<SongDetailDto>> GetSongById(int id)
    {
        var song = await _context.Songs
            .Include(s => s.Artist)
            .Include(s => s.Entries)
            .FirstOrDefaultAsync(s => s.SongId == id);

        if (song == null)
        {
            return NotFound(new { message = "Song not found" });
        }

        // Get current position
        var currentEntry = song.Entries.FirstOrDefault(e => e.Year == MostRecentYear);
        if (currentEntry == null)
        {
            return NotFound(new { message = "Song not in most recent Top 2000" });
        }

        // Get previous position
        var previousEntry = song.Entries.FirstOrDefault(e => e.Year == MostRecentYear - 1);

        // Get last 5 years of history
        var history = song.Entries
            .Where(e => e.Year >= MostRecentYear - 4 && e.Year <= MostRecentYear)
            .OrderBy(e => e.Year)
            .Select(e => new HistoryEntryDto
            {
                Year = e.Year,
                Position = e.Position
            })
            .ToList();

        var songDetail = new SongDetailDto
        {
            SongId = song.SongId,
            Titel = song.Titel,
            ArtistName = song.Artist.Name,
            ReleaseYear = song.ReleaseYear,
            CurrentPosition = currentEntry.Position,
            PreviousPosition = previousEntry?.Position,
            PositionChange = previousEntry != null
                ? previousEntry.Position - currentEntry.Position
                : null,
            ImgUrl = song.ImgUrl,
            Lyrics = song.Lyrics,
            Youtube = song.Youtube,
            History = history
        };

        return Ok(songDetail);
    }

    /// <summary>
    /// Get song history by ID
    /// </summary>
    [HttpGet("{id}/history")]
    public async Task<ActionResult<List<HistoryEntryDto>>> GetSongHistory(int id)
    {
        var song = await _context.Songs
            .Include(s => s.Entries)
            .FirstOrDefaultAsync(s => s.SongId == id);

        if (song == null)
        {
            return NotFound(new { message = "Song not found" });
        }

        var history = song.Entries
            .Where(e => e.Year >= MostRecentYear - 4 && e.Year <= MostRecentYear)
            .OrderBy(e => e.Year)
            .Select(e => new HistoryEntryDto
            {
                Year = e.Year,
                Position = e.Position
            })
            .ToList();

        return Ok(history);
    }

    /// <summary>
    /// Get songs that dropped in position for a given year
    /// Statistic 1: Shows all songs that dropped with biggest drops first
    /// </summary>
    [HttpGet("statistics/dropped-songs")]
    public async Task<ActionResult<List<DroppedSongDto>>> GetDroppedSongs([FromQuery] int year = 2024)
    {
        // Validate year (need previous year data, so start from 2000)
        if (year < 2000 || year > MostRecentYear)
        {
            return BadRequest(new { message = $"Year must be between 2000 and {MostRecentYear}" });
        }

        try
        {
            // Get songs that dropped in the specified year
            var droppedSongs = await (from song in _context.Songs
                                      join artist in _context.Artist on song.ArtistId equals artist.ArtistId
                                      join currentEntry in _context.Top2000Entries
                                          on song.SongId equals currentEntry.SongId
                                      join previousEntry in _context.Top2000Entries
                                          on song.SongId equals previousEntry.SongId
                                      where currentEntry.Year == year
                                          && previousEntry.Year == year - 1
                                          && currentEntry.Position > previousEntry.Position // Dropped (higher position number = lower rank)
                                      orderby (currentEntry.Position - previousEntry.Position) descending // Biggest drops first
                                      select new DroppedSongDto
                                      {
                                          SongId = song.SongId,
                                          Titel = song.Titel,
                                          ArtistName = artist.Name,
                                          ReleaseYear = song.ReleaseYear,
                                          CurrentPosition = currentEntry.Position,
                                          PreviousPosition = previousEntry.Position,
                                          PositionsDropped = currentEntry.Position - previousEntry.Position,
                                          ImgUrl = song.ImgUrl
                                      }).ToListAsync();

            return Ok(droppedSongs);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Error retrieving statistics: {ex.Message}" });
        }
    }

    /// <summary>
    /// Statistic: Songs that appeared in every Top2000 edition.
    /// Returns title, artist and release year.
    /// NOTE: older implementation grouped by SongId; if the same song was imported as multiple Song rows
    /// across years it would be missed. This version groups by title+artist (case-insensitive) so the
    /// endpoint returns songs that appear in every edition even when SongId differs between imports.
    /// </summary>
    [HttpGet("/api/songs/statistics/all-time")]
    [AllowAnonymous]
    public async Task<ActionResult<List<AllTimeSongDto>>> GetAllTimeSongs()
    {
        try
        {
            // how many distinct editions (years) exist in the data
            var totalEditions = await _context.Top2000Entries
                .Select(e => e.Year)
                .Distinct()
                .CountAsync();

            if (totalEditions == 0)
            {
                return Ok(new List<AllTimeSongDto>());
            }

            // Join entries -> songs -> artists and group by normalized (lowercase) title + artist name.
            // This handles cases where the same song was stored as multiple SongId rows across years.
            var groups = await (from e in _context.Top2000Entries
                                join s in _context.Songs on e.SongId equals s.SongId
                                join a in _context.Artist on s.ArtistId equals a.ArtistId
                                select new { s.Titel, ArtistName = a.Name, e.Year, s.ReleaseYear })
                               .GroupBy(x => new { TitleNorm = x.Titel.ToLower(), ArtistNorm = x.ArtistName.ToLower() })
                               .Select(g => new
                               {
                                   // preserve a representative display title/artist and release year
                                   Titel = g.Select(x => x.Titel).FirstOrDefault(),
                                   ArtistName = g.Select(x => x.ArtistName).FirstOrDefault(),
                                   ReleaseYear = g.Select(x => x.ReleaseYear).FirstOrDefault(),
                                   DistinctYearCount = g.Select(x => x.Year).Distinct().Count()
                               })
                               .Where(x => x.DistinctYearCount == totalEditions)
                               .OrderBy(x => x.Titel)
                               .ThenBy(x => x.ArtistName)
                               .ToListAsync();

            var result = groups
                .Select(x => new AllTimeSongDto
                {
                    Titel = x.Titel ?? string.Empty,
                    ArtistName = x.ArtistName ?? string.Empty,
                    ReleaseYear = x.ReleaseYear
                })
                .ToList();

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Error retrieving all-time songs: {ex.Message}" });
        }
    }
}