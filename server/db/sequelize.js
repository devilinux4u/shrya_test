const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config');
const sequelize = new Sequelize(config.db_con);

const model = require('./model');
const user = model.user(sequelize, DataTypes);
const contact = model.contact(sequelize, DataTypes);
const Vehicle = model.vehicle(sequelize, DataTypes);
const VehicleImage = model.vimg(sequelize, DataTypes);


Vehicle.hasMany(VehicleImage, { foreignKey: 'vehicleId', onDelete: 'CASCADE' });
VehicleImage.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

try {
    sequelize.sync();
    console.log('Database synced succefully');
} catch (error) {
    console.error('Unable to connect to the database:\n', error);
}


module.exports = {
    sequelize,
    users: user,
    contacts: contact,
    vehicles: Vehicle,
    v_img: VehicleImage
}