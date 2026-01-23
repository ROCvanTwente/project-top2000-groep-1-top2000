-- Manual SQL Script to Create GetZelfdePositie Stored Procedure
-- Run this in your database if the migration didn't apply automatically

IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'GetZelfdePositie')
BEGIN
    DROP PROCEDURE GetZelfdePositie;
END
GO

CREATE PROCEDURE GetZelfdePositie
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
END
GO

-- Test the stored procedure
EXEC GetZelfdePositie @Jaar = 2024;
