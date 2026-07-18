using System.Data;
using Microsoft.Data.SqlClient;
using WebApplication1.Models;
using WebApplication1.Repository.Interface;
using WebApplication1.Services;

namespace WebApplication1.Repositories;

public class ContactInfoRepository : IContactInfoRepository
{
    private readonly DatabaseService _databaseService;

    public ContactInfoRepository(DatabaseService databaseService)
    {
        _databaseService = databaseService;
    }

    public ContactInfo? Get()
    {
        using (var connection = (SqlConnection)_databaseService.GetConnection())
        {
            connection.Open();

            string query = "SELECT Id, AddressKa, AddressEn, Phone, Email, WorkingHoursKa, WorkingHoursEn, FacebookUrl, InstagramUrl, MapEmbedUrl FROM ContactInfo WHERE Id = 1";

            using (var command = new SqlCommand(query, connection))
            {
                using (var reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return new ContactInfo
                        {
                            Id = Convert.ToInt32(reader["Id"]),
                            AddressKa = reader["AddressKa"].ToString() ?? string.Empty,
                            AddressEn = reader["AddressEn"].ToString() ?? string.Empty,
                            Phone = reader["Phone"].ToString() ?? string.Empty,
                            Email = reader["Email"].ToString() ?? string.Empty,
                            WorkingHoursKa = reader["WorkingHoursKa"].ToString() ?? string.Empty,
                            WorkingHoursEn = reader["WorkingHoursEn"].ToString() ?? string.Empty,
                            FacebookUrl = reader["FacebookUrl"].ToString() ?? string.Empty,
                            InstagramUrl = reader["InstagramUrl"].ToString() ?? string.Empty,
                            MapEmbedUrl = reader["MapEmbedUrl"].ToString() ?? string.Empty
                        };
                    }
                }
            }
        }

        return null;
    }
}