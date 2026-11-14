# Tugas 3 — Manajemen Produk

**Muhammad Rifki Pribadi · 5027251087**

Project tugas sebelumnya dilanjutkan dengan **React**, **Express**, **Prisma**, dan **SQLite**. Tampilan mengikuti gambar tugas: daftar kartu produk, pencarian nama, tombol Tambah Produk, serta pop-up tambah, edit, dan konfirmasi hapus. Semua perubahan disimpan melalui API ke database.

**Mulai dari sini:** [panduan lengkap pengerjaan sampai PR dan Google Form](docs/PANDUAN_TUGAS_3.md). Pengumpulan wajib memakai **branch `tugas-3` → Pull Request ke `main` → Rebase and merge → tautan PR di Google Form**.

## Cara menjalankan di Windows

Ekstrak ZIP dan buka folder `product-api` dengan VS Code. Jalankan di terminal yang memuat `package.json`:

```powershell
npm ci
npm ci --prefix client
Copy-Item .env.example .env
npm run db:setup
npm run build
npm start
```

Buka **http://localhost:3000** untuk halaman web, atau **http://localhost:3000/products** untuk API JSON. Gunakan Node.js 22.12+ atau 24.x. Salin `.env.example` hanya pada setup pertama agar konfigurasi lama tidak tertimpa. Di Linux/macOS, perintah penyalinan menjadi `cp .env.example .env`.

Pada penggunaan berikutnya cukup `npm start`. Jika mengubah kode React, jalankan `npm run build` lagi sebelum membuka hasil terbaru.

Untuk mode pengembangan dengan pembaruan otomatis:

```powershell
# Terminal 1: API
npm run dev
```

```powershell
# Terminal 2: UI React
npm run dev:ui
```

Buka URL yang dicetak Vite (biasanya http://localhost:5173). Vite meneruskan `/products` ke API pada port 3000. Jika PORT backend diganti, sesuaikan proxy dalam `client/vite.config.js`.

Untuk melihat tabel asli:

```powershell
npm run db:studio
```

Buka alamat Prisma Studio yang dicetak terminal, lalu pilih **Product**. Database lokal tersimpan di `prisma/dev.db`.

## Fitur sesuai gambar

| Fitur | Implementasi |
|---|---|
| Halaman utama | Judul Manajemen Produk, deskripsi, daftar kartu, jumlah produk |
| Kartu | ID, nama, harga dalam rupiah, tombol Edit dan Hapus |
| Pencarian | Filter nama, tidak peka huruf besar/kecil; jumlah hasil diperbarui |
| Tambah | Pop-up dengan nama dan harga, Simpan Produk, Batal, dan tutup |
| Edit | Data terisi otomatis; nama/harga bisa diganti, ID tetap |
| Hapus | Konfirmasi menampilkan produk; Batal atau Hapus Produk |
| Validasi | Nama wajib diisi; harga angka finite **lebih dari 0** |
| Feedback | Pesan sukses/gagal, loading, tombol simpan dinonaktifkan saat request |
| Data kosong | Tampilan belum ada produk dan pencarian tanpa hasil |
| Responsif | Grid 3 kolom, 2 kolom, atau 1 kolom sesuai lebar layar |

Data awal **Buku 15000 dan Pulpen 5000** dari project lama dipertahankan. Seed menambahkan Spidol 8000, Penggaris 6000, dan Penghapus 3000 jika ID-nya belum ada. Seed menggunakan upsert tanpa update sehingga tidak menimpa produk lama dengan ID yang sama. Karena itu, data lama di komputermu dapat berbeda dari lima contoh pada database baru.

Perubahan aturan dari paket sebelumnya: harga 0 sekarang ditolak agar sesuai keterangan gambar “Harga harus lebih dari 0”. Validasi ini berlaku pada frontend dan backend. Data lama yang sudah ada tidak diubah otomatis.

## Endpoint API

| Method | URL | Body | Sukses |
|---|---|---|---|
| GET | `/products` | — | 200, array seluruh produk |
| GET | `/products/:id` | — | 200, satu produk |
| POST | `/products` | `name`, `price` | 201, produk baru |
| PUT | `/products` | `id`, `name`, `price` | 200, produk yang diperbarui |
| DELETE | `/products/:id` | — | 200, pesan penghapusan |

PUT mengikuti tugas sebelumnya: ID berupa angka di **body**, bukan di URL. Nama kosong, harga <= 0, harga string, dan ID tidak valid ditolak dengan 400; produk tidak ditemukan menghasilkan 404. Kirim POST/PUT dengan `Content-Type: application/json`.

```json
{
  "id": 1,
  "name": "Buku Premium",
  "price": 18000
}
```

## Komponen dan event handler

| File | Peran |
|---|---|
| `client/src/App.jsx` | State produk/pencarian/modal, GET awal, handler simpan dan hapus |
| `client/src/components/ProductCard.jsx` | Menampilkan satu produk dan menerima `onEdit`/`onDelete` dari props |
| `client/src/components/ProductForm.jsx` | Form tambah/edit, state input, validasi, handler submit |
| `client/src/components/DeleteConfirmation.jsx` | Menampilkan produk dan mengirim ID melalui `onConfirm` |
| `client/src/components/Modal.jsx` | Dialog native, tombol tutup, Escape, backdrop |
| `client/src/api.js` | Permintaan fetch ke API dan format rupiah |
| `client/src/styles.css` | Tampilan responsif sesuai referensi |
| `app.js` | Server API dan file build React |
| `controllers/productController.js` | Validasi backend dan CRUD Prisma |
| `prisma/` | Schema, migration, seed |

Penjelasan khusus **handler lokal, handler dari props, dan waktu fungsi dipanggil** tersedia di [PENJELASAN_EVENT_HANDLER.md](docs/PENJELASAN_EVENT_HANDLER.md).

## Pengujian

```powershell
# API nyata + database sementara; 30 pemeriksaan
npm test

# Interaksi komponen React (JSDOM) + API nyata + database sementara
npm run test:components
```

Kedua test tersebut menggunakan database sementara terpisah; tidak menghapus database aplikasi kamu. Hasil aktual berada di `docs/evidence/` dan dirangkum di [LAPORAN_EVIDENCE.md](docs/LAPORAN_EVIDENCE.md).

Untuk menjalankan browser sungguhan dan menghasilkan screenshot otomatis pada komputermu:

```powershell
npx playwright install chromium
npm run build
npm run test:ui
```

`test:ui` menyalakan server sendiri di port bebas dan menulis screenshot ke `docs/screenshots/tugas-3/`. Tidak perlu menyalakan API secara manual untuk test ini. **Test browser dan screenshot belum berhasil dijalankan dalam lingkungan pembuatan paket karena pembatasan Chromium**; jangan menuliskan hasil lulus sebelum menjalankannya sendiri. Jika unduhan Chromium tidak tersedia, test juga menerima `CHROMIUM_PATH` yang menunjuk ke executable browser Chromium/Chrome lokal.

Untuk Postman, import `postman/Product-API-Prisma.postman_collection.json`. Jalankan 01–28 berurutan. Panduan screenshot API dan database: [PANDUAN_POSTMAN.md](docs/PANDUAN_POSTMAN.md).

## Pengumpulan

1. Ikuti [PANDUAN_TUGAS_3.md](docs/PANDUAN_TUGAS_3.md), termasuk branch dan commit per kelompok perubahan.
2. Lengkapi screenshot pada laporan dan jalankan test lokal.
3. Gunakan judul: **`[Tugas 3] Menambahkan UI manajemen produk dengan React dan Prisma`**.
4. Salin [PR_DESCRIPTION.md](PR_DESCRIPTION.md) ke deskripsi PR dan lengkapi bagian yang ditandai.
5. Buat PR dari `tugas-3` ke `main`, lalu **Rebase and merge** setelah pemeriksaan selesai.
6. Kumpulkan URL **PR**, bukan URL repository, melalui Google Form dosen.

Repository GitHub, nomor PR, dan URL Google Form belum diberikan. Paket ini belum melakukan push, membuat PR, merge, atau mengirim formulir.

## File yang disimpan di Git

Commit source code, `.env.example`, lockfile root/client, schema dan migration Prisma, test, dokumentasi, collection Postman, serta screenshot bukti. `.gitignore` mengecualikan `.env`, `node_modules`, `client/dist`, dan file database lokal. Jangan menyalin folder `.git` dari project lain ke repository yang sudah ada.

## Troubleshooting

| Masalah | Langkah |
|---|---|
| Halaman `/` menghasilkan 404 | Jalankan `npm ci --prefix client`, lalu `npm run build` |
| Halaman web sudah tampil, data gagal dimuat | Pastikan `.env` ada dan `npm run db:setup` sudah berhasil |
| Prisma Client belum tersedia | `npm run db:generate` |
| Tabel Product belum ada | `npm run db:setup` |
| Port 3000 terpakai | Hentikan server lama, atau ubah PORT dan proxy Vite jika dipakai |
| Perubahan React belum terlihat | Build ulang, lalu refresh browser |
| Harga 0 mendapat 400 | Sesuai aturan baru: harga harus lebih dari 0 |
| `npm ci` menolak lockfile | Pastikan menggunakan seluruh file dari paket, termasuk kedua lockfile |
| Browser test belum dapat berjalan | Gunakan test API/komponen, jalankan manual, lalu ambil screenshot asli |

## Referensi

- [React: responding to events](https://react.dev/learn/responding-to-events)
- [Vite: getting started](https://vite.dev/guide/)
- [GitHub: merging a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/merging-a-pull-request)
