const prisma = require('../config/prisma');

// ID Prisma Int dibatasi ke integer positif 32 bit.
const validId = (id) => Number.isInteger(id) && id > 0 && id <= 2147483647;
const parseId = (value) => typeof value === 'string' && /^[1-9]\d*$/.test(value)
  && validId(Number(value)) ? Number(value) : null;
const validProduct = (body) => body && !Array.isArray(body)
  && typeof body.name === 'string' && body.name.trim() !== ''
  && typeof body.price === 'number' && Number.isFinite(body.price) && body.price >= 0;
const invalidProduct = (res) => res.status(400).json({
  message: 'name (string tidak kosong) dan price (number >= 0) wajib diisi',
});

// GET /products: mengambil seluruh data dari database.
const getAllProducts = async (req, res) => {
  res.status(200).json(await prisma.product.findMany({ orderBy: { id: 'asc' } }));
};
// Endpoint lama dipertahankan.
const getProductById = async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: 'id harus integer positif yang valid' });
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
  res.status(200).json(product);
};
const createProduct = async (req, res) => {
  if (!validProduct(req.body)) return invalidProduct(res);
  const product = await prisma.product.create({
    data: { name: req.body.name.trim(), price: req.body.price },
  });
  res.status(201).json(product);
};
// Sesuai tugas: body PUT sama seperti POST, ditambah id.
const updateProduct = async (req, res) => {
  if (!validId(req.body?.id)) return res.status(400).json({ message: 'id pada body harus integer positif yang valid' });
  if (!validProduct(req.body)) return invalidProduct(res);
  const product = await prisma.product.update({
    where: { id: req.body.id },
    data: { name: req.body.name.trim(), price: req.body.price },
  });
  res.status(200).json(product);
};
const deleteProduct = async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: 'id harus integer positif yang valid' });
  const product = await prisma.product.delete({ where: { id } });
  res.status(200).json({ message: 'Produk berhasil dihapus', data: product });
};
module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
