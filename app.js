const PRICE_MODEL = {
  B: { min: 7800, max: 11800, color: "#8f1d1d" },
  C: { min: 5800, max: 9000, color: "#c35a16" },
  D: { min: 3800, max: 6500, color: "#1f7a70" },
  E: { min: 2700, max: 4600, color: "#3267d6" },
  R: { min: 2200, max: 3600, color: "#667085" },
};

const DATASETS = {
  omiZones: "./dataset/OMI/_expl_f205-2024_2.geojson",
  metroStops: "./dataset/metro_lines/tpl_metrofermate.geojson",
  neighborhoods: "./dataset/neighborhoods/ds964_NIL_WM.geojson",
  omiSale: "./dataset/OMI/quotazioni/ds2940_quotazioni_omi_compravendita_2024_2.json",
};

const RESIDENTIAL_TYPES = new Set(["Abitazioni civili", "Abitazioni signorili", "Abitazioni di tipo economico", "Ville e Villini"]);
const DEFAULT_BANDS = new Set(["B", "C", "D", "E"]);

const SCENARIOS = {
  prudent: {
    label: "Prudente",
    benchmarkBlend: 0.15,
    metroCap: 0.04,
    weights: {
      "abitazioni di tipo economico|normale": 1,
      "abitazioni civili|normale": 0.9,
      "abitazioni signorili|normale": 0.45,
      "ville e villini|normale": 0.35,
      "abitazioni di tipo economico|ottimo": 0.35,
      "abitazioni civili|ottimo": 0.3,
      "abitazioni signorili|ottimo": 0.2,
      "ville e villini|ottimo": 0.15,
    },
  },
  realistic: {
    label: "Realistico",
    benchmarkBlend: 0.45,
    metroCap: 0.08,
    weights: {
      "abitazioni civili|normale": 1,
      "abitazioni civili|ottimo": 0.55,
      "abitazioni di tipo economico|normale": 0.45,
      "abitazioni di tipo economico|ottimo": 0.25,
      "abitazioni signorili|normale": 0.55,
      "abitazioni signorili|ottimo": 0.4,
      "ville e villini|normale": 0.25,
      "ville e villini|ottimo": 0.25,
    },
  },
  renovated: {
    label: "Ristrutturato",
    benchmarkBlend: 0.65,
    metroCap: 0.12,
    weights: {
      "abitazioni civili|ottimo": 1,
      "abitazioni signorili|ottimo": 0.9,
      "ville e villini|ottimo": 0.65,
      "abitazioni civili|normale": 0.35,
      "abitazioni signorili|normale": 0.35,
      "abitazioni di tipo economico|ottimo": 0.3,
      "abitazioni di tipo economico|normale": 0.1,
      "ville e villini|normale": 0.2,
    },
  },
};

const MARKET_BENCHMARKS = [
  { name: "Centro", value: 11233, trend: 0.8, keywords: ["centro storico", "duomo", "sanbabila", "montenapoleone", "missori", "cairoli", "brera", "universita statale", "san lorenzo", "sant ambrogio", "cadorna", "via dante"] },
  { name: "Arco della Pace, Arena, Pagano", value: 9765, trend: 2.3, keywords: ["arco della pace", "arena", "pagano", "parco sempione", "corso magenta"] },
  { name: "Genova, Ticinese", value: 8191, trend: 1.7, keywords: ["porta genova", "ticinese", "via san vittore", "ascanio sforza"] },
  { name: "Quadronno, Palestro, Guastalla", value: 9131, trend: 3.9, keywords: ["quadronno", "palestro", "guastalla"] },
  { name: "Garibaldi, Moscova, Porta Nuova", value: 9903, trend: 0.6, keywords: ["garibaldi", "moscova", "porta nuova", "turati"] },
  { name: "Fiera, Sempione, City Life, Portello", value: 7000, trend: 4.0, keywords: ["city life", "sempione", "portello", "fiera"] },
  { name: "Navigli", value: 6451, trend: -0.7, keywords: ["navigli", "barona", "famagosta", "faenza"] },
  { name: "Porta Romana, Cadore, Montenero", value: 7359, trend: 2.2, keywords: ["porta romana", "cadore", "montenero", "porta vigentina", "libia", "xxii marzo", "crema"] },
  { name: "Porta Venezia, Indipendenza", value: 7894, trend: 0.8, keywords: ["porta venezia", "venezia", "indipendenza", "porta vittoria"] },
  { name: "Centrale, Repubblica", value: 6867, trend: 3.4, keywords: ["centrale", "repubblica", "viale stelvio", "pisani", "buenos aires", "regina giovanna"] },
  { name: "Cenisio, Sarpi, Isola", value: 6569, trend: 3.0, keywords: ["cenisio", "farini", "sarpi", "isola"] },
  { name: "Uptown, Cascina Merlata, Viale Certosa", value: 4322, trend: 0.2, keywords: ["cascina merlata", "certosa", "musocco", "expo"] },
  { name: "Bande Nere, Inganni", value: 4811, trend: 2.6, keywords: ["bande nere", "inganni", "lorenteggio", "bisceglie", "san carlo"] },
  { name: "Famagosta, Barona", value: 4527, trend: 3.5, keywords: ["famagosta", "barona"] },
  { name: "Abbiategrasso, Chiesa Rossa", value: 4435, trend: 5.8, keywords: ["abbiategrasso", "chiesa rossa", "missaglia", "gratosoglio"] },
  { name: "Porta Vittoria, Lodi", value: 5278, trend: 1.5, keywords: ["porta vittoria", "lodi", "tito livio", "tertulliano", "ortomercato", "spadolini", "bazzi", "ortles"] },
  { name: "Cimiano, Crescenzago, Adriano", value: 3801, trend: 5.1, keywords: ["cimiano", "crescenzago", "adriano", "gorla", "monza"] },
  { name: "Bicocca, Niguarda", value: 4009, trend: 2.2, keywords: ["bicocca", "niguarda", "bignami", "sarca", "parco nord"] },
  { name: "Solari, Washington", value: 7231, trend: 4.1, keywords: ["solari", "washington"] },
  { name: "Affori, Bovisa", value: 3908, trend: 1.7, keywords: ["affori", "bovisa", "bausan", "imbonati", "bovisasca", "comasina"] },
  { name: "San Siro, Trenno", value: 4194, trend: 0.4, keywords: ["san siro", "trenno", "ippodromo", "caprilli", "monte stella", "lampugnano", "bonola"] },
  { name: "Bisceglie, Baggio, Olmi", value: 3208, trend: 4.2, keywords: ["baggio", "olmi", "muggiano", "quartiere romano"] },
  { name: "Ripamonti, Vigentino", value: 4761, trend: 0.6, keywords: ["ripamonti", "vigentino", "ronchetto", "chiaravalle", "marocchetti"] },
  { name: "Forlanini", value: 3884, trend: 1.9, keywords: ["forlanini", "mecenate"] },
  { name: "Città Studi, Susa", value: 5794, trend: 1.5, keywords: ["citta studi", "susa", "piola", "argonne", "corsica"] },
  { name: "Maggiolina, Istria", value: 5344, trend: 3.1, keywords: ["maggiolina", "istria", "parco trotter", "leoncavallo"] },
  { name: "Precotto, Turro", value: 4526, trend: 0.5, keywords: ["precotto", "turro"] },
  { name: "Udine, Lambrate", value: 4522, trend: 6.7, keywords: ["udine", "lambrate", "rubattino", "rombon", "parco lambro", "feltre"] },
  { name: "Pasteur, Rovereto", value: 4882, trend: 4.5, keywords: ["pasteur", "rovereto"] },
  { name: "Ponte Lambro, Santa Giulia", value: 3480, trend: 6.0, keywords: ["ponte lambro", "santa giulia"] },
  { name: "Corvetto, Rogoredo", value: 4347, trend: -0.7, keywords: ["corvetto", "rogoredo"] },
  { name: "Napoli, Soderini", value: 5732, trend: 3.0, keywords: ["napoli", "soderini", "segesta", "vespri siciliani", "aretusa"] },
];

const state = {
  budgetMin: 250000,
  budgetMax: 550000,
  size: 70,
  scenario: "realistic",
  route: "all",
  stop: "all",
  radius: 800,
  selectedZone: null,
  mapOpen: true,
  filtersOpen: false,
  zones: [],
  metroStops: [],
  neighborhoods: [],
  filteredZones: [],
  projection: null,
};

const els = {
  budgetMin: document.querySelector("#budgetMin"),
  budgetMax: document.querySelector("#budgetMax"),
  budgetError: document.querySelector("#budgetError"),
  size: document.querySelector("#size"),
  scenarioButtons: document.querySelectorAll(".scenario-btn"),
  lineChips: document.querySelector("#lineChips"),
  stopSelect: document.querySelector("#stopSelect"),
  radius: document.querySelector("#radius"),
  map: document.querySelector("#map"),
  mapWrap: document.querySelector(".map-wrap"),
  tooltip: document.querySelector("#tooltip"),
  rows: document.querySelector("#zoneRows"),
  visibleCount: document.querySelector("#visibleCount"),
  matchCount: document.querySelector("#matchCount"),
  cheapestZone: document.querySelector("#cheapestZone"),
  cheapestDetail: document.querySelector("#cheapestDetail"),
  bestTransitZone: document.querySelector("#bestTransitZone"),
  bestTransitDetail: document.querySelector("#bestTransitDetail"),
  toggleMap: document.querySelector("#toggleMap"),
  filterToggle: document.querySelector("#filterToggle"),
  mapFilters: document.querySelector("#mapFilters"),
};

const currency = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const integer = new Intl.NumberFormat("it-IT", {
  maximumFractionDigits: 0,
});

function clean(value) {
  return String(value ?? "")
    .replace(/^'|'$/g, "")
    .replace(/`/g, "'")
    .trim();
}

function normalizeText(value) {
  return clean(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\bp\.?\s?ta\b/g, "porta")
    .replace(/\bq\.?\s?re\b/g, "quartiere")
    .replace(/\bs\.?\s/g, "san ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseNumber(value) {
  if (typeof value === "number") return value;
  return Number(String(value ?? "").replace(",", "."));
}

function scoreText(query, target) {
  if (!query || !target) return 0;
  if (target === query) return 100;
  if (target.startsWith(query)) return 84;
  if (target.includes(query)) return 70;
  const queryTokens = query.split(" ").filter(Boolean);
  const targetTokens = new Set(target.split(" ").filter(Boolean));
  const hits = queryTokens.filter((token) => [...targetTokens].some((candidate) => candidate.startsWith(token) || candidate.includes(token)));
  return Math.round((hits.length / Math.max(queryTokens.length, 1)) * 58);
}

function flattenCoordinates(geometry) {
  const points = [];
  const walk = (node) => {
    if (!Array.isArray(node)) return;
    if (typeof node[0] === "number" && typeof node[1] === "number") {
      points.push([node[0], node[1]]);
      return;
    }
    node.forEach(walk);
  };
  walk(geometry.coordinates);
  return points;
}

function centroid(geometry) {
  const points = flattenCoordinates(geometry);
  const total = points.reduce((acc, [lon, lat]) => ({ lon: acc.lon + lon, lat: acc.lat + lat }), { lon: 0, lat: 0 });
  return {
    lon: total.lon / Math.max(points.length, 1),
    lat: total.lat / Math.max(points.length, 1),
  };
}

function pointInRing(point, ring) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointInPolygon(point, rings) {
  if (!rings.length || !pointInRing(point, rings[0])) return false;
  return !rings.slice(1).some((ring) => pointInRing(point, ring));
}

function pointInGeometry(point, geometry) {
  if (geometry.type === "Polygon") return pointInPolygon(point, geometry.coordinates);
  if (geometry.type === "MultiPolygon") return geometry.coordinates.some((polygon) => pointInPolygon(point, polygon));
  return false;
}

function distanceMeters(a, b) {
  const earth = 6371000;
  const toRad = (degree) => (degree * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * earth * Math.asin(Math.sqrt(h));
}

function nearestZone(point) {
  const containing = state.zones.find((zone) => pointInGeometry([point.lon, point.lat], zone.geometry));
  if (containing) return containing;
  return [...state.zones].sort((a, b) => distanceMeters(point, a.centroid) - distanceMeters(point, b.centroid))[0];
}

function priceRange(zone) {
  if (Number.isFinite(zone.saleMin) && Number.isFinite(zone.saleMax)) {
    return { min: zone.saleMin, max: zone.saleMax, color: PRICE_MODEL[zone.band]?.color ?? PRICE_MODEL.R.color };
  }
  return PRICE_MODEL[zone.band] ?? PRICE_MODEL.R;
}

function omiRangeAverage(zone) {
  const range = priceRange(zone);
  return Math.round((range.min + range.max) / 2);
}

function recordMidpoint(record) {
  return Math.round((record.min + record.max) / 2);
}

function scenarioWeight(record) {
  const scenario = SCENARIOS[state.scenario] ?? SCENARIOS.realistic;
  const type = normalizeText(record.type);
  const condition = normalizeText(record.condition);
  return scenario.weights[`${type}|${condition}`] ?? 0;
}

function weightedOmiPrice(zone) {
  const records = zone.saleRecords ?? [];
  const weighted = records
    .map((record) => ({ value: recordMidpoint(record), weight: scenarioWeight(record) }))
    .filter((item) => item.weight > 0 && Number.isFinite(item.value));
  if (!weighted.length) return omiRangeAverage(zone);
  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  return Math.round(weighted.reduce((sum, item) => sum + item.value * item.weight, 0) / totalWeight);
}

function metroPremium(zone) {
  const stops = getZoneStops(zone);
  if (!stops.length) return 0;
  const scenario = SCENARIOS[state.scenario] ?? SCENARIOS.realistic;
  const minDistance = Math.min(...stops.map(({ distance }) => distance));
  const hasInsideStop = stops.some(({ inside }) => inside);
  const routes = new Set(stops.flatMap(({ stop }) => stop.routes));
  let premium = 0;
  if (hasInsideStop || minDistance <= 300) premium = 0.08;
  else if (minDistance <= 500) premium = 0.05;
  else if (minDistance <= 800) premium = 0.025;
  else if (minDistance <= 1000) premium = 0.01;
  if (stops.length >= 5) premium += 0.015;
  if (routes.size >= 2) premium += 0.015;
  return Math.min(premium, scenario.metroCap);
}

function marketBlend(zone) {
  const scenario = SCENARIOS[state.scenario] ?? SCENARIOS.realistic;
  return Number.isFinite(zone.marketBenchmark?.value) ? scenario.benchmarkBlend : 0;
}

function estimatedUnitPrice(zone) {
  const omi = weightedOmiPrice(zone);
  const benchmark = zone.marketBenchmark?.value;
  const blend = marketBlend(zone);
  const base = Number.isFinite(benchmark) ? omi * (1 - blend) + benchmark * blend : omi;
  return Math.round(base * (1 + metroPremium(zone)));
}

function totalCost(zone) {
  return estimatedUnitPrice(zone) * state.size;
}

function isBudgetValid() {
  return state.budgetMin >= 0 && state.budgetMax > 0 && state.size > 0 && state.budgetMin < state.budgetMax;
}

function formatUnitPrice(value) {
  return `${integer.format(value)} €/mq`;
}

function formatBudget(value) {
  return currency.format(value);
}

function parseRoutes(value) {
  return clean(value).split(",").map((route) => route.trim()).filter(Boolean);
}

function makeStop(feature) {
  const properties = feature.properties;
  const [lon, lat] = feature.geometry.coordinates;
  const name = clean(properties.nome);
  const routes = parseRoutes(properties.linee);
  return {
    id: `metro-${properties.id_amat}`,
    name,
    normalized: normalizeText(`${name} ${routes.map((route) => `m${route}`).join(" ")}`),
    routes,
    lon,
    lat,
    point: { lon, lat },
  };
}

function routeSort(a, b) {
  return Number(a) - Number(b);
}

function routeLabel(routes) {
  return routes.map((route) => `M${route}`).join(", ");
}

function getZoneStops(zone) {
  return state.metroStops
    .map((stop) => ({ stop, distance: Math.round(distanceMeters(zone.centroid, stop.point)), inside: pointInGeometry([stop.lon, stop.lat], zone.geometry) }))
    .filter(({ stop, distance, inside }) => {
      const routeOk = state.route === "all" || stop.routes.includes(state.route);
      const stopOk = state.stop === "all" || stop.id === state.stop;
      return routeOk && stopOk && (inside || distance <= state.radius);
    })
    .sort((a, b) => a.distance - b.distance);
}

function zoneBudgetStatus(zone) {
  const total = totalCost(zone);
  const range = priceRange(zone);
  const minPerMq = state.budgetMin / Math.max(state.size, 1);
  const maxPerMq = state.budgetMax / Math.max(state.size, 1);
  return {
    inside: total >= state.budgetMin && total <= state.budgetMax,
    overlaps: range.max >= minPerMq && range.min <= maxPerMq,
    total,
  };
}

function zoneMatches(zone) {
  if (!DEFAULT_BANDS.has(zone.band)) return false;
  const stops = getZoneStops(zone);
  const metroOk = state.route === "all" && state.stop === "all" ? true : stops.length > 0;
  return zoneBudgetStatus(zone).inside && metroOk;
}

function zonePriority(zone) {
  const budgetCenter = (state.budgetMin + state.budgetMax) / 2;
  const budgetDistance = Math.abs(totalCost(zone) - budgetCenter) / Math.max(budgetCenter, 1);
  const stops = getZoneStops(zone);
  const metroScore = Math.min(stops.length, 5) * 4;
  return Math.round(60 - budgetDistance * 35 + metroScore);
}

function projectPoint(lon, lat) {
  const { minX, maxX, minY, maxY, cosLat, width, height, pad } = state.projection;
  const drawableWidth = width - pad * 2;
  const drawableHeight = height - pad * 2;
  const scale = Math.min(drawableWidth / (maxX - minX), drawableHeight / (maxY - minY));
  const mapWidth = (maxX - minX) * scale;
  const mapHeight = (maxY - minY) * scale;
  const offsetX = (width - mapWidth) / 2;
  const offsetY = (height - mapHeight) / 2;
  const x = offsetX + (lon * cosLat - minX) * scale;
  const y = height - offsetY - (lat - minY) * scale;
  return [x, y];
}

function geometryToPath(geometry) {
  const polygonToPath = (rings) =>
    rings
      .map((ring) =>
        ring
          .map(([lon, lat], index) => {
            const [x, y] = projectPoint(lon, lat);
            return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
          })
          .join(" ") + " Z",
      )
      .join(" ");
  if (geometry.type === "Polygon") return polygonToPath(geometry.coordinates);
  if (geometry.type === "MultiPolygon") return geometry.coordinates.map(polygonToPath).join(" ");
  return "";
}

function usefulStopsForBudget() {
  if (!isBudgetValid()) return [];
  const oldRoute = state.route;
  const oldStop = state.stop;
  state.route = "all";
  state.stop = "all";
  const stops = new Map();
  state.zones
    .filter((zone) => DEFAULT_BANDS.has(zone.band) && zoneBudgetStatus(zone).inside)
    .forEach((zone) => getZoneStops(zone).forEach(({ stop }) => stops.set(stop.id, stop)));
  state.route = oldRoute;
  state.stop = oldStop;
  return [...stops.values()];
}

function renderLineChips() {
  const usefulStops = usefulStopsForBudget();
  const routes = [...new Set(usefulStops.flatMap((stop) => stop.routes))].sort(routeSort);
  if (state.route !== "all" && !routes.includes(state.route)) state.route = "all";
  els.lineChips.innerHTML = "";
  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.className = `chip ${state.route === "all" ? "is-active" : ""}`;
  allButton.textContent = "Tutte";
  allButton.addEventListener("click", () => {
    state.route = "all";
    state.stop = "all";
    renderStopSelect();
    render();
  });
  els.lineChips.append(allButton);
  routes.forEach((route) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip ${state.route === route ? "is-active" : ""}`;
    button.textContent = `M${route}`;
    button.addEventListener("click", () => {
      state.route = state.route === route ? "all" : route;
      state.stop = "all";
      renderStopSelect();
      render();
    });
    els.lineChips.append(button);
  });
}

function renderStopSelect() {
  let stops = usefulStopsForBudget();
  if (state.route !== "all") stops = stops.filter((stop) => stop.routes.includes(state.route));
  els.stopSelect.innerHTML = `<option value="all">Qualsiasi fermata</option>`;
  stops
    .sort((a, b) => a.name.localeCompare(b.name, "it"))
    .forEach((stop) => {
      const option = document.createElement("option");
      option.value = stop.id;
      option.textContent = `${routeLabel(stop.routes)} · ${stop.name}`;
      els.stopSelect.append(option);
    });
  if (!stops.some((stop) => stop.id === state.stop)) state.stop = "all";
  els.stopSelect.value = state.stop;
}

function zoneLabel(zone) {
  return `${zone.code}: ${zone.name}`;
}

function stopsDetail(stops, emptyText = "nessuna fermata nel filtro") {
  return stops.length ? stops.slice(0, 4).map(({ stop }) => stop.name).join(", ") : emptyText;
}

function benchmarkDetail(zone) {
  const benchmark = zone.marketBenchmark;
  if (!benchmark) return "benchmark Immobiliare non associato";
  const delta = Math.round(((benchmark.value - weightedOmiPrice(zone)) / Math.max(weightedOmiPrice(zone), 1)) * 100);
  const sign = delta >= 0 ? "+" : "";
  const trendSign = benchmark.trend >= 0 ? "+" : "";
  return `${benchmark.name}: ${formatUnitPrice(benchmark.value)} (${trendSign}${benchmark.trend}%, ${sign}${delta}% vs OMI scenario)`;
}

function scenarioDetail(zone) {
  const premium = Math.round(metroPremium(zone) * 100);
  const scenario = SCENARIOS[state.scenario] ?? SCENARIOS.realistic;
  return `${scenario.label}: ${formatUnitPrice(weightedOmiPrice(zone))} OMI pesato · ${formatUnitPrice(estimatedUnitPrice(zone))} corretto${premium ? ` · metro +${premium}%` : ""}`;
}

function setMetric(element, detailElement, value, detail) {
  element.textContent = value;
  detailElement.textContent = detail;
}

function renderSummary() {
  const stopIds = new Set(state.filteredZones.flatMap((zone) => getZoneStops(zone).map(({ stop }) => stop.id)));
  els.visibleCount.textContent = state.filteredZones.length;
  els.matchCount.textContent = stopIds.size;
  if (!isBudgetValid()) {
    setMetric(els.cheapestZone, els.cheapestDetail, "Budget non valido", "Il minimo deve essere inferiore al massimo.");
    setMetric(els.bestTransitZone, els.bestTransitDetail, "Budget non valido", "Correggi il budget per calcolare le fermate utili.");
    return;
  }
  if (!state.filteredZones.length) {
    setMetric(els.cheapestZone, els.cheapestDetail, "Nessuna zona", "Allarga il budget o riduci i vincoli metro.");
    setMetric(els.bestTransitZone, els.bestTransitDetail, "Nessuna zona", "Nessuna fermata utile nei filtri correnti.");
    return;
  }
  const zonesByCost = [...state.filteredZones].sort((a, b) => estimatedUnitPrice(a) - estimatedUnitPrice(b));
  const zonesByMetro = [...state.filteredZones].sort((a, b) => getZoneStops(b).length - getZoneStops(a).length || zonePriority(b) - zonePriority(a));
  const cheapest = zonesByCost[0];
  const bestMetro = zonesByMetro[0];
  const bestMetroStops = getZoneStops(bestMetro);
  setMetric(
    els.cheapestZone,
    els.cheapestDetail,
    zoneLabel(cheapest),
    `${formatUnitPrice(estimatedUnitPrice(cheapest))} · ${formatBudget(totalCost(cheapest))}. ${benchmarkDetail(cheapest)}`,
  );
  setMetric(
    els.bestTransitZone,
    els.bestTransitDetail,
    zoneLabel(bestMetro),
    `${bestMetroStops.length} fermate utili: ${stopsDetail(bestMetroStops)}. ${scenarioDetail(bestMetro)}`,
  );
}

function activeFilterCount() {
  return [state.route !== "all", state.stop !== "all", state.radius !== 800].filter(Boolean).length;
}

function renderFilterToggle() {
  const count = activeFilterCount();
  els.mapFilters.hidden = !state.filtersOpen;
  els.filterToggle.classList.toggle("is-active", state.filtersOpen || count > 0);
  els.filterToggle.textContent = count ? `Filtri metro (${count})` : "Filtri metro";
  els.filterToggle.setAttribute("aria-expanded", String(state.filtersOpen));
}

function renderScenarioButtons() {
  els.scenarioButtons.forEach((button) => {
    const active = button.dataset.scenario === state.scenario;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderMap() {
  els.mapWrap.hidden = !state.mapOpen;
  els.toggleMap.textContent = state.mapOpen ? "Nascondi mappa" : "Mostra mappa";
  if (!state.mapOpen) return;
  els.map.innerHTML = "";
  const width = 940;
  const height = 560;
  els.map.setAttribute("viewBox", `0 0 ${width} ${height}`);
  state.projection.width = width;
  state.projection.height = height;
  state.projection.pad = 24;

  const visibleCodes = new Set(state.filteredZones.map((zone) => zone.code));
  const visibleStops = new Map();
  state.filteredZones.forEach((zone) => getZoneStops(zone).forEach(({ stop }) => visibleStops.set(stop.id, stop)));
  const fragment = document.createDocumentFragment();

  state.zones.forEach((zone) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", geometryToPath(zone.geometry));
    path.setAttribute("fill", visibleCodes.has(zone.code) ? "#0f766e" : priceRange(zone).color);
    path.classList.add("zone-shape");
    if (!visibleCodes.has(zone.code)) path.classList.add("is-dimmed");
    if (state.selectedZone?.code === zone.code) path.classList.add("is-selected");
    path.addEventListener("mouseenter", (event) => showZoneTooltip(event, zone));
    path.addEventListener("mousemove", moveTooltip);
    path.addEventListener("mouseleave", hideTooltip);
    path.addEventListener("click", () => selectZone(zone.code));
    fragment.append(path);
  });

  visibleStops.forEach((stop) => {
    const [cx, cy] = projectPoint(stop.lon, stop.lat);
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx.toFixed(2));
    circle.setAttribute("cy", cy.toFixed(2));
    circle.setAttribute("r", "4.6");
    circle.setAttribute("fill", "#111827");
    circle.classList.add("stop-dot");
    circle.addEventListener("mouseenter", (event) => showStopTooltip(event, stop));
    circle.addEventListener("mousemove", moveTooltip);
    circle.addEventListener("mouseleave", hideTooltip);
    fragment.append(circle);
  });

  els.map.append(fragment);
}

function showZoneTooltip(event, zone) {
  const range = priceRange(zone);
  els.tooltip.hidden = false;
  els.tooltip.innerHTML = `<strong>${zone.code} · ${zone.name}</strong><br>OMI ${formatUnitPrice(range.min)} - ${formatUnitPrice(range.max)}<br>${scenarioDetail(zone)}<br>${formatBudget(totalCost(zone))}`;
  moveTooltip(event);
}

function showStopTooltip(event, stop) {
  els.tooltip.hidden = false;
  els.tooltip.innerHTML = `<strong>${stop.name}</strong><br>${routeLabel(stop.routes)}`;
  moveTooltip(event);
}

function moveTooltip(event) {
  els.tooltip.style.left = `${event.clientX + 14}px`;
  els.tooltip.style.top = `${event.clientY + 14}px`;
}

function hideTooltip() {
  els.tooltip.hidden = true;
}

function renderTable() {
  els.rows.innerHTML = "";
  if (!state.filteredZones.length) {
    const message = isBudgetValid()
      ? "Nessuna zona coerente con budget e filtri correnti."
      : "Correggi il budget: il minimo deve essere inferiore al massimo.";
    els.rows.innerHTML = `<tr><td colspan="6" class="no-results">${message}</td></tr>`;
    return;
  }

  state.filteredZones.forEach((zone) => {
    const range = priceRange(zone);
    const stops = getZoneStops(zone);
    const premium = Math.round(metroPremium(zone) * 100);
    const tr = document.createElement("tr");
    if (state.selectedZone?.code === zone.code) tr.classList.add("is-selected");
    const reasons = [
      "nel budget",
      stops.length ? `${stops.length} fermate metro` : "senza metro nel filtro",
      Math.abs(totalCost(zone) - state.budgetMax) < state.budgetMax * 0.08 ? "vicina al limite alto" : "margine sul budget",
    ];
    tr.innerHTML = `
      <td>
        <div class="zone-name">
          <strong>${zone.code} · ${zone.name}</strong>
          <span>${zone.type}</span>
        </div>
      </td>
      <td>${zone.neighborhoods.slice(0, 3).map((item) => item.name).join("<br>") || "-"}</td>
      <td>
        ${formatUnitPrice(estimatedUnitPrice(zone))}<br>
        <span class="status">${SCENARIOS[state.scenario].label}: ${formatUnitPrice(weightedOmiPrice(zone))} OMI pesato${premium ? ` · metro +${premium}%` : ""}</span><br>
        <span class="status">OMI range ${formatUnitPrice(range.min)} - ${formatUnitPrice(range.max)}</span><br>
        <span class="status">${benchmarkDetail(zone)}</span>
      </td>
      <td>${formatBudget(totalCost(zone))}</td>
      <td>${stops.slice(0, 5).map(({ stop, distance }) => `${stop.name} <span class="status">${routeLabel(stop.routes)} · ${integer.format(distance)} m</span>`).join("<br>") || "-"}</td>
      <td>${reasons.map((reason) => `<span class="reason">${reason}</span>`).join(" ")}</td>
    `;
    tr.addEventListener("click", () => selectZone(zone.code));
    els.rows.append(tr);
  });
}

function selectZone(code) {
  state.selectedZone = state.zones.find((zone) => zone.code === code) ?? null;
  render();
}

function render() {
  const budgetValid = isBudgetValid();
  els.budgetError.hidden = budgetValid;
  els.budgetMin.classList.toggle("is-invalid", !budgetValid);
  els.budgetMax.classList.toggle("is-invalid", !budgetValid);
  state.filteredZones = budgetValid
    ? state.zones
        .filter(zoneMatches)
        .sort((a, b) => zonePriority(b) - zonePriority(a))
    : [];
  renderScenarioButtons();
  renderLineChips();
  renderStopSelect();
  renderFilterToggle();
  renderSummary();
  renderMap();
  renderTable();
}

function bindControls() {
  els.budgetMin.addEventListener("input", () => {
    state.budgetMin = Number(els.budgetMin.value || 0);
    render();
  });
  els.budgetMax.addEventListener("input", () => {
    state.budgetMax = Number(els.budgetMax.value || 0);
    render();
  });
  els.size.addEventListener("input", () => {
    state.size = Number(els.size.value || 1);
    render();
  });
  els.scenarioButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.scenario = button.dataset.scenario;
      render();
    });
  });
  els.stopSelect.addEventListener("change", () => {
    state.stop = els.stopSelect.value;
    render();
  });
  els.radius.addEventListener("change", () => {
    state.radius = Number(els.radius.value);
    render();
  });
  els.toggleMap.addEventListener("click", () => {
    state.mapOpen = !state.mapOpen;
    if (!state.mapOpen) state.filtersOpen = false;
    renderFilterToggle();
    renderMap();
  });
  els.filterToggle.addEventListener("click", () => {
    state.filtersOpen = !state.filtersOpen;
    renderFilterToggle();
  });
  els.mapFilters.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  document.addEventListener("click", (event) => {
    if (!state.filtersOpen) return;
    if (els.mapFilters.contains(event.target) || els.filterToggle.contains(event.target)) return;
    state.filtersOpen = false;
    renderFilterToggle();
  });
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Impossibile caricare ${url}`);
  return response.json();
}

function attachSaleData(records) {
  const byZone = new Map();
  records
    .filter((record) => RESIDENTIAL_TYPES.has(record.Descr_Tipologia))
    .forEach((record) => {
      const zone = clean(record.Zona);
      if (!byZone.has(zone)) byZone.set(zone, { mins: [], maxs: [], records: [] });
      const item = byZone.get(zone);
      const min = parseNumber(record.Compr_min);
      const max = parseNumber(record.Compr_max);
      if (Number.isFinite(min)) item.mins.push(min);
      if (Number.isFinite(max)) item.maxs.push(max);
      if (Number.isFinite(min) && Number.isFinite(max)) {
        item.records.push({
          type: clean(record.Descr_Tipologia),
          condition: clean(record.Stato || record.Stato_prev),
          min,
          max,
        });
      }
    });

  state.zones.forEach((zone) => {
    const values = byZone.get(zone.code);
    if (!values?.mins.length || !values?.maxs.length) return;
    zone.saleMin = Math.round(Math.min(...values.mins));
    zone.saleMax = Math.round(Math.max(...values.maxs));
    zone.saleRecords = values.records;
  });
}

function zoneProfile(zone) {
  return normalizeText(`${zone.name} ${zone.neighborhoods.map((item) => item.name).join(" ")}`);
}

function matchMarketBenchmark(zone) {
  const profile = zoneProfile(zone);
  const scored = MARKET_BENCHMARKS.map((benchmark) => {
    const hits = benchmark.keywords.filter((keyword) => profile.includes(normalizeText(keyword))).length;
    return { benchmark, hits };
  })
    .filter((item) => item.hits > 0)
    .sort((a, b) => b.hits - a.hits || b.benchmark.value - a.benchmark.value);
  return scored[0]?.benchmark ?? null;
}

function buildZoneIndexes() {
  state.zones.forEach((zone) => {
    zone.neighborhoods = [];
  });

  state.neighborhoods.forEach((neighborhood) => {
    const zone = nearestZone(neighborhood.centroid);
    if (zone) zone.neighborhoods.push(neighborhood);
  });

  state.zones.forEach((zone) => {
    zone.marketBenchmark = matchMarketBenchmark(zone);
    zone.searchIndex = normalizeText(`${zone.code} ${zone.name} ${zone.band} ${zone.neighborhoods.map((item) => item.name).join(" ")}`);
  });
}

async function init() {
  bindControls();
  const [omi, metro, neighborhoods, sales] = await Promise.all([
    fetchJson(DATASETS.omiZones),
    fetchJson(DATASETS.metroStops),
    fetchJson(DATASETS.neighborhoods),
    fetchJson(DATASETS.omiSale),
  ]);

  state.zones = omi.features.map((feature) => {
    const props = feature.properties;
    return {
      code: clean(props.Zona),
      name: clean(props.Zona_Descr),
      band: clean(props.Fascia),
      link: clean(props.LinkZona),
      type: clean(props.Descr_tip_prev),
      geometry: feature.geometry,
      centroid: centroid(feature.geometry),
    };
  });

  state.metroStops = metro.features.map(makeStop);
  state.neighborhoods = neighborhoods.features.map((feature) => ({
    id: feature.properties.ID_NIL,
    name: clean(feature.properties.NIL),
    geometry: feature.geometry,
    centroid: centroid(feature.geometry),
  }));

  const allPoints = state.zones.flatMap((zone) => flattenCoordinates(zone.geometry));
  const lats = allPoints.map(([, lat]) => lat);
  const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const cosLat = Math.cos((midLat * Math.PI) / 180);
  const projectedPoints = allPoints.map(([lon, lat]) => [lon * cosLat, lat]);
  const xs = projectedPoints.map(([x]) => x);
  const ys = projectedPoints.map(([, y]) => y);
  state.projection = {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
    cosLat,
  };

  attachSaleData(sales);
  buildZoneIndexes();
  render();
}

init().catch((error) => {
  document.body.innerHTML = `<main class="app-shell"><h1>Errore caricamento dati</h1><p>${error.message}</p></main>`;
});
