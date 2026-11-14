# Laporan Evidence Tugas 3 — Manajemen Produk

**Nama:** Muhammad Rifki Pribadi  
**NRP:** 5027251087  
**Repository:** BELUM DIISI.  
**Pull Request:** BELUM DIBUAT.  
**Waktu pengujian komponen:** 14-11-2026 20:04 WIB.

## 1. Ringkasan pekerjaan

Project API sebelumnya ditambahkan frontend React sesuai gambar tugas. Halaman utama menampilkan produk sebagai kartu dengan ID, nama, harga rupiah, serta tombol Edit dan Hapus. Pencarian memfilter nama produk. Tambah dan Edit menggunakan form pop-up; Hapus menampilkan konfirmasi sebelum mengirim DELETE.

State dikelola melalui React hooks. Handler diteruskan dari parent ke child melalui props. Event klik atau submit memanggil fungsi saat interaksi, bukan saat render. Frontend terhubung ke Express dan Prisma, sehingga perubahan disimpan ke SQLite. PUT tetap menggunakan ID pada body JSON sesuai tugas API sebelumnya.

Harga harus lebih dari 0 di frontend dan backend, mengikuti teks pada gambar. Data awal lama dipertahankan; seed menambahkan produk contoh tanpa menimpa record dengan ID yang sudah ada.

## 2. Hasil yang benar-benar sudah diuji

| Jenis verifikasi | Hasil | Batas verifikasi |
|---|---|---|
| Build React dengan Vite | Berhasil | Memeriksa build, bukan tampilan piksel |
| Integrasi API | 30/30 lulus | HTTP nyata, database sementara, restart proses, seed ulang |
| Interaksi React dengan JSDOM | 18/18 lulus | Handler dan DOM, terhubung ke API/SQLite nyata; bukan browser visual |
| Collection Postman melalui Newman | 28 request, 38 assertion lulus | Eksekusi CLI, bukan screenshot Postman |
| Browser Chromium/Playwright | Belum berhasil dijalankan | Chromium diblokir lingkungan; izin tambahan ditolak |
| Screenshot aplikasi/Postman/Studio | Belum tersedia | Harus diambil dari aplikasi yang berjalan sebelum pengumpulan |
| PR, Rebase and merge, Google Form | Belum dilakukan | URL repository, akses GitHub, dan tautan Form belum tersedia |

Hasil mentah:

- [API](evidence/automated-test-results.json).
- [Before–after database dari API](evidence/database-before-after.json).
- [Komponen React](evidence/component-test-results.json).
- [Before–after database dari interaksi React](evidence/component-database-before-after.json).
- [Newman](evidence/postman-newman-results.json).

## 3. Skenario interaksi komponen

Semua hasil di tabel ini berasal dari React Testing Library dalam JSDOM. Native `dialog.showModal()`/`close()` dipolyfill untuk status terbuka/tertutup; perilaku fokus native, Escape, dan layout harus diverifikasi melalui browser.

| No. | Skenario | Hasil aktual |
|---|---|---|
| 1 | GET: komponen menampilkan 5 produk dari API | Lulus pada tes komponen |
| 2 | Pencarian nama tidak peka huruf besar/kecil | Lulus pada tes komponen |
| 3 | Pencarian tanpa hasil menampilkan empty state | Lulus pada tes komponen |
| 4 | Form kosong ditolak tanpa menulis database | Lulus pada tes komponen |
| 5 | Harga nol ditolak pada form | Lulus pada tes komponen |
| 6 | Harga negatif ditolak pada form | Lulus pada tes komponen |
| 7 | Batal tambah menutup dialog tanpa menyimpan | Lulus pada tes komponen |
| 8 | API gagal: pesan tampil, input tetap, database tidak berubah (simulasi respons) | Lulus pada tes komponen |
| 9 | Tombol simpan dinonaktifkan selama request berjalan | Lulus pada tes komponen |
| 10 | POST lewat handler React menyimpan produk ke SQLite | Lulus pada tes komponen |
| 11 | Edit membuka data produk yang dipilih melalui props | Lulus pada tes komponen |
| 12 | Batal edit tidak mengubah database | Lulus pada tes komponen |
| 13 | PUT melalui handler memperbarui nama/harga tanpa mengganti ID | Lulus pada tes komponen |
| 14 | Muat ulang komponen membaca perubahan yang tersimpan | Lulus pada tes komponen |
| 15 | Batal hapus mempertahankan produk | Lulus pada tes komponen |
| 16 | DELETE setelah konfirmasi menghapus record dari SQLite | Lulus pada tes komponen |
| 17 | Gagal memuat dapat dicoba ulang (simulasi respons) | Lulus pada tes komponen |
| 18 | Database kosong menampilkan empty state | Lulus pada tes komponen |

Skenario gagal API memakai respons error yang sengaja disimulasikan. Skenario CRUD normal menggunakan Express dan database SQLite nyata. Kedua jenis pengujian tersebut dibedakan dalam file hasil.

## 4. Skenario API

| No. | Skenario | Status diharapkan | Status aktual | Hasil |
|---|---|---|---|---|
| 01 | GET seluruh produk | 200 | 200 | Lulus |
| 02 | GET produk Buku | 200 | 200 | Lulus |
| 03 | GET ID tidak ditemukan | 404 | 404 | Lulus |
| 04 | GET ID tidak valid | 400 | 400 | Lulus |
| 05 | POST produk baru | 201 | 201 | Lulus |
| 06 | GET produk baru | 200 | 200 | Lulus |
| 07 | POST nama kosong | 400 | 400 | Lulus |
| 08 | POST harga negatif | 400 | 400 | Lulus |
| 09 | POST harga string | 400 | 400 | Lulus |
| 10 | POST field kurang | 400 | 400 | Lulus |
| 11 | POST JSON rusak | 400 | 400 | Lulus |
| 12 | PUT produk berhasil | 200 | 200 | Lulus |
| 13 | GET hasil PUT | 200 | 200 | Lulus |
| 14 | PUT tanpa ID | 400 | 400 | Lulus |
| 15 | PUT ID string | 400 | 400 | Lulus |
| 16 | PUT nama kosong | 400 | 400 | Lulus |
| 17 | PUT harga negatif | 400 | 400 | Lulus |
| 18 | PUT field harga kurang | 400 | 400 | Lulus |
| 19 | PUT ID tidak ditemukan | 404 | 404 | Lulus |
| 20 | DELETE ID tidak valid | 400 | 400 | Lulus |
| 21 | DELETE ID tidak ditemukan | 404 | 404 | Lulus |
| 22 | DELETE produk berhasil | 200 | 200 | Lulus |
| 23 | GET produk setelah dihapus | 404 | 404 | Lulus |
| 24 | DELETE ulang produk | 404 | 404 | Lulus |
| 25 | POST harga nol ditolak | 400 | 400 | Lulus |
| 26 | PUT harga nol ditolak | 400 | 400 | Lulus |
| 27 | GET daftar akhir | 200 | 200 | Lulus |
| 28 | Endpoint tidak tersedia | 404 | 404 | Lulus |

Dua pemeriksaan tambahan yang lulus adalah persistensi setelah restart proses server dan seed ulang tidak menimpa data yang ada.

## 5. Perubahan database dari interaksi React

Tabel berikut dibaca langsung melalui Prisma pada database pengujian sementara. Ini bukti data, bukan screenshot database. ID pada komputer lain dapat berbeda.

### POST — tambah

**Sebelum**

| id | name | price |
|---|---|---|
| 1 | Buku | 15000 |
| 2 | Pulpen | 5000 |
| 3 | Spidol | 8000 |
| 4 | Penggaris | 6000 |
| 5 | Penghapus | 3000 |

**Sesudah**

| id | name | price |
|---|---|---|
| 1 | Buku | 15000 |
| 2 | Pulpen | 5000 |
| 3 | Spidol | 8000 |
| 4 | Penggaris | 6000 |
| 5 | Penghapus | 3000 |
| 6 | Stabilo Uji | 9000 |

### PUT — edit

**Sebelum**

| id | name | price |
|---|---|---|
| 1 | Buku | 15000 |
| 2 | Pulpen | 5000 |
| 3 | Spidol | 8000 |
| 4 | Penggaris | 6000 |
| 5 | Penghapus | 3000 |
| 6 | Stabilo Uji | 9000 |

**Sesudah**

| id | name | price |
|---|---|---|
| 1 | Buku | 15000 |
| 2 | Pulpen | 5000 |
| 3 | Spidol | 8000 |
| 4 | Penggaris | 6000 |
| 5 | Penghapus | 3000 |
| 6 | Stabilo Premium | 12000 |

### DELETE — hapus

**Sebelum**

| id | name | price |
|---|---|---|
| 1 | Buku | 15000 |
| 2 | Pulpen | 5000 |
| 3 | Spidol | 8000 |
| 4 | Penggaris | 6000 |
| 5 | Penghapus | 3000 |
| 6 | Stabilo Premium | 12000 |

**Sesudah**

| id | name | price |
|---|---|---|
| 1 | Buku | 15000 |
| 2 | Pulpen | 5000 |
| 3 | Spidol | 8000 |
| 4 | Penggaris | 6000 |
| 5 | Penghapus | 3000 |

## 6. Bukti visual yang perlu dilengkapi

Ikuti [PANDUAN_TUGAS_3.md](PANDUAN_TUGAS_3.md) dan [PANDUAN_POSTMAN.md](PANDUAN_POSTMAN.md).

| Bukti | Status |
|---|---|
| Halaman daftar produk dan pencarian | Belum dilampirkan |
| Pop-up tambah dan validasi input | Belum dilampirkan |
| Produk berhasil ditambahkan | Belum dilampirkan |
| Pop-up edit dan hasil perubahan | Belum dilampirkan |
| Pop-up hapus, batal, dan hasil hapus | Belum dilampirkan |
| Tampilan mobile | Belum dilampirkan |
| Postman sukses dan validasi gagal | Belum dilampirkan |
| Prisma Studio sebelum/sesudah POST | Belum dilampirkan |
| Prisma Studio sebelum/sesudah PUT | Belum dilampirkan |
| Prisma Studio sebelum/sesudah DELETE | Belum dilampirkan |

Setelah file gambar ada, sisipkan ke dokumen, misalnya:

```markdown
![Halaman utama](screenshots/tugas-3/01-halaman-utama.png)
![Popup edit](screenshots/tugas-3/08-popup-edit.png)
```

Jangan menyisipkan gambar ilustrasi atau menganggap JSON sebagai screenshot. Untuk bukti langsung pada PR, seret gambar asli ke kolom deskripsi GitHub.

## 7. Kesimpulan

Build, pengujian API, dan pengujian interaksi komponen telah berhasil. Daftar produk, pencarian, validasi, CRUD, dan pembatalan bekerja pada tingkat DOM/handler dan database dalam pengujian yang dijalankan. Pemeriksaan visual browser, screenshot, serta alur pengumpulan GitHub/Form masih perlu dilengkapi sebelum tugas dinyatakan siap dikumpulkan.
