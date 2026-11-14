# Penjelasan event handler pada Tugas 3

Event handler adalah fungsi yang dijalankan ketika pengguna melakukan interaksi, seperti klik, mengetik, atau submit form. Dalam project ini, handler mengubah state atau memanggil API. React kemudian merender ulang tampilan berdasarkan state terbaru.

## 1. Definisi fungsi lokal

`handleSubmit` didefinisikan di dalam komponen ProductForm. Fungsi ini bisa membaca state `name` dan `price` milik komponen tersebut.

```jsx
function handleSubmit(event) {
  event.preventDefault();
  // Validasi name dan price, kemudian panggil onSave(data).
}

<form onSubmit={handleSubmit}>
```

`event.preventDefault()` mencegah submit HTML bawaan memuat ulang halaman. Menulis definisi fungsi tidak berarti fungsi itu langsung dijalankan. Pada contoh di atas, React memanggilnya ketika form disubmit, baik dengan klik tombol Simpan maupun Enter di input.

## 2. Handler dikirim melalui props

Di App, fungsi yang mengetahui produk dan modal dikirim ke ProductCard:

```jsx
<ProductCard
  product={product}
  onEdit={(selected) => openModal('edit', selected)}
  onDelete={(selected) => openModal('delete', selected)}
/>
```

Di ProductCard, handler dari props digunakan ketika pengguna mengklik tombol:

```jsx
<button onClick={() => onEdit(product)}>Edit</button>
```

ProductCard bertanggung jawab menampilkan kartu dan memberi tahu parent produk mana yang dipilih. App menyimpan pilihan tersebut pada state `modal`. ProductForm menerima objek produk untuk mengisi nilai awal input.

## 3. Waktu pemanggilan fungsi

| JSX | Kapan fungsi berjalan | Penilaian |
|---|---|---|
| `onClick={handleClick}` | Ketika tombol diklik | Benar untuk handler tanpa argumen tambahan |
| `onClick={() => handleClick(product)}` | Ketika tombol diklik | Benar untuk mengirim argumen produk |
| `onClick={handleClick()}` | Langsung saat render | Salah jika tujuan kita menunggu klik |
| `onSubmit={handleSubmit}` | Ketika form disubmit | Digunakan pada form tambah/edit |
| `onChange={(event) => setQuery(event.target.value)}` | Ketika nilai input berubah | Digunakan untuk pencarian |

Jika menulis `onClick={handleDelete(product.id)}`, fungsi hapus bisa berjalan saat komponen dirender. Bentuk yang dipakai dalam project adalah callback, sehingga pengguna harus mengklik konfirmasi terlebih dahulu.

## 4. Alur tombol Tambah Produk

1. Pengguna mengklik Tambah Produk.
2. Callback menjalankan `openModal('add')` di App.
3. State modal berubah dan ProductForm ditampilkan.
4. Pengguna mengisi nama/harga; onChange memperbarui state lokal.
5. Submit menjalankan handleSubmit dan validasi.
6. Data valid diteruskan melalui `onSave(data)` ke handleSave di App.
7. App mengirim POST ke API; Express menyimpan produk melalui Prisma.
8. Respons sukses memperbarui state daftar, menutup modal, dan menampilkan pesan sukses.

## 5. Alur edit dan hapus

Edit mengikuti alur yang sama, tetapi modal menerima produk terpilih dan API dipanggil menggunakan PUT dengan `id` di body. Hapus membuka DeleteConfirmation terlebih dahulu; Batal hanya menutup dialog, sedangkan Hapus Produk memanggil onConfirm dengan ID produk untuk mengirim DELETE.

## 6. Kaitan dengan contoh `alert(message)` pada materi

Untuk contoh sederhana di materi:

```jsx
function AlertButton({ message }) {
  function handleClick() {
    alert(message);
  }
  return <button onClick={handleClick}>Tampilkan pesan</button>;
}
```

`message` tersedia sebagai props, `handleClick` adalah fungsi lokal, dan alert baru berjalan saat tombol diklik. Contoh ini hanya menjelaskan konsep; aplikasi produk memakai pop-up form dan pesan status agar alur CRUD tetap nyaman digunakan.

Referensi: [Responding to Events — React](https://react.dev/learn/responding-to-events).
