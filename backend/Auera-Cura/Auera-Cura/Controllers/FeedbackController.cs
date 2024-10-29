using Auera_Cura.DTO;
using Auera_Cura.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Auera_Cura.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly MyDbContext _db;
        public FeedbackController(MyDbContext db)
        {
            _db = db;
        }

        [HttpGet("GetAllFeedBack")]
        public IActionResult GetAllFeedBack()
        {
            var feedbackList = _db.Testimonials
                .Join(
                    _db.Users,
                    feedback => feedback.UserId,
                    user => user.Id,
                    (feedback, user) => new
                    {
                        feedback.TestimonialId,
                        UserID = user.Id,
                        Username = user.FirstName + " " + user.LastName, // Combine FirstName and LastName
                        feedback.TestimonialMessege,
                        feedback.IsAccept
                    })
                .ToList();

            return Ok(feedbackList);
        }

        [HttpGet("GetActiveFeedback")]
        public IActionResult GetActiveFeedback()
        {
            var activeFeedback = _db.Testimonials
                .Join(
                    _db.Users,
                    feedback => feedback.UserId,
                    user => user.Id,
                    (feedback, user) => new
                    {
                        feedback.TestimonialId,
                        UserID = user.Id,
                        Username = user.FirstName + " " + user.LastName, // Combine FirstName and LastName
                        feedback.TestimonialMessege,
                        feedback.IsAccept
                    })
                .Where(f => f.IsAccept == true) // Only include accepted feedback
                .ToList();

            return Ok(activeFeedback);
        }


        [HttpGet("GetFeedBackById/{id}")]
        public IActionResult GetFeedBackById(int id)
        {
            var FeedBack = _db.Testimonials.Find(id);
            if (FeedBack == null)
            {
                return NotFound();
            }

            return Ok(FeedBack);
        }


        [HttpPost("CreateFeedBack")]
        public IActionResult CreateFeedBack(FeedbackDTO feedbackDto)
        {
            var FeedBack = new Testimonial
            {
                UserId = feedbackDto.UserId,
                TestimonialMessege = feedbackDto.TestimonialMessege,
                IsAccept = false 
            };

            _db.Testimonials.Add(FeedBack);
            _db.SaveChanges();

            return Ok(FeedBack);
        }


        [HttpDelete("DeleteFeedBack/{id}")]
        public IActionResult DeleteFeedBack(int id)
        {
            var FeedBack = _db.Testimonials.Find(id);
            if (FeedBack == null)
            {
                return NotFound();
            }

            _db.Testimonials.Remove(FeedBack);
            _db.SaveChanges();

            return NoContent();
        }


        [HttpPut("UpdateFeedBackIsActive/{id}")]
        public IActionResult UpdateFeedBackIsActive(int id, [FromBody] bool isActive)
        {
            var testimonial = _db.Testimonials.Find(id);
            if (testimonial == null)
            {
                return NotFound();
            }

            testimonial.IsAccept = isActive;
            _db.SaveChanges();

            return NoContent();
        }

    }
}
