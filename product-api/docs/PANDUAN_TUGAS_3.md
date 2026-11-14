# Panduan Tugas 3 — dari project sampai PR dan Google Form

Panduan ini melanjutkan project Product API kamu. Kode UI dan integrasi sudah disediakan. GitHub dan Google Form harus menggunakan repository serta akun milikmu.

## 1. Tentukan folder repository

Jika repository GitHub **sudah di-clone** ke komputer, buka folder tersebut di VS Code. Tidak perlu `git init` lagi.

Jika belum, buka repository pada GitHub, klik **Code → HTTPS**, salin URL, kemudian jalankan:

```powershell
git clone https://github.com/USERNAME/NAMA-REPOSITORY.git
cd NAMA-REPOSITORY
```

Ganti USERNAME dan NAMA-REPOSITORY dengan milikmu; URL contoh bukan alamat pengumpulan. Jangan menaruh `product-api` di dalam `product-api` lagi. Lokasi `package.json` menjadi patokan:

- Jika `package.json` project lama sudah di root repository, salin **isi** folder `product-api` dari ZIP ke root tersebut.
- Jika project lama berada di subfolder `product-api`, salin isinya ke subfolder tersebut.
- Pertahankan `.git` repository lama, `.env` lokal, dan file lain yang bukan bagian project ini.

## 2. Periksa pekerjaan yang belum di-commit

Dari terminal repository:

```powershell
git status
git remote -v
```

Jika ada pekerjaan lama yang belum di-commit, selesaikan/simpan dahulu secara terpisah. Jangan menjalankan reset atau menimpa file yang belum kamu periksa. `git remote -v` harus menampilkan repository yang benar.

## 3. Perbarui main, lalu buat branch tugas-3

**Lakukan sebelum menyalin perubahan tugas ini ke repository.**

```powershell
git checkout main
git pull origin main
git checkout -b tugas-3
```

Jika branch `tugas-3` sudah ada, gunakan `git checkout tugas-3` dan periksa isinya; tidak perlu membuat ulang. Jangan memakai nama branch lain untuk pengumpulan ini.

## 4. Salin project yang sudah dikerjakan

Ekstrak paket dan salin source serta dokumentasinya ke lokasi project yang sesuai pada langkah 1. Folder `.git`, `node_modules`, database lokal, dan `.env` tidak disertakan dalam ZIP. Jika kamu memakai paket API sebelumnya, file lama yang namanya sama memang perlu diperbarui oleh versi tugas ini.

Jika tugas Prisma sebelumnya **belum ada** di repository GitHub, ikut salin folder `config`, `controllers`, `routes`, `data`, `prisma`, dan `scripts`, serta file konfigurasi root. Jika sudah ada, periksa perbedaannya dengan `git diff`.

Mulai langkah berikutnya, buka terminal di **folder yang memuat package.json**. Perintah Git tetap dapat dijalankan dari subfolder yang berada di dalam repository.

## 5. Install dan jalankan

```powershell
npm ci
npm ci --prefix client
```

Jika `.env` belum ada:

```powershell
Copy-Item .env.example .env
```

Lalu:

```powershell
npm run db:setup
npm run build
npm start
```

Buka `http://localhost:3000`. Tampil halaman **Manajemen Produk**. Di database baru ada 5 produk. Database lama mungkin menampilkan produk berbeda karena seed tidak menimpa data yang sudah ada.

## 6. Cek tampilan dan interaksi sesuai gambar

| Yang dilakukan | Hasil yang diperiksa |
|---|---|
| Buka halaman utama | Kartu memuat ID, nama, harga, Edit, dan Hapus |
| Cari `pulpen` | Hanya produk dengan nama yang cocok tampil |
| Cari nama yang tidak ada | Pesan Produk tidak ditemukan tampil |
| Klik Tambah Produk | Pop-up berisi Nama Produk dan Harga (Rp) |
| Simpan form kosong | Pesan validasi, tidak ada produk baru |
| Isi harga 0/negatif | Ditolak; harga harus lebih dari 0 |
| Isi produk valid lalu simpan | Kartu baru muncul dan database bertambah |
| Klik Edit pada produk uji | Pop-up terisi nama/harga produk tersebut |
| Edit lalu Batal | Data lama tetap |
| Edit lalu Simpan Perubahan | Nama/harga berubah, ID tetap |
| Klik Hapus lalu Batal | Produk tetap ada |
| Klik Hapus lalu Hapus Produk | Produk hilang dari daftar dan database |
| Refresh halaman/restart server | Perubahan data tetap tersimpan |
| Perkecil layar | Grid dan pop-up menyesuaikan lebar layar |

## 7. Jalankan pengujian

Di terminal kedua:

```powershell
npm test
npm run test:components
```

`npm test` memeriksa API dan persistensi database. `test:components` menjalankan interaksi React dalam JSDOM dan benar-benar mengirim request ke server/database sementara. Keduanya berbeda dari pemeriksaan visual browser.

Untuk test browser dan screenshot otomatis:

```powershell
npx playwright install chromium
npm run build
npm run test:ui
```

Test ini menggunakan database sementara dan dapat menghasilkan 15 screenshot di `docs/screenshots/tugas-3/`. Paket tidak mengklaim test ini sudah lulus; jalankan pada komputermu, dan catat hasil yang benar-benar muncul. Jika gagal, lakukan pengujian manual pada langkah 6 dan ambil screenshot asli.

## 8. Ambil screenshot untuk PR

Gunakan `Win+Shift+S` pada aplikasi yang berjalan. Minimal sertakan:

| Nama yang disarankan | Bukti |
|---|---|
| `01-halaman-utama.png` | Daftar produk awal |
| `02-pencarian.png` | Hasil pencarian |
| `04-popup-tambah.png` | Form tambah |
| `05-validasi-kosong.png` | Pesan validasi saat form kosong |
| `07-tambah-berhasil.png` | Produk baru setelah disimpan |
| `08-popup-edit.png` | Form edit terisi data |
| `09-edit-berhasil.png` | Hasil edit |
| `10-popup-hapus.png` | Konfirmasi penghapusan |
| `11-hapus-berhasil.png` | Daftar setelah produk dihapus |
| `12-tampilan-mobile.png` | Tampilan layar kecil |

Untuk memenuhi bukti tugas Prisma sebelumnya, tambahkan screenshot **Postman/Bruno/Hoppscotch** serta **Prisma Studio before–after**. Buka terminal ketiga:

```powershell
npm run db:studio
```

Pilih tabel Product dan screenshot sebelum POST, setelah POST, sebelum PUT, setelah PUT, sebelum DELETE, serta setelah DELETE. Refresh Studio setiap selesai melakukan perubahan. `test:ui` hanya mengambil screenshot halaman aplikasi; screenshot Prisma Studio/Postman tetap diambil terpisah. Panduan request API ada di [PANDUAN_POSTMAN.md](PANDUAN_POSTMAN.md).

Simpan bukti ke `docs/screenshots/tugas-3/` atau `docs/screenshots/`, lalu lengkapi [LAPORAN_EVIDENCE.md](LAPORAN_EVIDENCE.md). Jangan menandai skenario sebagai lulus jika belum dicoba.

## 9. Commit secara bertahap

Perintah di bawah dijalankan dari folder `package.json`. Hindari satu `git add .` di awal yang menggabungkan seluruh pekerjaan ke satu commit. Periksa staging sebelum commit dengan `git diff --cached --stat`.

**Commit 1 — backend, database, dan konfigurasi:**

```powershell
git add package.json package-lock.json .gitignore .env.example config controllers routes data prisma scripts
git diff --cached --stat
git commit -m "Menyesuaikan API Prisma dan validasi harga produk"
```

Jika suatu kelompok tidak memiliki perubahan karena sudah ada di main, lewati commit yang kosong. Jangan membuat commit kosong hanya untuk menambah jumlah.

**Commit 2 — halaman React dan pop-up CRUD:**

```powershell
git add client app.js
git diff --cached --stat
git commit -m "Menambahkan halaman produk React dan pop-up CRUD"
```

**Commit 3 — pengujian:**

```powershell
git add tests postman
git diff --cached --stat
git commit -m "Menambahkan pengujian interaksi React dan skenario API"
```

**Commit 4 — laporan dan screenshot:**

```powershell
git add README.md PR_DESCRIPTION.md docs
git diff --cached --stat
git commit -m "Mendokumentasikan hasil uji dan bukti tugas 3"
```

Folder `.github` yang disediakan berisi template PR. Jika project ada di subfolder repository, pindahkan `.github` ke **root repository** agar GitHub dapat mengenalinya. Sebelum commit dokumentasi di atas, buka terminal di root repository lalu jalankan `git add .github`; setelah itu kembali ke folder project untuk commit. Jika project sudah berada di root, cukup tambahkan `git add .github` sebelum commit dokumentasi.

Periksa hasil:

```powershell
git status
git log --oneline main..tugas-3
```

Jika semua perubahan yang dimaksud sudah di-commit, status seharusnya bersih. Tetap periksa bila ada perubahan lain milikmu yang tidak termasuk tugas.

## 10. Push branch tugas-3

```powershell
git push -u origin tugas-3
```

Untuk revisi berikutnya:

```powershell
git add <file-yang-direvisi>
git commit -m "Jelaskan revisi yang dilakukan"
git push origin tugas-3
```

Jangan langsung push perubahan tugas ke `main`, karena tugas meminta dokumentasi melalui PR.

## 11. Buat Pull Request

1. Buka repository GitHub.
2. Klik **Pull requests → New pull request**.
3. Pilih **base: main**, **compare: tugas-3**.
4. Periksa perubahan di tab diff.
5. Masukkan judul:

```text
[Tugas 3] Menambahkan UI manajemen produk dengan React dan Prisma
```

6. Buka file `PR_DESCRIPTION.md`, salin isinya ke deskripsi PR, kemudian sesuaikan hasil pengujian lokal.
7. Untuk menampilkan bukti langsung dalam deskripsi PR, seret screenshot dari komputermu ke kolom deskripsi. Tunggu GitHub selesai mengunggah gambar; GitHub akan membuat tautan Markdown.
8. Pastikan tabel hasil aktual sesuai, screenshot terbaca, dan tidak ada placeholder yang tertinggal.
9. Klik **Create pull request**.

## 12. Rebase and merge

Setelah pekerjaan selesai, hasil pengujian benar, dan PR dapat digabung:

1. Pada halaman PR, cari tombol penggabungan di bagian bawah.
2. Klik panah dropdown di samping tombol tersebut.
3. Pilih **Rebase and merge**.
4. Klik **Confirm rebase and merge**.
5. Pastikan status PR menjadi **Merged**.

Gunakan opsi yang diminta dosen. Jika Rebase and merge tidak tersedia pada repository milikmu, periksa **Settings → General → Pull Requests → Allow rebase merging**. Jika PR memiliki conflict atau pemeriksaan wajib belum selesai, selesaikan dahulu; jangan mengganti metode merge tanpa mengikuti ketentuan tugas.

Setelah PR merged, perbarui lokal:

```powershell
git checkout main
git pull origin main
```

## 13. Kumpulkan tautan PR di Google Form

1. Tetap buka halaman PR yang sudah merged.
2. Salin URL dari address bar. Bentuknya:

```text
https://github.com/USERNAME/NAMA-REPOSITORY/pull/NOMOR-PR
```

3. Buka **Form Pengumpulan Pull Request** dari materi dosen. Teks yang dikirim belum memuat URL tujuan tombol tersebut, jadi gunakan tautan asli pada LMS/materi.
4. Isi data diri jika diminta.
5. Tempel URL PR pada kolom pengumpulan.
6. Kirim formulir dan simpan bukti bahwa jawaban terkirim.

Yang dikumpulkan adalah URL `/pull/...`, bukan URL repository, branch, ZIP, atau halaman localhost. Pastikan dosen dapat membuka repository dan screenshot sesuai ketentuan kelas.

## 14. Status paket dan langkah yang masih membutuhkan akunmu

- Source React, integrasi API, test, dan dokumentasi disediakan dalam paket.
- Branch dan commit lokal pembuatan paket bukan PR di akun GitHub milikmu.
- Belum ada push, PR, merge, atau pengiriman Google Form.
- URL repository dan URL Google Form belum tersedia dalam percakapan.

Referensi: [GitHub: merging a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/merging-a-pull-request).
