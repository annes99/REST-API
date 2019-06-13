'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

console.info('Instantiating and configuring the Sequelize object instance...');

const options = {
  dialect: 'sqlite',
  storage: 'fsjstd-restapi.db',
  // This option configures Sequelize to always force the synchronization
  // of our models by dropping any existing tables.
  sync: { force: true },
  define: {
  // This option adds/removes the `createdAt` and `updatedAt` columns from the tables
  timestamps: true,
  },
};

const sequelize = new Sequelize(options);

const models = {};

fs
  .readdirSync(path.join(__dirname, 'models'))
  .forEach((file) => {
    console.info(`Importing database model from file: ${file}`);
    const model = sequelize.import(path.join(__dirname, 'models', file));
    models[model.name] = model;
  });

// If available, call method to create associations.
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    console.info(`Configuring the associations for the ${modelName} model...`);
    models[modelName].associate(models);
  }
});

module.exports = {
    sequelize,
    Sequelize,
    models,
  };
  