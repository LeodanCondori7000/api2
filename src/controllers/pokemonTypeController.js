const axios = require("axios");
const { Type } = require("../db");

const getAllPokemonTypes = async () => {
  const response = await axios.get("https://pokeapi.co/api/v2/type");
  return response.data.results.map((type) => ({ name: type.name }));
};

const bulkCreatePokemonTypes = async (types) => {
  await Type.bulkCreate(types);
};

module.exports = {
  getAllPokemonTypes,
  bulkCreatePokemonTypes,
};
