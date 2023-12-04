import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;

// You may use this as a boolean value for different situations
const env = {
  development: process.env.NODE_ENV === "development",
  test: process.env.NODE_ENV === "test",
  production: process.env.NODE_ENV === "production",
};

const mongo = {
  url: process.env.MONGO_URI,
};

const secret = {
  jwtSecret: process.env.JWT_SECRET, // This is the default JWT Secret if not set in .
};

export { port, env, mongo, secret };
