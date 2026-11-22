import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
export default function SettingsPage() {
  const { view, setView, storageWarning } = useSettings();
  return <div className="mx-auto max-w-2xl">
    <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
    <p className="mt-2 text-sm text-slate-500">Atur cara daftar produk ditampilkan.</p>
    <fieldset className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <legend className="px-2 text-base font-semibold">Tampilan produk</legend>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{[['grid', 'Grid', 'Kartu produk dalam beberapa kolom.'], ['list', 'List', 'Produk berjajar dalam satu daftar.']].map(([value, label, description]) => <label key={value} className={`cursor-pointer rounded-xl border-2 p-5 transition ${view === value ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
        <span className="flex items-center gap-3"><input className="size-4 accent-blue-600" type="radio" name="view" value={value} checked={view === value} onChange={() => setView(value)} /><span className="font-semibold">{label}</span></span>
        <span className="mt-3 block text-sm leading-6 text-slate-500">{description}</span>
      </label>)}</div>
      <p role="status" className="mt-5 text-sm text-slate-600">Tampilan aktif: <strong>{view === 'grid' ? 'Grid' : 'List'}</strong>. Pilihan langsung diterapkan.</p>
      {storageWarning ? <p role="alert" className="mt-3 text-sm text-amber-700">{storageWarning}</p> : <p className="mt-2 text-xs text-slate-500">Preferensi disimpan di browser ini dan tetap berlaku setelah refresh.</p>}
    </fieldset>
    <Link to="/products" className="button primary mt-6">Kembali ke Produk</Link>
  </div>;
}
