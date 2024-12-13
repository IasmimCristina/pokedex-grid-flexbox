import "@testing-library/jest-dom/vitest";
import { afterEach, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { setupServer } from "msw/node";
import { pokemonHandlers } from "../mocks/handlers";

export const server = setupServer(...pokemonHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

afterEach(() => {
  cleanup(); // cleans DOM after each test
  server.resetHandlers();
});

afterAll(() => server.close());
