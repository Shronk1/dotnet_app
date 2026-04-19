# Specyfikacja techniczna - Frontend Aplikacji Kontaktów

## Wprowadzenie

Frontend aplikacji został zbudowany jako nowoczesna aplikacja typu **Single Page Application (SPA)** z wykorzystaniem biblioteki **React** oraz narzędzia budowania **Vite**. Aplikacja komunikuje się z backendem .NET poprzez REST API, wykorzystując bezpieczne mechanizmy uwierzytelniania oparte na ciasteczkach sesyjnych.

## 1. Architektura i wykorzystane technologie

* **React (v18+):** Główna biblioteka do budowy interfejsu użytkownika opartego na komponentach.
* **Vite:** Szybkie narzędzie deweloperskie i bundler zapewniający błyskawiczne odświeżanie modułów (HMR).
* **Tailwind CSS:** Framework CSS typu utility-first, użyty do stylowania aplikacji bez pisania tradycyjnych arkuszy stylów, co zapewnia spójność wizualną i responsywność.
* **React Router (v6+):** Biblioteka do obsługi nawigacji po stronie klienta, umożliwiająca płynne przechodzenie między widokami bez przeładowania strony.
* **Axios:** Klient HTTP używany do komunikacji z API, skonfigurowany pod kątem bezpiecznej obsługi ciasteczek (`withCredentials`).
* **React Context API:** Wykorzystane do globalnego zarządzania stanem autoryzacji użytkownika.

## 2. Zarządzanie autoryzacją (AuthContext)

Aplikacja implementuje bezpieczny model autoryzacji **Cookie-based Auth**:

* **Bezpieczeństwo:** Tokeny nie są przechowywane w `localStorage` (podatność na XSS). Zamiast tego, serwer przesyła ciasteczko `HttpOnly`, do którego JavaScript nie ma dostępu.
* **Sprawdzanie sesji:** Przy każdym uruchomieniu/odświeżeniu aplikacji (F5), `AuthContext` wysyła zapytanie do endpointu `/api/auth/me`, aby zweryfikować ważność sesji.
* **Automatyczne wylogowanie:** Zaimplementowano **Axios Interceptor**, który nasłuchuje błędów 401 (Unauthorized). W przypadku wygaśnięcia sesji, aplikacja automatycznie przekierowuje użytkownika do ekranu logowania i wyświetla stosowny komunikat przy użyciu `sessionStorage`.

## 3. Struktura komponentów i stron

### A. Komponenty (`src/components`)

1. **`Navbar`**: Responsywny pasek nawigacyjny. Dynamicznie zmienia zawartość (linki "Dodaj", przycisk "Wyloguj") w zależności od stanu zalogowania.
2. **`AuthForm`**: Uniwersalny formularz obsługujący zarówno logowanie, jak i rejestrację. Posiada wbudowaną walidację błędów pochodzących z serwera.
3. **`ContactForm`**: Zaawansowany formularz CRUD. Obsługuje dynamiczne ładowanie słowników (Kategorie/Podkategorie) oraz logikę warunkową (np. pole własnej podkategorii dla kategorii "Inny").
4. **`LoadingOverlay`**: Półprzeźroczysta nakładka typu "Glassmorphism" z rozmyciem tła (`backdrop-blur`), blokująca interakcje podczas operacji asynchronicznych.

### B. Strony (`src/pages`)

* **`Home`**: Strona powitalna z informacjami o aplikacji.
* **`Contacts`**: Widok listy kontaktów typu Master-Detail. Lewa strona wyświetla listę, prawa szczegóły wybranego kontaktu oraz przyciski Edycji/Usuwania (dostępne tylko dla zalogowanych).
* **`NewContact` / `EditContact`**: Widoki dedykowane operacjom tworzenia i modyfikacji kontaktów, zabezpieczone przed dostępem osób nieuprawnionych (`ProtectedRoute`).
* **`NotFound`**: Dedykowana strona błędu 404 dla nieistniejących ścieżek.

## 4. Konfiguracja SPA Proxy

W pliku `vite.config.js` skonfigurowano mechanizm proxy, który przekierowuje żądania zaczynające się od `/api` oraz `/swagger` bezpośrednio do serwera backendowego.

## 5. Sposób uruchomienia (Frontend)

1. Przejdź do folderu klienta: `cd dotnet_app.client`
2. Zainstaluj zależności: `npm install`
3. Uruchom tryb deweloperski: `npm run dev` (lub użyj `dotnet run` z folderu serwera, aby uruchomić oba projekty naraz).
