import jwt from "jsonwebtoken";
import { secret } from "../config/environment/index.js";

export const authMiddleware = (req, _res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    jwt.verify(
      req.headers.authorization?.split(" ")[1],
      secret.jwtSecret,
      (err, payload) => {
        if (err) {
          req.authError = err.message;
        } else {
          req.auth = payload;
        }
      }
    );
  }

  next();
};
