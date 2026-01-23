using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TemplateJwtProject.Migrations
{
    public partial class AddSpZelfdePositie : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp = @"
                CREATE OR ALTER PROCEDURE GetZelfdePositie
                    @Jaar INT
                AS
                BEGIN
                    -- Selecteer liedjes die op dezelfde positie zijn gebleven
                    SELECT 
                        t.Position AS Positie, 
                        s.Titel AS Titel,
                        a.Name AS ArtiestNaam,
                        s.ReleaseYear AS UitgifteJaar
                    FROM Top2000Entries t
                    JOIN Songs s ON t.SongId = s.SongId       
                    JOIN Artist a ON s.ArtistId = a.ArtistId
                    WHERE t.Year = @Jaar
                    AND EXISTS (
                        -- Check of het nummer vorig jaar op dezelfde positie stond
                        SELECT 1 
                        FROM Top2000Entries t_vorig
                        WHERE t_vorig.SongId = s.SongId 
                        AND t_vorig.Year = (@Jaar - 1)
                        AND t_vorig.Position = t.Position
                    )
                    ORDER BY t.Position ASC;
                END";

            migrationBuilder.Sql(sp);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS GetZelfdePositie");
        }
    }
}
