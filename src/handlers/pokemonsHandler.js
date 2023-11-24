const axios = require("axios");
const { createPokemonDb } = require("../controllers/pokemonsController");
// const Pokemon = require("../models/Pokemon");
const { Pokemon } = require("../db");

//http://localhost:3001/pokemons
const getPokemonsHandler = async (req, res) => {
  const { name } = req.query;

  try {
    if (name) {
      // https://pokeapi.co/api/v2/pokemon
      // https://pokeapi.co/api/v2/pokemon/{id}
      // https://pokeapi.co/api/v2/pokemon/{name}
      // https://pokeapi.co/api/v2/type

      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
      );

      if (data.id) {
        return res.status(200).json(data);
      }

      const localPokemon = await Pokemon.findOne({
        where: {
          name,
        },
      });

      if (localPokemon) {
        return res.status(200).json(localPokemon);
      } else {
        return res.status(404).json({ message: "Pokemon not found" });
      }
    } else {
      const response = await axios.get("https://pokeapi.co/api/v2/pokemon");
      return res.status(200).json(response.data);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: error });
  }
};

// const getDetailHandler = async (req, res) => {
//   const { idPokemon } = req.params;

//   try {
//     if (typeof Number(idPokemon) === "number") {
//       const response = await axios.get(
//         `https://pokeapi.co/api/v2/pokemon/${idPokemon}`
//       );
//       const pokemon = {
//         id: response.data.id,
//         name: response.data.name,
//         image: response.data.sprites.front_default,
//         life: response.data.stats[0].base_stat,
//         attack: response.data.stats[1].base_stat,
//         defense: response.data.stats[2].base_stat,
//         types: response.data.types.map((type) => type.type.name),
//       };
//       return res.status(200).json(pokemon);
//     } else {
//       const localPokemon = await Pokemon.findOne({ where: { id: idPokemon } });
//       if (localPokemon) {
//         return res.status(200).json(localPokemon);
//       } else {
//         return res.status(400).json({ message: "Pokemon not found" });
//       }
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getDetailHandler = async (req, res) => {
//   const { idPokemon } = req.params;

//   try {
//     const parsedId = Number(idPokemon);

//     if (!isNaN(parsedId) && parsedId > 0) {
//       // If idPokemon is a positive number, assume it's an external API ID
//       const response = await axios.get(
//         `https://pokeapi.co/api/v2/pokemon/${parsedId}`
//       );
//       const pokemon = {
//         id: response.data.id,
//         name: response.data.name,
//         image: response.data.sprites.front_default,
//         life: response.data.stats[0].base_stat,
//         attack: response.data.stats[1].base_stat,
//         defense: response.data.stats[2].base_stat,
//         types: response.data.types.map((type) => type.type.name),
//       };
//       return res.status(200).json(pokemon);
//     } else {
//       // If idPokemon is not a positive number, assume it's a local database ID
//       const localPokemon = await Pokemon.findOne({ where: { id: parsedId } });

//       if (localPokemon) {
//         return res.status(200).json(localPokemon);
//       } else {
//         return res.status(404).json({ message: "Pokemon not found" });
//       }
//     }
//   } catch (error) {
//     console.error("Error processing request:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const getDetailHandler = async (req, res) => {
  const { idPokemon } = req.params;

  try {
    const parsedId = Number(idPokemon);

    if (!isNaN(parsedId) && parsedId > 0) {
      // If idPokemon is a positive number, assume it's an external API ID
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${parsedId}`
      );

      if (response.data) {
        const pokemon = {
          id: response.data.id,
          name: response.data.name,
          image: response.data.sprites.front_default,
          life: response.data.stats[0].base_stat,
          attack: response.data.stats[1].base_stat,
          defense: response.data.stats[2].base_stat,
          types: response.data.types.map((type) => type.type.name),
        };
        return res.status(200).json(pokemon);
      } else {
        return res
          .status(404)
          .json({ message: "Pokemon not found in external API" });
      }
    } else {
      // If idPokemon is not a positive number, assume it's a local database ID
      const localPokemon = await Pokemon.findOne({ where: { id: idPokemon } });

      if (localPokemon) {
        return res.status(200).json(localPokemon);
      } else {
        return res
          .status(404)
          .json({ message: "Pokemon not found in local database" });
      }
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createPokemonHandler = async (req, res) => {
  const { id, name, image, life, attack, defense } = req.body;
  try {
    const newPokemon = await createPokemonDb(
      id,
      name,
      image,
      life,
      attack,
      defense
    );

    res.status(200).json(newPokemon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getPokemonsHandler,
  getDetailHandler,
  createPokemonHandler,
};
