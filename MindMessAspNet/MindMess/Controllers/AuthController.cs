using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindMess.Data;
using MindMess.Helpers;
using MindMess.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace MindMess.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        [HttpPost("request-magic-link")]
        public async Task<IActionResult> RequestMagicLink([FromBody] EmailDto dto)
        {
            var token = JwtHelper.GenerateLoginToken(dto.Email, _config["JwtSecret"]!);

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
            {
                user = new User { Email = dto.Email };
                _db.Users.Add(user);
            }

            user.MagicLinkToken = token;
            user.TokenExpiration = DateTime.UtcNow.AddMinutes(10);
            await _db.SaveChangesAsync();

            // TODO: Email the link
            Console.WriteLine($"Fake email to {dto.Email}: https://your-frontend.com/magic-login?token={token}");

            return Ok(new { success = true });
        }

        [HttpGet("validate-token")]
        public async Task<IActionResult> ValidateToken([FromQuery] string token)
        {
            var claims = JwtHelper.Validate(token, _config["JwtSecret"]!);
            if (claims == null) return Unauthorized();

            var email = claims.FindFirstValue(ClaimTypes.NameIdentifier) ??
                        claims.FindFirstValue(JwtRegisteredClaimNames.Sub);

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email && u.MagicLinkToken == token);
            if (user == null || user.TokenExpiration < DateTime.UtcNow)
                return Unauthorized();

            // Final user session token
            var sessionToken = JwtHelper.GenerateLoginToken(user.Email, _config["JwtSecret"]!, 60 * 24 * 30); // 30 days

            return Ok(new { token = sessionToken });
        }
    }

    public record EmailDto(string Email);

}
