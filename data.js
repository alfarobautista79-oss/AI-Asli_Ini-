window.Sora = window.Sora || {};

Sora.modules = [{
  id: 'smart-home',
  label: 'Smart Home',
  icon: 'home',
  group: 'Perangkat',
  description: 'Kontrol perangkat rumah: lampu, AC, kamera, dan pintu otomatis.',
  metric: '1.284',
  unit: 'perangkat terhubung',
  status: '92% aktif',
  values: [42, 57, 48, 68, 61, 77, 70],
  kpis: ['1.284', '92%', '18'],
  captions: ['Terhubung', 'Ketersediaan', 'Butuh perhatian']
}, {
  id: 'smart-traffic',
  label: 'Smart Traffic',
  icon: 'traffic',
  group: 'Mobilitas',
  description: 'Pantau kepadatan jalan dan temukan rute alternatif.',
  metric: '12 titik',
  unit: 'kemacetan terpantau',
  status: '3 perlu perhatian',
  alert: true,
  values: [32, 47, 41, 78, 65, 90, 59],
  kpis: ['12', '24 km/j', '4'],
  captions: ['Titik padat', 'Kecepatan rata-rata', 'Rute alternatif']
}, {
  id: 'smart-transport',
  label: 'Smart Transportation',
  icon: 'bus',
  group: 'Mobilitas',
  description: 'Jadwal bus, posisi kendaraan, dan halte terdekat dalam satu tampilan.',
  metric: '148 bus',
  unit: 'beroperasi hari ini',
  status: '12 rute aktif',
  values: [48, 62, 70, 55, 79, 68, 82],
  kpis: ['148', '12', '6 mnt'],
  captions: ['Bus aktif', 'Rute berjalan', 'Waktu tunggu']
}, {
  id: 'smart-waste',
  label: 'Smart Waste',
  icon: 'trash',
  group: 'Lingkungan',
  description: 'Pantau kapasitas tempat sampah dan jadwal pengangkutan.',
  metric: '86%',
  unit: 'pengangkutan terjadwal',
  status: '7 titik perlu dijemput',
  alert: true,
  values: [55, 43, 62, 50, 76, 59, 71],
  kpis: ['86%', '214', '7'],
  captions: ['Jadwal terpenuhi', 'Titik terpantau', 'Kapasitas penuh']
}, {
  id: 'street-light',
  label: 'Smart Street Light',
  icon: 'lamp',
  group: 'Lingkungan',
  description: 'Lampu jalan menyesuaikan intensitas dengan cahaya sekitar.',
  metric: '3.842',
  unit: 'lampu terkoneksi',
  status: '97% beroperasi',
  values: [28, 37, 53, 68, 82, 75, 60],
  kpis: ['3.842', '97%', '31%'],
  captions: ['Lampu terkoneksi', 'Kondisi baik', 'Hemat energi']
}, {
  id: 'green-city',
  label: 'Smart Green City',
  icon: 'leaf',
  group: 'Lingkungan',
  description: 'Pantau kualitas udara, suhu, dan kesehatan ruang hijau kota.',
  metric: 'AQI 42',
  unit: 'kualitas udara baik',
  status: '19 sensor online',
  values: [74, 71, 69, 58, 54, 47, 42],
  kpis: ['42', '26°C', '34%'],
  captions: ['Indeks udara', 'Suhu rata-rata', 'Ruang hijau']
}, {
  id: 'smart-water',
  label: 'Smart Water',
  icon: 'drop',
  group: 'Lingkungan',
  description: 'Monitoring konsumsi air dan deteksi kebocoran lebih dini.',
  metric: '−8,4%',
  unit: 'konsumsi vs. bulan lalu',
  status: '2 anomali aliran',
  alert: true,
  values: [70, 63, 72, 59, 53, 49, 44],
  kpis: ['−8,4%', '2', '98%'],
  captions: ['Konsumsi bulanan', 'Anomali terdeteksi', 'Jaringan normal']
}, {
  id: 'smart-energy',
  label: 'Smart Energy',
  icon: 'bolt',
  group: 'Lingkungan',
  description: 'Pantau konsumsi listrik fasilitas umum dan potensi penghematan.',
  metric: '4,82 MW',
  unit: 'konsumsi listrik saat ini',
  status: 'Efisiensi 78%',
  values: [54, 60, 55, 72, 64, 79, 67],
  kpis: ['4,82 MW', '78%', '−6,2%'],
  captions: ['Konsumsi saat ini', 'Skor efisiensi', 'Vs. bulan lalu']
}, {
  id: 'smart-security',
  label: 'Smart Security',
  icon: 'shield',
  group: 'Keamanan',
  description: 'Keamanan kota dengan CCTV, tombol darurat, dan laporan kejadian.',
  metric: '326 CCTV',
  unit: 'kamera aktif',
  status: '1 laporan prioritas',
  alert: true,
  values: [87, 89, 82, 90, 85, 94, 92],
  kpis: ['326', '24/7', '1'],
  captions: ['Kamera aktif', 'Pusat pantau', 'Insiden prioritas']
}, {
  id: 'citizen-report',
  label: 'Citizen Report',
  icon: 'pin',
  group: 'Keamanan',
  description: 'Saluran warga untuk melaporkan masalah di lingkungan sekitar.',
  metric: '28 laporan',
  unit: 'menunggu tindak lanjut',
  status: '74% terselesaikan',
  values: [46, 52, 67, 61, 79, 73, 86],
  kpis: ['28', '74%', '3,2 jam'],
  captions: ['Menunggu tindakan', 'Terselesaikan', 'Waktu respons']
}, {
  id: 'city-map',
  label: 'Smart City Map',
  icon: 'map',
  group: 'Kota',
  description: 'Peta fasilitas publik: rumah sakit, halte, taman, dan kantor pemerintahan.',
  metric: '486 titik',
  unit: 'fasilitas kota terpetakan',
  status: 'Data diperbarui hari ini',
  values: [52, 55, 62, 64, 70, 75, 82],
  kpis: ['486', '8 kategori', 'Hari ini'],
  captions: ['Lokasi terpetakan', 'Jenis fasilitas', 'Pembaruan']
}, {
  id: 'urban-dashboard',
  label: 'Urban Dashboard',
  icon: 'chart',
  group: 'Kota',
  description: 'Gambaran menyeluruh kondisi kota, dari lalu lintas hingga kualitas udara.',
  metric: '78 / 100',
  unit: 'indeks kota hari ini',
  status: 'Naik 4 poin minggu ini',
  values: [55, 58, 56, 65, 62, 73, 78],
  kpis: ['78', '+4', '15'],
  captions: ['Indeks kota', 'Perubahan mingguan', 'Modul terpantau']
}, {
  id: 'smart-parking',
  label: 'Smart Parking',
  icon: 'car',
  group: 'Mobilitas',
  description: 'Cari lokasi parkir dan cek slot yang tersedia secara langsung.',
  metric: '1.248',
  unit: 'slot parkir tersedia',
  status: '64 lokasi terpantau',
  values: [83, 77, 68, 61, 53, 45, 39],
  kpis: ['1.248', '64', '82%'],
  captions: ['Slot tersedia', 'Lokasi aktif', 'Akurasi data']
}, {
  id: 'flood-monitoring',
  label: 'Flood Monitoring',
  icon: 'cloud',
  group: 'Lingkungan',
  description: 'Pantau ketinggian air dan terima peringatan dini di area rawan.',
  metric: 'Aman',
  unit: 'status siaga banjir',
  status: '2 sensor perlu dipantau',
  values: [28, 31, 29, 36, 32, 27, 25],
  kpis: ['Aman', '18', '2'],
  captions: ['Status kota', 'Sensor aktif', 'Perlu dipantau']
}, {
  id: 'smart-notification',
  label: 'Smart Notification',
  icon: 'bell',
  group: 'Keamanan',
  description: 'Peringatan kota untuk banjir, cuaca ekstrem, dan kemacetan.',
  metric: '3 aktif',
  unit: 'notifikasi prioritas',
  status: 'Dikirim ke 12.480 warga',
  alert: true,
  values: [28, 36, 42, 30, 57, 45, 38],
  kpis: ['3', '12.480', '98%'],
  captions: ['Peringatan aktif', 'Penerima', 'Terkirim']
}];

Sora.navigationGroups = [{
  label: 'KOTA',
  items: [{
    id: 'overview',
    label: 'Ringkasan kota',
    icon: 'grid'
  }, {
    id: 'city-map',
    label: 'Peta kota',
    icon: 'map'
  }]
}, {
  label: 'LAYANAN PINTAR',
  items: Sora.modules
    .slice(0, 9)
    .map(({
      id,
      label,
      icon: glyph
    }) => ({
      id,
      label,
      icon: glyph
    }))
}, {
  label: 'RUANG WARGA',
  items: Sora.modules
    .slice(9)
    .map(({
      id,
      label,
      icon: glyph
    }) => ({
      id,
      label,
      icon: glyph
    }))
}];

Sora.moduleFor = (id) => Sora.modules.find((item) => item.id === id);
