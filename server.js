import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./auth/auth.routes.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

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

const PORT = process.env.PORT;

app.listen(PORT, () => {
	connectDB();
	console.log(`Server is running  at PORT ${PORT}`);
});
