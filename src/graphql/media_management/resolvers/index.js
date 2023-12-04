import { mediaMutations, mediaQuery } from "./media_operations/index.js";

const resolvers = {
  Query: {
    ...mediaQuery,
  },
  Mutation: {
    ...mediaMutations,
  },
};

export default resolvers;
