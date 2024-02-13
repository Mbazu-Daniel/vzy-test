import dotenv from "dotenv"
dotenv.config()

const stripeAuthMiddleware = (req, res, next) => {
  req.stripeApiKey = process.env.STRIPE_SECRET_KEY;
  next();
};

export default stripeAuthMiddleware;
