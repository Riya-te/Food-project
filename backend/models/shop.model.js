import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    city: {
      type: String,
      required: true,
      index: true,
    },

    state: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },


    items:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Item"
    }],
    // 🌍 GEO LOCATION (IMPORTANT)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: false
      },
    },
  },
  { timestamps: true }
);

// 🔥 REQUIRED FOR GEO QUERIES
shopSchema.index({ location: "2dsphere" });

export default mongoose.model("Shop", shopSchema);
