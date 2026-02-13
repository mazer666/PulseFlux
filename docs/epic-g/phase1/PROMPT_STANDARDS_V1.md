# Epic G – Prompt Standards V1 (de/en/fr/es)

## Globale Hard Rules
- Clue darf das Zielwort nicht enthalten (auch keine offensichtliche Stammform).
- Genau eine naheliegende Lösung anstreben.
- Altersgerecht, nicht beleidigend, keine sensiblen Inhalte.
- Maximale Länge: 90 Zeichen.
- Keine stark nischigen Referenzen in niedrigeren Schwierigkeiten.

## Stilprofile
- `neutral`: sachlich, klar, kurz
- `funny`: leicht humorvoll, aber family-friendly
- `trivia`: faktenorientiert
- `wordplay`: nur wenn Eindeutigkeit gewahrt bleibt

## Sprachspezifische Prompt-Wrapper

### Deutsch (`de`)
"Erzeuge einen kurzen, klaren Hinweis auf Deutsch. Kein Wort-Leak. Familienfreundlicher Ton."

### Englisch (`en`)
"Produce a concise, family-safe English clue with one likely answer and no word leak."

### Französisch (`fr`)
"Rédige un indice court et clair en français, adapté aux familles, sans fuite du mot cible."

### Spanisch (`es`)
"Genera una pista breve y clara en español, apta para familias y sin revelar la palabra objetivo."

## Output-Format (verbindlich)
```json
{
  "clue_text": "...",
  "clue_style": "neutral|funny|trivia|wordplay",
  "safety_notes": []
}
```
