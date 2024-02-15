import express from "express";
import { createCharge, webhookController } from "./stripe.controllers.js";
import stripeAuthMiddleware from "../middleware/stripeAuth.js";
import { authenticateUser } from "../middleware/authenticate.js";
import bodyParser from "body-parser";
const stripeRouter = express.Router();

const app = express();

app.use(
  "/stripe",
  stripeRouter

  // #swagger.tags = ["Stripe"]
);

stripeRouter.post(
  "/charge",
  authenticateUser,
  stripeAuthMiddleware,
  createCharge
);

// Route for handling webhook events
stripeRouter.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),

  webhookController

  // #swagger.ignore = true
);

export default stripeRouter;
