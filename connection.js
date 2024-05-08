const { Sequelize } = require('sequelize');
require('dotenv').config(); 

const createSequelizeInstance = () => {
    const sequelize = new Sequelize({
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    return sequelize;
};

module.exports = { createSequelizeInstance };
