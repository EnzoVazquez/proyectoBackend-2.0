import cartsDao from "../DAO/MongoDB/cartDAO.js";
import productsDao from "../DAO/MongoDB/productsDAO.js";
import config from "../configs/config.js";

const cartService = new cartsDao();
const productService = new productsDao();

const login = async (req, res) => {
  res.render("login");
};

const register = async (req, res) => {
  res.render("register");
};

const main = async (req, res) => {
  res.render("inicio", { user: req.user });
};

const addProduct = async (req, res) => {
  res.render("addProduct");
};

const products = async (req, res) => {
  let stock = await productService.getProducts();
  console.log(stock);
  res.render("products", { stock });
};

const logout = async (req, res) => {
  res.render("logout", { user: req.user });
  res.cookie(config.jwt.COOKIE, "", { expires: new Date(0) });
  if (!req.user) return console.log("sesion terminada!");
};

const cart = async (req, res) => {
  const cartId = req.user.cart;
  const cart = await cartService.getCartById(cartId, { populate: true });
  console.log(cart.productos);
  const products = cart.productos.map((product) => ({
    ...product._id,
    cantidad: product.cantidad,
  }));
  const totalPrice = await products.reduce(
    (acum, product) => acum + product.price * product.cantidad,
    0
  );
  console.log(totalPrice);
  res.render("cart", { user: req.user, products, totalPrice });
};

const profile = async (req, res) => {
  res.render("profile", { user: req.user });
};

const ticket = async (req, res) => {
  res.render("ticket", { user: req.user });
};

export default {
  login,
  register,
  main,
  addProduct,
  products,
  cart,
  profile,
  ticket,
  logout
};
