using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TemplateJwtProject.Migrations
{
    /// <inheritdoc />
    public partial class AddSpOpnieuwBinnenkomers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp = @"
        CREATE OR ALTER PROCEDURE GetOpnieuwBinnenkomers
            @Jaar INT
        AS
        BEGIN
            SELECT 
                t.Position AS Positie, 
                s.Titel AS Titel, 
                a.Name AS ArtiestNaam, 
                s.ReleaseYear AS UitgifteJaar
            FROM Top2000Entries t
            JOIN Songs s ON t.SongId = s.SongId
            JOIN Artist a ON s.ArtistId = a.ArtistId
            WHERE t.Year = @Jaar
            
            -- CONDITIE 1: Stond er vorig jaar NIET in
            AND NOT EXISTS (
                SELECT 1 
                FROM Top2000Entries t_vorig
                WHERE t_vorig.SongId = s.SongId 
                AND t_vorig.Year = (@Jaar - 1)
            )

            -- CONDITIE 2: Heeft er in het verleden WEL ooit in gestaan (voor vorig jaar)
            AND EXISTS (
                SELECT 1 
                FROM Top2000Entries t_historie
                WHERE t_historie.SongId = s.SongId 
                AND t_historie.Year < (@Jaar - 1)
            )
            ORDER BY t.Position ASC;
        END";

            migrationBuilder.Sql(sp);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS GetOpnieuwBinnenkomers");
        }
    }
}
