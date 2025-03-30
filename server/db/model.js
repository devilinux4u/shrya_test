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
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        pass: {
            type: DataTypes.STRING,
            allowNull: false,
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
            allowNull: false,
            validate: {
                notEmpty: true,
                isNumeric: true,
            }
        },
        verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    })
    return user;
}

module.exports.contact = (sequelize, DataTypes) => {
    const contact = sequelize.define('contact', {
        name: {
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
        phno: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        msg: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        }
    });

    return contact;
};

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


// rental model
module.exports.booking = (sequelize, DataTypes) => {
    const Booking = sequelize.define('booking', {
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
        paymentMethod: {
            type: DataTypes.ENUM('creditCard', 'payLater'),
            allowNull: false
        },
        cardLastFour: {
            type: DataTypes.STRING
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
            type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
            defaultValue: 'confirmed'
        }
    });

    // Associations
    Booking.associate = (models) => {
        Booking.belongsTo(models.user, { foreignKey: 'userId' });
        Booking.belongsTo(models.vehicles, { foreignKey: 'vehicleId' });
        Booking.hasMany(models.booking_image, { foreignKey: 'bookingId' });
    };

    return Booking;
};
//rental image model
module.exports.booking_image = (sequelize, DataTypes) => {
    const BookingImage = sequelize.define('booking_image', {
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imageType: {
            type: DataTypes.ENUM('license', 'receipt', 'other'),
            allowNull: false
        },
        bookingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'bookings',
                key: 'id'
            },
            onDelete: 'CASCADE'
        }
    });

    // Association
    BookingImage.associate = (models) => {
        BookingImage.belongsTo(models.booking, { foreignKey: 'bookingId' });
    };

    return BookingImage;
};