import mongoose from "mongoose";

const shopOrderItemsSchema=new mongoose.Schema({
items:{
     
     type:mongoose.Schema.Types.ObjectId,
        ref:"Item",
     },
     price:Number,
    quantity:Number,

},{timeStamps:true})

const ShopOrderSchema= new mongoose.Schema({
    shop:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"Shop",
    },
    owner:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    subTotal:Number,
    shopOrderItems:[shopOrderItemsSchema]
},{timeStamps:true})

const orderSchema =new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",

    },
    paymentMethod:{
        type:String,
        enum:['cod',"online"],
        required:true
    },
    deliveryAddress:{
        text:String,
        latitude:Number,
        longitude:Number
    },
    totalAmount:{
        type:Number,

    },
    shopOrder:[ShopOrderSchema]

},{timeStamps:true})

const Order=mongoose.model("Order",orderSchema);

export default Order;