import { http, HttpResponse } from "msw";
import { POKEMON_API_URL } from "../helpers/constants";
import { mockPokemonList } from "./mockPokemonList";
import { mockPokemonDetails } from "./mockPokemonDetails";

export const pokemonHandlers = [
  http.get(`${POKEMON_API_URL}`, async () => {
    return HttpResponse.json({
      results: mockPokemonList,
    });
  }),

  http.get(`${POKEMON_API_URL}/:id/`, async ({ params }) => {
    const id = Number(params.id);
    const pokemonDetail = mockPokemonDetails[id as keyof typeof mockPokemonDetails];

    if (!pokemonDetail) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(pokemonDetail);
  }),
];
