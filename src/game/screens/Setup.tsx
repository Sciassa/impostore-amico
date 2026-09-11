import { ArrowLeft, Eye, Minus, Plus, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useGame } from "../GameContext";
import { Button, Panel, Screen, Title } from "../ui";
import { CATEGORIES } from "../words";

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      onClick={onChange}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
    >
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
          checked ? "gradient-primary" : "bg-muted"
        }`}
      >
        <motion.span
          animate={{ x: checked ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 34 }}
          className="absolute left-0 top-0.5 h-5 w-5 rounded-full bg-foreground shadow"
        />
      </span>
    </button>
  );
}

export function Setup() {
  const {
    roster,
    config,
    setConfig,
    setWeight,
    setMode,
    toggleCategory,
    goLobby,
    startGame,
    aiLoading,
    aiError,
  } = useGame();
  const total = roster.length;

  const sum = config.weights.reduce((a, b) => a + Math.max(0, b || 0), 0);

  const difficulties = [
    { id: "facile", label: "Facile" },
    { id: "medio", label: "Medio" },
    { id: "difficile", label: "Difficile" },
  ] as const;

  return (
    <Screen>
      <button
        onClick={goLobby}
        className="flex items-center gap-2 self-start text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Giocatori
      </button>
      <Title eyebrow={`${total} giocatori`}>Setup partita</Title>

      <Panel className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Versione del gioco
        </p>
        <div className="grid grid-cols-2 gap-1 rounded-2xl bg-white/5 p-1">
          {(["classica", "liiil"] as const).map((e) => (
            <button
              key={e}
              onClick={() => setConfig({ engine: e })}
              className={`relative rounded-xl px-4 py-3 text-sm font-semibold transition ${
                config.engine === e ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {config.engine === e && (
                <motion.span
                  layoutId="engine-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-xl gradient-primary"
                />
              )}
              <span className="relative flex items-center justify-center gap-1.5">
                {e === "liiil" && <Sparkles className="h-4 w-4" />}
                {e === "classica" ? "Classica" : "Modalità LIIIL"}
              </span>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {config.engine === "classica"
            ? "Suggerimenti scritti a mano, sempre gli stessi."
            : "Suggerimenti creati al momento dall'intelligenza artificiale."}
        </p>

        {config.engine === "liiil" && (
          <div className="space-y-2 pt-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Difficoltà indizio
            </p>
            <div className="grid grid-cols-3 gap-2">
              {difficulties.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setConfig({ difficulty: d.id })}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    config.difficulty === d.id
                      ? "border-transparent gradient-primary text-primary-foreground"
                      : "border-border bg-white/5 text-muted-foreground"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </Panel>


      <div className="glass grid grid-cols-2 gap-1 rounded-2xl p-1">
        {(["fisso", "casuale"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`relative rounded-xl px-4 py-3 text-sm font-semibold transition ${
              config.mode === m ? "text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {config.mode === m && (
              <motion.span
                layoutId="tab-pill"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-xl gradient-primary"
              />
            )}
            <span className="relative">{m === "fisso" ? "Numero Fisso" : "Numero Casuale"}</span>
          </button>
        ))}
      </div>

      {config.mode === "fisso" ? (
        <Panel className="space-y-4">
          <p className="text-sm text-muted-foreground">Quanti impostori in questa partita?</p>
          <div className="flex items-center justify-between">
            <button
              aria-label="Meno impostori"
              onClick={() => setConfig({ fixedImpostors: Math.max(1, config.fixedImpostors - 1) })}
              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-white/5 transition active:scale-95"
            >
              <Minus className="h-5 w-5" />
            </button>
            <motion.span
              key={config.fixedImpostors}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-bold text-gradient"
            >
              {config.fixedImpostors}
            </motion.span>
            <button
              aria-label="Più impostori"
              onClick={() =>
                setConfig({ fixedImpostors: Math.min(total, config.fixedImpostors + 1) })
              }
              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-white/5 transition active:scale-95"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </Panel>
      ) : (
        <Panel className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Probabilità di estrazione per ogni possibile numero di impostori. Muovi una barra: le
            altre si adattano da sole per restare al 100%.
          </p>
          <div className="space-y-4">
            {Array.from({ length: total + 1 }, (_, i) => {
              const pct = Math.max(0, config.weights[i] ?? 0);
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">
                      {i} {i === 1 ? "impostore" : "impostori"}
                    </span>
                    <span className="text-xs font-semibold text-primary">{pct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={pct}
                    onChange={(e) => setWeight(i, Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                  />
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
            <span className="text-muted-foreground">Totale</span>
            <span className="font-semibold">{sum}%</span>
          </div>
        </Panel>

      )}

      <Panel className="space-y-3">
        <Toggle
          checked={config.spyEnabled}
          onChange={() => setConfig({ spyEnabled: !config.spyEnabled })}
          label="La Spia"
          hint="Conosce la parola e i nomi degli impostori · Consigliata con 5+ giocatori"
        />
        <div className="pt-1">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Eye className="h-3.5 w-3.5" /> Categorie
            </p>
            <button
              onClick={() =>
                setConfig({
                  categories:
                    config.categories.length === CATEGORIES.length ? [] : [...CATEGORIES],
                })
              }
              className="text-xs font-semibold text-primary transition hover:brightness-125"
            >
              {config.categories.length === CATEGORIES.length
                ? "Deseleziona tutto"
                : "Seleziona tutto"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const on = config.categories.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => toggleCategory(c)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    on
                      ? "border-transparent gradient-primary text-primary-foreground"
                      : "border-border bg-white/5 text-muted-foreground"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </Panel>

      {aiError && <p className="text-center text-xs text-destructive">{aiError}</p>}

      <Button
        size="lg"
        onClick={() => void startGame()}
        disabled={aiLoading || (config.mode === "casuale" && sum === 0)}
      >
        {aiLoading ? "L'IA sta scrivendo l'indizio…" : "Distribuisci i ruoli"}
      </Button>
    </Screen>
  );
}
