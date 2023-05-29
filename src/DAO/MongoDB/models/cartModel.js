import mongoose from "mongoose";

const collection = "carts";

const schema = new mongoose.Schema({
  productos: [
    {
      _id:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'productos',
      },
      cantidad: {
        type: Number,
        default: 1,
      },
    },
  ],
});

mongoose.set("strictQuery", true);

const cartModel = mongoose.model(collection, schema);

export default cartModel;
