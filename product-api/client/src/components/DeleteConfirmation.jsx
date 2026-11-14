import Modal from './Modal';
import { formatPrice } from '../api';
export default function DeleteConfirmation({ product, onConfirm, onClose, busy, serverError }) {
  return <Modal title="Hapus Produk?" description="Produk yang dihapus tidak dapat dikembalikan." danger onClose={onClose} busy={busy}>
    <div className="delete-preview">
      <span className="product-id">ID: {product.id}</span>
      <h3>{product.name}</h3>
      <p className="product-price">{formatPrice(product.price)}</p>
    </div>
    {serverError && <p className="form-error" role="alert">{serverError}</p>}
    <div className="modal-actions">
      <button className="button outline" onClick={onClose} disabled={busy} autoFocus>Batal</button>
      <button className="button danger" onClick={() => onConfirm(product.id)} disabled={busy}>{busy ? 'Menghapus…' : 'Hapus Produk'}</button>
    </div>
  </Modal>;
}
