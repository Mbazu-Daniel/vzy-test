import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const paymentStatuses = ["pending", "paid", "failed", "refunded"];

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    paymentTransactionId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: paymentStatuses,
      default: "pending",
    },
    image: {
      type: String,
    },
    address: {
      type: Object,
    },
    phone: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model("User", UserSchema);
