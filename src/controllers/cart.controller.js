import mongoCart from "../DAO/MongoDB/cartDAO.js";
import mongoTickets from "../DAO/MongoDB/ticketsDAO.js";
import { makeid } from "../utils.js";
import {transporter} from "../services/mailing.js"
import config from "../configs/config.js";

const cartService = new mongoCart();
const ticketsService = new mongoTickets();

const insertProduct = async (req, res) => {
    const user = req.user;
    const productId = req.params.id;
    const cart = await cartService.getCartById(user.cart); 
     const exists = cart.productos.find(
      (product) => product._id.toString() === productId
    );
    if(exists) {
      cart.productos[exists] = {
          ...exists,
          cantidad: exists.cantidad++
      };
      await cartService.updateCart(cart._id, {productos:cart.productos});
      res.redirect('/cart');
  } else {
    cart.productos.push({ _id: productId });
    console.log(cart.productos)
    await cartService.updateCart(cart._id,{productos:cart.productos});
    res.redirect("/cart");
  }
};

const purchase = async (req, res) => {
  const user = req.user
  const cart = await cartService.getCartById(user.cart);
  const populateCart = await cartService.getCartById(user.cart,{populate:true})
  const ticket = {
    user: user._id,
    productos: cart.productos,
    total: populateCart.productos.reduce((previous,current)=>previous+current._id.price,0),
    code: makeid(14)
  };
  await cartService.updateCart(cart._id, { productos: [] });
  await ticketsService.createTicket(ticket);
  const result = await transporter.sendMail({
    from:`Cap store <enzov7511@gmail.com>`,
    to:[config.nodemailer.PWD,user.email],
    subject:`Tu orden ${user.name}`,
    html:`
    <div>
      <p>Orden: ${ticket.code}</p>
      <p>Fecha: ${Date.toString()}</p>
      <p>productos: ${ticket.productos}</p>
      <p>total: ${ticket.total}</p>
    </div>
    `
  })
  res.redirect('/ticket');
};

export default {
  insertProduct,
  purchase,
};
