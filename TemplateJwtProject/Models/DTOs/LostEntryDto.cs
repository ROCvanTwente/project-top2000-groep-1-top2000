namespace TemplateJwtProject.Models.DTOs
{
    public class LostEntryDto
    {
        public int PositieVorigJaar { get; set; } 
        public required string Titel { get; set; }
        public required string ArtiestNaam { get; set; }
        public int UitgifteJaar { get; set; }
    }
}