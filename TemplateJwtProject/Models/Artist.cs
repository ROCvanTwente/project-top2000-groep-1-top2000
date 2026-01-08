using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TemplateJwtProject.Models
{
    [Table("Artist")]
    public class Artist
    {
        [Key]
        public int ArtistId { get; set; }

        [Required]
        public string Name { get; set; } = null!;

        public string? Wiki { get; set; }

        public string? Biography { get; set; }

        public string? Photo { get; set; }

        public ICollection<Song> Songs { get; set; } = new List<Song>();
    }
}