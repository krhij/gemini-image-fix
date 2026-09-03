# Gemini Screenshot Fix (Firefox)

Rozszerzenie rozwiązuje problem z błędem wklejania zrzutów ekranu w [Google Gemini](https://gemini.google.com/):
> *"Już przesłałeś plik o nazwie obraz.png"*

### Dlaczego ten błąd występuje?
W systemie Windows (w polskiej wersji językowej) schowek przypisuje każdemu zrzutowi ekranu (`Win + Shift + S` lub `PrtScr`) identyczną nazwę `obraz.png`. Gemini odrzuca kolejne próby wklejenia pliku o tej samej nazwie w obrębie sesji. Rozszerzenie automatycznie przechwytuje wklejany obraz i nadaje mu unikalną nazwę ze znacznikiem czasu.

---

### Instalacja (Gotowy dodatek)

1. Przejdź do zakładki [Releases](../../releases/latest).
2. Pobierz plik **`.xpi`**.
3. Przeciągnij i upuść pobrany plik w oknie przeglądarki Firefox (lub użyj skrótu `Ctrl + O` i wybierz plik).
4. Kliknij **Dodaj** w wyskakującym powiadomieniu.

---

### Jak to działa?
Skrypt działa w tle na stronie `gemini.google.com`. Podczas zdarzenia `paste` sprawdza przesyłany plik – jeśli jest to obraz o domyślnej nazwie, tworzy nowy obiekt `File` z unikalną nazwą (np. `screen_1714800000000_123.png`) i przekazuje go do edytora Gemini.
