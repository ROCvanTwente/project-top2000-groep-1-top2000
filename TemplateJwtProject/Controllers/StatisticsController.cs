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
    }
}