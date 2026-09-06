export type Category =
  | "Classiche"
  | "Meme"
  | "Charlie Kirk"
  | "Roma"
  | "Calcio"
  | "Cinema"
  | "Videogiochi";

export const CATEGORIES: Category[] = [
  "Classiche",
  "Meme",
  "Charlie Kirk",
  "Roma",
  "Calcio",
  "Cinema",
  "Videogiochi",
];

export interface WordEntry {
  categoria: Category;
  parola_esatta: string;
  suggerimento_vago: string;
}

/**
 * Regola editoriale: il suggerimento NON descrive mai la parola.
 * È un'astrazione, un dettaglio marginale o un'emozione.
 */
export const WORDS: WordEntry[] = [
  // Classiche
  { categoria: "Classiche", parola_esatta: "Dentista", suggerimento_vago: "Poltrona" },
  { categoria: "Classiche", parola_esatta: "Corvo", suggerimento_vago: "Urbano" },
  {
    categoria: "Classiche",
    parola_esatta: "Shopping Natalizio",
    suggerimento_vago: "Spendere",
  },
  {
    categoria: "Classiche",
    parola_esatta: "Hockey su ghiaccio",
    suggerimento_vago: "Bastone",
  },
  { categoria: "Classiche", parola_esatta: "Aeroporto", suggerimento_vago: "Attesa" },
  { categoria: "Classiche", parola_esatta: "Matrimonio", suggerimento_vago: "Parenti" },
  { categoria: "Classiche", parola_esatta: "Traslocare", suggerimento_vago: "Scatole" },
  { categoria: "Classiche", parola_esatta: "Sauna", suggerimento_vago: "Legno" },
  { categoria: "Classiche", parola_esatta: "Esame di guida", suggerimento_vago: "Sudore" },
  { categoria: "Classiche", parola_esatta: "Biblioteca", suggerimento_vago: "Sussurro" },

  // Meme
  { categoria: "Meme", parola_esatta: "Clip virale", suggerimento_vago: "Social Network" },
  { categoria: "Meme", parola_esatta: "Rickroll", suggerimento_vago: "Anni Ottanta" },
  { categoria: "Meme", parola_esatta: "Gatto arrabbiato", suggerimento_vago: "Tavola" },
  { categoria: "Meme", parola_esatta: "Doge", suggerimento_vago: "Comic Sans" },
  { categoria: "Meme", parola_esatta: "Storia Instagram", suggerimento_vago: "Ventiquattro" },
  { categoria: "Meme", parola_esatta: "Commento tossico", suggerimento_vago: "Notifica" },

  // Charlie Kirk
  {
    categoria: "Charlie Kirk",
    parola_esatta: "Faccia rimpicciolita",
    suggerimento_vago: "Fotomontaggio",
  },
  { categoria: "Charlie Kirk", parola_esatta: "Dibattito al campus", suggerimento_vago: "Gazebo" },
  { categoria: "Charlie Kirk", parola_esatta: "Microfono aperto", suggerimento_vago: "Fila" },
  { categoria: "Charlie Kirk", parola_esatta: "Cappellino rosso", suggerimento_vago: "Merchandising" },
  { categoria: "Charlie Kirk", parola_esatta: "Prove change my mind", suggerimento_vago: "Tavolino" },

  // Roma
  { categoria: "Roma", parola_esatta: "Francesco Totti", suggerimento_vago: "Bandiera" },
  { categoria: "Roma", parola_esatta: "Fontana di Trevi", suggerimento_vago: "Moneta" },
  { categoria: "Roma", parola_esatta: "Carciofo alla giudia", suggerimento_vago: "Ghetto" },
  { categoria: "Roma", parola_esatta: "Raccordo Anulare", suggerimento_vago: "Cerchio" },
  { categoria: "Roma", parola_esatta: "Gabbiano", suggerimento_vago: "Cassonetto" },
  { categoria: "Roma", parola_esatta: "Sanpietrini", suggerimento_vago: "Tacchi" },

  // Calcio
  { categoria: "Calcio", parola_esatta: "Rigore sbagliato", suggerimento_vago: "Silenzio" },
  { categoria: "Calcio", parola_esatta: "VAR", suggerimento_vago: "Monitor" },
  { categoria: "Calcio", parola_esatta: "Fantacalcio", suggerimento_vago: "Asta" },
  { categoria: "Calcio", parola_esatta: "Portiere", suggerimento_vago: "Guanti" },
  { categoria: "Calcio", parola_esatta: "Derby", suggerimento_vago: "Fumogeni" },

  // Cinema
  { categoria: "Cinema", parola_esatta: "Titanic", suggerimento_vago: "Freddo" },
  { categoria: "Cinema", parola_esatta: "Il Padrino", suggerimento_vago: "Arancia" },
  { categoria: "Cinema", parola_esatta: "Scena post credits", suggerimento_vago: "Pazienza" },
  { categoria: "Cinema", parola_esatta: "Popcorn", suggerimento_vago: "Rumore" },
  { categoria: "Cinema", parola_esatta: "Jurassic Park", suggerimento_vago: "Bicchiere" },
  { categoria: "Cinema", parola_esatta: "Shining", suggerimento_vago: "Corridoio" },

  // Videogiochi
  { categoria: "Videogiochi", parola_esatta: "Among Us", suggerimento_vago: "Coriandolo" },
  { categoria: "Videogiochi", parola_esatta: "Minecraft", suggerimento_vago: "Cubetto" },
  { categoria: "Videogiochi", parola_esatta: "Tetris", suggerimento_vago: "Incastro" },
  { categoria: "Videogiochi", parola_esatta: "Boss finale", suggerimento_vago: "Pattern" },
  { categoria: "Videogiochi", parola_esatta: "Mario Kart", suggerimento_vago: "Amicizia" },
  { categoria: "Videogiochi", parola_esatta: "Dark Souls", suggerimento_vago: "Falò" },
];
