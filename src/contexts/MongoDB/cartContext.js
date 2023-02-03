import mongoose from "mongoose";
import cartModel from "../../models/cartModel.js";

//string de conexion
const connection = mongoose.connect(
    "mongodb+srv://enzo:coder123@clustercoderback.a4dyco9.mongodb.net/?retryWrites=true&w=majority",
    (error) => {
      if (error) console.log(error);
      else console.log("base conectada");
    }
);

class contenedor{

    //traer los carritos
    getCarts = async() =>{

    }
}