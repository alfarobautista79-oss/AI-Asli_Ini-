(() => {
  const { icon, heading } = Sora;
  const { getAllReports, renderReportRows } = Sora.reports;
  const { roadMapPanel, initRoadMap } = Sora.map;
  let clockInterval;

  function dateText(date = new Date()) {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(date);
  }

  function statsMarkup() {
    const traffic = Sora.moduleFor("smart-traffic");
    const green = Sora.moduleFor("green-city");
    const waste = Sora.moduleFor("smart-waste");
    const reports = getAllReports();
    const data = [
      { label: "Lalu lintas", value: traffic.kpis[0], suffix: "titik", delta: traffic.status, glyph: "traffic", target: "smart-traffic", warn: true },
      { label: "Kualitas udara", value: "42", suffix: "AQI", delta: "baik · demo", glyph: "leaf", target: "green-city" },
      { label: "Tempat sampah", value: waste.locations.length, suffix: "lokasi demo", delta: "kapasitas dipantau", glyph: "trash", target: "smart-waste" },
      { label: "Laporan warga", value: reports.length, suffix: "tercatat", delta: `${reports.filter((report) => report.demo).length} data demo`, glyph: "pin", target: "citizen-report", warn: true },
    ];
    return `<div class="stats">${data.map((item) => `<button class="stat stat-link" data-view="${item.target}"><div class="stat-top"><span>${item.label}</span><span class="stat-icon">${icon(item.glyph)}</span></div><div class="stat-value-row"><strong class="stat-value">${item.value}</strong><span class="stat-delta ${item.warn ? "warn" : ""}">${item.suffix}</span></div><div class="stat-sub">${item.delta}</div></button>`).join("")}</div>`;
  }

  function activityPanel() {
    const events = [
      { icon: "traffic", title: "Pantauan kepadatan jalan", text: "Jl. ZA Pagar Alam · CCTV demo", view: "smart-traffic", tone: "warn" },
      { icon: "cloud", title: "Titik sungai diperbarui", text: "Way Kuala · status simulasi siaga", view: "flood-monitoring", tone: "warn" },
      { icon: "trash", title: "Lokasi tempat sampah", text: "Tugu Adipura · kapasitas demo 78%", view: "smart-waste", tone: "" },
      { icon: "car", title: "Slot parkir umum tersedia", text: "Taman Gajah · data demo", view: "smart-parking", tone: "blue" },
    ];
    return `<section class="panel feed-panel"><div class="panel-head"><div><h2 class="panel-title">Aktivitas demo</h2><p class="panel-subtitle">Contoh pembaruan layanan · ${dateText()}</p></div></div><div class="feed-list">${events.map((event) => `<button class="feed-item feed-action" data-view="${event.view}"><span class="feed-icon ${event.tone}">${icon(event.icon)}</span><span class="feed-copy"><strong>${event.title}</strong><span>${event.text}</span></span><span class="feed-time">Buka</span></button>`).join("")}</div></section>`;
  }

  function reportPanel() {
    return `<section class="panel"><div class="panel-head"><div><h2 class="panel-title">Laporan terbaru</h2><p class="panel-subtitle">Data demo dan laporan browser ini</p></div><button class="text-button" data-view="citizen-report">Semua laporan ${icon("arrow")}</button></div><div class="incident-list report-list" id="overview-reports"></div></section>`;
  }

  function renderOverview(view) {
    const now = new Date();
    const actions = `<time class="date-stamp" id="local-clock" datetime="${now.toISOString()}">${dateText(now)}</time><button class="button button-primary" data-action="report">${icon("plus")} Buat laporan</button>`;
    view.innerHTML = heading(
      "RINGKASAN KOTA · DEMO",
      "Kota yang terasa lebih terhubung.",
      "Jelajahi simulasi layanan Bandar Lampung. Belum terhubung ke sensor atau sistem pemerintah langsung.",
      actions,
    ) + statsMarkup() + roadMapPanel(true) + `<div class="overview-grid">${activityPanel()}${reportPanel()}</div>`;
    renderReportRows(view.querySelector("#overview-reports"), getAllReports().slice(0, 3));
    initRoadMap();

    clearInterval(clockInterval);
    clockInterval = setInterval(() => {
      const clock = document.getElementById("local-clock");
      if (!clock) return;
      const current = new Date();
      clock.dateTime = current.toISOString();
      clock.textContent = dateText(current);
    }, 30000);
  }

  Sora.dashboard = { renderOverview };
})();
