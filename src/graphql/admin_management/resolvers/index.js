import {
  adminManageMutations,
  adminManageQueries,
} from "./admin_manage/index.js";

const resolvers = {
  Query: {
    ...adminManageQueries,
  },

  Mutation: {
    ...adminManageMutations,
  },
};

export default resolvers;
