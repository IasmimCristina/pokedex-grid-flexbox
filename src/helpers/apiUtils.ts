import { ERROR_MESSAGES } from "./constants";

export const simulateError = (): void => {
  if (Math.random() < 0.5) {
    throw new Error(ERROR_MESSAGES.RANDOM_API_FAILURE);
  }
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
