import { http, HttpResponse } from "msw";
import { POKEMON_API_URL } from "../helpers/constants";
import { mockPokemonList } from "./mockPokemonList";
import { mockPokemonDetails } from "./mockPokemonDetails";
import { delay } from "msw";

const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const pokemonHandlers = [
  http.get(`${POKEMON_API_URL}`, async ({ request }) => {
    const url = new URL(request.url);
    const offset = Number(url.searchParams.get("offset") || 0);
    const limit = Number(url.searchParams.get("limit") || 3);

    const results = mockPokemonList.slice(offset, offset + limit);

    // Simula atraso antes de retornar a resposta
    await simulateDelay(500);

    return HttpResponse.json({
      count: mockPokemonList.length,
      next: results.length < mockPokemonList.length 
        ? `${POKEMON_API_URL}?offset=${offset + limit}&limit=${limit}` 
        : null,
      previous: offset > 0 
        ? `${POKEMON_API_URL}?offset=${Math.max(0, offset - limit)}&limit=${limit}` 
        : null,
      results,
    });
  }),

  http.get(`${POKEMON_API_URL}/:id/`, async ({ params }) => {
    const id = Number(params.id);
    const pokemonDetail = mockPokemonDetails[id as keyof typeof mockPokemonDetails];

    // Simula atraso
    await simulateDelay(300);

    if (!pokemonDetail) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(pokemonDetail);
  }),
];
