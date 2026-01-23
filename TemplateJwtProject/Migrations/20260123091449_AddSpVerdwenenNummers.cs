using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TemplateJwtProject.Migrations
{
    public partial class AddSpVerdwenenNummers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp = @"
        CREATE OR ALTER PROCEDURE GetVerdwenenNummers
            @Jaar INT
        AS
        BEGIN
            -- We zoeken nummers uit @Jaar - 1 (vorig jaar)
            -- Die NIET bestaan in @Jaar (huidige jaar)
            SELECT 
                t.Position AS PositieVorigJaar, 
                s.Titel AS Titel, 
                a.Name AS ArtiestNaam, 
                s.ReleaseYear AS UitgifteJaar
            FROM Top2000Entries t
            JOIN Songs s ON t.SongId = s.SongId
            JOIN Artist a ON s.ArtistId = a.ArtistId
            WHERE t.Year = (@Jaar - 1)
            AND NOT EXISTS (
                SELECT 1 
                FROM Top2000Entries t_nu
                WHERE t_nu.SongId = s.SongId 
                AND t_nu.Year = @Jaar
            )
            ORDER BY t.Position ASC;
        END";

            migrationBuilder.Sql(sp);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS GetVerdwenenNummers");
        }
    }
}
