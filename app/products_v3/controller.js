const { ObjectId } = require("mongodb");
const db = require("../../config/mongodb")
const fs = require('fs');
const path = require('path');
const { error } = require("console");

const index = async(req, res) => {
    try {
        const result = await db.collection('products').find()
        .toArray()
        res.send(result);    
    } catch (error) {
        res.send(error);
    }
}

const view = async(req, res) => {
    try {
        const {id} = req.params;
        const result = await db.collection('products').findOne({_id: new ObjectId(id)})
        res.send(result);    
    } catch (error) {
        res.send(error);
    }
}

const store = async(req, res) => {
    try {
        const {nama, price, stock, status} = req.body;
        const image = req.file;
        if(image){
            const target = path.join(__dirname, '../../uploads', image.originalname);
            fs.renameSync(image.path, target)
            const result = await db.collection('products').insertOne({nama, price, stock, status, image_url: `http://localhost:3000/public/${image.originalname}`})
            res.send(result);
        }       
    } catch (error) {
        res.send(error);
    }
}

const update = async(req, res) => {
    try {
        const {nama, price, stock, status} = req.body;
        const image = req.file;
        const {id} = req.params;
        if(image){
            const target = path.join(__dirname, '../../uploads', image.originalname);
            fs.renameSync(image.path, target);
            const updateData = {nama, price, stock, status, image_url: `http://localhost:3000/public/${image.originalname}`};
            const result = await db.collection('products').updateOne({_id: new ObjectId(id)}, {$set: updateData});
            res.send(result);
        } else {
            const updateData = {nama, price, stock, status};
            const result = await db.collection('products').updateOne({_id: new ObjectId(id)}, {$set: updateData})
            res.send(result);
        }        
    } catch (error) {
        res.send(error);
    }
}

const destroy = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await db.collection('products').deleteOne({_id: new ObjectId(id)});
        res.send(result);
    } catch (error) {
        res.send(error)
    }
}

module.exports = {
    index,
    view,
    store,
    update,
    destroy
}