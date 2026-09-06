import { CATEGORIES, WORDS, type Category, type WordEntry } from "./words";

export type Role = "civile" | "impostore" | "spia";

export interface Player {
  id: string;
  name: string;
  role: Role;
  alive: boolean;
}

export type Mode = "fisso" | "casuale";

export interface GameConfig {
  mode: Mode;
  fixedImpostors: number;
  weights: number[]; // index = numero di impostori, valore 0-100
  spyEnabled: boolean;
  categories: Category[];
}

export const defaultConfig = (): GameConfig => ({
  mode: "fisso",
  fixedImpostors: 1,
  weights: [],
  spyEnabled: false,
  categories: [...CATEGORIES],
});

export const uid = () => Math.random().toString(36).slice(2, 10);

/** Estrazione pesata: ritorna l'indice scelto in base ai pesi. */
export function weightedPick(weights: number[]): number {
  const total = weights.reduce((a, b) => a + Math.max(0, b), 0);
  if (total <= 0) return 0;
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= Math.max(0, weights[i] ?? 0);
    if (r < 0) return i;
  }
  return weights.length - 1;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j] as T, a[i] as T];
  }
  return a;
}

export function pickWord(categories: Category[]): WordEntry {
  const pool = WORDS.filter((w) => categories.includes(w.categoria));
  const list = pool.length > 0 ? pool : WORDS;
  return list[Math.floor(Math.random() * list.length)] as WordEntry;
}

/** Guardrail: con la Spia attiva, gli impostori non possono superare questo numero. */
export function spyMaxImpostors(totalPlayers: number): number {
  return Math.floor(totalPlayers / 2) - 1;
}

export interface RoundSetup {
  players: Player[];
  word: WordEntry;
  impostorTotal: number;
  spyActive: boolean;
}

export function buildRound(
  names: { id: string; name: string }[],
  config: GameConfig,
): RoundSetup {
  const total = names.length;
  const impostorTotal =
    config.mode === "fisso"
      ? Math.min(config.fixedImpostors, total)
      : Math.min(weightedPick(config.weights), total);

  // Guardrail matematico sulla Spia (silenzioso).
  const spyActive =
    config.spyEnabled &&
    impostorTotal <= spyMaxImpostors(total) &&
    total - impostorTotal >= 1;

  const order = shuffle(names);
  const roles = new Map<string, Role>();
  order.forEach((p, i) => {
    if (i < impostorTotal) roles.set(p.id, "impostore");
    else roles.set(p.id, "civile");
  });
  if (spyActive) {
    const civilians = order.filter((p) => roles.get(p.id) === "civile");
    if (civilians[0]) roles.set(civilians[0].id, "spia");
  }

  return {
    players: names.map((p) => ({
      id: p.id,
      name: p.name,
      role: roles.get(p.id) ?? "civile",
      alive: true,
    })),
    word: pickWord(config.categories),
    impostorTotal,
    spyActive,
  };
}

export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
