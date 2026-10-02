(() => {
  const { icon, heading } = Sora;
  let cityMap;

  const mapPins = [
    {
      position: [-5.4292, 105.261],
      label: "Balai Kota Bandar Lampung",
      category: "facility",
      color: "#6a9650",
    },
    {
      position: [-5.4297, 105.2617],
      label: "Tugu Adipura",
      category: "facility",
      color: "#6a9650",
    },
    {
      position: [-5.4215, 105.2583],
      label: "Halte BRT Rajabasa",
      category: "transit",
      color: "#588bc9",
    },
    {
      position: [-5.4144, 105.258],
      label: "Kepadatan lalu lintas · Jl. ZA Pagar Alam",
      category: "traffic",
      color: "#ed775e",
    },
    {
      position: [-5.4307, 105.2633],
      label: "RSUD Dr. A. Dadi Tjokrodipo",
      category: "facility",
      color: "#6a9650",
    },
    {
      position: [-5.4138, 105.2663],
      label: "Kepadatan lalu lintas · Jl. Teuku Umar",
      category: "traffic",
      color: "#ed775e",
    },
    {
      position: [-5.4352, 105.261],
      label: "Taman Gajah",
      category: "facility",
      color: "#6a9650",
    },
    {
      position: [-5.4506, 105.2678],
      label: "Halte BRT Sukaraja",
      category: "transit",
      color: "#588bc9",
    },
  ];

  function renderMapFilters() {
    return `
      <div class="map-filter">
        <button class="filter-chip active" data-map-filter="all">Semua</button>
        <button class="filter-chip active" data-map-filter="traffic">
          <i class="legend-dot warn"></i>Lalu lintas
        </button>
        <button class="filter-chip active" data-map-filter="transit">
          <i class="legend-dot transit"></i>Transportasi
        </button>
      </div>
    `;
  }

  function renderMapFooter(large) {
    if (!large) {
      return `
        <div class="map-caption">
          <span class="map-live">Titik contoh</span>
          <span>Basemap © Esri</span>
        </div>
      `;
    }

    return `
      <div class="map-key">
        <span class="legend-item"><i class="legend-dot"></i>Fasilitas kota</span>
        <span class="legend-item"><i class="legend-dot warn"></i>Perhatian</span>
        <span class="legend-item"><i class="legend-dot transit"></i>Transportasi</span>
      </div>
    `;
  }

  function mapPanel(large = false) {
    const title = large ? "Peta fasilitas kota" : "Peta operasional kota";
    const description = large
      ? "cakupan peta provinsi"
      : "peta dan titik contoh";
    const actions = large
      ? `<button class="button" data-action="report">${icon("plus")} Lapor lokasi</button>`
      : renderMapFilters();

    return `
      <section class="panel ${large ? "map-large" : ""}">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">${title}</h2>
            <p class="panel-subtitle">Provinsi Lampung · ${description}</p>
          </div>
          ${actions}
        </div>
        <div id="city-map" aria-label="Peta interaktif Provinsi Lampung"></div>
        ${renderMapFooter(large)}
      </section>
    `;
  }

  function renderMap(view) {
    const actions = `
      <button class="button" data-action="report">
        ${icon("plus")} Lapor lokasi
      </button>
    `;

    view.innerHTML =
      heading(
        "PROVINSI LAMPUNG",
        "Peta Lampung.",
        "Fasilitas, mobilitas, dan titik perhatian di seluruh Provinsi Lampung.",
        actions,
      ) + mapPanel(true);

    initMap();
  }

  function showMapFallback(element) {
    element.innerHTML = `
      <div style="display:grid;height:100%;place-items:center;color:#66746a;font-size:11px;text-align:center;padding:20px">
        Peta membutuhkan koneksi internet.<br />
        Data layanan tetap bisa dijelajahi.
      </div>
    `;
  }

  function createMap(element) {
    const lampungBounds = L.latLngBounds([-6.25, 103.35], [-3.65, 106.35]);
    const map = L.map(element, {
      scrollWheelZoom: false,
      zoomControl: false,
      maxBounds: lampungBounds,
      maxBoundsViscosity: 0.9,
      minZoom: 7,
      maxZoom: 18,
    }).fitBounds(lampungBounds, {
      padding: [12, 12],
    });

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 19,
        attribution:
          "Tiles &copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors",
      },
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    return map;
  }

  function addMapPins(map) {
    return mapPins.map((pin) => {
      const marker = L.circleMarker(pin.position, {
        radius: 7,
        color: "#fff",
        weight: 2,
        fillColor: pin.color,
        fillOpacity: 0.95,
      })
        .bindPopup(`<strong>${pin.label}</strong>`)
        .addTo(map);

      marker.options.category = pin.category;
      return marker;
    });
  }

  function setCategoryVisibility(map, markers, category, visible) {
    markers
      .filter((marker) => marker.options.category === category)
      .forEach((marker) => {
        if (visible && !map.hasLayer(marker)) marker.addTo(map);
        if (!visible && map.hasLayer(marker)) map.removeLayer(marker);
      });
  }

  function bindMapFilters(map, markers) {
    const buttons = [...document.querySelectorAll("[data-map-filter]")];
    const allButton = buttons.find(
      (button) => button.dataset.mapFilter === "all",
    );
    const categoryButtons = buttons.filter(
      (button) => button.dataset.mapFilter !== "all",
    );

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.dataset.mapFilter;

        if (category === "all") {
          categoryButtons.forEach((categoryButton) =>
            categoryButton.classList.add("active"),
          );
          markers.forEach((marker) => marker.addTo(map));
          return;
        }

        button.classList.toggle("active");
        setCategoryVisibility(
          map,
          markers,
          category,
          button.classList.contains("active"),
        );
        allButton.classList.toggle(
          "active",
          categoryButtons.every((categoryButton) =>
            categoryButton.classList.contains("active"),
          ),
        );
      });
    });
  }

  function initMap() {
    if (typeof L === "undefined") {
      const element = document.getElementById("city-map");
      if (element) showMapFallback(element);
      return;
    }

    if (cityMap) {
      cityMap.remove();
      cityMap = null;
    }

    const element = document.getElementById("city-map");
    if (!element) return;

    cityMap = createMap(element);
    const markers = addMapPins(cityMap);
    bindMapFilters(cityMap, markers);
    requestAnimationFrame(() => cityMap?.invalidateSize());
  }

  Sora.map = {
    mapPanel,
    renderMap,
    initMap,
  };
})();
