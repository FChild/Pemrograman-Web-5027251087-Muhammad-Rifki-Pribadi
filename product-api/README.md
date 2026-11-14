# Product API — ExpressJS + Prisma + SQLite

**Nama:** Muhammad Rifki Pribadi  
**NRP:** 5027251087  
**Pengembangan:** project Tugas Week 9, ditambah Prisma dan CRUD sesuai tugas lanjutan.

## 1. Perubahan dari project sebelumnya

| Bagian | Week 9 | Versi lanjutan |
|---|---|---|
| Penyimpanan | Array `data/products.js` | Database SQLite melalui Prisma |
| GET seluruh produk | Ada | Membaca `prisma.product.findMany()` |
| GET berdasarkan ID | Ada | Tetap tersedia, membaca `findUnique()` |
| POST | Menambahkan ke array | Menambahkan record melalui `create()` |
| PUT | Belum ada | Memperbarui record melalui `update()`, ID di body |
| DELETE | Belum ada | Menghapus record melalui `delete()`, ID di URL |
| Data setelah restart | Perubahan hilang | Tetap tersimpan di file database |
| Bukti pengujian | Contoh curl | Collection Postman, integration test, panduan laporan |

SQLite dipilih karena slide tidak menentukan jenis database. Tidak perlu menyalakan MySQL/XAMPP. Prisma adalah ORM untuk berkomunikasi dengan database; SQLite adalah databasenya. Versi `prisma` dan `@prisma/client` dikunci sama-sama **6.19.0** agar sesuai dengan konfigurasi CommonJS project ini. Gunakan versi di `package-lock.json`, jangan menggantinya dengan `prisma@latest` saat mengikuti panduan ini.

## 2. Cara menjalankan di Windows / VS Code

1. Ekstrak ZIP, lalu buka folder **product-api** di VS Code.
2. Buka **Terminal > New Terminal**. Pastikan terminal berada di folder yang memuat `package.json`.
3. Periksa Node.js dan npm:

```powershell
node -v
npm -v
```

Gunakan Node.js 22.12+ atau 24.x. Project diuji dengan Node.js 24.22.1.

4. Pasang dependency dari lockfile:

```powershell
npm ci
```

5. Buat konfigurasi lokal. Jalankan ini satu kali saat belum memiliki `.env`:

```powershell
Copy-Item .env.example .env
```

Jika memakai Linux, macOS, atau Git Bash:

```bash
cp .env.example .env
```

Isi `.env`:

```dotenv
DATABASE_URL="file:./dev.db"
PORT=3000
```

Path relatif SQLite pada konfigurasi ini mengacu ke folder schema, sehingga database berada di `prisma/dev.db`.

6. Buat Prisma Client, terapkan migration, lalu isi data awal:

```powershell
npm run db:setup
```

Perintah tersebut menjalankan `prisma generate`, membuka file SQLite bila belum ada, menjalankan `prisma migrate deploy`, dan seed. File migration sudah disediakan, jadi tidak perlu membuat migration baru untuk setup pertama. Data awal: Buku (15000) dan Pulpen (5000). Seed ulang tidak menimpa produk yang telah diedit dengan ID yang sama; jika ID 1/2 telah dihapus, seed akan menambahkannya kembali.

7. Nyalakan server:

```powershell
npm start
```

Buka `http://localhost:3000/products` untuk melihat data. Root `/` memang tidak memiliki halaman web; project ini adalah REST API. Hentikan server dengan `Ctrl+C`.

8. Buka terminal **kedua**, tetap di folder `product-api`, untuk melihat database:

```powershell
npm run db:studio
```

Buka alamat yang dicetak Prisma Studio, lalu pilih tabel **Product**. Biarkan terminal server dan Studio tetap berjalan. Refresh data Studio setelah mengirim POST, PUT, atau DELETE.

## 3. Endpoint API

Base URL: `http://localhost:3000`

| Method | Endpoint | Body JSON | Respons sukses |
|---|---|---|---|
| GET | `/products` | Tidak ada | 200, array semua produk |
| GET | `/products/:id` | Tidak ada | 200, satu produk |
| POST | `/products` | `name`, `price` | 201, produk baru |
| PUT | `/products` | **`id`, `name`, `price`** | 200, produk setelah diubah |
| DELETE | `/products/:id` | Tidak ada | 200, pesan dan produk yang dihapus |

**PUT menggunakan ID di body sesuai instruksi tugas**, bukan `/products/:id`. POST dan PUT membutuhkan header `Content-Type: application/json`. `id` pada PUT harus angka, bukan string.

POST `/products`:

```json
{
  "name": "Penghapus",
  "price": 2000
}
```

Contoh respons pada database baru:

```json
{
  "id": 3,
  "name": "Penghapus",
  "price": 2000
}
```

PUT `/products` — ganti `3` dengan ID yang benar-benar dikembalikan POST:

```json
{
  "id": 3,
  "name": "Penghapus Premium",
  "price": 3500
}
```

DELETE `/products/3` — gunakan ID produk yang dibuat tadi:

```json
{
  "message": "Produk berhasil dihapus",
  "data": {
    "id": 3,
    "name": "Penghapus Premium",
    "price": 3500
  }
}
```

ID dibuat otomatis oleh database dan tidak harus berurutan kembali setelah record dihapus.

## 4. Aturan validasi dan error

- `name`: wajib string, setelah spasi awal/akhir dihapus tidak boleh kosong.
- `price`: wajib number JSON yang finite dan >= 0. Harga 0 boleh; `"2000"` dan angka negatif ditolak.
- PUT wajib menyertakan `id`, `name`, dan `price` lengkap.
- `id`: integer positif dalam rentang Prisma Int (1–2147483647). URL ID juga divalidasi.
- Field tambahan tidak disimpan; ID POST dibuat otomatis oleh database.

| Status | Arti |
|---|---|
| 200 | GET/PUT/DELETE berhasil |
| 201 | Produk baru berhasil dibuat |
| 400 | Validasi gagal atau JSON rusak |
| 404 | Produk atau endpoint tidak ditemukan |
| 413 | Body request terlalu besar |
| 500 | Kesalahan internal server/database |

## 5. Pengujian Postman dan bukti tugas

Panduan klik dan urutan screenshot: **[docs/PANDUAN_POSTMAN.md](docs/PANDUAN_POSTMAN.md)**.

1. Nyalakan API dan Prisma Studio.
2. Di Postman Desktop, klik **Import**, lalu pilih `postman/Product-API-Prisma.postman_collection.json`.
3. Collection berisi **28 request**, dengan `baseUrl` bawaan `http://localhost:3000`.
4. Jalankan berurutan. Request 05 menyimpan ID produk otomatis untuk request berikutnya.
5. Untuk bukti before–after, jalankan request satu per satu, bukan langsung seluruh Runner.
6. Lengkapi **[docs/LAPORAN_EVIDENCE.md](docs/LAPORAN_EVIDENCE.md)** dengan screenshot asli dan link repository GitHub.

Collection juga dapat dijalankan melalui Runner untuk mengecek status respons dan beberapa nilai data secara otomatis. Pengujian berurutan akan membuat, mengubah, lalu menghapus produk uji.

## 6. Pengujian otomatis lokal

```powershell
npm test
```

Test membuat **database sementara terpisah**, menjalankan migration dan seed, menyalakan server di port bebas, mengirim 28 request HTTP, serta menguji restart proses server dan seed ulang. Total 30 pemeriksaan. Test memverifikasi status, isi respons relevan, dan perubahan database; request gagal tidak boleh mengubah data. Database aplikasi `prisma/dev.db` tidak dihapus oleh test ini.

Hasil tersimpan di:

- `docs/evidence/automated-test-results.json` — hasil aktual tiap pemeriksaan.
- `docs/evidence/database-before-after.json` — isi tabel sebelum/sesudah POST, PUT, DELETE.
- `docs/evidence/postman-newman-results.json` — hasil aktual collection melalui Newman: 28 request, 40 assertion lulus.

File JSON ini merupakan bukti pengujian otomatis tambahan, **belum menggantikan screenshot Postman dan database yang diminta pada slide**. Menjalankan test lagi memperbarui kedua file hasil tersebut.

Jika ingin memeriksa collection melalui CLI, nyalakan server (`npm start`) pada terminal pertama, lalu jalankan di terminal kedua:

```powershell
npx --yes newman@6.2.1 run postman/Product-API-Prisma.postman_collection.json
```

Perintah Newman ini menguji database aplikasi yang sedang berjalan, sehingga jalankan pada database latihan. Collection membuat, mengubah, lalu menghapus produk uji.

## 7. Struktur dan alur kode

| File/folder | Fungsi |
|---|---|
| `app.js` | Middleware JSON, pemasangan route, error handler, startup dan shutdown |
| `routes/productRoutes.js` | Pemetaan method/URL ke controller dan penanganan async error |
| `controllers/productController.js` | Validasi input dan operasi CRUD Prisma |
| `config/prisma.js` | Satu instance PrismaClient untuk aplikasi |
| `prisma/schema.prisma` | Model Product dan koneksi SQLite |
| `prisma/migrations/` | SQL pembentukan tabel, disimpan di Git |
| `scripts/init-db.js` | Membuka/membuat file SQLite sebelum migration |
| `prisma/seed.js` | Mengisi data awal dengan upsert |
| `data/products.js` | Data awal lama, khusus seed; bukan penyimpanan API |
| `postman/` | Collection siap import |
| `tests/` | Skenario dan integration test |
| `docs/` | Panduan, laporan, dan hasil pengujian |

Alurnya: request masuk ke Express, route memilih controller, controller memvalidasi input dan memanggil Prisma Client, Prisma mengakses SQLite, lalu controller mengirim JSON. Model Product terdiri atas `id: Int`, `name: String`, `price: Float`; `price` mempertahankan dukungan angka desimal dari project sebelumnya. Untuk aplikasi keuangan produksi, tipe harga perlu dirancang lebih ketat; tugas ini mempertahankan kontrak data awal.

## 8. Mengumpulkan melalui GitHub

Belum ada repository yang dibuat atau di-push oleh paket ini. Gunakan repository project kamu dan isi tautannya di laporan.

Jika project ini sudah berada dalam repository lama:

```powershell
git status
git add .
git diff --cached --stat
git commit -m "Tambahkan Prisma SQLite dan CRUD produk lengkap"
git push
```

Jika belum ada repository:

1. Buat repository kosong di GitHub.
2. Di folder `product-api`, jalankan berikut; ganti placeholder URL dengan URL repository milikmu:

```powershell
git init
git add .
git commit -m "Product API dengan Prisma dan CRUD"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPOSITORY.git
git push -u origin main
```

`.gitignore` mengecualikan `node_modules`, `.env`, dan database lokal. Commit `.env.example`, schema, migration, lockfile, source code, collection, laporan, serta screenshot. Orang lain dapat membuat database sendiri dengan `npm ci`, menyalin `.env.example`, lalu `npm run db:setup`.

Checklist pengumpulan:

- [ ] Link repository GitHub dapat diakses dosen/asisten.
- [ ] Source code dan Prisma migration sudah di-push.
- [ ] Laporan menampilkan skenario sukses dan validasi gagal.
- [ ] Screenshot Postman menunjukkan method, URL, body, status, dan response.
- [ ] Screenshot database sebelum/sesudah POST, PUT, DELETE disertakan.
- [ ] Link repository dan screenshot asli telah dimasukkan ke laporan.

## 9. Jika ada error

| Error/gejala | Tindakan |
|---|---|
| `npm` tidak dikenali | Pasang Node.js, lalu buka ulang terminal |
| Prisma Client belum terbuat | Jalankan `npm run db:generate` |
| `Environment variable not found: DATABASE_URL` | Salin `.env.example` ke `.env` |
| Tabel Product belum ada | Jalankan `npm run db:setup` |
| `EADDRINUSE` | Hentikan server lain di port 3000 atau ubah PORT dan baseUrl Postman |
| Postman tidak bisa konek localhost | Gunakan Postman Desktop atau Desktop Agent, pastikan server hidup |
| PUT mengembalikan 400 | ID harus angka di body, sertakan name dan price |
| GET `/` menghasilkan 404 | Gunakan `/products` |
| ID produk tidak sama dengan contoh | Gunakan ID dari respons POST, bukan mengasumsikan selalu 3 |

## Referensi

- [Prisma Migrate — development and production (v6)](https://www.prisma.io/docs/orm/v6/prisma-migrate/workflows/development-and-production)
- [Prisma seeding (v6)](https://www.prisma.io/docs/orm/v6/prisma-migrate/workflows/seeding)

Dokumentasi dapat menampilkan contoh versi yang lebih baru. Untuk menjalankan paket ini, ikuti versi dan perintah yang dikunci dalam project.
