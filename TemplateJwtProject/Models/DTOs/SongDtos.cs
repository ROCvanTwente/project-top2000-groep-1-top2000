namespace TemplateJwtProject.Models.DTOs;

public class SongDto
{
    public int SongId { get; set; }
    public string Titel { get; set; } = string.Empty;
    public string ArtistName { get; set; } = string.Empty;
    public int? ReleaseYear { get; set; }
    public int CurrentPosition { get; set; }
    public int? PreviousPosition { get; set; }
    public int? PositionChange { get; set; }
    public string? ImgUrl { get; set; }
}

public class SongDetailDto
{
    public int SongId { get; set; }
    public string Titel { get; set; } = string.Empty;
    public string ArtistName { get; set; } = string.Empty;
    public int? ReleaseYear { get; set; }
    public int CurrentPosition { get; set; }
    public int? PreviousPosition { get; set; }
    public int? PositionChange { get; set; }
    public string? ImgUrl { get; set; }
    public string? Lyrics { get; set; }
    public string? Youtube { get; set; }
    public List<HistoryEntryDto> History { get; set; } = new();
}

public class HistoryEntryDto
{
    public int Year { get; set; }
    public int Position { get; set; }
}

public class PaginatedSongsDto
{
    public List<SongDto> Songs { get; set; } = new();
    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public int TotalSongs { get; set; }
    public int PageSize { get; set; }
}

public class DroppedSongDto
{
    public int SongId { get; set; }
    public string Titel { get; set; } = string.Empty;
    public string ArtistName { get; set; } = string.Empty;
    public int? ReleaseYear { get; set; }
    public int CurrentPosition { get; set; }
    public int PreviousPosition { get; set; }
    public int PositionsDropped { get; set; }
    public string? ImgUrl { get; set; }
}
