import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String,
    default: null
  },
  settings: {
    type: {
      background: {
        image: { type: String, default: null },
        size: { type: String, enum: ['cover', 'contain', 'auto'], default: 'cover' },
        position: { type: String, default: 'center' },
        attachment: { type: String, enum: ['fixed', 'scroll'], default: 'fixed' }
      },
      // theme: { type: String, default: 'light' },
      // notifications: { type: Object, default: {} },
      // language: { type: String, default: 'en' },
      // privacy: { type: Object, default: {} }
    },
    default: {
      background: {
        image: null,
        size: 'cover',
        position: 'center',
        attachment: 'fixed'
      }
    }
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  plan: {
    type: String,
    default: "free"
  },
  stripeCustomerId: {
    type: String,
    default: null
  },

  stripeSubscriptionId: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);