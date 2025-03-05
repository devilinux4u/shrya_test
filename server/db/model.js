module.exports.User = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
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
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            allowNull: false,
            defaultValue: 'user',
        }
    })
    return User;
}

module.exports.SellVehicle = (sequelize, DataTypes) => {
    const SellVehicle = sequelize.define('SellVehicle', {
        uid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            },
            onDelete: 'CASCADE',
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

    return SellVehicle;
};

module.exports.SellVehicleImage = (sequelize, DataTypes) => {
    const SellVehicleImage = sequelize.define('SellVehicleImage', {
        vehicleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'SellVehicles',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    })

    return SellVehicleImage;
}

module.exports.Wishlist = (sequelize, DataTypes) => {
    const Wishlist = sequelize.define("Wishlist", {
        uid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
       make: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        model: {
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
        kmRun: {
            type: DataTypes.INTEGER,
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

    Wishlist.associate = (models) => {
        Wishlist.hasMany(models.WishlistImage, {
            foreignKey: "wishlistId",
            as: "images",
            onDelete: "CASCADE",
        });
    };

    return Wishlist;
};

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
        WishlistImage.belongsTo(models.Wishlist, {
            foreignKey: "wishlistId",
            as: "wishlist",
            onDelete: "CASCADE",
        });
    };

    return WishlistImage;
};

module.exports.LostAndFound = (sequelize, DataTypes) => {
    const LostAndFound = sequelize.define("LostAndFound", {
        uid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        type: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        location: { type: DataTypes.STRING, allowNull: false },
        model: { type: DataTypes.STRING, allowNull: false },
        make: { type: DataTypes.STRING, allowNull: false },
        nplate: { type: DataTypes.STRING, allowNull: false },
        date: { type: DataTypes.DATE, allowNull: false },
        status: { type: DataTypes.STRING, defaultValue: "active" },
    });

    return LostAndFound;
};

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
                model: "LostAndFounds",
                key: "id"
            },
            onDelete: "CASCADE"
        }
    });

    return LostAndFoundImage;
};

module.exports.RentalVehicle = (sequelize, DataTypes) => {
    const RentalVehicle = sequelize.define('RentalVehicle', {
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

    return RentalVehicle;
};

module.exports.RentalVehicleImage = (sequelize, DataTypes) => {
    const RentalVehicleImage = sequelize.define("RentalVehicleImage", {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        vehicleId: { type: DataTypes.INTEGER, allowNull: false },
        image: { type: DataTypes.STRING },
      });
    
    RentalVehicleImage.associate = (models) => {
        RentalVehicleImage.belongsTo(models.RentalVehicle, {
          foreignKey: "vehicleId",
          onDelete: "CASCADE",
        });
      };

    return RentalVehicleImage;
};

module.exports.Booking = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        vehicleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'RentalVehicles',
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
            type: DataTypes.ENUM('pending', 'active', 'late', 'completed', 'cancelled', 'completed_late', 'not_paid'),
            defaultValue: 'pending'
        }
    });

    Booking.associate = (models) => {
        Booking.belongsTo(models.User, { foreignKey: 'userId' });
        Booking.belongsTo(models.RentalVehicle, { foreignKey: 'vehicleId' });
    };

    return Booking;
};

module.exports.Transaction = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
      bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Bookings',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      pidx: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('paid', 'pending', 'cancelled'),
        defaultValue: 'pending'
      },
      method: {
        type: DataTypes.ENUM('khalti', 'cash'),
      }
    });
  
    Transaction.associate = (models) => {
      Transaction.belongsTo(models.Booking, { foreignKey: 'bookingId' });
    };
  
    return Transaction;
  };
  

module.exports.Contact = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
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
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "new",
    },
  });

  return Contact;
};

module.exports.Appointments = (sequelize, DataTypes) => {
    const Appointments = sequelize.define('Appointments', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        vehicleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'SellVehicles',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
            defaultValue: 'pending',
        },
    });

    return Appointments;
};