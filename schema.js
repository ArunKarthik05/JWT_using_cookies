const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('./database');

const User = sequelize.define('User', {
  // Define the attributes (columns) of the model
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Sync the defined models with the database
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

module.exports = User;