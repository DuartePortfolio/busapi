const { Sequelize } = require('sequelize');
const config = require('../config/config').development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    logging: config.logging
  }
);

// Exemplo de importação de modelo
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.Vehicle = require('./Vehicle')(sequelize, Sequelize);
db.Weather = require('./Weather')(sequelize, Sequelize);
db.Stop = require('./Stop')(sequelize, Sequelize);
db.User = require('./User')(sequelize, Sequelize);

module.exports = db;
