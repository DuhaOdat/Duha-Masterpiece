using Auera_Cura.DTO;
using Auera_Cura.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using MailKit.Net.Smtp;
using MimeKit;

namespace Auera_Cura.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactUsController : ControllerBase
    {
        private readonly MyDbContext _db;

        public ContactUsController(MyDbContext db)
        {
            _db = db;
            
        }
        [HttpGet("getAllContact")]
        public IActionResult getAllContact()
        {
            return Ok(_db.ContactUs.OrderByDescending(c => c.Id).ToList());
        }

        [HttpGet("getContactByStatus")]
        public IActionResult getContactByStatus()
        {
            var contact = _db.ContactUs.Where(l => l.ReplyMessage == null).ToList();
            return Ok(contact);
        }

        [HttpPost("userForm")]
        public IActionResult userForm([FromForm] contactPOST form)
        {
            var data = new ContactU
            {
                Name = form.Name,
                Email = form.Email,
                Subject = form.Sub,
                Message = form.Message,
                CreatedAt = DateTime.Now,
            };
            _db.ContactUs.Add(data);
            _db.SaveChanges();
            return Ok(data);

        }

        [HttpGet("getFormById/{id}")]
        public IActionResult getFormById(int id)
        {
            var contact = _db.ContactUs.FirstOrDefault(c => c.Id == id);
            return Ok(contact);
        }

        [HttpPut("adminForm/{id}")]
        public IActionResult adminForm(int id, [FromForm] contactPUT form)
        {
            var data = _db.ContactUs.FirstOrDefault(l => l.Id == id);

            if (data == null)
            {
                return BadRequest();
            }

            data.ReplyMessage = form.replyMessage;

            _db.ContactUs.Update(data);
            _db.SaveChanges();

            try
            {
                string fromEmail = data.Email;
                string fromName = "Auera Cura";
                string subjectText = "subject";
                string messageText = $@"
                    <html>
                    <body>
                        <h2>Hello {data.Name}</h2>
                        <p>{form.replyMessage}</p>
                        <p>If you have any more questions, feel free to reach out to us.</p>
                        <p>With best regards,<br>Admin</p>
                    </body>
                    </html>";
                string toEmail = data.Email;
                string smtpServer = "smtp.gmail.com";
                int smtpPort = 465; // Port 465 for SSL

                string smtpUsername = "odatduha@gmail.com";
                string smtpPassword = "ijmt lrkb drnt vcao"; // Ensure this is correct

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(fromName, fromEmail));
                message.To.Add(new MailboxAddress("", toEmail));
                message.Subject = subjectText;
                message.Body = new TextPart("html") { Text = messageText };

                using (var client = new MailKit.Net.Smtp.SmtpClient())

                {
                    client.Connect(smtpServer, smtpPort, true); // Use SSL
                    client.Authenticate(smtpUsername, smtpPassword);
                    client.Send(message);
                    client.Disconnect(true);
                }
            }
            catch { return BadRequest(); }

            return Ok(data);

        }
    }
}
