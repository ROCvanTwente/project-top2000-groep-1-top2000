namespace TemplateJwtProject.Models.DTOs
{
    public class ArtistDetailDto
    {
        public int ArtistId { get; set; }
        public required string Name { get; set; }
        public string? Biography { get; set; }
        public string? PhotoUrl { get; set; }
        public string? WikiUrl { get; set; }
        public string? WebsiteUrl { get; set; }

        public List<ArtistSongDto> Songs { get; set; } = new List<ArtistSongDto>();
    }

    public class ArtistSongDto
    {
        public int SongId { get; set; }
        public string Titel { get; set; }
        public int ReleaseYear { get; set; }
    }
}