// URL relatif: frontend dan API dilayani Express pada origin yang sama.
async function request(path = '', options = {}) {
  const response = await fetch(`/api/products${path}`, {
    ...options,
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
  });
  let data;
  try { data = await response.json(); }
  catch { throw new Error('Respons server tidak valid. Pastikan API sedang berjalan.'); }
  if (!response.ok) {
    const error = new Error(data.message || 'Permintaan gagal. Silakan coba lagi.');
    error.status = response.status;
    throw error;
  }
  return data;
}
export const productApi = {
  get: (id, signal) => request(`/${encodeURIComponent(id)}`, { signal }),
  list: (signal) => request('', { signal }),
  create: (data) => request('', { method: 'POST', body: JSON.stringify(data) }),
  // Sesuai tugas sebelumnya: PUT /products, id disertakan di body JSON.
  update: (data) => request('', { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/${id}`, { method: 'DELETE' }),
};
export function friendlyError(error) {
  return error instanceof TypeError ? 'Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.' : error.message;
}
export const formatPrice = (price) => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 2,
}).format(price);
