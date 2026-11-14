import { useEffect, useState } from 'react';
import { productApi, friendlyError } from './api';
import { Icon } from './components/Icons';
import ProductCard from './components/ProductCard';
import ProductForm from './components/ProductForm';
import DeleteConfirmation from './components/DeleteConfirmation';
export default function App() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reload, setReload] = useState(0);
  const [modal, setModal] = useState(null);
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState('');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError('');
    productApi.list(controller.signal).then(setProducts).catch((error) => {
      if (error.name !== 'AbortError') setLoadError(friendlyError(error));
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [reload]);
  function openModal(type, product = null) { setServerError(''); setNotice(''); setModal({ type, product }); }
  function closeModal() { if (!busy) { setModal(null); setServerError(''); } }
  async function handleSave(data) {
    if (busy) return;
    setBusy(true); setServerError('');
    try {
      const isEdit = modal.type === 'edit';
      const saved = await (isEdit ? productApi.update(data) : productApi.create(data));
      setProducts((old) => isEdit ? old.map((product) => product.id === saved.id ? saved : product) : [...old, saved].sort((a, b) => a.id - b.id));
      setQuery(''); setModal(null);
      setNotice(`Produk “${saved.name}” berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}.`);
    } catch (error) { setServerError(friendlyError(error)); }
    finally { setBusy(false); }
  }
  async function handleDelete(id) {
    if (busy) return;
    setBusy(true); setServerError('');
    try {
      await productApi.remove(id);
      setProducts((old) => old.filter((product) => product.id !== id));
      setNotice(`Produk “${modal.product.name}” berhasil dihapus.`); setModal(null);
    } catch (error) { setServerError(friendlyError(error)); }
    finally { setBusy(false); }
  }
  const filtered = products.filter((product) => product.name.toLocaleLowerCase('id').includes(query.trim().toLocaleLowerCase('id')));
  return <main className="workspace">
    <header className="page-header">
      <div><h1>Manajemen Produk</h1><p>Kelola daftar produk dan harga dalam satu tempat.</p></div>
      <button className="button primary add-button" onClick={() => openModal('add')} disabled={loading || Boolean(loadError)}><Icon name="plus" />Tambah Produk</button>
    </header>
    <div className="toolbar">
      <div className="search-box"><Icon name="search" /><input aria-label="Cari nama produk" placeholder="Cari nama produk…" value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button aria-label="Hapus pencarian" onClick={() => setQuery('')}><Icon name="close" size={16} /></button>}</div>
      <span className="product-count">{loading ? 'Memuat…' : `${products.length} produk`}</span>
    </div>
    {notice && <div className="notice" role="status"><Icon name="check" /><span>{notice}</span><button aria-label="Tutup notifikasi" onClick={() => setNotice('')}><Icon name="close" size={16} /></button></div>}
    {loading ? <div className="empty-state" role="status"><div className="spinner" /><p>Memuat daftar produk…</p></div>
      : loadError ? <div className="empty-state error-state" role="alert"><Icon name="box" size={34} /><h2>Daftar produk belum dapat dimuat</h2><p>{loadError}</p><button className="button outline" onClick={() => setReload((old) => old + 1)}>Coba Lagi</button></div>
      : filtered.length ? <section className="product-grid" aria-label="Daftar produk">{filtered.map((product) => <ProductCard key={product.id} product={product} onEdit={(selected) => openModal('edit', selected)} onDelete={(selected) => openModal('delete', selected)} />)}</section>
      : <div className="empty-state"><div className="empty-icon"><Icon name={query ? 'search' : 'box'} size={30} /></div><h2>{query ? 'Produk tidak ditemukan' : 'Belum ada produk'}</h2><p>{query ? `Tidak ada produk dengan nama “${query}”. Coba kata kunci lain.` : 'Tambahkan produk pertama untuk mulai mengelola daftar kamu.'}</p>{query ? <button className="button outline" onClick={() => setQuery('')}>Hapus Pencarian</button> : <button className="button primary" onClick={() => openModal('add')}>Tambah Produk</button>}</div>}
    {!loading && !loadError && <p className="list-summary" aria-live="polite">Menampilkan {filtered.length} dari {products.length} produk</p>}
    {modal && modal.type !== 'delete' && <ProductForm product={modal.product} onSave={handleSave} onClose={closeModal} busy={busy} serverError={serverError} />}
    {modal?.type === 'delete' && <DeleteConfirmation product={modal.product} onConfirm={handleDelete} onClose={closeModal} busy={busy} serverError={serverError} />}
  </main>;
}
