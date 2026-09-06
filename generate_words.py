import json

def write_ts_file(filepath, var_name, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(f"export const {var_name}: [string, string][] = [\n")
        for word, hint in data:
            f.write(f"  [{json.dumps(word)}, {json.dumps(hint)}],\n")
        f.write("];\n")

geografia = [
    ["Italia", "Stivale"], ["Francia", "Baguette"], ["Germania", "Birra"], ["Spagna", "Toro"], ["Giappone", "Sushi"],
    ["Brasile", "Samba"], ["Stati Uniti", "Statua"], ["Cina", "Dragone"], ["India", "Spezie"], ["Egitto", "Piramide"],
    ["Russia", "Matrioska"], ["Regno Unito", "Corona"], ["Australia", "Canguro"], ["Canada", "Acero"], ["Messico", "Sombrero"],
    ["Grecia", "Tempio"], ["Turchia", "Tè"], ["Olanda", "Mulino"], ["Svizzera", "Cioccolato"], ["Austria", "Valzer"],
    ["Portogallo", "Fado"], ["Svezia", "Mobili"], ["Norvegia", "Fiordi"], ["Danimarca", "Sirenetta"], ["Irlanda", "Trifoglio"],
    ["Belgio", "Patatine"], ["Polonia", "Piazza"], ["Ungheria", "Paprika"], ["Repubblica Ceca", "Cristallo"], ["Romania", "Castello"],
    ["Argentina", "Tango"], ["Cile", "Ande"], ["Perù", "Lama"], ["Colombia", "Caffè"], ["Sudafrica", "Diamanti"],
    ["Marocco", "Deserto"], ["Tunisia", "Mosaico"], ["Kenya", "Safari"], ["Thailandia", "Massaggio"], ["Vietnam", "Risaia"],
    ["Corea del Sud", "Tecnologia"], ["Indonesia", "Isole"], ["Nuova Zelanda", "Rugby"], ["Islanda", "Ghiaccio"], ["Cuba", "Sigaro"],
    ["Giamaica", "Reggae"], ["Madagascar", "Lemure"], ["Israele", "Muro"], ["Arabia Saudita", "Petrolio"], ["Emirati Arabi", "Grattacielo"],
    ["Roma", "Lupa"], ["Parigi", "Luce"], ["Londra", "Nebbia"], ["Berlino", "Muro"], ["Madrid", "Movida"],
    ["Lisbona", "Tram"], ["Atene", "Democrazia"], ["Vienna", "Opera"], ["Praga", "Ponte"], ["Varsavia", "Sirena"],
    ["Budapest", "Terme"], ["Amsterdam", "Canale"], ["Bruxelles", "Atomo"], ["Stoccolma", "Nobel"], ["Oslo", "Urlo"],
    ["Copenaghen", "Bicicletta"], ["Helsinki", "Sauna"], ["Dublino", "Boccale"], ["Mosca", "Piazza"], ["Tokyo", "Incrocio"],
    ["Pechino", "Città"], ["Seul", "Pop"], ["Bangkok", "Mercato"], ["Nuova Delhi", "Caos"], ["Giacarta", "Traffico"],
    ["Sidney", "Vela"], ["Il Cairo", "Nilo"], ["Nairobi", "Parco"], ["Città del Capo", "Tavola"], ["New York", "Mela"],
    ["Washington", "Casa"], ["Los Angeles", "Cinema"], ["Chicago", "Vento"], ["Miami", "Spiaggia"], ["San Francisco", "Ponte"],
    ["Toronto", "Torre"], ["Città del Messico", "Metropoli"], ["Rio de Janeiro", "Cristo"], ["Buenos Aires", "Balcone"], ["Lima", "Oceano"],
    ["Bogotà", "Montagna"], ["Santiago", "Vino"], ["Gerusalemme", "Religione"], ["Dubai", "Lusso"], ["Singapore", "Leone"],
    ["Hong Kong", "Porto"], ["Milano", "Duomo"], ["Venezia", "Gondola"], ["Firenze", "Culla"], ["Napoli", "Vesuvio"],
    ["Torino", "Mole"], ["Genova", "Lanterna"], ["Palermo", "Arancia"], ["Bari", "Levante"], ["Bologna", "Torre"],
    ["Verona", "Balcone"], ["Pisa", "Pendenza"], ["Siena", "Piazza"], ["Catania", "Lava"], ["Messina", "Stretto"],
    ["Trieste", "Vento"], ["Padova", "Santo"], ["Brescia", "Leona"], ["Parma", "Prosciutto"], ["Modena", "Aceto"],
    ["Reggio Calabria", "Bronzi"], ["Cagliari", "Fenicottero"], ["Perugia", "Bacio"], ["Trento", "Monti"], ["Bolzano", "Mele"],
    ["Potenza", "Scale"], ["Ancona", "Gomito"], ["L'Aquila", "Gran Sasso"], ["Campobasso", "Castello"], ["Catanzaro", "Ponte"],
    ["Po", "Pianura"], ["Tevere", "Storia"], ["Arno", "Ponte"], ["Adige", "Valle"], ["Ticino", "Parco"],
    ["Nilo", "Eternità"], ["Rio delle Amazzoni", "Polmone"], ["Mississippi", "Jazz"], ["Gange", "Sacro"], ["Danubio", "Blu"],
    ["Reno", "Castelli"], ["Tamigi", "Ruota"], ["Senna", "Bateau"], ["Volga", "Steppa"], ["Mekong", "Delta"],
    ["Everest", "Tetto"], ["K2", "Sfida"], ["Monte Bianco", "Traforo"], ["Cervino", "Piramide"], ["Gran Sasso", "Corno"],
    ["Etna", "Fumo"], ["Vesuvio", "Cratere"], ["Kilimangiaro", "Neve"], ["Fuji", "Cono"], ["Ande", "Condor"],
    ["Alpi", "Sci"], ["Appennini", "Dorso"], ["Himalaya", "Silenzio"], ["Pirenei", "Confine"], ["Urali", "Divisione"],
    ["Sicilia", "Trinacria"], ["Sardegna", "Nuraghe"], ["Corsica", "Napoleone"], ["Elba", "Esilio"], ["Capri", "Faraglioni"],
    ["Ischia", "Fango"], ["Pantelleria", "Vento"], ["Lampedusa", "Porta"], ["Madagascar", "Baobab"], ["Groenlandia", "Bianco"],
    ["Australia", "Outback"], ["Nuova Guinea", "Tribù"], ["Borneo", "Giungla"], ["Sumatra", "Tigre"], ["Giava", "Vulcano"],
    ["Taiwan", "Lanterne"], ["Sri Lanka", "Cannella"], ["Cipro", "Afrodite"], ["Malta", "Cavalieri"], ["Creta", "Labirinto"],
    ["Rodi", "Colosso"], ["Santorini", "Tramonto"], ["Mykonos", "Mulini"], ["Ibiza", "Notte"], ["Maiorca", "Grotte"],
    ["Canarie", "Primavera"], ["Azzorre", "Anticiclone"], ["Hawaii", "Onde"], ["Galapagos", "Tartaruga"], ["Maldive", "Atollo"],
    ["Seychelles", "Palme"], ["Mauritius", "Dodo"], ["Bahamas", "Corallo"], ["Bermuda", "Triangolo"], ["Tahiti", "Perle"],
    ["Mar Mediterraneo", "Culla"], ["Oceano Atlantico", "Rotta"], ["Oceano Pacifico", "Abisso"], ["Oceano Indiano", "Spezie"], ["Mar Rosso", "Barriera"],
    ["Mar Morto", "Sale"], ["Mar Nero", "Crimea"], ["Mar Baltico", "Ambra"], ["Deserto del Sahara", "Duna"], ["Deserto del Gobi", "Scheletro"],
    ["Gran Canyon", "Strati"], ["Cascate del Niagara", "Salto"], ["Cascate dell'Iguazú", "Vapore"], ["Barriera Corallina", "Pesci"], ["Polo Nord", "Orso"],
    ["Antartide", "Pinguino"], ["Colosseo", "Gladiatore"], ["Tour Eiffel", "Ferro"], ["Muraglia Cinese", "Spazio"], ["Statua della Libertà", "Fiaccola"]
]

moda = [
    ["Gucci", "Morsetto"], ["Prada", "Triangolo"], ["Armani", "Aquila"], ["Versace", "Medusa"], ["Valentino", "Rosso"],
    ["Dolce & Gabbana", "Sicilia"], ["Fendi", "Pelliccia"], ["Missoni", "Zig-zag"], ["Moschino", "Cuore"], ["Salvatore Ferragamo", "Scarpa"],
    ["Louis Vuitton", "Monogramma"], ["Chanel", "Numero"], ["Dior", "Fiocco"], ["Hermès", "Arancio"], ["Saint Laurent", "Smoking"],
    ["Givenchy", "Audrey"], ["Balenciaga", "Volume"], ["Celine", "Parigi"], ["Chloé", "Bohémien"], ["Lanvin", "Blu"],
    ["Burberry", "Quadri"], ["Vivienne Westwood", "Punk"], ["Alexander McQueen", "Teschio"], ["Stella McCartney", "Bio"], ["Victoria Beckham", "Minimal"],
    ["Ralph Lauren", "Cavallo"], ["Calvin Klein", "Intimo"], ["Tommy Hilfiger", "Bandiera"], ["Michael Kors", "Jetset"], ["Tom Ford", "Occhiali"],
    ["Marc Jacobs", "Grunge"], ["Oscar de la Renta", "Gala"], ["Carolina Herrera", "Camicia"], ["Vera Wang", "Sposa"], ["Diane von Furstenberg", "Wrap"],
    ["Nike", "Baffo"], ["Adidas", "Strisce"], ["Puma", "Salto"], ["Reebok", "Palestra"], ["New Balance", "Lettera"],
    ["Converse", "Stella"], ["Vans", "Tavola"], ["Dr. Martens", "Cucitura"], ["Timberland", "Scarponcino"], ["Levi's", "Etichetta"],
    ["Diesel", "Jeans"], ["Benetton", "Colori"], ["Zara", "Veloce"], ["H&M", "Collaborazione"], ["Uniqlo", "Base"],
    ["Rolex", "Corona"], ["Omega", "Luna"], ["Cartier", "Pantera"], ["Bulgari", "Serpente"], ["Tiffany", "Azzurro"],
    ["Patek Philippe", "Eredità"], ["Audemars Piguet", "Ottagono"], ["Swatch", "Plastica"], ["Ray-Ban", "Goccia"], ["Oakley", "Sport"],
    ["Persol", "Freccia"], ["Camicia", "Colletto"], ["Pantaloni", "Piega"], ["Jeans", "Rivetto"], ["Gonna", "Orlo"],
    ["Vestito", "Occasione"], ["Giacca", "Revers"], ["Cappotto", "Bottoni"], ["Maglione", "Lana"], ["Cardigan", "Bottoni"],
    ["T-shirt", "Cotone"], ["Canotta", "Spalline"], ["Felpa", "Cappuccio"], ["Leggings", "Elastico"], ["Shorts", "Estate"],
    ["Cravatta", "Nodo"], ["Papillon", "Farfalla"], ["Cintura", "Fibbia"], ["Sciarpa", "Nodo"], ["Guanti", "Dita"],
    ["Cappello", "Tesa"], ["Berretto", "Lana"], ["Borsa", "Manico"], ["Zaino", "Spalle"], ["Portafoglio", "Tasca"],
    ["Scarpe", "Suola"], ["Stivali", "Tacco"], ["Sandali", "Piede"], ["Sneakers", "Lacci"], ["Mocassini", "Nappine"],
    ["Ballerine", "Danza"], ["Tacchi a spillo", "Altezza"], ["Zeppe", "Sughero"], ["Pantofole", "Casa"], ["Calze", "Filo"],
    ["Collant", "Denari"], ["Intimo", "Pizzo"], ["Reggiseno", "Coppa"], ["Mutande", "Elastico"], ["Pigiama", "Notte"],
    ["Accappatoio", "Bagno"], ["Costume da bagno", "Sabbia"], ["Bikini", "Sole"], ["Pareo", "Spiaggia"], ["Smoking", "Gala"],
    ["Frac", "Coda"], ["Tailleur", "Ufficio"], ["Trench", "Pioggia"], ["Parka", "Freddo"], ["Bomber", "Volo"],
    ["Chiodo", "Pelle"], ["Blazer", "Bottoni"], ["Salopette", "Bretelle"], ["Tuta", "Sport"], ["Kimono", "Seta"],
    ["Sfilata", "Musica"], ["Passerella", "Passo"], ["Modella", "Flash"], ["Stilista", "Matita"], ["Sarto", "Ago"],
    ["Couture", "Mano"], ["Pret-a-porter", "Serie"], ["Vogue", "Copertina"], ["Fashion Week", "Calendario"], ["Streetwear", "Strada"],
    ["Vintage", "Tempo"], ["Outlet", "Sconto"], ["Lusso", "Sogno"], ["Tessuto", "Trama"], ["Seta", "Morbido"],
    ["Velluto", "Riflesso"], ["Lino", "Fresco"], ["Pelle", "Odore"], ["Cachemire", "Calore"], ["Denim", "Blu"],
    ["Pizzo", "Trasparenza"], ["Tulle", "Volume"], ["Satin", "Lucido"], ["Lurex", "Luccichio"], ["Pailettes", "Luce"],
    ["Ricamo", "Filo"], ["Stampa", "Disegno"], ["Pattern", "Ripetizione"], ["Texture", "Tatto"], ["Drappo", "Caduta"],
    ["Silhouette", "Profilo"], ["Taglio", "Forbici"], ["Cucitura", "Macchina"], ["Fodera", "Interno"], ["Tasche", "Contenuto"],
    ["Maniche", "Braccio"], ["Polsini", "Bottone"], ["Scollo", "V"], ["Zip", "Denti"], ["Velcro", "Strappo"],
    ["Bottoni", "Asole"], ["Spilla", "Punta"], ["Gemelli", "Polso"], ["Orologio", "Lancette"], ["Anello", "Dito"],
    ["Collana", "Collo"], ["Orecchini", "Lobo"], ["Braccialetto", "Polso"], ["Occhiali da sole", "Lente"], ["Ombrello", "Pioggia"],
    ["Profumo", "Scia"], ["Rossetto", "Labbra"], ["Smalto", "Unghie"], ["Trucco", "Pennello"], ["Acconciatura", "Pettine"],
    ["Parrucca", "Testa"], ["Maschera", "Volto"], ["Piercing", "Buco"], ["Tatuaggio", "Inchiostro"], ["Manicure", "Mani"],
    ["Pedicure", "Piedi"], ["Estetica", "Specchio"], ["Salone", "Poltrona"], ["Boutique", "Vetrina"], ["Showroom", "Esposizione"],
    ["Manichino", "Vetrina"], ["Gruccia", "Armadio"], ["Specchio", "Riflesso"], ["Camerino", "Tenda"], ["Cartellino", "Prezzo"],
    ["Sconto", "Percentuale"], ["Saldi", "Folla"], ["Trend", "Onda"], ["Influencer", "Social"], ["Icona", "Tempo"],
    ["Museo della moda", "Storia"], ["Atelier", "Creazione"], ["Sottoveste", "Scivolo"], ["Giarrettiera", "Gamba"], ["Corsetto", "Vita"],
    ["Ventaglio", "Aria"], ["Bastone", "Passeggio"], ["Cappelliera", "Viaggio"], ["Baule", "Custodia"], ["Valigia", "Ruote"],
    ["Necessaire", "Viaggio"], ["Beauty case", "Trucchi"], ["Pochette", "Mano"], ["Clutch", "Scatto"], ["Marsupio", "Vita"],
    ["Tote bag", "Spesa"], ["Shopping bag", "Carta"], ["Sneakers a stivaletto", "Caviglia"], ["Espadrillas", "Corda"], ["Infradito", "Gomma"],
    ["Sabot", "Tallone"], ["Mules", "Punta"], ["Derby", "Stringhe"], ["Oxford", "Formale"], ["Brogue", "Buchi"],
    ["Loafer", "Comodo"], ["Anfibi", "Lacci"], ["Cuissardes", "Ginocchio"], ["Decolleté", "Scollo"], ["Mary Jane", "Cinturino"]
]

write_ts_file("src/game/words/geografia.ts", "GEOGRAFIA", geografia)
write_ts_file("src/game/words/moda.ts", "MODA", moda)

print(f"Geografia count: {len(geografia)}")
print(f"Moda count: {len(moda)}")
