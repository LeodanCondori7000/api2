require("dotenv").config();

const { Sequelize } = require("sequelize");
const { DB_USER, DB_NAME, DB_PASSWORD, DB_HOST } = process.env;

const PokemonsModel = require("./models/Pokemon");
const TypesModel = require("./models/Type");

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
  { logging: false }
);

PokemonsModel(sequelize);
TypesModel(sequelize);

// RELACIONES O ASOCIACIONES

const { Pokemon, Type } = sequelize.models;

Pokemon.belongsToMany(Type, { through: "PokemonsTypes" });
Type.belongsToMany(Pokemon, { through: "PokemonsTypes" });

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
