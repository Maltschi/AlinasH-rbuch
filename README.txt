UNSER HÖRBUCH – kurze Anleitung

DATEIEN
- index.html: die Website
- chapters.json: Titel, Beschreibung, Cover und Kapitel-Liste
- images/cover.jpg: hier dein Cover als JPG ablegen
- audio/: hier deine MP3-Aufnahmen ablegen

KAPITEL HINZUFÜGEN
1. Lege die neue MP3-Datei in den Ordner audio/.
2. Öffne chapters.json und ergänze im "chapters"-Bereich einen weiteren Eintrag:
   {
     "title": "Kapitel 3 – ...",
     "description": "Kurze Beschreibung (optional)",
     "file": "audio/03-kapitel-3.mp3",
     "duration": "12:34"
   }
3. Lade die aktualisierte Website samt neuer Audiodatei erneut zu deinem Hosting-Anbieter hoch.
   Die Kapitel erscheinen dann automatisch in der Liste.

WICHTIG
- Dateinamen exakt so schreiben wie in chapters.json.
- Für die einfachste Wiedergabe MP3 verwenden.
- Die Kapitel werden automatisch nacheinander abgespielt.
- Die Seite ist eine Vorlage. Sie ist noch nicht online und hat noch keinen öffentlichen Link.
- Für einen öffentlichen Link kannst du den gesamten Ordner z.B. bei Netlify Drop veröffentlichen.
- Wenn du Kapitel später ergänzt, veröffentlichst du den aktualisierten Ordner erneut.
