import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

// ROUTES
import authRouter from "./auth/auth.routes.js";
import userRouter from "./users/users.routes.js";
import stripeRouter from "./stripe/stripe.routes.js";

// other local imports
import connectDB from "./config/db.js";
import { invalidURL, errorHandler } from "./utils/errors.js";
import swaggerDocument from "./swagger.json" assert { type: "json" };

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(bodyParser.raw({ type: "application/json" }));

app.use(cors());
app.use(cookieParser());
app.use(cors());

// compress using gzip
app.use(compression());

// Helmet for setting secure HTTP headers
app.use(helmet());

// Morgan for HTTP request logging
app.use(morgan("dev"));

// HEALTH CHECKER

app.get("/", (req, res) => {
  res.send("API is Healthy");
});

// Swagger UI
// Swagger UI
app.use("/docs", swaggerUi.serve);
app.get("/docs", swaggerUi.setup(swaggerDocument));

// ENDPOINTS
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/stripe", stripeRouter);

// ERROR CHECKER
app.use(invalidURL);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running  at PORT ${PORT}`);
});
