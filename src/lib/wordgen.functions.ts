import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { CATEGORIES, WORDS } from "@/game/words";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.8-flash";

export interface DraftItem {
  parola: string;
  categoria: string;
  difficolta: "facile" | "media" | "difficile";
  indizi: string[];
}

const SYSTEM_GENERAZIONE = `Sei l'autore principale di "L'Impostore", un irriverente e brillante gioco da tavolo italiano.

Meccanica: i giocatori conoscono una parola segreta tranne uno (l'impostore). I giocatori si scambiano indizi per farsi capire, l'impostore cerca di mimetizzarsi.

Il tuo compito è generare nuove parole segrete e 4 indizi per ciascuna, in italiano.

REGOLE FERREE (Pena il fallimento del gioco):

1. LUNGHEZZA INDIZI: OGNI indizio deve essere ESCLUSIVAMENTE 1 singola parola o massimo 2-3 parole.

2. DIVIETO ASSOLUTO DI FRASI: MAI usare verbi coniugati. MAI usare "Serve per", "È un", "Si usa quando".

3. PENSIERO LATERALE: Usa associazioni di idee, emozioni, contesti d'uso, sensi. Gli indizi devono essere evocativi, non descrittivi.

4. PROGRESSIONE: [Vaghissimo, Laterale/Sensoriale, Contesto, Specifico senza mai usare sinonimi diretti].

5. LESSICO: Solo italiano corrente universale.

6. LIVELLO: "facile", "media", "difficile".

Output: Restituisci ESCLUSIVAMENTE un array JSON valido nel formato [ { "parola": "...", "categoria": "...", "difficolta": "...", "indizi": ["...","...","...","..."] } ].`;

const promptGenerazione = (
  n: number,
  categoria: string,
  esclusioni: string[],
  note: string,
) => `Genera ${n} nuove parole per la categoria: "${categoria}".

ATTENZIONE, NON USARE MAI QUESTE PAROLE (già presenti):

[ ${esclusioni.map((w) => `"${w}"`).join(", ")} ]

Direttive specifiche per "${categoria}":

${note || "Nessuna direttiva aggiuntiva: resta nel perimetro della categoria e usa riferimenti noti al pubblico italiano."}

Ricorda la progressione: [Vaghissimo, Laterale/Sensoriale, Contesto, Specifico]. Nessun verbo coniugato negli indizi. Massimo 3 parole per indizio. Restituisci solo l'array JSON puro.`;

const promptValidazione = (categoria: string) => `Sei l'Editor di Qualità per il gioco "L'Impostore".

Ricevi in input un array JSON generato dall'AI contenente parole e indizi per la categoria "${categoria}".

Il tuo compito è analizzare ogni elemento e assicurarti che rispetti LA REGOLA D'ORO: Gli indizi NON DEVONO CONTENERE FRASI, VERBI CONIUGATI o parole che iniziano con "Serve a / È un". Devono essere solo associazioni brevi (1-3 parole al massimo).

Se un elemento viola la regola, correggi l'indizio riscrivendolo sotto forma di concetto/sostantivo breve. Se la parola è troppo oscura o i 4 indizi sono irrecuperabili, scarta l'elemento.

Restituisci ESCLUSIVAMENTE un array JSON puro contenente la lista degli elementi validati. Formato richiesto:

[ { "parola": "...", "categoria": "...", "difficolta": "...", "indizi": ["...", "...", "...", "..."] } ]`;

async function chat(
  apiKey: string,
  messages: { role: "system" | "user"; content: string }[],
  temperature: number,
): Promise<string> {
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({ model: MODEL, temperature, messages }),
  });

  if (!res.ok) {
    const detail = await res.text();
    if (res.status === 429) throw new Error("Troppe richieste all'AI: riprova tra poco.");
    if (res.status === 402)
      throw new Error("Crediti AI esauriti: ricaricali per continuare a generare.");
    if (res.status === 403) throw new Error("L'AI è disattivata per questo spazio di lavoro.");
    throw new Error(`Errore AI (${res.status}): ${detail.slice(0, 300)}`);
  }

  const payload = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return payload.choices?.[0]?.message?.content ?? "";
}

function parseArray(raw: string): unknown[] {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1) return [];
  try {
    const parsed: unknown = JSON.parse(cleaned.slice(start, end + 1));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const LIVELLI = new Set(["facile", "media", "difficile"]);

function normalizeItems(items: unknown[], categoria: string): DraftItem[] {
  const out: DraftItem[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    if (typeof item !== "object" || item === null) continue;
    const rec = item as Record<string, unknown>;
    const parola = typeof rec["parola"] === "string" ? rec["parola"].trim() : "";
    const indiziRaw = Array.isArray(rec["indizi"]) ? rec["indizi"] : [];
    const indizi = indiziRaw
      .filter((i): i is string => typeof i === "string")
      .map((i) => i.trim())
      .filter((i) => i.length > 0 && i.split(/\s+/).length <= 3)
      .slice(0, 4);
    const liv = typeof rec["difficolta"] === "string" ? rec["difficolta"].toLowerCase() : "media";
    const key = parola.toLowerCase();
    if (!parola || indizi.length !== 4 || seen.has(key)) continue;
    seen.add(key);
    out.push({
      parola,
      categoria,
      difficolta: (LIVELLI.has(liv) ? liv : "media") as DraftItem["difficolta"],
      indizi,
    });
  }
  return out;
}

export const generateWordDrafts = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        categoria: z.string().min(1),
        quantita: z.number().int().min(1).max(30).default(10),
        note: z.string().max(2000).default(""),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Chiave AI mancante sul server.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const esistenti = WORDS.filter((w) => w.categoria === data.categoria).map(
      (w) => w.parola_esatta,
    );
    const { data: draftRows } = await supabaseAdmin
      .from("word_drafts")
      .select("parola")
      .eq("categoria", data.categoria);
    const esclusioni = [
      ...new Set([...esistenti, ...(draftRows ?? []).map((r) => r.parola as string)]),
    ].slice(0, 600);

    // FASE 1 — generazione creativa
    const generated = await chat(
      apiKey,
      [
        { role: "system", content: SYSTEM_GENERAZIONE },
        {
          role: "user",
          content: promptGenerazione(data.quantita, data.categoria, esclusioni, data.note),
        },
      ],
      0.8,
    );

    // FASE 2 — validazione editoriale
    const validated = await chat(
      apiKey,
      [
        { role: "system", content: promptValidazione(data.categoria) },
        { role: "user", content: generated },
      ],
      0.2,
    );

    const items = normalizeItems(parseArray(validated), data.categoria);
    const escluseLower = new Set(esclusioni.map((w) => w.toLowerCase()));
    const finali = items.filter((i) => !escluseLower.has(i.parola.toLowerCase()));

    if (finali.length === 0) {
      return { inserted: 0, scartati: items.length, items: [] as DraftItem[] };
    }

    const batchId = crypto.randomUUID();
    const { data: inserted, error } = await supabaseAdmin
      .from("word_drafts")
      .upsert(
        finali.map((i) => ({
          parola: i.parola,
          categoria: i.categoria,
          difficolta: i.difficolta,
          indizi: i.indizi,
          // Mai in produzione: tutto resta bozza in staging finché un umano non approva.
          status: "draft",
          environment: "staging",
          model: MODEL,
          batch_id: batchId,
          validation_note: "Validato dalla fase 2 (temperature 0.2)",
        })),
        { onConflict: "categoria,parola", ignoreDuplicates: true },
      )
      .select("id");

    if (error && error.code !== "23505") throw new Error(error.message);

    return {
      inserted: inserted?.length ?? finali.length,
      scartati: parseArray(generated).length - finali.length,
      items: finali,
    };
  });

export const listWordDrafts = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z
      .object({
        status: z.enum(["draft", "approved", "rejected"]).default("draft"),
        categoria: z.string().default(""),
      })
      .parse(data ?? {}),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query = supabaseAdmin
      .from("word_drafts")
      .select("id, parola, categoria, difficolta, indizi, status, created_at")
      .eq("status", data.status)
      .order("created_at", { ascending: false })
      .limit(300);
    if (data.categoria) query = query.eq("categoria", data.categoria);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const reviewWordDraft = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        id: z.string().uuid(),
        decision: z.enum(["approved", "rejected"]),
        note: z.string().max(500).default(""),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("word_drafts")
      .update({ status: data.decision, validation_note: data.note || null })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listCategorie = () => [...CATEGORIES];
