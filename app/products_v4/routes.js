const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest: 'uploads'});
const fs = require('fs');
const path = require('path');
const products = require('./model');
const { ObjectId } = require('mongodb');

router.get('/products', async(req, res) => {
    try {
        const result = await products.find()
        res.send(result);       
    } catch (error) {
        res.send(error);
    }
});

router.get('/products/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const result = await products.findOne({_id: new ObjectId(id)})
        res.send(result);
    } catch (error) {
        res.send(error)
    }
});

router.post('/products', upload.single('image'), async(req, res) => {
    try {
        const {name, price, stock, status} = req.body;
        const image = req.file;
        if(image){
            const target = path.join(__dirname, '../../uploads', image.originalname);
            fs.renameSync(image.path, target)
            const result = await products.create({name, price, stock, status, image_url: `http://localhost:3000/public/${image.originalname}`})
            res.send(result);
        }       
    } catch (error) {
        res.send(error);
    }
});

router.put('/products/:id', upload.single('image'), async(req, res) => {
    try {
        const {nama, price, stock, status} = req.body;
        const image = req.file;
        const {id} = req.params;
    
        if(image){
            const target = path.join(__dirname, '../../uploads', image.originalname);
            fs.renameSync(image.path, target);
            const updateData = {nama, price, stock, status, image_url: `http://localhost:3000/public/${image.originalname}`};
            const result = await products.updateOne({_id: new ObjectId(id)}, {$set: updateData})
            .res.send(result);
        } else {
            const updateData = {nama, price, stock, status};
            const result = await products.updateOne({_id: new ObjectId(id)}, {$set: updateData})
            res.send(result);
        }     
    } catch (error) {
        res.send(error);
    }
});

router.delete('/products/:id', upload.single('image'), async(req, res) => {
    try {
        const {id} = req.params;
        const result = await products.deleteOne({_id: new ObjectId(id)})
        res.send(result); 
    } catch (error) {
        res.send(error);
    }
})

module.exports = router;