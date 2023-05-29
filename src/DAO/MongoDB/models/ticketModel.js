import mongoose from "mongoose";

const collection = "Tickets";

const schema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "users",
  },
  products: [
    {
      _id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "productos",
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    unique: true,
  },
});

const ticketModel = mongoose.model(collection, schema);

export default ticketModel;
