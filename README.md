# SEO Agent for Odoo Blog

Zautomatyzowany system generowania i publikacji treści blogowych zoptymalizowanych pod SEO i GEO (Generative Engine Optimization), zintegrowany z Odoo CMS.

## 🎯 Funkcje

### Automatyzacja treści
- **Trzy modele AI**: Gemini, ChatGPT i Claude generują treści równolegle
- **Inteligentny wybór**: System automatycznie wybiera najlepszą wersję na podstawie:
  - SEO (30%) - optymalizacja słów kluczowych, struktura, meta dane
  - Czytelność (30%) - długość zdań, akapitów, użycie list
  - Engagement (40%) - pytania, CTA, interaktywność

### Optymalizacja SEO + GEO
- **SEO (Search Engine Optimization)**: Optymalizacja dla tradycyjnych wyszukiwarek (Google, Bing)
- **GEO (Generative Engine Optimization)**: Optymalizacja dla wyszukiwarek AI (ChatGPT, Gemini, Perplexity, Claude)
- Kompleksowe instrukcje pisania zawierające:
  - Cytowalne fragmenty (snippets)
  - Tabele porównawcze
  - Strukturalne odpowiedzi na pytania
  - Sekcje FAQ
  - Definicje kluczowych terminów

### Integracja z Odoo
- Pobieranie produktów i kategorii z Odoo
- Automatyczna publikacja wpisów w Odoo CMS
- Wsparcie dla wielu blogów

### Harmonogram publikacji
- Automatyczna publikacja 2x w tygodniu:
  - Poniedziałek, 9:00 GMT+1
  - Czwartek, 9:00 GMT+1

## 🚀 Pierwsze kroki

### 1. Konfiguracja Odoo

Przejdź do strony **Configuration** i uzupełnij:

#### Odoo API
- **Odoo URL**: `https://powergo.pl`
- **Odoo API Key**: Twój klucz API REST Odoo
- **Baza danych**: `odoo`
- **ID bloga**: `2` (blog "Aktualności")

> **Uwaga**: Aby utworzyć nowy blog "Produkty" w Odoo:
> 1. Zaloguj się do panelu administracyjnego Odoo
> 2. Przejdź do **Website → Configuration → Blogs**
> 3. Kliknij **Nowe**
> 4. Wprowadź nazwę "Produkty"
> 5. Zapisz i skopiuj ID bloga z URL

#### API Keys dla modeli AI
- **Gemini API Key**: Klucz z [Google AI Studio](https://aistudio.google.com/)
- **OpenAI API Key**: Klucz z [OpenAI Platform](https://platform.openai.com/)
- **Anthropic API Key**: Klucz z [Anthropic Console](https://console.anthropic.com/)

### 2. Pierwsze uruchomienie

1. **Przetestuj konfigurację**:
   - Przejdź do **Dashboard**
   - Kliknij **Trigger Publication**
   - System wygeneruje i opublikuje testowy wpis

2. **Sprawdź wyniki**:
   - Przejdź do **Posts** aby zobaczyć historię publikacji
   - Sprawdź metryki SEO score, readability i engagement
   - Porównaj wersje z różnych modeli AI

3. **Zarządzaj tematami**:
   - Przejdź do **Topics**
   - Przeglądaj zaproponowane tematy
   - System automatycznie generuje tematy na podstawie danych z Odoo

## 📊 Panel administracyjny

### Dashboard
- Przegląd ostatnich publikacji
- Statystyki wydajności
- Ręczne uruchamianie publikacji

### Configuration
- Konfiguracja Odoo API
- Ustawienia modeli AI
- Harmonogram publikacji

### Posts
- Historia wszystkich publikacji
- Metryki wydajności (views, engagement, SEO score)
- Porównanie wersji z różnych modeli AI

### Topics
- Lista zaproponowanych tematów
- Status tematów (pending, used)
- Słowa kluczowe i trudność SEO

## 🔧 Technologia

### Backend
- **Node.js + TypeScript**
- **Express + tRPC** - type-safe API
- **Drizzle ORM** - baza danych
- **MySQL/TiDB** - przechowywanie danych

### Frontend
- **React 19**
- **Tailwind CSS 4**
- **shadcn/ui** - komponenty UI
- **Wouter** - routing

### AI Models
- **Google Gemini 2.0 Flash** - szybka generacja treści
- **OpenAI GPT-4o Mini** - zbalansowana jakość/koszt
- **Anthropic Claude 3.5 Sonnet** - najwyższa jakość

## 📝 Instrukcje pisania SEO + GEO

System używa kompleksowych instrukcji pisania, które zapewniają:

### Struktura artykułu
- Tytuł z słowami kluczowymi
- Meta opis (150-160 znaków)
- Wstęp z hookiem i obietnicą wartości
- Nagłówki H2/H3 jako pytania
- Sekcja FAQ (5-7 pytań)
- Call-to-Action

### Elementy GEO
- **Cytowalne fragmenty**: Krótkie, samodzielne odpowiedzi (2-3 zdania)
- **Tabele porównawcze**: Strukturyzowane dane
- **Definicje**: Jasne wyjaśnienia kluczowych terminów
- **Listy**: Punktowane i numerowane
- **Źródła**: Zawsze podawane dla statystyk

### Optymalizacja SEO
- Gęstość słów kluczowych: 1-2%
- Semantyczne słowa kluczowe (LSI)
- Linki wewnętrzne: 3-5 na artykuł
- Długość: 1500-2000 słów

## 🔄 Automatyzacja

### Scheduler
System automatycznie:
1. Generuje tematy na podstawie produktów z Odoo
2. Tworzy outline artykułu
3. Zleca pisanie trzem modelom AI równolegle
4. Ocenia wszystkie wersje
5. Wybiera najlepszą
6. Optymalizuje SEO (meta opisy, słowa kluczowe)
7. Publikuje w Odoo CMS
8. Wysyła powiadomienie email

### Powiadomienia
Właściciel otrzymuje email o:
- Udanej publikacji (tytuł, link, metryki)
- Błędach publikacji (szczegóły błędu)
- Raportach tygodniowych (podsumowanie wydajności)

## 🛠️ Rozwój

### Struktura projektu
```
seo_agent_odoo/
├── client/                 # Frontend React
│   └── src/
│       ├── pages/         # Strony aplikacji
│       └── components/    # Komponenty UI
├── server/                # Backend Node.js
│   ├── ai-writers.ts      # Moduły AI writers
│   ├── seo-optimizer.ts   # Optymalizacja SEO
│   ├── seo-generator.ts   # Generator tematów
│   ├── scheduler.ts       # Scheduler publikacji
│   ├── odoo-client.ts     # Klient Odoo API
│   ├── writing-instructions.ts  # Instrukcje SEO+GEO
│   ├── db.ts              # Query helpers
│   └── routers.ts         # tRPC routers
└── drizzle/               # Schemat bazy danych
    └── schema.ts
```

### Uruchomienie lokalnie
```bash
# Instalacja zależności
pnpm install

# Migracja bazy danych
pnpm db:push

# Uruchomienie dev servera
pnpm dev

# Testy
pnpm test
```

## 📚 Dokumentacja API

### tRPC Endpoints

#### `config.get`
Pobiera wszystkie konfiguracje

#### `config.set`
Ustawia wartość konfiguracji
```typescript
{ key: string, value: string }
```

#### `posts.list`
Lista wszystkich publikacji

#### `posts.get`
Szczegóły pojedynczej publikacji
```typescript
{ id: number }
```

#### `topics.pending`
Lista oczekujących tematów

#### `publication.trigger`
Ręczne uruchomienie publikacji

#### `publication.logs`
Historia publikacji z logami

## 🔐 Bezpieczeństwo

- Wszystkie API keys przechowywane w bazie danych
- Autentykacja przez Manus OAuth
- Tylko właściciel ma dostęp do panelu
- HTTPS dla wszystkich połączeń

## 🐛 Rozwiązywanie problemów

### Błąd: "Odoo API connection failed"
- Sprawdź URL Odoo (bez końcowego `/`)
- Zweryfikuj API Key
- Upewnij się, że REST API module jest zainstalowany w Odoo

### Błąd: "AI model generation failed"
- Sprawdź API keys dla modeli AI
- Zweryfikuj limity API (rate limits)
- Sprawdź logi w konsoli

### Błąd: "Blog not found"
- Zweryfikuj ID bloga w konfiguracji
- Sprawdź czy blog istnieje w Odoo
- Upewnij się, że masz uprawnienia do bloga

## 📞 Wsparcie

W razie problemów:
1. Sprawdź logi w konsoli przeglądarki
2. Przejrzyj logi serwera
3. Skontaktuj się z zespołem PowerGo

## 📄 Licencja

MIT License - Copyright (c) 2025 PowerGo

---

**Wersja**: 1.1.0  
**Ostatnia aktualizacja**: 2025-01-08  
**Autor**: Manus AI Agent
