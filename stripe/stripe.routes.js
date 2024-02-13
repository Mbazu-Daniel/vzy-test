import express from "express";
import {
  createCharge,
  webhookController,
  
} from "./stripe.controllers.js";
import stripeAuthMiddleware from "../middleware/stripeAuth.js";
import { authenticateUser } from "../middleware/authenticate.js";
const stripeRouter = express.Router();
stripeRouter.use(authenticateUser, stripeAuthMiddleware);

stripeRouter.post(
  "/charge",

  createCharge
);

// Route for handling webhook events
stripeRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),

  webhookController
);

export default stripeRouter;
