import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FilterProvider } from "../contexts/FilterProvider";
import { server } from "../tests/setup"; // Importa o server configurado
import { pokemonHandlers } from "../mocks/handlers"; // Handlers predefinidos
import PokemonList from "../components/PokemonList";
import { ERROR_MESSAGES } from "../helpers/constants";
import { rest } from "msw";
import { http } from "msw";
import { afterAll, afterEach, beforeAll, describe, expect, it, test, vi } from "vitest";
import { POKEMON_API_URL } from "../helpers/constants";


vi.mock("../helpers/apiUtils", async () => {
  const originalModule = await vi.importActual("../helpers/apiUtils");
  return {
    ...originalModule,
    delay: vi.fn().mockResolvedValue(undefined),  // You can mock funcitons used inside cusotm Hooks!
    simulateError: vi.fn(),  // Mocking the simulated errors/delay
    // This was necessary because MSW only intercepts the request, not the functions around it.
  };
});

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

  it("displays a loading state and then renders Pokemon cards", async () => {
    customRender(<PokemonList />);
    

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();


    await waitFor(() => {
      const pokemonCards = screen.getAllByTestId("pokemon-card");
      expect(pokemonCards.length).toBeGreaterThan(0);
      expect(screen.getByText("bulbasaur")).toBeInTheDocument();
      expect(screen.getByText("charmander")).toBeInTheDocument();
      expect(screen.getByText("squirtle")).toBeInTheDocument();
    });
  });

  // it("displays an error message when fetching fails", async () => {

  //   server.use(
  //     http.get(POKEMON_API_URL, () => {
  //       return new Response(null, { status: 500 });
  //     })
  //   );

  //   customRender(<PokemonList />);


  //   const errorMessage = await screen.findByText(ERROR_MESSAGES.FETCH_ERROR);
  //   expect(errorMessage).toBeInTheDocument();
  //   expect(screen.getByText(/try again/i)).toBeInTheDocument();
  // });

  // it("displays empty results when no Pokémon matches the filter", async () => {
  //   customRender(<PokemonList />);


  //   await screen.findByTestId("pokemon-card");


  // });
});
