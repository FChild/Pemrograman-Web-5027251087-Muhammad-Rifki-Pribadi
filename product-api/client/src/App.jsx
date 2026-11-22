import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
export function AppRoutes() {
  return <SettingsProvider>
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <nav aria-label="Navigasi utama" className="mx-auto flex max-w-[1104px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <NavLink to="/products" className="text-lg font-bold tracking-tight text-slate-900">Produk<span className="text-blue-600">.</span></NavLink>
          <div className="flex gap-2">{[['/products', 'Produk'], ['/settings', 'Settings']].map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `rounded-lg px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-blue-500 ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>{label}</NavLink>)}</div>
        </nav>
      </header>
      <main className="mx-auto max-w-[1104px] px-5 py-10 sm:px-8 sm:py-12">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  </SettingsProvider>;
}
export default function App() { return <BrowserRouter><AppRoutes /></BrowserRouter>; }
