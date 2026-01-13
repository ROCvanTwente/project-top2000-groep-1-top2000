namespace TemplateJwtProject.Models;

public class Top2000Entry
{
    public int SongId { get; set; }
    public int Year { get; set; }
    public int Position { get; set; }
    
    // Navigation property
    public Song Song { get; set; } = null!;
}
