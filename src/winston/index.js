import { developmentLogger, productionLogger } from "./config.js";

let logger = null;

if (process.env.NODE_ENV == "development") {
  logger = developmentLogger();
}

if (process.env.NODE_ENV == "production") {
  logger = productionLogger();
}

export default logger;