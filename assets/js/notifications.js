(() => {
  const {
    icon,
    heading
  } = Sora;
  function renderNotifications(view) {
    const rows = [
      ['warn', 'cloud', 'Peringatan hujan lokal', 'Tanjung Karang · Intensitas hujan sedang terdeteksi. Pengguna jalan diimbau berhati-hati.', '3 menit lalu'],
      ['blue', 'bus', 'Bus Trans Bandar Lampung mendekati halte', 'Halte Rajabasa · Kendaraan diperkirakan tiba dalam 4 menit.', '8 menit lalu'],
      ['', 'lamp', 'Lampu jalan kembali beroperasi', 'Jl. ZA Pagar Alam · Tim teknis telah menyelesaikan perbaikan lampu jalan.', '21 menit lalu'],
      ['warn', 'pin', 'Laporan baru menunggu verifikasi', 'Jl. Teuku Umar · Laporan jalan berlubang telah diterima dari warga.', '34 menit lalu'],
      ['', 'bolt', 'Konsumsi energi menurun', 'Kota Bandar Lampung · Konsumsi listrik fasilitas publik turun 6,2% dibanding minggu lalu.', '1 jam lalu']
    ];
    view.innerHTML = heading('PEMBARUAN KOTA', 'Notifikasi.', 'Contoh peringatan dan pembaruan untuk simulasi layanan Lampung.', `<button class="button" data-action="read-notifications">${icon('check')} Tandai dibaca</button>`) + `<section class="panel"><div class="notification-list">${rows.map(([tone, glyph, title, description, time]) => `<article class="notification-row"><span class="feed-icon ${tone}">${icon(glyph)}</span><div><h2>${title}</h2><p>${description}</p></div><time>${time}</time></article>`).join('')}</div></section>`;
  }
  Sora.notifications = {
    renderNotifications
  };
})();
