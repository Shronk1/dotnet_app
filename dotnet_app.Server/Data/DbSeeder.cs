using dotnet_app.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace dotnet_app.Server.Data
{
    public static class DbSeeder
    {
        public static async Task InitializeDatabaseAsync(AppDbContext context)
        {
            // Tworzenie struktury bazy danych na podstawie modeli 
            await context.Database.EnsureCreatedAsync();

            // Po utworzeniu bazy uzupełnia ją słownikowymi
            await SeedDictionariesAsync(context);
        }

        public static async Task SeedDictionariesAsync(AppDbContext context)
        {
            // Sprawdzenie, czy w bazie są już jakieś kategorie
            if (await context.Categories.AnyAsync())
            {
                return;
            }

            // Podstawowe kategorie
            var sluzbowy = new Category { Name = "służbowy" };
            var prywatny = new Category { Name = "prywatny" };
            var inny = new Category { Name = "inny" };

            await context.Categories.AddRangeAsync(sluzbowy, prywatny, inny);
            await context.SaveChangesAsync(); // zapisanie, kategori by dostały swoje ID z bazy

            // Podkategorie tylko dla kategorii "służbowy"
            var szef = new Subcategory { Name = "szef", CategoryId = sluzbowy.Id };
            var klient = new Subcategory { Name = "klient", CategoryId = sluzbowy.Id };
            var wspolpracownik = new Subcategory { Name = "współpracownik", CategoryId = sluzbowy.Id };

            await context.Subcategories.AddRangeAsync(szef, klient, wspolpracownik);
            await context.SaveChangesAsync();
        }
    }
}
