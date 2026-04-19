# NetPC - Zadanie Rekrutacyjne (.NET CORE)

Projekt ten jest implementacją zadania rekrutacyjnego (Zadanie 1) dla firmy **Net PC sp. z o.o.**, polegającego na stworzeniu prostej aplikacji (strony Web) obsługującej listę kontaktów.

Aplikacja umożliwia przeglądanie listy kontaktów przez wszystkich użytkowników oraz pozwala zalogowanym użytkownikom na dodawanie, edytowanie i usuwanie kontaktów (wraz ze szczegółowymi danymi takimi jak imię, nazwisko, unikalny email, kategoria, podkategoria słownikowa, telefon oraz data urodzenia).

## Architektura projektu opiera się na

- **Backendzie:** REST API napisanym w C# (ASP.NET Core).
- **Frontendzie:** Single Page Application (SPA) wykonanym w React (JavaScript/JSX).
- **Bazie danych:** SQLite (wykorzystano Entity Framework Core), w której trzymane są: kontakty, dane słownikowe (kategorie i podkategorie) oraz użytkownicy.

## Dodatkowa dokumentacja i specyfikacje

Więcej szczegółów na temat struktury i działania projektu można znaleźć w poniższych plikach:

- [Specyfikacja Techniczna BackEnd](./Specyfikacja_Techniczna_BackEnd.md) – opis klas, metod backendu, wykorzystanych bibliotek.
- [Specyfikacja Techniczna FrontEnd](./Specyfikacja_Techniczna_FrontEnd.md) – architektura części klienckiej, komponenty i wykorzystane biblioteki we frontendzie.
- [Instrukcja Produkcyjna](./Instrukcja_Produkcyjna.md) – instrukcja jak skompilować, uruchomić aplikację w środowisku produkcyjnym.

---

Wykonał: Juliusz Tłuścik
Wspomagałem się: Gemini CLI

---
