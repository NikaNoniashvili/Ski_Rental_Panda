using Microsoft.AspNetCore.Mvc;
using WebApplication1.Repository.Interface;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GalleryPhotoController : ControllerBase
    {
        private readonly IGalleryPhotoRepository _repository;

        public GalleryPhotoController(IGalleryPhotoRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IActionResult Get([FromQuery] string lang = "ka")
        {
            var all = _repository.GetAll();

            var result = all.Select(p => new
            {
                p.Id,
                Title = lang == "en" ? p.TitleEn : p.TitleKa,
                p.ImageUrl,
                p.SortOrder
            });

            return Ok(result);
        }
    }
}