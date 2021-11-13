'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Blocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_ref: {
        type: Sequelize.INTEGER,
        references: { // внешний ключ
          // This is a reference to another model
          model: 'Users',
          // This is the column name of the referenced model
          key: 'id'
        }
      },
      experienced: {
        type: Sequelize.BOOLEAN
      },
      primary_market: {
        type: Sequelize.STRING
      },
      trading_style: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Blocks');
  }
};
