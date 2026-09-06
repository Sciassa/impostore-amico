import { ANIMALI } from "./words/animali";
import { ANIME } from "./words/anime";
import { CALCIO } from "./words/calcio";
import { CHARLIE_KIRK } from "./words/charliekirk";
import { CIBO } from "./words/cibo";
import { CINEMA } from "./words/cinema";
import { CLASSICHE } from "./words/classiche";
import { FILM } from "./words/film";
import { GEOGRAFIA } from "./words/geografia";
import { IDEE } from "./words/idee";
import { MEDICINA } from "./words/medicina";
import { MEME } from "./words/meme";
import { MITOLOGIA } from "./words/mitologia";
import { MODA } from "./words/moda";
import { MUSICA } from "./words/musica";
import { POLITICI } from "./words/politici";
import { SCUOLA } from "./words/scuola";
import { SERIE_TV } from "./words/serietv";
import { SPORT } from "./words/sport";
import { STORIA } from "./words/storia";
import { TECNOLOGIA } from "./words/tecnologia";
import { VIAGGI } from "./words/viaggi";
import { VIDEOGIOCHI } from "./words/videogiochi";

export type Category =
  | "Classiche"
  | "Meme"
  | "Charlie Kirk"
  | "Calcio"
  | "Cinema"
  | "Videogiochi"
  | "Musica"
  | "Cibo e Bevande"
  | "Animali"
  | "Tecnologia"
  | "Viaggi"
  | "Serie TV"
  | "Storia"
  | "Scuola e Lavoro"
  | "Film"
  | "Esponenti Politici"
  | "Idee Politiche"
  | "Sport"
  | "Geografia"
  | "Moda"
  | "Medicina"
  | "Mitologia"
  | "Anime & Manga";

export interface WordEntry {
  categoria: Category;
  parola_esatta: string;
  suggerimento_vago: string;
}

/**
 * Regola editoriale: il suggerimento NON descrive mai la parola.
 * È un'astrazione, un dettaglio marginale o un'emozione.
 */
const SOURCES: [Category, [string, string][]][] = [
  ["Classiche", CLASSICHE],
  ["Meme", MEME],
  ["Charlie Kirk", CHARLIE_KIRK],
  ["Calcio", CALCIO],
  ["Cinema", CINEMA],
  ["Videogiochi", VIDEOGIOCHI],
  ["Musica", MUSICA],
  ["Cibo e Bevande", CIBO],
  ["Animali", ANIMALI],
  ["Tecnologia", TECNOLOGIA],
  ["Viaggi", VIAGGI],
  ["Serie TV", SERIE_TV],
  ["Storia", STORIA],
  ["Scuola e Lavoro", SCUOLA],
  ["Film", FILM],
  ["Esponenti Politici", POLITICI],
  ["Idee Politiche", IDEE],
  ["Sport", SPORT],
  ["Geografia", GEOGRAFIA],
  ["Moda", MODA],
];

export const CATEGORIES: Category[] = SOURCES.map(([c]) => c);

export const WORDS: WordEntry[] = SOURCES.flatMap(([categoria, list]) =>
  list.map(([parola_esatta, suggerimento_vago]) => ({
    categoria,
    parola_esatta,
    suggerimento_vago,
  })),
);
