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
