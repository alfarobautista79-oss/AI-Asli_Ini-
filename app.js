(() => {
  const { modules, navigationGroups, moduleFor, icon } = Sora;
  const { renderOverview } = Sora.dashboard;
  const { renderModules, renderModuleDetail } = Sora.services;
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
          `<div class="nav-label">${group.label}</div>${group.items.map((item) => `<button class="nav-item ${currentView === item.id ? "active" : ""}" data-view="${item.id}" ${currentView === item.id ? 'aria-current="page"' : ""}>${icon(item.icon, "icon")}<span class="nav-text">${item.label}</span>${item.id === "citizen-report" ? `<span class="nav-count">${Sora.reports.getAllReports().length}</span>` : ""}</button>`).join("")}`,
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
          : currentView === "notifications"
              ? "Notifikasi"
              : currentView === "citizen-report"
                ? "Laporan warga"
                : moduleFor(currentView).label;
    renderNavigation();
    if (currentView === "overview") renderOverview(view);
    else if (currentView === "modules") renderModules(view);
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
      if (actionTarget.dataset.action === "toggle-monitor") {
        const moduleId = actionTarget.dataset.moduleId;
        const isActive = actionTarget.getAttribute("aria-pressed") === "true";
        try {
          const key = "laci-demo-monitoring";
          const states = JSON.parse(localStorage.getItem(key) || "{}");
          states[moduleId] = !isActive;
          localStorage.setItem(key, JSON.stringify(states));
          actionTarget.setAttribute("aria-pressed", String(!isActive));
          actionTarget.classList.toggle("button-primary", !isActive);
          actionTarget.innerHTML = `${icon("check")} ${!isActive ? "Pemantauan aktif" : "Aktifkan pemantauan"}`;
          const monitorSummary = document.querySelector(".monitor-summary");
          if (monitorSummary) {
            monitorSummary.querySelector(".monitor-light").classList.toggle("is-on", !isActive);
            monitorSummary.querySelector("strong").textContent = !isActive
              ? "Pemantauan diaktifkan"
              : "Pemantauan dijeda";
          }
          showToast(`${moduleFor(moduleId).label}: ${!isActive ? "pemantauan diaktifkan" : "pemantauan dijeda"}.`);
        } catch {
          showToast("Status pemantauan tidak dapat disimpan di browser ini.");
        }
      }
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

  document.addEventListener("submit", async (event) => {
    if (event.target.id !== "report-form") return;
    event.preventDefault();
    const location = document.getElementById("report-location").value.trim();
    if (!location) {
      document.getElementById("report-location").focus();
      return;
    }
    const photoInput = document.getElementById("report-photo");
    const photoFile = photoInput.files[0];
    let photo = "";
    if (photoFile) {
      if (photoFile.size > 750 * 1024) {
        showToast("Ukuran foto maksimal 750 KB.");
        return;
      }
      try {
        photo = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(photoFile);
        });
      } catch {
        showToast("Foto tidak dapat dibaca. Coba pilih foto lain.");
        return;
      }
    }
    const report = {
      category: document.getElementById("report-category").value,
      location,
      description: document.getElementById("report-description").value.trim(),
      photo,
      status: "Menunggu verifikasi",
    };
    if (!Sora.reports.saveReport(report)) {
      showToast(
        "Laporan gagal disimpan di browser ini. Periksa ruang penyimpanan.",
      );
      return;
    }
    document.getElementById("modal-root").innerHTML = "";
    showToast(`Laporan untuk ${location} berhasil disimpan di browser ini.`);
    renderNavigation();
    if (currentView === "citizen-report") renderReportView(view);
    else if (currentView === "overview") renderOverview(view);
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
