const {Sequelize} = require('sequelize');

const sequalize = new Sequelize ({
    database: 'edu-cruds-v2',
    username: 'root',
    password: 'root',
    host: 'localhost',
    dialect: 'mysql'
});

(async() => {
    try {
        await sequalize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = sequalize;