namespace dotnet_app.Server.Models
{
    public class Category
    {
        public int Id { get; set; }

        // Np. "służbowy", "prywatny", "inny"
        public string Name { get; set; }

        // Relacja
        public List<Subcategory> Subcategories { get; set; }
    }
}
