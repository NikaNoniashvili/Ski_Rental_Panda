CREATE TABLE [dbo].[GalleryPhoto] (
    [Id]        INT            IDENTITY (1, 1) NOT NULL,
    [TitleKa]   NVARCHAR (200) NOT NULL,
    [TitleEn]   NVARCHAR (200) NOT NULL,
    [ImageUrl]  NVARCHAR (500) NOT NULL,
    [SortOrder] INT            NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

