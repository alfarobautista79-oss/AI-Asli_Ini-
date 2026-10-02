(() => {
  const { icon, heading } = Sora;
  const { appendSavedReports, getSavedReports, saveReport } =
    Sora.reportStorage;
  const { openReportModal } = Sora.reportForm;

  const reportStats = [
    {
      label: "Perlu tindak lanjut",
      icon: "clock",
      value: "28",
      change: "9 laporan baru",
      changeClass: "warn",
      summary: "Laporan yang menunggu petugas",
    },
    {
      label: "Terselesaikan bulan ini",
      icon: "check",
      value: "74%",
      change: "+12%",
      summary: "Dari seluruh laporan yang masuk",
    },
    {
      label: "Waktu respons rata-rata",
      icon: "clock",
      value: "3,2",
      change: "jam",
      summary: "Turun 18% dari bulan lalu",
    },
    {
      label: "Partisipasi warga",
      icon: "pin",
      value: "1.482",
      change: "+8,4%",
      summary: "Warga aktif melaporkan",
    },
  ];

  const recentReports = [
    {
      title: "Jalan berlubang",
      details: "Jl. Teuku Umar · 34 menit lalu · Infrastruktur",
      status: "Menunggu verifikasi",
      tone: "",
    },
    {
      title: "Tempat sampah penuh",
      details: "Tugu Adipura · 1 jam lalu · Kebersihan",
      status: "Sedang diproses",
      tone: "amber",
      statusClass: "progress",
    },
    {
      title: "Lampu jalan mati",
      details: "Jl. ZA Pagar Alam · 2 jam lalu · Penerangan",
      status: "Selesai",
      tone: "green",
      statusClass: "done",
    },
    {
      title: "Saluran air tersumbat",
      details: "Rajabasa · 3 jam lalu · Drainase",
      status: "Petugas menuju lokasi",
      tone: "amber",
      statusClass: "progress",
    },
    {
      title: "Pohon tumbang",
      details: "Jl. Sukaraja · 5 jam lalu · Lingkungan",
      status: "Selesai",
      tone: "green",
      statusClass: "done",
    },
  ];

  function renderStatCard(stat) {
    return `
      <article class="stat">
        <div class="stat-top">
          <span>${stat.label}</span>
          <span class="stat-icon">${icon(stat.icon)}</span>
        </div>
        <div class="stat-value-row">
          <strong class="stat-value">${stat.value}</strong>
          <span class="stat-delta ${stat.changeClass || ""}">${stat.change}</span>
        </div>
        <div class="stat-sub">${stat.summary}</div>
      </article>
    `;
  }

  function renderRecentReport(report) {
    return `
      <div class="incident">
        <div class="incident-main">
          <i class="incident-color ${report.tone || ""}"></i>
          <div>
            <strong>${report.title}</strong>
            <span>${report.details}</span>
          </div>
        </div>
        <span class="status-pill ${report.statusClass || ""}">${report.status}</span>
      </div>
    `;
  }

  function renderReportView(view) {
    const actions = `
      <button class="button button-primary" data-action="report">
        ${icon("plus")} Buat laporan
      </button>
    `;
    const stats = reportStats.map(renderStatCard).join("");
    const reports = recentReports.map(renderRecentReport).join("");

    view.innerHTML = `
      ${heading(
        "SUARA WARGA",
        "Laporan warga.",
        "Masalah lingkungan sekitar menjadi lebih mudah ditindaklanjuti.",
        actions,
      )}
      <div class="stats">${stats}</div>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Laporan terbaru</h2>
            <p class="panel-subtitle">Status penanganan laporan warga</p>
          </div>
          <button class="button" data-action="report">
            ${icon("plus")} Buat laporan
          </button>
        </div>
        <div class="incident-list">${reports}</div>
      </section>
    `;

    view.querySelector(".heading-note").textContent =
      "Statistik merupakan simulasi. Laporan baru disimpan lokal di browser ini.";
    appendSavedReports(view);
  }

  Sora.reports = {
    renderReportView,
    openReportModal,
    getSavedReports,
    saveReport,
  };
})();
