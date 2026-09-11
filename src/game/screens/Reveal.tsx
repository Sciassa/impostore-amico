import { AnimatePresence, motion } from "motion/react";
import { Check, Eye, Fingerprint, Hand, ShieldCheck, Skull, VenetianMask } from "lucide-react";
import { useState } from "react";
import { useGame } from "../GameContext";
import { Button, Panel, Screen, Title } from "../ui";
import { CancelGameButton } from "./CancelGame";


export function Reveal() {
  const { players, word, revealedIds, markRevealed, impostorNames } = useGame();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [holding, setHolding] = useState(false);
  const [seen, setSeen] = useState(false);

  if (!word) return null;

  const active = players.find((p) => p.id === activeId) ?? null;

  const startHold = () => {
    setHolding(true);
    setSeen(true);
  };

  const done = () => {
    if (active) markRevealed(active.id);
    setActiveId(null);
    setHolding(false);
    setSeen(false);
  };

  return (
    <Screen>
      <AnimatePresence mode="wait">
        {!active ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="flex flex-1 flex-col gap-6"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Distribuzione ruoli
              </p>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
                Tocca il <span className="text-gradient">tuo nome</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                In qualsiasi ordine. Nessun altro deve guardare lo schermo.
              </p>
            </div>

            <Panel className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <span>Hanno letto</span>
                <span className="text-foreground">
                  {revealedIds.length} / {players.length}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  animate={{ width: `${(revealedIds.length / Math.max(1, players.length)) * 100}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 28 }}
                  className="h-full rounded-full gradient-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {players.map((p, i) => {
                  const readDone = revealedIds.includes(p.id);
                  return (
                    <motion.button
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      whileTap={{ scale: 0.95 }}
                      disabled={readDone}
                      onClick={() => setActiveId(p.id)}
                      className={`relative flex min-h-24 flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl border p-4 text-center transition ${
                        readDone
                          ? "border-success/40 bg-success/10"
                          : "border-white/12 bg-white/5 hover:border-primary/60 hover:bg-white/10 hover:shadow-[0_0_28px_-8px_rgba(168,85,247,0.7)]"
                      }`}
                    >
                      {!readDone && (
                        <span className="pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full bg-primary/25 blur-2xl" />
                      )}
                      <span
                        className={`relative flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold ${
                          readDone
                            ? "bg-success/20 text-success"
                            : "gradient-primary text-primary-foreground"
                        }`}
                      >
                        {readDone ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          p.name.charAt(0).toUpperCase()
                        )}
                      </span>
                      <span
                        className={`relative text-sm font-bold leading-tight ${
                          readDone ? "text-muted-foreground line-through" : ""
                        }`}
                      >
                        {p.name}
                      </span>
                      <span className="relative text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {readDone ? "Fatto" : "Tocca"}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </Panel>

            <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Hand className="h-3.5 w-3.5" /> Poi si tiene premuto per leggere il ruolo
            </p>

            <CancelGameButton />
          </motion.div>
        ) : (
          <motion.div
            key="role"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="flex flex-1 flex-col justify-center gap-5"
          >
            <Title eyebrow={active.name}>Tieni premuto per leggere</Title>

            <div
              onMouseDown={startHold}
              onMouseUp={() => setHolding(false)}
              onMouseLeave={() => setHolding(false)}
              onTouchStart={startHold}
              onTouchEnd={() => setHolding(false)}
              onTouchCancel={() => setHolding(false)}
              onContextMenu={(e) => e.preventDefault()}
              className={`glass relative flex min-h-64 select-none items-center justify-center overflow-hidden rounded-3xl p-6 text-center transition-shadow duration-500 ${
                holding ? "glow border-white/25" : ""
              }`}
              style={{ WebkitUserSelect: "none", userSelect: "none", touchAction: "none" }}
            >
              <AnimatePresence>
                {holding && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1.35 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/30 via-fuchsia-500/20 to-transparent blur-2xl"
                  />
                )}
              </AnimatePresence>
              {holding ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="flex w-full flex-col items-center gap-4"
                >
                  {active.role === "impostore" ? (
                    <>
                      <span className="inline-flex items-center gap-2 rounded-full border border-destructive/50 bg-destructive/15 px-5 py-2 text-base font-extrabold uppercase tracking-[0.18em] text-destructive">
                        <Skull className="h-5 w-5" /> Sei l'Impostore
                      </span>
                      <p className="text-4xl font-extrabold leading-tight">{word.suggerimento_vago}</p>
                      <p className="text-sm text-muted-foreground">
                        È solo un indizio vago. Non conosci gli altri impostori.
                      </p>
                    </>
                  ) : active.role === "spia" ? (
                    <>
                      <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-400/10 px-5 py-2 text-base font-extrabold uppercase tracking-[0.18em] text-amber-300">
                        <VenetianMask className="h-5 w-5" /> Agente Segreto
                      </span>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Dossier classificato
                      </p>
                      <p className="text-4xl font-extrabold leading-tight">{word.parola_esatta}</p>
                      <div className="w-full rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-destructive">
                          Obiettivi · Impostori
                        </p>
                        <p className="mt-1 text-xl font-bold text-destructive">
                          {impostorNames.length ? impostorNames.join(" · ") : "Nessuno"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-2 rounded-full border border-success/50 bg-success/15 px-5 py-2 text-base font-extrabold uppercase tracking-[0.18em] text-success">
                        <ShieldCheck className="h-5 w-5" /> Sei un Civile
                      </span>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Parola segreta
                      </p>
                      <p className="text-4xl font-extrabold leading-tight">{word.parola_esatta}</p>
                    </>
                  )}
                </motion.div>
              ) : (
                <div className="space-y-3 text-muted-foreground">
                  <Fingerprint className="mx-auto h-10 w-10 animate-pulse text-primary drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]" />
                  <p className="text-sm">Tieni premuto qui</p>
                  <p className="text-xs">Al rilascio il testo sparisce all'istante</p>
                </div>
              )}
            </div>

            <Button size="lg" variant={seen ? "primary" : "outline"} onClick={done}>
              <Eye className="h-4 w-4" /> Ho capito, prosegui
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  );
}
