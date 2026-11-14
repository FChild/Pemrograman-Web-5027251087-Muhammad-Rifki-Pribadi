// Membuka koneksi SQLite membuat file kosong jika belum ada.
// Tabel tetap dibuat oleh Prisma Migrate; query ini tidak mengubah data.
const prisma = require('../config/prisma');
prisma.$queryRaw`SELECT 1`
  .then(() => console.log('File database SQLite siap.'))
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
