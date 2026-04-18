using dotnet_app.Server.Data;
using dotnet_app.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace dotnet_app.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ContactsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactsController(AppDbContext context)
        {
            _context = context;
        }

        // Wspólna metoda do sprawdzania logiki kategorii
        private async Task<string?> ValidateAndAssignCategoriesAsync(ContactDto dto, Contact contact)
        {
            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null)
            {
                return "Wybrana kategoria nie istnieje.";
            }

            if (category.Name.ToLower() == "służbowy")
            {
                contact.CustomSubcategory = string.Empty;
                if (dto.SubcategoryId.HasValue)
                {
                    var subcategory = await _context.Subcategories.FindAsync(dto.SubcategoryId);
                    if (subcategory == null || subcategory.CategoryId != category.Id)
                    {
                        return "Wybrana podkategoria jest nieprawidłowa dla kategorii 'służbowy'.";
                    }
                    contact.SubcategoryId = dto.SubcategoryId;
                }
                else
                {
                   contact.SubcategoryId = null;
                }
            }
            else if (category.Name.ToLower() == "inny")
            {
                contact.SubcategoryId = null;
                if (string.IsNullOrWhiteSpace(dto.CustomSubcategory))
                {
                    return "Dla kategorii 'inny' należy podać własną podkategorię.";
                }
                contact.CustomSubcategory = dto.CustomSubcategory;
            }
            else
            {
                contact.SubcategoryId = null;
                contact.CustomSubcategory = string.Empty;
            }
            
            contact.CategoryId = dto.CategoryId;

            return null; // Brak błędów
        }

        // GET: api/Contacts
        // Zwraca tylko "dane podstawowe" z listy
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetContacts()
        {
            var contacts = await _context.Contacts
                .Select(c => new
                {
                    c.Id,
                    c.FirstName,
                    c.LastName,
                    CategoryName = c.Category.Name // Wyciągamy tylko nazwę kategorii dla czytelności
                })
                .ToListAsync();

            return Ok(contacts);
        }

        // GET: api/Contacts/id
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetContact(int id)
        {
            var contact = await _context.Contacts
                .Include(c => c.Category)
                .Include(c => c.Subcategory)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (contact == null)
            {
                return NotFound("Nie znaleziono kontaktu.");
            }

            return Ok(contact);
        }

        // POST: api/Contacts
        [HttpPost]
        public async Task<IActionResult> CreateContact(ContactDto dto)
        {
            // 1. Walidacja unikalności emaila w całej bazie
            if (await _context.Contacts.AnyAsync(c => c.Email == dto.Email))
            {
                return BadRequest("Kontakt z tym adresem email już istnieje.");
            }

            var contact = new Contact
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                BirthDate = dto.BirthDate
            };

            // 2. Walidacja zgodności kategorii i podkategorii
            var validationError = await ValidateAndAssignCategoriesAsync(dto, contact);
            if (validationError != null)
            {
                return BadRequest(validationError);
            }

            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetContact), new { id = contact.Id }, contact);
        }

        // PUT: api/Contacts/id
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContact(int id, ContactDto dto)
        {
            var existingContact = await _context.Contacts
                .FirstOrDefaultAsync(c => c.Id == id);

            if (existingContact == null)
            {
                return NotFound("Nie znaleziono kontaktu.");
            }

            // Walidacja unikalności emaila (pomijamy samych siebie w trakcie edycji)
            if (await _context.Contacts.AnyAsync(c => c.Email == dto.Email && c.Id != id))
            {
                return BadRequest("Inny kontakt posiada już ten adres email.");
            }

            existingContact.FirstName = dto.FirstName;
            existingContact.LastName = dto.LastName;
            existingContact.Email = dto.Email;
            existingContact.Phone = dto.Phone;
            existingContact.BirthDate = dto.BirthDate;

            // Walidacja zgodności kategorii i podkategorii
            var validationError = await ValidateAndAssignCategoriesAsync(dto, existingContact);
            if (validationError != null)
            {
                return BadRequest(validationError);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Contacts/id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var contact = await _context.Contacts
                .FirstOrDefaultAsync(c => c.Id == id);

            if (contact == null)
            {
                return NotFound();
            }

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
