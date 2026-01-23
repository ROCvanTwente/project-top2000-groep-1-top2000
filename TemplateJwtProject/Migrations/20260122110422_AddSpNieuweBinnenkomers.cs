using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TemplateJwtProject.Migrations
{
    // De class naam moet matchen met de bestandsnaam (zonder de tijdstempel ervoor)
    public partial class AddSpNieuweBinnenkomers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp = @"
                CREATE OR ALTER PROCEDURE GetNieuweBinnenkomers
                    @Jaar INT
                AS
                BEGIN
                    -- Selecteer de nieuwe binnenkomers
                    SELECT 
                        t.Position AS Positie, 
                        s.Titel AS Titel,              -- Let op: Kolom heet 'Titel' in jouw DB
                        a.Name AS ArtiestNaam,         -- Let op: Kolom heet 'Name' in jouw DB
                        s.ReleaseYear AS UitgifteJaar  -- Let op: Kolom heet 'ReleaseYear' in jouw DB
                    FROM Top2000Entries t
                    JOIN Songs s ON t.SongId = s.SongId       
                    JOIN Artist a ON s.ArtistId = a.ArtistId  -- Let op: Tabel heet 'Artist' (enkelvoud)
                    WHERE t.Year = @Jaar
                    AND NOT EXISTS (
                        -- Check of het nummer vorig jaar al in de lijst stond
                        SELECT 1 
                        FROM Top2000Entries t_vorig
                        WHERE t_vorig.SongId = s.SongId 
                        AND t_vorig.Year = (@Jaar - 1)
                    )
                    ORDER BY t.Position ASC;
                END";

            migrationBuilder.Sql(sp);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS GetNieuweBinnenkomers");
        }
    }
}