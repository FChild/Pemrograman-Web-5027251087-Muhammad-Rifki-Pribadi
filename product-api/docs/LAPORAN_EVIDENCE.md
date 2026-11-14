# Laporan Evidence — Product API dengan Prisma

**Nama:** Muhammad Rifki Pribadi  
**NRP:** 5027251087  
**Repository GitHub:** BELUM DIISI — tempel URL repository setelah di-push.  
**Tanggal pengujian manual:** BELUM DIISI.

> Status dokumen: implementasi dan pengujian otomatis selesai. Screenshot Postman/Prisma Studio serta tautan GitHub belum dilengkapi. Dokumen ini belum merupakan laporan pengumpulan final.

## 1. Tujuan

Melanjutkan API produk dari Tugas Week 9 dengan penyimpanan database melalui Prisma serta menyediakan operasi GET, POST, PUT, dan DELETE. Pada versi awal, perubahan produk hanya tersimpan dalam array dan hilang ketika server dimulai ulang. Versi ini menyimpan perubahan ke SQLite sehingga data dapat dibaca kembali setelah restart.

## 2. Implementasi

Backend menggunakan ExpressJS, Prisma Client 6.19.0, dan SQLite. Model Product menyimpan id integer otomatis, name string, dan price float. Data awal Buku (15000) dan Pulpen (5000) dipertahankan melalui seed.

| Operasi | Endpoint | Fungsi Prisma |
|---|---|---|
| GET seluruh data | `/products` | `findMany` |
| GET satu data | `/products/:id` | `findUnique` |
| POST | `/products` | `create` |
| PUT | `/products` | `update` |
| DELETE | `/products/:id` | `delete` |

Body POST memuat name dan price, sedangkan body PUT memuat name, price, serta id sesuai instruksi tugas. DELETE menentukan id dari parameter URL. Input divalidasi sebelum menjalankan query; produk tidak ditemukan menghasilkan 404 dan input salah menghasilkan 400.

## 3. Hasil pengujian otomatis yang sudah dijalankan

- Waktu eksekusi: **14 November 2026, 19:13 WIB**.
- Lingkungan eksekusi: Node.js **v24.22.1**, Prisma **6.19.0**, SQLite lokal dalam database pengujian sementara.
- Hasil aktual: **30/30 pemeriksaan lulus**.
- Pengujian menggunakan HTTP ke proses Express nyata dan query Prisma untuk memeriksa isi database.
- Bukti mentah: [hasil test](evidence/automated-test-results.json) dan [database before–after](evidence/database-before-after.json).
- Pengujian otomatis ini dijalankan di lingkungan pengembangan paket, bukan screenshot manual dari komputer mahasiswa.

| No. | Skenario | Method | Status diharapkan | Hasil otomatis | Hasil manual |
|---|---|---|---|---|---|
| 01 | GET seluruh produk | GET | 200 | Lulus | Belum dicatat |
| 02 | GET produk Buku | GET | 200 | Lulus | Belum dicatat |
| 03 | GET ID tidak ditemukan | GET | 404 | Lulus | Belum dicatat |
| 04 | GET ID tidak valid | GET | 400 | Lulus | Belum dicatat |
| 05 | POST produk baru | POST | 201 | Lulus | Belum dicatat |
| 06 | GET produk baru | GET | 200 | Lulus | Belum dicatat |
| 07 | POST nama kosong | POST | 400 | Lulus | Belum dicatat |
| 08 | POST harga negatif | POST | 400 | Lulus | Belum dicatat |
| 09 | POST harga string | POST | 400 | Lulus | Belum dicatat |
| 10 | POST field kurang | POST | 400 | Lulus | Belum dicatat |
| 11 | POST JSON rusak | POST | 400 | Lulus | Belum dicatat |
| 12 | PUT produk berhasil | PUT | 200 | Lulus | Belum dicatat |
| 13 | GET hasil PUT | GET | 200 | Lulus | Belum dicatat |
| 14 | PUT tanpa ID | PUT | 400 | Lulus | Belum dicatat |
| 15 | PUT ID string | PUT | 400 | Lulus | Belum dicatat |
| 16 | PUT nama kosong | PUT | 400 | Lulus | Belum dicatat |
| 17 | PUT harga negatif | PUT | 400 | Lulus | Belum dicatat |
| 18 | PUT field harga kurang | PUT | 400 | Lulus | Belum dicatat |
| 19 | PUT ID tidak ditemukan | PUT | 404 | Lulus | Belum dicatat |
| 20 | DELETE ID tidak valid | DELETE | 400 | Lulus | Belum dicatat |
| 21 | DELETE ID tidak ditemukan | DELETE | 404 | Lulus | Belum dicatat |
| 22 | DELETE produk berhasil | DELETE | 200 | Lulus | Belum dicatat |
| 23 | GET produk setelah dihapus | GET | 404 | Lulus | Belum dicatat |
| 24 | DELETE ulang produk | DELETE | 404 | Lulus | Belum dicatat |
| 25 | POST harga nol valid | POST | 201 | Lulus | Belum dicatat |
| 26 | DELETE produk harga nol | DELETE | 200 | Lulus | Belum dicatat |
| 27 | GET daftar akhir | GET | 200 | Lulus | Belum dicatat |
| 28 | Endpoint tidak tersedia | GET | 404 | Lulus | Belum dicatat |

Dua pemeriksaan tambahan juga lulus: (1) produk hasil PUT masih tersedia setelah proses server dihentikan dan dimulai ulang; (2) menjalankan seed kembali tidak menimpa atau menggandakan data yang sudah ada. Pada seluruh kasus request gagal dan GET, isi tabel diperiksa agar tetap sama.

Collection Postman juga telah dieksekusi dengan **Newman 6.2.1**: **28 request** selesai dan **40 assertion lulus**, tanpa kegagalan. Hasil aktual tersedia di [postman-newman-results.json](evidence/postman-newman-results.json). Ini merupakan eksekusi collection melalui CLI, bukan screenshot aplikasi Postman.

## 4. Perubahan database aktual dari integration test

Tabel berikut berasal dari file hasil pengujian, bukan ilustrasi buatan. ID pada pengujian manual dapat berbeda karena mengikuti autoincrement database lokal masing-masing.

### POST — penambahan produk

Satu record Penghapus dengan harga 2000 bertambah.

**Sebelum**

| id | name | price |
|---|---|---|
| 1 | Buku | 15000 |
| 2 | Pulpen | 5000 |

**Sesudah**

| id | name | price |
|---|---|---|
| 1 | Buku | 15000 |
| 2 | Pulpen | 5000 |
| 3 | Penghapus | 2000 |

### PUT — perubahan produk

Record dengan ID yang sama berubah menjadi Penghapus Premium, harga 3500. Jumlah record tetap.

**Sebelum**

| id | name | price |
|---|---|---|
| 1 | Buku | 15000 |
| 2 | Pulpen | 5000 |
| 3 | Penghapus | 2000 |

**Sesudah**

| id | name | price |
|---|---|---|
| 1 | Buku | 15000 |
| 2 | Pulpen | 5000 |
| 3 | Penghapus Premium | 3500 |

### DELETE — penghapusan produk

Record Penghapus Premium dihapus. Produk awal tetap tersedia.

**Sebelum**

| id | name | price |
|---|---|---|
| 1 | Buku | 15000 |
| 2 | Pulpen | 5000 |
| 3 | Penghapus Premium | 3500 |

**Sesudah**

| id | name | price |
|---|---|---|
| 1 | Buku | 15000 |
| 2 | Pulpen | 5000 |

## 5. Screenshot pengujian manual — perlu dilengkapi

Ikuti [PANDUAN_POSTMAN.md](PANDUAN_POSTMAN.md). Simpan gambar asli ke folder `screenshots/` dan ganti bagian BELUM DIISI di bawah dengan tautan gambar.

### A. GET berhasil dan produk tidak ditemukan

**Hasil yang diharapkan:** GET seluruh produk menghasilkan 200 dan array data; GET ID tidak ada menghasilkan 404.

**Screenshot dan hasil manual:** BELUM DIISI.

### B. POST berhasil

**Hasil yang diharapkan:** POST name Penghapus, price 2000 menghasilkan 201. Jumlah record naik satu, dengan ID otomatis.

**Screenshot Postman:** BELUM DIISI (`06-post-success.png`).  
**Screenshot database sebelum:** BELUM DIISI (`05-db-before-post.png`).  
**Screenshot database sesudah:** BELUM DIISI (`07-db-after-post.png`).

### C. POST gagal karena validasi

**Hasil yang diharapkan:** nama kosong, harga negatif, harga string, field kurang, atau JSON rusak menghasilkan 400 dan tidak menambah data.

**Screenshot dan hasil manual:** BELUM DIISI.

### D. PUT berhasil

**Hasil yang diharapkan:** body berisi id produk hasil POST, name Penghapus Premium, price 3500. Respons 200; ID tetap, name/price berubah.

**Screenshot Postman:** BELUM DIISI (`13-put-success.png`).  
**Screenshot database sebelum:** BELUM DIISI (`12-db-before-put.png`).  
**Screenshot database sesudah:** BELUM DIISI (`14-db-after-put.png`).

### E. PUT gagal karena validasi atau ID tidak ditemukan

**Hasil yang diharapkan:** ID tidak disertakan, ID string, name kosong, atau price salah menghasilkan 400. ID valid tetapi tidak ada menghasilkan 404. Tidak ada perubahan database.

**Screenshot dan hasil manual:** BELUM DIISI.

### F. Persistensi setelah restart

**Hasil yang diharapkan:** setelah server dihentikan dan dinyalakan ulang, GET produk hasil PUT masih menghasilkan Penghapus Premium dengan price 3500.

**Screenshot dan hasil manual:** BELUM DIISI (`18-get-after-restart.png`).

### G. DELETE berhasil

**Hasil yang diharapkan:** DELETE ID produk hasil POST menghasilkan 200. Record hilang dari tabel; data lainnya tetap.

**Screenshot Postman:** BELUM DIISI (`20-delete-success.png`).  
**Screenshot database sebelum:** BELUM DIISI (`19-db-before-delete.png`).  
**Screenshot database sesudah:** BELUM DIISI (`21-db-after-delete.png`).

### H. GET/DELETE setelah data dihapus

**Hasil yang diharapkan:** GET ID yang telah dihapus dan DELETE ulang menghasilkan 404.

**Screenshot dan hasil manual:** BELUM DIISI.

Contoh sintaks Markdown untuk menyisipkan gambar, gunakan setelah file screenshot benar-benar ada:

```markdown
![POST berhasil](screenshots/06-post-success.png)
```

## 6. Kesimpulan sementara berdasarkan uji otomatis

Implementasi telah memenuhi operasi CRUD melalui Prisma. Uji otomatis menunjukkan bahwa perubahan POST, PUT, dan DELETE sesuai dengan isi database, input tidak valid ditolak, dan hasil perubahan tetap tersedia setelah restart proses server. Sebelum dikumpulkan, laporan perlu dilengkapi hasil manual, screenshot asli klien API/database, serta link repository GitHub.
