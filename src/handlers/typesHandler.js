const pokemonTypeController = require("../controllers/pokemonTypeController");

const getAllPokemonTypesHandler = async (req, res) => {
  try {
    const types = await pokemonTypeController.getAllPokemonTypes();
    await pokemonTypeController.bulkCreatePokemonTypes(types);
    res.status(200).json(types);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAllPokemonTypesHandler };

// a simple approach
// const { default: axios } = require("axios");
// const { Type } = require("../db");

// const getAllPokemonTypesHandler = async (req, res) => {

//   const response = await axios.get("https://pokeapi.co/api/v2/type");
//   const types = response.data.results.map((type) => ({ name: type.name }));
//   await Type.bulkCreate(types);
//   res.status(200).json(types);
// };

// module.exports = { getAllPokemonTypesHandler };
