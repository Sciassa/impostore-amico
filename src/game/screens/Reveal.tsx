import { AnimatePresence, motion } from "motion/react";
import { Eye, Fingerprint, Smartphone } from "lucide-react";
import { useState } from "react";
import { useGame } from "../GameContext";
import { Button, Screen, Title } from "../ui";

export function Reveal() {
  const { revealPlayer, revealIndex, players, word, nextReveal, impostorNames } = useGame();
  const [stage, setStage] = useState<"pass" | "role">("pass");
  const [holding, setHolding] = useState(false);
  const [seen, setSeen] = useState(false);

  if (!revealPlayer || !word) return null;

  const advance = () => {
    setStage("pass");
    setHolding(false);
    setSeen(false);
    nextReveal();
  };

  const startHold = () => {
    setHolding(true);
    setSeen(true);
  };

  return (
    <Screen>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Giocatore {revealIndex + 1} di {players.length}
      </p>

      <AnimatePresence mode="wait">
        {stage === "pass" ? (
          <motion.div
            key="pass"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="flex flex-1 flex-col justify-center gap-6"
          >
            <Smartphone className="mx-auto h-12 w-12 text-primary" />
            <Title>Passa il telefono a {revealPlayer.name}</Title>
            <p className="-mt-3 text-sm text-muted-foreground">
              Nessun altro deve guardare lo schermo.
            </p>
            <Button size="lg" onClick={() => setStage("role")}>
              Sono io
            </Button>
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
            <Title eyebrow={revealPlayer.name}>Tieni premuto per leggere</Title>

            <div
              onMouseDown={startHold}
              onMouseUp={() => setHolding(false)}
              onMouseLeave={() => setHolding(false)}
              onTouchStart={startHold}
              onTouchEnd={() => setHolding(false)}
              onTouchCancel={() => setHolding(false)}
              onContextMenu={(e) => e.preventDefault()}
              className={`glass relative flex min-h-64 select-none items-center justify-center rounded-3xl p-6 text-center transition-shadow duration-500 ${
                holding ? "glow border-white/25" : ""
              }`}
              style={{ WebkitUserSelect: "none", userSelect: "none", touchAction: "none" }}
            >
              {holding ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3"
                >
                  {revealPlayer.role === "impostore" ? (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-destructive">
                        Sei l'Impostore
                      </p>
                      <p className="text-3xl font-bold">{word.suggerimento_vago}</p>
                      <p className="text-xs text-muted-foreground">
                        È solo un indizio vago. Non conosci gli altri impostori.
                      </p>
                    </>
                  ) : revealPlayer.role === "spia" ? (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                        Sei La Spia
                      </p>
                      <p className="text-3xl font-bold">{word.parola_esatta}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Impostori
                      </p>
                      <p className="text-lg font-semibold text-destructive">
                        {impostorNames.length ? impostorNames.join(" · ") : "Nessuno"}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-success">
                        Sei un Civile
                      </p>
                      <p className="text-3xl font-bold">{word.parola_esatta}</p>
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

            <Button size="lg" variant={seen ? "primary" : "outline"} onClick={advance}>
              <Eye className="h-4 w-4" /> Ho capito, prosegui
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  );
}
