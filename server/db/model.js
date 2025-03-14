
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
        type: DataTypes.BLOB('long'), // Storing images in binary format
        allowNull: false,
    }
})

return VehicleImage;
}

module.exports.VehicleWishlist = (sequelize, DataTypes) => {
    const VehicleWishlist = sequelize.define('VehicleWishlist', {
      purpose: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vehicleType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      brand: {
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
        allowNull: false,
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
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
    });
    return VehicleWishlist;
  };