# Piano: effetti speciali + nuove categorie per L'Impostore

## Obiettivo
Dare alla app più impatto teatrale e più varietà di contenuto, senza toccare logica, stato o regole di gioco. L'intervento è un pacchetto medio: animazioni premium e 3 nuovi pacchetti di parole.

## 1. Effetti speciali e micro-animazioni

### Confetti alla fine partita
- Usare `canvas-confetti` (pacchetto leggero, compatibile con browser/Worker).
- Scatenare un burst colorato quando appare `GameOver`:
  - Civili vincono → coriandoli verdi e azzurri.
  - Impostori vincono → coriandoli viola, fucsia, neri.
- Non bloccare l'interazione; è puramente decorativo.

### Shake su errore di voto
- Quando `votePlayer` colpisce un civile e appare `FeedbackScreen` con tono "bad", vibrare leggermente il contenitore della schermata.
- Implementare con Framer Motion `animate={{ x: [0, -8, 8, -6, 6, 0] }}` sul `Screen` del feedback.

### Transizioni più teatrali
- Aumentare il dramma dei cambio fase:
  - Slide laterale + fade per passaggio tra `Lobby → Setup → Reveal`.
  - Scale-in con spring per card di voto, feedback e vendetta.
  - Stagger sui pulsanti dei giocatori in `Voting` e `Revenge`.

### Glow durante il tap-and-hold
- In `Reveal`, mentre `holding` è attivo, aggiungere un anello pulsante viola/fucsia intorno alla card e un'aura che si espande.
- Mantenere l'effetto "testo sparisce all'istante" esattamente come oggi.

### Micro-interazioni bottoni
- Pulsanti di voto: rimpicciolimento `active:scale-[0.96]` + flash di colore al tocco.
- "TUTTI SAFE": aggiungere un'icona scudo che pulsa leggermente.

## 2. Nuove categorie di parole

Aggiungere 3 nuovi pacchetti da 200 parole ciascuno, con suggerimenti vaghi mai descrittivi:

1. **Medicina** — termini medici, anatomia, strumenti, specializzazioni.
2. **Mitologia** — divinità, creature, eroi, miti greci/romani/nordici.
3. **Anime & Manga** — titoli, personaggi, trope, autori iconici.

Ogni categoria sarà un file separato in `src/game/words/` e registrato in `src/game/words.ts`.

## 3. Verifica

- Typecheck con `bunx tsgo --noEmit`.
- Build preview senza errori (`/tmp/observability/build-errors.log`).
- Test rapido in anteprima: lobby → setup con nuove categorie → partita → vittoria con confetti.

## Note tecniche

- `canvas-confetti` verrà installato come dipendenza.
- Tutte le animazioni restano client-side; nessuna modifica a `GameContext.tsx` o `engine.ts`.
- I nuovi file di parole seguono il formato esistente: `export const NOME: [string, string][] = [["parola", "suggerimento"], ...]`.
