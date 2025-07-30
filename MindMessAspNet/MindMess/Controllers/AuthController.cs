using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindMess.Data;
using MindMess.Helpers;
using MindMess.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace MindMess.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly EmailService _email;
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        private static readonly Dictionary<string, DateTime> _magicLinkCooldown = new();
        private static readonly TimeSpan _cooldownDuration = TimeSpan.FromMinutes(2);

        public AuthController(AppDbContext db, IConfiguration config, EmailService email)
        {
            _db = db;
            _config = config;
            _email = email;
        }

        [HttpPost("request-magic-link")]
        public async Task<IActionResult> RequestMagicLink([FromBody] EmailDto dto)
        {
            var email = dto.Email.Trim().ToLower();

            // Check cooldown
            if (_magicLinkCooldown.TryGetValue(email, out var lastSent))
            {
                var sinceLast = DateTime.UtcNow - lastSent;
                if (sinceLast < _cooldownDuration)
                {
                    var remaining = (int)(_cooldownDuration - sinceLast).TotalSeconds;
                    return BadRequest(new { error = $"Please wait {remaining} seconds before requesting a new link." });
                }
            }

            // Find or create user BEFORE generating token
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                user = new User { Email = email };
                _db.Users.Add(user);
                await _db.SaveChangesAsync();
            }

            var token = JwtHelper.GenerateLoginToken(user.Id, email, _config["JwtSecret"]!);

            user.MagicLinkToken = token;
            user.TokenExpiration = DateTime.UtcNow.AddMinutes(10);
            await _db.SaveChangesAsync();

            var magicLink = $"http://localhost:5173/auth/verify?token={token}";
            await _email.SendMagicLinkAsync(email, magicLink);

            _magicLinkCooldown[email] = DateTime.UtcNow;

            return Ok(new { success = true });
        }


        [HttpPost("validate-token")]
        public async Task<IActionResult> ValidateToken([FromBody] string token)
        {
            var claims = JwtHelper.Validate(token, _config["JwtSecret"]!);
            if (claims == null) return Unauthorized();

            var email = claims.FindFirstValue("email") ??
                claims.FindFirstValue(JwtRegisteredClaimNames.Email) ??
                claims.FindFirstValue(ClaimTypes.Email);

            if (email == null) return Unauthorized();

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email && u.MagicLinkToken == token);
            if (user == null || user.TokenExpiration < DateTime.UtcNow)
                return Unauthorized();

            var sessionToken = JwtHelper.GenerateLoginToken(user.Id, user.Email, _config["JwtSecret"]!, 60 * 24 * 30);
            return Ok(new { token = sessionToken });
        }
    }

    public record EmailDto(string Email);

}
