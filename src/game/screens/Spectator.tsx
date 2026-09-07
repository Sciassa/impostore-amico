import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeOff, ShieldAlert, X } from "lucide-react";
import { useState } from "react";
import { useGame } from "../GameContext";
import { Button } from "../ui";

export function SpectatorButton() {
  const { word, players, impostorNames } = useGame();
  const [step, setStep] = useState<"idle" | "confirm" | "open">("idle");

  if (!word) return null;
  const spy = players.find((p) => p.role === "spia");

  return (
    <>
      <Button variant="ghost" onClick={() => setStep("confirm")}>
        <Eye className="h-4 w-4" /> SPETTATORE
      </Button>

      <AnimatePresence>
        {step !== "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-5 backdrop-blur-xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="glass w-full max-w-sm space-y-5 rounded-3xl p-6 text-center"
            >
              {step === "confirm" ? (
                <>
                  <ShieldAlert className="mx-auto h-10 w-10 text-amber-300" />
                  <h2 className="text-2xl font-extrabold leading-tight">Sei uno spettatore?</h2>
                  <p className="text-sm text-muted-foreground">
                    Stai per vedere la parola segreta, gli impostori e la Spia. Se stai giocando,
                    annulla subito.
                  </p>
                  <div className="grid gap-2">
                    <Button variant="danger" onClick={() => setStep("open")}>
                      <Eye className="h-4 w-4" /> Sì, mostrami tutto
                    </Button>
                    <Button variant="outline" onClick={() => setStep("idle")}>
                      <X className="h-4 w-4" /> Annulla
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Vista spettatore
                  </p>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Parola segreta
                    </p>
                    <p className="text-3xl font-extrabold leading-tight">{word.parola_esatta}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Indizio impostori: {word.suggerimento_vago}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-destructive">
                      Impostori
                    </p>
                    <p className="mt-1 text-lg font-bold text-destructive">
                      {impostorNames.length ? impostorNames.join(" · ") : "Nessuno"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                      Spia
                    </p>
                    <p className="mt-1 text-lg font-bold text-amber-200">
                      {spy ? spy.name : "Nessuna"}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setStep("idle")}>
                    <EyeOff className="h-4 w-4" /> Chiudi
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
