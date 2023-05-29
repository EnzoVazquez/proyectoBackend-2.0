import { Router } from "express";
import __dirname from "../utils.js"
import viewsController from '../controllers/views.controllers.js'
import {executePolicies} from '../middleware/login.js'

let router = new Router();

router.get('/',viewsController.login);

router.get("/register",viewsController.register);

router.get("/main",executePolicies(["AUTHENTICATED"]),viewsController.main);

router.get("/addProduct",executePolicies(["AUTHENTICATED"]),viewsController.addProduct);

router.get("/products",executePolicies(["AUTHENTICATED"]),viewsController.products);

router.get('/cart',executePolicies(["AUTHENTICATED"]),viewsController.cart);

router.get('/logout', viewsController.logout);

router.get('/profile',executePolicies(["AUTHENTICATED"]), viewsController.profile);

router.get('/ticket',executePolicies(["AUTHENTICATED"]),viewsController.ticket)

export default router