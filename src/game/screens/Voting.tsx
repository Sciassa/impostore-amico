import { ShieldCheck, Vote } from "lucide-react";
import { motion } from "motion/react";
import { useGame } from "../GameContext";
import { Button, Screen, Title } from "../ui";

export function Voting() {
  const { alivePlayers, votePlayer, voteAllSafe, config, errors, votingRound } = useGame();

  return (
    <Screen>
      <Vote className="h-10 w-10 text-primary" />
      <Title eyebrow={`Errori ${errors} / 2`}>Chi è l'impostore?</Title>
      <p className="-mt-3 text-sm text-muted-foreground">
        Votate all'unanimità e toccate il nome scelto.
        {config.mode === "casuale" && votingRound === 0 && (
          <span className="mt-1 block text-xs text-emerald-300/80">
            Attenzione: TUTTI SAFE al primo giro fa vincere la coalizione in minoranza.
          </span>
        )}
      </p>

      <div className="space-y-2">
        {alivePlayers.map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ delay: i * 0.05, duration: 0.35, type: "spring", stiffness: 380, damping: 24 }}
            onClick={() => votePlayer(p.id)}
            className="glass w-full rounded-2xl px-5 py-4 text-left text-base font-semibold transition hover:bg-white/10"
          >
            {p.name}
          </motion.button>
        ))}
      </div>

      {config.mode === "casuale" && (
        <Button size="lg" variant="success" onClick={voteAllSafe}>
          <ShieldCheck className="h-5 w-5 animate-pulse" /> TUTTI SAFE
        </Button>
      )}
    </Screen>
  );
}
