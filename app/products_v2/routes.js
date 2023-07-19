const router = require('express').Router();
const product = require('./model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const upload = multer({dest: 'uploads'});


router.post('/products',upload.single('image'), async(req, res) => {
    const {user_id, name, price, stock, status} = req.body;
    const image = req.file;
    if(image){
        const target = path.join(__dirname, '../../uploads', image.originalname);
        fs.renameSync(image.path, target);
        try{
            await product.sync();
            const result = await product.create({user_id, name, price, stock, status, image_url: `http://localhost:3000/public/${image.originalname}`});
            res.send(result);
        } catch(e) {
            res.send(e);
        }
    }
});

router.get('/products', async(req, res) => {
    const {search} = await req.body;
    if(search){
        try{
            const result = await product.findAll({where: {name: {[Op.like]: `%${search}%`}}});
            res.send(result);
        } catch(e){
            res.send(e);
        }
    } else {
        try {
            await product.sync();
            const result = await product.findAll();
            res.send(result);
        } catch(e) {
            res.send(e);
        }
    }
});

router.get('/products/:id', async(req, res) => {
    const id = req.params.id;
    try{
        await product.sync();
        const result = await product.findByPk(id);
        res.send(result);
    } catch(e){
        res.send(e);
    }
});

router.put('/products/:id', upload.single('image'), async(req, res) => {
    const id = req.params.id;
    const {user_id, name, price, stock, status} = req.body;
    const image = req.file;
    if(image){
        const target = path.join(__dirname, '../../uploads', image.originalname);
        fs.renameSync(image.path, target);
        try{
            await product.sync();
            const image_url = `http://localhost:3000/public/${image.originalname}`;
            const result = await product.update({user_id, name, price, stock, status, image_url}, {where: {
                id: id
            }});
            res.send(result);
        } catch(e) {
            res.send(e);
        }
    } else {
        try{
            await product.sync();
            const result = await product.update({user_id, name, price, stock, status}, {where: {
                id:id
            }});
            res.send(result);
        } catch(e) {
            res.send(e);
        }
    }
});

router.delete('/products/:id', upload.single('image'), async(req, res) => {
    const id = req.params.id;
    try{
        await product.sync();
        const result = await product.destroy(id);
        res.send(result);
    } catch(e) {
        res.send(e);
    }
});

module.exports = router;