import mongoose from "mongoose";

const collection = 'carritos'

const schema = new mongoose.Schema({
    usuario: {type: String, required:true, unique:true},
    productos: {type: Array, required: true}
});

mongoose.set('strictQuery', true)

const cartModel = mongoose.model(collection, schema);

export default cartModel;