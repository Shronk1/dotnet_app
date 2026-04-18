using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace dotnet_app.Server.Models
{
    public class UserDto
    {
        [EmailAddress]
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}