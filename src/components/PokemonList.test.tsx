import { screen, waitFor } from '@testing-library/react'
import PokemonList from '../components/PokemonList'
import { describe, expect, vi } from 'vitest'
import { renderWithProviders, server } from '../tests/setup'
import { ERROR_MESSAGES, POKEMON_API_URL } from '../helpers/constants'
import { http, HttpResponse } from 'msw'
import useFilter from '../hooks/useFilter'

// Mock do useFilter
vi.mock('../hooks/useFilter', () => ({
  default: vi.fn()
}));

vi.mock('../helpers/apiUtils', async () => {
  const originalModule = await vi.importActual('../helpers/apiUtils')
  return {
    ...originalModule,
    delay: vi.fn().mockResolvedValue(undefined), // You can mock funcitons used inside cusotm Hooks!
    simulateError: vi.fn(), // Mocking the simulated errors/delay
    // This was necessary because MSW only intercepts the request, not the functions around it.
  }
})

const customRender = () => renderWithProviders(<PokemonList />)

describe('PokemonList Component', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    vi.resetAllMocks()
    // Set default mock implementation for useFilter
    vi.mocked(useFilter).mockReturnValue({
      filter: '',
      setFilter: vi.fn(),
      clearFilter: vi.fn()
    })
  })

  it('displays a loading state and then renders Pokemon cards', async () => {
    customRender()
    const spinner = screen.getByText(/loading.../i)
    expect(spinner).toBeInTheDocument()
  })

  it('renders the pokemon cards', async () => {
    customRender()

    await waitFor(
      () => {
        const pokemonCards = screen.getAllByTestId('pokemon-card')
        expect.soft(pokemonCards).toHaveLength(6)
        expect.soft(screen.getByText('bulbasaur')).toBeInTheDocument()
        expect.soft(screen.getByText('charmander')).toBeInTheDocument()
        expect.soft(screen.getByText('squirtle')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  describe("API Error handling", () => {
    it('displays an error message when fetching fails', async () => {
      server.use(
        http.get(POKEMON_API_URL, () => {
          return new HttpResponse(null, { status: 500 })
        })
      )
      
      customRender()
  
      const errorMessage = await screen.findByText("Error fetching Pokémon data:", {}, { timeout: 2000 })
      expect(errorMessage).toBeInTheDocument()
      expect(screen.getByText(/try again/i)).toBeInTheDocument()
    })
  })
  
  describe("When filtering", () => {
    it("displays empty results when no Pokémon matches the filter", async () => {
      // Mock useFilter to return a filter that won't match any pokemon
      vi.mocked(useFilter).mockReturnValue({
        filter: 'xyz',
        setFilter: vi.fn(),
        clearFilter: vi.fn()
      })
   
      customRender();

      // Wait for initial load
      await screen.findByTestId("pokemon-card");
      
      // Check if empty message is displayed
      expect(screen.getByText(ERROR_MESSAGES.EMPTY)).toBeInTheDocument();
    });

    // it("displays the correct results depending on the filter", async () => {
    //   // Mock useFilter to return a filter that will match specific pokemon
    //   vi.mocked(useFilter).mockReturnValue({
    //     filter: 'char',
    //     setFilter: vi.fn(),
    //     clearFilter: vi.fn()
    //   })
   
    //   customRender();

    //   // Wait for initial load
    //   await waitFor(async () => {
    //     // Should only show Charmander
    //     const pokemonCards = screen.getAllByTestId('pokemon-card')
    //     expect(pokemonCards).toHaveLength(1)
    //     expect(screen.getByText('charmander')).toBeInTheDocument()
    //     expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument()
    //   });
    // });

    // it("filters pokemon names case-insensitively", async () => {
    //   vi.mocked(useFilter).mockReturnValue({
    //     filter: 'CHAR',
    //     setFilter: vi.fn(),
    //     clearFilter: vi.fn()
    //   })
   
    //   customRender();

    //   await waitFor(async () => {
    //     const pokemonCards = screen.getAllByTestId('pokemon-card')
    //     expect(pokemonCards).toHaveLength(1)
    //     expect(screen.getByText('charmander')).toBeInTheDocument()
    //   });
    // });
  })
})
