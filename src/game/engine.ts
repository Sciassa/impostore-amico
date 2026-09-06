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

/**
 * Guardrail: con la Spia attiva devono restare almeno 2 civili puri al tavolo,
 * quindi impostori ≤ totale − 3 (Spia + 2 civili).
 */
export function spyMaxImpostors(totalPlayers: number): number {
  return Math.max(0, totalPlayers - 3);
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
    impostorTotal >= 1 && // senza impostori la Spia rivelerebbe subito che sono tutti civili
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

/** Distribuzione iniziale (percentuali, somma 100) sui possibili numeri di impostori. */
export function defaultWeights(n: number): number[] {
  const len = n + 1;
  const base = Math.floor(100 / len);
  const w = Array.from({ length: len }, () => base);
  let rest = 100 - base * len;
  for (let i = 1; i < len && rest > 0; i++, rest--) w[i] = (w[i] ?? 0) + 1;
  if (rest > 0) w[0] = (w[0] ?? 0) + rest;
  return w;
}

/**
 * Imposta il peso all'indice `index` e riadatta gli altri
 * in modo proporzionale così che la somma resti sempre 100.
 */
export function rebalanceWeights(weights: number[], index: number, value: number): number[] {
  const len = weights.length;
  if (len === 0) return weights;
  const v = Math.min(100, Math.max(0, Math.round(value)));
  if (len === 1) return [100];

  const others = weights.map((w, i) => (i === index ? 0 : Math.max(0, w || 0)));
  const otherSum = others.reduce((a, b) => a + b, 0);
  const remaining = 100 - v;

  const next = new Array<number>(len).fill(0);
  next[index] = v;

  if (otherSum <= 0) {
    const each = Math.floor(remaining / (len - 1));
    let rest = remaining - each * (len - 1);
    for (let i = 0; i < len; i++) {
      if (i === index) continue;
      next[i] = each + (rest > 0 ? 1 : 0);
      if (rest > 0) rest--;
    }
  } else {
    // Ripartizione proporzionale con metodo del resto più grande:
    // nessun indice viene favorito dagli arrotondamenti.
    const exact: { idx: number; frac: number }[] = [];
    let acc = 0;
    for (let i = 0; i < len; i++) {
      if (i === index) continue;
      const raw = ((others[i] ?? 0) / otherSum) * remaining;
      const share = Math.floor(raw);
      next[i] = share;
      acc += share;
      exact.push({ idx: i, frac: raw - share });
    }
    exact.sort((a, b) => b.frac - a.frac);
    let rest = remaining - acc;
    for (let k = 0; k < exact.length && rest > 0; k++, rest--) {
      const idx = exact[k]!.idx;
      next[idx] = (next[idx] ?? 0) + 1;
    }
  }
  return next;
}
