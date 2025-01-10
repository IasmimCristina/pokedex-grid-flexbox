import { fireEvent, screen, waitFor } from '@testing-library/react'
import PokemonList from '../components/PokemonList'
import { describe, expect, vi } from 'vitest'
import { renderWithProviders, server } from '../tests/setup'
import { ERROR_MESSAGES, POKEMON_API_URL } from '../helpers/constants'
import { http, HttpResponse } from 'msw'
import useFilter from '../hooks/useFilter'
import { mockPokemonList } from '../mocks/mockPokemonList'

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
  //  has next page
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
    // setup
    customRender()

    // ação (opcional)
    const spinner = screen.getByText(/loading.../i)

    // asserção
    expect(spinner).toBeInTheDocument()
  })

  it('renders the pokemon cards', async () => {
    // setup
    customRender()


    // ação (opcional)


    // asserção
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




  const mockNextPagePokemon = [
    {
      name: 'eevee',
      url: `${POKEMON_API_URL}/133/`
    },
    {
      name: 'snorlax',
      url: `${POKEMON_API_URL}/143/`
    }
  ];

  server.use(
    http.get(`${POKEMON_API_URL}/133/`, () => {
      return HttpResponse.json({
        id: 133,
        name: 'eevee',
        sprites: {
          other: {
            "official-artwork": {
              front_default: 'https://example.com/eevee.png'
            }
          }
        }
      });
    }),
    http.get(`${POKEMON_API_URL}/143/`, () => {
      return HttpResponse.json({
        id: 143,
        name: 'snorlax',
        sprites: {
          other: {
            "official-artwork": {
              front_default: 'https://example.com/snorlax.png'
            }
          }
        }
      });
    })
  );


  describe("When clicking the 'Load more' button", () => {
    it("shows loading text", async () => {
      // MSW precisaria has nex page
    })

    it("loads more Pokémon cards", async () => {
      //  como sobrecrever outra requisição (após click)
    })

    it("shows an error message when it fails", async () => {
      //  sobrecrever a segunda requisição
    })
  })

  describe("When there is an API Error", () => {
    it('displays an error message and a "try again" button when fetching fails', async () => {
      server.use(
        http.get(POKEMON_API_URL, () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      customRender()

      const errorMessage = await screen.findByText("Error fetching Pokémon data:", {}, { timeout: 2000 })
      expect.soft(errorMessage).toBeInTheDocument()
      expect.soft(screen.getByText(/try again/i)).toBeInTheDocument()
    })
  })

  describe("When filtering", () => {
    it("displays a message when no Pokémon matches the filter", async () => {
      // Mock useFilter - valor inválido.
      vi.mocked(useFilter).mockReturnValue({
        filter: 'xyz',
        setFilter: vi.fn(),
        clearFilter: vi.fn()
      })

      customRender();
      // É necessáiro esperar até o aparecimento da mensagem.
      await waitFor(() => {
        expect(screen.getByText("No Pokémon found with that name.")).toBeInTheDocument();
      })
    });


    it("displays the correct result when searching for one pokémon", async () => {
      // Mock useFilter to return a filter that will match specific pokemon
      vi.mocked(useFilter).mockReturnValue({
        filter: 'char',
        setFilter: vi.fn(),
        clearFilter: vi.fn()
      })

      customRender();

      // Wait for initial load
      await waitFor(async () => {
        // Should only show Charmander
        const pokemonCards = screen.getAllByTestId('pokemon-card')
        expect(pokemonCards).toHaveLength(1)
        expect(screen.getByText('charmander')).toBeInTheDocument()

        // Maybe unecessary? v v v
        expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument()
      });
    });

    it("displays multiple results searching one letter", async () => {

      vi.mocked(useFilter).mockReturnValue({
        filter: 'a',
        setFilter: vi.fn(),
        clearFilter: vi.fn()
      })

      customRender();

      // Wait for initial load
      await waitFor(async () => {
        // Should  show all items that have  at leat one 'a'
        const pokemonCards = screen.getAllByTestId('pokemon-card')
        expect.soft(pokemonCards).toHaveLength(4)
        expect.soft(screen.getByText('charmander')).toBeInTheDocument()
        expect.soft(screen.getByText('gengar')).toBeInTheDocument()
        expect.soft(screen.getByText('pikachu')).toBeInTheDocument()
        expect.soft(screen.queryByText('bulbasaur')).toBeInTheDocument()

      });
    });

    // Extra case:
    it("filters pokemon names case-insensitively", async () => {
      vi.mocked(useFilter).mockReturnValue({
        filter: 'CHAR',
        setFilter: vi.fn(),
        clearFilter: vi.fn()
      })

      customRender();

      await waitFor(async () => {
        const pokemonCards = screen.getAllByTestId('pokemon-card')
        expect(pokemonCards).toHaveLength(1)
        expect(screen.getByText('charmander')).toBeInTheDocument()
      });
    });
  })
})
//  Testar usando mocks como resposta
// 
