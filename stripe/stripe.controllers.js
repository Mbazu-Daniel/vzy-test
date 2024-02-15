import stripe from "stripe";
import asyncHandler from "express-async-handler";
import User from "../users/users.models.js";
import dotenv from "dotenv";
dotenv.config();

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// handle charge creation
const createCharge = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    // Ensure req.stripeApiKey is properly set
    const stripeClient = stripe(req.stripeApiKey);

    const charge = await stripeClient.charges.create({
      amount,
      currency: "usd",
      source: "tok_visa",
      description: "Charge test",
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { paymentTransactionId: charge.id },
      { new: true }
    );

    if (!updatedUser) {
      console.log("User not found for userId:", userId);
      return res.status(500).json({ error: "User not found" });
    }

    console.log("User paymentTransactionId updated successfully:", updatedUser);
    res.status(200).json({ message: "Payment successful" });
  } catch (error) {
    console.error("Error in processing payment", error);
    let msg = "An error occurred while processing your payment";
    if (error.type === "StripeCardError") {
      msg = error.message;
    }
    res.status(500).json({ error: msg });
  }
});

// handle webhook event
const webhookController = async (req, res) => {
  let event;

  if (endpointSecret) {
    const sig = req.headers["stripe-signature"];
    console.log("🚀 ~ webhookController ~ sig:", sig)

    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(400).json(`Webhook Error: ${error.message}`);
      return;
    }
  }
  switch (event.type) {
    case "charge.succeeded": {
      const chargeDetails = event.data.object;
      const user = await User.findOneAndUpdate(
        { paymentTransactionId: chargeDetails.id },
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
    case "charge.failed": {
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
