
module.exports.user = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
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
        fname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        lname: {
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
                isNumeric: true, // Ensures only numeric values
            }
        },
        sub: {
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

