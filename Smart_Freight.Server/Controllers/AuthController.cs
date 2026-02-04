using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Smart_Freight.Server.Dtos.Auth;
using Smart_Freight.Server.Models;
using Smart_Freight.Server.Services;

namespace Smart_Freight.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ITokenService _tokenService;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ITokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser is not null)
        {
            return Conflict(new { message = "Email is already registered." });
        }

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FullName = request.FullName,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        var role = string.IsNullOrWhiteSpace(request.Role) ? "Dispatcher" : request.Role;
        await _userManager.AddToRoleAsync(user, role);

        var (token, expiresAt) = await _tokenService.CreateTokenAsync(user);

        return Ok(new AuthResponse
        {
            AccessToken = token,
            ExpiresAt = expiresAt,
            Email = user.Email ?? string.Empty,
            Role = role
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            return Unauthorized(new { message = "Invalid credentials." });
        }

        if (!user.IsActive)
        {
            return Unauthorized(new { message = "User is disabled." });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded)
        {
            return Unauthorized(new { message = "Invalid credentials." });
        }

        var roles = await _userManager.GetRolesAsync(user);
        var primaryRole = roles.FirstOrDefault() ?? string.Empty;
        var (token, expiresAt) = await _tokenService.CreateTokenAsync(user);

        return Ok(new AuthResponse
        {
            AccessToken = token,
            ExpiresAt = expiresAt,
            Email = user.Email ?? string.Empty,
            Role = primaryRole
        });
    }
}
