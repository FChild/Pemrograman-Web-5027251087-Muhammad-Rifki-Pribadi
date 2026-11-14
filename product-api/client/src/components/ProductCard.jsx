import { formatPrice } from '../api';
export default function ProductCard({ product, onEdit, onDelete }) {
  return <article className="product-card" aria-label={`Produk ${product.name}`}>
    <span className="product-id">ID: {product.id}</span>
    <h2>{product.name}</h2>
    <p className="product-price">{formatPrice(product.price)}</p>
    <div className="card-actions">
      {/* Fungsi dari props baru dipanggil ketika tombol diklik, bukan saat render. */}
      <button className="button outline" onClick={() => onEdit(product)}>Edit</button>
      <button className="button danger-outline" onClick={() => onDelete(product)}>Hapus</button>
    </div>
  </article>;
}
