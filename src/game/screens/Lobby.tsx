import { AnimatePresence, motion } from "motion/react";
import { Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useGame } from "../GameContext";
import { Button, Panel, Screen, Title } from "../ui";

export function Lobby() {
  const { roster, addPlayer, removePlayer, goSetup } = useGame();
  const [name, setName] = useState("");

  const submit = () => {
    addPlayer(name);
    setName("");
  };

  return (
    <Screen>
      <Title eyebrow="Party game · Pass and play">L'Impostore</Title>
      <p className="-mt-3 text-sm text-muted-foreground">
        Un solo telefono, ruoli nascosti, nessun timer. Aggiungi chi sta giocando.
      </p>

      <Panel className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Nome giocatore"
            className="h-12 flex-1 rounded-2xl border border-border bg-input/40 px-4 text-base text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:bg-input/60"
          />
          <button
            onClick={submit}
            aria-label="Aggiungi giocatore"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-primary text-primary-foreground glow transition active:scale-95"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {roster.length} in tavolo
        </div>

        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {roster.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16, height: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center justify-between rounded-2xl border border-border bg-white/5 px-4 py-3"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="font-medium">{p.name}</span>
                </span>
                <button
                  onClick={() => removePlayer(p.id)}
                  aria-label={`Rimuovi ${p.name}`}
                  className="text-muted-foreground transition hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {roster.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nessun giocatore ancora. Servono almeno 3 persone.
            </p>
          )}
        </div>
      </Panel>

      <Button size="lg" disabled={roster.length < 3} onClick={goSetup}>
        Configura la partita
      </Button>
    </Screen>
  );
}
