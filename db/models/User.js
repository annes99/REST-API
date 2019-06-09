'use strict';

// id (Integer, primary key, auto-generated)
// firstName (String)
// lastName (String)
// emailAddress (String)
// password (String)

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // will only allow letters
                is: ["^[a-z]+$",'i'],
                // don't allow empty strings
                notEmpty: {
                    msg: "First name is required"
                } 
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // will only allow letters
                is: ["^[a-z]+$",'i'],
                // don't allow empty strings
                notEmpty: {
                    msg: "Last name is required"
                } 
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // checks for email format (foo@bar.com)
                isEmail: true,
                // don't allow empty strings
                notEmpty: {
                    msg: "Must be valid email address"
                } 
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: {
                msg: "Enter password"
            } 
        },
    });

    User.associate = (models) => {
        User.hasMany(models.Course);
    };

    return User;
};
