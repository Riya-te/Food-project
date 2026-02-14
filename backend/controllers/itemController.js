import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadCloudinary from "../config/cloudinary.js";

/**
 * CREATE ITEM
 * Only shop owner can add items
 */
export const createItem = async (req, res) => {
  try {
    const { name, price, category, foodType, shopId, imageUrl } = req.body;

    if (!name || !price || !category || !foodType || !shopId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // 🔐 Only owner can add items
    if (shop.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add items to this shop",
      });
    }

    let image;

    // ✅ CASE 1: FILE UPLOAD
    if (req.file) {
      const cloudinaryRes = await uploadCloudinary(
        req.file.path,
        "items"
      );
      image = cloudinaryRes.url;
    }

    // ✅ CASE 2: IMAGE URL
    else if (imageUrl) {
      image = imageUrl;
    }

    // ❌ NO IMAGE
    else {
      return res.status(400).json({
        success: false,
        message: "Item image is required",
      });
    }

    const item = await Item.create({
      name,
      image,
      shop: shopId, // ✅ matches schema
      category,
      foodType,
      price: Number(price),
    });

    res.status(201).json({
      success: true,
      message: "Item created successfully",
      item,
    });
  } catch (error) {
    console.error("Create item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create item",
    });
  }
};


/**
 * EDIT ITEM
 */
export const editItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, price, category, foodType, isAvailable } = req.body;

    const item = await Item.findById(itemId).populate("shop");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // 🔐 Only shop owner
    if (item.shop.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (name) item.name = name;
    if (price !== undefined) item.price = price;
    if (category) item.category = category;
    if (foodType) item.foodType = foodType;
    if (isAvailable !== undefined)
      item.isAvailable = isAvailable;

    if (req.file) {
      const cloudinaryRes = await uploadCloudinary(
        req.file.path,
        "items"
      );
      item.image = cloudinaryRes.url;
    }

    await item.save();

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      item,
    });
  } catch (error) {
    console.error("Edit item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update item",
    });
  }
};

/**
 * DELETE ITEM
 */
export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findById(itemId).populate("shop");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.shop.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
    });
  }
};

/**
 * GET ITEMS BY SHOP (PUBLIC)
 */
export const getItemsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const items = await Item.find({
      shop: shopId,
      isAvailable: true,
    });

    res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch items",
    });
  }
};
