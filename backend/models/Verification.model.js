import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["email_verification", "password_reset"],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export const VerificationCode = mongoose.model(
  "VerificationCode",
  verificationSchema
);