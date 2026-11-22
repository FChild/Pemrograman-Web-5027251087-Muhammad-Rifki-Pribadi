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


# Tugas 4 — Manajemen Produk dengan React Router dan Tailwind

**Muhammad Rifki Pribadi · 5027251087**

Lanjutan dari ZIP project Tugas 3 yang diunggah pengguna. CRUD Express/Prisma tetap dipakai. Penambahan utama: React Router, Tailwind, detail berdasarkan ID, halaman 404, dan Settings untuk mengganti grid/list.

**Panduan utama:** [PANDUAN_TUGAS_4.md](docs/PANDUAN_TUGAS_4.md).
**Draf deskripsi PR:** [PR_DESCRIPTION.md](PR_DESCRIPTION.md).
**Hasil pengujian terbaru:** [LAPORAN_TUGAS_4.md](docs/LAPORAN_TUGAS_4.md).

## Menjalankan

Dari folder `product-api`:

```powershell
npm ci
npm ci --prefix client
if (!(Test-Path .env)) { Copy-Item .env.example .env }
npm run db:generate
npm run db:migrate
npm run build
npm start
```

Buka **http://localhost:3000/products**. Root `/` otomatis diarahkan ke daftar produk.

Jika memulai dengan database kosong dan ingin data contoh, jalankan `npm run db:seed`. Tidak perlu seed ulang untuk melanjutkan data lama. Schema tidak berubah dan tidak ada perintah reset database dalam setup ini.

Database dan `.env` dari ZIP pengguna dipertahankan dalam paket. Saat menyalin perubahan ke project yang sedang dipakai, pertahankan `.env` dan `prisma/dev.db` milikmu jika sudah lebih baru. File tersebut tetap diabaikan oleh Git. Screenshot Tugas 3 juga dipertahankan, tetapi bukan bukti fitur baru Tugas 4.

## Halaman

| URL browser | Perilaku |
|---|---|
| `/` | Redirect ke `/products` |
| `/products` | Daftar, pencarian, tambah, edit, hapus, dan Link Detail |
| `/products/1` | Data produk ID 1 dari API |
| `/products/2` | Data produk ID 2 dari API |
| `/products/2147483647` | Halaman produk tidak ditemukan jika ID tidak ada |
| `/products/abc` | Halaman produk tidak ditemukan untuk ID tidak valid |
| `/settings` | Radio Grid/List, diterapkan langsung |
| Route lain, misalnya `/halaman-tidak-ada` | Halaman 404 dengan Link kembali |

Settings disimpan dalam localStorage `product-management:view`. Pilihan tetap berlaku setelah refresh pada origin/browser yang sama. Jika penyimpanan browser tidak tersedia, preferensi masih berlaku selama sesi dan halaman Settings menampilkan pemberitahuan.

## Pemisahan URL halaman dan API

Sebelumnya `/products/:id` adalah endpoint JSON. Pada tugas ini URL tersebut juga diminta untuk halaman detail. API utama dipindahkan ke prefix **`/api/products`**, sementara request JSON lama tetap didukung.

| Method | Endpoint utama | Kegunaan |
|---|---|---|
| GET | `/api/products` | Semua produk |
| GET | `/api/products/:id` | Satu produk |
| POST | `/api/products` | Tambah: body name dan price |
| PUT | `/api/products` | Edit: body id, name, price |
| DELETE | `/api/products/:id` | Hapus |

Browser yang meminta HTML pada `/products/:id` menerima aplikasi React. Request API lama tanpa Accept HTML tetap menerima JSON. Untuk integrasi baru, gunakan `/api/products` agar tidak ambigu. Collection Postman lama masih dapat dipakai dengan header bawaannya; gunakan prefix `/api` jika mengatur `Accept: text/html` sendiri.

Express menyediakan fallback HTML untuk deep link dan refresh. `/api/...` yang tidak ditemukan tetap menghasilkan JSON 404. Halaman 404 React pada aplikasi SPA menampilkan pesan 404 di UI; HTTP dokumen fallback tetap 200, sedangkan produk yang tidak ditemukan dari API menghasilkan HTTP 404.

## Teknologi dan struktur

- React Router DOM **7.9.6**: BrowserRouter, Routes, Route, Navigate, NavLink, Link, useParams.
- Tailwind CSS dan plugin Vite **4.1.17**. Stylesheet mengimpor Tailwind; utility classes digunakan pada navigasi, layout grid/list, detail, Settings, dan 404.
- CSS komponen lama diletakkan dalam layer `components` untuk mempertahankan tampilan form CRUD dan memungkinkan utility Tailwind mengubah layout.
- React, Express, Prisma, dan SQLite melanjutkan versi project sebelumnya.

| File | Fungsi |
|---|---|
| `client/src/App.jsx` | Navigasi dan definisi route |
| `client/src/pages/ProductsPage.jsx` | CRUD lama dan tampilan grid/list |
| `client/src/pages/ProductDetailPage.jsx` | useParams, GET berdasarkan ID, loading/error/not found |
| `client/src/pages/SettingsPage.jsx` | Radio Grid/List |
| `client/src/pages/NotFoundPage.jsx` | Pesan 404 dan Link kembali |
| `client/src/context/SettingsContext.jsx` | State preferensi lintas halaman dan localStorage |
| `client/src/components/ProductCard.jsx` | Link ke detail dan tombol CRUD |
| `client/src/api.js` | Fetch `/api/products`, propagasi status error |
| `client/vite.config.js` | Tailwind plugin dan proxy `/api` |
| `app.js` | Routing API dan fallback HTML |

## Mode pengembangan

Terminal pertama: `npm run dev`. Terminal kedua: `npm run dev:ui`. Buka alamat Vite (biasanya http://localhost:5173). Proxy hanya meneruskan `/api` ke port 3000 agar `/products/:id` tetap diproses React Router. Untuk melihat hasil dari `npm start` setelah mengedit React, build ulang dengan `npm run build`.

## Pengujian

```powershell
npm test
npm run test:components
```

Hasil terbaru: **30 pemeriksaan API + 29 pemeriksaan komponen/routing lulus**. Database pengujian terpisah dari database pengguna. JSON hasil berada di `docs/evidence/tugas-4/`. File evidence di folder induk merupakan arsip Tugas 3.

Test komponen berjalan dalam JSDOM dengan HTTP dan SQLite nyata; bukan pemeriksaan visual piksel. Untuk browser dan screenshot:

```powershell
npx playwright install chromium
npm run build
npm run test:ui
```

Skrip menyalakan server pengujian sendiri, menggunakan database sementara, dan menulis screenshot ke `docs/screenshots/tugas-4/`. Browser test belum berhasil dijalankan di lingkungan pembuatan karena Chromium diblokir. Jangan mengklaim sudah lulus sebelum menjalankannya. Alternatifnya, ikuti pengujian manual dalam panduan.

## Jika npm memblokir install scripts

Izin spesifik yang ada pada ZIP pengguna tetap dipertahankan. Bila npm tetap menampilkan paket diblokir, jalankan:

```powershell
npm install-scripts approve "@prisma/client" "@prisma/engines" prisma esbuild
npm rebuild "@prisma/client" "@prisma/engines" prisma esbuild
npm install-scripts approve esbuild --prefix client
npm rebuild esbuild --prefix client
```

## Pengumpulan

Gunakan branch **tugas-4**, beberapa commit terfokus, PR **main ← tugas-4**, lalu **Rebase and merge**. Kumpulkan URL PR melalui Google Form dosen. Jangan membuat PR dari main ke tugas-4. Source dalam ZIP tidak berisi folder `.git`; gunakan repository GitHub milikmu yang sudah ada.

Paket belum melakukan push, membuat PR, merge, atau mengirim Form. Panduan Tugas 3 disimpan sebagai arsip; ikuti panduan Tugas 4 untuk pengumpulan sekarang.

Referensi: [React Router](https://reactrouter.com/start/declarative/routing), [Tailwind + Vite](https://tailwindcss.com/docs/installation/using-vite).
