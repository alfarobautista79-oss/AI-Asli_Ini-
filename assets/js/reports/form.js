(() => {
  const { icon } = Sora;
  const maxPhotoBytes = 750 * 1024;

  function openReportModal() {
    const modalRoot = document.getElementById("modal-root");
    modalRoot.innerHTML = `
      <div class="overlay" data-dismiss="modal">
        <section class="modal report-modal" role="dialog" aria-modal="true" aria-labelledby="report-title">
          <div class="modal-head">
            <div>
              <h2 id="report-title">Buat laporan warga</h2>
              <p>Isi lokasi dan kronologi. Foto bersifat opsional.</p>
            </div>
            <button class="modal-close" data-action="close-modal" aria-label="Tutup">${icon("close")}</button>
          </div>
          <form id="report-form">
            <div class="form-grid">
              <div class="field">
                <label for="report-category">Kategori</label>
                <select id="report-category" required>
                  <option value="">Pilih kategori</option>
                  <option>Infrastruktur jalan</option>
                  <option>Kebersihan lingkungan</option>
                  <option>Drainase dan banjir</option>
                  <option>Lingkungan</option>
                  <option>Lainnya</option>
                </select>
              </div>
              <div class="field">
                <label for="report-location">Lokasi / alamat</label>
                <input id="report-location" name="location" required placeholder="Contoh: Jl. Teuku Umar, Bandar Lampung" />
              </div>
              <div class="field full">
                <label for="report-description">Deskripsi</label>
                <textarea id="report-description" required placeholder="Ceritakan masalah yang ditemukan..."></textarea>
              </div>
              <div class="field full">
                <label for="report-photo">Foto laporan (opsional, maksimal 750 KB)</label>
                <input id="report-photo" name="photo" type="file" accept="image/*" />
                <span class="field-help">Format gambar umum seperti JPG, PNG, atau WebP.</span>
                <img id="report-photo-preview" class="report-photo-preview" alt="Pratinjau foto laporan" hidden />
              </div>
            </div>
            <div class="modal-actions">
              <button class="button" type="button" data-action="close-modal">Batal</button>
              <button class="button button-primary" type="submit">${icon("plus")} Simpan laporan</button>
            </div>
          </form>
        </section>
      </div>
    `;

    const photoInput = document.getElementById("report-photo");
    const preview = document.getElementById("report-photo-preview");
    const photoHelp = photoInput.parentElement.querySelector(".field-help");
    photoInput.addEventListener("change", () => {
      const file = photoInput.files[0];
      photoHelp.classList.remove("field-error");
      photoHelp.textContent = "Format gambar umum seperti JPG, PNG, atau WebP.";
      if (!file) {
        preview.hidden = true;
        preview.removeAttribute("src");
        return;
      }
      if (!file.type.startsWith("image/") || file.size > maxPhotoBytes) {
        photoInput.value = "";
        preview.hidden = true;
        preview.removeAttribute("src");
        photoHelp.textContent = file.size > maxPhotoBytes
          ? "Ukuran foto maksimal 750 KB."
          : "File harus berupa gambar.";
        photoHelp.classList.add("field-error");
        return;
      }
      preview.src = URL.createObjectURL(file);
      preview.hidden = false;
    });
    document.getElementById("report-category").focus();
  }

  Sora.reportForm = { openReportModal };
})();
