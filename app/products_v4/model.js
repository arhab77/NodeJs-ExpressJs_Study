const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'field name harus ada'],
        minlength: 3,
        maxlength: 50
    },
    price: {
        type: Number,
        required: true,
        min: 1000,
        max: 100000000
    },
    stock: Number,
    status: {
        type: Boolean,
        default: true
    },
    image_url: {
        type: String
    }
});

const products = mongoose.model('products', productSchema);
module.exports = products;