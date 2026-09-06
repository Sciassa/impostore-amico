import { Flame } from "lucide-react";
import { useState } from "react";
import { useGame } from "../GameContext";
import { Button, Screen, Title } from "../ui";

export function Revenge() {
  const { players, revengeId, resolveRevenge } = useGame();
  const [guess, setGuess] = useState("");
  const impostor = players.find((p) => p.id === revengeId);
  const spyInGame = players.some((p) => p.role === "spia");
  const targets = players.filter((p) => p.id !== revengeId);

  if (!impostor) return null;

  return (
    <Screen>
      <Flame className="h-10 w-10 text-destructive" />
      <Title eyebrow="Smascherato">{impostor.name}, La Vendetta</Title>
      <p className="-mt-3 text-sm text-muted-foreground">
        {spyInGame
          ? "Indica chi credi sia La Spia. Se indovini, gli impostori vincono."
          : "Scrivi la parola segreta. Se indovini, gli impostori vincono."}
      </p>

      {spyInGame ? (
        <div className="space-y-2">
          {targets.map((p) => (
            <button
              key={p.id}
              onClick={() => resolveRevenge(p.id)}
              className="glass w-full rounded-2xl px-5 py-4 text-left text-base font-semibold transition hover:bg-white/10 active:scale-[0.98]"
            >
              {p.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && guess.trim() && resolveRevenge(guess)}
            placeholder="La parola segreta è..."
            className="h-14 w-full rounded-2xl border border-border bg-input/40 px-4 text-base outline-none transition placeholder:text-muted-foreground focus:border-primary/60"
          />
          <Button size="lg" variant="danger" disabled={!guess.trim()} onClick={() => resolveRevenge(guess)}>
            Tenta La Vendetta
          </Button>
        </div>
      )}
    </Screen>
  );
}
