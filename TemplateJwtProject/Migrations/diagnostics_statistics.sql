-- ===============================================
-- STATISTICS DIAGNOSTIC SCRIPT
-- Run this to check if your data is ready for statistics
-- ===============================================

-- 1. Check which years you have data for
SELECT Year, COUNT(*) as SongCount
FROM Top2000Entries
GROUP BY Year
ORDER BY Year DESC;

-- Expected: You should see 2000 songs for years 2000-2024

-- 2. Check if you have BOTH 2023 and 2024 data (required for 2024 statistics)
SELECT 
    CASE 
        WHEN EXISTS(SELECT 1 FROM Top2000Entries WHERE Year = 2023) THEN 'YES' 
        ELSE 'NO' 
    END as Has2023Data,
    CASE 
        WHEN EXISTS(SELECT 1 FROM Top2000Entries WHERE Year = 2024) THEN 'YES' 
        ELSE 'NO' 
    END as Has2024Data,
    CASE 
        WHEN EXISTS(SELECT 1 FROM Top2000Entries WHERE Year = 2023) 
         AND EXISTS(SELECT 1 FROM Top2000Entries WHERE Year = 2024) 
        THEN '? READY for 2024 statistics' 
        ELSE '? MISSING DATA - Cannot show 2024 statistics' 
    END as Status;

-- 3. Count how many songs dropped in 2024 vs 2023
SELECT COUNT(*) as DroppedSongsCount
FROM Top2000Entries current
INNER JOIN Top2000Entries previous ON current.SongId = previous.SongId
WHERE current.Year = 2024 
  AND previous.Year = 2023
  AND current.Position > previous.Position;

-- If this returns 0, either:
-- A) No songs dropped (unlikely)
-- B) Missing data for 2023 or 2024

-- 4. Check sample of songs that should appear in statistics
SELECT TOP 10
    s.Titel,
    a.Name as Artist,
    current.Position as Position2024,
    previous.Position as Position2023,
    (current.Position - previous.Position) as Dropped
FROM Top2000Entries current
INNER JOIN Top2000Entries previous ON current.SongId = previous.SongId
INNER JOIN Songs s ON current.SongId = s.SongId
INNER JOIN Artist a ON s.ArtistId = a.ArtistId
WHERE current.Year = 2024 
  AND previous.Year = 2023
  AND current.Position > previous.Position
ORDER BY (current.Position - previous.Position) DESC;

-- 5. Check if you have Artists and Songs tables populated
SELECT 
    (SELECT COUNT(*) FROM Artist) as ArtistCount,
    (SELECT COUNT(*) FROM Songs) as SongCount,
    (SELECT COUNT(*) FROM Top2000Entries) as TotalEntries;

-- Expected:
-- ArtistCount: ~1000-2000
-- SongCount: ~2000
-- TotalEntries: Depends on years (e.g., 25 years * 2000 = 50,000)

-- ===============================================
-- TROUBLESHOOTING GUIDE
-- ===============================================
/*

ISSUE: "No dropped songs found"
SOLUTIONS:
1. Make sure you have data for BOTH 2023 AND 2024
2. Run your data import script (top2000_script.sql)
3. Check if year 2024 is in MostRecentYear constant in SongsController.cs

ISSUE: "Year must be between 2000 and 2024"
SOLUTIONS:
1. Select a year from the dropdown (2000-2024)
2. Don't manually edit the URL

ISSUE: "Failed to load statistics"
SOLUTIONS:
1. Check backend is running (https://localhost:7003)
2. Check browser console for detailed error message
3. Run this diagnostic script
4. Check CORS settings in appsettings.Development.json

*/
