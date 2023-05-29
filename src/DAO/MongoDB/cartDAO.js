import cartModel from "./models/cartModel.js";
import { logger } from "../../middleware/logger.js";

export default class cartsDao {
  getCartById = (id, options = {}) => {
    try {
      if (options.populate)
        return cartModel.findOne({ _id: id }).populate('productos._id').lean();
      return cartModel.findOne({ _id: id }).lean();
    } catch (error) {
      logger.warn(`error en el getCartById: ${error}`);
    }
  };

  createCart = () => {
    try {
      const cart = cartModel.create({ productos: [] });
      return cart;
    } catch (error) {
      logger.warn(`error en createCart: ${error}`);
    }
  };

  deleteCart = async (id) => {
    try {
      await cartModel.findByIdAndDelete({ _id: id });
    } catch (error) {
      logger.warn(`error en el deleteCart ${error}`);
    }
  };

  updateCart = async (id, cart) => {
    try {
      return await cartModel.findByIdAndUpdate(id,{$set:cart})
    } catch (error) {
      logger.warn(`error en el updateCart ${error}`);
    }
  };
}
