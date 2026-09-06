import { MessagesSquare } from "lucide-react";
import { useGame } from "../GameContext";
import { Button, Panel, Screen, Title } from "../ui";

export function Discussion() {
  const { startVoting, errors, alivePlayers } = useGame();
  return (
    <Screen className="justify-center">
      <MessagesSquare className="mx-auto h-12 w-12 text-primary" />
      <Title eyebrow="Nessun timer, nessuna fretta">Discussione in corso</Title>
      <p className="-mt-3 text-sm text-muted-foreground">
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
    </Screen>
  );
}
