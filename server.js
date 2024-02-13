import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

// ROUTES
import authRouter from "./auth/auth.routes.js";
import userRouter from "./users/users.routes.js";
import stripeRouter from "./stripe/stripe.routes.js";

// other local imports
import { invalidURL, errorHandler } from "./utils/errors.js";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// HEALTH CHECKER

app.get("/", (req, res) => {
	res.send("API is Healthy");
});

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
