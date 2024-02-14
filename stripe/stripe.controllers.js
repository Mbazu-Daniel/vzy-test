import stripe from "stripe";
import asyncHandler from "express-async-handler";
import User from "../users/users.models.js";
import dotenv from "dotenv";
dotenv.config();

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// handle charge creation
const createCharge = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { amount, source } = req.body;
  const stripeClient = stripe(req.stripeApiKey);

  try {
    const charge = await stripeClient.charges.create({
      amount,
      currency: "usd",
      source,
      description: "Charge test",
    });

    // Update user paymentTransactionId
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { paymentTransactionId: charge.id },
      { new: true }
    );

    if (!updatedUser) {
      console.log("User not found for userId:", userId);
    } else {
      console.log(
        "User paymentTransactionId updated successfully:",
        updatedUser
      );
    }

    res.status(200).json("Payment successful");
  } catch (error) {
    console.error("Error in processing payment", error);

    let msg = "An error occurred while processing your payment";

    if (error.type === "StripeCardError") {
      msg = error.message;
    }
    res.status(500).json("Payment unsuccessful", msg);
  }
});

// handle webhook event
const webhookController = async (req, res) => {
  let event;

  if (endpointSecret) {
    const sig = req.headers["stripe-signature"];


    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(400).json(`Webhook Error: ${error.message}`);
      return;
    }
  }
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const user = await User.findOneAndUpdate(
        { paymentTransactionId: paymentIntent.id },
        { paymentStatus: "paid" },
        { new: true }
      );

      if (!user) {
        console.log("No transaction done for this user:");
      } else {
        console.log("User payment status updated successfully:");
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const chargeFailed = event.data.object;

      console.log("Payment failed for chargeSucceeded:", chargeFailed.id);
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).end();
};

export { createCharge, webhookController };
