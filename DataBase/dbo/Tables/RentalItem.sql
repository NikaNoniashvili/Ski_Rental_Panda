CREATE TABLE [dbo].[RentalItem] (
    [Id]            INT             IDENTITY (1, 1) NOT NULL,
    [NameKa]        NVARCHAR (200)  NOT NULL,
    [NameEn]        NVARCHAR (200)  NOT NULL,
    [DescriptionKa] NVARCHAR (500)  NOT NULL,
    [DescriptionEn] NVARCHAR (500)  NOT NULL,
    [PricePerDay]   DECIMAL (10, 2) NOT NULL,
    [ImageUrl]      NVARCHAR (500)  NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

