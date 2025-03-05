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

module.exports.VehicleWishlist = (sequelize, DataTypes) => {
    const VehicleWishlist = sequelize.define("VehicleWishlist", {
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
        allowNull: true, // Allow null for buy purpose
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
        type: DataTypes.JSON, // Use JSON for storing arrays
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending", // Default value
      },
    });
  
    return VehicleWishlist;
  };

  module.exports.LostAndFound = (sequelize, DataTypes) => {
    const LostAndFound = sequelize.define("LostAndFound", {
      type: { 
        type: DataTypes.STRING,
        allowNull: false },
        
      title: { 
        type: DataTypes.STRING, 
        allowNull: false },

      description: { 
        type: DataTypes.TEXT, 
        allowNull: false },

      location: { 
        type: DataTypes.STRING, 
        allowNull: false },

      date: { 
        type: DataTypes.DATE, 
        allowNull: false },

      status: {
         type: DataTypes.STRING, 
         defaultValue: "active" },

      images: {
         type: DataTypes.JSON }, // Store image file paths as an array
    });
  
    return LostAndFound;
  };