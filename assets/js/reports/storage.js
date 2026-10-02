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

  function getAllReports() {
    return [...getSavedReports(), ...(Sora.demoReports || [])].sort(
      (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
    );
  }

  function saveReport(report) {
    const reports = getSavedReports();
    const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    reports.unshift({
      ...report,
      id,
      createdAt: new Date().toISOString(),
      demo: false,
    });

    try {
      localStorage.setItem(storageKey, JSON.stringify(reports.slice(0, 20)));
      return true;
    } catch {
      return false;
    }
  }

  Sora.reportStorage = { getSavedReports, getAllReports, saveReport };
})();
