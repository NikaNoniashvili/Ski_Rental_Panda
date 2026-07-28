using Microsoft.AspNetCore.Mvc;
using WebApplication1.Repositories;
using WebApplication1.Repository.Interface;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SiteTextController : ControllerBase
    {
        private readonly ISiteTextRepository _repository;

        public SiteTextController(ISiteTextRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IActionResult Get([FromQuery] string lang = "ka")
        {
            var all = _repository.GetAll();

            var dict = all.ToDictionary(
                t => t.KeyName,
                t => lang == "en" ? t.ValueEn : (lang == "ru" ? t.ValueRu : t.ValueKa)
            );

            return Ok(dict);
        }
    }
}