import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import {executePolicies} from '../middleware/login.js'

const router = new Router();

router.get('/:id',executePolicies(["AUTHENTICATED"]),cartController.insertProduct)
router.post('/purchase',executePolicies(["AUTHENTICATED"]),cartController.purchase)
router.post('/deleteProduct/:id',executePolicies(["AUTHENTICATED"]),cartController.deleteProduct)

export default router