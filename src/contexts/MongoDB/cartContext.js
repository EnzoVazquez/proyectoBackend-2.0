import mongoose from "mongoose";
import cartModel from "../../models/cartModel.js";
import { logger } from "../../middleware/logger.js";
import productModel from "../../models/productsModel.js";

class cartContext {

  async createCart(email) {
    try {
      const cart = { usuario: email, productos: [] };
      await cartModel.create(cart);
      return await cartModel.find(cart)._id;
    } catch (error) {
      logger.warn(`error en createCart: ${error}`);
    }
  }

  async getCart(email) {
    try {
      const cart = await cartModel.findOne({ usuario: email });
      return cart;
    } catch (error) {
      logger.warn(`error en getCart: ${error}`);
    }
  }

  async deleteById(id) {
    try {
      await cartModel.findByIdAndDelete({ _id: id });
      return console.log({ status: success, message: "carrito borrado" });
    } catch (error) {
      logger.warn(`error en deleteById: ${error}`);
    }
  }

  async saveProduct(idCart, idProduct) {
    try {
      const cart = await cartModel.findById({ _id: idCart });
      const product = await productModel.findById({ _id: idProduct });
      const existIn = cart.productos.some((item) => item._id === product._id);
      existIn
        ? console.log("producto ya existente en el carrito")
        : cart.productos.push(product);
      await cartModel.updateOne({ _id: idCart }, { productos: cart.productos });
      return console.log({ status: success, message: "producto agregado" });
    } catch (error) {
      logger.warn(`error en saveProduct: ${error}`);
    }
  }

  async deleteProduct(idCart, idProduct) {
    try {
      const cart = await cartModel.findById({ _id: idCart });
      const product = await productModel.findById({ _id: idProduct });
      const existIn = cart.productos.some((item) => item._id === product._id);
      if (existIn) {
        const indice = cart.productos.indexOf(product);
        cart.productos.splice(indice, 1);
        await cartModel.updateOne(
          { _id: idCart },
          { productos: cart.productos }
        );
      } else {
        logger.warn(
          `error en saveProduct: el producto no existe en el carrito`
        );
      }
    } catch (error) {
      logger.warn(`error en deleteProduct: ${error}`);
    }
  }

  async getProducts(id){
    try {
      const cart = await cartModel.findById({_id : id})
      const listado = cart.productos
      return listado
    } catch (error) {
      logger.warn(`error en el getProducts: ${error}`)
    }
  }
}

export default cartContext;
