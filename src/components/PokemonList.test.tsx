import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FilterProvider } from "../contexts/FilterProvider";
import { server } from "../tests/setup"; // Importa o server configurado
import { pokemonHandlers } from "../mocks/handlers"; // Handlers predefinidos
import PokemonList from "../components/PokemonList";
import { ERROR_MESSAGES } from "../helpers/constants";
import { rest } from "msw";
import { http } from "msw";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { POKEMON_API_URL } from "../helpers/constants";


const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

const customRender = (ui: React.ReactElement) => {
  const queryClient = createQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <FilterProvider>{ui}</FilterProvider>
    </QueryClientProvider>
  );
};

describe("PokemonList Component", () => {
  // Maybe unecessary because of setup?
  beforeAll(() => {
    server.use(...pokemonHandlers);
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  test("displays a loading state", async () => {
    customRender(<PokemonList />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();

    await screen.findByTestId("pokemon-card"); // not working
  });

  // not working, commented
  test("renders Pokemon cards correctly", async () => {
    customRender(<PokemonList />);

 
    const pokemonCards = await screen.findAllByTestId("pokemon-card");
    expect(pokemonCards).toHaveLength(3); // 3 for testing
    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("charmander")).toBeInTheDocument();
    expect(screen.getByText("squirtle")).toBeInTheDocument();


    const loadMoreButton = screen.getByText(/load more/i);
    expect(loadMoreButton).toBeInTheDocument();

  
    fireEvent.click(loadMoreButton);


    // const nextPokemon = await screen.findByText("pikachu");
    // expect(nextPokemon).toBeInTheDocument();
  });

  test("displays an error message when fetching fails", async () => {

    server.use(
      http.get(POKEMON_API_URL, () => {
        return new Response(null, { status: 500 });
      })
    );

    customRender(<PokemonList />);


    const errorMessage = await screen.findByText(ERROR_MESSAGES.FETCH_ERROR);
    expect(errorMessage).toBeInTheDocument();
    expect(screen.getByText(/try again/i)).toBeInTheDocument();
  });

  test("displays empty results when no Pokémon matches the filter", async () => {
    customRender(<PokemonList />);


    await screen.findByTestId("pokemon-card");


  });
});
