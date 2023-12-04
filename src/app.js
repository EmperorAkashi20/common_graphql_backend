import express from "express";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import morgan from "morgan";
import { authMiddleware } from "./middlewares/index.js";
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // Limit each IP to 30 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(limiter);

app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  })
);

app.use(cors());

app.use((req, res, next) => {
  authMiddleware(req, res, next);
});

app.use(express.json());

export default app;
