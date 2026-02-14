import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
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

    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true, // 🔥 fast shop queries
    },

    category: {
      type: String,
      enum: [
        "snacks",
        "main_course",
        "desserts",
        "pizza",
        "burgers",
        "sandwiches",
        "south_indian",
        "north_indian",
        "chinese",
        "fast_food",
        "others",
      ],
      required: true,
      index: true,
    },

    price: {
      type: Number,
      min: 0,
      required: true,
    },
    foodType:{
     type:String,
     enum:["veg","Non_veg"],
     required:true
    },

    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
