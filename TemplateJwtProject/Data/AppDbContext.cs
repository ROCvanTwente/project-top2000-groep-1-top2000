using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TemplateJwtProject.Models;

namespace TemplateJwtProject.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Song> Songs { get; set; }
    public DbSet<Artist> Artist { get; set; }
    public DbSet<Top2000Entry> Top2000Entries { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        // RefreshToken configuratie
        builder.Entity<RefreshToken>()
            .HasOne(rt => rt.User)
            .WithMany()
            .HasForeignKey(rt => rt.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<RefreshToken>()
            .HasIndex(rt => rt.Token)
            .IsUnique();

        // Artist configuratie
        builder.Entity<Artist>(entity =>
        {
            entity.ToTable("Artist");
            entity.HasKey(e => e.ArtistId);
            entity.Property(e => e.ArtistId).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Wiki).HasMaxLength(500);
            entity.Property(e => e.Photo).HasMaxLength(500);
        });

        // Song configuratie
        builder.Entity<Song>(entity =>
        {
            entity.ToTable("Songs");
            entity.HasKey(e => e.SongId);
            entity.Property(e => e.SongId).ValueGeneratedOnAdd();
            entity.Property(e => e.Titel).IsRequired().HasMaxLength(200);
            entity.Property(e => e.ImgUrl).HasMaxLength(500);
            entity.Property(e => e.Youtube).HasMaxLength(500);
            
            entity.HasOne(s => s.Artist)
                .WithMany(a => a.Songs)
                .HasForeignKey(s => s.ArtistId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Top2000Entry configuratie
        builder.Entity<Top2000Entry>(entity =>
        {
            entity.ToTable("Top2000Entries");
            entity.HasKey(e => new { e.SongId, e.Year });
            
            entity.HasOne(e => e.Song)
                .WithMany(s => s.Entries)
                .HasForeignKey(e => e.SongId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasIndex(e => new { e.Year, e.Position })
                .HasDatabaseName("IX_Top2000Entries_Year_Position");
        });
    }
}
