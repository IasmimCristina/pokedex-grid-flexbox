import { screen, waitFor } from '@testing-library/react'
import PokemonList from '../components/PokemonList'
import { describe, expect, vi } from 'vitest'
import { renderWithProviders } from '../tests/setup'

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

  // it('displays an error message when fetching fails', async () => {
  //   server.use(
  //     http.get(POKEMON_API_URL, () => {
  //       return new Response(null, { status: 500 })
  //     })
  //   )

  //   customRender()

  //   const errorMessage = await screen.findByText(ERROR_MESSAGES.FETCH_ERROR)
  //   expect(errorMessage).toBeInTheDocument()
  //   expect(screen.getByText(/try again/i)).toBeInTheDocument()
  // })

  // it("displays empty results when no Pokémon matches the filter", async () => {
  //   customRender(<PokemonList />);

  //   await screen.findByTestId("pokemon-card");

  // });
})
