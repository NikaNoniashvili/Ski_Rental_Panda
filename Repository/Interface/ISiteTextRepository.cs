using System.Data;
using Microsoft.Data.SqlClient;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Repository.Interface;

public interface ISiteTextRepository
{
    List<SiteText> GetAll();
}
