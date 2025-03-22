const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config');
const sequelize = new Sequelize(config.db_con);

const model = require('./model'); // Import the model.js file

// Initialize models
const user = model.user(sequelize, DataTypes);
const contact = model.contact(sequelize, DataTypes);
const Vehicle = model.vehicle(sequelize, DataTypes);
const VehicleImage = model.vimg(sequelize, DataTypes);
const VehicleWishlist = model.VehicleWishlist(sequelize, DataTypes);
const LostAndFound = model.LostAndFound(sequelize, DataTypes); // Initialize LostAndFound model
const WishlistImage = model.WishlistImage(sequelize, DataTypes);
const LostAndFoundImage = model.LostAndFoundImage(sequelize, DataTypes);

// Associations
Vehicle.hasMany(VehicleImage, { foreignKey: 'vehicleId', onDelete: 'CASCADE' });
VehicleImage.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

// Associations
VehicleWishlist.hasMany(WishlistImage, {
  foreignKey: 'wishlistId',
  as: 'images',
  onDelete: 'CASCADE',
});
WishlistImage.belongsTo(VehicleWishlist, {
  foreignKey: 'wishlistId',
  as: 'wishlist',
});

LostAndFound.hasMany(LostAndFoundImage, { foreignKey: 'lostAndFoundId', as: 'images' });
LostAndFoundImage.belongsTo(LostAndFound, { foreignKey: 'lostAndFoundId' });

LostAndFound.belongsTo(user, { foreignKey: 'uid', as: 'user' });

Vehicle.belongsTo(user, { foreignKey: 'uid', as: 'user' });


// Sync database
sequelize.sync({ alter: true }) // Updates the schema without dropping tables // Use { force: true } to drop and recreate tables (use with caution in production)
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
  vehicleWishlist: VehicleWishlist,
  LostAndFound,
  wishlistImage: WishlistImage, // Export LostAndFound model
  LostAndFoundImage
};