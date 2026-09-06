import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  buildRound,
  defaultConfig,
  defaultWeights,
  normalize,
  rebalanceWeights,
  uid,
  type GameConfig,
  type Mode,
  type Player,
} from "./engine";
import type { Category, WordEntry } from "./words";


export type Phase =
  | "lobby"
  | "setup"
  | "reveal"
  | "discussion"
  | "voting"
  | "feedback"
  | "revenge"
  | "over";

export interface Feedback {
  tone: "bad" | "good";
  title: string;
  subtitle: string;
}

export interface Ending {
  winner: "impostori" | "civili";
  title: string;
  subtitle: string;
}

interface GameState {
  phase: Phase;
  roster: { id: string; name: string }[];
  config: GameConfig;
  players: Player[];
  word: WordEntry | null;
  impostorTotal: number;
  spyActive: boolean;
  revealIndex: number;
  errors: number;
  impostorsKilled: number;
  feedback: Feedback | null;
  ending: Ending | null;
  revengeId: string | null;
  starterName: string | null;
  votingRound: number;
}

interface GameApi extends GameState {
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  setConfig: (patch: Partial<GameConfig>) => void;
  setWeight: (index: number, value: number) => void;
  setMode: (m: Mode) => void;
  toggleCategory: (c: Category) => void;
  goSetup: () => void;
  goLobby: () => void;
  startGame: () => void;
  nextReveal: () => void;
  startVoting: () => void;
  votePlayer: (id: string) => void;
  voteAllSafe: () => void;
  resolveRevenge: (guess: string, kind?: "spia" | "parola") => void;
  dismissFeedback: () => void;
  playAgain: () => void;
  newGame: () => void;
  alivePlayers: Player[];
  revealPlayer: Player | null;
  impostorNames: string[];
}

const Ctx = createContext<GameApi | null>(null);

const initial = (): GameState => ({
  phase: "lobby",
  roster: [],
  config: defaultConfig(),
  players: [],
  word: null,
  impostorTotal: 0,
  spyActive: false,
  revealIndex: 0,
  errors: 0,
  impostorsKilled: 0,
  feedback: null,
  ending: null,
  revengeId: null,
  starterName: null,
  votingRound: 0,
});

export function GameProvider({ children }: { children: ReactNode }) {
  const [s, set] = useState<GameState>(initial);

  const patch = useCallback((p: Partial<GameState>) => set((prev) => ({ ...prev, ...p })), []);

  const addPlayer = useCallback((name: string) => {
    const clean = name.trim();
    if (!clean) return;
    set((prev) => ({ ...prev, roster: [...prev.roster, { id: uid(), name: clean }] }));
  }, []);

  const removePlayer = useCallback((id: string) => {
    set((prev) => ({ ...prev, roster: prev.roster.filter((p) => p.id !== id) }));
  }, []);

  const setConfig = useCallback((p: Partial<GameConfig>) => {
    set((prev) => ({ ...prev, config: { ...prev.config, ...p } }));
  }, []);

  const setWeight = useCallback((index: number, value: number) => {
    set((prev) => ({
      ...prev,
      config: { ...prev.config, weights: rebalanceWeights(prev.config.weights, index, value) },
    }));
  }, []);

  const setMode = useCallback((m: Mode) => setConfig({ mode: m }), [setConfig]);

  const toggleCategory = useCallback((c: Category) => {
    set((prev) => {
      const has = prev.config.categories.includes(c);
      const next = has
        ? prev.config.categories.filter((x) => x !== c)
        : [...prev.config.categories, c];
      return { ...prev, config: { ...prev.config, categories: next.length ? next : prev.config.categories } };
    });
  }, []);

  const goSetup = useCallback(() => {
    set((prev) => {
      const n = prev.roster.length;
      const weights =
        prev.config.weights.length === n + 1 &&
        prev.config.weights.reduce((a, b) => a + Math.max(0, b || 0), 0) === 100
          ? prev.config.weights
          : defaultWeights(n);
      return {
        ...prev,
        phase: "setup",
        config: {
          ...prev.config,
          weights,
          fixedImpostors: Math.min(Math.max(1, prev.config.fixedImpostors), Math.max(1, n)),
        },
      };
    });
  }, []);

  const goLobby = useCallback(() => patch({ phase: "lobby" }), [patch]);

  const startGame = useCallback(() => {
    set((prev) => {
      const round = buildRound(prev.roster, prev.config);
      const starter = round.players[Math.floor(Math.random() * round.players.length)];
      return {
        ...prev,
        ...round,
        phase: "reveal",
        revealIndex: 0,
        errors: 0,
        impostorsKilled: 0,
        feedback: null,
        ending: null,
        revengeId: null,
        starterName: starter?.name ?? null,
        votingRound: 0,
      };
    });
  }, []);

  const nextReveal = useCallback(() => {
    set((prev) => {
      const next = prev.revealIndex + 1;
      if (next >= prev.players.length) return { ...prev, phase: "discussion", revealIndex: 0 };
      return { ...prev, revealIndex: next };
    });
  }, []);

  const startVoting = useCallback(() => patch({ phase: "voting" }), [patch]);

  const votePlayer = useCallback((id: string) => {
    set((prev) => {
      const target = prev.players.find((p) => p.id === id);
      if (!target) return prev;
      prev = { ...prev, votingRound: prev.votingRound + 1 };

      const total = prev.players.length;
      const impostors = prev.players.filter((p) => p.role === "impostore").length;

      if (total > 0 && impostors === 0) {
        return {
          ...prev,
          phase: "over",
          ending: {
            winner: "impostori",
            title: "Nessun impostore in gioco",
            subtitle: "Erano tutti civili: bastava votare TUTTI SAFE. Il gruppo ha perso.",
          },
        };
      }

      if (total > 0 && impostors === total) {
        return {
          ...prev,
          phase: "over",
          ending: {
            winner: "impostori",
            title: "Eravate tutti impostori",
            subtitle: "Nessun civile al tavolo: bastava votare TUTTI SAFE. Il gruppo ha perso.",
          },
        };
      }

      if (target.role === "impostore") {
        return { ...prev, phase: "revenge", revengeId: id };
      }

      const errors = prev.errors + 1;
      const players = prev.players.map((p) => (p.id === id ? { ...p, alive: false } : p));
      if (errors >= 2) {
        return {
          ...prev,
          players,
          errors,
          phase: "over",
          ending: {
            winner: "impostori",
            title: "Vincono gli Impostori",
            subtitle: "Due civili innocenti eliminati. Il gruppo ha perso il controllo.",
          },
        };
      }
      return {
        ...prev,
        players,
        errors,
        phase: "feedback",
        feedback: {
          tone: "bad",
          title: "Sbagliato! Era un civile",
          subtitle: "Un errore commesso. Al secondo, gli impostori vincono.",
        },
      };
    });
  }, []);

  const voteAllSafe = useCallback(() => {
    set((prev) => {
      const total = prev.players.length;
      const impostors = prev.players.filter((p) => p.role === "impostore").length;

      // Regola del primo giro: TUTTI SAFE subito => vince la coalizione in minoranza.
      if (prev.votingRound === 0 && total > 0 && impostors > 0 && impostors < total) {
        const civili = total - impostors;
        const winner: "impostori" | "civili" = impostors <= civili ? "impostori" : "civili";
        return {
          ...prev,
          votingRound: 1,
          phase: "over",
          ending: {
            winner,
            title: winner === "impostori" ? "Vincono gli Impostori" : "Vincono i Civili",
            subtitle:
              "TUTTI SAFE al primo giro: vince la coalizione in minoranza. Niente accordi sottobanco.",
          },
        };
      }

      if (total > 0 && impostors === total) {
        return {
          ...prev,
          phase: "over",
          ending: {
            winner: "civili",
            title: "Chiamata perfetta",
            subtitle: "Eravate tutti impostori e nessuno è stato eliminato: il gruppo si salva.",
          },
        };
      }
      const impostorAlive = prev.players.some((p) => p.role === "impostore" && p.alive);
      if (impostorAlive) {
        return {
          ...prev,
          phase: "over",
          ending: {
            winner: "impostori",
            title: "Vince l'Impostore nascosto",
            subtitle: "Avete dichiarato tutti innocenti, ma qualcuno mentiva.",
          },
        };
      }
      return {
        ...prev,
        phase: "over",
        ending: {
          winner: "civili",
          title: "Vincono i Civili",
          subtitle: "Nessun impostore in vita: il gruppo ha chiuso la partita all'unanimità.",
        },
      };
    });
  }, []);

  const resolveRevenge = useCallback((guess: string, kind: "spia" | "parola" = "parola") => {
    set((prev) => {
      const id = prev.revengeId;
      if (!id) return prev;
      const spy = prev.players.find((p) => p.role === "spia");
      const success =
        kind === "spia"
          ? !!spy && guess === spy.id
          : normalize(guess) === normalize(prev.word?.parola_esatta ?? "");

      if (success) {
        return {
          ...prev,
          phase: "over",
          revengeId: null,
          ending: {
            winner: "impostori",
            title: "La Vendetta è riuscita",
            subtitle: spy
              ? "L'impostore smascherato ha individuato la Spia."
              : "L'impostore smascherato ha indovinato la parola segreta.",
          },
        };
      }

      const players = prev.players.map((p) => (p.id === id ? { ...p, alive: false } : p));
      const impostorsKilled = prev.impostorsKilled + 1;

      if (prev.config.mode === "fisso" && impostorsKilled >= prev.impostorTotal) {
        return {
          ...prev,
          players,
          impostorsKilled,
          revengeId: null,
          phase: "over",
          ending: {
            winner: "civili",
            title: "Vincono i Civili",
            subtitle: "Tutti gli impostori sono stati smascherati.",
          },
        };
      }

      return {
        ...prev,
        players,
        impostorsKilled,
        revengeId: null,
        phase: "feedback",
        feedback: {
          tone: "good",
          title: "Impostore eliminato. Continuate!",
          subtitle: "Nessuno vi dirà quanti ne mancano.",
        },
      };
    });
  }, []);

  const dismissFeedback = useCallback(() => patch({ phase: "discussion", feedback: null }), [patch]);

  const playAgain = useCallback(() => {
    set((prev) => ({ ...prev, phase: "setup", ending: null, feedback: null }));
  }, []);

  const newGame = useCallback(() => set(initial()), []);

  const value = useMemo<GameApi>(() => {
    const alivePlayers = s.players.filter((p) => p.alive);
    const revealPlayer = s.players[s.revealIndex] ?? null;
    const impostorNames = s.players.filter((p) => p.role === "impostore").map((p) => p.name);
    return {
      ...s,
      addPlayer,
      removePlayer,
      setConfig,
      setWeight,
      setMode,
      toggleCategory,
      goSetup,
      goLobby,
      startGame,
      nextReveal,
      startVoting,
      votePlayer,
      voteAllSafe,
      resolveRevenge,
      dismissFeedback,
      playAgain,
      newGame,
      alivePlayers,
      revealPlayer,
      impostorNames,
    };
  }, [
    s,
    addPlayer,
    removePlayer,
    setConfig,
    setWeight,
    setMode,
    toggleCategory,
    goSetup,
    goLobby,
    startGame,
    nextReveal,
    startVoting,
    votePlayer,
    voteAllSafe,
    resolveRevenge,
    dismissFeedback,
    playAgain,
    newGame,
  ]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGame() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGame deve essere usato dentro GameProvider");
  return ctx;
}
