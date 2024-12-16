import '@testing-library/jest-dom/vitest'
import { afterEach, beforeAll, afterAll } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { pokemonHandlers } from '../mocks/handlers'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FilterProvider } from '../contexts/FilterProvider'

export const server = setupServer(...pokemonHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))

afterEach(() => {
  cleanup() // cleans DOM after each test
  server.resetHandlers()
})

afterAll(() => server.close())

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

export const renderWithProviders = (children: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <FilterProvider>{children}</FilterProvider>
    </QueryClientProvider>
  )
}
