using Auera_Cura;
using System.Net.Mail;
using System.Net;

namespace Auera_Cura.Services
{
    public class EmailService : IEmailService
{
    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        var smtpClient = new SmtpClient("smtp.gmail.com")
        {
            Port = 587,
            Credentials = new NetworkCredential("odatduha@gmail.com", "ijmt lrkb drnt vcao"),
            EnableSsl = true,
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress("duhaodat96@gmail.com"),
            Subject = subject,
            Body = message,
            IsBodyHtml = true,
        };
        mailMessage.To.Add(toEmail);

        await smtpClient.SendMailAsync(mailMessage);
    }
}

}