# Instrukcja uruchomienia produkcyjnego - Aplikacja Kontaktów

Niniejszy dokument opisuje proces przygotowania, budowania i uruchomienia aplikacji w środowisku produkcyjnym (Production).

## 1. Wymagania wstępne

* **Zainstalowane SDK .NET 10**
* **Zainstalowane Node.js (v18+) oraz npm**
* Dostęp do terminala (PowerShell, CMD lub Bash)

---

## 2. Przygotowanie Frontendu (React)

Pierwszym krokiem jest skompilowanie kodu React do zoptymalizowanych plików statycznych (HTML, JS, CSS).

1. Otwórz terminal w folderze projektu: `cd dotnet_app.client`
2. Zainstaluj zależności (jeśli nie zostały zainstalowane wcześniej):

    ```bash
    npm install
    ```

3. Zbuduj wersję produkcyjną:

    ```bash
    npm run build
    ```

    * Po wykonaniu tej komendy w folderze `dotnet_app.client` pojawi się katalog `dist`. Pliki te zostaną automatycznie przejęte przez serwer .NET podczas publikacji.*

---

## 3. Budowanie i Publikacja Backendu (.NET)

Proces publikacji zbiera skompilowany kod serwera oraz zbudowany frontend w jednym folderze gotowym do wdrożenia.

1. Przejdź do folderu serwera: `cd ../dotnet_app.Server`
2. Wykonaj komendę publikacji:

    ```bash
    dotnet publish -c Release -o ../publish
    ```

    * `-c Release`: Optymalizuje kod pod kątem wydajności.
    * `-o ../publish`: Wskazuje folder wyjściowy dla wszystkich plików produkcyjnych.

---

## 4. Uruchomienie aplikacji

Po zakończeniu publikacji, cała Twoja aplikacja (Backend + Frontend) znajduje się w folderze `dotnet_app.Server/publish`.

1. Przejdź do folderu publikacji:

    ```bash
    cd ../publish
    ```

2. Uruchom plik wykonywalny:
    * **Windows:** `dotnet_app.Server.exe`
    * **Linux/macOS:** `dotnet ./dotnet_app.Server.dll`

Aplikacja będzie teraz dostępna pod adresem URL wskazanym w konsoli (domyślnie `http://localhost:5000` lub `https://localhost:5001`).

---

## 5. Kluczowe różnice w trybie Produkcyjnym

1. **Brak Vite Proxy:** Na produkcji serwer .NET sam serwuje pliki Reacta. Nie jest wymagane uruchamianie `npm run dev`.
2. **Bezpieczeństwo Ciasteczek:** Aplikacja wymusza przesyłanie ciasteczek autoryzacyjnych przez bezpieczne połączenie (HTTPS). Wdrożenie na serwer zewnętrzny wymaga posiadania certyfikatu SSL.
3. **Baza danych:** Aplikacja produkcyjna utworzy plik `contacts.db` w swoim folderze uruchomieniowym przy pierwszym starcie (chyba że w `appsettings.json` wskazano inną ścieżkę).
4. **Błędy 404:** Dzięki konfiguracji `MapFallbackToFile`, odświeżanie strony na zagnieżdżonych ścieżkach Reacta (np. `/contacts/1/edit`) działa poprawnie – serwer wie, że ma zawsze zwrócić `index.html`.
