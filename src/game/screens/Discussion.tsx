import { MessagesSquare, RotateCw } from "lucide-react";
import { useGame } from "../GameContext";
import { Button, Panel, Screen, Title } from "../ui";
import { SpectatorButton } from "./Spectator";

export function Discussion() {
  const { startVoting, errors, alivePlayers, starterName } = useGame();
  return (
    <Screen className="justify-center">
      <MessagesSquare className="mx-auto h-12 w-12 text-primary" />
      <Title eyebrow="Nessun timer, nessuna fretta">Discussione in corso</Title>
      {starterName && (
        <Panel className="space-y-1 text-center">
          <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <RotateCw className="h-3.5 w-3.5" /> Inizia
          </p>
          <p className="text-2xl font-bold text-gradient">{starterName}</p>
          <p className="text-xs text-muted-foreground">Si prosegue in senso orario.</p>
        </Panel>
      )}
      <p className="-mt-1 text-sm text-muted-foreground">
        Parlate, accusate, difendetevi. Quando siete pronti, andate al voto.
      </p>
      <Panel className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">In vita</span>
        <span className="font-semibold">{alivePlayers.length}</span>
      </Panel>
      <Panel className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Errori del gruppo</span>
        <span className={`font-semibold ${errors > 0 ? "text-destructive" : ""}`}>{errors} / 2</span>
      </Panel>

      <Button size="lg" onClick={startVoting}>
        TERMINA E VOTA
      </Button>
      <SpectatorButton />
    </Screen>
  );
}
