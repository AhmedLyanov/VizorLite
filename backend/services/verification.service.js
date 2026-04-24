import { VerificationCode } from "../models/Verification.model.js";
import crypto from "crypto";

export const generateVerificationCode = async (userId, type) => {
  const code = crypto.randomInt(100000, 999999).toString();

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await VerificationCode.deleteMany({ userId, type });

  const record = await VerificationCode.create({
    userId,
    code,
    type,
    expiresAt,
  });

  return code;
};

export const verifyCode = async (userId, code, type) => {
  const record = await VerificationCode.findOne({
    userId,
    code,
    type,
  });

  if (!record) return false;

  if (record.expiresAt < new Date()) return false;

  await VerificationCode.deleteOne({ _id: record._id });

  return true;
};