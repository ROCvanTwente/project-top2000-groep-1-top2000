CREATE TABLE [dbo].[Artist] (
    [ArtistId]  INT IDENTITY(1,1)     NOT NULL,
    [Name]      NVARCHAR(200)         NOT NULL,
    [Wiki]      NVARCHAR(500)         NULL,
    [Biography] NVARCHAR(MAX)         NULL,
    [Photo]     NVARCHAR(500)         NULL,
    CONSTRAINT [PK_Artist] PRIMARY KEY CLUSTERED ([ArtistId] ASC)
);

CREATE TABLE [dbo].[Songs] (
    [SongId]      INT IDENTITY(1,1) NOT NULL,
    [ArtistId]    INT               NOT NULL,
    [Titel]       NVARCHAR(200)     NOT NULL,
    [ReleaseYear] INT               NULL,
    [ImgUrl]      NVARCHAR(500)     NULL,
    [Lyrics]      NVARCHAR(MAX)     NULL,
    [Youtube]     NVARCHAR(500)     NULL,
    CONSTRAINT [PK_Songs] PRIMARY KEY CLUSTERED ([SongId] ASC),
    CONSTRAINT [FK_Songs_Artist_ArtistId]
        FOREIGN KEY ([ArtistId]) REFERENCES [dbo].[Artist] ([ArtistId])
);


CREATE TABLE [dbo].[Top2000Entries] (
    [SongId]  INT NOT NULL,
    [Year]    INT NOT NULL,
    [Position] INT NOT NULL,
    CONSTRAINT [PK_Top2000Entries] 
        PRIMARY KEY CLUSTERED ([SongId] ASC, [Year] ASC),
    CONSTRAINT [FK_Top2000Entries_Songs_SongId]
        FOREIGN KEY ([SongId]) REFERENCES [dbo].[Songs] ([SongId])
);

CREATE NONCLUSTERED INDEX [IX_Top2000Entries_Year_Position]
    ON [dbo].[Top2000Entries] ([Year] ASC, [Position] ASC);
