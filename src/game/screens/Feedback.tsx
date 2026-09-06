import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useGame } from "../GameContext";
import { Button, Screen, Title } from "../ui";

export function FeedbackScreen() {
  const { feedback, dismissFeedback } = useGame();
  if (!feedback) return null;
  const bad = feedback.tone === "bad";

  return (
    <Screen
      className="justify-center text-center"
      animate={bad ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
      transition={{ duration: 0.45 }}
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mx-auto"
      >
        {bad ? (
          <XCircle className="h-16 w-16 text-destructive" />
        ) : (
          <CheckCircle2 className="h-16 w-16 text-success" />
        )}
      </motion.div>
      <Title>{feedback.title}</Title>
      <p className="-mt-3 text-sm text-muted-foreground">{feedback.subtitle}</p>
      <Button size="lg" onClick={dismissFeedback}>
        Continuate la partita
      </Button>
    </Screen>
  );
}
