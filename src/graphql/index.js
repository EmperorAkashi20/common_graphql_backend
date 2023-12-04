import { ApolloServer } from "@apollo/server";
import userManagementSchema from "./user_management/schema/index.js";
import mediaManagementSchema from "./media_management/schema/index.js";
import adminManagementSchema from "./admin_management/schema/index.js";

export const userManagementServer = new ApolloServer({
  schema: userManagementSchema,
});

export const mediaManagementServer = new ApolloServer({
  schema: mediaManagementSchema,
});

export const adminManagementServer = new ApolloServer({
  schema: adminManagementSchema,
});
