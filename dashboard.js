(() => {
  const {
    icon,
    heading
  } = Sora;
  const {
    mapPanel,
    initMap
  } = Sora.map;
  let clockInterval;

  function statsMarkup() {
    const data = [{
      label: 'Kualitas udara',
      value: '42',
      suffix: 'AQI',
      delta: 'Baik',
      glyph: 'leaf',
      sub: 'Rata-rata 19 sensor kota'
    }, {
      label: 'Lalu lintas',
      value: '24',
      suffix: 'km/j',
      delta: '−8% padat',
      glyph: 'traffic',
      sub: 'Kecepatan rata-rata jalan utama',
      warn: true
    }, {
      label: 'Energi terpakai',
      value: '4,82',
      suffix: 'MW',
      delta: '−6,2%',
      glyph: 'bolt',
      sub: 'Dibandingkan minggu sebelumnya'
    }, {
      label: 'Laporan warga',
      value: '28',
      suffix: 'baru',
      delta: '9 hari ini',
      glyph: 'pin',
      sub: '19 sedang ditangani',
      warn: true
    }];
    return `<div class="stats">${data.map((item) => `<article class="stat"><div class="stat-top"><span>${item.label}</span><span class="stat-icon">${icon(item.glyph)}</span></div><div class="stat-value-row"><strong class="stat-value">${item.value}</strong><span class="stat-delta ${item.warn ? 'warn' : ''}">${item.suffix} · ${item.delta}</span></div><div class="stat-sub">${item.sub}</div></article>`).join('')}</div>`;
  }

  function feedPanel() {
    const events = [{
      icon: 'cloud',
      title: 'Peringatan hujan lokal',
      text: 'Tanjung Karang · hujan sedang terdeteksi',
      time: '3 mnt',
      tone: 'warn'
    }, {
      icon: 'bus',
      title: 'Bus Trans Bandar Lampung tiba',
      text: 'Halte Rajabasa · koridor kota',
      time: '8 mnt',
      tone: 'blue'
    }, {
      icon: 'lamp',
      title: 'Lampu jalan diperbaiki',
      text: 'Jl. ZA Pagar Alam · tim teknis di lokasi',
      time: '21 mnt',
      tone: ''
    }, {
      icon: 'pin',
      title: 'Laporan jalan rusak',
      text: 'Jl. Teuku Umar · menunggu verifikasi',
      time: '34 mnt',
      tone: 'warn'
    }];
    return `<section class="panel feed-panel"><div class="panel-head"><div><h2 class="panel-title">Aktivitas kota</h2><p class="panel-subtitle">Pembaruan dari seluruh layanan</p></div><button class="icon-button" data-view="notifications" aria-label="Lihat semua aktivitas">${icon('arrow')}</button></div><div class="feed-list">${events.map((event) => `<div class="feed-item"><span class="feed-icon ${event.tone}">${icon(event.icon)}</span><div class="feed-copy"><strong>${event.title}</strong><span>${event.text}</span></div><time class="feed-time">${event.time}</time></div>`).join('')}</div><div class="feed-footer"><button class="text-button" data-view="notifications">Semua notifikasi ${icon('arrow')}</button></div></section>`;
  }

  function lowerPanels() {
    return `<div class="lower-grid"><section class="panel"><div class="panel-head"><div><h2 class="panel-title">Energi kota</h2><p class="panel-subtitle">Konsumsi fasilitas publik hari ini</p></div><button class="text-button" data-view="smart-energy">Detail ${icon('arrow')}</button></div><div class="energy-content"><div class="energy-score"><div class="energy-score-inner"><strong>78</strong><span>efisiensi</span></div></div><div class="energy-details"><div class="energy-total">4,82 <small>MW terpakai</small></div><p>Turun 6,2% dibanding minggu lalu</p><div class="bar-line"><span></span><span></span><span></span></div><div class="bar-labels"><span>Gedung 47%</span><span>Lampu 31%</span><span>Lainnya 22%</span></div></div></div></section><section class="panel"><div class="panel-head"><div><h2 class="panel-title">Laporan prioritas</h2><p class="panel-subtitle">Butuh tindak lanjut petugas</p></div><button class="text-button" data-view="citizen-report">Semua laporan ${icon('arrow')}</button></div><div class="incident-list"><div class="incident"><div class="incident-main"><i class="incident-color"></i><div><strong>Jalan berlubang</strong><span>Jl. Teuku Umar · 34 menit lalu</span></div></div><span class="status-pill">Baru</span></div><div class="incident"><div class="incident-main"><i class="incident-color amber"></i><div><strong>Tempat sampah penuh</strong><span>Tugu Adipura · 1 jam lalu · Kebersihan</span></div></div><span class="status-pill progress">Diproses</span></div><div class="incident"><div class="incident-main"><i class="incident-color green"></i><div><strong>Lampu jalan mati</strong><span>Jl. ZA Pagar Alam · 2 jam lalu</span></div></div><span class="status-pill done">Selesai</span></div></div></section></div>`;
  }

  function renderOverview(view) {
    const currentDate = new Date();
    const localizedDate = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(currentDate);
    const localizedTime = new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).format(currentDate);
    const actions = `<span class="date-stamp">${icon('calendar')} ${localizedDate}<span aria-hidden="true">·</span>${icon('clock')} <time id="local-clock">${localizedTime}</time></span><button class="button button-primary" data-action="report">${icon('plus')} Buat laporan</button>`;
    view.innerHTML = heading(localizedDate.toLocaleUpperCase('id-ID'), 'Kota yang terasa lebih terhubung.', 'Pantau kondisi Bandar Lampung dan respons kota hari ini. <span class="demo-note">Data indikator pada prototipe ini adalah simulasi, bukan data sensor langsung.</span>', actions) + statsMarkup() + `<div class="dashboard-grid">${mapPanel()}${feedPanel()}</div>` + lowerPanels();
    clearInterval(clockInterval);
    clockInterval = setInterval(() => {
      const clock = document.getElementById('local-clock');
      if (clock) clock.textContent = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
      }).format(new Date());
    }, 30000);
    initMap();
  }
  Sora.dashboard = {
    renderOverview
  };
})();
