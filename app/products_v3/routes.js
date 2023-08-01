const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest: 'uploads'});
const productsController = require('./controller')

router.get('/products', productsController.index);
router.get('/products/:id', productsController.view);
router.post('/products', upload.single('image'), productsController.store);
router.put('/products/:id', upload.single('image'), productsController.update);
router.delete('/products/:id', upload.single('image'), productsController.destroy);

module.exports = router;