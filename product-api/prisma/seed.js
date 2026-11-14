const prisma = require('../config/prisma');
const initialProducts = require('../data/products');
async function main() {
  // Upsert tanpa update: menjalankan seed lagi tidak menimpa produk yang diedit.
  for (const product of initialProducts) {
    await prisma.product.upsert({
      where: { id: product.id }, update: {}, create: product,
    });
  }
  console.log('Seed selesai: data awal produk tersedia.');
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
