
module.exports.user = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
        uname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        // email: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     validate: {
        //         notEmpty: true,
        //     }
        // },
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

