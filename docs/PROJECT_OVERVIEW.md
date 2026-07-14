# Casina Milano - documentazione progetto

## Obiettivo

Casina e una dashboard locale per aiutare la ricerca di una casa da acquistare a Milano. L'idea centrale non e partire dagli annunci, ma capire prima quali zone OMI presidiare in base a budget, superficie desiderata e accessibilita metro.

La dashboard risponde a due domande operative:

- con questo budget e questa superficie, quali zone OMI sono plausibili?
- tra quelle zone, quali fermate metro possono aiutare a restringere o prioritizzare la ricerca?

Il progetto si concentra quindi sulla fase iniziale della ricerca: selezionare aree da monitorare, non stimare il prezzo puntuale di un immobile specifico.

## Stato attuale della dashboard

La vista principale e una ricerca per budget. L'utente imposta:

- budget minimo;
- budget massimo;
- superficie target in mq.

La dashboard calcola le zone OMI compatibili, mostra una sintesi numerica, evidenzia la prima zona ordinata per budget e accessibilita metro, renderizza una mappa richiudibile e produce una tabella delle zone da presidiare.

I filtri metro sono separati dalla ricerca budget e restano disponibili anche quando la mappa viene chiusa:

- linea metro utile: Tutte, M1, M2, M3, M4, M5;
- fermata specifica, popolata in base alle fermate utili;
- distanza massima dalla zona: 500 m, 800 m, 1 km, 1,5 km.

La dashboard include una validazione minima: il budget minimo deve essere inferiore al budget massimo. Se la regola non e rispettata, i campi vengono evidenziati e la tabella mostra un messaggio di correzione invece di restituire semplicemente zero risultati.

## Architettura tecnica

Il progetto e una web app statica, senza framework JavaScript e senza processo di build.

File principali:

- `index.html`: struttura semantica della pagina e contenitori UI.
- `styles.css`: layout, tema visivo, responsive design e stati interattivi.
- `app.js`: caricamento dati, normalizzazione, calcoli geografici, filtri, ordinamento e rendering.
- `dataset/`: dati locali usati o disponibili per l'app.

Per avviarla in locale e sufficiente servire la cartella:

```bash
python3 -m http.server 4173
```

Poi aprire:

```text
http://127.0.0.1:4173/
```

## Framework e librerie

Non sono stati introdotti framework applicativi. La scelta attuale e deliberatamente conservativa:

- HTML nativo per la struttura.
- CSS nativo con Grid, Flexbox, custom properties e media query.
- JavaScript vanilla per logica, stato e rendering DOM.
- SVG nativo per la mappa.
- `fetch()` per caricare GeoJSON e JSON locali.
- `Intl.NumberFormat` per formattazione euro e numeri italiani.

Motivazioni:

- il progetto e ancora in una fase esplorativa e cambia spesso;
- i dataset sono locali e possono essere caricati direttamente dal browser;
- evitare build tool, bundler e dipendenze rende il prototipo facile da aprire, modificare e condividere;
- la complessita attuale e soprattutto dati + UX, non richiede ancora React, Vue o una libreria cartografica completa.

In futuro, se la mappa dovesse diventare piu interattiva o se i dataset crescessero molto, avrebbe senso valutare:

- Leaflet o MapLibre per una mappa geografica piu robusta;
- un layer di preprocessing dati per alleggerire il browser;
- TypeScript o moduli JS separati se `app.js` diventasse difficile da mantenere.

## Scelte di funzionamento

### Modello prezzi

La dashboard usa le quotazioni OMI di compravendita 2024/2. Per ogni zona viene calcolato un prezzo medio al mq:

```text
prezzo medio mq = (Compr_min + Compr_max) / 2
stima zona = prezzo medio mq * superficie target
```

La zona e considerata nel budget se la stima cade tra budget minimo e budget massimo.

Sono considerate solo le tipologie residenziali:

- Abitazioni civili;
- Abitazioni signorili;
- Abitazioni di tipo economico;
- Ville e Villini.

Le quotazioni OMI sono valori di zona e non sostituiscono una valutazione puntuale. Non includono caratteristiche specifiche dell'immobile come piano, stato interno, esposizione, box, pertinenze, classe energetica o spese condominiali.

### Bande OMI

Il codice mantiene una classificazione per fasce OMI:

- B;
- C;
- D;
- E;
- R.

La ricerca operativa usa di default B, C, D, E. La fascia R e lasciata fuori dai risultati principali perche meno coerente con l'uso urbano della dashboard. Esiste comunque un modello di fallback per ogni fascia, usato solo quando mancano quotazioni puntuali collegate alla zona.

### Metro utili

Una fermata metro e considerata utile per una zona se:

- ricade dentro il poligono della zona OMI; oppure
- si trova entro il raggio selezionato dal centroide della zona.

La distanza e calcolata con formula Haversine. I filtri metro permettono di restringere i risultati per linea, fermata e raggio.

### Ordinamento zone

Le zone filtrate vengono ordinate con una priorita sintetica basata su:

- vicinanza della stima al centro del range di budget;
- numero di fermate metro utili, con contributo limitato per evitare che la metro domini tutto.

La sezione "Prima zona in lista" non e una raccomandazione assoluta: indica il primo risultato secondo questo ordinamento. Serve come punto di partenza per leggere la tabella.

### Associazione NIL alle zone OMI

I NIL sono usati come contesto territoriale leggibile. Ogni NIL viene associato alla zona OMI che lo contiene o, se non c'e contenimento diretto, alla zona piu vicina al suo centroide.

Questo approccio e leggero e sufficiente per dare riferimenti di quartiere, ma non produce una vera intersezione geometrica pesata tra NIL e OMI.

### Proiezione mappa

La mappa viene disegnata in SVG usando i poligoni GeoJSON OMI. Per evitare distorsioni evidenti, longitudine e latitudine vengono trasformate con una correzione semplice:

```text
x = longitudine * cos(latitudine media)
y = latitudine
```

Il disegno viene poi scalato uniformemente e centrato nel viewBox. Non e una proiezione cartografica completa, ma per Milano e sufficiente a mantenere proporzioni visive credibili.

## Scelte stilistiche e UX

La dashboard e pensata come strumento operativo, non come landing page. Per questo:

- la prima schermata contiene subito controlli, sintesi, mappa e tabella;
- i controlli principali sono pochi: budget minimo, budget massimo, superficie;
- i filtri metro sono secondari e vicini alla mappa;
- la mappa e richiudibile per dare piu spazio alla tabella;
- il layout usa pannelli compatti, non sezioni decorative;
- le card hanno raggio contenuto, coerente con una UI da lavoro;
- i colori sono sobri, con verde petrolio per le zone nel budget e tinte piu spente per contesto e stati non prioritari;
- il contrasto principale e dato da testo scuro, fondi chiari e una barra scura per la lettura della prima zona.

Palette principale:

- sfondo: `#f5f3ee`;
- pannelli: `#fffdf8`;
- testo: `#1f2933`;
- accent: `#0f766e`;
- errore: `#b42318`;
- linee: `#ded8cd`.

Responsive:

- sopra desktop: griglie compatte e mappa ampia;
- sotto 1040 px: controlli e filtri si ridistribuiscono su due colonne;
- sotto 720 px: layout a colonna singola, mappa piu bassa e tabella scrollabile.

## Flusso di rendering

All'avvio `app.js`:

1. collega gli event listener ai controlli;
2. carica in parallelo zone OMI, fermate metro, NIL e quotazioni OMI di compravendita;
3. normalizza le proprieta principali;
4. calcola centroidi e indice NIL;
5. collega le quotazioni di compravendita alle zone OMI;
6. prepara i limiti della proiezione SVG;
7. renderizza chip metro, select fermate, metriche, mappa e tabella.

A ogni modifica dei controlli:

1. aggiorna lo stato;
2. valida budget e superficie;
3. filtra le zone;
4. ricalcola fermate utili;
5. aggiorna sintesi, mappa e tabella.

## Limiti noti

- Le quotazioni OMI non contengono classe energetica.
- La stima usa il valore medio OMI al mq, quindi e volutamente grossolana.
- La distanza metro usa il centroide della zona, non la distanza pedonale reale.
- L'associazione NIL-zone OMI e approssimata.
- Il dataset OpenStreetMap e stato preprocessato in indici strade/indirizzi, ma la ricerca libera e attualmente disattivata nella UI.
- Il dataset dei mezzi di superficie e presente, ma non e usato nella dashboard attuale.
- Il dataset locazioni e mantenuto, ma l'app e focalizzata sull'acquisto.
- I file GML/KML OMI 2025/2 sono presenti come materiale potenziale, ma non sono usati nel rendering corrente.

## Possibili evoluzioni

- Reintrodurre una ricerca intelligente per via, indirizzo, zona o fermata usando gli indici OpenStreetMap.
- Usare una libreria cartografica quando serviranno zoom, pan, layer multipli e tooltip piu evoluti.
- Aggiungere filtri di preferenza personalizzabili: distanza dal centro, linea metro preferita, esclusione zone, priorita quartiere, presenza parchi o servizi.
- Integrare mezzi di superficie e tempi di percorrenza, non solo distanza lineare.
- Creare un preprocessing stabile che generi un dataset gia arricchito: zona OMI + quotazioni + NIL + fermate + centroidi + metriche.
- Salvare preset di budget e preferenze per confrontare scenari diversi.
