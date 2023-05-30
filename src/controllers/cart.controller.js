import mongoCart from "../DAO/MongoDB/cartDAO.js";
import mongoTickets from "../DAO/MongoDB/ticketsDAO.js";
import mongoProducts from "../DAO/MongoDB/productsDAO.js";
import { makeid } from "../utils.js";
import { transporter } from "../services/mailing.js";
import config from "../configs/config.js";
import { DateTime } from "luxon";

const cartService = new mongoCart();
const ticketsService = new mongoTickets();
const productService = new mongoProducts();

const insertProduct = async (req, res) => {
  const user = req.user;
  const productId = req.params.id;
  const cart = await cartService.getCartById(user.cart);
  const exists = cart.productos.find(
    (product) => product._id.toString() === productId
  );
  if (exists) {
    cart.productos[exists] = {
      ...exists,
      cantidad: exists.cantidad++,
    };
    await cartService.updateCart(cart._id, { productos: cart.productos });
    res.redirect("/cart");
  } else {
    cart.productos.push({ _id: productId });
    console.log(cart.productos);
    await cartService.updateCart(cart._id, { productos: cart.productos });
    res.redirect("/cart");
  }
};

const purchase = async (req, res) => {
  const user = req.user;
  const cart = await cartService.getCartById(user.cart);
  const populateCart = await cartService.getCartById(user.cart, {
    populate: true,
  });
  const ticket = {
    user: user._id,
    productos: populateCart.productos,
    total: populateCart.productos.reduce(
      (previous, current) => previous + current._id.price * current.cantidad,
      0
    ),
    code: makeid(14),
  };
  await cartService.updateCart(cart._id, { productos: [] });
  await ticketsService.createTicket(ticket);
  let items = "";
  console.log(cart.productos);
  for (const producto of populateCart.productos) {
    items += `<div> <h2>${producto._id.title}</h2><h2>$ ${producto._id.price}</h2><h2>Quantity: ${producto.cantidad}</h2></div>`;
  }
  const result = await transporter.sendMail({
    from: `Cap store <enzov7511@gmail.com>`,
    to: [config.nodemailer.PWD, user.email],
    subject: `Tu orden ${user.name}`,
    html: `
    <div>
      <p>Orden: ${ticket.code}</p>
      <p>Fecha: ${DateTime.now().toLocaleString()}</p>
      <p>productos: ${items}</p>
      <p>total: $${ticket.total}</p>
    </div>
    `,
  });
  res.send({ status: "success", message: "compra realizada con exito" });
};

const deleteProduct = async (req, res) => {
  const user = req.user;
  const product = req.params.id;
  const cart = await cartService.getCartById(user.cart);
  const prodDelete = cart.productos.filter(
    (producto) => producto._id != product
  );
  cart.productos = prodDelete;
  await cartService.updateCart(user.cart, cart);
  return res.redirect("/cart");
};

export default {
  insertProduct,
  purchase,
  deleteProduct,
};
