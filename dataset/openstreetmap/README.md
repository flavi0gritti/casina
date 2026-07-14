# OpenStreetMap — dati Milano

L'export grezzo (`export.geojson`, ~46 MB) non è tracciato in Git perché troppo pesante. Si rigenera on demand con la query Overpass e da lì si derivano gli indici.

## Rigenerare l'export

1. Vai su [overpass-turbo.eu](https://overpass-turbo.eu/)
2. Incolla la query in `overpass_query.txt`
3. Premi **Esegui** e attendi il completamento (può richiedere fino a 3 minuti)
4. Clicca **Esporta** → **GeoJSON** e salva come `export.geojson` in questa cartella

## Rigenerare gli indici

Una volta ottenuto `export.geojson`, esegui lo script di indicizzazione (se presente) per generare:

- `streets_index.json` — indice delle strade
- `addresses_index.json` — indice dei civici
- `search_index.json` — indice unificato per ricerca libera

Gli indici attuali sono già tracciati nel repo e pronti all'uso.

## Contenuto dell'export

- **`.streets`**: tutte le way con tag `highway` e `name` nel territorio di Milano
- **`.addresses`**: tutti i nodi, way e relazioni con tag `addr:housenumber` e `addr:street`

## File

| File | Tracciato | Dimensione |
|---|---|---|
| `overpass_query.txt` | ✓ | ~500 B |
| `export.geojson` | ✗ (.gitignore) | ~46 MB |
| `streets_index.json` | ✓ | ~872 KB |
| `addresses_index.json` | ✓ | ~8 MB |
| `search_index.json` | ✓ | ~8.8 MB |
| `milano.xml` | ✓ | ~4 KB |
