import jwt from "jsonwebtoken";
import { createError } from "../utils/errors.js";
import dotenv from "dotenv";
dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (error, user) => {
    if (error) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

const authenticateUser = (req, res, next) => {
  const token = req.cookies.access_token;

  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_SECRET_TOKEN,
      (error, decodedToken) => {
        if (error) {
          res.status(403).json({ message: "Unauthorized" });
          console.log(error);
        } else {
          req.user = decodedToken;
          next();
        }
      }
    );
  } else {
    res.status(403).json({ message: "You're not logged in" });
  }
};

export { verifyToken, authenticateUser };
