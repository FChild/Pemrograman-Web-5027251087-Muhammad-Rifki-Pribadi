import { createContext, useContext, useState } from 'react';
const SettingsContext = createContext(null);
const KEY = 'product-management:view';
export function SettingsProvider({ children }) {
  const [view, setViewState] = useState(() => {
    try { return window.localStorage.getItem(KEY) === 'list' ? 'list' : 'grid'; }
    catch { return 'grid'; }
  });
  const [storageWarning, setStorageWarning] = useState('');
  function setView(value) {
    if (!['grid', 'list'].includes(value)) return;
    setViewState(value);
    try { window.localStorage.setItem(KEY, value); setStorageWarning(''); }
    catch { setStorageWarning('Pilihan berlaku untuk sesi ini. Browser tidak mengizinkan penyimpanan preferensi.'); }
  }
  return <SettingsContext.Provider value={{ view, setView, storageWarning }}>{children}</SettingsContext.Provider>;
}
export function useSettings() {
  const value = useContext(SettingsContext);
  if (!value) throw new Error('useSettings harus berada di dalam SettingsProvider');
  return value;
}
