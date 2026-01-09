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

### Kategoryzacja tematów
- **Kompensacja mocy biernej** - podstawy, obliczenia, kary, case studies
- **Kompensatory SVG** - technologia, porównania, zastosowania, wybór

### Workflow zatwierdzania
- **Approve/Reject** - możliwość zatwierdzenia lub odrzucenia artykułu przed publikacją
- **Automatyczne generowanie postów social media** po zatwierdzeniu
- **Powiadomienia email** o statusie artykułów

### Social Media Content
Po zatwierdzeniu artykułu system automatycznie generuje posty promocyjne dla:
- **LinkedIn** (profesjonalny, B2B, 150-200 słów)
- **Facebook** (angażujący, emoji, 100-150 słów)
- **Twitter/X** (zwięzły, max 280 znaków)
- **Instagram** (storytelling, 150-200 słów, 5-10 hashtagów)

### Integracja z Odoo
- Pobieranie produktów i kategorii z Odoo
- Automatyczna publikacja wpisów w Odoo CMS
- Wsparcie dla wielu blogów
- **Integracja z Odoo Social Media** (w przygotowaniu - wymaga dostępu do API)

### Harmonogram publikacji
- Automatyczna publikacja 2x w tygodniu:
  - **Poniedziałek, 9:00 GMT+1** - Kompensacja mocy biernej
  - **Czwartek, 9:00 GMT+1** - Kompensatory SVG

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
   - System wygeneruje artykuł (status: draft, pending approval)

2. **Zatwierdź artykuł**:
   - Przejdź do **Posts**
   - Znajdź wygenerowany artykuł
   - Kliknij **Approve** aby zatwierdzić
   - System automatycznie wygeneruje 4 posty social media

3. **Opublikuj artykuł**:
   - Po zatwierdzeniu kliknij **Publish**
   - Artykuł zostanie opublikowany w Odoo CMS

4. **Sprawdź posty social media**:
   - Przejdź do **Social Media Posts**
   - Zobacz wygenerowane posty dla LinkedIn, Facebook, Twitter, Instagram

## 📊 Panel administracyjny

### Dashboard
- Przegląd ostatnich publikacji
- Statystyki wydajności
- Ręczne uruchamianie publikacji
- Status zatwierdzania artykułów

### Configuration
- Konfiguracja Odoo API
- Ustawienia modeli AI
- Harmonogram publikacji

### Posts
- Historia wszystkich publikacji
- **Approval Status** (pending, approved, rejected)
- Metryki wydajności (views, engagement, SEO score)
- Akcje: Approve, Reject, Publish

### Topics
- Lista zaproponowanych tematów
- **Kategoria** (kompensacja, svg)
- Status tematów (pending, used)
- Słowa kluczowe i trudność SEO

### Social Media Posts (w przygotowaniu)
- Lista wygenerowanych postów
- Platforma (LinkedIn, Facebook, Twitter, Instagram)
- Status publikacji
- Podgląd treści i hashtagów

## 🔄 Workflow publikacji

### Automatyczny (scheduler)
1. **Poniedziałek 9:00** - System wybiera temat z kategorii "kompensacja"
2. Generuje 3 wersje artykułu (Gemini, ChatGPT, Claude)
3. Ocenia i wybiera najlepszą wersję
4. Zapisuje jako draft z statusem "pending approval"
5. **Czekaj na zatwierdzenie**

### Ręczny (workflow)
1. **Przejrzyj artykuł** w sekcji Posts
2. **Approve** - zatwierdź artykuł:
   - System generuje 4 posty social media
   - Wysyła powiadomienie email
3. **Publish** - opublikuj zatwierdzony artykuł:
   - Publikacja w Odoo CMS
   - Aktualizacja statusu na "published"
4. **Reject** - odrzuć artykuł (opcjonalnie z powodem)

## 🔧 Technologia

### Backend
- **Node.js + TypeScript**
- **Express + tRPC** - type-safe API
- **Drizzle ORM** - baza danych
- **MySQL/TiDB** - przechowywanie danych
- **Cron** - scheduler publikacji

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

## 📱 Social Media Content

### LinkedIn (B2B, profesjonalny)
- Długość: 150-200 słów
- Rozpoczyna od pytania lub statystyki
- Podkreśla wartość biznesową
- 3-5 hashtagów branżowych

### Facebook (engagement)
- Długość: 100-150 słów
- Hook: pytanie lub ciekawostka
- 2-3 emoji
- Zachęta do komentowania
- 3-5 hashtagów

### Twitter/X (zwięzły)
- Długość: max 280 znaków
- Dynamiczny, bezpośredni
- 1-2 emoji
- 3-4 hashtagi

### Instagram (storytelling)
- Długość: 150-200 słów
- Mini-historia lub scenariusz
- 3-5 emoji
- Krótkie akapity
- 5-10 hashtagów

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
│   ├── social-media-generator.ts  # Generator postów social media
│   ├── publication-workflow.ts    # Workflow zatwierdzania
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

#### Workflow
- `workflow.approve` - Zatwierdź artykuł i wygeneruj posty social media
- `workflow.reject` - Odrzuć artykuł (z opcjonalnym powodem)
- `workflow.publish` - Opublikuj zatwierdzony artykuł w Odoo

#### Social Media
- `socialMedia.getByPostId` - Pobierz posty social media dla artykułu

#### Posts
- `posts.list` - Lista wszystkich publikacji
- `posts.get` - Szczegóły pojedynczej publikacji

#### Topics
- `topics.pending` - Lista oczekujących tematów (z filtrowaniem po kategorii)

#### Configuration
- `config.get` - Pobiera wszystkie konfiguracje
- `config.set` - Ustawia wartość konfiguracji

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

### Artykuł nie publikuje się
- Sprawdź czy artykuł ma status "approved"
- Zweryfikuj konfigurację Odoo API
- Sprawdź logi publikacji w Publication Log

## 📈 Roadmap

### Etap 1 (ukończony)
- ✅ Kategoryzacja tematów (kompensacja vs SVG)
- ✅ Generator treści social media
- ✅ Workflow zatwierdzania artykułów
- ✅ Harmonogram 2x w tygodniu (po jednym z każdej kategorii)

### Etap 2 (w przygotowaniu)
- 🔄 Integracja z Odoo Social Media API
- 🔄 Automatyczna publikacja postów w Odoo Social Media
- 🔄 Interfejs zarządzania postami social media
- 🔄 Metryki wydajności postów social media

## 📞 Wsparcie

W razie problemów:
1. Sprawdź logi w konsoli przeglądarki
2. Przejrzyj logi serwera
3. Sprawdź Publication Log w dashboardzie
4. Skontaktuj się z zespołem PowerGo

## 📄 Licencja

MIT License - Copyright (c) 2025 PowerGo

---

**Wersja**: 2.0.0  
**Ostatnia aktualizacja**: 2025-01-09  
**Autor**: Manus AI Agent
