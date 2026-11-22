import { Link } from 'react-router-dom';
export default function NotFoundPage({ product = false }) {
  return <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
    <p className="mb-4 text-6xl font-bold tracking-tight text-blue-600">404</p>
    <h1 className="mb-3 text-2xl font-bold">{product ? 'Produk tidak ditemukan' : 'Halaman tidak ditemukan'}</h1>
    <p className="mb-8 text-sm leading-6 text-slate-500">{product ? 'Produk dengan ID tersebut tidak tersedia atau sudah dihapus.' : 'Alamat yang kamu buka tidak tersedia. Kembali ke daftar untuk melanjutkan.'}</p>
    <Link to="/products" className="button primary">Kembali ke Produk</Link>
  </section>;
}
