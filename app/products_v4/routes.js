const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest: 'uploads'});
const fs = require('fs');
const path = require('path');
const products = require('./model');
const { ObjectId } = require('mongodb');

router.get('/products', (req, res) => {
    products.find()
    .then(result => res.send(result))
    .catch(error => res.send(error));
});

router.get('/products/:id', (req, res) => {
    const {id} = req.params;
    products.findOne({_id: new ObjectId(id)})
    .then(result => res.send(result))
    .catch(error => res.send(error));
});

router.post('/products', upload.single('image'), (req, res) => {
    const {name, price, stock, status} = req.body;
    const image = req.file;
    if(image){
        const target = path.join(__dirname, '../../uploads', image.originalname);
        fs.renameSync(image.path, target)
        products.create({name, price, stock, status, image_url: `http://localhost:3000/public/${image.originalname}`})
        .then(result => res.send(result))
        .catch(error => res.send(error));
    }
});

router.put('/products/:id', upload.single('image'), (req, res) => {
    const {nama, price, stock, status} = req.body;
    const image = req.file;
    const {id} = req.params;

    if(image){
        const target = path.join(__dirname, '../../uploads', image.originalname);
        fs.renameSync(image.path, target);
        const updateData = {nama, price, stock, status, image_url: `http://localhost:3000/public/${image.originalname}`};
        products.updateOne({_id: new ObjectId(id)}, {$set: updateData})
        .then(result => res.send(result))
        .catch(error => res.send(error));
    } else {
        const updateData = {nama, price, stock, status};
        products.updateOne({_id: new ObjectId(id)}, {$set: updateData})
        .then(result => res.send(result))
        .catch(error => res.send(error));
    }
});

router.delete('/products/:id', upload.single('image'), (req, res) => {
    const {id} = req.params;
    products.deleteOne({_id: new ObjectId(id)})
    .then(result => res.send(result))
    .catch(error => res.send(error));
})

module.exports = router;