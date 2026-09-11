import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  word: z.string().min(1),
  difficulty: z.enum(["facile", "medio", "difficile"]),
});

const SYSTEM = [
  "Sei un fine stratega del gioco 'Mr White' (o 'Undercover') per tavoli numerosi (8-10 giocatori).",
  "In questo contesto, dare indizi troppo chiari o da 'trivia' rovina il gioco perche' Mr White incrocia le informazioni e vince subito.",
  "Tutti gli indizi devono essere OBLIQUI, SENSORIALI o LEGATI A UN'ATMOSFERA, applicabili a decine di concetti diversi.",
  "",
  "DIVIETI ASSOLUTI (pena la squalifica):",
  "- MAI nomi propri, citta', nazioni, marchi o luoghi geografici (es. per 'Torre Eiffel' VIETATO 'Parigi' o 'Francia').",
  "- MAI il ruolo esatto o il sinonimo diretto (es. per 'Mattarella' VIETATO 'Presidente').",
  "- MAI l'elemento distintivo unico ed enciclopedico (es. per 'Colosseo' VIETATO 'Gladiatori' o 'Anfiteatro').",
  "",
  "CRITERI PER LE DIFFICOLTA':",
  "- FACILE: associazione situazionale o funzionale, riconoscibile ma ambigua (Torre Eiffel -> 'Cartolina'; Colosseo -> 'Spettacolo').",
  "- MEDIO: attributo fisico, sensoriale, temporale o materiale generico (Torre Eiffel -> 'Metallo'; Colosseo -> 'Pietra').",
  "- DIFFICILE: dettaglio laterale, astratto o metaforico che manda fuori strada (Torre Eiffel -> 'Vento'; Colosseo -> 'Polvere').",
  "",
  "FORMATO: rigorosamente una singola parola (massimo due se strettamente necessario) per riga. Nessun commento.",
].join("\n");

type Clues = { facile: string; medio: string; difficile: string };

function parseClues(raw: string): Partial<Clues> {
  const out: Partial<Clues> = {};
  for (const line of raw.split(/\r?\n/)) {
    const l = line.trim().replace(/\*/g, "");
    const up = l.toUpperCase();
    const value = l.split(":", 2)[1]?.trim().replace(/^"|"$/g, "");
    if (!value) continue;
    const clean = value.charAt(0).toUpperCase() + value.slice(1);
    if (up.startsWith("FACILE:")) out.facile = clean;
    else if (up.startsWith("MEDIO:")) out.medio = clean;
    else if (up.startsWith("DIFFICILE:")) out.difficile = clean;
  }
  return out;
}

export const generateClues = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }): Promise<{ clue: string; clues: Clues }> => {
    const key = process.env["GROQ_API_KEY"];
    if (!key) throw new Error("Chiave IA non configurata.");

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        temperature: 0.3,
        max_tokens: 250,
        reasoning_format: "hidden",
        reasoning_effort: "low",
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content:
              `Genera i 3 indizi per: "${data.word}".\n\n` +
              "Formato richiesto:\n" +
              "FACILE: [parola generica/azione/situazione]\n" +
              "MEDIO: [attributo fisico/sensoriale/materiale]\n" +
              "DIFFICILE: [concetto astratto/obliquo/fuorviante]",
          },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Servizio IA non disponibile (${res.status}): ${body.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = json.choices?.[0]?.message?.content ?? "";
    const parsed = parseClues(raw);
    const clues: Clues = {
      facile: parsed.facile ?? "",
      medio: parsed.medio ?? "",
      difficile: parsed.difficile ?? "",
    };
    const clue = clues[data.difficulty] || clues.medio || clues.facile || clues.difficile;
    if (!clue) throw new Error("L'IA non ha prodotto un indizio valido.");
    return { clue, clues };
  });
