/* ============================================================
   VULCÃO DE SANTA BARBARA SHAKE - VERSION 2.0
   Main Application Logic
   ============================================================ */

// ============================================================
// CONFIGURATION & GLOBALS
// ============================================================
const CONFIG = {
  CENTER_LAT: 38.72972,
  CENTER_LON: -27.31972,
  DEFAULT_RADIUS_KM: 30,
  PEAK_ALT_KM: 1.1,
  API_URL: "https://api.ipma.pt/open-data/observation/seismic/3.json",
  DEFAULT_DAYS: 30
};

// Global state
const AppState = {
  allQuakes: [],
  filteredQuakes: [],
  filters: {
    magnitudeMin: 0,
    magnitudeMax: 10,
    depthMin: 0,
    depthMax: 50,
    dateRange: CONFIG.DEFAULT_DAYS,
    radius: CONFIG.DEFAULT_RADIUS_KM,
    searchQuery: ""
  },
  settings: {
    language: 'pt',
    theme: 'dark',
    autoRefresh: false,
    refreshInterval: 5,
    showVolcano: true,
    showCompass: true,
    showSurface: true,
    colorScheme: 'default',
    fontSize: 'normal',
    reducedMotion: false,
    highContrast: false
  },
  statistics: null,
  graficoPlotly: null,
  lastUpdate: null,
  isLoading: false
};

// ============================================================
// INTERNATIONALIZATION
// ============================================================
const i18n = {
  pt: {
    title: "Sismos – Serra de Santa Bárbara",
    subtitle: "Últimos {days} dias • Raio {radius} km • 3D local",
    loading: "Carregando dados do IPMA…",
    noData: "Não há sismos na Serra de Santa Bárbara nos últimos {days} dias.",
    update: "Atualização: {time}",
    updateError: "Atualização: erro ao contactar IPMA",
    updateNoData: "Atualização: sem dados (IPMA)",
    filters: "Filtros",
    search: "Pesquisar",
    searchPlaceholder: "Pesquisar sismos...",
    statistics: "Estatísticas",
    settings: "Configurações",
    magnitude: "Magnitude",
    depth: "Profundidade (km)",
    dateRange: "Período",
    radius: "Raio (km)",
    clearFilters: "Limpar Filtros",
    total: "Total",
    average: "Média",
    strongest: "Mais Forte",
    deepest: "Mais Profundo",
    shallowest: "Mais Raso",
    mostRecent: "Mais Recente",
    export: "Exportar",
    share: "Partilhar",
    help: "Ajuda",
    about: "Sobre",
    aboutTitle: "Sobre a Aplicação",
    aboutDescription: "Vulcão de Santa Barbara Shake é uma aplicação web dedicada à visualização tridimensional da atividade sísmica recente na região da Serra de Santa Bárbara, Ilha Terceira — Açores.",
    aboutPurpose: "Esta ferramenta permite explorar, em 3D, a profundidade, magnitude e evolução temporal dos sismos registados pelo IPMA – Instituto Português do Mar e da Atmosfera, no seu período oficial de disponibilização (últimos 30 dias).",
    aboutData: "Origem dos Dados",
    aboutDataDesc: "Todos os eventos sísmicos são recolhidos a partir da API pública do IPMA.pt (Rede Sísmica Nacional / Açores). A aplicação não cria, altera ou interpreta dados sísmicos — limita-se a apresentá-los visualmente num sistema local tridimensional.",
    aboutObjective: "Objetivo da Aplicação",
    aboutObjectiveDesc: "Tornar a informação sísmica mais acessível ao público, permitindo compreender melhor o contexto geológico e vulcânico da serra de Sta. Bárbara, ilha Terceira, através de uma representação espacial intuitiva.",
    aboutLegend: "Legenda e como interpretar",
    aboutLegendDesc: "O quadro à direita corresponde à lista de eventos sísmicos registados. Os sismos são apresentados como pontos no gráfico tridimensional, vermelho mais antigo, amarelo entremédio e verde corresponde aos mais recentes. A barra inferior poderá reproduzir os eventos por ordem cronológica, do mais antigo ao mais recente.",
    aboutCreation: "Criação",
    aboutCreationDesc: "Desenvolvido por Luís Serpa (LSerpa), com apoio de modelos de Inteligência Artificial, a partir do Faial. Esta aplicação tem o apoio da VOST Portugal e VOSTAZ. A aplicação não substitui informação oficial do IPMA, CIVISA ou Proteção Civil.",
    aboutContact: "Contacto",
    aboutContactDesc: "Para sugestões, melhorias ou questões sobre o projeto:",
    aboutContactEmail: "azores@vost.pt",
    earthquakeList: "Lista de Sismos",
    dataSource: "Fonte dos dados:",
    localSystem: "Sistema local: X/Y (km), Z (km – negativo abaixo da superfície)",
    lastDays: "Últimos {days} dias",
    showVolcano: "Mostrar Vulcão",
    showCompass: "Mostrar Bússola",
    showSurface: "Mostrar Superfície",
    highContrast: "Alto Contraste",
    reducedMotion: "Movimento Reduzido",
    language: "Idioma",
    theme: "Tema",
    dark: "Escuro",
    light: "Claro",
    auto: "Automático",
    surface: "Superfície",
    shallow: "Raso <5km",
    medium: "Médio 5-15km",
    deep: "Profundo >15km",
    collapse: "Recolher",
    expand: "Expandir",
    close: "Fechar"
  },
  en: {
    title: "Earthquakes – Serra de Santa Bárbara",
    subtitle: "Last {days} days • Radius {radius} km • 3D local",
    loading: "Loading data from IPMA…",
    noData: "No earthquakes in Serra de Santa Bárbara in the last {days} days.",
    update: "Update: {time}",
    updateError: "Update: error contacting IPMA",
    updateNoData: "Update: no data (IPMA)",
    filters: "Filters",
    search: "Search",
    searchPlaceholder: "Search earthquakes...",
    statistics: "Statistics",
    settings: "Settings",
    magnitude: "Magnitude",
    depth: "Depth (km)",
    dateRange: "Period",
    radius: "Radius (km)",
    clearFilters: "Clear Filters",
    total: "Total",
    average: "Average",
    strongest: "Strongest",
    deepest: "Deepest",
    shallowest: "Shallowest",
    mostRecent: "Most Recent",
    export: "Export",
    share: "Share",
    help: "Help",
    about: "About",
    aboutTitle: "About the Application",
    aboutDescription: "Vulcão de Santa Barbara Shake is a web application dedicated to the three-dimensional visualization of recent seismic activity in the Serra de Santa Bárbara region, Terceira Island — Azores.",
    aboutPurpose: "This tool allows you to explore, in 3D, the depth, magnitude and temporal evolution of earthquakes recorded by IPMA – Portuguese Institute for Sea and Atmosphere, in its official availability period (last 30 days).",
    aboutData: "Data Source",
    aboutDataDesc: "All seismic events are collected from the public API of IPMA.pt (National Seismic Network / Azores). The application does not create, modify or interpret seismic data — it only presents them visually in a local three-dimensional system.",
    aboutObjective: "Application Objective",
    aboutObjectiveDesc: "To make seismic information more accessible to the public, allowing a better understanding of the geological and volcanic context of Serra de Sta. Bárbara, Terceira Island, through an intuitive spatial representation.",
    aboutLegend: "Legend and how to interpret",
    aboutLegendDesc: "The panel on the right corresponds to the list of recorded seismic events. Earthquakes are presented as points in the three-dimensional graph, red for oldest, yellow for intermediate and green for the most recent. The bottom bar can play the events chronologically, from oldest to most recent.",
    aboutCreation: "Creation",
    aboutCreationDesc: "Developed by Luís Serpa (LSerpa), with support from Artificial Intelligence models, from Faial. This application has the support of VOST Portugal and VOSTAZ. The application does not replace official information from IPMA, CIVISA or Civil Protection.",
    aboutContact: "Contact",
    aboutContactDesc: "For suggestions, improvements or questions about the project:",
    aboutContactEmail: "azores@vost.pt",
    earthquakeList: "Earthquake List",
    dataSource: "Data source:",
    localSystem: "Local system: X/Y (km), Z (km – negative below surface)",
    lastDays: "Last {days} days",
    showVolcano: "Show Volcano",
    showCompass: "Show Compass",
    showSurface: "Show Surface",
    highContrast: "High Contrast",
    reducedMotion: "Reduced Motion",
    language: "Language",
    theme: "Theme",
    dark: "Dark",
    light: "Light",
    auto: "Auto",
    surface: "Surface",
    shallow: "Shallow <5km",
    medium: "Medium 5-15km",
    deep: "Deep >15km",
    collapse: "Collapse",
    expand: "Expand",
    close: "Close"
  },
  es: {
    title: "Terremotos – Serra de Santa Bárbara",
    subtitle: "Últimos {days} días • Radio {radius} km • 3D local",
    loading: "Cargando datos del IPMA…",
    noData: "No hay terremotos en Serra de Santa Bárbara en los últimos {days} días.",
    update: "Actualización: {time}",
    updateError: "Actualización: error al contactar IPMA",
    updateNoData: "Actualización: sin datos (IPMA)",
    filters: "Filtros",
    search: "Buscar",
    searchPlaceholder: "Buscar terremotos...",
    statistics: "Estadísticas",
    settings: "Configuración",
    magnitude: "Magnitud",
    depth: "Profundidad (km)",
    dateRange: "Período",
    radius: "Radio (km)",
    clearFilters: "Limpiar Filtros",
    total: "Total",
    average: "Promedio",
    strongest: "Más Fuerte",
    deepest: "Más Profundo",
    shallowest: "Más Superficial",
    mostRecent: "Más Reciente",
    export: "Exportar",
    share: "Compartir",
    help: "Ayuda",
    about: "Acerca de",
    aboutTitle: "Acerca de la Aplicación",
    aboutDescription: "Vulcão de Santa Barbara Shake es una aplicación web dedicada a la visualización tridimensional de la actividad sísmica reciente en la región de Serra de Santa Bárbara, Isla Terceira — Azores.",
    aboutPurpose: "Esta herramienta permite explorar, en 3D, la profundidad, magnitud y evolución temporal de los terremotos registrados por el IPMA – Instituto Portugués del Mar y la Atmósfera, en su período oficial de disponibilidad (últimos 30 días).",
    aboutData: "Origen de los Datos",
    aboutDataDesc: "Todos los eventos sísmicos se recopilan de la API pública de IPMA.pt (Red Sísmica Nacional / Azores). La aplicación no crea, modifica o interpreta datos sísmicos — solo los presenta visualmente en un sistema local tridimensional.",
    aboutObjective: "Objetivo de la Aplicación",
    aboutObjectiveDesc: "Hacer la información sísmica más accesible al público, permitiendo comprender mejor el contexto geológico y volcánico de la serra de Sta. Bárbara, isla Terceira, a través de una representación espacial intuitiva.",
    aboutLegend: "Leyenda y cómo interpretar",
    aboutLegendDesc: "El panel a la derecha corresponde a la lista de eventos sísmicos registrados. Los terremotos se presentan como puntos en el gráfico tridimensional, rojo más antiguo, amarillo intermedio y verde corresponde a los más recientes. La barra inferior puede reproducir los eventos en orden cronológico, del más antiguo al más reciente.",
    aboutCreation: "Creación",
    aboutCreationDesc: "Desarrollado por Luís Serpa (LSerpa), con apoyo de modelos de Inteligencia Artificial, desde Faial. Esta aplicación cuenta con el apoyo de VOST Portugal y VOSTAZ. La aplicación no sustituye información oficial del IPMA, CIVISA o Protección Civil.",
    aboutContact: "Contacto",
    aboutContactDesc: "Para sugerencias, mejoras o preguntas sobre el proyecto:",
    aboutContactEmail: "azores@vost.pt",
    earthquakeList: "Lista de Terremotos",
    dataSource: "Fuente de los datos:",
    localSystem: "Sistema local: X/Y (km), Z (km – negativo debajo de la superficie)",
    lastDays: "Últimos {days} días",
    showVolcano: "Mostrar Volcán",
    showCompass: "Mostrar Brújula",
    showSurface: "Mostrar Superficie",
    highContrast: "Alto Contraste",
    reducedMotion: "Movimiento Reducido",
    language: "Idioma",
    theme: "Tema",
    dark: "Oscuro",
    light: "Claro",
    auto: "Automático",
    surface: "Superficie",
    shallow: "Superficial <5km",
    medium: "Medio 5-15km",
    deep: "Profundo >15km",
    collapse: "Colapsar",
    expand: "Expandir",
    close: "Cerrar"
  }
};

function t(key, params = {}) {
  const lang = AppState.settings.language;
  let text = i18n[lang]?.[key] || i18n.pt[key] || key;
  Object.keys(params).forEach(k => {
    text = text.replace(`{${k}}`, params[k]);
  });
  return text;
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function isSantaBarbara(region) {
  if (!region) return false;
  const r = region.toLowerCase();
  const palavras = [
    "serra sta. bárbara", "serra santa bárbara",
    "serra de santa bárbara", "sta. bárbara",
    "sta bárbara", "santa bárbara",
    "santa barbara", "sta barbara",
    "s. bárbara", "barbara"
  ];
  return palavras.some(p => r.includes(p));
}

function geoToXY(lat, lon) {
  const R = 6371;
  const dlat = (lat - CONFIG.CENTER_LAT) * Math.PI / 180;
  const dlon = (lon - CONFIG.CENTER_LON) * Math.PI / 180;
  const x = dlon * Math.cos(CONFIG.CENTER_LAT * Math.PI / 180) * R;
  const y = dlat * R;
  return { x, y };
}

function distanciaKm(lat, lon) {
  const { x, y } = geoToXY(lat, lon);
  return Math.sqrt(x * x + y * y);
}

function idadeNormalizada(date, minDate, maxDate) {
  const t = date.getTime();
  const t0 = minDate.getTime();
  const t1 = maxDate.getTime();
  if (t1 === t0) return 0;
  return (t - t0) / (t1 - t0);
}

function corPorIdade(a) {
  const b = 1 - a;
  let r, g, bl;
  if (b < 0.5) {
    const frac = b / 0.5;
    r = Math.round(frac * 255);
    g = 255;
    bl = 0;
  } else {
    const frac = (b - 0.5) / 0.5;
    r = 255;
    g = Math.round(255 - frac * 255);
    bl = 0;
  }
  return `rgb(${r},${g},${bl})`;
}

function formatDate(date) {
  return date.toISOString().replace("T", " ").slice(0, 16);
}

// ============================================================
// FILTERING SYSTEM
// ============================================================
function applyFilters() {
  let filtered = [...AppState.allQuakes];

  // Magnitude filter
  filtered = filtered.filter(q => 
    q.mag >= AppState.filters.magnitudeMin && 
    q.mag <= AppState.filters.magnitudeMax
  );

  // Depth filter
  filtered = filtered.filter(q => 
    q.depth_km >= AppState.filters.depthMin && 
    q.depth_km <= AppState.filters.depthMax
  );

  // Distance filter
  filtered = filtered.filter(q => 
    q.dist_km <= AppState.filters.radius
  );

  // Date range filter
  if (AppState.filters.dateRange > 0) {
    const limit = new Date();
    limit.setDate(limit.getDate() - AppState.filters.dateRange);
    filtered = filtered.filter(q => q.time >= limit);
  }

  // Search filter
  if (AppState.filters.searchQuery) {
    const query = AppState.filters.searchQuery.toLowerCase();
    filtered = filtered.filter(q => {
      return q.timeStr.toLowerCase().includes(query) ||
             q.region.toLowerCase().includes(query) ||
             q.mag.toString().includes(query) ||
             q.depth_km.toString().includes(query);
    });
  }

  AppState.filteredQuakes = filtered;
  updateActiveFiltersBadge();
  renderList();
  renderGraph();
  updateStatistics();
  updateURL();
}

function updateActiveFiltersBadge() {
  const badge = document.getElementById('active-filters-badge');
  if (!badge) return;
  
  let count = 0;
  if (AppState.filters.magnitudeMin > 0 || AppState.filters.magnitudeMax < 10) count++;
  if (AppState.filters.depthMin > 0 || AppState.filters.depthMax < 50) count++;
  if (AppState.filters.dateRange !== CONFIG.DEFAULT_DAYS) count++;
  if (AppState.filters.radius !== CONFIG.DEFAULT_RADIUS_KM) count++;
  if (AppState.filters.searchQuery) count++;

  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

function clearFilters() {
  AppState.filters = {
    magnitudeMin: 0,
    magnitudeMax: 10,
    depthMin: 0,
    depthMax: 50,
    dateRange: CONFIG.DEFAULT_DAYS,
    radius: CONFIG.DEFAULT_RADIUS_KM,
    searchQuery: ""
  };
  updateFilterUI();
  applyFilters();
}

// ============================================================
// DATA LOADING
// ============================================================
async function loadData() {
  if (AppState.isLoading) return;
  
  AppState.isLoading = true;
  showLoading();
  
  try {
    const resp = await fetch(CONFIG.API_URL);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    
    const json = await resp.json();
    const dados = json.data || [];
    
    const agora = new Date();
    const limite = new Date(agora.getTime() - AppState.filters.dateRange * 24 * 3600 * 1000);
    
    const eventos = [];
    let maisRecente = null;
    
    for (const e of dados) {
      try {
        const t = new Date(e.time);
        if (isNaN(t) || t < limite) continue;
        
        const lat = +e.lat;
        const lon = +e.lon;
        const mag = +e.magnitud;
        const depth = +e.depth;
        const region = e.obsRegion || "";
        
        if (!isSantaBarbara(region)) continue;
        const dist = distanciaKm(lat, lon);
        if (dist > AppState.filters.radius) continue;
        
        const { x, y } = geoToXY(lat, lon);
        
        eventos.push({
          time: t,
          timeStr: formatDate(t),
          lat,
          lon,
          mag,
          depth_km: depth,
          region,
          dist_km: dist,
          x,
          y
        });
        
        if (!maisRecente || t > maisRecente) {
          maisRecente = t;
        }
      } catch {
        // ignore individual event errors
      }
    }
    
    if (!eventos.length) {
      AppState.allQuakes = [];
      AppState.filteredQuakes = [];
      hideLoading();
      renderList();
      renderGraph();
      updateStatistics();
      document.getElementById("ultima-atualizacao").textContent = 
        t('updateNoData');
      AppState.isLoading = false;
      return;
    }
    
    // Sort by age for color calculation
    eventos.sort((a, b) => a.time - b.time);
    const tMin = eventos[0].time;
    const tMax = eventos[eventos.length - 1].time;
    
    eventos.forEach(ev => {
      ev.color = corPorIdade(idadeNormalizada(ev.time, tMin, tMax));
    });
    
    // Sort by most recent first
    eventos.sort((a, b) => b.time - a.time);
    eventos.forEach((ev, i) => {
      ev.listIndex = i;
    });
    
    AppState.allQuakes = eventos;
    AppState.lastUpdate = maisRecente;
    
    applyFilters();
    
    document.getElementById("ultima-atualizacao").textContent = 
      t('update', { time: formatDate(maisRecente) + ' UTC' });
    
    // Check for new significant earthquakes for notifications
    checkForNewSignificantQuakes(eventos);
    
  } catch (err) {
    console.error(err);
    showError(t('updateError'));
    document.getElementById("lista-sismos").innerHTML = 
      `<li>${t('updateError')}</li>`;
    document.getElementById("ultima-atualizacao").textContent = t('updateError');
  } finally {
    AppState.isLoading = false;
    hideLoading();
  }
}

// ============================================================
// UI RENDERING
// ============================================================
function showLoading() {
  const ul = document.getElementById("lista-sismos");
  ul.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const li = document.createElement('li');
    li.className = 'loading-skeleton';
    ul.appendChild(li);
  }
}

function hideLoading() {
  // Loading skeletons will be replaced by renderList()
}

function renderList() {
  const ul = document.getElementById("lista-sismos");
  ul.innerHTML = "";
  
  const quakes = AppState.filteredQuakes;
  
  if (!quakes.length) {
    ul.innerHTML = `<li>${t('noData', { days: AppState.filters.dateRange })}</li>`;
    return;
  }
  
  quakes.forEach(q => {
    const li = document.createElement("li");
    li.dataset.index = q.listIndex;
    li.setAttribute('tabindex', '0');
    li.setAttribute('role', 'button');
    li.setAttribute('aria-label', `${q.timeStr}, Magnitude ${q.mag.toFixed(1)}, Depth ${q.depth_km.toFixed(1)} km`);
    
    li.innerHTML = `
      <span class="linha1">
        ${q.timeStr} • ML ${q.mag.toFixed(1)} • Prof ${q.depth_km.toFixed(1)} km
      </span>
      <span class="linha2">
        ${q.region} (dist ≈ ${q.dist_km.toFixed(1)} km)
      </span>
    `;
    
    li.addEventListener("click", () => focusQuake(q.listIndex));
    li.addEventListener("keydown", (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        focusQuake(q.listIndex);
      }
    });
    
    ul.appendChild(li);
  });
}

function focusQuake(index) {
  if (!AppState.graficoPlotly) return;
  
  const q = AppState.filteredQuakes.find(ev => ev.listIndex == index);
  if (!q) return;
  
  Plotly.animate(
    AppState.graficoPlotly,
    {
      layout: {
        scene: {
          camera: {
            eye: {
              x: q.x * 0.12,
              y: q.y * 0.12,
              z: 1.5
            }
          }
        }
      }
    },
    {
      transition: { duration: 700 },
      frame: { duration: 700 }
    }
  );
  
  highlightListItem(index);
}

function highlightListItem(index) {
  const ul = document.getElementById("lista-sismos");
  [...ul.children].forEach(li => {
    li.classList.remove("active");
    if (li.dataset.index == index) {
      li.classList.add("active");
      li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

function removeHighlight() {
  document.querySelectorAll("#lista-sismos li").forEach(li => {
    li.classList.remove("active", "highlight");
  });
}

// ============================================================
// 3D GRAPH RENDERING
// ============================================================
function renderGraph() {
  const quakes = AppState.filteredQuakes;
  const maxRange = AppState.filters.radius * 1.8;
  const zMin = -15;
  const zMax = CONFIG.PEAK_ALT_KM + 0.5;
  
  // Surface plane
  const grid = [-maxRange, maxRange];
  const planoSurface = {
    type: "surface",
    x: [[grid[0], grid[1]], [grid[0], grid[1]]],
    y: [[grid[0], grid[0]], [grid[1], grid[1]]],
    z: [[0, 0], [0, 0]],
    opacity: AppState.settings.showSurface ? 0.18 : 0,
    showscale: false,
    colorscale: [[0, "lightblue"], [1, "lightblue"]],
    hoverinfo: "skip",
    name: "Superfície"
  };
  
  // Volcano cone
  const coneRadius = 6.5;
  const nz = 20;
  const nt = 40;
  const coneX = [];
  const coneY = [];
  const coneZ = [];
  
  if (AppState.settings.showVolcano) {
    for (let i = 0; i < nz; i++) {
      const z = (i / (nz - 1)) * CONFIG.PEAK_ALT_KM;
      const r = coneRadius * (1 - z / CONFIG.PEAK_ALT_KM);
      const rowX = [];
      const rowY = [];
      const rowZ = [];
      for (let j = 0; j < nt; j++) {
        const t = (j / (nt - 1)) * 2 * Math.PI;
        rowX.push(r * Math.cos(t));
        rowY.push(r * Math.sin(t));
        rowZ.push(z);
      }
      coneX.push(rowX);
      coneY.push(rowY);
      coneZ.push(rowZ);
    }
  }
  
  const coneSurface = {
    type: "surface",
    x: coneX.length ? coneX : [[0], [0]],
    y: coneY.length ? coneY : [[0], [0]],
    z: coneZ.length ? coneZ : [[0], [0]],
    opacity: AppState.settings.showVolcano ? 0.15 : 0,
    showscale: false,
    colorscale: [[0, "#aaaaaa"], [1, "#ffffff"]],
    hoverinfo: "skip",
    name: "Cone Vulcão"
  };
  
  // Peak
  const pico = {
    type: "scatter3d",
    mode: "markers+text",
    x: [0],
    y: [0],
    z: [CONFIG.PEAK_ALT_KM],
    marker: { size: 10, color: "red" },
    text: ["Pico Sta. Bárbara (+1.1 km)"],
    textposition: "top center",
    name: "Pico Sta. Bárbara"
  };
  
  // Compass
  const rCompass = maxRange * 0.5;
  const rosaLinhas = {
    type: "scatter3d",
    mode: "lines",
    x: [0, 0, null, -rCompass, rCompass],
    y: [-rCompass, rCompass, null, 0, 0],
    z: [zMin + 0.2, zMin + 0.2, null, zMin + 0.2, zMin + 0.2],
    line: { width: 4, color: "white" },
    hoverinfo: "skip",
    name: "Rosa dos Ventos",
    visible: AppState.settings.showCompass
  };
  
  const rosaTextos = {
    type: "scatter3d",
    mode: "text",
    x: [0, 0, rCompass, -rCompass],
    y: [rCompass, -rCompass, 0, 0],
    z: [zMin + 0.5, zMin + 0.5, zMin + 0.5, zMin + 0.5],
    text: ["N", "S", "E", "W"],
    textfont: { size: 16, color: "white" },
    hoverinfo: "skip",
    name: "NSEW",
    visible: AppState.settings.showCompass
  };
  
  // Earthquakes trace
  function makeQuakesTrace(subset) {
    return {
      type: "scatter3d",
      mode: "markers",
      x: subset.map(q => q.x),
      y: subset.map(q => q.y),
      z: subset.map(q => -q.depth_km),
      marker: {
        size: subset.map(q => Math.max(6, Math.min(30, (q.mag + 1) * 4))),
        color: subset.map(q => q.color),
        opacity: 0.95
      },
      text: subset.map(q =>
        `${q.timeStr} • ML ${q.mag.toFixed(1)} • Prof ${q.depth_km.toFixed(1)} km`
      ),
      customdata: subset.map(q => q.listIndex),
      hovertemplate: "%{text}<extra></extra>",
      name: "Sismos"
    };
  }
  
  let sismosTrace = null;
  let frames = [];
  let sliders = [];
  let updatemenus = [];
  
  if (quakes.length) {
    const asc = [...quakes].sort((a, b) => a.time - b.time);
    const t0 = new Date(asc[0].time);
    t0.setHours(0, 0, 0, 0);
    const tEnd = new Date(asc[asc.length - 1].time);
    tEnd.setHours(23, 59, 59, 999);
    const diaMs = 24 * 3600 * 1000;
    
    const frameList = [];
    const numDias = Math.floor((tEnd - t0) / diaMs) + 1;
    
    for (let i = 0; i < numDias; i++) {
      const cutoff = new Date(t0.getTime() + (i + 1) * diaMs - 1);
      const subset = asc.filter(q => q.time <= cutoff);
      if (!subset.length) continue;
      const label = cutoff.toISOString().slice(0, 10);
      frameList.push({ name: label, subset });
    }
    
    frames = frameList.map(fr => ({
      name: fr.name,
      data: [makeQuakesTrace(fr.subset)],
      traces: [4]
    }));
    
    const inicial = frameList.length
      ? frameList[frameList.length - 1].subset
      : asc;
    
    sismosTrace = makeQuakesTrace(inicial);
    
    sliders = [{
      active: frameList.length - 1,
      x: 0.1,
      y: 0.03,
      len: 0.8,
      pad: { t: 30 },
      currentvalue: {
        visible: true,
        prefix: "Dia: ",
        font: { color: "#eee", size: 12 }
      },
      steps: frameList.map(fr => ({
        label: fr.name,
        method: "animate",
        args: [[fr.name], {
          frame: { duration: 400, redraw: true },
          transition: { duration: 0 },
          mode: "immediate"
        }]
      }))
    }];
    
    updatemenus = [{
      type: "buttons",
      showactive: false,
      x: 0.05,
      y: 0.03,
      direction: "left",
      pad: { t: 30, r: 10 },
      buttons: [
        {
          label: "▶ Play",
          method: "animate",
          args: [null, {
            fromcurrent: true,
            frame: { duration: 500, redraw: true },
            transition: { duration: 0 }
          }]
        },
        {
          label: "⏸ Pause",
          method: "animate",
          args: [[null], {
            mode: "immediate",
            frame: { duration: 0, redraw: false },
            transition: { duration: 0 }
          }]
        }
      ]
    }];
  }
  
  const data = sismosTrace
    ? [planoSurface, coneSurface, rosaLinhas, rosaTextos, sismosTrace, pico]
    : [planoSurface, coneSurface, rosaLinhas, rosaTextos, pico];
  
  const layout = {
    title: {
      text: t('title') + " (cores por antiguidade)",
      font: { color: "#eee", size: 16 }
    },
    paper_bgcolor: "#000",
    plot_bgcolor: "#000",
    scene: {
      xaxis: {
        title: "X (km)",
        range: [-maxRange, maxRange],
        gridcolor: "#333",
        zerolinecolor: "#555",
        backgroundcolor: "#000"
      },
      yaxis: {
        title: "Y (km)",
        range: [-maxRange, maxRange],
        gridcolor: "#333",
        zerolinecolor: "#555",
        backgroundcolor: "#000"
      },
      zaxis: {
        title: "Alt / Prof (km)",
        range: [zMin, zMax],
        gridcolor: "#333",
        zerolinecolor: "#555",
        backgroundcolor: "#000"
      },
      aspectmode: "manual",
      aspectratio: { x: 1.6, y: 1.6, z: 0.8 }
    },
    margin: { l: 0, r: 0, t: 40, b: 0 },
    showlegend: false,
    sliders,
    updatemenus
  };
  
  Plotly.newPlot("grafico", data, layout).then(gd => {
    AppState.graficoPlotly = gd;
    
    if (frames.length) {
      Plotly.addFrames(gd, frames);
    }
    
    gd.on("plotly_hover", evt => {
      const p = evt.points[0];
      if (p && p.customdata !== undefined) {
        highlightListItem(p.customdata);
      }
    });
    
    gd.on("plotly_unhover", () => {
      removeHighlight();
    });
    
    if (quakes.length) {
      setTimeout(() => blinkMostRecent(quakes), 800);
    }
  });
}

function blinkMostRecent(quakes) {
  if (!AppState.graficoPlotly || !quakes.length) return;
  
  const idxMaisRecente = quakes[0].listIndex;
  let intensidade = 1;
  let direcao = -0.15;
  
  const intervalo = setInterval(() => {
    intensidade += direcao;
    
    if (intensidade <= 0.3) direcao = +0.15;
    if (intensidade >= 1.0) direcao = -0.15;
    
    const opacidades = quakes.map(q =>
      q.listIndex === idxMaisRecente ? intensidade : 0.95
    );
    
    Plotly.restyle(
      AppState.graficoPlotly,
      { "marker.opacity": [opacidades] },
      [4]
    );
  }, 120);
  
  setTimeout(() => clearInterval(intervalo), 5000);
}

// ============================================================
// STATISTICS
// ============================================================
function updateStatistics() {
  const quakes = AppState.filteredQuakes;
  
  if (!quakes.length) {
    AppState.statistics = null;
    renderStatistics();
    return;
  }
  
  const stats = {
    total: quakes.length,
    averageMag: quakes.reduce((sum, q) => sum + q.mag, 0) / quakes.length,
    strongest: quakes.reduce((max, q) => q.mag > max.mag ? q : max, quakes[0]),
    deepest: quakes.reduce((max, q) => q.depth_km > max.depth_km ? q : max, quakes[0]),
    shallowest: quakes.reduce((min, q) => q.depth_km < min.depth_km ? q : min, quakes[0]),
    mostRecent: quakes[0]
  };
  
  AppState.statistics = stats;
  renderStatistics();
}

function renderStatistics() {
  const container = document.getElementById('statistics-content');
  if (!container) return;
  
  if (!AppState.statistics) {
    container.innerHTML = `<p style="text-align:center; color: var(--text-secondary);">${t('noData', { days: AppState.filters.dateRange })}</p>`;
    return;
  }
  
  const s = AppState.statistics;
  
  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">${t('total')}</div>
        <div class="stat-value">${s.total}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">${t('average')} ${t('magnitude')}</div>
        <div class="stat-value">${s.averageMag.toFixed(2)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">${t('strongest')}</div>
        <div class="stat-value">ML ${s.strongest.mag.toFixed(1)}</div>
        <div style="font-size:10px; color:var(--text-secondary);">${s.strongest.timeStr}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">${t('deepest')}</div>
        <div class="stat-value">${s.deepest.depth_km.toFixed(1)} km</div>
        <div style="font-size:10px; color:var(--text-secondary);">ML ${s.deepest.mag.toFixed(1)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">${t('shallowest')}</div>
        <div class="stat-value">${s.shallowest.depth_km.toFixed(1)} km</div>
        <div style="font-size:10px; color:var(--text-secondary);">ML ${s.shallowest.mag.toFixed(1)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">${t('mostRecent')}</div>
        <div class="stat-value">ML ${s.mostRecent.mag.toFixed(1)}</div>
        <div style="font-size:10px; color:var(--text-secondary);">${s.mostRecent.timeStr}</div>
      </div>
    </div>
  `;
}

// ============================================================
// URL MANAGEMENT
// ============================================================
function updateURL() {
  const params = new URLSearchParams();
  if (AppState.filters.magnitudeMin > 0) params.set('magMin', AppState.filters.magnitudeMin);
  if (AppState.filters.magnitudeMax < 10) params.set('magMax', AppState.filters.magnitudeMax);
  if (AppState.filters.depthMin > 0) params.set('depthMin', AppState.filters.depthMin);
  if (AppState.filters.depthMax < 50) params.set('depthMax', AppState.filters.depthMax);
  if (AppState.filters.dateRange !== CONFIG.DEFAULT_DAYS) params.set('days', AppState.filters.dateRange);
  if (AppState.filters.radius !== CONFIG.DEFAULT_RADIUS_KM) params.set('radius', AppState.filters.radius);
  if (AppState.filters.searchQuery) params.set('search', AppState.filters.searchQuery);
  
  const newURL = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
  window.history.replaceState({}, '', newURL);
}

function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('magMin')) AppState.filters.magnitudeMin = parseFloat(params.get('magMin'));
  if (params.has('magMax')) AppState.filters.magnitudeMax = parseFloat(params.get('magMax'));
  if (params.has('depthMin')) AppState.filters.depthMin = parseFloat(params.get('depthMin'));
  if (params.has('depthMax')) AppState.filters.depthMax = parseFloat(params.get('depthMax'));
  if (params.has('days')) AppState.filters.dateRange = parseInt(params.get('days'));
  if (params.has('radius')) AppState.filters.radius = parseFloat(params.get('radius'));
  if (params.has('search')) AppState.filters.searchQuery = params.get('search');
}

// ============================================================
// NOTIFICATIONS
// ============================================================
let lastNotifiedQuakes = new Set();

function checkForNewSignificantQuakes(quakes) {
  // Only check if notifications are enabled and we have previous data
  if (AppState.allQuakes.length === 0) {
    // First load - store IDs for future comparison
    quakes.forEach(q => lastNotifiedQuakes.add(q.listIndex));
    return;
  }
  
  // Find new significant earthquakes (magnitude >= 3.0)
  const significant = quakes.filter(q => q.mag >= 3.0 && !lastNotifiedQuakes.has(q.listIndex));
  
  significant.forEach(q => {
    showNotification(
      `Novo sismo significativo: ML ${q.mag.toFixed(1)}`,
      `Profundidade: ${q.depth_km.toFixed(1)} km • ${q.timeStr}`,
      'info'
    );
    lastNotifiedQuakes.add(q.listIndex);
  });
}

function showNotification(title, message, type = 'info') {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <strong>${title}</strong><br>
    <small>${message}</small>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

function showError(message) {
  showNotification('Erro', message, 'error');
}

function showSuccess(message) {
  showNotification('Sucesso', message, 'success');
}

// ============================================================
// EXPORT FUNCTIONALITY
// ============================================================
function exportData(format) {
  const quakes = AppState.filteredQuakes;
  
  if (!quakes.length) {
    showError('Não há dados para exportar');
    return;
  }
  
  let content, filename, mimeType;
  
  switch (format) {
    case 'csv':
      content = exportToCSV(quakes);
      filename = `sismos-santa-barbara-${new Date().toISOString().slice(0, 10)}.csv`;
      mimeType = 'text/csv';
      break;
    case 'json':
      content = exportToJSON(quakes);
      filename = `sismos-santa-barbara-${new Date().toISOString().slice(0, 10)}.json`;
      mimeType = 'application/json';
      break;
    case 'geojson':
      content = exportToGeoJSON(quakes);
      filename = `sismos-santa-barbara-${new Date().toISOString().slice(0, 10)}.geojson`;
      mimeType = 'application/geo+json';
      break;
    default:
      return;
  }
  
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  
  showSuccess(`Dados exportados: ${filename}`);
}

function exportToCSV(quakes) {
  const headers = ['Data/Hora', 'Magnitude', 'Profundidade (km)', 'Latitude', 'Longitude', 'Região', 'Distância (km)', 'X (km)', 'Y (km)'];
  const rows = quakes.map(q => [
    q.timeStr,
    q.mag.toFixed(2),
    q.depth_km.toFixed(2),
    q.lat.toFixed(6),
    q.lon.toFixed(6),
    q.region,
    q.dist_km.toFixed(2),
    q.x.toFixed(2),
    q.y.toFixed(2)
  ]);
  
  return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

function exportToJSON(quakes) {
  return JSON.stringify({
    metadata: {
      exportDate: new Date().toISOString(),
      filters: AppState.filters,
      total: quakes.length,
      dataSource: 'IPMA.pt'
    },
    earthquakes: quakes.map(q => ({
      time: q.time.toISOString(),
      timeStr: q.timeStr,
      magnitude: q.mag,
      depth_km: q.depth_km,
      latitude: q.lat,
      longitude: q.lon,
      region: q.region,
      distance_km: q.dist_km,
      x_km: q.x,
      y_km: q.y
    }))
  }, null, 2);
}

function exportToGeoJSON(quakes) {
  return JSON.stringify({
    type: 'FeatureCollection',
    metadata: {
      exportDate: new Date().toISOString(),
      filters: AppState.filters,
      dataSource: 'IPMA.pt'
    },
    features: quakes.map(q => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [q.lon, q.lat, -q.depth_km]
      },
      properties: {
        time: q.time.toISOString(),
        timeStr: q.timeStr,
        magnitude: q.mag,
        depth_km: q.depth_km,
        region: q.region,
        distance_km: q.dist_km,
        x_km: q.x,
        y_km: q.y
      }
    }))
  }, null, 2);
}

// ============================================================
// SHARE FUNCTIONALITY
// ============================================================
function shareView() {
  const url = window.location.href;
  
  if (navigator.share) {
    navigator.share({
      title: t('title'),
      text: `Visualização de sismos - Serra de Santa Bárbara`,
      url: url
    }).catch(err => {
      if (err.name !== 'AbortError') {
        copyToClipboard(url);
      }
    });
  } else {
    copyToClipboard(url);
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showSuccess('Link copiado para a área de transferência');
  }).catch(() => {
    showError('Erro ao copiar link');
  });
}

// ============================================================
// SETTINGS MANAGEMENT
// ============================================================
function loadSettings() {
  const saved = localStorage.getItem('vulcao-shake-settings');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      AppState.settings = { ...AppState.settings, ...parsed };
    } catch (e) {
      console.warn('Failed to load settings', e);
    }
  }
  
  // Load from URL
  const params = new URLSearchParams(window.location.search);
  if (params.has('lang')) {
    AppState.settings.language = params.get('lang');
  }
  
  applySettings();
}

function saveSettings() {
  localStorage.setItem('vulcao-shake-settings', JSON.stringify(AppState.settings));
  applySettings();
}

function applySettings() {
  // Apply language
  document.documentElement.lang = AppState.settings.language;
  updateUIText();
  
  // Apply theme
  if (AppState.settings.theme === 'light') {
    document.body.classList.add('light-theme');
  } else if (AppState.settings.theme === 'auto') {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  } else {
    document.body.classList.remove('light-theme');
  }
  
  // Apply other settings
  if (AppState.settings.reducedMotion) {
    document.body.classList.add('reduced-motion');
  } else {
    document.body.classList.remove('reduced-motion');
  }
  
  if (AppState.settings.highContrast) {
    document.body.classList.add('high-contrast');
  } else {
    document.body.classList.remove('high-contrast');
  }
  
  // Re-render graph with new settings
  if (AppState.graficoPlotly) {
    renderGraph();
  }
}

function updateUIText() {
  // Update all text elements with translations
  const titleEl = document.querySelector('#sidebar h1');
  if (titleEl) titleEl.textContent = t('title');
  
  const subtitleEl = document.querySelector('#sidebar small');
  if (subtitleEl) {
    subtitleEl.textContent = t('subtitle', { 
      days: AppState.filters.dateRange, 
      radius: AppState.filters.radius 
    });
  }
  
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (key) {
      const params = el.dataset.i18nParams ? JSON.parse(el.dataset.i18nParams) : {};
      el.textContent = t(key, params);
    }
  });
  
  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (key) {
      el.placeholder = t(key);
    }
  });
  
  // Update select options
  document.querySelectorAll('select option[data-i18n]').forEach(option => {
    const key = option.dataset.i18n;
    if (key) {
      const params = option.dataset.i18nParams ? JSON.parse(option.dataset.i18nParams) : {};
      option.textContent = t(key, params);
    }
  });
}

// ============================================================
// INITIALIZATION
// ============================================================
function init() {
  loadSettings();
  loadFromURL();
  setupEventListeners();
  setupFilterUI();
  setupSettingsUI();
  loadData();
  
  // Auto-refresh if enabled
  if (AppState.settings.autoRefresh) {
    setInterval(() => {
      loadData();
    }, AppState.settings.refreshInterval * 60 * 1000);
  }
}

function setupEventListeners() {
  // Mobile menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('sidebar');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-hidden');
    });
  }
  
  // Sidebar toggle
  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      // Update button text/icon
      if (sidebar.classList.contains('collapsed')) {
        sidebarToggle.textContent = '▶';
        sidebarToggle.setAttribute('aria-label', t('expand'));
      } else {
        sidebarToggle.textContent = '◀';
        sidebarToggle.setAttribute('aria-label', t('collapse'));
      }
    });
  }
  
  // Collapsible panels
  document.querySelectorAll('.panel-header').forEach(header => {
    header.addEventListener('click', () => {
      const panel = header.closest('.collapsible-panel');
      const content = panel.querySelector('.panel-content');
      const toggle = panel.querySelector('.panel-toggle');
      
      content.classList.toggle('expanded');
      toggle.classList.toggle('expanded');
    });
  });
  
  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        AppState.filters.searchQuery = e.target.value;
        applyFilters();
      }, 300);
    });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      sidebar.classList.add('mobile-hidden');
    }
  });
}

function setupFilterUI() {
  // Magnitude filter
  const magMin = document.getElementById('filter-mag-min');
  const magMax = document.getElementById('filter-mag-max');
  const magValue = document.getElementById('filter-mag-value');
  
  function updateMagDisplay() {
    if (magValue) {
      magValue.textContent = `${AppState.filters.magnitudeMin.toFixed(1)} - ${AppState.filters.magnitudeMax.toFixed(1)}`;
    }
    applyFilters();
  }
  
  if (magMin) {
    magMin.addEventListener('input', (e) => {
      AppState.filters.magnitudeMin = parseFloat(e.target.value);
      if (magMax && parseFloat(magMax.value) < AppState.filters.magnitudeMin) {
        magMax.value = AppState.filters.magnitudeMin;
        AppState.filters.magnitudeMax = AppState.filters.magnitudeMin;
      }
      updateMagDisplay();
    });
  }
  
  if (magMax) {
    magMax.addEventListener('input', (e) => {
      AppState.filters.magnitudeMax = parseFloat(e.target.value);
      if (magMin && parseFloat(magMin.value) > AppState.filters.magnitudeMax) {
        magMin.value = AppState.filters.magnitudeMax;
        AppState.filters.magnitudeMin = AppState.filters.magnitudeMax;
      }
      updateMagDisplay();
    });
  }
  
  // Depth filter
  const depthMin = document.getElementById('filter-depth-min');
  const depthMax = document.getElementById('filter-depth-max');
  const depthValue = document.getElementById('filter-depth-value');
  
  function updateDepthDisplay() {
    if (depthValue) {
      depthValue.textContent = `${AppState.filters.depthMin.toFixed(1)} - ${AppState.filters.depthMax.toFixed(1)} km`;
    }
    applyFilters();
  }
  
  // Quick magnitude buttons
  document.querySelectorAll('.filter-quick-btn[data-mag]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mag = parseFloat(btn.dataset.mag);
      AppState.filters.magnitudeMin = mag;
      AppState.filters.magnitudeMax = 10;
      if (magMin) magMin.value = mag;
      if (magMax) magMax.value = 10;
      updateMagDisplay();
      updateFilterUI();
    });
  });
  
  // Quick depth buttons
  document.querySelectorAll('.filter-quick-btn[data-depth-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.depthType;
      if (type === 'surface') {
        AppState.filters.depthMin = 0;
        AppState.filters.depthMax = 1;
      } else if (type === 'shallow') {
        AppState.filters.depthMin = 0;
        AppState.filters.depthMax = 5;
      } else if (type === 'medium') {
        AppState.filters.depthMin = 5;
        AppState.filters.depthMax = 15;
      } else if (type === 'deep') {
        AppState.filters.depthMin = 15;
        AppState.filters.depthMax = 50;
      }
      if (depthMin) depthMin.value = AppState.filters.depthMin;
      if (depthMax) depthMax.value = AppState.filters.depthMax;
      updateDepthDisplay();
      updateFilterUI();
    });
  });
  
  if (depthMin) {
    depthMin.addEventListener('input', (e) => {
      AppState.filters.depthMin = parseFloat(e.target.value);
      updateDepthDisplay();
    });
  }
  
  if (depthMax) {
    depthMax.addEventListener('input', (e) => {
      AppState.filters.depthMax = parseFloat(e.target.value);
      updateDepthDisplay();
    });
  }
  
  // Date range
  const dateRange = document.getElementById('filter-date-range');
  if (dateRange) {
    dateRange.addEventListener('change', (e) => {
      AppState.filters.dateRange = parseInt(e.target.value);
      applyFilters();
      loadData(); // Reload data with new date range
    });
  }
  
  // Radius
  const radius = document.getElementById('filter-radius');
  const radiusValue = document.getElementById('filter-radius-value');
  
  if (radius) {
    radius.addEventListener('input', (e) => {
      AppState.filters.radius = parseFloat(e.target.value);
      if (radiusValue) {
        radiusValue.textContent = `${AppState.filters.radius.toFixed(0)} km`;
      }
      applyFilters();
      loadData(); // Reload data with new radius
    });
  }
  
  // Clear filters
  const clearBtn = document.getElementById('clear-filters');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearFilters);
  }
}

function updateFilterUI() {
  // Update all filter inputs to match state
  const magMin = document.getElementById('filter-mag-min');
  const magMax = document.getElementById('filter-mag-max');
  const depthMin = document.getElementById('filter-depth-min');
  const depthMax = document.getElementById('filter-depth-max');
  const dateRange = document.getElementById('filter-date-range');
  const radius = document.getElementById('filter-radius');
  const searchInput = document.getElementById('search-input');
  
  if (magMin) magMin.value = AppState.filters.magnitudeMin;
  if (magMax) magMax.value = AppState.filters.magnitudeMax;
  if (depthMin) depthMin.value = AppState.filters.depthMin;
  if (depthMax) depthMax.value = AppState.filters.depthMax;
  if (dateRange) dateRange.value = AppState.filters.dateRange;
  if (radius) radius.value = AppState.filters.radius;
  if (searchInput) searchInput.value = AppState.filters.searchQuery;
  
  // Update quick buttons
  document.querySelectorAll('.filter-quick-btn').forEach(btn => {
    const mag = parseFloat(btn.dataset.mag);
    if (mag && AppState.filters.magnitudeMin === mag) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function setupSettingsUI() {
  // Language selector
  const langSelect = document.getElementById('setting-language');
  if (langSelect) {
    langSelect.value = AppState.settings.language;
    langSelect.addEventListener('change', (e) => {
      AppState.settings.language = e.target.value;
      saveSettings();
    });
  }
  
  // Theme selector
  const themeSelect = document.getElementById('setting-theme');
  if (themeSelect) {
    themeSelect.value = AppState.settings.theme;
    themeSelect.addEventListener('change', (e) => {
      AppState.settings.theme = e.target.value;
      saveSettings();
    });
    
    // Listen for system theme changes if auto is selected
    if (AppState.settings.theme === 'auto') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (AppState.settings.theme === 'auto') {
          applySettings();
        }
      });
    }
  }
  
  // Initialize toggle switches
  document.querySelectorAll('.toggle-switch').forEach(toggle => {
    const setting = toggle.dataset.setting;
    if (setting && AppState.settings[setting]) {
      toggle.classList.add('active');
    }
  });
  
  // Toggles
  document.querySelectorAll('.toggle-switch').forEach(toggle => {
    const handleToggle = () => {
      const setting = toggle.dataset.setting;
      if (setting) {
        AppState.settings[setting] = !AppState.settings[setting];
        toggle.classList.toggle('active');
        saveSettings();
      }
    };
    
    toggle.addEventListener('click', handleToggle);
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ============================================================
// ABOUT MODAL
// ============================================================
function showAbout() {
  const modal = document.getElementById('about-modal');
  if (modal) {
    modal.classList.add('active');
    updateUIText(); // Update translations in modal
  }
}

function closeAbout() {
  const modal = document.getElementById('about-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Close modal on overlay click
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('about-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAbout();
      }
    });
  }
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('about-modal');
      if (modal && modal.classList.contains('active')) {
        closeAbout();
      }
    }
  });
});

// Export functions for use in HTML
window.exportData = exportData;
window.shareView = shareView;
window.clearFilters = clearFilters;
window.showAbout = showAbout;
window.closeAbout = closeAbout;

