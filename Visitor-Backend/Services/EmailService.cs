using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using Visitor_Backend.Models;

namespace Visitor_Backend.Services;

/// <summary>
/// EMAIL SERVICE: Sends notifications using SMTP.
/// Simplified with C# 12 Primary Constructors.
/// </summary>
public class EmailService(IOptions<EmailSettings> emailSettings) : IEmailService
{
    private readonly EmailSettings _settings = emailSettings.Value;

    public async Task SendEmailAsync(string email, string subject, string body)
    {
        using var client = new SmtpClient(_settings.SmtpServer, _settings.SmtpPort)
        {
            Credentials = new NetworkCredential(_settings.SmtpUser, _settings.SmtpPass),
            EnableSsl = true
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(_settings.FromEmail, _settings.FromName),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };
        
        mailMessage.To.Add(email);
        await client.SendMailAsync(mailMessage);
    }
}
