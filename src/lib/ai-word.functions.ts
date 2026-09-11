import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  category: z.string().min(1).max(60),
  exclude: z.array(z.string()).max(40).optional(),
});

const SYSTEM = [
  "Sei l'autore italiano del party game 'L'Impostore'.",
  "Il tuo compito: scegliere UNA parola segreta adatta a un tavolo di amici italiani.",
  "",
  "REGOLE FERREE:",
  "- Solo italiano corrente: la parola deve esistere nel vocabolario italiano ed essere usata ogni giorno.",
  "- Sono ammessi nomi propri SOLO se universalmente noti in Italia (monumenti, personaggi mondiali).",
  "- VIETATO qualsiasi riferimento cult conosciuto solo negli Stati Uniti (marchi, show, sport, festività, personaggi americani locali).",
  "- VIETATE parole inglesi se esiste il corrispettivo italiano.",
  "- VIETATE parole tecniche, di nicchia, volgari o offensive.",
  "- La parola deve essere concreta e riconoscibile da chiunque, da 1 a 3 parole al massimo.",
  "- Deve appartenere davvero alla categoria richiesta.",
  "",
  "FORMATO: rispondi SOLO con la parola, senza virgolette, senza punteggiatura, senza spiegazioni.",
].join("\n");

function clean(raw: string): string {
  const line = raw
    .split(/\r?\n/)
    .map((l) => l.trim().replace(/^[-*•\d.\s]+/, "").replace(/^"|"$/g, "").trim())
    .find((l) => l.length > 0);
  if (!line) return "";
  const words = line.split(/\s+/).slice(0, 3).join(" ").replace(/[.,;:!?]+$/, "");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export const generateWord = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }): Promise<{ word: string; category: string }> => {
    const key = process.env["GROQ_API_KEY"];
    if (!key) throw new Error("Chiave IA non configurata.");

    const exclude = (data.exclude ?? []).filter(Boolean).slice(0, 40);

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        temperature: 1.1,
        top_p: 0.95,
        max_tokens: 40,
        reasoning_format: "hidden",
        reasoning_effort: "low",
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content:
              `Categoria: "${data.category}".\n` +
              (exclude.length ? `Non usare queste parole: ${exclude.join(", ")}.\n` : "") +
              `Scegli una parola a sorpresa (seme casuale ${Math.floor(Math.random() * 100000)}).`,
          },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Servizio IA non disponibile (${res.status}): ${body.slice(0, 200)}`);
    }

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const word = clean(json.choices?.[0]?.message?.content ?? "");
    if (!word) throw new Error("L'IA non ha prodotto una parola valida.");
    return { word, category: data.category };
  });
