import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Loader2, Sparkles, X } from "lucide-react";

import {
  generateWordDrafts,
  listCategorie,
  listWordDrafts,
  reviewWordDraft,
} from "@/lib/wordgen.functions";

export const Route = createFileRoute("/studio")({
  component: Studio,
  head: () => ({
    meta: [
      { title: "Studio contenuti · L'Impostore" },
      {
        name: "description",
        content:
          "Genera e revisiona parole e indizi per L'Impostore: pipeline AI a due step con archivio in bozza e approvazione manuale.",
      },
      { property: "og:title", content: "Studio contenuti · L'Impostore" },
      {
        property: "og:description",
        content: "Pipeline AI a due step per nuove parole e indizi, con revisione umana.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Status = "draft" | "approved" | "rejected";

function Studio() {
  const categorie = listCategorie();
  const [categoria, setCategoria] = useState<string>(categorie[0] ?? "Classiche");
  const [quantita, setQuantita] = useState(10);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Status>("draft");
  const [errore, setErrore] = useState<string | null>(null);

  const qc = useQueryClient();
  const genera = useServerFn(generateWordDrafts);
  const elenca = useServerFn(listWordDrafts);
  const revisiona = useServerFn(reviewWordDraft);

  const drafts = useQuery({
    queryKey: ["word-drafts", status, categoria],
    queryFn: () => elenca({ data: { status, categoria } }),
  });

  const generazione = useMutation({
    mutationFn: () => genera({ data: { categoria, quantita, note } }),
    onSuccess: () => {
      setErrore(null);
      void qc.invalidateQueries({ queryKey: ["word-drafts"] });
    },
    onError: (e: Error) => setErrore(e.message),
  });

  const revisione = useMutation({
    mutationFn: (v: { id: string; decision: "approved" | "rejected" }) =>
      revisiona({ data: { id: v.id, decision: v.decision, note: "" } }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["word-drafts"] }),
    onError: (e: Error) => setErrore(e.message),
  });

  return (
    <main className="min-h-dvh bg-[#0b0614] px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Studio contenuti</h1>
          <p className="text-sm text-white/60">
            Generazione creativa + validazione automatica. Tutto finisce in bozza: nessuna parola
            entra nel gioco senza la tua approvazione.
          </p>
        </header>

        <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-white/60">Categoria</span>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#150c27] px-3 py-2"
              >
                {categorie.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-white/60">Quantità</span>
              <input
                type="number"
                min={1}
                max={30}
                value={quantita}
                onChange={(e) => setQuantita(Math.min(30, Math.max(1, Number(e.target.value) || 1)))}
                className="w-full rounded-xl border border-white/10 bg-[#150c27] px-3 py-2"
              />
            </label>
          </div>
          <label className="block space-y-1 text-sm">
            <span className="text-white/60">Direttive per la categoria (facoltative)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Es. solo riferimenti noti in Italia, niente marchi, tono ironico…"
              className="w-full rounded-xl border border-white/10 bg-[#150c27] px-3 py-2"
            />
          </label>

          <button
            onClick={() => generazione.mutate()}
            disabled={generazione.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 font-bold disabled:opacity-60"
          >
            {generazione.isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Sparkles className="size-5" />
            )}
            {generazione.isPending ? "Generazione e validazione…" : "Genera bozze"}
          </button>

          {generazione.data ? (
            <p className="text-sm text-emerald-300">
              {generazione.data.inserted} nuove bozze salvate · {generazione.data.scartati} scartate
              in validazione.
            </p>
          ) : null}
          {errore ? <p className="text-sm text-rose-300">{errore}</p> : null}
        </section>

        <section className="space-y-3">
          <div className="flex gap-2">
            {(["draft", "approved", "rejected"] as Status[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  status === s ? "bg-white text-[#0b0614]" : "bg-white/10 text-white/70"
                }`}
              >
                {s === "draft" ? "Bozze" : s === "approved" ? "Approvate" : "Scartate"}
              </button>
            ))}
          </div>

          {drafts.isLoading ? (
            <p className="text-sm text-white/50">Caricamento…</p>
          ) : (drafts.data?.length ?? 0) === 0 ? (
            <p className="text-sm text-white/50">Nessun elemento in questa lista.</p>
          ) : (
            <ul className="space-y-2">
              {drafts.data?.map((d) => (
                <li
                  key={d.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="space-y-1">
                    <p className="font-bold">
                      {d.parola}{" "}
                      <span className="text-xs font-normal text-white/40">({d.difficolta})</span>
                    </p>
                    <p className="text-sm text-white/60">
                      {(d.indizi as string[]).join(" · ")}
                    </p>
                  </div>
                  {status === "draft" ? (
                    <div className="flex shrink-0 gap-2">
                      <button
                        aria-label="Approva"
                        onClick={() => revisione.mutate({ id: d.id, decision: "approved" })}
                        className="rounded-xl bg-emerald-500/20 p-2 text-emerald-300"
                      >
                        <Check className="size-5" />
                      </button>
                      <button
                        aria-label="Scarta"
                        onClick={() => revisione.mutate({ id: d.id, decision: "rejected" })}
                        className="rounded-xl bg-rose-500/20 p-2 text-rose-300"
                      >
                        <X className="size-5" />
                      </button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
