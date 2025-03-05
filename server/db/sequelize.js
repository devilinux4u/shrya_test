const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config');
const sequelize = new Sequelize(config.db_con);

const model = require('./model');

// Initialize models
const user = model.user(sequelize, DataTypes);
const contact = model.contact(sequelize, DataTypes);
const Vehicle = model.vehicle(sequelize, DataTypes);
const VehicleImage = model.vimg(sequelize, DataTypes);
const VehicleWishlist = model.VehicleWishlist(sequelize, DataTypes);
const LostAndFound = model.LostAndFound(sequelize, DataTypes); // Initialize LostAndFound model
const WishlistImage = model.WishlistImage(sequelize, DataTypes);
const LostAndFoundImage = model.LostAndFoundImage(sequelize, DataTypes);
const rental = model.rental(sequelize, DataTypes);
const RentalAllVehicles = model.rentalAllVehicles(sequelize, DataTypes);
const RentalAllVehicleImages = model.rentalAllVehicleImages(sequelize, DataTypes);


Vehicle.hasMany(VehicleImage, { foreignKey: 'vehicleId', onDelete: 'CASCADE' });
VehicleImage.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

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
VehicleWishlist.belongsTo(user, { foreignKey: "uid", as: "user" });




// RentalAllVehicles associations
RentalAllVehicles.hasMany(RentalAllVehicleImages, {
  foreignKey: 'vehicleId',
  onDelete: 'CASCADE'
});
RentalAllVehicleImages.belongsTo(RentalAllVehicles, {
  foreignKey: 'vehicleId'
});


// RentalAllVehicles.hasMany(RentalAllVehicleImages, { foreignKey: 'vehicleId', as: 'images' });
// RentalAllVehicleImages.belongsTo(RentalAllVehicles, { foreignKey: 'vehicleId' });



// Rental associations
rental.belongsTo(user, { foreignKey: 'userId' });
rental.belongsTo(RentalAllVehicles, { foreignKey: 'vehicleId' });


sequelize.sync({ alter: true })
  .then(() => console.log('Database synced successfully'))
  .catch(error => console.error('Unable to sync database:', error));

module.exports = {
  sequelize,
  users: user,
  contacts: contact, // Keep this export
  vehicles: Vehicle,
  v_img: VehicleImage,
  vehicleWishlist: VehicleWishlist,
  LostAndFound,
  wishlistImage: WishlistImage,
  LostAndFoundImage,
  rental,
  RentalAllVehicles,
  RentalAllVehicleImages,
};