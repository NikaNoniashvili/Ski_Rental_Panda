namespace WebApplication1.Models;

public class RentalItem
{
    public int Id { get; set; }
    public string NameKa { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string DescriptionKa { get; set; } = string.Empty;
    public string DescriptionEn { get; set; } = string.Empty;
    public decimal PricePerDay { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}
