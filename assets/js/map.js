(() => {
  const { icon, heading } = Sora;
  let activeMap;

  const roadSegments = [
    {
      label: "Jl. ZA Pagar Alam",
      status: "Padat · 82%",
      level: "heavy",
      coordinates: [
        [-5.3656, 105.2458],
        [-5.3828, 105.2492],
        [-5.3994, 105.2529],
        [-5.4144, 105.258],
      ],
      destination: "Jalan ZA Pagar Alam Bandar Lampung",
    },
    {
      label: "Jl. Teuku Umar",
      status: "Ramai · 64%",
      level: "moderate",
      coordinates: [
        [-5.3976, 105.2532],
        [-5.4054, 105.2581],
        [-5.4138, 105.2663],
        [-5.4237, 105.275],
      ],
      destination: "Jalan Teuku Umar Bandar Lampung",
    },
    {
      label: "Jl. Raden Intan",
      status: "Lancar · 28%",
      level: "clear",
      coordinates: [
        [-5.4234, 105.2535],
        [-5.4284, 105.2582],
        [-5.4331, 105.264],
        [-5.4382, 105.2691],
      ],
      destination: "Jalan Raden Intan Bandar Lampung",
    },
  ];

  function mapMarkup({ compact = false } = {}) {
    const roads = roadSegments.map((road) => `<a class="road-row" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(road.destination)}" target="_blank" rel="noopener noreferrer"><span class="road-line-key ${road.level}"></span><span class="road-name">${road.label}</span><strong>${road.status}</strong><span class="road-open">${icon("arrow")}</span></a>`).join("");
    return `<section class="panel road-map-panel ${compact ? "road-map-compact" : ""}">
      <div class="panel-head"><div><h2 class="panel-title">Peta jalan dan kemacetan</h2><p class="panel-subtitle">Koridor utama Bandar Lampung · data demo</p></div><span class="demo-badge">SIMULASI</span></div>
      <div id="road-map" role="img" aria-label="Peta Bandar Lampung dengan garis ruas jalan berwarna menurut tingkat kemacetan"></div>
      <div class="road-map-legend"><span><i class="road-line-key heavy"></i>Padat</span><span><i class="road-line-key moderate"></i>Ramai</span><span><i class="road-line-key clear"></i>Lancar</span></div>
      <div class="road-list">${roads}</div>
      <div class="map-caption"><span>Jalur dan tingkat kepadatan simulasi</span><span>Basemap © Esri</span></div>
    </section>`;
  }

  function renderMap(view) {
    const now = new Date();
    const stamp = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(now);
    view.innerHTML = heading(
      "KOTA · MOBILITAS",
      "Peta jalan.",
      "Lihat letak ruas jalan utama dan demo tingkat kepadatannya.",
      `<time class="date-stamp" datetime="${now.toISOString()}">${icon("calendar")} ${stamp}</time>`,
    ) + mapMarkup();
    initRoadMap();
  }

  function showMapFallback(element) {
    element.innerHTML = "Peta memerlukan koneksi internet. Daftar ruas jalan tetap tersedia di bawah.";
  }

  function initRoadMap() {
    const element = document.getElementById("road-map");
    if (!element) return;
    if (activeMap) {
      activeMap.remove();
      activeMap = null;
    }
    if (typeof L === "undefined") {
      showMapFallback(element);
      return;
    }

    activeMap = L.map(element, { scrollWheelZoom: false, zoomControl: true }).setView([-5.414, 105.262], 13);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: "Tiles &copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors",
    }).addTo(activeMap);

    const colors = { heavy: "#d75142", moderate: "#e2a640", clear: "#5b9a68" };
    roadSegments.forEach((road) => {
      L.polyline(road.coordinates, {
        color: colors[road.level],
        weight: 7,
        opacity: 0.88,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(activeMap).bindPopup(`<strong>${road.label}</strong><br>${road.status} · data demo`);
      const midpoint = road.coordinates[Math.floor(road.coordinates.length / 2)];
      L.circleMarker(midpoint, {
        radius: 6,
        color: "#fff",
        weight: 2,
        fillColor: colors[road.level],
        fillOpacity: 1,
      }).addTo(activeMap).bindPopup(`<strong>${road.label}</strong><br>${road.status}`);
    });
    requestAnimationFrame(() => activeMap?.invalidateSize());
  }

  function roadMapPanel(compact = false) {
    return mapMarkup({ compact });
  }

  Sora.map = { renderMap, initRoadMap, roadMapPanel };
})();
