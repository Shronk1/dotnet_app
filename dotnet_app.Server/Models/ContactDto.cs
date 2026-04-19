using System.ComponentModel.DataAnnotations;

namespace dotnet_app.Server.Models
{
    public class ContactDto
    {
        [Required(ErrorMessage = "Imię jest wymagane")]
        public string FirstName { get; set; } = string.Empty;

        public string? LastName { get; set; }

        [Required(ErrorMessage = "Email jest wymagany")]
        [EmailAddress(ErrorMessage = "Nieprawidłowy format adresu email")]
        public string Email { get; set; } = string.Empty;

        public string? Phone { get; set; }

        public DateTime? BirthDate { get; set; }

        [Required(ErrorMessage = "Kategoria jest wymagana")]
        public int CategoryId { get; set; }

        public int? SubcategoryId { get; set; }

        public string? CustomSubcategory { get; set; }
    }
}
