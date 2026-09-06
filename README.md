# Impostor's Gambit

<ruolo>

Agisci come un Lead Game Designer, UX/UI Designer di livello Apple e Senior Frontend Developer (React, Tailwind CSS, Framer Motion, Lucide Icons). 

ATTENZIONE: Crea solo il codice e l'ambiente di anteprima locale/preview. Non scrivere, configurare o inviare nulla in ambienti di produzione.

</ruolo>

<contesto_e_obiettivo>

Costruisci "L'Impostore", un party game mobile-first basato su deduzione e ruoli nascosti.

L'app è una Single Page Application (SPA) per il "Pass-and-Play" (i giocatori si passano lo stesso dispositivo).

Nessun backend, gestisci tutto lo State Management lato client (es. React Context o state hook complessi). 

Il design deve essere PREMIUM: Dark Mode profonda, Glassmorphism, sfondi traslucidi, gradienti eleganti (viola/blu notte), niente colori piatti o datati. Transizioni morbidissime con Framer Motion. NESSUN limite massimo di giocatori.

</contesto_e_obiettivo>

<fase_1_lobby_e_setup>

1. Lobby: Input per inserire i nomi dei giocatori. Mostra una lista con l'opzione per rimuoverli. Nessun limite numerico di giocatori.

2. Setup Partita (CRITICO):

   Non ci deve essere NESSUN TIMER.

   L'utente deve poter scegliere tra due modalità di generazione tramite due Tab (Modalità: "Numero Fisso" | "Numero Casuale").

   A) TAB "NUMERO FISSO":

   - Un semplice selettore (+ / -) per decidere il numero esatto di impostori in quella partita (da 1 fino al numero totale dei giocatori).

   B) TAB "NUMERO CASUALE" (Sistema a Probabilità Personalizzate):

   - Genera dinamicamente una lista di Slider per OGNI possibile numero di impostori, da 0 fino al [Numero Totale Giocatori].

   - Esempio se ci sono 4 giocatori: mostrerai 5 slider (per 0, 1, 2, 3 e 4 impostori).

   - Ogni slider rappresenta il "Peso / Probabilità" che esca quel numero. Valore da 0 a 100.

   - Logica RNG: L'app sommerà i valori degli slider e farà un'estrazione pesata (Weighted Random) per decidere quanti impostori inserire nel round senza dirlo a nessuno.

   C) RUOLI SPECIALI E CATEGORIE:

   - Toggle per attivare "La Spia".

   - Toggles per attivare/disattivare le categorie di parole (Classiche, Meme, Charlie Kirk, Roma, Calcio, Cinema, Videogiochi).

</fase_1_lobby_e_setup>

<linea_editoriale_database_parole>

- Implementa un array JSON locale di parole con la seguente struttura: `{ categoria, parola_esatta, suggerimento_vago }`.

- IL SUGGERIMENTO NON DEVE MAI DESCRIVERE LA PAROLA. Deve essere un'astrazione, un dettaglio marginale o un'emozione. L'impostore deve avere un'ancora per bluffare, non indovinare la parola!

- Inserisci almeno 30 parole iniziali. Esempi di calibrazione perfetta DA REPLICARE ASSOLUTAMENTE:

  * "Clip virale" -> "Social Network" (NON "video").

  * "Faccia rimpicciolita" (Charlie Kirk) -> "Fotomontaggio".

  * "Corvo" -> "Urbano".

  * "Shopping Natalizio" -> "Spendere".

  * "Hockey su ghiaccio" -> "Bastone".

  * "Dentista" -> "Poltrona".

  * "Francesco Totti" -> "Bandiera".

</linea_editoriale_database_parole>

<fase_2_distribuzione_ruoli>

- Schermata: "Passa il telefono a [Nome]".

- L'utente clicca "Sono Io" ed entra nella schermata del Ruolo.

- Meccanica Tap-and-Hold: L'utente deve tenere premuto un bottone/card (onTouchStart/onMouseDown) per leggere il ruolo. Quando solleva il dito (onTouchEnd/onMouseUp), il testo SPARISCE ALL'ISTANTE. Poi clicca "Ho capito, prosegui" per passare al giocatore successivo.

- REGOLE RUOLI:

  * Civile: Legge la "parola_esatta".

  * Impostore: Legge SOLO il "suggerimento_vago". NON conosce gli altri impostori.

  * La Spia: Legge la "parola_esatta" E un array testuale con i nomi di tutti gli Impostori.

- GUARDRAIL MATEMATICO SULLA SPIA: Se La Spia è attivata dal setup, il numero di impostori estratti NON DEVE MAI superare: Math.floor(TotaleGiocatori / 2) - 1. Se l'RNG o il "Numero Fisso" viola questa regola, l'app disattiva La Spia per quel round e la converte in un normale Civile senza dirlo all'utente.

</fase_2_distribuzione_ruoli>

<fase_3_discussione_e_loop_votazione>

- Finita la distribuzione, mostra una schermata "Discussione in corso" senza alcun timer. Solo un grande tasto "TERMINA E VOTA".

- SISTEMA DI VOTAZIONE (State Machine a Loop Continuo):

  La UI mostra i bottoni con i nomi dei giocatori ANCORA VIVI.

  Se la partita è in modalità "Numero Casuale", mostra SEMPRE anche un bottone aggiuntivo "TUTTI SAFE".

  A) SE VOTANO UN CIVILE:

  - Il contatore globale "Errori" aumenta. L'app mostra: "Sbagliato! Era un civile". Il giocatore muore (i suoi bottoni spariscono dalle future votazioni).

  - Se gli "Errori" arrivano a 2: GAME OVER, VINCONO GLI IMPOSTORI.

  - Se gli "Errori" sono 1: La partita riprende, si torna a discutere e votare.

  B) SE VOTANO UN IMPOSTORE:

  - Smascheramento: L'impostore ha diritto a "La Vendetta" a schermo.

  - Se c'è La Spia in gioco, l'Impostore deve indovinare chi è. Se indovina, GAME OVER, vincono gli impostori.

  - Se NON c'è La Spia, l'Impostore deve indovinare la Parola Segreta. Se indovina, GAME OVER, vincono gli impostori.

  - Se fallisce la Vendetta: L'impostore muore. L'app dice "Impostore eliminato. Continuate!". NON rivela quanti ne mancano. Si torna al loop di votazione.

  C) CONDIZIONI DI VITTORIA DEI CIVILI (DIPENDE DALLA MODALITÀ):

  - In Modalità NUMERO FISSO: I civili vincono automaticamente appena il contatore degli impostori morti raggiunge il totale prefissato.

  - In Modalità NUMERO CASUALE (Thriller psicologico):

    Se ci sono 0 Impostori o 0 Civili generati, l'unico modo per non perdere al primo turno è votare "TUTTI SAFE".

    I civili vincono SOLO E SOLTANTO SE eliminano tutti gli impostori E, al turno successivo (o al primo turno se c'erano 0 impostori), il gruppo preme all'unanimità "TUTTI SAFE".

    Se il gruppo preme "TUTTI SAFE" ma c'è anche solo 1 Impostore ancora vivo, GAME OVER, VINCE L'IMPOSTORE nascosto.

</fase_3_discussione_e_loop_votazione>

<istruzioni_finali>

Struttura componenti React puliti. Gestisci lo stato della partita con estrema attenzione al "Loop di Votazione". Genera subito il codice per avviare la preview dell'app.

</istruzioni_finali>

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1aabe97c-2960-46e6-b0dd-73813d9f51f8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
