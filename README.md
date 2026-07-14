# Casina 🏠

Dashboard locale per la ricerca di una casa da acquistare a Milano. L'idea non è partire dagli annunci, ma **capire prima quali zone OMI presidiare** in base a budget, superficie desiderata e accessibilità alla metropolitana.

## Perché Casina

Cercare casa a Milano seguendo solo i portali di annunci significa rincorrere ciò che appare, senza una strategia su *dove* cercare. Le quotazioni OMI dell'Agenzia delle Entrate sono pubbliche e gratuite, ma consultarle zona per zona è scomodo e poco intuitivo.

Casina risponde a due domande operative:

- **Con questo budget e questa superficie, quali zone OMI sono plausibili?**
- **Tra quelle zone, quali fermate metro possono aiutare a restringere o prioritizzare la ricerca?**

Non stima il prezzo di un immobile specifico — serve a selezionare le aree da monitorare.

## Come funziona

L'utente imposta tre parametri:

- Budget minimo
- Budget massimo
- Superficie target in m²

La dashboard calcola le zone OMI compatibili, mostra una sintesi, evidenzia la prima zona per priorità, e produce una mappa interattiva con le fermate metro e una tabella dettagliata.

Il modello di stima è stratificato su tre livelli:

1. **OMI pesato** — i valori di compravendita sono pesati per tipologia (abitazioni civili, signorili, economiche, ville) e stato (normale, ottimo)
2. **Benchmark di mercato** — le quotazioni OMI sono corrette con dati Immobiliare.it per 32 macro-zone di Milano
3. **Premio metro** — bonus % sul prezzo in base a fermate dentro la zona, distanza, numero di linee

Tre scenari regolano il peso di ciascun livello: **Prudente**, **Realistico**, **Ristrutturato**.

## Avvio rapido

```bash
git clone https://github.com/flavi0gritti/casina.git
cd casina
python3 -m http.server 4173 --bind 0.0.0.0
```

Apri [http://localhost:4173](http://localhost:4173).

Zero dipendenze, zero build. Solo HTML, CSS e JavaScript vanilla.

## Dataset

| Dataset | Fonte | Contenuto |
|---|---|---|
| Zone OMI | Agenzia delle Entrate (2024/2) | 43 zone con geometrie |
| Quotazioni compravendita | OMI | 155 record residenziali, 42 zone coperte |
| Fermate metropolitane | Open Data Comune di Milano | 130 fermate (M1–M5) |
| NIL (quartieri) | Open Data Comune di Milano | 88 nuclei di identità locale |
| Benchmark Immobiliare.it | Immobiliare.it | 32 valori medi di mercato |
| OpenStreetMap | OSM via Overpass | Strade, civici, indici derivati |

## Struttura

```
casina/
  index.html          # Interfaccia
  app.js              # Logica, stato, rendering, calcoli geografici
  styles.css          # Tema, layout responsive
  dataset/            # Dati geografici e tabellari
  docs/               # Documentazione approfondita
```

## Scelte tecniche

Il progetto è volutamente senza framework e senza build tool perché è ancora in fase esplorativa e cambia spesso. La complessità attuale è soprattutto dati + UX, non richiede React, Vue o librerie cartografiche pesanti.

Quando la mappa diventerà più interattiva o i dataset cresceranno, ha senso valutare Leaflet/MapLibre e un preprocessing dati offline.

## Limiti

- La stima è volutamente indicativa: usa valori medi di zona, non include classe energetica, piano, stato interno o pertinenze
- La distanza dalle fermate metro è lineare (dal centroide della zona), non pedonale reale
- L'associazione quartieri–zone OMI è approssimata
- Le quotazioni sono del secondo semestre 2024

## Documentazione

- [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md) — panoramica completa, flusso di rendering, limiti, evoluzioni
- [`docs/DATASETS.md`](docs/DATASETS.md) — dettaglio dataset, copertura, schema, dati in uso e dati disponibili

## Licenza

MIT
