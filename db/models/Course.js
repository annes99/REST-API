'use strict';

// id (Integer, primary key, auto-generated)
// title (String)
// description (Text)
// estimatedTime (String, nullable)
// materialsNeeded (String, nullable)


module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: {
                msg: "Title requierd"
            } 
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            notEmpty: {
                msg: "Description requierd"
            } 
        },
        estimatedTime: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        materialsNeeded: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });

    Course.associate = (models) => {
        Course.belongsTo(models.User);
    };

  return Course;
};