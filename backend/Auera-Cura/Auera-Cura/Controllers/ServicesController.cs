using Auera_Cura.DTO;
using Auera_Cura.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        // GET: api/Services/Active
        [HttpGet("Active")]
        public IActionResult GetActiveServices()
        {
            var activeServices= _db.Services.Where(s =>s.IsActive==true).ToList();
            return Ok(activeServices);
        }
        // POST: api/Services
        [HttpPost("AddService")]
        public IActionResult AddService([FromForm] ServiceDTO servicedto)
        {
            var service = new Service
            {
                ServiceName = servicedto.ServiceName,
                ServiceDescription = servicedto.ServiceDescription,
                ServiceIcon = servicedto.ServiceIcon,
                ServiceLink = servicedto.ServiceLink,
                IsActive = servicedto.IsActive,
                CreatedDate = DateTime.Now
            };

            _db.Services.Add(service);
            _db.SaveChanges();

            return Ok(service);
        }

        [HttpGet("GetService/{id}")]
        public IActionResult GetService(int id)
        {
            var service = _db.Services.Find(id);
            if (service == null)
            {
                return NotFound();
            }
            return Ok(service);
        }


        // PUT: api/Services/{id}
        [HttpPut("EditService/{id}")]
        public IActionResult EditService(int id, ServiceDTO servicedto)
        {

            var service =  _db.Services.Find(id);
            if (service == null)
            {
                return NotFound();
            }

           
            service.ServiceName = servicedto.ServiceName;
            service.ServiceDescription = servicedto.ServiceDescription;
            service.ServiceIcon = servicedto.ServiceIcon;
            service.ServiceLink = servicedto.ServiceLink;
            service.IsActive = servicedto.IsActive;

       
            _db.SaveChanges();

            return NoContent();
        }


        // DELETE: api/Services/{id}
        [HttpDelete("DeleteService/{id}")]
        public IActionResult DeleteService(int id)
        {
            var service =  _db.Services.Find(id);
            if (service == null)
            {
                return NotFound();
            }

            _db.Services.Remove(service);
            _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
