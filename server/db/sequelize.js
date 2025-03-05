const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config');
const sequelize = new Sequelize(config.db_con);

const model = require('./model');

const user = model.User(sequelize, DataTypes);
const contact = model.Contact(sequelize, DataTypes);
const Vehicle = model.SellVehicle(sequelize, DataTypes);
const VehicleImage = model.SellVehicleImage(sequelize, DataTypes);
const VehicleWishlist = model.Wishlist(sequelize, DataTypes);
const WishlistImage = model.WishlistImage(sequelize, DataTypes);
const LostAndFound = model.LostAndFound(sequelize, DataTypes);
const LostAndFoundImage = model.LostAndFoundImage(sequelize, DataTypes);
const RentalAllVehicles = model.RentalVehicle(sequelize, DataTypes);
const RentalAllVehicleImages = model.RentalVehicleImage(sequelize, DataTypes);
const rental = model.Booking(sequelize, DataTypes);
const Transaction = model.Transaction(sequelize, DataTypes);
const Appointments = model.Appointments(sequelize, DataTypes);

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
Vehicle.belongsTo(user, { foreignKey: 'uid', as: 'user' }); // Ensure this association exists
VehicleWishlist.belongsTo(user, { foreignKey: "uid", as: "user" });

Vehicle.hasMany(Appointments, { foreignKey: 'vehicleId', onDelete: 'CASCADE' });
Appointments.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

user.hasMany(Appointments, { foreignKey: 'userId', onDelete: 'CASCADE' });
Appointments.belongsTo(user, { foreignKey: 'userId' });

// RentalAllVehicles associations
RentalAllVehicles.hasMany(RentalAllVehicleImages, {
  as: 'rentVehicleImages', 
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

rental.hasOne(Transaction, { foreignKey: 'bookingId', as: 'transaction' });
Transaction.belongsTo(rental, { foreignKey: 'bookingId' });

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
  Transaction,
  Appointments,
};

