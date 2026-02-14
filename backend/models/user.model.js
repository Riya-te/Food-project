import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      minlength: 6,
      select: false,
      required: function () {
        return this.provider === "local"; // ✅ only for email/password users
      },
    },

    mobile: {
      type: String,
      unique: true,
      sparse: true, // ✅ allows multiple null values
    },

    role: {
      type: String,
      enum: ["user", "owner", "deliveryBoy"],
      default: "user",
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
    },

    avatar: {
      type: String,
    },

    resetOtp: String,
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    otpExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
