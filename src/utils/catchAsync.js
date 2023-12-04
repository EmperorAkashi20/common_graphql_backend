import { GraphQLError } from "graphql";
import logger from "../winston/index.js";

export const catchAsync =
  (fn, service) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      logger.error(service);
      logger.error(error.message);
      logger.error(error.stack);
      throw new GraphQLError(error.message, {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  };
