# Panduan Postman dan screenshot database

## A. Siapkan dua terminal

Terminal 1, dari folder `product-api`:

```powershell
npm start
```

Terminal 2, dari folder yang sama:

```powershell
npm run db:studio
```

Setup `.env`, dependency, migration, dan seed harus sudah dilakukan seperti README. Prisma Studio menampilkan tabel database asli. Buka **Product**, bukan tabel internal migration.

## B. Import collection

1. Buka **Postman Desktop**.
2. Pilih workspace, lalu klik **Import** di area atas/kiri dekat tombol **New** (posisi bisa berbeda menurut versi).
3. Pilih file `postman/Product-API-Prisma.postman_collection.json`, atau seret file itu ke dialog import.
4. Di sidebar **Collections**, buka **Product API Prisma - 28 Skenario**.
5. Buka request **01 - GET seluruh produk**, lalu klik **Send**.
6. Respons yang diharapkan: `200 OK` dan array produk. Jika database masih baru, terdapat Buku, Pulpen, Spidol, Penggaris, dan Penghapus.

Base URL sudah diisi `http://localhost:3000`. Kamu tidak perlu membuat environment. Jika memakai port lain, ubah variabel **baseUrl** pada collection.

## C. Menjalankan request dan mengambil bukti

Untuk request dengan body, buka **Body > raw > JSON**. Body sudah tersedia dari collection, jadi tidak perlu diketik ulang.

Screenshot Postman sebaiknya menampilkan:

- nama request atau judul skenario;
- method dan URL;
- body yang dikirim untuk POST/PUT;
- status respons;
- JSON respons.

Screenshot database harus menampilkan nama tabel **Product** dan kolom `id`, `name`, `price`. Refresh/reload tampilan Studio setelah request agar tidak memakai tampilan lama.

Di Windows, gunakan `Win+Shift+S`, pilih area, lalu simpan gambar ke `docs/screenshots/` dengan nama di tabel berikut. Nama-nama ini adalah rencana penyimpanan, bukan klaim bahwa screenshot sudah tersedia.

### 1. GET dan kasus data tidak ditemukan

| Urutan | Aksi | Hasil | Nama screenshot |
|---|---|---|---|
| 1 | Send request 01 | 200, seluruh produk | `01-get-all.png` |
| 2 | Send request 02 | 200, Buku jika data awal belum diubah | `02-get-by-id.png` |
| 3 | Send request 03 | 404, produk tidak ditemukan | `03-get-not-found.png` |
| 4 | Send request 04 | 400, ID tidak valid | `04-get-invalid-id.png` |

### 2. POST dan database before–after

1. **Sebelum request 05**, screenshot tabel Product di Studio: `05-db-before-post.png`.
2. Buka request **05 - POST produk baru**, klik Send, lalu screenshot Postman: `06-post-success.png`.
3. Respons harus `201`. Catat ID yang benar-benar dikembalikan.
4. Script collection otomatis menyimpan ID itu sebagai `productId`. ID tidak harus selalu 3.
5. Refresh tabel Product di Studio. Produk Penghapus, harga 2000, harus bertambah: `07-db-after-post.png`.
6. Jalankan request 06 untuk membaca produk yang baru dibuat.
7. Jalankan request 07–11 untuk kasus validasi/JSON rusak; semuanya harus 400. Simpan setidaknya `08-post-empty-name.png`, `09-post-negative-price.png`, `10-post-string-price.png`, `11-post-invalid-json.png`.
8. Refresh database setelah kasus gagal: data tidak boleh bertambah atau berubah karena request yang ditolak.

Jangan menekan request 05 berulang kali tanpa kebutuhan: setiap POST berhasil membuat produk baru.

### 3. PUT dan database before–after

1. **Sebelum request 12**, screenshot Product yang masih memuat Penghapus 2000: `12-db-before-put.png`.
2. Buka **12 - PUT produk berhasil**. URL-nya `/products`. Body memuat `id`, `name`, dan `price`.
3. `{{productId}}` sengaja **tidak diberi tanda kutip** agar nilai JSON yang dikirim berupa angka.
4. Klik Send, harapkan 200 dan nama Penghapus Premium dengan harga 3500. Screenshot: `13-put-success.png`.
5. Refresh Studio. **ID tetap**, nama dan harga berubah: `14-db-after-put.png`.
6. Send request 13 untuk membaca hasil perubahan.
7. Jalankan request 14–19. Simpan contoh `15-put-missing-id.png`, `16-put-invalid-price.png`, dan `17-put-not-found.png`.
8. Request 14–18 harus 400, request 19 harus 404. Tidak ada perubahan database pada kasus gagal.

### 4. Membuktikan data tetap ada setelah restart

Lakukan ini **setelah request 13 dan sebelum request 22**:

1. Pada terminal server, tekan `Ctrl+C`.
2. Jalankan lagi `npm start`.
3. Send lagi request 13 (GET produk yang telah diubah).
4. Pastikan Penghapus Premium 3500 masih ditemukan. Simpan `18-get-after-restart.png`.

Tidak perlu menjalankan seed atau setup ulang ketika restart biasa.

### 5. DELETE dan database before–after

1. Jalankan request 20 (400) dan 21 (404) terlebih dahulu.
2. **Sebelum request 22**, screenshot tabel yang masih memuat Penghapus Premium: `19-db-before-delete.png`.
3. Send **22 - DELETE produk berhasil**. Respons 200 menyatakan produk berhasil dihapus: `20-delete-success.png`.
4. Refresh Studio. Record dengan ID tersebut harus hilang: `21-db-after-delete.png`.
5. Send request 23: GET ID yang dihapus harus 404. Simpan `22-get-deleted.png`.
6. Send request 24: menghapus ID yang sama lagi harus 404. Simpan `23-delete-not-found.png`.
7. Request 25 menguji POST dengan harga 0 (400); request 26 menguji PUT dengan harga 0 (400). Keduanya harus ditolak sesuai aturan harga lebih dari 0.
8. Request 27 menampilkan daftar akhir dan request 28 membuktikan endpoint tidak ada menghasilkan 404.

## D. Jika ingin memakai Runner

Pilih collection lalu **Run**, pertahankan urutan 01–28, gunakan satu iterasi, lalu jalankan. Lihat hasil **Tests/Test Results**. Runner cocok untuk pengecekan status cepat. Untuk screenshot database before–after, jalankan manual dan berhenti pada titik yang ditentukan di atas.

Collection akan membuat dan menghapus produk uji. Request 02 mengharapkan produk ID 1 ada; jalankan seed terlebih dahulu jika belum pernah setup.

## E. Jika PUT menghasilkan JSON tidak valid

Biasanya `productId` belum terisi. Jalankan request 05 dahulu dan pastikan statusnya 201, lalu periksa variabel collection. Jika mengerjakan request manual di luar collection, masukkan ID asli sebagai angka, misalnya:

```json
{
  "id": 3,
  "name": "Penghapus Premium",
  "price": 3500
}
```

Contoh angka 3 hanya berlaku jika memang ID produk yang dibuat adalah 3.

## F. Memasukkan gambar ke laporan

Buka `docs/LAPORAN_EVIDENCE.md`, isi link repository dan hasil pengujian manual, lalu tambahkan gambar sesuai nama file:

```markdown
![POST berhasil](screenshots/06-post-success.png)
![Database sebelum POST](screenshots/05-db-before-post.png)
![Database sesudah POST](screenshots/07-db-after-post.png)
```

Gambar dan laporan harus ikut di-commit agar dapat dibuka melalui repository GitHub.
