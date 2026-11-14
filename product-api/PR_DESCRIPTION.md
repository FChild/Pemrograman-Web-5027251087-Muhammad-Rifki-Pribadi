## Ringkasan Perubahan

- Menambahkan halaman Manajemen Produk menggunakan React: kartu ID/nama/harga, pencarian, jumlah hasil, dan tampilan responsif.
- Menambahkan pop-up Tambah Produk, Edit Produk, serta konfirmasi Hapus Produk beserta tombol Batal/tutup.
- Menghubungkan frontend ke API Express dan Prisma SQLite; PUT memakai id pada body JSON.
- Menambahkan validasi nama dan harga lebih dari 0, feedback sukses/gagal, loading, dan pencegahan submit ulang saat request.
- Menggunakan event handler lokal dan callback props; operasi CRUD berjalan saat interaksi pengguna.
- Menambahkan test dan dokumentasi pengumpulan Tugas 3.

## Bukti Pengujian

| Skenario | Hasil yang Diharapkan | Hasil Aktual |
|---|---|---|
| Memuat daftar produk | Produk database ditampilkan | Lulus pada tes komponen + API |
| Mencari nama produk | Hanya produk cocok tampil | Lulus pada tes komponen |
| Pencarian tidak menemukan produk | Pesan kosong tampil | Lulus pada tes komponen |
| Menambah produk valid | Record tersimpan dan kartu bertambah | Lulus pada tes komponen + API |
| Nama kosong/harga 0/harga negatif | Ditolak tanpa perubahan database | Lulus pada tes komponen + API |
| Mengedit produk | Nama/harga berubah dengan ID tetap | Lulus pada tes komponen + API |
| Membatalkan tambah/edit/hapus | Tidak ada perubahan database | Lulus pada tes komponen |
| Mengonfirmasi hapus | Record dihapus | Lulus pada tes komponen + API |
| Restart server | Perubahan tetap tersimpan | Lulus pada tes API |
| Error API (respons disimulasikan) | Pesan error tampil; data input dipertahankan | Lulus pada tes komponen |
| Layout mobile dan perilaku dialog native | Layout terbaca, fokus/Escape berfungsi | BELUM DIISI — verifikasi di browser lokal |

Pengujian yang sudah dijalankan dalam lingkungan pembuatan:

- `npm run build`: berhasil.
- `npm test`: 30/30 pemeriksaan lulus.
- `npm run test:components`: 18/18 pemeriksaan lulus (React Testing Library/JSDOM, terhubung ke API dan SQLite nyata).
- Collection melalui Newman: 28 request, 38 assertion lulus.

Hasil mentah berada di `docs/evidence/`; uraian lengkap pada `docs/LAPORAN_EVIDENCE.md`. Tes komponen bukan pengujian tampilan piksel browser. Jalankan ulang di komputer lokal dan sesuaikan hasil aktual bila berbeda.

### Screenshot/rekaman

**BELUM DILAMPIRKAN.** Sebelum membuat PR final, seret screenshot asli ke bagian ini:

1. Daftar produk dan hasil pencarian.
2. Pop-up tambah, validasi gagal, dan hasil berhasil.
3. Pop-up edit dan hasil perubahan.
4. Konfirmasi hapus dan daftar setelah penghapusan.
5. Tampilan mobile.
6. Bukti Postman dan perubahan database before–after sesuai tugas API sebelumnya.

### Pemeriksaan sebelum digabung

- [ ] Hasil pengujian lokal sudah diperiksa.
- [ ] Screenshot asli sudah terlampir dan dapat diakses dosen.
- [ ] Tidak ada placeholder BELUM DIISI/BELUM DILAMPIRKAN yang tertinggal.
- [ ] Branch PR: `tugas-3` ke `main`.
- [ ] Setelah pemeriksaan selesai, gunakan **Rebase and merge** sesuai instruksi.
