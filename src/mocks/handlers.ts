import { http, HttpResponse } from "msw";
import { POKEMON_API_URL } from "../helpers/constants";
import { mockPokemonList } from "./mockPokemonList";
import { mockPokemonDetails } from "./mockPokemonDetails";

export const pokemonHandlers = [
  http.get(`${POKEMON_API_URL}`, ({ request }) => {
    const url = new URL(request.url);
    const offset = Number(url.searchParams.get("offset") || 0);
    const limit = Number(url.searchParams.get("limit") || 3);

    const results = mockPokemonList.slice(offset, offset + limit);

    return HttpResponse.json({
      results: results,
    });
  }),

  http.get(`${POKEMON_API_URL}/:id/`, ({ params }) => {
    const id = Number(params.id);
    const pokemonDetail =
      mockPokemonDetails[id as keyof typeof mockPokemonDetails];

    if (!pokemonDetail) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(pokemonDetail);
  }),
];
