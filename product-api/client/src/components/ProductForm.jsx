import { useState } from 'react';
import Modal from './Modal';
export default function ProductForm({ product, onSave, onClose, busy, serverError }) {
  const isEdit = Boolean(product);
  const [name, setName] = useState(product?.name ?? '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [errors, setErrors] = useState({});
  function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;
    const next = {};
    if (!name.trim()) next.name = 'Nama produk wajib diisi.';
    if (price.trim() === '' || !Number.isFinite(Number(price)) || Number(price) <= 0) next.price = 'Harga harus berupa angka lebih dari 0.';
    setErrors(next);
    if (Object.keys(next).length) return;
    onSave({ ...(isEdit ? { id: product.id } : {}), name: name.trim(), price: Number(price) });
  }
  return <Modal title={isEdit ? 'Edit Produk' : 'Tambah Produk'} description={isEdit ? 'Perbarui informasi produk yang dipilih.' : 'Masukkan informasi produk baru.'} onClose={onClose} busy={busy}>
    {isEdit && <p className="edit-id">ID: {product.id}</p>}
    <form noValidate onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="product-name">Nama Produk</label>
        <input id="product-name" autoFocus value={name} onChange={(e) => { setName(e.target.value); setErrors((old) => ({ ...old, name: '' })); }} placeholder="Contoh: Pulpen" disabled={busy} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
        {errors.name && <p id="name-error" className="field-error">{errors.name}</p>}
      </div>
      <div className="field">
        <label htmlFor="product-price">Harga (Rp)</label>
        <input id="product-price" type="number" step="any" min="0.01" inputMode="decimal" value={price} onChange={(e) => { setPrice(e.target.value); setErrors((old) => ({ ...old, price: '' })); }} placeholder="Contoh: 5000" disabled={busy} aria-invalid={Boolean(errors.price)} aria-describedby={errors.price ? 'price-error' : 'price-hint'} />
        {errors.price ? <p id="price-error" className="field-error">{errors.price}</p> : <p id="price-hint" className="field-hint">Harga harus lebih dari 0.</p>}
      </div>
      {serverError && <p className="form-error" role="alert">{serverError}</p>}
      <div className="modal-actions">
        <button type="button" className="button outline" onClick={onClose} disabled={busy}>Batal</button>
        <button type="submit" className="button primary" disabled={busy}>{busy ? 'Menyimpan…' : isEdit ? 'Simpan Perubahan' : 'Simpan Produk'}</button>
      </div>
    </form>
  </Modal>;
}
