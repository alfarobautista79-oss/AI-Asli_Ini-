(() => {
  const { icon, heading } = Sora;
  const { getAllReports, saveReport } = Sora.reportStorage;
  const { openReportModal } = Sora.reportForm;

  function formatDate(date) {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

  function createReportRow(report) {
    const row = document.createElement("article");
    row.className = "incident report-item";

    const main = document.createElement("div");
    main.className = "incident-main";
    const indicator = document.createElement("i");
    indicator.className = `incident-color ${report.demo ? "amber" : "green"}`;

    const copy = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = report.title || report.category || "Laporan warga";
    const details = document.createElement("span");
    details.textContent = [report.location, formatDate(new Date(report.createdAt)), report.description]
      .filter(Boolean)
      .join(" · ");
    copy.append(title, details);
    main.append(indicator, copy);

    if (report.photo) {
      const photo = document.createElement("img");
      photo.className = "report-thumbnail";
      photo.src = report.photo;
      photo.alt = `Foto laporan ${title.textContent}`;
      photo.loading = "lazy";
      main.append(photo);
    }

    const status = document.createElement("span");
    status.className = `status-pill ${report.demo ? "progress" : ""}`;
    status.textContent = report.demo ? `Demo · ${report.status || "Contoh"}` : report.status || "Baru";
    row.append(main, status);
    if (report.location) {
      const route = document.createElement("a");
      route.className = "route-link report-route";
      route.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${report.location}, Bandar Lampung`)}`;
      route.target = "_blank";
      route.rel = "noopener noreferrer";
      route.textContent = "Buka arah di Google Maps";
      row.append(route);
    }
    return row;
  }

  function renderReportRows(container, reports = getAllReports()) {
    container.replaceChildren();
    if (!reports.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "Belum ada laporan. Buat laporan pertama untuk memulai.";
      container.append(empty);
      return;
    }
    reports.forEach((report) => container.append(createReportRow(report)));
  }

  function renderStat(label, value, summary, glyph) {
    return `<article class="stat"><div class="stat-top"><span>${label}</span><span class="stat-icon">${icon(glyph)}</span></div><div class="stat-value-row"><strong class="stat-value">${value}</strong></div><div class="stat-sub">${summary}</div></article>`;
  }

  function renderReportView(view) {
    const reports = getAllReports();
    const completed = reports.filter((report) => report.status === "Selesai").length;
    const pending = reports.length - completed;
    const demoCount = reports.filter((report) => report.demo).length;
    const actions = `<button class="button button-primary" data-action="report">${icon("plus")} Buat laporan</button>`;
    const stats = [
      renderStat("Perlu tindak lanjut", pending, "Termasuk laporan demo", "clock"),
      renderStat("Selesai", completed, "Status dari data laporan", "check"),
      renderStat("Laporan tercatat", reports.length, `${demoCount} contoh demo`, "pin"),
      renderStat("Lampiran foto", reports.filter((report) => report.photo).length, "Foto tersimpan lokal", "chart"),
    ].join("");

    view.innerHTML = `${heading(
      "RUANG WARGA",
      "Laporan warga.",
      "Daftar ini diambil dari laporan demo dan laporan yang dibuat pada browser ini.",
      actions,
    )}<div class="stats">${stats}</div><section class="panel"><div class="panel-head"><div><h2 class="panel-title">Laporan terbaru</h2><p class="panel-subtitle">Tanggal, status, lokasi, dan foto mengikuti data laporan.</p></div><time class="date-stamp" datetime="${new Date().toISOString()}">${formatDate(new Date())}</time></div><div class="incident-list report-list" id="report-list"></div></section>`;
    renderReportRows(view.querySelector("#report-list"), reports);
  }

  Sora.reports = { renderReportView, renderReportRows, getAllReports, saveReport, openReportModal };
})();
