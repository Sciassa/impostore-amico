import { Crown, Skull } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useGame } from "../GameContext";
import { Button, Panel, Screen, Title } from "../ui";

export function GameOver() {
  const { ending, word, players, playAgain, newGame } = useGame();
  if (!ending) return null;
  const civils = ending.winner === "civili";

  useEffect(() => {
    import("canvas-confetti").then((mod) => {
      const confetti = mod.default;
      const colors = civils
        ? ["#34d399", "#22d3ee", "#a7f3d0"]
        : ["#a855f7", "#d946ef", "#1f2937", "#7c3aed"];
      const end = Date.now() + 1200;
      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
          disableForReducedMotion: true,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
          disableForReducedMotion: true,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    });
  }, [civils]);

  return (
    <Screen className="justify-center text-center">
      <motion.div
        initial={{ scale: 0.5, rotate: -12, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        className="mx-auto"
      >
        {civils ? (
          <Crown className="h-16 w-16 text-success" />
        ) : (
          <Skull className="h-16 w-16 text-destructive" />
        )}
      </motion.div>
      <Title eyebrow="Fine partita">{ending.title}</Title>
      <p className="-mt-3 text-sm text-muted-foreground">{ending.subtitle}</p>

      <Panel className="space-y-3 text-left">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Parola segreta</span>
          <span className="font-semibold">{word?.parola_esatta}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Indizio impostori</span>
          <span className="font-semibold">{word?.suggerimento_vago}</span>
        </div>
        <div className="space-y-1 border-t border-border pt-3">
          {players.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span className={p.alive ? "" : "text-muted-foreground line-through"}>{p.name}</span>
              <span
                className={
                  p.role === "impostore"
                    ? "font-semibold text-destructive"
                    : p.role === "spia"
                      ? "font-semibold text-accent"
                      : "text-muted-foreground"
                }
              >
                {p.role === "impostore" ? "Impostore" : p.role === "spia" ? "Spia" : "Civile"}
              </span>
            </div>
          ))}
        </div>
      </Panel>

      <Button size="lg" onClick={playAgain}>
        Nuova partita, stessi giocatori
      </Button>
      <Button variant="ghost" onClick={newGame}>
        Torna alla lobby
      </Button>
    </Screen>
  );
}
