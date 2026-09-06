import { createFileRoute } from "@tanstack/react-router";
import { GameApp } from "@/game/GameApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "L'Impostore — Party game di deduzione pass-and-play" },
      {
        name: "description",
        content:
          "Party game mobile di ruoli nascosti: un solo telefono, impostori segreti, La Spia e nessun timer. Configura probabilità e gioca subito.",
      },
      { property: "og:title", content: "L'Impostore — Party game di deduzione" },
      {
        property: "og:description",
        content:
          "Ruoli nascosti, indizi vaghi e votazioni a eliminazione. Un solo telefono per tutto il gruppo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GameApp,
});
