import { ArrowLeft, Eye, Minus, Plus } from "lucide-react";
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
          layout
          transition={{ type: "spring", stiffness: 500, damping: 34 }}
          className="absolute top-0.5 h-5 w-5 rounded-full bg-foreground shadow"
          style={{ left: checked ? 22 : 2 }}
        />
      </span>
    </button>
  );
}

export function Setup() {
  const { roster, config, setConfig, setMode, toggleCategory, goLobby, startGame } = useGame();
  const total = roster.length;

  const setWeight = (i: number, v: number) => {
    const weights = [...config.weights];
    weights[i] = v;
    setConfig({ weights });
  };

  const sum = config.weights.reduce((a, b) => a + Math.max(0, b || 0), 0);

  return (
    <Screen>
      <button
        onClick={goLobby}
        className="flex items-center gap-2 self-start text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Giocatori
      </button>
      <Title eyebrow={`${total} giocatori`}>Setup partita</Title>

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
            Peso di probabilità per ogni possibile numero di impostori. Nessuno saprà quanti ne sono
            usciti.
          </p>
          <div className="space-y-4">
            {Array.from({ length: total + 1 }, (_, i) => {
              const v = config.weights[i] ?? 0;
              const pct = sum > 0 ? Math.round((Math.max(0, v) / sum) * 100) : 0;
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">
                      {i} {i === 1 ? "impostore" : "impostori"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      peso {v} · {pct}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={v}
                    onChange={(e) => setWeight(i, Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                  />
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      <Panel className="space-y-3">
        <Toggle
          checked={config.spyEnabled}
          onChange={() => setConfig({ spyEnabled: !config.spyEnabled })}
          label="La Spia"
          hint="Conosce la parola e i nomi degli impostori"
        />
        <div className="pt-1">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Eye className="h-3.5 w-3.5" /> Categorie
          </p>
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

      <Button size="lg" onClick={startGame} disabled={config.mode === "casuale" && sum === 0}>
        Distribuisci i ruoli
      </Button>
    </Screen>
  );
}
