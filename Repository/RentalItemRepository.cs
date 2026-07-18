using System.Data;
using Microsoft.Data.SqlClient;
using WebApplication1.Models;
using WebApplication1.Repository.Interface;
using WebApplication1.Services;

namespace WebApplication1.Repositories;

public class RentalItemRepository : IRentalItemRepository
{
    private readonly DatabaseService _databaseService;

    public RentalItemRepository(DatabaseService databaseService)
    {
        _databaseService = databaseService;
    }

    public List<RentalItem> GetAll()
    {
        var items = new List<RentalItem>();

        using (var connection = (SqlConnection)_databaseService.GetConnection())
        {
            connection.Open();

            string query = "SELECT Id, NameKa, NameEn, DescriptionKa, DescriptionEn, PricePerDay, ImageUrl FROM RentalItem";

            using (var command = new SqlCommand(query, connection))
            {
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        items.Add(new RentalItem
                        {
                            Id = Convert.ToInt32(reader["Id"]),
                            NameKa = reader["NameKa"].ToString() ?? string.Empty,
                            NameEn = reader["NameEn"].ToString() ?? string.Empty,
                            DescriptionKa = reader["DescriptionKa"].ToString() ?? string.Empty,
                            DescriptionEn = reader["DescriptionEn"].ToString() ?? string.Empty,
                            PricePerDay = Convert.ToDecimal(reader["PricePerDay"]),
                            ImageUrl = reader["ImageUrl"].ToString() ?? string.Empty
                        });
                    }
                }
            }
        }

        return items;
    }
}