using dotnet_app.Server.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace dotnet_app.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories
                .Include(c => c.Subcategories)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    Subcategories = c.Subcategories.Select(s => new
                    {
                        s.Id,
                        s.Name
                    }).ToList()
                })
                .ToListAsync();

            return Ok(categories);
        }
    }
}
