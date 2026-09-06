import { AnimatePresence } from "motion/react";
import { GameProvider, useGame } from "./GameContext";
import { Lobby } from "./screens/Lobby";
import { Setup } from "./screens/Setup";
import { Reveal } from "./screens/Reveal";
import { Discussion } from "./screens/Discussion";
import { Voting } from "./screens/Voting";
import { FeedbackScreen } from "./screens/Feedback";
import { Revenge } from "./screens/Revenge";
import { GameOver } from "./screens/GameOver";

function Router() {
  const { phase } = useGame();
  return (
    <main className="flex min-h-screen flex-col">
      <AnimatePresence mode="wait">
        {phase === "lobby" && <Lobby key="lobby" />}
        {phase === "setup" && <Setup key="setup" />}
        {phase === "reveal" && <Reveal key="reveal" />}
        {phase === "discussion" && <Discussion key="discussion" />}
        {phase === "voting" && <Voting key="voting" />}
        {phase === "feedback" && <FeedbackScreen key="feedback" />}
        {phase === "revenge" && <Revenge key="revenge" />}
        {phase === "over" && <GameOver key="over" />}
      </AnimatePresence>
    </main>
  );
}

export function GameApp() {
  return (
    <GameProvider>
      <Router />
    </GameProvider>
  );
}
