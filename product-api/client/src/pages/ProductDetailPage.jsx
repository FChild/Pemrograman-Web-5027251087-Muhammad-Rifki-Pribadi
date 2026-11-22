import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { productApi, friendlyError, formatPrice } from '../api';
import NotFoundPage from './NotFoundPage';
export default function ProductDetailPage() {
  const { id } = useParams();
  const [state, setState] = useState({ id: null, loading: true });
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    if (!/^[1-9]\d*$/.test(id) || Number(id) > 2147483647) {
      setState({ id, notFound: true }); return () => controller.abort();
    }
    setState({ id, loading: true });
    productApi.get(id, controller.signal)
      .then((product) => { if (!controller.signal.aborted) setState({ id, product }); })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState(error.status === 404 ? { id, notFound: true } : { id, error: friendlyError(error) });
      });
    return () => controller.abort();
  }, [id, reload]);
  if (state.id !== id || state.loading) return <p role="status" className="py-20 text-center text-slate-500">Memuat detail produk…</p>;
  if (state.notFound) return <NotFoundPage product />;
  if (state.error) return <section className="empty-state" role="alert"><h1>Detail belum dapat dimuat</h1><p>{state.error}</p><button className="button primary" onClick={() => setReload((n) => n + 1)}>Coba Lagi</button><Link to="/products" className="button outline">Kembali ke Produk</Link></section>;
  return <div className="mx-auto max-w-2xl">
    <Link to="/products" className="mb-6 inline-flex text-sm font-semibold text-blue-600 hover:underline">← Kembali ke Produk</Link>
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10" aria-label="Detail produk">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Detail produk</p>
      <h1 className="break-words text-3xl font-bold text-slate-900">{state.product.name}</h1>
      <dl className="mt-8 divide-y divide-slate-100">
        <div className="flex justify-between gap-4 py-4"><dt className="text-sm text-slate-500">ID Produk</dt><dd className="font-semibold" data-testid="detail-id">{state.product.id}</dd></div>
        <div className="flex flex-wrap items-center justify-between gap-4 py-4"><dt className="text-sm text-slate-500">Harga</dt><dd className="text-2xl font-bold text-blue-600">{formatPrice(state.product.price)}</dd></div>
      </dl>
    </section>
  </div>;
}
