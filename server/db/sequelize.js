const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config');
const sequelize = new Sequelize(config.db_con);

const model = require('./model');
const user = model.user(sequelize, DataTypes);

try {
    sequelize.sync();
    console.log('Database synced succefully');
} catch (error) {
    console.error('Unable to connect to the database:\n', error);
}


module.exports = {
    sequelize,
    users: user,
}