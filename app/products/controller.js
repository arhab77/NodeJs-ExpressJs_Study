const connection = require('../../config/mysql');
const path = require('path');
const fs = require('fs');


const index = (req, res) => {
    const {search} = req.query;
    let exec = {};
    if(search){
        exec = {
            sql: 'SELECT * FROM products WHERE nama LIKE ?',
            values: [`%${search}%`]
        }
    } else {
        exec = {
            sql: 'SELECT * FROM products'
        }
    }
    connection.query(exec, _response(res));
}

const view = (req, res) => {
    connection.query({
        sql: 'SELECT * FROM products WHERE id = ?',
        values: [req.params.id]
    }, _response(res));
}

const store = (req, res) => {
    const {users_id, nama, price, stock, status} = req.body;
    const image = req.file;
    if(image){
        const target = path.join(__dirname, '../../uploads', image.originalname);
        fs.renameSync(image.path, target)
        connection.query({
            sql: 'INSERT INTO products (users_id, nama, price, stock, status, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            values: [users_id, nama, price, stock, status, `http://localhost:3000/public/${image.originalname}`]
        }, _response(res));
    }
}

const update = (req, res) => {
    const {users_id, nama, price, stock, status} = req.body;
    const image = req.file;
    let sql = '';
    let values = [];
    if(image){
        const target = path.join(__dirname, '../../uploads', image.originalname);
        fs.renameSync(image.path, target)
        sql = 'UPDATE products SET users_id = ?, nama = ?, price = ?, stock = ?, status = ?, image_url = ? WHERE id = ?';
        values = [users_id, nama, price, stock, status, `http://localhost:3000/public/${image.originalname}`, req.params.id]
    } else {
        sql = 'UPDATE products SET users_id = ?, nama = ?, price = ?, stock = ?, status = ? WHERE id = ?';
        values = [users_id, nama, price, stock, status, req.params.id]
    }
    connection.query({sql, values}, _response(res));
}

const _response = (res) => {
    return (error, result) => {
        if(error){
            res.send({
                status: 'failed',
                response: error
            });
        } else {
            res.send({
                status: 'success',
                response: result
            });
        }
    }
}

const destroy = (req, res) => {
    connection.query({
        sql: 'DELETE FROM products WHERE id = ?',
        values: [req.params.id]
    }, _response(res));
}

module.exports = {
    index,
    view,
    store,
    update,
    destroy
}