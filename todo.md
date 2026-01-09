# SEO Agent Odoo - TODO List

## Faza 1: Inicjalizacja projektu i konfiguracja bazy danych
- [x] Rozszerzyć schemat bazy danych o tabele dla wpisów, tematów, publikacji
- [x] Dodać konfigurację dla Odoo API (URL, API Key)
- [x] Dodać konfigurację schedulera (dni, godziny publikacji)

## Faza 2: Implementacja integracji z Odoo REST API
- [x] Stworzyć moduł OdooClient do komunikacji z Odoo REST API
- [x] Implementować pobieranie produktów z Odoo
- [x] Implementować pobieranie kategorii z Odoo
- [x] Implementować tworzenie wpisów blogowych w Odoo
- [x] Implementować publikację wpisów w Odoo CMS

## Faza 3: Stworzenie modułów AI writers i generatora tematów SEO
- [x] Stworzyć generator tematów SEO analizujący dane z Odoo
- [x] Implementować badanie słów kluczowych i SEO difficulty
- [x] Stworzyć moduł AI Writer dla Gemini
- [x] Stworzyć moduł AI Writer dla ChatGPT (OpenAI)
- [x] Stworzyć moduł AI Writer dla Claude (Anthropic)
- [x] Implementować równoległe generowanie artykułów

## Faza 4: Implementacja systemu oceny i optymalizacji SEO
- [x] Stworzyć moduł oceny SEO (30% wagi)
- [x] Stworzyć moduł oceny czytelności (30% wagi)
- [x] Stworzyć moduł oceny engagement (40% wagi)
- [x] Implementować wybór najlepszej wersji artykułu
- [x] Stworzyć optymalizator meta opisów
- [x] Implementować optymalizację gęstości słów kluczowych
- [x] Dodać generator linków wewnętrznych

## Faza 5: Budowa interfejsu użytkownika i panelu monitorowania
- [x] Stworzyć dashboard z przeglądem publikacji
- [x] Dodać panel konfiguracji Odoo API
- [x] Stworzyć widok historii publikacji
- [x] Dodać metryki wydajności wpisów (views, engagement, SEO score)
- [x] Stworzyć panel zarządzania tematami
- [x] Dodać podgląd wpisów przed publikacją
- [x] Implementować ręczne uruchamianie publikacji

## Faza 6: Implementacja schedulera i automatyzacji publikacji
- [x] Stworzyć scheduler publikacji 2x w tygodniu
- [x] Skonfigurować publikację w poniedziałki o 9:00 GMT+1
- [x] Skonfigurować publikację w czwartki o 9:00 GMT+1
- [x] Dodać obsługę błędów i retry logic
- [x] Implementować powiadomienia email o publikacjach
- [x] Dodać powiadomienia o błędach publikacji

## Faza 7: Testowanie i dokumentacja systemu
- [ ] Napisać testy jednostkowe dla modułów
- [ ] Przetestować integrację z Odoo API
- [ ] Przetestować generowanie artykułów przez AI
- [ ] Przetestować system oceny i wyboru najlepszej wersji
- [ ] Przetestować scheduler publikacji
- [ ] Stworzyć dokumentację użytkownika
- [ ] Stworzyć dokumentację techniczną

## Faza 8: Dostarczenie finalnego rozwiązania użytkownikowi
- [ ] Przygotować checkpoint projektu
- [ ] Stworzyć instrukcję konfiguracji
- [ ] Dostarczyć dokumentację


## Nowe zadania - Aktualizacja konfiguracji i blog Produkty
- [x] Zaktualizować domyślne ID bloga z 1 na 2 (Aktualności)
- [ ] Stworzyć nowy blog "Produkty" w Odoo (do wykonania ręcznie przez użytkownika)
- [x] Dodać instrukcje SEO + GEO (Generative Engine Optimization) dla pisarzy AI
- [x] Zintegrować instrukcje SEO+GEO z modułem AI writers


## Nowe zadania - Testowanie i przygotowanie wpisów
- [x] Przetestować aplikację i zdiagnozować problemy
- [x] Naprawić błędy w aplikacji
- [x] Przygotować 4 tematy o kompensacji mocy biernej
- [x] Przygotować 4 tematy o kompensatorach SVG
- [x] Dodać tematy do bazy danych
- [x] Napisać i uruchomić testy jednostkowe
- [ ] Wygenerować 8 wpisów blogowych (użytkownik może użyć Trigger Publication)
- [ ] Opublikować wpisy w Odoo (automatycznie przez system)


## Nowe wymagania - Harmonogram i Odoo Social Media
- [x] Zaktualizować scheduler aby publikował 2 wpisy tygodniowo (po jednym z każdej kategorii)
- [x] Dodać pole category do tabeli topics (kompensacja vs SVG)
- [x] Zaktualizować generator tematów aby przypisywał kategorie
- [ ] Zintegrować z Odoo Social Media API (wymaga dostępu do Odoo - Etap 2)
- [x] Stworzyć generator treści social media dla LinkedIn, Facebook, Twitter, Instagram
- [x] Rozszerzyć schemat bazy danych o tabelę social_media_posts
- [x] Dodać workflow zatwierdzania artykułów (approve/reject)
- [x] Dodać tRPC routers dla workflow i social media
- [ ] Automatycznie publikować posty w Odoo Social Media po zatwierdzeniu (wymaga API - Etap 2)
- [ ] Dodać stronę Social Media Posts w interfejsie
- [ ] Napisać testy dla nowych funkcji


## Naprawa Trigger Publication
- [ ] Zaimplementować pełną logikę w publication.trigger router
- [ ] Połączyć z funkcją runPublicationCycle z scheduler.ts
- [ ] Przetestować generowanie artykułów
- [ ] Przetestować workflow zatwierdzania


## Aktualizacja na wbudowane klucze API Manus
- [x] Zaktualizować manual-publication.ts aby używał systemowych kluczy API (GEMINI_API_KEY, ANTHROPIC_API_KEY)
- [x] Zaktualizować routers.ts publication.trigger aby używał systemowych kluczy
- [ ] Uprościć formularz Configuration - usunąć pola kluczy AI (opcjonalne)
- [ ] Przetestować generowanie artykułu z systemowymi kluczami (wymaga rozwiązania problemów z limitami API)
- [x] Zapisać finalny checkpoint


## Integracja z Odoo Social Media API
- [ ] Zbadać strukturę Odoo Social Media API (social.stream.post)
- [ ] Sprawdzić ID bloga "Produkty"
- [ ] Zaimplementować funkcję publikacji postów w Odoo Social Media
- [ ] Dodać mapowanie platform (LinkedIn, Facebook, Twitter, Instagram)
- [ ] Zaktualizować workflow.approve aby automatycznie publikował w Odoo Social Media
- [ ] Dodać opcję wyboru bloga w konfiguracji (Aktualności vs Produkty)
- [ ] Przetestować publikację postów
- [ ] Zapisać finalny checkpoint


## Funkcja eksportu postów social media do CSV (opcja dodatkowa)
- [x] Dodać tRPC router dla eksportu postów do CSV
- [x] Stworzyć funkcję generowania CSV z postami (platform, content, blog_post_id)
- [x] Dodać przycisk "Export to CSV" w interfejsie Posts
- [ ] Przetestować eksport CSV (wymaga wygenerowania wpisu z postami social media)


## Feedback UI dla Trigger Publication
- [x] Dodać loading state (spinner) do przycisku "Trigger Publication"
- [x] Dodać toast notification "Generating article..." po kliknięciu
- [x] Dodać toast notification "Article generated successfully!" po zakończeniu
- [x] Dodać toast notification z błędem jeśli generowanie się nie powiodło
- [ ] Dodać progress indicator z etapami (opcjonalne - wymaga WebSocket/SSE)
- [x] Przetestować feedback UI


## Naprawa błędu JavaScript
- [x] Zdiagnozować błąd "NotFoundError: Failed to execute 'insertBefore' on 'Node'"
- [x] Sprawdzić komponenty React które mogą powodować problem
- [x] Naprawić błąd renderowania (dodano filter i unikalne keys)
- [x] Przetestować aplikację po naprawie


## Kontynuacja naprawy błędu JavaScript
- [ ] Sprawdzić komponent Configuration.tsx
- [ ] Naprawić wszystkie komponenty z problemami renderowania
- [ ] Przetestować całą aplikację


## Auto-refresh listy Posts
- [x] Dodać invalidate queries w onSuccess callback triggerPublication
- [ ] Przetestować auto-refresh po wygenerowaniu artykułu


## Naprawa błędu "Odoo configuration is incomplete"
- [x] Sprawdzić bazę danych - czy wpisy są zapisane
- [x] Sprawdzić funkcję getOdooConfig() w manual-publication.ts
- [x] Naprawić pobieranie konfiguracji z bazy danych
- [x] Przetestować generowanie artykułu po naprawie

## Naprawa konfiguracji i generowania artykułów (9 stycznia 2026)
- [x] Naprawić zapisywanie konfiguracji - usunąć warunek `if (value)` aby zapisywać wszystkie pola
- [x] Naprawić pobieranie kluczy API - zmienić z process.env na getConfig() z bazy
- [x] Naprawić tworzenie ArticleOutline - dodać wszystkie wymagane pola (topic, keywords, targetLength, sections)
- [x] Zastąpić zewnętrzne API (Gemini/OpenAI/Anthropic) wbudowanym invokeLLM z Manus
- [x] Naprawić typy TypeScript w manual-publication.ts
- [x] Przetestować generowanie artykułu end-to-end
- [x] Wygenerować pierwszy artykuł testowy pomyślnie
