const mysql = require('mysql');

//koneksi ke database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'edu-cruds'
});

module.exports = connection;