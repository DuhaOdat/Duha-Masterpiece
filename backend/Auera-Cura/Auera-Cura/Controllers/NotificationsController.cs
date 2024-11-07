using Auera_Cura.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auera_Cura.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly MyDbContext _db;
        public NotificationsController(MyDbContext db)
        {
            _db = db;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetNotifications(int userId)
        {
            // Fetch notifications for a specific user, ordered by date
            var notifications = await _db.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedDate)
                .Select(n => new
                {
                    n.NotificationId,
                    n.Message,
                    n.IsRead,
                    n.CreatedDate
                })
                .ToListAsync();

            if (notifications == null || !notifications.Any())
            {
                return NotFound("No notifications found for this user.");
            }

            return Ok(notifications);
        }


        [HttpPut("markAsRead/{userId}")]
        public async Task<IActionResult> MarkNotificationsAsRead(int userId)
        {
            var notifications = await _db.Notifications
               .Where(n => n.UserId == userId && (n.IsRead == false || n.IsRead == null)) // تعديل الشرط للتحقق من أن IsRead هو false أو null
               .ToListAsync();


            if (notifications == null || !notifications.Any())
            {
                return NotFound("No unread notifications found for this user.");
            }

            // تحديث حالة كل إشعار غير مقروء إلى مقروء
            notifications.ForEach(n => n.IsRead = true); // تعيين IsRead إلى 1 ليصبح مقروءًا
            await _db.SaveChangesAsync();

            return Ok(new { message = "Notifications marked as read." });
        }



    }
}
