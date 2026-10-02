(() => {
  const { modules, navigationGroups, moduleFor, icon } = Sora;
  const { renderOverview } = Sora.dashboard;
  const { renderModules, renderModuleDetail } = Sora.services;
  const { renderMap } = Sora.map;
  const { renderNotifications } = Sora.notifications;
  const { renderReportView, openReportModal } = Sora.reports;
  let currentView = "overview";
  let toastTimeout;
  const navigation = document.getElementById("navigation");
  const view = document.getElementById("view");
  const notificationDot = document.querySelector(".notification-dot");
  const notificationReadKey = "laci-notifications-read";

  try {
    notificationDot.hidden =
      localStorage.getItem(notificationReadKey) === "true";
  } catch {
    notificationDot.hidden = false;
  }

  function renderNavigation() {
    navigation.innerHTML = navigationGroups
      .map(
        (group) =>
          `<div class="nav-label">${group.label}</div>${group.items.map((item) => `<button class="nav-item ${currentView === item.id ? "active" : ""}" data-view="${item.id}" ${currentView === item.id ? 'aria-current="page"' : ""}>${icon(item.icon, "icon")}<span class="nav-text">${item.label}</span>${item.id === "citizen-report" ? '<span class="nav-count">28</span>' : ""}</button>`).join("")}`,
      )
      .join("");
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.querySelector("span").textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.hidden = true;
    }, 3000);
  }

  function navigate(id) {
    if (id === "modules") currentView = "modules";
    else if (
      id === "overview" ||
      id === "city-map" ||
      id === "notifications" ||
      id === "citizen-report"
    )
      currentView = id;
    else currentView = moduleFor(id) ? id : "overview";
    document.getElementById("breadcrumb").textContent =
      currentView === "overview"
        ? "Ringkasan kota"
        : currentView === "modules"
          ? "Semua layanan"
          : currentView === "city-map"
            ? "Peta kota"
            : currentView === "notifications"
              ? "Notifikasi"
              : currentView === "citizen-report"
                ? "Laporan warga"
                : moduleFor(currentView).label;
    renderNavigation();
    if (currentView === "overview") renderOverview(view);
    else if (currentView === "modules") renderModules(view);
    else if (currentView === "city-map") renderMap(view);
    else if (currentView === "notifications") renderNotifications(view);
    else if (currentView === "citizen-report") renderReportView(view);
    else renderModuleDetail(moduleFor(currentView), view);
    document.body.classList.remove("menu-open");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  document.addEventListener("click", (event) => {
    const viewTarget = event.target.closest("[data-view]");
    if (viewTarget) {
      navigate(viewTarget.dataset.view);
      return;
    }
    const actionTarget = event.target.closest("[data-action]");
    if (actionTarget) {
      if (actionTarget.dataset.action === "report") openReportModal();
      if (actionTarget.dataset.action === "close-modal")
        document.getElementById("modal-root").innerHTML = "";
      if (actionTarget.dataset.action === "read-notifications") {
        try {
          localStorage.setItem(notificationReadKey, "true");
          notificationDot.hidden = true;
          showToast("Semua notifikasi ditandai sudah dibaca.");
        } catch {
          showToast("Status baca tidak dapat disimpan di browser ini.");
        }
      }
    }
    if (event.target.matches('[data-dismiss="modal"]'))
      document.getElementById("modal-root").innerHTML = "";
    if (event.target.closest("#notification-button")) navigate("notifications");
    if (event.target.closest("#menu-toggle"))
      document.body.classList.toggle("menu-open");
    if (
      document.body.classList.contains("menu-open") &&
      !event.target.closest(".sidebar") &&
      !event.target.closest("#menu-toggle")
    )
      document.body.classList.remove("menu-open");
    const toggle = event.target.closest(".toggle");
    if (toggle) {
      const isOn = toggle.getAttribute("aria-checked") === "true";
      toggle.setAttribute("aria-checked", String(!isOn));
      showToast(
        `${toggle.getAttribute("aria-label")} ${isOn ? "dinonaktifkan" : "diaktifkan"}.`,
      );
    }
  });

  document.addEventListener("submit", (event) => {
    if (event.target.id !== "report-form") return;
    event.preventDefault();
    const location = document.getElementById("report-location").value.trim();
    const coordinates = document.getElementById("report-coordinates").value;
    if (!location && !coordinates) {
      document.getElementById("report-map-status").textContent =
        "Isi alamat atau pilih titik lokasi pada peta.";
      document.getElementById("report-location").focus();
      return;
    }
    const report = {
      category: document.getElementById("report-category").value,
      location,
      coordinates,
      description: document.getElementById("report-description").value.trim(),
    };
    if (!Sora.reports.saveReport(report)) {
      showToast(
        "Laporan gagal disimpan di browser ini. Periksa ruang penyimpanan.",
      );
      return;
    }
    document.getElementById("modal-root").innerHTML = "";
    const reportLocation = location || `titik terpilih (${coordinates})`;
    const selectedCoordinates =
      location && coordinates ? ` · Pin: ${coordinates}` : "";
    showToast(
      `Laporan untuk ${reportLocation}${selectedCoordinates} berhasil dikirim.`,
    );
    if (currentView === "citizen-report") renderReportView(view);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.getElementById("modal-root").innerHTML = "";
      document.body.classList.remove("menu-open");
    }
  });

  renderNavigation();
  navigate(
    new URLSearchParams(window.location.search).get("view") || "overview",
  );
})();
