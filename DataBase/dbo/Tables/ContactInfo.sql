CREATE TABLE [dbo].[ContactInfo] (
    [Id]             INT            NOT NULL,
    [AddressKa]      NVARCHAR (300) NOT NULL,
    [AddressEn]      NVARCHAR (300) NOT NULL,
    [Phone]          NVARCHAR (50)  NOT NULL,
    [Email]          NVARCHAR (100) NOT NULL,
    [WorkingHoursKa] NVARCHAR (200) NOT NULL,
    [WorkingHoursEn] NVARCHAR (200) NOT NULL,
    [FacebookUrl]    NVARCHAR (300) NOT NULL,
    [InstagramUrl]   NVARCHAR (300) NOT NULL,
    [MapEmbedUrl]    NVARCHAR (500) NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

