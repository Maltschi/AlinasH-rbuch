HÖRBUCH-WEBSITE MIT VERWALTUNG – EINRICHTUNG

Enthalten:
- Minimalistischer Player für deine Freundin
- Kleines "i" unten rechts und PIN-Fenster (Standard-PIN 1234)
- Mehrere Audiodateien gleichzeitig hochladen
- Jede Datei ist ein eigener Abschnitt
- Dateien werden beim Hinzufügen anhand der führenden Zahl im Dateinamen automatisch sortiert (z. B. 01, 02, 03)
- Reihenfolge danach weiterhin manuell über ↑ / ↓ ändern
- Titel/Beschreibung ändern, Audio ersetzen, Abschnitt löschen
- "Änderungen speichern" sichert den Entwurf
- "Veröffentlichen" macht den Entwurf öffentlich sichtbar

WICHTIG: Vor dem Online-Betrieb muss einmal Supabase eingerichtet werden:
1. Kostenloses Projekt auf https://supabase.com erstellen.
2. In Supabase > SQL Editor den Inhalt von supabase-setup.sql ausführen.
3. In Storage einen PUBLIC bucket mit dem Namen audio erstellen.
4. Die Project URL und den Publishable Key werden in config.js bereits eingetragen.
5. PIN in config.js bei Bedarf ändern (Standard 1234).
6. Eigenes Cover als images/cover.jpg ablegen.
7. Gesamten Ordner in deinem bestehenden GitHub-Repository ersetzen und über GitHub Pages veröffentlichen (oder alternativ bei Netlify).

Benutzung:
- Website öffnen > kleines i unten rechts > PIN.
- Dateien über „Audiodateien auswählen“ hinzufügen, Titel bearbeiten, mit Pfeilen sortieren. Auf iPhone öffnet sich die Dateiauswahl über die sichtbare Schaltfläche.
- Änderungen speichern = Entwurf sichern.
- Veröffentlichen = neue Kapitelversion wird öffentlich.

SICHERHEIT:
Der PIN ist absichtlich nur eine kleine Bedien-Sperre und im JavaScript sichtbar.
Die Beispiel-Datenbankregeln erlauben anonymen Schreibzugriff. Jeder, der die technische Schnittstelle kennt, könnte Inhalte verändern/löschen. Nur für ein privates, nicht sensibles Hörbuch verwenden. Für echten Schutz wäre später eine serverseitige Anmeldung nötig.

Hinweis:
Die Laufzeiten werden im Player angezeigt, sobald eine Audiodatei abgespielt/geladen wird. MP3 und M4A/AAC sind die üblichen Formate; MP3 ist am kompatibelsten.
