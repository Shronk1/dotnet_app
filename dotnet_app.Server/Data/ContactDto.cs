using System.ComponentModel.DataAnnotations;

namespace dotnet_app.Server.Data
{
    public class ContactDto
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public DateTime BirthDate { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public int? SubcategoryId { get; set; }

        public string CustomSubcategory { get; set; } = string.Empty;
    }
}
