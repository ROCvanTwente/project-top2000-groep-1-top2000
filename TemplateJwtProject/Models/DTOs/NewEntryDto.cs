namespace TemplateJwtProject.Models.DTOs
{
    public class NewEntryDto
    {
        public int Positie { get; set; }
        public required string Titel { get; set; }      
        public required string ArtiestNaam { get; set; } 
        public int UitgifteJaar { get; set; }
    }
}