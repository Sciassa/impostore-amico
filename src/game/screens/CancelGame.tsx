import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { useGame } from "../GameContext";
import { Button } from "../ui";

export function CancelGameButton({ label = "Annulla partita" }: { label?: string }) {
  const { cancelGame } = useGame();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        <X className="h-4 w-4" /> {label}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-5 backdrop-blur-md sm:items-center"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 28, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="glass w-full max-w-sm space-y-4 rounded-3xl p-6 text-center"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-destructive/40 bg-destructive/15">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </span>
              <h2 className="text-xl font-extrabold">Annullare la partita?</h2>
              <p className="text-sm text-muted-foreground">
                I ruoli e la parola vengono cancellati. I giocatori restano in lobby.
              </p>
              <div className="space-y-2 pt-1">
                <Button variant="danger" onClick={cancelGame}>
                  Sì, annulla
                </Button>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Continua a giocare
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
