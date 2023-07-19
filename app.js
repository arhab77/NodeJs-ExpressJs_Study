const express = require('express');
const app = express();
const productsRouter = require('./app/products/routes');
const productsRouterV2 = require('./app/products_v2/routes');
const logger = require('morgan');
const path = require('path')

app.use(logger('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'uploads')))
app.use('/api/v1', productsRouter);
app.use('/api/v2', productsRouterV2);
app.use((req, res, next) => {
    res.status(404);
    res.send({
        status: 'failed',
        message: 'resource ' + req.originalUrl + 'Not Found'
    })
})

app.listen(3000, () => console.log('Server: http://localhost:3000'))