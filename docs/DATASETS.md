# Dataset del progetto

Questo documento descrive i dataset presenti nella cartella `dataset/`, distinguendo tra dati usati dalla dashboard attuale e dati disponibili per evoluzioni future.

## Dataset usati dalla dashboard attuale

### Zone OMI

Percorso principale:

```text
dataset/OMI/_expl_f205-2024_2.geojson
```

Copie/tabellari collegate:

```text
dataset/OMI/zone_omi_2024_2.json
dataset/OMI/zone_omi_2024_2.csv
```

Contenuto:

- 43 feature GeoJSON;
- geometrie delle zone OMI di Milano;
- campi principali: `Name`, `Anno / Semestre`, `Fascia`, `Zona_Descr`, `Zona`, `LinkZona`, `Cod_tip_prev`, `Descr_tip_prev`, `Stato_prev`, `Microzona`.

Uso in app:

- base geografica della mappa;
- codice zona, nome, fascia e tipologia prevalente;
- calcolo del centroide;
- contenimento geometrico delle fermate;
- colorazione e selezione delle zone.

Distribuzione fasce nel file:

| Fascia | Zone |
| --- | ---: |
| B | 9 |
| C | 9 |
| D | 20 |
| E | 4 |
| R | 1 |

Nota:

- la dashboard usa come default operativo le fasce B, C, D, E;
- la fascia R viene esclusa dai risultati principali.

### Quotazioni OMI compravendita

Percorsi:

```text
dataset/OMI/quotazioni/ds2940_quotazioni_omi_compravendita_2024_2.json
dataset/OMI/quotazioni/ds2940_quotazioni_omi_compravendita_2024_2.csv
```

Contenuto:

- 446 record;
- 42 zone con record di quotazione;
- 155 record residenziali usati dal modello;
- campi principali: `Area_territoriale`, `Regione`, `Prov`, `Comune_ISTAT`, `Comune_cat`, `Sez`, `Comune_amm`, `Comune_descrizione`, `Fascia`, `Zona`, `LinkZona`, `Cod_Tip`, `Descr_Tipologia`, `Stato`, `Stato_prev`, `Compr_min`, `Compr_max`, `Sup_NL_compr`.

Tipologie presenti:

- Abitazioni civili;
- Abitazioni di tipo economico;
- Abitazioni signorili;
- Box;
- Capannoni industriali;
- Laboratori;
- Magazzini;
- Negozi;
- Uffici;
- Uffici strutturati;
- Ville e Villini.

Tipologie residenziali usate dall'app:

- Abitazioni civili;
- Abitazioni signorili;
- Abitazioni di tipo economico;
- Ville e Villini.

Uso in app:

- per ogni zona viene letto il minimo e massimo di compravendita;
- l'app aggrega i record residenziali per zona;
- `saleMin` e il minimo tra i valori `Compr_min`;
- `saleMax` e il massimo tra i valori `Compr_max`;
- il prezzo medio al mq e `(saleMin + saleMax) / 2`.

Copertura:

- le zone OMI sono 43;
- le quotazioni residenziali coprono 42 zone;
- la zona senza quotazioni residenziali collegate e `R2`.

Nota importante:

- questi dati non includono classe energetica o APE;
- non includono caratteristiche puntuali dell'immobile;
- sono quotazioni di zona e vanno lette come riferimento preliminare.

### Fermate metropolitane

Percorsi:

```text
dataset/metro_lines/tpl_metrofermate.geojson
dataset/metro_lines/tpl_metrofermate.csv
dataset/metro_lines/tpl_metrofermate_shp/
```

Contenuto:

- 130 fermate GeoJSON;
- campi principali: `id_amat`, `nome`, `linee`;
- coordinate nel GeoJSON;
- nel CSV sono presenti anche `LONG_X_4326`, `LAT_Y_4326`, `Location`.

Conteggio per linea:

| Linea | Fermate |
| --- | ---: |
| M1 | 38 |
| M2 | 35 |
| M3 | 21 |
| M4 | 21 |
| M5 | 19 |

Nota:

- alcune fermate possono appartenere a piu linee, quindi la somma per linea supera il numero di feature.

Uso in app:

- costruzione dei filtri `Tutte`, `M1`, `M2`, `M3`, `M4`, `M5`;
- calcolo delle fermate utili per zona OMI;
- rendering dei punti neri sulla mappa;
- elenco delle fermate nella tabella.

Regola di utilita:

- fermata dentro il poligono OMI; oppure
- fermata entro il raggio selezionato dal centroide della zona.

### NIL / quartieri

Percorso:

```text
dataset/neighborhoods/ds964_NIL_WM.geojson
```

Contenuto:

- 88 feature GeoJSON;
- campi principali: `ID_NIL`, `NIL`, `Valido_dal`, `Valido_al`, `Fonte`, `Shape_Length`, `Shape_Area`, `OBJECTID`.

Uso in app:

- arricchimento testuale delle zone OMI;
- nella tabella vengono mostrati fino a tre NIL associati a ciascuna zona.

Metodo di associazione:

- se il centroide del NIL ricade in una zona OMI, viene associato a quella zona;
- altrimenti viene associato alla zona OMI piu vicina.

Limite:

- non e una sovrapposizione geometrica precisa tra poligoni NIL e OMI;
- serve come contesto leggibile per orientarsi.

## Dataset presenti ma non usati nella UI corrente

### Quotazioni OMI locazioni

Percorsi:

```text
dataset/OMI/quotazioni/ds2939_quotazioni_omi_locazioni_2024_2.json
dataset/OMI/quotazioni/ds2939_quotazioni_omi_locazioni_2024_2.csv
```

Contenuto:

- 446 record;
- campi analoghi al dataset compravendita;
- valori specifici: `Loc_min`, `Loc_max`, `Sup_NL_loc`.

Stato:

- mantenuto in progetto;
- non usato perche la dashboard attuale e focalizzata sull'acquisto, non sull'affitto.

Possibile uso futuro:

- confronto comprare vs affittare;
- stima canone atteso per zona;
- metrica di rendimento lordo indicativa, se combinata con i valori di compravendita.

### OMI 2025/2 GML e KML

Percorsi:

```text
dataset/OMI/quotazioni/F205 - Comune di MILANO 2025-2.gml
dataset/OMI/quotazioni/F205 - Comune di MILANO 2025-2.kml
```

Contenuto:

- file XML/GML/KML relativi al Comune di Milano;
- potenziale fonte per geometrie o aggiornamenti OMI piu recenti.

Stato:

- presenti in cartella;
- non caricati da `app.js`;
- non integrati nel modello attuale.

Possibile uso futuro:

- aggiornamento semestre OMI;
- controllo coerenza geometrie;
- pipeline di conversione verso GeoJSON/JSON normalizzato.

### Mezzi di superficie

Percorsi:

```text
dataset/surface_transport/tpl_fermate.geojson
dataset/surface_transport/tpl_fermate.csv
dataset/surface_transport/tpl_fermate_shp/
```

Contenuto:

- 4690 fermate GeoJSON;
- campi principali: `id_amat`, `ubicazione`, `linee`;
- nel CSV sono presenti anche `LONG_X_4326`, `LAT_Y_4326`, `Location`.

Stato:

- non usato nella dashboard attuale;
- escluso per mantenere la prima versione centrata su OMI + metro.

Possibile uso futuro:

- filtro accessibilita con tram, bus e filobus;
- punteggio trasporto pubblico piu completo;
- confronto tra zone servite da metro e zone servite solo da superficie.

Attenzione:

- il dataset e piu grande e denso della metro;
- conviene preprocessarlo per linea o per zona prima di usarlo direttamente in browser.

### OpenStreetMap

Percorsi raw:

```text
dataset/openstreetmap/export.geojson
dataset/openstreetmap/milano.xml
```

Indici derivati:

```text
dataset/openstreetmap/streets_index.json
dataset/openstreetmap/addresses_index.json
dataset/openstreetmap/search_index.json
```

Dimensioni indicative:

| File | Dimensione |
| --- | ---: |
| `export.geojson` | 46 MB |
| `streets_index.json` | 872 KB |
| `addresses_index.json` | 8 MB |
| `search_index.json` | 8,8 MB |
| `milano.xml` | 4 KB |

Struttura degli indici:

Ogni indice contiene:

- `generatedFrom`;
- `generatedAt`;
- `count`;
- `items`.

Campi principali degli item:

- `id`;
- `kind`;
- `name`;
- `street`;
- `houseNumber`;
- `normalized`;
- `lon`;
- `lat`.

Conteggi:

| Indice | Elementi |
| --- | ---: |
| `streets_index.json` | 4883 |
| `addresses_index.json` | 43754 |
| `search_index.json` | 48637 |

Stato:

- non usato nella UI corrente;
- era pensato per ricerca libera per via, indirizzo, zona o fermata;
- e stato tenuto separato per evitare caricamenti pesanti non necessari.

Possibile uso futuro:

- ricerca intelligente non stringente;
- geocoding locale di vie e civici;
- collegamento indirizzo -> coordinate -> zona OMI -> fermate utili.

Scelta tecnica gia fatta:

- separare strade e indirizzi evita di caricare sempre un unico indice enorme;
- `search_index.json` puo essere utile per una ricerca globale, ma e piu pesante;
- per una UI veloce conviene caricare l'indice solo quando l'utente attiva la ricerca testuale.

## Dataset caricati da `app.js`

Attualmente `app.js` carica solo:

```js
const DATASETS = {
  omiZones: "./dataset/OMI/_expl_f205-2024_2.geojson",
  metroStops: "./dataset/metro_lines/tpl_metrofermate.geojson",
  neighborhoods: "./dataset/neighborhoods/ds964_NIL_WM.geojson",
  omiSale: "./dataset/OMI/quotazioni/ds2940_quotazioni_omi_compravendita_2024_2.json",
};
```

Questa scelta mantiene la dashboard leggera e coerente con la ricerca attuale:

- zone OMI per il territorio;
- quotazioni compravendita per il budget;
- metro per accessibilita;
- NIL per contesto di quartiere.

## Considerazioni sulla qualita dei dati

### Quotazioni

Le quotazioni OMI sono adatte a confrontare zone, non a decidere il prezzo corretto di un singolo immobile. La stima della dashboard e quindi volutamente indicativa.

### Geometrie

Le zone OMI, i NIL e le fermate arrivano da fonti diverse. Questo puo produrre piccoli disallineamenti, soprattutto quando una fermata o un quartiere sono vicini ai confini.

### Distanze

La dashboard usa distanza lineare geografica, non tempi reali a piedi o con mezzi. E una scelta adatta al primo filtro, ma non basta per una valutazione finale.

### Performance

I dataset attualmente caricati sono piccoli o medi. OpenStreetMap e molto piu pesante, quindi va caricato on demand o preprocessato ulteriormente se reintrodotto nella UI.

## Raccomandazione per prossime evoluzioni dati

Il passo piu utile sarebbe creare un dataset intermedio generato offline, ad esempio:

```text
dataset/derived/zones_enriched.json
```

Contenuto suggerito:

- codice zona OMI;
- nome zona;
- fascia;
- poligono semplificato;
- centroide;
- valori compravendita min/max/medio;
- NIL associati;
- fermate metro dentro zona;
- fermate metro entro 500/800/1000/1500 m;
- eventuali fermate di superficie aggregate;
- flag o punteggi calcolati.

Vantaggi:

- meno calcoli ripetuti nel browser;
- UI piu veloce;
- logica dati piu testabile;
- maggiore facilita nel cambiare fonte o semestre OMI.
