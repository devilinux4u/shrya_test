const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config');
const sequelize = new Sequelize(config.db_con);

const model = require('./model');

// Initialize models
const user = model.user(sequelize, DataTypes);
const contact = model.contact(sequelize, DataTypes);
const Vehicle = model.vehicle(sequelize, DataTypes);
const VehicleImage = model.vimg(sequelize, DataTypes);
const VehicleWishlist = model.VehicleWishlist(sequelize, DataTypes); // Ensure this is correct

// Debug log
console.log('VehicleWishlist Model:', VehicleWishlist);

// Associations
Vehicle.hasMany(VehicleImage, { foreignKey: 'vehicleId', onDelete: 'CASCADE' });
VehicleImage.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

VehicleWishlist.belongsTo(user, { foreignKey: 'userId' });
user.hasMany(VehicleWishlist, { foreignKey: 'userId' });

VehicleWishlist.belongsTo(Vehicle, { foreignKey: 'vehicleId' });
Vehicle.hasMany(VehicleWishlist, { foreignKey: 'vehicleId' });

// Sync database
sequelize
  .sync()
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((error) => {
    console.error('Unable to sync database:', error);
  });

module.exports = {
  sequelize,
  users: user,
  contacts: contact,
  vehicles: Vehicle,
  v_img: VehicleImage,
  vehicleWishlist: VehicleWishlist, // Ensure this is exported
};