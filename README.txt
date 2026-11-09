HÖRBUCH-WEBSITE – ANLEITUNG

COVER
Lege dein Cover als JPG unter images/cover.jpg ab. In chapters.json ist dieser Pfad bereits eingetragen.

AUDIODATEIEN
Lege MP3-Dateien in den Ordner audio/ und trage sie in chapters.json ein.

KAPITEL HINZUFÜGEN
Ergänze innerhalb des Arrays "chapters" einen Eintrag, zum Beispiel:
{
  "title": "Kapitel 3 – Unsere Reise",
  "description": "Kurze Beschreibung (optional)",
  "file": "audio/03-reise.mp3",
  "duration": "14:32"
}

Danach den aktualisierten Website-Ordner erneut bei deinem Hosting-Anbieter veröffentlichen. Neue Kapitel erscheinen automatisch.
Die Wiedergabe zeigt das aktuelle Kapitel sowie die vergangene und gesamte Zeit. Kapitel lassen sich einzeln starten und werden anschließend automatisch fortgesetzt.

Die Website ist eine Vorlage und noch nicht online. Für einen öffentlichen Link muss sie bei einem Hosting-Anbieter veröffentlicht werden.
