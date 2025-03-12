
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
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
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
        }
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

module.exports.wishlistVehicle = (sequelize, DataTypes) => {
    const wishlistVehicle = sequelize.define('wishlistVehicle', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        vehicleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        vehicleName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        vehicleBrand: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: true,
                isFloat: true
            }
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true, // Allowing null in case image is optional
            validate: {
                isUrl: true
            }
        }
    });

    return wishlistVehicle;
};

module.exports.lostAndFoundVehicle = (sequelize, DataTypes) => {
    const lostAndFoundVehicle = sequelize.define('lostAndFoundVehicle', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        vehicleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        vehicleName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        vehicleBrand: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: true, // Price might not be relevant for lost vehicles
            validate: {
                isFloat: true
            }
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true, // Image might not always be available
            validate: {
                isUrl: true
            }
        },
        status: {
            type: DataTypes.ENUM('lost', 'found', 'claimed'), // Status to track the vehicle
            allowNull: false,
            validate: {
                notEmpty: true,
                isIn: [['lost', 'found', 'claimed']]
            }
        }
    });

    return lostAndFoundVehicle;
};
