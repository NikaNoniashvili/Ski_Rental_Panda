CREATE TABLE [dbo].[SiteText] (
    [Id]      INT            IDENTITY (1, 1) NOT NULL,
    [KeyName] NVARCHAR (100) NOT NULL,
    [ValueKa] NVARCHAR (500) NOT NULL,
    [ValueEn] NVARCHAR (500) NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    UNIQUE NONCLUSTERED ([KeyName] ASC)
);

