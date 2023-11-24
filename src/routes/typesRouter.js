const { Router } = require("express");
const {
  getAllPokemonTypesHandler,
} = require("../handlers/typesHandler");

const typesRouter = Router();

typesRouter.get("/", getAllPokemonTypesHandler);

module.exports = typesRouter;
