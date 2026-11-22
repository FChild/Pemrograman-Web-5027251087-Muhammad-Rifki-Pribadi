import { Link } from 'react-router-dom';
import { formatPrice } from '../api';
export default function ProductCard({ product, onEdit, onDelete, view = 'grid' }) {
  return <article className={`product-card ${view === 'list' ? 'grid items-center gap-4 sm:grid-cols-[1fr_auto]' : ''}`} aria-label={`Produk ${product.name}`}>
    <div><span className="product-id">ID: {product.id}</span>
      <h2><Link className="hover:text-blue-600 hover:underline" to={`/products/${product.id}`}>{product.name}</Link></h2>
      <p className="product-price">{formatPrice(product.price)}</p>
    </div>
    <div className={`card-actions ${view === 'list' ? 'mt-0 flex-wrap' : ''}`}>
      <Link className="button outline flex-1" to={`/products/${product.id}`}>Detail</Link>
      <button className="button outline" onClick={() => onEdit(product)}>Edit</button>
      <button className="button danger-outline" onClick={() => onDelete(product)}>Hapus</button>
    </div>
  </article>;
}
