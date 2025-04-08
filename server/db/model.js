module.exports.user = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
        fname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        uname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        num: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
            }
        },
        pass: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
            }
        },
        profile: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        otp: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                notEmpty: true,
                isNumeric: true,
            }
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    })
    return user;
}



module.exports.vehicle = (sequelize, DataTypes) => {
    const Vehicle = sequelize.define('vehicles', {
        uid: {
            type: DataTypes.INTEGER, // Change type to INTEGER to match the users table's id column
            allowNull: false,
            references: {
                model: 'users', // Reference the users table
                key: 'id' // Reference the id column in the users table
            },
            onDelete: 'CASCADE', // Update to CASCADE for proper deletion behavior
            onUpdate: 'CASCADE'
        },
        make: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notEmpty: true }
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        km: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notEmpty: true }
        },
        fuel: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        trans: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: { notEmpty: true }
        },
        des: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: { notEmpty: true }
        },
        own: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: { notEmpty: true }
        },
        mile: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: { notEmpty: true }
        },
        seat: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: { notEmpty: true }
        },
        cc: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: { notEmpty: true }
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "available",
        },
    });

    return Vehicle;
};

module.exports.vimg = (sequelize, DataTypes) => {
    const VehicleImage = sequelize.define('vehicle_image', {
        vehicleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'vehicles',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    })

    return VehicleImage;
}


// VehicleWishlist model
module.exports.VehicleWishlist = (sequelize, DataTypes) => {
    const VehicleWishlist = sequelize.define("VehicleWishlist", {
        // uid: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     validate: { notEmpty: true }
        // },
        uid: {
            type: DataTypes.INTEGER, // Change type to INTEGER to match the users table's id column
            allowNull: false,
            references: {
                model: 'users', // Reference the users table
                key: 'id' // Reference the id column in the users table
            },
            onDelete: 'CASCADE', // Update to CASCADE for proper deletion behavior
            onUpdate: 'CASCADE'
        },
        purpose: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        vehicleName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        budget: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        kmRun: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ownership: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fuelType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "pending",
        },
    });

    VehicleWishlist.associate = (models) => {
        VehicleWishlist.hasMany(models.WishlistImage, {
            foreignKey: "wishlistId",
            as: "images",
            onDelete: "CASCADE",
        });
    };


    return VehicleWishlist;
};

// WishlistImage model
module.exports.WishlistImage = (sequelize, DataTypes) => {
    const WishlistImage = sequelize.define("WishlistImage", {
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        wishlistId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    WishlistImage.associate = (models) => {
        WishlistImage.belongsTo(models.VehicleWishlist, {
            foreignKey: "wishlistId",
            as: "wishlist",
            onDelete: "CASCADE",
        });
    };

    return WishlistImage;
};

// LostAndFound Model
module.exports.LostAndFound = (sequelize, DataTypes) => {
    const LostAndFound = sequelize.define("LostAndFound", {
        uid: {
            type: DataTypes.INTEGER, // Change type to INTEGER to match the users table's id column
            allowNull: false,
            references: {
                model: 'users', // Reference the users table
                key: 'id' // Reference the id column in the users table
            },
            onDelete: 'CASCADE', // Update to CASCADE for proper deletion behavior
            onUpdate: 'CASCADE'
        },
        type: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        location: { type: DataTypes.STRING, allowNull: false },
        date: { type: DataTypes.DATE, allowNull: false },
        status: { type: DataTypes.STRING, defaultValue: "active" },
    });

    return LostAndFound;
};

// LostAndFoundImage Model
module.exports.LostAndFoundImage = (sequelize, DataTypes) => {
    const LostAndFoundImage = sequelize.define("LostAndFoundImage", {
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lostAndFoundId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "LostAndFounds", // Sequelize auto-pluralizes table names by default
                key: "id"
            },
            onDelete: "CASCADE"
        }
    });

    return LostAndFoundImage;
};

//added Rental vehicles
module.exports.rentalAllVehicles = (sequelize, DataTypes) => {
    const Vehicle = sequelize.define('rentVehicle', {
        make: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notEmpty: true }
        },
        numberPlate: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true },
            unique: true
        },
        priceHour: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: { notEmpty: true }
        },
        priceDay: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: { notEmpty: true }
        },
        priceWeek: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: { notEmpty: true }
        },
        priceMonth: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: { notEmpty: true }
        },
        seats: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notEmpty: true }
        },
        doors: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notEmpty: true }
        },
        transmission: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        fuelType: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        mileage: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notEmpty: true }
        },
        engine: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        power: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notEmpty: true }
        },
        features: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: { notEmpty: true }
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "available",
        },
    });

    return Vehicle;
};

// Rental All Vehicle Images Model
module.exports.rentalAllVehicleImages = (sequelize, DataTypes) => {
    const RentVehicleImages = sequelize.define("rentVehicleImages", {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        vehicleId: { type: DataTypes.INTEGER, allowNull: false },
        image: { type: DataTypes.STRING },
      });
    
      RentVehicleImages.associate = (models) => {
        RentVehicleImages.belongsTo(models.rentVehicle, {
          foreignKey: "vehicleId",
          onDelete: "CASCADE",
        });
      };

    return RentVehicleImages;
};


// rental model
module.exports.rental = (sequelize, DataTypes) => {
    const Rental = sequelize.define('rental', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        vehicleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'vehicles',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        pickupLocation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dropoffLocation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pickupDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        pickupTime: {
            type: DataTypes.STRING,
            allowNull: false
        },
        returnDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        returnTime: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rentalType: {
            type: DataTypes.ENUM('hour', 'day', 'week', 'month'),
            allowNull: false
        },
        driveOption: {
            type: DataTypes.ENUM('selfDrive', 'hireDriver'),
            allowNull: false
        },
        licenseImageUrl: {  
            type: DataTypes.STRING,
            allowNull: true
        },
        paymentMethod: {
            type: DataTypes.ENUM('creditCard', 'payLater'),
            allowNull: false
        },
        totalAmount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        rentalDuration: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'active', 'cancelled', 'completed'),
            defaultValue: 'active'
        }
    });

    Rental.associate = (models) => {
        Rental.belongsTo(models.user, { foreignKey: 'userId' });
        Rental.belongsTo(models.rentVehicle, { foreignKey: 'vehicleId' });
    };

    return Rental;
};

module.exports.contact = (sequelize, DataTypes) => {
  const Contact = sequelize.define('contact', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phno: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    msg: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Automatically set to the current date
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "new", // Default value for the status column
    },
  });

  return Contact;
};