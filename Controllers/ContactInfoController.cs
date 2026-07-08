using Microsoft.AspNetCore.Mvc;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactInfoController : ControllerBase
    {
        private readonly IContactInfoRepository _repository;

        public ContactInfoController(IContactInfoRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IActionResult Get([FromQuery] string lang = "ka")
        {
            var info = _repository.Get();

            if (info == null)
                return NotFound();

            var result = new
            {
                Address = lang == "en" ? info.AddressEn : info.AddressKa,
                info.Phone,
                info.Email,
                WorkingHours = lang == "en" ? info.WorkingHoursEn : info.WorkingHoursKa,
                info.FacebookUrl,
                info.InstagramUrl,
                info.MapEmbedUrl
            };

            return Ok(result);
        }
    }
}