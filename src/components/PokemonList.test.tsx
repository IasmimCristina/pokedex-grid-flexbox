import { fireEvent, screen, waitFor } from '@testing-library/react'
import PokemonList from '../components/PokemonList'
import { describe, expect, vi } from 'vitest'
import { renderWithProviders, server } from '../tests/setup'
import { ERROR_MESSAGES, POKEMON_API_URL } from '../helpers/constants'
import { http, HttpResponse } from 'msw'
import useFilter from '../hooks/useFilter'
import { usePokemons } from '../hooks/queries/usePokemons'
import { UseInfiniteQueryResult } from '@tanstack/react-query'



// Mock do useFilter
vi.mock('../hooks/useFilter', () => ({
  default: vi.fn()
}));

// Not full override
// vi.mock('../hooks/queries/usePokemons', async () => {
//   const originalModule = await vi.importActual<typeof import('../hooks/queries/usePokemons')>('../hooks/queries/usePokemons');
// //  Not working: wrong type. LOAD MORE TESTS INCOMPLETE
//   return {
//     ...originalModule,
//     usePokemons: vi.fn().mockReturnValue({
//       ...originalModule.usePokemons(), 
//       hasNextPage: true,  
//     } as UseInfiniteQueryResult<any, Error>),  
//   };
// });


// vi.mock('../hooks/queries/usePokemons', async () => {
//   const originalModule = await vi.importActual('../hooks/queries/usePokemons');

//   // Retorna o módulo original com a modificação desejada
//   return {
//     ...originalModule,
//     usePokemons: vi.fn().mockReturnValue({
//       data: {
//         pages: [mockPokemonList],  // Lista de Pokémon simulada
//         pageParams: [],            // Parâmetros de página vazios
//       },
//       hasNextPage: true,           // Simula que há mais páginas para carregar
//       isLoading: false,            // Indica que o carregamento terminou
//       isError: false,              // Simula que não há erro
//       isSuccess: true,             // Simula que a query foi bem-sucedida
//       isIdle: false,               // A query não está ociosa
//       error: null,                 // Nenhum erro
//       fetchNextPage: vi.fn(),      // Função mockada para buscar a próxima página
//       refetch: vi.fn(),            // Função mockada para refazer a query
//       isPending: false,            // Não está em pendência
//       isLoadingError: false,       // Não há erro de carregamento
//       isRefetchError: false,       // Não há erro de refetch
//       isFetchNextPageError: false // Não há erro ao buscar a próxima página
//     }),
//   };
// });

// Mock para simulação de lista de Pokémons
const mockPokemonList = [
  {
    id: 1,
    name: 'bulbasaur',
    sprites: {
      other: {
        'official-artwork': {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
        },
      },
    },
  },
  {
    id: 2,
    name: 'ivysaur',
    sprites: {
      other: {
        'official-artwork': {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png',
        },
      },
    },
  },
  {
    id: 3,
    name: 'venusaur',
    sprites: {
      other: {
        'official-artwork': {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png',
        },
      },
    },
  },
  {
    id: 4,
    name: 'charmander',
    sprites: {
      other: {
        'official-artwork': {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
        },
      },
    },
  },
  {
    id: 5,
    name: 'charmeleon',
    sprites: {
      other: {
        'official-artwork': {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png',
        },
      },
    },
  },
  {
    id: 6,
    name: 'charizard',
    sprites: {
      other: {
        'official-artwork': {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
        },
      },
    },
  },
];


vi.mock('../helpers/apiUtils', async () => {
  const originalModule = await vi.importActual('../helpers/apiUtils')
  return {
    ...originalModule,
    delay: vi.fn().mockResolvedValue(undefined), // Mocking functions used inside custom hooks
    simulateError: vi.fn(), // Mocking simulated errors/delays
  }
})

const customRender = () => renderWithProviders(<PokemonList />)

describe('PokemonList Component', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    // Set default mock implementation for useFilter
    vi.mocked(useFilter).mockReturnValue({
      filter: '',
      setFilter: vi.fn(),
      clearFilter: vi.fn()
    })

    // vi.mocked(usePokemons).mockReturnValue({

    // TO-DO: find a way to spread original vlaue here sint it didnt work globally using import actual since it does not allow us to use mockReturnValue.
    // Commented code are aother attempts.
    // })
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
        expect(pokemonCards).toHaveLength(6)
        expect(screen.getByText('bulbasaur')).toBeInTheDocument()
        expect(screen.getByText('charmander')).toBeInTheDocument()
        expect(screen.getByText('squirtle')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  describe("When clicking the 'Load more' button", () => {
    it("shows loading text", async () => {
      // const mockedUsePokemons = vi.mocked(usePokemons, true);

      // // Simulando o retorno do hook com as propriedades corretas
      // mockedUsePokemons.mockReturnValue({
      //   data: {
      //     pages: [mockPokemonList],  // Lista de Pokémon simulada
      //     pageParams: [],  // O array de parâmetros da página, vazio nesse caso
      //   },
      //   hasNextPage: true,  // Indica que há mais páginas para carregar
      //   isLoading: false,   // O carregamento terminou
      //   isError: false,     // Não há erro
      //   isSuccess: true,    // A query foi bem-sucedida
      //   isIdle: false,      // A query não está em estado ocioso
      //   error: null,        // Nenhum erro
      //   fetchNextPage: vi.fn(), // Mock da função de buscar a próxima página
      //   refetch: vi.fn(),   // Mock da função de refetch
      //   isPending: false,    // Indica que não está em estado de pendência
      //   isLoadingError: false, // Não há erro de carregamento
      //   isRefetchError: false, // Não há erro de refetch
      //   isFetchNextPageError: false, // Não há erro ao buscar próxima página
      // } as unknown as UseInfiniteQueryResult<any, Error>); // Converte para 'unknown' antes de atribuir ao tipo esperado


      customRender();


      customRender();

      fireEvent.click(screen.getByText('Load more ( + )'));

      await waitFor(() => expect(screen.getByText(/loading.../i)).toBeInTheDocument());
    });

    // it("loads more Pokémon cards", async () => {


    //   customRender()

    //   fireEvent.click(screen.getByText('Load more ( + )'))

    //   await waitFor(() => {
    //     const pokemonCards = screen.getAllByTestId('pokemon-card')
    //     expect(pokemonCards).toHaveLength(12)
    //   })
    // })

    // it("shows an error message when it fails", async () => {


    //   customRender()

    //   fireEvent.click(screen.getByText('Load more ( + )'))

    //   await waitFor(() => {
    //     expect(screen.getByText("Error during loading, try again...")).toBeInTheDocument()
    //   })
    // })
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
      expect(errorMessage).toBeInTheDocument()
      expect(screen.getByText(/try again/i)).toBeInTheDocument()
    })
  })

  describe("When filtering", () => {
    it("displays a message when no Pokémon matches the filter", async () => {
      vi.mocked(useFilter).mockReturnValue({
        filter: 'xyz',
        setFilter: vi.fn(),
        clearFilter: vi.fn()
      })

      customRender()

      await waitFor(() => {
        expect(screen.getByText("No Pokémon found with that name.")).toBeInTheDocument()
      })
    })

    it("displays the correct result when searching for one pokémon", async () => {
      vi.mocked(useFilter).mockReturnValue({
        filter: 'char',
        setFilter: vi.fn(),
        clearFilter: vi.fn()
      })

      customRender()

      await waitFor(async () => {
        const pokemonCards = screen.getAllByTestId('pokemon-card')
        expect(pokemonCards).toHaveLength(1)
        expect(screen.getByText('charmander')).toBeInTheDocument()
      })
    })
  })
})
