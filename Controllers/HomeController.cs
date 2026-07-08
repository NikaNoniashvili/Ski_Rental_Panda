using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index() => View();
        public IActionResult About() => View();
        public IActionResult Gallery() => View();
        public IActionResult Location() => View();
        public IActionResult Contact() => View();
    }
}