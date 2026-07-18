using Microsoft.AspNetCore.Mvc;
using WebApplication1.Repositories;
using WebApplication1.Repository.Interface;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RentalItemController : ControllerBase
    {
        private readonly IRentalItemRepository _repository;

        public RentalItemController(IRentalItemRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IActionResult Get([FromQuery] string lang = "ka")
        {
            var all = _repository.GetAll();

            var result = all.Select(r => new
            {
                r.Id,
                Name = lang == "en" ? r.NameEn : r.NameKa,
                Description = lang == "en" ? r.DescriptionEn : r.DescriptionKa,
                r.PricePerDay,
                r.ImageUrl
            });

            return Ok(result);
        }
    }
}