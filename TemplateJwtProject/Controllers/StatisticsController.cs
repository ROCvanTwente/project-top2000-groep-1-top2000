using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TemplateJwtProject.Data;
using TemplateJwtProject.Models.DTOs;

namespace TemplateJwtProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatisticsController(AppDbContext context)
        {
            _context = context;
        }


        // endpoint for nieuwe binnenkomers
        [HttpGet("nieuwe-binnenkomers/{jaar}")]
        public async Task<ActionResult<IEnumerable<NewEntryDto>>> GetNieuweBinnenkomers(int jaar)
        {
            if (jaar < 2000 || jaar > 2025)
            {
                return BadRequest("Kies een jaar tussen 2000 en 2025.");
            }

            var result = await _context.Database
                .SqlQuery<NewEntryDto>($"EXEC GetNieuweBinnenkomers @Jaar = {jaar}")
                .ToListAsync();

            return Ok(result);
        }

        // endpoint for verdwenen nummers
        [HttpGet("verdwenen-nummers/{jaar}")]
        public async Task<ActionResult<IEnumerable<LostEntryDto>>> GetVerdwenenNummers(int jaar)
        {
            var result = await _context.Database
                .SqlQueryRaw<LostEntryDto>("EXEC GetVerdwenenNummers @Jaar",
                    new Microsoft.Data.SqlClient.SqlParameter("@Jaar", jaar))
                .ToListAsync();

            return Ok(result);
        }

        // endpoint for opnieuw binnenkomers
        [HttpGet("opnieuw-binnenkomers/{jaar}")]
        public async Task<ActionResult<IEnumerable<NewEntryDto>>> GetOpnieuwBinnenkomers(int jaar)
        {
            var result = await _context.Database
                .SqlQueryRaw<NewEntryDto>("EXEC GetOpnieuwBinnenkomers @Jaar",
                    new Microsoft.Data.SqlClient.SqlParameter("@Jaar", jaar))
                .ToListAsync();

            return Ok(result);
        }

        // endpoint for volledige lijst
        [HttpGet("full-list/{jaar}")]
        public async Task<ActionResult<IEnumerable<object>>> GetFullList(int jaar)
        {
            var list = await _context.Top2000Entries
                .Where(t => t.Year == jaar)
                .OrderBy(t => t.Position) 
                .Select(t => new {
                    t.Position,
                    t.SongId,
                    SongTitle = t.Song.Titel,
                    ArtistId = t.Song.Artist.ArtistId,
                    ArtistName = t.Song.Artist.Name,
                    t.Song.ReleaseYear
                })
                .ToListAsync();

            return Ok(list);
        }

        // endpoint for zelfde positie
        [HttpGet("zelfde-positie/{jaar}")]
        public async Task<ActionResult<IEnumerable<SamePositionSongDto>>> GetZelfdePositie(int jaar)
        {
            var result = await _context.Database
                .SqlQueryRaw<SamePositionSongDto>("EXEC GetZelfdePositie @Jaar",
                    new Microsoft.Data.SqlClient.SqlParameter("@Jaar", jaar))
                .ToListAsync();

            return Ok(result);
        }
    }
}