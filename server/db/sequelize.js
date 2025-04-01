const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config');

// Initialize Sequelize with explicit naming conventions
const sequelize = new Sequelize({
  ...config.db_con,  // Ensure this contains proper connection details
  define: {
    freezeTableName: true,  // Prevent pluralization
    underscored: true      // Use snake_case for automatic table names
  },
  dialectOptions: {
    // Additional MySQL-specific options if needed
  }
});

const model = require('./model');

// Initialize models - using exact names from model.js
const user = model.user(sequelize, DataTypes);
const contact = model.contact(sequelize, DataTypes);
const vehicles = model.vehicle(sequelize, DataTypes);
const VehicleImage = model.vimg(sequelize, DataTypes);
const VehicleWishlist = model.VehicleWishlist(sequelize, DataTypes);
const WishlistImage = model.WishlistImage(sequelize, DataTypes);
const LostAndFound = model.LostAndFound(sequelize, DataTypes);
const LostAndFoundImage = model.LostAndFoundImage(sequelize, DataTypes);
const rental = model.rental(sequelize, DataTypes);
const RentalAllVehicles = model.rentalAllVehicles(sequelize, DataTypes);
const RentalAllVehicleImages = model.rentalAllVehicleImages(sequelize, DataTypes);

// Fix the Vehicle-VehicleImage association with explicit table names
vehicles.hasMany(VehicleImage, {
  foreignKey: 'vehicleId',
  sourceKey: 'id',
  as: 'images',
  onDelete: 'CASCADE',
  hooks: true
});

VehicleImage.belongsTo(vehicles, {
  foreignKey: 'vehicleId',
  targetKey: 'id',
  as: 'vehicle',
  onDelete: 'CASCADE',
  hooks: true
});

// Other associations remain the same but with explicit references
user.hasMany(vehicles, { foreignKey: 'uid' });
user.hasMany(VehicleWishlist, { foreignKey: 'uid' });
user.hasMany(LostAndFound, { foreignKey: 'uid' });
user.hasMany(rental, { foreignKey: 'userId' });

// VehicleWishlist associations
VehicleWishlist.hasMany(WishlistImage, {
  foreignKey: 'wishlistId',
  onDelete: 'CASCADE'
});
WishlistImage.belongsTo(VehicleWishlist, {
  foreignKey: 'wishlistId'
});

// LostAndFound associations
LostAndFound.hasMany(LostAndFoundImage, {
  foreignKey: 'lostAndFoundId',
  onDelete: 'CASCADE'
});
LostAndFoundImage.belongsTo(LostAndFound, {
  foreignKey: 'lostAndFoundId'
});

// Rental associations
rental.belongsTo(user, { foreignKey: 'userId' });
rental.belongsTo(vehicles, { foreignKey: 'vehicleId' });

// RentalAllVehicles associations
RentalAllVehicles.hasMany(RentalAllVehicleImages, {
  foreignKey: 'vehicleId',
  onDelete: 'CASCADE'
});
RentalAllVehicleImages.belongsTo(RentalAllVehicles, {
  foreignKey: 'vehicleId'
});

// Sync with error handling
(async () => {
  try {
    // First sync with force: true to reset (only in development)
    await sequelize.sync({ force: true });
    console.log('Database tables created!');
    
    // Then switch to alter: true for future syncs
    // await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('Database sync error:', error);
    if (error.parent) {
      console.error('Database error details:', error.parent.sqlMessage);
      console.error('Failed SQL:', error.parent.sql);
    }
  }
})();

module.exports = {
  sequelize,
  user,
  contact,
  vehicles,
  VehicleImage,
  VehicleWishlist,
  WishlistImage,
  LostAndFound,
  LostAndFoundImage,
  rental,
  RentalAllVehicles,
  RentalAllVehicleImages
};