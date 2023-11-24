const axios = require("axios");
const { createPokemonDb } = require("../controllers/pokemonsController");
// const Pokemon = require("../models/Pokemon");
const { Pokemon } = require("../db");

//http://localhost:3001/pokemons
// const getPokemonsHandler = async (req, res) => {
//   const { name } = req.query;
//   if (name) {
//     const response = await axios.get(
//       `https://pokeapi.co/api/v2/pokemon/${name}`
//     );
//     if (response) {
//       return res.status(200).json(response.data);
//     }
//   }
//   if (name) {
//     Pokemon.findOne({
//       where: {
//         name: name,
//       },
//     }).then((user) => {
//       if (user) {
//         return res.status(200).json(user);
//       } else {
//         return res.status(200).json({ message: "user not found" });
//       }
//     });
//   }
//   const response = await axios.get("https://pokeapi.co/api/v2/pokemon");
//   res.status(200).json(response.data);

// if (name) {
//   const response = await axios.get(
//     `https://pokeapi.co/api/v2/pokemon/${name}`
//   );
//   if (response) {
//     res.status(200).json(response.data);
//   } else {
//     Pokemon.findOne({
//       where: {
//         name: name,
//       },
//     }).then((user) => {
//       if (user) {
//         console.log("Found user:", user);
//       } else {
//         console.log("User not found");
//       }
//     });
//   }

// const keys = Object.keys(response.data);
// console.log(keys);
// res.status(200).json(keys);
// res.status(200).json(response.data);
// } else {
//   const response = await axios.get("https://pokeapi.co/api/v2/pokemon");
//   res.status(200).json(response.data);
// }

// if (name) {
//   Pokemon.findOne({
//     where: {
//       name: name,
//     },
//   }).then((user) => {
//     if (user) {
//       return res.status(200).json(user);
//     } else {
//       res.status(200).json({ message: "user not found" });
//     }
//   });
// }
// };
const getPokemonsHandler = async (req, res) => {
  const { name } = req.query;

  try {
    if (name) {
      // Check if the Pokemon exists in the external API
      // console.log(name);

      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
      );

      if (data.id) {
        return res.status(200).json(data);
      }

      // If the Pokemon is not found in the external API, search in the local database
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
      // If no name parameter is provided, fetch all Pokemon from the external API
      const response = await axios.get("https://pokeapi.co/api/v2/pokemon");
      return res.status(200).json(response.data);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    // return res.status(500).json({ error: "Internal Server Error" });
    return res.status(500).json({ error: error });
  }
};

const getDetailHandler = async (req, res) => {
  try {
    const { idPokemon } = req.params;
    const localPokemon = await Pokemon.findOne({ where: { id: idPokemon } });
    if (localPokemon) {
      return res.status(200).json(localPokemon);
    }
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${idPokemon}`
    );
    const pokemon = {
      id: response.data.id,
      name: response.data.name,
      image: response.data.sprites.front_default,
      life: response.data.stats[0].base_stat,
      attack: response.data.stats[1].base_stat,
      defense: response.data.stats[2].base_stat,
      types: response.data.types.map((type) => type.type.name),
    };
    res.status(200).json(pokemon);
  } catch (error) {
    console.error("Error fetching Pokemon details:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
