(() => {
  const { icon, heading } = Sora;
  const modules = Sora.modules;
  const weekdays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const monitorKey = "laci-demo-monitoring";

  function dateLabel(date = new Date()) {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

  function dateStamp(date = new Date()) {
    return `<time class="date-stamp" datetime="${date.toISOString()}">${icon("calendar")} ${dateLabel(date)}</time>`;
  }

  function isMonitoring(id) {
    try {
      const states = JSON.parse(localStorage.getItem(monitorKey) || "{}");
      return states[id] !== false;
    } catch {
      return true;
    }
  }

  function mapsUrl(query) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  }

  function cardMarkup(item, date) {
    return `<article class="module-card">
      <div class="module-card-top"><span class="module-icon">${icon(item.icon)}</span><span class="module-status ${item.alert ? "alert" : ""}">${item.status}</span></div>
      <h2>${item.label}</h2><p>${item.description}</p>
      <div class="module-card-foot"><span>${item.metric} · ${item.unit}</span><button class="module-card-action" data-view="${item.id}">Buka ${icon("arrow")}</button></div>
      <time class="module-updated" datetime="${date.toISOString()}">DEMO · ${dateLabel(date)}</time>
    </article>`;
  }

  function renderModules(view) {
    const date = new Date();
    const groups = [...new Set(modules.map((item) => item.group))];
    const groupMarkup = groups.map((group) => `<section class="module-group"><h2 class="eyebrow">${group}</h2><div class="module-grid">${modules.filter((item) => item.group === group).map((item) => cardMarkup(item, date)).join("")}</div></section>`).join("");
    view.innerHTML = heading(
      "PUSAT LAYANAN",
      "Semua layanan kota.",
      "Jelajahi demo layanan dan pantau indikator simulasi per lokasi.",
      dateStamp(date),
    ) + `<div class="modules-toolbar"><label class="search-box">${icon("search")}<input id="module-search" type="search" placeholder="Cari layanan kota..." aria-label="Cari layanan kota"></label><span class="date-stamp">${modules.length} fitur demo</span></div><div id="module-grid">${groupMarkup}</div>`;

    document.getElementById("module-search").addEventListener("input", (event) => {
      const query = event.target.value.trim().toLocaleLowerCase("id");
      document.querySelectorAll("#module-grid .module-group").forEach((group) => {
        const cards = [...group.querySelectorAll(".module-card")];
        const visible = cards.filter((card) => {
          const show = card.textContent.toLocaleLowerCase("id").includes(query);
          card.hidden = !show;
          return show;
        }).length;
        group.hidden = visible === 0;
      });
    });
  }

  function chartMarkup(values) {
    return values.map((value, index) => `<div class="chart-column" role="img" aria-label="${weekdays[index]}: ${value} persen">
      <span class="chart-value">${value}%</span><i class="chart-bar" style="height:${value}%"></i><span>${weekdays[index]}</span>
    </div>`).join("");
  }

  function locationMarkup(item, location) {
    const isAirQuality = item.id === "green-city";
    const meterLabel = isAirQuality
      ? "Kualitas udara"
      : item.id === "smart-traffic"
        ? "Kepadatan jalan"
        : item.id === "smart-waste"
          ? "Kapasitas terisi"
          : item.id === "smart-parking"
            ? "Slot tersedia"
            : item.id === "flood-monitoring"
              ? "Risiko banjir demo"
              : "Tingkat simulasi";
    return `<article class="location-row">
      <div class="location-copy"><strong>${location.label}</strong><span>${location.detail}</span></div>
      <div class="location-indicator"><div class="location-indicator-head"><span>${meterLabel}</span><strong>${location.value}${isAirQuality ? " AQI" : "%"}</strong></div><div class="location-track"><i style="width:${location.value}%"></i></div><span class="status-pill ${location.value >= 75 ? "progress" : "done"}">${location.status}</span></div>
      <a class="route-link" href="${mapsUrl(location.query)}" target="_blank" rel="noopener noreferrer">${icon("arrow")} Buka arah di Google Maps</a>
    </article>`;
  }

  function cctvMarkup(cameras) {
    const cards = cameras.map((camera) => `<article class="cctv-card">
      <a class="cctv-preview" href="${camera.stream}" target="_blank" rel="noopener noreferrer" aria-label="Putar video CCTV ${camera.name}">
        <span class="cctv-badge">SIARAN RESMI</span><span class="cctv-play">${icon("arrow")}</span>
        <strong>${camera.name}</strong><span>Buka video kamera asli</span>
      </a>
      <div class="cctv-card-copy"><span>Sumber: CCTV Online Polresta Bandar Lampung</span><a href="${camera.stream}" target="_blank" rel="noopener noreferrer">${icon("arrow")} Putar video asli</a></div>
    </article>`).join("");
    return `<section class="panel cctv-panel"><div class="panel-head"><div><h2 class="panel-title">CCTV jalan Bandar Lampung</h2><p class="panel-subtitle">Kamera publik dengan lokasi berbeda</p></div><span class="demo-badge cctv-source">SUMBER RESMI</span></div><div class="cctv-grid">${cards}</div><div class="map-caption"><span>Siaran dibuka di situs resmi Polresta, tidak disalin ke halaman ini.</span><a href="https://restabandarlampung.lampung.polri.go.id/cctv" target="_blank" rel="noopener noreferrer">Portal CCTV Polresta ${icon("arrow")}</a></div></section>`;
  }

  function renderModuleDetail(item, view) {
    const date = new Date();
    const monitoring = isMonitoring(item.id);
    const actions = `<button class="button ${monitoring ? "button-primary" : ""}" data-action="toggle-monitor" data-module-id="${item.id}" aria-pressed="${monitoring}">${icon("check")} ${monitoring ? "Pemantauan aktif" : "Aktifkan pemantauan"}</button><button class="button" data-view="modules">${icon("chevron")} Semua layanan</button>`;
    const kpis = item.kpis.map((value, index) => `<div class="detail-kpi"><span>${item.captions[index]}</span><strong>${value}</strong></div>`).join("");
    const locations = item.locations.map((location) => locationMarkup(item, location)).join("");
    const cctvPanel = item.id === "smart-traffic" ? cctvMarkup(item.cameras) : "";
    const trafficMap = item.id === "smart-traffic" ? Sora.map.roadMapPanel(true) : "";
    view.innerHTML = heading(
      item.group.toUpperCase(),
      item.label,
      `${item.description} <span class="demo-note">Demo simulasi, bukan data sensor atau kamera langsung.</span>`,
      `${dateStamp(date)}${actions}`,
    ) + `<div class="detail-layout">
      <section class="panel"><div class="detail-intro"><span class="module-icon">${icon(item.icon)}</span><div><h2>${item.label}</h2><p>Demo pemantauan · diperbarui ${dateLabel(date)}</p></div></div><div class="detail-body"><div class="detail-kpis">${kpis}</div><h3 class="detail-section-title">Tren pemantauan · 7 hari terakhir</h3><div class="detail-chart">${chartMarkup(item.values)}</div><p class="demo-note">Setiap batang menunjukkan nilai persentase simulasi.</p></div></section>
      <section class="panel"><div class="panel-head"><div><h2 class="panel-title">Kontrol demo</h2><p class="panel-subtitle">Status pemantauan fitur ini</p></div></div><div class="monitor-summary"><span class="monitor-light ${monitoring ? "is-on" : ""}"></span><div><strong>${monitoring ? "Pemantauan diaktifkan" : "Pemantauan dijeda"}</strong><span>Waktu lokal · ${dateLabel(date)}</span></div></div><div class="monitor-description">Indikator kepadatan adalah simulasi. Video CCTV dibuka dari sumber resmi per kamera.</div></section>
      ${cctvPanel}
      ${trafficMap}
      <section class="panel location-panel"><div class="panel-head"><div><h2 class="panel-title">Lokasi dan indikator</h2><p class="panel-subtitle">${item.locations.length} titik demo · Bandar Lampung</p></div><span class="demo-badge">DATA DEMO</span></div><div class="location-list">${locations}</div></section>
    </div>`;
    if (item.id === "smart-traffic") Sora.map.initRoadMap();
  }

  Sora.services = { renderModules, renderModuleDetail, dateLabel };
})();
