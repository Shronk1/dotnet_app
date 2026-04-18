# Specyfikacja techniczna - API Aplikacji Kontaktów

## Wprowadzenie

Aplikacja została zbudowana z wykorzystaniem frameworka **ASP.NET Core (wersja .NET 10)** i służy jako backend typu **REST API** dla aplikacji Single Page Application (SPA). Zarządza procesem autoryzacji użytkowników oraz pozwala na tworzenie i modyfikację bazy kontaktów telefonicznych/mailowych wraz z relacjami do odpowiednich słowników.

## 1. Architektura i wykorzystane biblioteki

Do realizacji projektu użyto darmowych narzędzi i bibliotek wspierających środowisko C#:

* **ASP.NET Core:** Główny framework aplikacyjny dostarczający szkielet do budowy endpointów HTTP.
* **Entity Framework Core (EF Core):** System typu ORM (Object-Relational Mapping), ułatwiający obsługę bazy danych z poziomu kodu obiektowego.
* **Microsoft.EntityFrameworkCore.Sqlite:** Provider bazy danych pozwalający aplikacji na łączenie się i tworzenie lekkiej, plikowej bazy danych **SQLite** (dzięki czemu aplikacja nie wymaga instalacji oddzielnego silnika bazy danych).
* **ASP.NET Core Identity:** Gotowy zestaw narzędzi ułatwiający zarządzanie użytkownikami (tworzenie, haszowanie haseł i weryfikacja logowania).
* **Microsoft.AspNetCore.Authentication.JwtBearer:** Biblioteka do obsługi zabezpieczeń z użyciem bezstanowych tokenów **JSON Web Token (JWT)**, ułatwiająca integrację architektury SPA z zabezpieczonym REST API.

## 2. Baza danych (SQLite)

Aplikacja korzysta z pliku bazodanowego `contacts.db`. Baza ta jest automatycznie tworzona podczas pierwszego uruchomienia aplikacji. Inicjowana jest wtedy również domyślnymi słownikami. W bazie wdrożono unikalny indeks zapobiegający dublowaniu się wartości `Email` w tabeli z kontaktami.

---

## 3. Opis poszczególnych klas i metod

### A. Warstwa danych i modeli (Katalog `Models` oraz `Data`)

1. **`AppDbContext`**
   Klasa dziedzicząca po `IdentityDbContext<IdentityUser>`, pełniąca funkcję głównego pomostu między kodem C# a plikiem bazy danych.
   * `OnModelCreating(ModelBuilder builder)`
      * Rejestruje kluczowe tabele z użyciem właściwości typu `DbSet`: `Contacts`, `Categories`, `Subcategories`. Odpowiada za konfigurację ustawień mapowania ORM, w tym unikalnego indeksu na polu Email.

2. **`DbSeeder`**
   Klasa narzędziowa odpowiedzialna za przygotowanie środowiska.
   * `InitializeDatabaseAsync(AppDbContext context)`
      * Najpierw upewnia się, że baza danych istnieje (omijając tradycyjne migracje), a następnie wywołuje metodę seedującą.
   * `SeedDictionariesAsync(AppDbContext context)`
      * Zasila puste tabele słownikowe domyślnymi wartościami (Kategorie: *służbowy, prywatny, inny*; Podkategorie: *szef, klient, współpracownik*).

3. **`UserDto`**
   Prosty model transferowy (DTO) przenoszący strukturę zapytania z danymi z formularza do procesu autoryzacji.
   * Posiada wymagane atrybuty `Email` oraz `Password`.

4. **`ContactDto`**
   Model transferowy (DTO) dla żądań POST i PUT dla głównego kontrolera.
   * Posiada wyłącznie płaskie właściwości dla danych (Imię, Nazwisko itp.) bez złożonych obiektów nawigacyjnych `Category` czy `Subcategory`.

5. **`Category` & `Subcategory`**
   Reprezentują systemowe słowniki opcji dostępne dla kontaktów. Tabele te są powiązane kaskadową relacją (jedna kategoria może posiadać wiele podkategorii).

6. **`Contact`**
   Centralna encja bazy danych w systemie. 
   * Definiuje podstawowe pola (Imię, Nazwisko, Email, Data urodzenia, Telefon) oraz relacje zdefiniowane za pomocą kluczy obcych (`CategoryId` oraz w uzasadnionych przypadkach powiązane ID słownikowej podkategorii lub alternatywnie tekst w polu `CustomSubcategory`).

### B. Warstwa kontrolerów (Katalog `Controllers`)

1. **`AuthController`**
   Zarządza wejściem użytkowników do systemu przy pomocy tokenów JWT.
   * `Register(UserDto model)`
      * Endpoint: `POST api/auth/register`
      * Dostępny dla wszystkich.
      * Przyjmuje adres e-mail i hasło. Jeśli spełniają wymogi, tworzy nowe konto w systemie Identity, haszując i soląc hasło, a następnie zwraca wygenerowany token JWT.
   * `Login(UserDto model)`
      * Endpoint: `POST api/auth/login`.
      * Sprawdza podane poświadczenia i w przypadku pomyślnej weryfikacji generuje token.
   * `GenerateJwtToken()`
      * Metoda prywatna.
      * Generuje token JWT.

2. **`CategoriesController`**
   Udostępnia zbiór słowników potrzebnych do obsługi formularzy na frontendzie.
   * `GetCategories()`
      * Endpoint: `GET api/categories`
      * Dostępny dla wszystkich.
      * Zwraca pełną strukturę dostępnych kategorii wraz ze zagnieżdżonymi podkategoriami.

3. **`ContactsController`**
   Główny kontroler aplikacji zabezpieczony adnotacją `[Authorize]` z wyjątkiem wybranych metod pobierających, służący do operacji typu CRUD.
   * `GetContacts()`:
      * Endpoint: `GET api/contacts`
      * Dostępny dla wszystkich.
      * Zwraca zestawienie jedynie podstawowych danych kontaktów.
   * `GetContact(int id)`:
      * Endpoint: `GET api/contacts/{id}`
      * Dostępny dla wszystkich.
      * Pobiera rozszerzone informacje dla danego wskaźnika ID wraz z relacjami.
   * `CreateContact(ContactDto dto)`
      * Endpoint: `POST api/contacts`
      * Dostępny dla zalogowanych użytkowników.
      * Wprowadza nowy wpis do bazy używając płaskiego wejścia DTO. Wykorzystuje prywatną metodę do walidacji danych `ValidateAndAssignCategoriesAsync(dto, contact)`.
   * `UpdateContact(int id, ContactDto dto)`
      * Endpoint: `PUT api/contacts/{id}`
      * Dostępny dla zalogowanych użytkowników.
      * Modyfikuje istniejący wiersz pobierając płaskie wejście DTO. Również waliduje dane przez `ValidateAndAssignCategoriesAsync(dto, existingContact)`.
   * `DeleteContact(int id)`
      * Endpoint: `DELETE api/contacts/{id}`
      * Dostępny dla zalogowanych użytkowników.
      * Usuwa wskazany obiekt z systemu.
   * `ValidateAndAssignCategoriesAsync`:
      * Metoda prywatna.
      * Kontroluje zaawansowane reguły walidacyjne dotyczące relacji (czyszczenie niewłaściwych pół opartych na warunkowych zachowaniach np. wymuszenie ręcznego wpisu dla kategorii 'inny' czy restrykcji podkategorii do kategorii 'służbowy').

---

## 4. Sposób kompilacji i uruchomienia aplikacji

Aplikacja nie wymaga skomplikowanego środowiska ani zewnętrznych serwerów bazodanowych dzięki silnikowi SQLite. Proces kompilacji został zautomatyzowany przez wbudowane w pakiet SDK .NET narzędzia wiersza poleceń (CLI).

**Wymagania:**
Zainstalowane w systemie środowisko uruchomieniowe **.NET 10 SDK**.

**Kroki kompilacji i uruchomienia (z poziomu konsoli):**

1. Otwórz dowolny terminal/wiersz poleceń i przejdź do podfolderu serwerowego projektu:

   ```bash
   cd dotnet_app/dotnet_app.Server
   ```

2. Zainstaluj wszystkie wymagane z zewnątrz pakiety:

   ```bash
   dotnet restore
   ```

3. Zbuduj i sprawdź kod aplikacji:

   ```bash
   dotnet build
   ```

4. Uruchom serwer developerski:

   ```bash
   dotnet run
   ```

Po wywołaniu `dotnet run`, środowisko samo upewni się, że baza danych `contacts.db` istnieje (jeśli nie, utworzy plik wraz z nową strukturą), pobierze lub wygeneruje dane startowe dla słowników i nasłuchuje zapytań HTTP wysłanych przez frontend. Automatycznie zostanie udostępniona interaktywna dokumentacja Swagger pod adresem `https://localhost:<port>/swagger` (w środowisku developerskim).

Aplikacja była testowana na systemie Windows 11.
