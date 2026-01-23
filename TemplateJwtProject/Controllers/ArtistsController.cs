using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TemplateJwtProject.Data;
using TemplateJwtProject.Models.DTOs;

namespace TemplateJwtProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtistsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ArtistsController(AppDbContext context)
        {
            _context = context;
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<ArtistDetailDto>> GetArtist(int id)
        {
            var artist = await _context.Artist
                .Include(a => a.Songs)
                .FirstOrDefaultAsync(a => a.ArtistId == id);

            if (artist == null)
            {
                return NotFound();
            }

            
            var dto = new ArtistDetailDto
            {
                ArtistId = artist.ArtistId,
                Name = artist.Name,
                Biography = artist.Biography,
                PhotoUrl = artist.Photo,      
                WikiUrl = artist.Wiki,       
                WebsiteUrl = artist.WebsiteUrl, 
                Songs = artist.Songs.Select(s => new ArtistSongDto
                {
                    SongId = s.SongId,
                    Titel = s.Titel,
                    ReleaseYear = s.ReleaseYear ?? 0
                }).ToList()
            };

            return Ok(dto);
        }

       
        [HttpGet("all-with-counts")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllArtistsWithCounts()
        {
            var result = await _context.Artist
                .Select(a => new
                {
                    a.ArtistId,
                    a.Name,
                    SongCount = _context.Top2000Entries.Count(t => t.Song.ArtistId == a.ArtistId)
                })
                .OrderByDescending(x => x.SongCount) 
                .ToListAsync();

            return Ok(result);
        }
    }
}