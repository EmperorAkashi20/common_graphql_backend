import { authMutation } from "./user_auth_manage/mutation.js";
import { profileMutation } from "./user_profile_manage/mutation.js";
import { profileQueries } from "./user_profile_manage/query.js";

const resolvers = {
  Query: {
    test: (_root, _args, { userId }) =>
      `Hello from server this is id ${userId}`,
    ...profileQueries,
  },
  Mutation: {
    ...authMutation,
    ...profileMutation,
  },
};

export default resolvers;
