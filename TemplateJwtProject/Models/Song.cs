using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TemplateJwtProject.Models
{
    [Table("Songs")]
    public class Song
    {
        [Key]
        public int SongId { get; set; }

        [ForeignKey(nameof(Artist))]
        public int ArtistId { get; set; }

        [Column("Titel")]
        [Required]
        public string Title { get; set; } = null!;

        public int? ReleaseYear { get; set; }

        public string? ImgUrl { get; set; }

        public string? Lyrics { get; set; }

        public string? Youtube { get; set; }

        public Artist? Artist { get; set; }
    }
}