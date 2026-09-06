import { ShieldCheck, Vote } from "lucide-react";
import { motion } from "motion/react";
import { useGame } from "../GameContext";
import { Button, Screen, Title } from "../ui";

export function Voting() {
  const { alivePlayers, votePlayer, voteAllSafe, config, errors } = useGame();

  return (
    <Screen>
      <Vote className="h-10 w-10 text-primary" />
      <Title eyebrow={`Errori ${errors} / 2`}>Chi è l'impostore?</Title>
      <p className="-mt-3 text-sm text-muted-foreground">
        Votate all'unanimità e toccate il nome scelto.
      </p>

      <div className="space-y-2">
        {alivePlayers.map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            onClick={() => votePlayer(p.id)}
            className="glass w-full rounded-2xl px-5 py-4 text-left text-base font-semibold transition hover:bg-white/10 active:scale-[0.98]"
          >
            {p.name}
          </motion.button>
        ))}
      </div>

      {config.mode === "casuale" && (
        <Button size="lg" variant="success" onClick={voteAllSafe}>
          <ShieldCheck className="h-5 w-5" /> TUTTI SAFE
        </Button>
      )}
    </Screen>
  );
}
