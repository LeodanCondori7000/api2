const { Router } = require("express");
const {
  getPokemonsHandler,
  getDetailHandler,
  createPokemonHandler,
} = require("../handlers/pokemonsHandler");

const pokemonsRouter = Router();

pokemonsRouter.get("/", getPokemonsHandler);

pokemonsRouter.get("/:idPokemon", getDetailHandler);

pokemonsRouter.post("/", createPokemonHandler);

module.exports = pokemonsRouter;
