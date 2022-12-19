import { Router } from "express";
import context from "../contexts/cartContext.js"
import __dirname from "../utils.js";

let router = new Router();
let contenedor = new context(__dirname + "/files/cart.json")

//crear nuevo carrito
router.post("/",async(req,res,next)=>{
    try {
        let cart = await contenedor.newCart()
        return cart
    } catch (error) {
        console.log(error)
    }
})

//traer el carrito
router.get("/", async(req,res,next)=>{
    try {
        let carts = await contenedor.getCarts();
        res.send(carts)
    } catch (error) {
        console.log(error)
    }
})

//borrar un carrito
router.delete("/:id", async(req,res,next)=>{
    try {
        let idDelete = req.params.id;
        await contenedor.deleteCart(idDelete);
        console.log("carrito eliminado con exito");
    } catch (error) {
     console.log(error)   
    }
})
export default router