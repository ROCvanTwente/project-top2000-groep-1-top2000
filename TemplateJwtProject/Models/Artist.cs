using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TemplateJwtProject.Models
{
    [Table("Artist")] 
    public class Artist
    {
        [Key]
        public int ArtistId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Wiki { get; set; }
        public string? Biography { get; set; }
        public string? Photo { get; set; }

        public string? WebsiteUrl { get; set; }

        public ICollection<Song> Songs { get; set; } = new List<Song>();
    }
}