# SEO Agent dla Odoo - Dokumentacja

## 📋 Opis Systemu

Zautomatyzowany system SEO Agent zintegrowany z Odoo CMS, który publikuje wpisy blogowe 2x w tygodniu (poniedziałek i czwartek o 9:00 GMT+1). System wykorzystuje trzy modele AI (Gemini, ChatGPT, Claude) do równoległego generowania treści, ocenia je według kryteriów SEO (30%), czytelności (30%) i engagement (40%), a następnie automatycznie wybiera i publikuje najlepszą wersję.

## 🎯 Główne Funkcje

### 1. **Integracja z Odoo**
- Pobieranie produktów i kategorii z Odoo
- Tworzenie wpisów blogowych w Odoo CMS
- Publikacja w blogu "Aktualności" (ID: 2)

### 2. **Generator Tematów SEO**
- Analiza danych z Odoo (produkty, kategorie)
- Generowanie tematów SEO z słowami kluczowymi
- Ocena trudności SEO (SEO difficulty)
- Kategoryzacja tematów (kompensacja mocy biernej vs kompensatory SVG)

### 3. **AI Writers (3 modele)**
- **Gemini**: Szybki, kreatywny
- **ChatGPT** (via OpenRouter): Zbalansowany
- **Claude**: Precyzyjny, szczegółowy
- Równoległe generowanie artykułów (2-5 minut)

### 4. **System Oceny i Optymalizacji**
- **SEO Score (30%)**: Gęstość słów kluczowych, meta opisy, linki wewnętrzne
- **Readability Score (30%)**: Długość zdań, czytelność, struktura
- **Engagement Score (40%)**: Pytania, CTA, storytelling
- Automatyczny wybór najlepszej wersji

### 5. **Workflow Zatwierdzania**
- Draft → Pending Approval → Approved → Published
- Możliwość ręcznego zatwierdzenia/odrzucenia
- Automatyczne generowanie postów social media po zatwierdzeniu

### 6. **Generator Social Media**
Po zatwierdzeniu artykułu system automatycznie generuje posty promocyjne dla:
- **LinkedIn**: Profesjonalny ton, B2B
- **Facebook**: Engagement, przystępny język
- **Twitter/X**: Krótkie, hashtagi
- **Instagram**: Visual focus, storytelling

### 6.1. **Eksport Postów Social Media do CSV** (opcja dodatkowa)
- Przycisk "Export Social Media Posts" w interfejsie Posts
- Format CSV: Platform, Content, Blog Post ID
- Gotowe do importu do Odoo Social Media lub innych narzędzi
- Alternatywa dla pełnej integracji z Odoo Social Media API

### 7. **Scheduler Publikacji**
- **Poniedziałek o 9:00 GMT+1**: Artykuł z kategorii "kompensacja mocy biernej"
- **Czwartek o 9:00 GMT+1**: Artykuł z kategorii "kompensatory SVG"
- Automatyczne powiadomienia email o publikacjach

### 8. **Panel Monitorowania**
- Dashboard z metrykami publikacji
- Historia wpisów i logów publikacji
- Zarządzanie tematami
- Konfiguracja Odoo i AI

## 🚀 Jak Używać

### 1. **Konfiguracja Odoo**
1. Przejdź do **Configuration**
2. Wprowadź dane Odoo:
   - **Odoo URL**: https://powergo.pl
   - **Odoo API Key**: [Twój klucz API]
   - **Baza danych**: odoo
   - **Blog ID**: 2 (Aktualności)
3. Kliknij **Save Configuration**

### 2. **Gotowe Tematy**
System ma już 8 gotowych tematów w bazie danych:

**Kompensacja mocy biernej (4 tematy):**
1. Kompensacja mocy biernej - podstawy i korzyści dla przedsiębiorstw
2. Jak obliczyć zapotrzebowanie na kompensację mocy biernej?
3. Kary za niską wartość współczynnika mocy cosφ - jak ich uniknąć?
4. Kompensacja mocy biernej w instalacjach przemysłowych - case study

**Kompensatory SVG (4 tematy):**
5. Kompensatory SVG - nowoczesna technologia kompensacji mocy biernej
6. SVG vs tradycyjne baterie kondensatorów - porównanie rozwiązań
7. Zastosowania kompensatorów SVG w energetyce odnawialnej
8. Jak wybrać odpowiedni kompensator SVG dla swojej instalacji?

### 3. **Ręczne Uruchomienie Publikacji**
1. Przejdź do **Dashboard**
2. Kliknij **Trigger Publication**
3. System:
   - Wybierze pierwszy temat z listy
   - Wygeneruje 3 wersje artykułu (Gemini, ChatGPT, Claude)
   - Oceni je według kryteriów SEO+GEO
   - Wybierze najlepszą wersję
   - Zapisze jako draft z statusem "pending approval"
4. Proces zajmuje **2-5 minut**

### 4. **Zatwierdzanie Artykułów**
1. Przejdź do **Posts**
2. Znajdź artykuł ze statusem "Pending Approval"
3. Przejrzyj treść i wyniki oceny
4. Kliknij **Approve** lub **Reject**
5. Po zatwierdzeniu system automatycznie:
   - Wygeneruje 4 posty social media
   - Opublikuje artykuł w Odoo
   - Wyśle powiadomienie email

### 4.1. **Eksport Postów Social Media**
1. Przejdź do **Posts**
2. Znajdź artykuł z wygenerowanymi postami social media
3. Kliknij **"Export Social Media Posts"**
4. Pobierz plik CSV z postami
5. Zaimportuj do Odoo Social Media lub innych narzędzi

Format CSV:
```csv
Platform,Content,Blog Post ID
"linkedin","Profesjonalny post o kompensacji mocy biernej...",1
"facebook","Czy wiesz, że kompensacja mocy biernej...",1
"twitter","💡 Kompensacja mocy biernej to oszczędności! #energetyka #przemysł",1
"instagram","📊 Historia sukcesu: jak firma XYZ zaoszczędziła 30% kosztów energii...",1
```

### 5. **Automatyczna Publikacja**
Scheduler automatycznie uruchamia publikację:
- **Poniedziałek 9:00 GMT+1**: Temat z kategorii "kompensacja"
- **Czwartek 9:00 GMT+1**: Temat z kategorii "SVG"

## 🔧 Instrukcje SEO + GEO

System używa zaawansowanych instrukcji pisania dla AI, które optymalizują treści pod:

### **SEO (Search Engine Optimization)**
- Gęstość słów kluczowych: 1-2%
- Meta opisy: 150-160 znaków
- Nagłówki H1, H2, H3
- Linki wewnętrzne
- Alt text dla obrazów

### **GEO (Generative Engine Optimization)**
- Cytowalne fragmenty (snippets)
- Strukturalne odpowiedzi na pytania
- Tabele i listy
- FAQ sections
- Jasne definicje
- Kontekst i źródła

## ⚠️ Znane Problemy i Rozwiązania

### Problem 1: "Odoo configuration is incomplete"
**Rozwiązanie**: Upewnij się, że wszystkie pola w Configuration są wypełnione i zapisane.

### Problem 2: Gemini API quota exceeded
**Rozwiązanie**: Zaczekaj 1-2 minuty i spróbuj ponownie. System automatycznie użyje retry logic.

### Problem 3: OpenRouter "Insufficient credits"
**Rozwiązanie**: 
- Opcja A: Zakup kredytów na https://openrouter.ai/settings/credits
- Opcja B: System automatycznie użyje Anthropic jako fallback

### Problem 4: Brak wpisów po kliknięciu "Trigger Publication"
**Możliwe przyczyny**:
1. Limity API (Gemini quota, OpenRouter credits)
2. Błąd połączenia z Odoo
3. Brak tematów w bazie danych

**Rozwiązanie**:
1. Sprawdź logi serwera
2. Sprawdź konfigurację w bazie
3. Sprawdź tematy: `SELECT * FROM topics WHERE status='pending';`
4. Poczekaj 2-5 minut na zakończenie generowania

## 🔑 Klucze API

System używa **wbudowanych kluczy API Manus** (GEMINI_API_KEY, ANTHROPIC_API_KEY) zamiast wymagać własnych kluczy od użytkownika. To upraszcza konfigurację i zapewnia natychmiastowe działanie.

## 📈 Metryki i Monitorowanie

Dashboard pokazuje:
- **Total Posts**: Liczba wszystkich wpisów
- **Published**: Opublikowane wpisy
- **Drafts**: Wersje robocze
- **Successful Publications**: Udane publikacje
- **Recent Posts**: Ostatnie wygenerowane artykuły
- **Publication Log**: Historia publikacji z błędami

## 🔄 Workflow Publikacji

```
1. Trigger Publication (ręczne lub automatyczne)
   ↓
2. Wybór tematu z bazy danych (status: pending)
   ↓
3. Generowanie 3 wersji artykułu (Gemini, ChatGPT, Claude) - 2-5 min
   ↓
4. Ocena według kryteriów SEO (30%) + Readability (30%) + Engagement (40%)
   ↓
5. Wybór najlepszej wersji
   ↓
6. Optymalizacja (meta opisy, słowa kluczowe, linki)
   ↓
7. Zapis do bazy jako draft (status: pending approval)
   ↓
8. Ręczne zatwierdzenie przez użytkownika
   ↓
9. Generowanie 4 postów social media (LinkedIn, Facebook, Twitter, Instagram)
   ↓
10. Publikacja w Odoo CMS
   ↓
11. Powiadomienie email do właściciela
```

## 🛠️ Rozwój i Rozszerzenia

### Etap 2 (wymaga dostępu do Odoo):
- [ ] Integracja z Odoo Social Media API
- [ ] Automatyczna publikacja postów w Odoo Social Media
- [ ] Stworzenie nowego bloga "Produkty" w Odoo

### Potencjalne rozszerzenia:
- [ ] A/B testing tytułów
- [ ] Analiza wydajności wpisów (views, engagement)
- [ ] Automatyczne generowanie obrazów dla wpisów
- [ ] Integracja z Google Analytics
- [ ] Eksport raportów SEO do PDF

## 📞 Wsparcie

W razie problemów:
1. Sprawdź logi serwera
2. Sprawdź konfigurację w bazie danych
3. Sprawdź limity API (Gemini, OpenRouter, Anthropic)
4. Skontaktuj się z administratorem Odoo

## 📝 Changelog

### v1.0.0 (2026-01-09)
- ✅ Integracja z Odoo REST API
- ✅ Generator tematów SEO
- ✅ 3 modele AI (Gemini, ChatGPT, Claude)
- ✅ System oceny i optymalizacji
- ✅ Workflow zatwierdzania
- ✅ Generator social media
- ✅ Scheduler 2x w tygodniu
- ✅ Panel monitorowania
- ✅ 8 gotowych tematów w bazie
- ✅ Instrukcje SEO + GEO dla pisarzy AI
- ✅ Wbudowane klucze API Manus

---

**Autor**: Manus AI Agent  
**Data**: 9 stycznia 2026  
**Wersja**: 1.0.0
