using System.ComponentModel.DataAnnotations;

namespace dotnet_app.Server.Models
{
    public class Contact
    {
        public int Id { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string Phone { get; set; }

        public DateTime BirthDate { get; set; }

        // --- RELACJE ZE SŁOWNIKAMI ---

        [Required]
        public int CategoryId { get; set; }
        public Category Category { get; set; }

        // Nullable, bo podkategoria ze słownika jest tylko dla kategorii "służbowy"
        public int? SubcategoryId { get; set; }
        public Subcategory Subcategory { get; set; }
        public string CustomSubcategory { get; set; }

    }
}
