const express = require('express');
const controller = require('../controllers/productController');
const router = express.Router();
// Express 4 membutuhkan penerusan rejected Promise ke error middleware.
const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
router.get('/', asyncHandler(controller.getAllProducts));
router.get('/:id', asyncHandler(controller.getProductById));
router.post('/', asyncHandler(controller.createProduct));
router.put('/', asyncHandler(controller.updateProduct));
router.delete('/:id', asyncHandler(controller.deleteProduct));
module.exports = router;
