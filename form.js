(() => {
  const { icon } = Sora;

  function openReportModal() {
    const modalRoot = document.getElementById("modal-root");
    modalRoot.innerHTML = `
      <div class="overlay" data-dismiss="modal">
        <section
          class="modal report-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-title"
        >
          <div class="modal-head">
            <div>
              <h2 id="report-title">Buat laporan warga</h2>
              <p>Laporkan masalah agar petugas kota dapat menindaklanjutinya.</p>
            </div>
            <button class="modal-close" data-action="close-modal" aria-label="Tutup">
              ${icon("close")}
            </button>
          </div>
          <form id="report-form">
            <div class="form-grid">
              <div class="field">
                <label for="report-category">Kategori</label>
                <select id="report-category" required>
                  <option value="">Pilih kategori</option>
                  <option>Infrastruktur jalan</option>
                  <option>Kebersihan lingkungan</option>
                  <option>Lampu jalan</option>
                  <option>Drainase dan banjir</option>
                  <option>Keamanan</option>
                  <option>Lainnya</option>
                </select>
              </div>
              <div class="field">
                <label for="report-location">Lokasi / alamat</label>
                <input
                  id="report-location"
                  placeholder="Isi alamat atau pilih pin di peta"
                />
              </div>
              <div class="field full">
                <label for="report-description">Deskripsi</label>
                <textarea
                  id="report-description"
                  required
                  placeholder="Ceritakan masalah yang ditemukan..."
                ></textarea>
              </div>
            </div>
            <div class="modal-actions">
              <button class="button" type="button" data-action="close-modal">
                Batal
              </button>
              <button class="button button-primary" type="submit">
                ${icon("plus")} Kirim laporan
              </button>
            </div>
          </form>
        </section>
      </div>
    `;

    addMapPickerField();
    initReportMapPicker();
    document.getElementById("report-category").focus();
  }

  function addMapPickerField() {
    const descriptionField = document
      .getElementById("report-description")
      .closest(".field");
    const mapField = document.createElement("div");
    mapField.className = "field full report-map-field";
    mapField.innerHTML = `
      <label for="report-picker-map">Pilih titik lokasi di peta</label>
      <div
        id="report-picker-map"
        role="application"
        aria-label="Pilih lokasi laporan pada peta Lampung"
      ></div>
      <span id="report-map-status" class="map-selection-status" aria-live="polite">
        Klik peta untuk memasang pin, atau geser pin untuk menyesuaikan.
      </span>
      <input id="report-coordinates" name="coordinates" type="hidden" />
    `;
    descriptionField.before(mapField);
  }

  function initReportMapPicker() {
    if (typeof L === "undefined") return;

    const lampungBounds = L.latLngBounds([-6.25, 103.35], [-3.65, 106.35]);
    const pickerMap = L.map("report-picker-map", {
      scrollWheelZoom: false,
      maxBounds: lampungBounds,
      maxBoundsViscosity: 0.9,
      minZoom: 7,
      maxZoom: 18,
    }).fitBounds(lampungBounds, {
      padding: [8, 8],
    });

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 19,
        attribution:
          "Tiles &copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors",
      },
    ).addTo(pickerMap);

    let selectedPin;
    const coordinateField = document.getElementById("report-coordinates");
    const status = document.getElementById("report-map-status");

    function updateSelection(latlng) {
      coordinateField.value = `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`;
      status.textContent = `Lokasi dipilih: ${coordinateField.value}`;
    }

    function placePin(latlng) {
      if (!lampungBounds.contains(latlng)) return;

      if (selectedPin) {
        selectedPin.setLatLng(latlng);
      } else {
        selectedPin = L.marker(latlng, { draggable: true }).addTo(pickerMap);
        selectedPin.on("dragend", () =>
          updateSelection(selectedPin.getLatLng()),
        );
      }

      updateSelection(latlng);
    }

    pickerMap.on("click", (event) => placePin(event.latlng));
    requestAnimationFrame(() => pickerMap.invalidateSize());
  }

  Sora.reportForm = { openReportModal };
})();
