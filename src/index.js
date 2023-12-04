import app from "./app.js";
import { port, mongo } from "./config/environment/index.js";
import mongoose from "./db/index.js";
import logger from "./winston/index.js";
import {
  userManagementServer,
  mediaManagementServer,
  adminManagementServer,
} from "./graphql/index.js";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";

async function getContext({ req }) {
  if (req.auth) {
    const { userId, role } = req.auth;
    return { userId, role };
  } else if (req.authError) {
    const { authError } = req;
    return { authError };
  } else {
    return {};
  }
}

const start = async () => {
  try {
    app.listen(port);
    await mongoose.connect(mongo.url);
    await userManagementServer.start();
    await mediaManagementServer.start();
    await adminManagementServer.start();

    app.use(
      "/userManagement",
      apolloMiddleware(userManagementServer, { context: getContext })
    );
    app.use(
      "/mediaManagement",
      apolloMiddleware(mediaManagementServer, { context: getContext })
    );

    app.use(
      "/adminManagement",
      apolloMiddleware(adminManagementServer, { context: getContext })
    );
  } catch (err) {
    logger.error(err);
    logger.info("Not able to run GraphQL server");
  }
};

start();
