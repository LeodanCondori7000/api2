const { Pokemon } = require("../db");

const createPokemonDb = async (id, name, image, life, attack, defense) => {
  const pokemon = await Pokemon.create({ id, name, image, life, attack, defense });

  return pokemon;
};

module.exports = {
  createPokemonDb,
};
