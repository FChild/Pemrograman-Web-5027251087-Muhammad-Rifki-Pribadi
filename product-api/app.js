require('dotenv').config();
const express = require('express');
const path = require('node:path');
const prisma = require('./config/prisma');
const productRoutes = require('./routes/productRoutes');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// Endpoint API untuk frontend Tugas 4.
app.use('/api/products', productRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Endpoint API tidak ditemukan' });
});

// Tetap mendukung request JSON dari tugas sebelumnya.
app.use('/products', (req, res, next) => {
  const isHtml = (req.headers.accept || '').includes('text/html');

  if (req.method === 'GET' && isHtml) {
    return next();
  }

  return productRoutes(req, res, next);
});

// File hasil build React.
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Mendukung refresh halaman detail, Settings, dan halaman 404.
app.get('*', (req, res, next) => {
  const isHtml = (req.headers.accept || '').includes('text/html');

  if (!isHtml || path.extname(req.path)) {
    return next();
  }

  res.sendFile(
    path.join(__dirname, 'client', 'dist', 'index.html'),
    (error) => {
      if (error) next(error);
    }
  );
});

app.use((req, res) => res.status(404).json({ message: 'Endpoint tidak ditemukan' }));
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Format JSON tidak valid' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Body request terlalu besar' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }
  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
});
if (require.main === module) {
  prisma.$connect().then(() => {
    const server = app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${server.address().port}`));
    server.on('error', async (error) => {
      console.error('Server gagal berjalan:', error.message);
      await prisma.$disconnect();
      process.exitCode = 1;
    });
    const shutdown = () => server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  }).catch((error) => {
    console.error('Koneksi database gagal:', error.message);
    process.exitCode = 1;
  });
}
module.exports = app;
