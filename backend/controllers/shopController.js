import Shop from "../models/shop.model.js";
import Item from "../models/item.model.js";
import uploadCloudinary from "../config/cloudinary.js";
import fs from "fs";

/* ================= GET NEARBY SHOPS (PUBLIC) ================= */
export const getNearbyShops = async (req, res) => {
  try {
    const { lat, lng, limit = 10 } = req.query;

    let query = {};

    // 🌍 If coordinates provided, use geospatial query
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: 50000, // 50km radius
        },
      };
    }

    // ✅ Fetch shops
    const shops = await Shop.find(query)
      .limit(Number(limit))
      .select("_id name image city state address owner location");

    // ✅ Fetch items for each shop
    const shopsWithItems = await Promise.all(
      shops.map(async (shop) => {
        const items = await Item.find({ shop: shop._id, isAvailable: true })
          .limit(5)
          .select("_id name image price category foodType");

        return {
          ...shop.toObject(),
          items,
        };
      })
    );

    res.status(200).json({
      success: true,
      shops: shopsWithItems,
    });
  } catch (error) {
    console.error("Get nearby shops error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch shops",
    });
  }
};

/* ================= CREATE SHOP ================= */
export const createShop = async (req, res) => {
  try {
    const { name, city, state, address, lat, lng, imageUrl } = req.body;

    if (!name || !city || !state || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ FIX: use req.user.id
    const exists = await Shop.findOne({ owner: req.user.id });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "You already have a shop",
      });
    }

    let image;

    // FILE upload
    if (req.file) {
      const cloudinaryRes = await uploadCloudinary(req.file.path, "shops");
      image = cloudinaryRes.url;
      fs.unlinkSync(req.file.path);
    }
    // URL upload
    else if (imageUrl) {
      image = imageUrl;
    } else {
      return res.status(400).json({
        success: false,
        message: "Shop image is required",
      });
    }

    const shop = await Shop.create({
      name,
      image,
      owner: req.user.id, // ✅ FIX
      city,
      state,
      address,
      location:
        lat && lng
          ? {
              type: "Point",
              coordinates: [Number(lng), Number(lat)],
            }
          : {
              type: "Point",
              coordinates: [0, 0], // fallback
            },
    });

    res.status(201).json({
      success: true,
      shop,
    });
  } catch (error) {
    console.error("Create shop error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create shop",
    });
  }
};

/* ================= EDIT SHOP ================= */
export const editShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { name, city, state, address, lat, lng, imageUrl } = req.body;

    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    // ✅ FIX: safe comparison
    if (String(shop.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (name) shop.name = name;
    if (city) shop.city = city;
    if (state) shop.state = state;
    if (address) shop.address = address;

    if (lat && lng) {
      shop.location = {
        type: "Point",
        coordinates: [Number(lng), Number(lat)],
      };
    }

    if (req.file) {
      const cloudinaryRes = await uploadCloudinary(req.file.path, "shops");
      shop.image = cloudinaryRes.url;
      fs.unlinkSync(req.file.path);
    } else if (imageUrl) {
      shop.image = imageUrl;
    }

    await shop.save();

    res.json({ success: true, shop });
  } catch (error) {
    console.error("Edit shop error:", error);
    res.status(500).json({ message: "Failed to update shop" });
  }
};

/* ================= GET MY SHOP ================= */
export const getMyShop = async (req, res) => {
  try {
    // ✅ FIX: use req.user.id
    const shop = await Shop.findOne({ owner: req.user.id }).populate("owner");

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "You do not have a shop yet",
      });
    }

    // ✅ FIX: Also fetch items for this shop
    const items = await Item.find({ shop: shop._id });

    res.json({ success: true, shop, items });
  } catch (error) {
    console.error("Get my shop error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch shop",
    });
  }
};


/* ================= GET SHOPS BY CITY (PUBLIC) ================= */
export const getShopsByCity = async (req, res) => {
  try {
    const { city, limit = 10 } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    console.log(`🔍 Searching shops for city: "${city}"`);

    // 🔍 Case-insensitive city search with trimming
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city.trim()}$`, "i") },
    })
      .limit(Number(limit))
      .select("_id name image city state address owner location");

    console.log(`✅ Found ${shops.length} shops in "${city}"`);

    // 🧺 Attach items to each shop
    const shopsWithItems = await Promise.all(
      shops.map(async (shop) => {
        const items = await Item.find({
          shop: shop._id,
          isAvailable: true,
        })
          .limit(5)
          .select("_id name image price category foodType");

        return {
          ...shop.toObject(),
          items,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: shopsWithItems.length,
      shops: shopsWithItems,
      debug: {
        searchCity: city,
        foundCount: shopsWithItems.length,
      },
    });
  } catch (error) {
    console.error("❌ Get shops by city error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch shops by city",
      error: error.message,
    });
  }
};

/* ================= GET SHOPS BY STATE (PUBLIC) ================= */
export const getShopsByState = async (req, res) => {
  try {
    const { state, limit = 10 } = req.query;

    if (!state) {
      return res.status(400).json({
        success: false,
        message: "State is required",
      });
    }

    console.log(`🔍 Searching shops for state: "${state}"`);

    // 🔍 Case-insensitive state search with trimming
    const shops = await Shop.find({
      state: { $regex: new RegExp(`^${state.trim()}$`, "i") },
    })
      .limit(Number(limit))
      .select("_id name image city state address owner location");

    console.log(`✅ Found ${shops.length} shops in state "${state}"`);

    // 🧺 Attach items to each shop
    const shopsWithItems = await Promise.all(
      shops.map(async (shop) => {
        const items = await Item.find({
          shop: shop._id,
          isAvailable: true,
        })
          .limit(5)
          .select("_id name image price category foodType");

        return {
          ...shop.toObject(),
          items,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: shopsWithItems.length,
      shops: shopsWithItems,
      debug: {
        searchState: state,
        foundCount: shopsWithItems.length,
      },
    });
  } catch (error) {
    console.error("❌ Get shops by state error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch shops by state",
      error: error.message,
    });
  }
};
