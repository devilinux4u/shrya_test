
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
    const Vehicle = sequelize.define('vehicle', {
        uid: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        title: {
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
        type: {
            type: DataTypes.STRING,
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
        }
    });

    const VehicleImage = sequelize.define("vehicle_image", {
        vehicleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "vehicles", key: "id" },
            onDelete: "CASCADE"
        },
        image: {
            type: DataTypes.BLOB("long"),
            allowNull: false
        }
    });

    return Vehicle; 
};

