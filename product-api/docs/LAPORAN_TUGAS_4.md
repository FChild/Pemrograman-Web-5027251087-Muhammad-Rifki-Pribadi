# Laporan Pengujian Tugas 4

Nama: Muhammad Rifki Pribadi — NRP: 5027251087.

## Hasil yang sudah dijalankan

| Pemeriksaan | Hasil | Bukti |
|---|---|---|
| Build Vite + Tailwind | Berhasil | Jalankan ulang `npm run build` |
| API Express + Prisma + SQLite sementara | 30/30 lulus | [Hasil API](evidence/tugas-4/automated-test-results.json) |
| React Testing Library + JSDOM + HTTP + SQLite sementara | 29/29 lulus | [Hasil komponen](evidence/tugas-4/component-test-results.json) |
| Perubahan database POST/PUT/DELETE | Terekam sebelum dan sesudah | [API](evidence/tugas-4/database-before-after.json), [komponen](evidence/tugas-4/component-database-before-after.json) |
| Browser Chromium/Playwright | Terblokir oleh lingkungan: socket Operation not permitted | Belum ada bukti visual baru |

Waktu eksekusi tercatat pada `executedAt` di berkas hasil. Pengujian tidak mengubah database pengguna. Test komponen memeriksa detail dua ID, ID hilang/invalid, 404 dan navigasi kembali, perubahan Grid/List, penyimpanan preferensi, serta alur CRUD dalam mode List. Pengujian API juga memeriksa validasi dan persistensi data.

JSDOM bukan browser visual. Dialog dipolyfill; layout, focus trap, Escape, dan screenshot browser belum diverifikasi. Respons HTTP untuk halaman SPA adalah 200 agar React dapat merender halaman 404; API yang tidak ditemukan tetap mengembalikan HTTP 404.

## Bukti visual yang perlu dilengkapi

Ikuti [panduan Tugas 4](PANDUAN_TUGAS_4.md). Ambil screenshot asli daftar Grid, tambah/edit/hapus, detail dua ID yang berbeda, produk tidak ditemukan, halaman tidak ditemukan, Settings List dan daftar List, lalu Settings Grid dan daftar Grid. Tunjukkan data sebelum/sesudah di database untuk CRUD bila diminta dosen.

Simpan screenshot baru di `docs/screenshots/tugas-4/`, lalu sertakan dalam PR. Empat PNG pada folder `docs/screenshots/` berasal dari ZIP pengguna dan dipertahankan sebagai bukti tugas sebelumnya; bukan bukti fitur Router/Settings.

## Menjalankan ulang

Dari `product-api`, setelah instalasi dan generate Prisma:

```powershell
npm run build
npm test
npm run test:components
```

Opsional untuk browser dan screenshot otomatis:

```powershell
npx playwright install chromium
npm run test:ui
```

Periksa output aktual. Jangan menandai pemeriksaan browser lulus jika script gagal. Pengujian otomatis memakai database sementara dan tidak membutuhkan reset database asli.
