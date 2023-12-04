import { authMutation } from "./user_auth_manage/mutation.js";

const resolvers = {
  Query: {
    test: (_root, _args, { userId }) =>
      `Hello from server this is id ${userId}`,
  },
  Mutation: {
    ...authMutation,
  },
};

export default resolvers;
