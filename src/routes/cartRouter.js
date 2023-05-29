import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import {executePolicies} from '../middleware/login.js'

const router = new Router();

router.get('/:id',executePolicies(["AUTHENTICATED"]),cartController.insertProduct)
router.post('/purchase',executePolicies(["AUTHENTICATED"]),cartController.purchase)

export default router