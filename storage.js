(() => {
  const storageKey = "laci-citizen-reports";

  function getSavedReports() {
    try {
      const reports = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(reports) ? reports : [];
    } catch {
      return [];
    }
  }

  function saveReport(report) {
    const reports = getSavedReports();
    const id =
      globalThis.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    reports.unshift({ ...report, id, createdAt: new Date().toISOString() });

    try {
      localStorage.setItem(storageKey, JSON.stringify(reports.slice(0, 100)));
      return true;
    } catch {
      return false;
    }
  }

  function createSavedReportRow(report) {
    const row = document.createElement("div");
    row.className = "incident saved-report";

    const details = document.createElement("div");
    details.className = "incident-main";

    const indicator = document.createElement("i");
    indicator.className = "incident-color";

    const copy = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = report.category || "Laporan warga";

    const description = document.createElement("span");
    const location = report.location || `Pin ${report.coordinates}`;
    const date = new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(report.createdAt));
    const summary = [location, date, report.description].filter(Boolean);
    description.textContent = summary.join(" · ");

    copy.append(title, description);
    details.append(indicator, copy);

    const status = document.createElement("span");
    status.className = "status-pill";
    status.textContent = "Tersimpan";

    row.append(details, status);
    return row;
  }

  function appendSavedReports(view) {
    const reports = getSavedReports();
    if (!reports.length) return;

    const panel = document.createElement("section");
    panel.className = "panel saved-reports-panel";

    const header = document.createElement("div");
    header.className = "panel-head";
    header.innerHTML = `
      <div>
        <h2 class="panel-title">Laporan tersimpan di perangkat</h2>
        <p class="panel-subtitle">
          ${reports.length} laporan tersimpan secara lokal di browser ini
        </p>
      </div>
    `;

    const list = document.createElement("div");
    list.className = "incident-list";
    reports.forEach((report) => list.append(createSavedReportRow(report)));

    panel.append(header, list);
    view.append(panel);
  }

  Sora.reportStorage = {
    getSavedReports,
    saveReport,
    appendSavedReports,
  };
})();
