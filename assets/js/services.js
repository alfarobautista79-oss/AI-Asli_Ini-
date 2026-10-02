(() => {
  const {
    icon,
    heading
  } = Sora;
  const modules = Sora.modules;
  const {
    initMap
  } = Sora.map;

  function cardMarkup(item) {
    return `<article class="module-card"><div class="module-card-top"><span class="module-icon">${icon(item.icon)}</span><span class="module-status ${item.alert ? 'alert' : ''}">${item.status}</span></div><h2>${item.label}</h2><p>${item.description}</p><div class="module-card-foot"><span>${item.metric} · ${item.unit}</span><button class="module-card-action" data-view="${item.id}">Buka ${icon('arrow')}</button></div></article>`;
  }

  function renderModules(view) {
    const groups = [...new Set(modules.map((item) => item.group))];
    view.innerHTML = heading('PUSAT LAYANAN', 'Semua layanan kota.', '15 layanan terintegrasi dalam satu ruang kendali.', `<span class="date-stamp">${icon('check')} 12 layanan normal</span>`) + `<div class="modules-toolbar"><label class="search-box">${icon('search')}<input id="module-search" type="search" placeholder="Cari layanan kota..." aria-label="Cari layanan kota"></label><span class="date-stamp">${modules.length} modul aktif</span></div><div id="module-grid">${groups.map((group) => `<div class="eyebrow" style="margin:14px 0 9px">${group.toUpperCase()}</div><div class="module-grid">${modules.filter((item) => item.group === group).map(cardMarkup).join('')}</div>`).join('')}</div>`;
    document.getElementById('module-search').addEventListener('input', (event) => {
      const query = event.target.value.trim().toLocaleLowerCase('id');
      document.querySelectorAll('#module-grid .module-grid').forEach((grid) => {
        let visible = 0;
        grid.querySelectorAll('.module-card').forEach((card) => {
          const show = card.textContent.toLocaleLowerCase('id').includes(query);
          card.hidden = !show;
          visible += Number(show);
        });
        grid.previousElementSibling.hidden = visible === 0;
        grid.hidden = visible === 0;
      });
    });
  }

  function renderModuleDetail(item, view) {
    const actions = `<button class="button" data-view="modules">${icon('chevron')} Semua layanan</button>`;
    const bars = item.values.map((value, index) => `<div class="chart-column"><i class="chart-bar" style="height:${value}%"></i><span>${['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][index]}</span></div>`).join('');
    view.innerHTML = heading(item.group.toUpperCase(), item.label, item.description, actions) + `<div class="detail-layout"><section class="panel"><div class="detail-intro"><span class="module-icon">${icon(item.icon)}</span><div><h2>${item.label}</h2><p>${item.description}</p></div></div><div class="detail-body"><div class="detail-kpis">${item.kpis.map((value, index) => `<div class="detail-kpi"><span>${item.captions[index]}</span><strong>${value}</strong></div>`).join('')}</div><h3 class="detail-section-title">Tren pemantauan · 7 hari terakhir</h3><div class="detail-chart">${bars}</div><div class="map-caption" style="padding:12px 0 0"><span class="map-live">Lokasi contoh</span><span>Data simulasi prototipe</span></div></div></section><section class="panel"><div class="panel-head"><div><h2 class="panel-title">Kontrol layanan</h2><p class="panel-subtitle">Pengaturan simulasi perangkat</p></div></div><div style="padding:4px 15px">${deviceRows(item)}</div></section><section class="panel"><div class="panel-head"><div><h2 class="panel-title">Lokasi terpantau</h2><p class="panel-subtitle">Bandar Lampung, Lampung</p></div></div><div id="city-map" style="height:215px" aria-label="Peta interaktif area Kota Bandar Lampung"></div><div class="map-caption"><span class="map-live">Status simulasi</span><button class="text-button" data-view="city-map">Buka peta kota ${icon('arrow')}</button></div></section><section class="panel"><div class="panel-head"><div><h2 class="panel-title">Ringkasan operasional</h2><p class="panel-subtitle">Kondisi layanan saat ini</p></div></div><div class="incident-list"><div class="incident"><div class="incident-main"><i class="incident-color green"></i><div><strong>Status layanan</strong><span>${item.status}</span></div></div><span class="status-pill done">Aktif</span></div><div class="incident"><div class="incident-main"><i class="incident-color amber"></i><div><strong>Pembaruan data</strong><span>Sinkronisasi 2 menit lalu</span></div></div><span class="status-pill progress">Terkini</span></div><div class="incident"><div class="incident-main"><i class="incident-color green"></i><div><strong>Cakupan kota</strong><span>Wilayah Bandar Lampung</span></div></div><span class="status-pill done">Terpantau</span></div></div></section></div>`;
    initMap();
  }

  function deviceRows(item) {
    const names = item.id === 'smart-home' ? [
      ['Lampu ruang tamu', 'Rumah · Zona 04', true],
      ['Pendingin udara', 'Rumah · Zona 04', false],
      ['Kamera gerbang', 'Rumah · Zona 04', true],
      ['Pintu otomatis', 'Rumah · Zona 04', true]
    ] : item.id === 'street-light' ? [
      ['Lampu koridor Rajabasa', 'Sensor cahaya aktif · simulasi', true],
      ['Lampu Jl. ZA Pagar Alam', 'Jadwal otomatis · simulasi', true],
      ['Lampu taman kota', 'Mode hemat daya', false]
    ] : [
      ['Pemantauan otomatis', 'Data sensor simulasi', true],
      ['Peringatan layanan', 'Notifikasi prioritas diaktifkan', true],
      ['Distribusi data publik', 'Informasi untuk warga', false]
    ];
    return names.map(([name, sub, checked]) => `<div class="device-row"><div><strong>${name}</strong><span>${sub}</span></div><button class="toggle" role="switch" aria-checked="${checked}" aria-label="${name}"></button></div>`).join('');
  }
  Sora.services = {
    renderModules,
    renderModuleDetail
  };
})();
