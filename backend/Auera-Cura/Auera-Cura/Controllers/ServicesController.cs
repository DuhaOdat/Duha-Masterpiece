using Auera_Cura.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Auera_Cura.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly MyDbContext _db;
        public ServicesController( MyDbContext db)
        {
            _db = db;
        }
        [HttpGet("GetAllServices")]
        public IActionResult GetAllServices()
        {
            var service = _db.Services.ToList();
            return Ok(service);
        }
    }
}
